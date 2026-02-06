import connectDB from '../lib/db.js';
import Book from '../../backend/models/Book.js';
import { verifyToken, checkAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      // Get all books (admin only)
      const authHeader = req.headers.authorization;
      const user = await verifyToken(authHeader);
      checkAdmin(user);

      const books = await Book.find()
        .populate('uploadedBy', 'username email')
        .sort({ createdAt: -1 });

      return res.json(books);
    }

    if (req.method === 'POST') {
      // Create new book (admin only)
      const authHeader = req.headers.authorization;
      const user = await verifyToken(authHeader);
      checkAdmin(user);

      const { title, description, ageGroup, category, fileType, coverImage, pages, isPublished } = req.body;

      if (!title || !ageGroup || !category) {
        return res.status(400).json({ message: 'Please provide title, ageGroup, and category' });
      }

      if (!coverImage) {
        return res.status(400).json({ message: 'Cover image is required' });
      }

      if (!pages || pages.length === 0) {
        return res.status(400).json({ message: 'At least one page is required' });
      }

      const book = new Book({
        title,
        description: description || '',
        ageGroup,
        category,
        coverImage, // Base64 string or URL
        pages: Array.isArray(pages) ? pages : [pages],
        fileType: fileType || 'images',
        isPublished: isPublished || false,
        uploadedBy: user._id
      });

      await book.save();

      return res.status(201).json({
        message: 'Book created successfully',
        book
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Books API error:', error);
    if (error.message.includes('No token') || error.message.includes('Invalid token') || error.message.includes('Access denied')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
