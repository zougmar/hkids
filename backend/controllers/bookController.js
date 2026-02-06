import Book from '../models/Book.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Get all published books (for child interface)
 * Optional filters: ageGroup, category
 */
export const getPublishedBooks = async (req, res) => {
  try {
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
};

/**
 * Get all books (for admin dashboard)
 */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find()
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get single book by ID
 */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('uploadedBy', 'username email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new book
 */
export const createBook = async (req, res) => {
  try {
    const { title, description, ageGroup, category, fileType, pages } = req.body;

    // Validation
    if (!title || !ageGroup || !category) {
      return res.status(400).json({ message: 'Please provide title, ageGroup, and category' });
    }

    // Get cover image from uploaded files
    const coverImage = req.files?.coverImage?.[0]?.path || req.file?.path;

    if (!coverImage) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    // Process page images
    const pageImages = req.files?.pages?.map(file => file.path) || [];
    
    if (pageImages.length === 0 && (!pages || pages.length === 0)) {
      return res.status(400).json({ message: 'At least one page is required' });
    }

    const book = new Book({
      title,
      description: description || '',
      ageGroup,
      category,
      coverImage: coverImage.replace(/\\/g, '/'), // Normalize path separators
      pages: pageImages.length > 0 ? pageImages.map(p => p.replace(/\\/g, '/')) : pages,
      fileType: fileType || 'images',
      isPublished: false,
      uploadedBy: req.user._id
    });

    await book.save();

    res.status(201).json({
      message: 'Book created successfully',
      book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update a book
 */
export const updateBook = async (req, res) => {
  try {
    const { title, description, ageGroup, category, fileType, pages, isPublished } = req.body;
    
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update fields
    if (title) book.title = title;
    if (description !== undefined) book.description = description;
    if (ageGroup) book.ageGroup = ageGroup;
    if (category) book.category = category;
    if (fileType) book.fileType = fileType;
    if (isPublished !== undefined) book.isPublished = isPublished;

    // Update cover image if provided
    if (req.files?.coverImage?.[0]?.path || req.file?.path) {
      // Delete old cover image
      try {
        const oldCoverPath = path.join(__dirname, '..', book.coverImage);
        await fs.unlink(oldCoverPath);
      } catch (err) {
        console.log('Old cover image not found or already deleted');
      }
      book.coverImage = (req.files?.coverImage?.[0]?.path || req.file?.path).replace(/\\/g, '/');
    }

    // Update pages if provided
    if (req.files?.pages && req.files.pages.length > 0) {
      // Delete old page images
      book.pages.forEach(async (oldPage) => {
        try {
          const oldPagePath = path.join(__dirname, '..', oldPage);
          await fs.unlink(oldPagePath);
        } catch (err) {
          console.log('Old page image not found');
        }
      });
      book.pages = req.files.pages.map(file => file.path.replace(/\\/g, '/'));
    } else if (pages) {
      book.pages = pages;
    }

    await book.save();

    res.json({
      message: 'Book updated successfully',
      book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a book
 */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Delete associated files
    try {
      // Delete cover image
      const coverPath = path.join(__dirname, '..', book.coverImage);
      await fs.unlink(coverPath);
      
      // Delete page images
      for (const page of book.pages) {
        const pagePath = path.join(__dirname, '..', page);
        await fs.unlink(pagePath);
      }
    } catch (err) {
      console.log('Error deleting files:', err);
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
