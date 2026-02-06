import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getPublishedBooks,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../controllers/bookController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images and PDFs
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only image files and PDFs are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Public route - Get published books (for child interface)
router.get('/published', getPublishedBooks);

// Protected routes - Admin only
router.get('/', authenticate, isAdmin, getAllBooks);
router.get('/:id', authenticate, isAdmin, getBookById);
router.post(
  '/',
  authenticate,
  isAdmin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pages', maxCount: 50 }
  ]),
  createBook
);
router.put(
  '/:id',
  authenticate,
  isAdmin,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pages', maxCount: 50 }
  ]),
  updateBook
);
router.delete('/:id', authenticate, isAdmin, deleteBook);

export default router;
