import { DEFAULT_TIMEOUT_MS, ERROR_FALLBACK_TEXT, generateChatResponse } from './_lib/gemini';
import {
  formatFriendlyChatError,
  jsonResponse,
  parseJsonBody,
  type NetlifyEventLike,
  type NetlifyResponseLike,
} from './_lib/http';
import { checkRateLimit, getClientIp } from './_lib/rateLimit';
import { validateAndFormatChatMessages } from './_lib/validation';

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
  const rate = checkRateLimit(clientIp, 'chat', 20, 60_000);
  if (!rate.allowed) {
    return jsonResponse(
      429,
      {
        error: `Too many chat requests. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
        fallbackText: ERROR_FALLBACK_TEXT,
        text: ERROR_FALLBACK_TEXT,
      },
      { 'Retry-After': String(rate.retryAfterSeconds) }
    );
  }

  const parsed = parseJsonBody(event);
  if (!parsed.ok) {
    return jsonResponse(400, { error: parsed.error, fallbackText: ERROR_FALLBACK_TEXT });
  }

  const validation = validateAndFormatChatMessages(parsed.data);
  if (!validation.ok) {
    return jsonResponse(400, { error: validation.error, fallbackText: ERROR_FALLBACK_TEXT });
  }

  try {
    const result = await generateChatResponse(validation.contents, DEFAULT_TIMEOUT_MS);
    return jsonResponse(200, { text: result.text, reply: result.reply });
  } catch (error: unknown) {
    console.error('Error generating Gemini chat response:', error);
    const friendly = formatFriendlyChatError(error);
    return jsonResponse(friendly.statusCode, {
      error: friendly.error,
      fallbackText: friendly.fallbackText,
      text: friendly.fallbackText,
    });
  }
}
