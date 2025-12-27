// api/start_tutorial.js
import { fetchUUID } from '../lib/uuid.js';
import { getUsersCollection } from '../lib/_helpers.js';
import { docToUser, userToDoc } from '../lib/registries.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || (await parseJsonBody(req));
  const { mcName } = body || {};
  if (!mcName) return res.status(400).json({ error: 'mcName is required' });

  const uuid = await fetchUUID(mcName);
  if (!uuid) return res.status(400).json({ error: 'Invalid Minecraft username' });

  const usersCollection = await getUsersCollection();
  let doc = await usersCollection.findOne({ _id: uuid });

  if (!doc) {
    // default user
    const user = {
      mcName,
      isUser: true,
      rank: { name: 'Default' },
      cosmetics: [
      ]
    };
    await usersCollection.updateOne({ _id: uuid }, { $set: userToDoc(user) }, { upsert: true });
    doc = await usersCollection.findOne({ _id: uuid });
  }

  const user = docToUser(doc);
  return res.status(200).json({ success: true, user });
}

/**
 * Vercel sometimes passes JSON automatically; this helper tries to ensure body is parsed.
 */
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
