import mongoose from 'mongoose';
import { env } from '../../config/env.js';

export async function connectDatabase() {
  await mongoose.connect(env.MONGODB_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  });
}
