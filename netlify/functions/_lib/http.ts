import { ERROR_FALLBACK_TEXT } from './gemini';

export interface NetlifyEventLike {
  httpMethod?: string;
  headers?: Record<string, string | undefined>;
  body?: string | null;
  isBase64Encoded?: boolean;
}

export interface NetlifyResponseLike {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export function jsonResponse(
  statusCode: number,
  payload: unknown,
  extraHeaders?: Record<string, string>
): NetlifyResponseLike {
  return {
    statusCode,
    headers: {
      ...DEFAULT_HEADERS,
      ...(extraHeaders || {}),
    },
    body: JSON.stringify(payload),
  };
}

export function parseJsonBody(event: NetlifyEventLike): { ok: true; data: unknown } | { ok: false; error: string } {
  if (!event.body) {
    return { ok: false, error: 'Request body is required.' };
  }

  try {
    const raw = event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString('utf-8')
      : event.body;
    return { ok: true, data: JSON.parse(raw) };
  } catch {
    return { ok: false, error: 'Invalid JSON in request body.' };
  }
}

export function formatFriendlyChatError(error: unknown): {
  statusCode: number;
  error: string;
  fallbackText: string;
} {
  const err = error as { name?: string; status?: number; message?: string } | undefined;

  if (err?.name === 'TimeoutError') {
    return {
      statusCode: 504,
      error: 'The AI advisor timed out after 20 seconds. Please try a shorter question.',
      fallbackText: ERROR_FALLBACK_TEXT,
    };
  }

  if (err?.status === 429 || err?.message?.includes('429')) {
    return {
      statusCode: 429,
      error: 'The AI advisor is experiencing high demand right now. Please try again in a moment.',
      fallbackText: ERROR_FALLBACK_TEXT,
    };
  }

  return {
    statusCode: 500,
    error: err?.message || 'Failed to generate response',
    fallbackText: ERROR_FALLBACK_TEXT,
  };
}
