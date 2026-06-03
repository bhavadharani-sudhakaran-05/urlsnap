import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connect to MongoDB. In development, falls back to an in-memory DB
 * if local MongoDB is not running (no install required).
 */
export const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const uri = process.env.MONGODB_URI;
  const allowMemory =
    process.env.USE_MEMORY_DB === 'true' ||
    (process.env.NODE_ENV !== 'production' && process.env.USE_MEMORY_DB !== 'false');

  if (!uri && !allowMemory) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  const connect = async (connectionUri) => {
    await mongoose.connect(connectionUri, { maxPoolSize: 10 });
    console.log(`MongoDB connected: ${mongoose.connection.host}`);
  };

  if (uri) {
    try {
      await connect(uri);
      return;
    } catch (err) {
      if (!allowMemory) throw err;
      console.warn(`Could not connect to ${uri} — ${err.message}`);
      console.warn('Starting in-memory MongoDB for local development…');
    }
  }

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('url-shortener');
  await connect(memoryUri);
  console.log('Using in-memory MongoDB (data resets when the server stops).');
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
