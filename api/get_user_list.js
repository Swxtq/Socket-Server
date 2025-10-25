// api/get_user_list.js
import { getUsersCollection } from '../lib/_helpers.js';

export default async function handler(req, res) {
  const usersCollection = await getUsersCollection();
  const cursor = usersCollection.find({});
  const docs = await cursor.toArray();
  const list = docs.map(d => ({ mcName: d.mcName, rank: d.rank || 'Default', isUser: !!d.isUser }));
  return res.status(200).json(list);
}
