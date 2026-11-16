import { getAdminDb, MissingEnvVariableError } from './_lib/firebaseAdmin.js';
import { type VercelRequestLike, type VercelResponseLike } from './_lib/http.js';
import { checkRateLimit, getClientIp } from './_lib/rateLimit.js';

function extractCertificateIdFromRequest(req: VercelRequestLike): string {
  const fromQuery = req.query?.id;
  if (typeof fromQuery === 'string') {
    return fromQuery.trim().toUpperCase();
  }
  if (Array.isArray(fromQuery) && typeof fromQuery[0] === 'string') {
    return fromQuery[0].trim().toUpperCase();
  }
  if (typeof req.url === 'string') {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      return (parsedUrl.searchParams.get('id') ?? '').trim().toUpperCase();
    } catch {
      return '';
    }
  }
  return '';
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  const clientIp = getClientIp(req.headers) || req.socket?.remoteAddress || 'unknown';
  const rate = checkRateLimit(clientIp, 'certificate-status', 30, 60_000);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({
      error: `Too many verification checks. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
    });
  }

  const certificateId = extractCertificateIdFromRequest(req);
  if (!certificateId) {
    return res.status(400).json({ error: 'Certificate ID is required.' });
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT?.trim()) {
    console.error('[certificate-status] Missing environment variable: FIREBASE_SERVICE_ACCOUNT');
    return res.status(500).json({ error: 'Verification service is not configured yet.' });
  }

  try {
    const db = getAdminDb();
    const docSnap = await db.collection('certificates').doc(certificateId).get();

    if (!docSnap.exists) {
      return res.status(200).json({ found: false });
    }

    const d = (docSnap.data() ?? {}) as Record<string, unknown>;
    return res.status(200).json({
      found: true,
      status: d.status === 'revoked' ? 'revoked' : 'valid',
      fullName: String(d.fullName ?? ''),
      type: d.type === 'professional' ? 'professional' : 'student',
      course: String(d.course ?? ''),
    });
  } catch (err: unknown) {
    if (err instanceof MissingEnvVariableError) {
      return res.status(500).json({ error: 'Verification service is not configured yet.' });
    }
    console.error('[certificate-status] Error checking certificate status:', err);
    return res.status(500).json({
      error: 'Could not verify the certificate at this moment. Please try again.',
    });
  }
}
