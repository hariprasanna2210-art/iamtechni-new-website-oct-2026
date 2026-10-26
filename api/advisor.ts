import chatHandler from './chat';
import type { VercelRequestLike, VercelResponseLike } from './_lib/http';

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  return chatHandler(req, res);
}
