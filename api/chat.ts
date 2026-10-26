import { DEFAULT_TIMEOUT_MS, ERROR_FALLBACK_TEXT, generateChatResponse } from './_lib/gemini.js';
import {
  formatFriendlyChatError,
  parseRequestBody,
  type VercelRequestLike,
  type VercelResponseLike,
} from './_lib/http.js';
import { checkRateLimit, getClientIp } from './_lib/rateLimit.js';
import { validateAndFormatChatMessages } from './_lib/validation.js';

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
  const rate = checkRateLimit(clientIp, 'chat', 20, 60_000);
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfterSeconds));
    return res.status(429).json({
      error: `Too many chat requests. Please wait ${rate.retryAfterSeconds} seconds before trying again.`,
      fallbackText: ERROR_FALLBACK_TEXT,
      text: ERROR_FALLBACK_TEXT,
    });
  }

  const parsed = parseRequestBody(req.body);
  if (!parsed.ok) {
    return res.status(400).json({ error: parsed.error, fallbackText: ERROR_FALLBACK_TEXT });
  }

  const validation = validateAndFormatChatMessages(parsed.data);
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error, fallbackText: ERROR_FALLBACK_TEXT });
  }

  try {
    const result = await generateChatResponse(validation.contents, DEFAULT_TIMEOUT_MS);
    return res.status(200).json({ text: result.text, reply: result.reply });
  } catch (error: unknown) {
    console.error('Error generating Gemini chat response:', error);
    const friendly = formatFriendlyChatError(error);
    return res.status(friendly.statusCode).json({
      error: friendly.error,
      fallbackText: friendly.fallbackText,
      text: friendly.fallbackText,
    });
  }
}
