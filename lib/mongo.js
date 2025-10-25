// lib/mongo.js
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  console.warn('MONGODB_URI not set — database calls will fail without it.');
}

// Use global cache to reuse client across serverless invocations
let cached = globalThis.__mongo ?? { client: null, db: null };

export async function getDb() {
  if (cached.db) return cached.db;
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI not defined');
  const client = new MongoClient(process.env.MONGODB_URI, {
    // options if needed
  });
  await client.connect();
  const db = client.db('mirageDB');
  cached = { client, db };
  globalThis.__mongo = cached;
  return db;
}
