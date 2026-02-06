import connectDB from '../lib/db.js';
import Book from '../../backend/models/Book.js';

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
    await connectDB();

    const { ageGroup, category } = req.query;
    
    const query = { isPublished: true };
    
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }
    
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .select('title description ageGroup category coverImage pages')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Get published books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
