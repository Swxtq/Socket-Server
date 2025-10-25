// api/select_cosmetic.js
import { fetchUUID } from '../lib/uuid.js';
import { getUsersCollection } from '../lib/_helpers.js';
import { docToUser, userToDoc } from '../lib/registries.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || (await parseJsonBody(req));
  const { mcName, cosmeticId } = body || {};
  if (!mcName || !cosmeticId) return res.status(400).json({ error: 'mcName and cosmeticId required' });

  const uuid = await fetchUUID(mcName);
  if (!uuid) return res.status(404).json({ error: 'User not found' });

  const usersCollection = await getUsersCollection();
  const doc = await usersCollection.findOne({ _id: uuid });
  if (!doc) return res.status(404).json({ error: 'User not found' });

  // apply selection logic: only one of same type can be selected
  const cosmetics = (doc.cosmetics || []).map(c => ({ ...c }));

  const target = cosmetics.find(c => c.id === cosmeticId);
  if (!target) return res.status(404).json({ error: 'Cosmetic not found' });

  const type = target.type || null; // if type not stored, we still toggle target
  const newState = !target.selected;

  // if we have types stored we can clear others of same type
  if (type) {
    for (const c of cosmetics) {
      if (c.type === type) c.selected = false;
    }
  } else {
    // fallback: clear others with same id? We'll just toggle target
  }
  target.selected = newState;

  // save
  await usersCollection.updateOne({ _id: uuid }, { $set: { cosmetics } });

  // return updated user
  const updated = await usersCollection.findOne({ _id: uuid });
  const user = docToUser(updated);
  return res.status(200).json({ success: true, mcName, selectedCosmetic: target, user });
}

async function parseJsonBody(req) {
  try {
    return await new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        if (!data) return resolve({});
        try { resolve(JSON.parse(data)); } catch (err) { reject(err); }
      });
      req.on('error', reject);
    });
  } catch (err) {
    return {};
  }
}
