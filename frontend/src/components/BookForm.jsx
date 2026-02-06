import { useState, useEffect } from 'react';
import { booksAPI } from '../services/api';

const BookForm = ({ book, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ageGroup: '3-5',
    category: '',
    fileType: 'images',
    isPublished: false
  });
  const [coverImage, setCoverImage] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        description: book.description || '',
        ageGroup: book.ageGroup || '3-5',
        category: book.category || '',
        fileType: book.fileType || 'images',
        isPublished: book.isPublished || false
      });
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCoverImageChange = (e) => {
    if (e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handlePageImagesChange = (e) => {
    if (e.target.files) {
      setPageImages(Array.from(e.target.files));
    }
  };

  // Convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        ageGroup: formData.ageGroup,
        category: formData.category,
        fileType: formData.fileType,
        isPublished: formData.isPublished
      };

      // Convert cover image to base64 if provided
      if (coverImage) {
        dataToSend.coverImage = await fileToBase64(coverImage);
      } else if (book && book.coverImage) {
        // Keep existing cover image if not updating
        dataToSend.coverImage = book.coverImage;
      }

      // Convert page images to base64 if provided
      if (pageImages.length > 0) {
        const base64Pages = await Promise.all(
          pageImages.map(file => fileToBase64(file))
        );
        dataToSend.pages = base64Pages;
      } else if (book && book.pages) {
        // Keep existing pages if not updating
        dataToSend.pages = book.pages;
      }

      if (book) {
        // Update existing book
        await booksAPI.updateBook(book._id, dataToSend);
      } else {
        // Create new book
        await booksAPI.createBook(dataToSend);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving book:', error);
      setError(error.response?.data?.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-primary-blue">
            {book ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-medium mb-2">Age Group *</label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
              >
                <option value="3-5">Ages 3-5</option>
                <option value="6-8">Ages 6-8</option>
                <option value="9-12">Ages 9-12</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Fairy Tales, Adventure"
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Cover Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              required={!book}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
            />
            {book && !coverImage && (
              <p className="text-sm text-gray-500 mt-1">Leave empty to keep current image</p>
            )}
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Page Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePageImagesChange}
              required={!book || pageImages.length === 0}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-blue focus:outline-none"
            />
            {pageImages.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {pageImages.length} page(s) selected
              </p>
            )}
            {book && pageImages.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">Leave empty to keep current pages</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
            />
            <label className="ml-2 text-lg">Publish immediately</label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-large bg-primary-green text-white disabled:opacity-50"
            >
              {loading ? 'Saving...' : book ? 'Update Book' : 'Create Book'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-large bg-gray-300 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
