import connectDB from '../lib/db.js';
import Book from '../../backend/models/Book.js';
import { verifyToken, checkAdmin } from '../lib/auth.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    const { id } = req.query;
    const authHeader = req.headers.authorization;
    const user = await verifyToken(authHeader);
    checkAdmin(user);

    if (req.method === 'GET') {
      const book = await Book.findById(id).populate('uploadedBy', 'username email');

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      return res.json(book);
    }

    if (req.method === 'PUT') {
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      const { title, description, ageGroup, category, fileType, coverImage, pages, isPublished } = req.body;

      if (title) book.title = title;
      if (description !== undefined) book.description = description;
      if (ageGroup) book.ageGroup = ageGroup;
      if (category) book.category = category;
      if (fileType) book.fileType = fileType;
      if (isPublished !== undefined) book.isPublished = isPublished;
      if (coverImage) book.coverImage = coverImage;
      if (pages) book.pages = Array.isArray(pages) ? pages : [pages];

      await book.save();

      return res.json({
        message: 'Book updated successfully',
        book
      });
    }

    if (req.method === 'DELETE') {
      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }

      await Book.findByIdAndDelete(id);

      return res.json({ message: 'Book deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Book API error:', error);
    if (error.message.includes('No token') || error.message.includes('Invalid token') || error.message.includes('Access denied')) {
      return res.status(401).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
