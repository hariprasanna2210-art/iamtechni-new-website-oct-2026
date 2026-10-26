import { ERROR_FALLBACK_TEXT } from './gemini.js';

export interface VercelRequestLike {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: { remoteAddress?: string };
}

export interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (body: unknown) => VercelResponseLike | void;
  setHeader: (name: string, value: string) => VercelResponseLike | void;
  end: (chunk?: string) => VercelResponseLike | void;
}

export function parseRequestBody(body: unknown): { ok: true; data: unknown } | { ok: false; error: string } {
  if (body === undefined || body === null || body === '') {
    return { ok: false, error: 'Request body is required.' };
  }

  if (typeof body === 'object') {
    return { ok: true, data: body };
  }

  if (typeof body === 'string') {
    try {
      return { ok: true, data: JSON.parse(body) };
    } catch {
      return { ok: false, error: 'Invalid JSON in request body.' };
    }
  }

  return { ok: false, error: 'Unsupported request body format.' };
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
