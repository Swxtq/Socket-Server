
import { getDb } from '../lib/mongo.js';
import { docToUser, userToDoc } from '../lib/registries.js';

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection('users');
}

export function jsonResponse(res, status = 200, payload = {}) {
  res.status(status).json(payload);
}
