import mongoose from 'mongoose';

// Cache the connection to reuse in serverless functions
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not set');
    }

    const connectionString = process.env.MONGODB_URI;
    
    // Add connection timeout
    opts.serverSelectionTimeoutMS = 10000; // 10 seconds
    opts.socketTimeoutMS = 45000; // 45 seconds
    
    cached.promise = mongoose.connect(connectionString, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      console.log('Database:', mongoose.connection.db?.databaseName);
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', {
        message: error.message,
        name: error.name,
        code: error.code,
        connectionString: connectionString ? `${connectionString.substring(0, 20)}...` : 'undefined'
      });
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
