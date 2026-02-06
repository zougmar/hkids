import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: ['3-5', '6-8', '9-12'],
    default: '3-5'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    default: 'General'
  },
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  pages: [{
    type: String, // Array of image URLs or PDF page references
    required: true
  }],
  fileType: {
    type: String,
    enum: ['pdf', 'images'],
    default: 'images'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for faster queries
bookSchema.index({ ageGroup: 1, isPublished: 1 });
bookSchema.index({ category: 1, isPublished: 1 });

const Book = mongoose.model('Book', bookSchema);

export default Book;
