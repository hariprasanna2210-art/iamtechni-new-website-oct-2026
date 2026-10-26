import { recordCourseEnquiry } from './_lib/courseEnquiryStore';
import {
  jsonResponse,
  parseJsonBody,
  type NetlifyEventLike,
  type NetlifyResponseLike,
} from './_lib/http';
import { checkRateLimit, getClientIp } from './_lib/rateLimit';
import { validateCourseEnquiryPayload } from './_lib/validation';

export async function handler(event: NetlifyEventLike): Promise<NetlifyResponseLike> {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(204, {});
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(
      405,
      { error: 'Method Not Allowed. Use POST.' },
      { Allow: 'POST, OPTIONS' }
    );
  }

  const clientIp = getClientIp(event.headers);
  const rate = checkRateLimit(clientIp, 'course-enquiry', 10, 60_000);
  if (!rate.allowed) {
    return jsonResponse(
      429,
      {
        error: `Too many enquiry submissions. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
      },
      { 'Retry-After': String(rate.retryAfterSeconds) }
    );
  }

  const parsed = parseJsonBody(event);
  if (!parsed.ok) {
    return jsonResponse(400, { error: parsed.error });
  }

  try {
    const validation = validateCourseEnquiryPayload(parsed.data);
    if (!validation.ok) {
      return jsonResponse(400, { error: validation.error });
    }

    const newEnquiry = validation.enquiry;
    recordCourseEnquiry(newEnquiry);

    return jsonResponse(201, {
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
    return jsonResponse(500, { error: 'Internal server error processing enquiry' });
  }
}
