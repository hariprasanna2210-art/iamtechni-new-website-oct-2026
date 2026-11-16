import crypto from 'crypto';
import { getAdminDb, MissingEnvVariableError } from './_lib/firebaseAdmin.js';
import {
  parseRequestBody,
  type VercelRequestLike,
  type VercelResponseLike,
} from './_lib/http.js';
import { sendCertificateOtpEmail } from './_lib/mailer.js';
import { getClientIp } from './_lib/rateLimit.js';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const EMAIL_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const EMAIL_MAX_REQUESTS = 3;
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const IP_MAX_REQUESTS = 10;
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes

function hashKey(prefix: string, raw: string): string {
  const digest = crypto.createHash('sha256').update(raw).digest('hex');
  return `${prefix}_${digest}`;
}

function checkMissingEnvVars(): string[] {
  const required = [
    'FIREBASE_SERVICE_ACCOUNT',
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
    'OTP_SECRET',
  ] as const;
  const missing: string[] = [];
  for (const name of required) {
    if (!process.env[name]?.trim()) {
      missing.push(name);
    }
  }
  return missing;
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const missingVars = checkMissingEnvVars();
  if (missingVars.length > 0) {
    for (const varName of missingVars) {
      console.error(`[certificate-otp-send] Missing environment variable: ${varName}`);
    }
    return res.status(500).json({ error: 'Verification service is not configured yet.' });
  }

  const parsed = parseRequestBody(req.body);
  if (!parsed.ok || typeof parsed.data !== 'object' || parsed.data === null) {
    return res.status(400).json({ error: 'Invalid request payload.' });
  }

  const body = parsed.data as Record<string, unknown>;
  const certificateId = String(body.certificateId ?? '')
    .trim()
    .toUpperCase();
  const email = String(body.email ?? '')
    .trim()
    .toLowerCase();

  if (!certificateId) {
    return res.status(400).json({ error: 'Certificate ID is required.' });
  }

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const clientIp = getClientIp(req.headers) || req.socket?.remoteAddress || 'unknown';
  const otpSecret = process.env.OTP_SECRET!.trim();

  try {
    const db = getAdminDb();

    // 1. Validate that the certificate exists and is valid
    const certSnap = await db.collection('certificates').doc(certificateId).get();
    if (!certSnap.exists) {
      return res.status(404).json({
        error: 'No certificate found with this number. Please check the number and try again.',
      });
    }

    const certData = (certSnap.data() ?? {}) as Record<string, unknown>;
    if (certData.status === 'revoked') {
      return res.status(400).json({
        error: 'This certificate has been revoked and is no longer valid.',
      });
    }

    // 2. Check and record rate limits in Firestore collection "otpRateLimits"
    const now = Date.now();
    const emailLimitRef = db.collection('otpRateLimits').doc(hashKey('email', email));
    const ipLimitRef = db.collection('otpRateLimits').doc(hashKey('ip', clientIp));

    const rateCheck = await db.runTransaction(async (tx) => {
      const [emailDoc, ipDoc] = await Promise.all([
        tx.get(emailLimitRef),
        tx.get(ipLimitRef),
      ]);

      const emailTimestampsRaw = (emailDoc.data()?.timestamps ?? []) as unknown[];
      const recentEmailTimestamps = emailTimestampsRaw
        .map((t) => Number(t))
        .filter((t) => Number.isFinite(t) && now - t < EMAIL_WINDOW_MS);

      if (recentEmailTimestamps.length >= EMAIL_MAX_REQUESTS) {
        return {
          allowed: false as const,
          reason:
            'Too many verification codes sent to this email. Please wait 15 minutes before requesting another code.',
        };
      }

      const ipTimestampsRaw = (ipDoc.data()?.timestamps ?? []) as unknown[];
      const recentIpTimestamps = ipTimestampsRaw
        .map((t) => Number(t))
        .filter((t) => Number.isFinite(t) && now - t < IP_WINDOW_MS);

      if (recentIpTimestamps.length >= IP_MAX_REQUESTS) {
        return {
          allowed: false as const,
          reason:
            'Too many verification code requests from your network. Please try again later.',
        };
      }

      tx.set(emailLimitRef, {
        type: 'email',
        timestamps: [...recentEmailTimestamps, now],
        updatedAt: now,
      });

      tx.set(ipLimitRef, {
        type: 'ip',
        timestamps: [...recentIpTimestamps, now],
        updatedAt: now,
      });

      return { allowed: true as const };
    });

    if (!rateCheck.allowed) {
      return res.status(429).json({ error: rateCheck.reason });
    }

    // 3. Generate 6-digit OTP and HMAC-SHA256 hash
    const otp = String(crypto.randomInt(100000, 1000000));
    const otpHash = crypto.createHmac('sha256', otpSecret).update(otp).digest('hex');

    // 4. Save otpRequest in Firestore collection "otpRequests"
    const otpRequestRef = await db.collection('otpRequests').add({
      certificateId,
      email,
      otpHash,
      expiresAt: now + OTP_EXPIRY_MS,
      attempts: 0,
      used: false,
      createdAt: now,
      ip: clientIp,
    });

    // 5. Send branded HTML email via Gmail SMTP
    await sendCertificateOtpEmail({
      to: email,
      certificateId,
      otp,
    });

    // Return { requestId } only — NEVER return the OTP
    return res.status(200).json({ requestId: otpRequestRef.id });
  } catch (err: unknown) {
    if (err instanceof MissingEnvVariableError) {
      return res.status(500).json({ error: 'Verification service is not configured yet.' });
    }
    console.error('[certificate-otp-send] Error sending verification OTP:', err);
    return res.status(500).json({
      error: 'Could not send the verification code right now. Please try again.',
    });
  }
}
