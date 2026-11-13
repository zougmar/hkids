import Book from '../models/Book.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const toPublicPath = (filePath) => {
  if (!filePath) return filePath;
  const normalized = filePath.replace(/\\/g, '/');
  const uploadsIndex = normalized.lastIndexOf('/uploads/');
  if (uploadsIndex !== -1) {
    return normalized.slice(uploadsIndex);
  }
  if (normalized.startsWith('uploads/')) {
    return `/${normalized}`;
  }
  return normalized;
};

const isDataUrl = (value) => typeof value === 'string' && value.startsWith('data:');

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
      .select('title description ageGroup category coverImage pages fileType')
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

    // Allow children to read published books without admin auth path
    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new book
 * Supports multipart file uploads OR JSON with base64 cover/pages (from PDF conversion)
 */
export const createBook = async (req, res) => {
  try {
    const { title, description, ageGroup, category, fileType, pages, isPublished } = req.body;

    if (!title || !ageGroup || !category) {
      return res.status(400).json({ message: 'Please provide title, ageGroup, and category' });
    }

    const allowedAgeGroups = ['3-5', '6-8', '9-12', '13-15', '16+'];
    if (!allowedAgeGroups.includes(ageGroup)) {
      return res.status(400).json({
        message: `Invalid age group. Allowed: ${allowedAgeGroups.join(', ')}`
      });
    }

    const uploadedCover = req.files?.coverImage?.[0]?.path;
    const coverImage = uploadedCover
      ? toPublicPath(uploadedCover)
      : req.body.coverImage;

    if (!coverImage) {
      return res.status(400).json({ message: 'Cover image is required' });
    }

    const uploadedPages = req.files?.pages?.map((file) => toPublicPath(file.path)) || [];
    let pageList = uploadedPages;

    if (pageList.length === 0) {
      if (Array.isArray(pages)) {
        pageList = pages;
      } else if (typeof pages === 'string' && pages.trim()) {
        try {
          const parsed = JSON.parse(pages);
          pageList = Array.isArray(parsed) ? parsed : [pages];
        } catch {
          pageList = [pages];
        }
      }
    }

    if (!pageList || pageList.length === 0) {
      return res.status(400).json({ message: 'At least one page is required' });
    }

    const book = new Book({
      title,
      description: description || '',
      ageGroup,
      category,
      coverImage,
      pages: pageList,
      fileType: fileType || (isDataUrl(pageList[0]) ? 'images' : 'images'),
      isPublished: isPublished === true || isPublished === 'true',
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

    if (title) book.title = title;
    if (description !== undefined) book.description = description;
    if (ageGroup) {
      const allowedAgeGroups = ['3-5', '6-8', '9-12', '13-15', '16+'];
      if (!allowedAgeGroups.includes(ageGroup)) {
        return res.status(400).json({
          message: `Invalid age group. Allowed: ${allowedAgeGroups.join(', ')}`
        });
      }
      book.ageGroup = ageGroup;
    }
    if (category) book.category = category;
    if (fileType) book.fileType = fileType;
    if (isPublished !== undefined) {
      book.isPublished = isPublished === true || isPublished === 'true';
    }

    if (req.files?.coverImage?.[0]?.path) {
      try {
        if (book.coverImage && !isDataUrl(book.coverImage)) {
          const oldCoverPath = path.join(__dirname, '..', book.coverImage.replace(/^\//, ''));
          await fs.unlink(oldCoverPath);
        }
      } catch (err) {
        console.log('Old cover image not found or already deleted');
      }
      book.coverImage = toPublicPath(req.files.coverImage[0].path);
    } else if (req.body.coverImage) {
      book.coverImage = req.body.coverImage;
    }

    if (req.files?.pages && req.files.pages.length > 0) {
      for (const oldPage of book.pages) {
        if (isDataUrl(oldPage)) continue;
        try {
          const oldPagePath = path.join(__dirname, '..', oldPage.replace(/^\//, ''));
          await fs.unlink(oldPagePath);
        } catch (err) {
          console.log('Old page image not found');
        }
      }
      book.pages = req.files.pages.map((file) => toPublicPath(file.path));
    } else if (pages) {
      if (Array.isArray(pages)) {
        book.pages = pages;
      } else if (typeof pages === 'string') {
        try {
          const parsed = JSON.parse(pages);
          book.pages = Array.isArray(parsed) ? parsed : [pages];
        } catch {
          book.pages = [pages];
        }
      }
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

    try {
      if (book.coverImage && !isDataUrl(book.coverImage)) {
        const coverPath = path.join(__dirname, '..', book.coverImage.replace(/^\//, ''));
        await fs.unlink(coverPath);
      }

      for (const page of book.pages) {
        if (isDataUrl(page)) continue;
        const pagePath = path.join(__dirname, '..', page.replace(/^\//, ''));
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
