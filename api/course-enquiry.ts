import { recordCourseEnquiry } from './_lib/courseEnquiryStore';
import {
  parseRequestBody,
  type VercelRequestLike,
  type VercelResponseLike,
} from './_lib/http';
import { checkRateLimit, getClientIp } from './_lib/rateLimit';
import { validateCourseEnquiryPayload } from './_lib/validation';

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const clientIp = getClientIp(req.headers) || req.socket?.remoteAddress || 'unknown';
  const rate = checkRateLimit(clientIp, 'course-enquiry', 10, 60_000);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({
      error: `Too many enquiry submissions. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
    });
  }

  const parsed = parseRequestBody(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.error });
  }

  try {
    const validation = validateCourseEnquiryPayload(parsed.data);
    if (!validation.ok) {
      return res.status(400).json({ error: validation.error });
    }

    const newEnquiry = validation.enquiry;
    recordCourseEnquiry(newEnquiry);

    return res.status(201).json({
      success: true,
      referenceId: newEnquiry.id,
      message: `Enquiry received for ${newEnquiry.course}. Our academic counselor will contact you within 24 hours.`,
      enquiry: {
        id: newEnquiry.id,
        course: newEnquiry.course,
        fullName: newEnquiry.fullName,
        createdAt: newEnquiry.createdAt,
      },
    });
  } catch (err: unknown) {
    console.error('Error handling course enquiry:', err);
    return res.status(500).json({ error: 'Internal server error processing enquiry' });
  }
}
