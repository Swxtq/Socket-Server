// api/getUser.js
import { fetchUUID } from '../lib/uuid.js';
import { getUsersCollection } from '../lib/_helpers.js';
import { docToUser } from '../lib/registries.js';

export default async function handler(req, res) {
  const mcName = req.query?.mcName || (req.url && new URL(req.url, 'http://localhost').searchParams.get('mcName'));
  if (!mcName) return res.status(400).json({ error: 'mcName query parameter required' });

  const uuid = await fetchUUID(mcName);
  if (!uuid) return res.status(404).json({ error: 'User not found' });

  const usersCollection = await getUsersCollection();
  const doc = await usersCollection.findOne({ _id: uuid });
  if (!doc) return res.status(404).json({ error: 'User not found' });

  const user = docToUser(doc);
  return res.status(200).json({ success: true, ...user });
}
