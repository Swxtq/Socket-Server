
import fetch from 'node-fetch';

const uuidCache = new Map();

export async function fetchUUID(mcName) {
  if (!mcName) return null;
  const key = mcName.toLowerCase();
  const cached = uuidCache.get(key);
  const TTL = 60 * 60 * 1000; // 1 hour

  if (cached && (Date.now() - cached.timestamp) < TTL) return cached.uuid;

  try {
    const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${encodeURIComponent(key)}`, {
      headers: { 'User-Agent': 'notro/1.0' }
    });
    if (res.status === 429) return cached?.uuid || null;
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.id) return null;
    const uuid = data.id;
    uuidCache.set(key, { uuid, timestamp: Date.now() });
    return uuid;
  } catch (err) {
    console.error('fetchUUID error', err);
    return cached?.uuid || null;
  }
}
