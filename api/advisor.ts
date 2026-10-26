import chatHandler from './chat.js';
import type { VercelRequestLike, VercelResponseLike } from './_lib/http.js';

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  return chatHandler(req, res);
}
