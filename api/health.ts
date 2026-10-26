import { getCourseEnquiriesCount } from './_lib/courseEnquiryStore';
import { isGeminiConfigured } from './_lib/gemini';
import type { VercelRequestLike, VercelResponseLike } from './_lib/http';

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'IAMTECHNI Enterprise Backend',
    geminiConfigured: isGeminiConfigured(),
    enquiriesCount: getCourseEnquiriesCount(),
    timestamp: new Date().toISOString(),
  });
}
