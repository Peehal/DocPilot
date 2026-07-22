import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongoUri) {
    console.warn('[db] MONGO_URI not set — skipping connection.');
    return;
  }
  await mongoose.connect(env.mongoUri);
  console.log('[db] Connected to MongoDB');
}
