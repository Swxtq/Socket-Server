// api/isUser.js
import { getUsersCollection } from '../lib/_helpers.js';

export default async function handler(req, res) {
  const mcName = req.query?.mcName || req.query?.name || (req.url && new URL(req.url, 'http://localhost').searchParams.get('mcName'));
  if (!mcName) return res.status(400).json({ error: 'mcName query parameter required' });

  const usersCollection = await getUsersCollection();
  const doc = await usersCollection.findOne({ mcName });
  const exists = !!(doc && doc.isUser);
  return res.status(200).json({ exists });
}
