import Redis from 'ioredis';

let client: Redis | null = null;

export function getRedis(): Redis | null {
  if (client) return client;
  const url = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL;
  if (!url) return null;
  client = new Redis(url);
  return client;
}

export async function cacheGetJSON<T>(key: string): Promise<T | null> {
  const r = getRedis();
  if (!r) return null;
  const val = await r.get(key);
  return val ? (JSON.parse(val) as T) : null;
}

export async function cacheSetJSON(key: string, value: unknown, ttlSec = 60): Promise<void> {
  const r = getRedis();
  if (!r) return;
  await r.set(key, JSON.stringify(value), 'EX', ttlSec);
}



