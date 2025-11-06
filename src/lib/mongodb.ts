import mongoose from 'mongoose';

// Support multiple env var names: DATABASE_URL / DATABASE_URl / MONGODB_URI / MONGO_URL
const MONGODB_URI =
  process.env.DATABASE_URL ||
  (process.env as Record<string, string | undefined>)['DATABASE_URl'] ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  '';

if (!MONGODB_URI) {
  console.warn('[MongoDB] MONGODB_URI is not set. Add it to your .env file.');
}

declare global {
  // eslint-disable-next-line no-var
  var __mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const globalAny = global as unknown as { __mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } };
if (!globalAny.__mongooseCache) {
  globalAny.__mongooseCache = { conn: null, promise: null };
}
const cached = globalAny.__mongooseCache as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: process.env.MONGODB_DB || undefined,
      })
      .then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;