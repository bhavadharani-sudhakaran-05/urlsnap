import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/url-shortener';

try {
  await mongoose.connect(uri);
  const ping = await mongoose.connection.db.admin().ping();
  console.log('✓ Connected to MongoDB:', uri);
  console.log('✓ Ping:', JSON.stringify(ping));
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('✗ MongoDB connection failed:', err.message);
  process.exit(1);
}
