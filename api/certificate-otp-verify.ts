import crypto from 'crypto';
import { getAdminDb, MissingEnvVariableError } from './_lib/firebaseAdmin.js';
import {
  parseRequestBody,
  type VercelRequestLike,
  type VercelResponseLike,
} from './_lib/http.js';
import { getClientIp } from './_lib/rateLimit.js';

const MAX_ATTEMPTS = 5;

function toEpochMs(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (
    value &&
    typeof (value as { toMillis?: () => number }).toMillis === 'function'
  ) {
    return (value as { toMillis: () => number }).toMillis();
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  return 0;
}

function checkMissingEnvVars(): string[] {
  const required = ['FIREBASE_SERVICE_ACCOUNT', 'OTP_SECRET'] as const;
  const missing: string[] = [];
  for (const name of required) {
    if (!process.env[name]?.trim()) {
      missing.push(name);
    }
  }
  return missing;
}

function safeCompareHexHashes(hashA: string, hashB: string): boolean {
  try {
    const bufA = Buffer.from(hashA, 'hex');
    const bufB = Buffer.from(hashB, 'hex');
    if (bufA.length === 0 || bufA.length !== bufB.length) {
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
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
      console.error(`[certificate-otp-verify] Missing environment variable: ${varName}`);
    }
    return res.status(500).json({ error: 'Verification service is not configured yet.' });
  }

  const parsed = parseRequestBody(req.body);
  if (!parsed.ok || typeof parsed.data !== 'object' || parsed.data === null) {
    return res.status(400).json({ error: 'Invalid request payload.' });
  }

  const body = parsed.data as Record<string, unknown>;
  const requestId = String(body.requestId ?? '').trim();
  const otp = String(body.otp ?? '').trim();

  if (!requestId || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: 'Please enter the 6-digit verification code.' });
  }

  const clientIp = getClientIp(req.headers) || req.socket?.remoteAddress || 'unknown';
  const userAgentHeader = req.headers?.['user-agent'] ?? req.headers?.['User-Agent'];
  const userAgent = Array.isArray(userAgentHeader)
    ? String(userAgentHeader[0] ?? '')
    : String(userAgentHeader ?? '');
  const otpSecret = process.env.OTP_SECRET!.trim();

  try {
    const db = getAdminDb();
    const otpReqRef = db.collection('otpRequests').doc(requestId);
    const otpSnap = await otpReqRef.get();

    if (!otpSnap.exists) {
      return res.status(400).json({
        error: 'This code has expired. Please request a new one.',
      });
    }

    const reqData = (otpSnap.data() ?? {}) as Record<string, unknown>;
    const used = Boolean(reqData.used);
    const attempts = Number(reqData.attempts ?? 0);
    const expiresAtMs = toEpochMs(reqData.expiresAt);
    const storedHash = String(reqData.otpHash ?? '');
    const certificateId = String(reqData.certificateId ?? '')
      .trim()
      .toUpperCase();
    const email = String(reqData.email ?? '')
      .trim()
      .toLowerCase();

    if (used) {
      return res.status(400).json({
        error: 'This code has expired. Please request a new one.',
      });
    }

    if (attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({
        error: 'Too many attempts. Please request a new code.',
      });
    }

    if (Date.now() > expiresAtMs) {
      return res.status(400).json({
        error: 'This code has expired. Please request a new one.',
      });
    }

    const expectedHash = crypto
      .createHmac('sha256', otpSecret)
      .update(otp)
      .digest('hex');

    const isMatch = safeCompareHexHashes(expectedHash, storedHash);

    if (!isMatch) {
      const nextAttempts = attempts + 1;
      await otpReqRef.update({ attempts: nextAttempts });

      if (nextAttempts >= MAX_ATTEMPTS) {
        return res.status(429).json({
          error: 'Too many attempts. Please request a new code.',
        });
      }

      const remaining = MAX_ATTEMPTS - nextAttempts;
      return res.status(400).json({
        error: `Incorrect code. ${remaining} attempts left.`,
      });
    }

    // Mark OTP as used
    await otpReqRef.update({
      used: true,
      usedAt: Date.now(),
    });

    // Load full certificate with firebase-admin
    const certSnap = await db.collection('certificates').doc(certificateId).get();
    if (!certSnap.exists) {
      return res.status(404).json({
        error: 'No certificate found with this number.',
      });
    }

    const d = (certSnap.data() ?? {}) as Record<string, unknown>;

    // Log verification in collection "certificateVerifications"
    await db.collection('certificateVerifications').add({
      certificateId,
      email,
      verifiedAt: new Date().toISOString(),
      ip: clientIp,
      userAgent,
    });

    const certType =
      d.type === 'course_completion'
        ? 'course_completion'
        : d.type === 'professional'
          ? 'professional'
          : 'student';

    return res.status(200).json({
      certificateId: String(d.certificateId ?? certSnap.id)
        .trim()
        .toUpperCase(),
      fullName: String(d.fullName ?? ''),
      type: certType,
      course: String(d.course ?? ''),
      durationMonths:
        certType === 'course_completion' ? 0 : Number(d.durationMonths ?? 1),
      startDate: String(d.startDate ?? ''),
      endDate: String(d.endDate ?? ''),
      issueDate: String(d.issueDate ?? ''),
      college: String(d.college ?? ''),
      keyAreas: Array.isArray(d.keyAreas)
        ? d.keyAreas.map((item) => String(item)).slice(0, 12)
        : [],
      logo: d.logo === 'aws' ? 'aws' : d.logo === 'custom' ? 'custom' : 'none',
      customLogoUrl: typeof d.customLogoUrl === 'string' ? d.customLogoUrl : '',
      status: d.status === 'revoked' ? 'revoked' : 'valid',
    });
  } catch (err: unknown) {
    if (err instanceof MissingEnvVariableError) {
      return res.status(500).json({ error: 'Verification service is not configured yet.' });
    }
    console.error('[certificate-otp-verify] Error verifying OTP:', err);
    return res.status(500).json({
      error: 'Could not verify the code right now. Please try again.',
    });
  }
}
