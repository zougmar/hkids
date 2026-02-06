import connectDB from '../lib/db.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if MONGODB_URI is set
    if (!process.env.MONGODB_URI) {
      return res.status(500).json({ 
        status: 'ERROR', 
        message: 'MONGODB_URI environment variable is not set',
        hint: 'Add MONGODB_URI in Vercel environment variables',
        timestamp: new Date().toISOString()
      });
    }

    // Try to connect with timeout
    const connectionPromise = connectDB();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    
    res.json({ 
      status: 'OK', 
      message: 'HKids API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      mongodb: 'connected'
    });
  } catch (error) {
    console.error('Health check error:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      hasMongoDBUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI?.length || 0
    });
    
    let errorMessage = error.message;
    let hint = 'Check MONGODB_URI environment variable';
    
    if (error.message.includes('timeout')) {
      hint = 'MongoDB connection timed out. Check network access in MongoDB Atlas.';
    } else if (error.message.includes('authentication')) {
      hint = 'MongoDB authentication failed. Check username and password in connection string.';
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      hint = 'Cannot resolve MongoDB hostname. Check connection string format.';
    } else if (!process.env.MONGODB_URI) {
      hint = 'MONGODB_URI environment variable is missing. Add it in Vercel settings.';
    }
    
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Database connection failed', 
      error: errorMessage,
      hint: hint,
      timestamp: new Date().toISOString()
    });
  }
}
