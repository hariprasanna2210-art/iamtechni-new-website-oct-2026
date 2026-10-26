import { getCourseEnquiriesCount } from './_lib/courseEnquiryStore';
import { isGeminiConfigured } from './_lib/gemini';
import { jsonResponse, type NetlifyEventLike, type NetlifyResponseLike } from './_lib/http';

export async function handler(event: NetlifyEventLike): Promise<NetlifyResponseLike> {
  if (event.httpMethod && event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD') {
    return jsonResponse(
      405,
      { error: 'Method Not Allowed. Use GET.' },
      { Allow: 'GET, HEAD' }
    );
  }

  return jsonResponse(200, {
    status: 'ok',
    service: 'IAMTECHNI Enterprise Backend',
    geminiConfigured: isGeminiConfigured(),
    enquiriesCount: getCourseEnquiriesCount(),
    timestamp: new Date().toISOString(),
  });
}
