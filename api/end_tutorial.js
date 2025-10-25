// api/end_tutorial.js
import { getUsersCollection } from '../lib/_helpers.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const body = req.body || (await parseJsonBody(req));
  const { mcName } = body || {};
  if (!mcName) return res.status(400).json({ error: 'mcName is required' });

  // We will remove presence info by setting isUser false if it exists (stateless server)
  // Find user by mcName
  const usersCollection = await getUsersCollection();
  const doc = await usersCollection.findOne({ mcName });
  if (!doc) return res.status(200).json({ success: true }); // nothing to do

  await usersCollection.updateOne({ _id: doc._id }, { $set: { isUser: false } });
  return res.status(200).json({ success: true });
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
