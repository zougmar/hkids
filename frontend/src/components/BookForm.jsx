import { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, FileText, CheckCircle2, Loader2 } from 'lucide-react';
import { booksAPI } from '../services/api';
import { pdfFileToPageImages } from '../utils/pdfToPages';
import { AGE_GROUPS } from '../constants/ageGroups';

const BookForm = ({ book, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ageGroup: '3-5',
    category: '',
    fileType: 'pdf',
    isPublished: false
  });
  const [coverImage, setCoverImage] = useState(null);
  const [pageImages, setPageImages] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfProgress, setPdfProgress] = useState('');
  const [uploadMode, setUploadMode] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        description: book.description || '',
        ageGroup: book.ageGroup || '3-5',
        category: book.category || '',
        fileType: book.fileType || 'pdf',
        isPublished: book.isPublished || false
      });
      setUploadMode(book.fileType === 'images' ? 'images' : 'pdf');
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleCoverImageChange = (e) => {
    if (e.target.files?.[0]) setCoverImage(e.target.files[0]);
  };

  const handlePageImagesChange = (e) => {
    if (e.target.files) {
      setPageImages(Array.from(e.target.files));
      setPdfFile(null);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    setError('');
    setPdfFile(file);
    setPageImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setPdfProgress('');

    try {
      const dataToSend = {
        title: formData.title,
        description: formData.description,
        ageGroup: formData.ageGroup,
        category: formData.category,
        fileType: uploadMode === 'pdf' ? 'pdf' : 'images',
        isPublished: formData.isPublished
      };

      let pages = [];

      if (uploadMode === 'pdf' && pdfFile) {
        setPdfProgress('Reading PDF…');
        pages = await pdfFileToPageImages(pdfFile, (done, total) => {
          setPdfProgress(`Converting page ${done} of ${total}…`);
        });

        if (pages.length === 0) {
          throw new Error('Could not read any pages from this PDF');
        }

        if (coverImage) {
          dataToSend.coverImage = await fileToBase64(coverImage);
        } else if (!book) {
          dataToSend.coverImage = pages[0];
        } else if (book.coverImage) {
          dataToSend.coverImage = book.coverImage;
        }

        dataToSend.pages = pages;
      } else if (uploadMode === 'images') {
        if (coverImage) {
          dataToSend.coverImage = await fileToBase64(coverImage);
        } else if (book?.coverImage) {
          dataToSend.coverImage = book.coverImage;
        } else {
          throw new Error('Cover image is required');
        }

        if (pageImages.length > 0) {
          pages = await Promise.all(pageImages.map((file) => fileToBase64(file)));
          dataToSend.pages = pages;
        } else if (book?.pages?.length) {
          dataToSend.pages = book.pages;
        } else {
          throw new Error('At least one page image is required');
        }
      } else if (book) {
        dataToSend.coverImage = coverImage
          ? await fileToBase64(coverImage)
          : book.coverImage;
        dataToSend.pages = book.pages;
      } else {
        throw new Error('Please upload a PDF book file');
      }

      setPdfProgress('Saving book…');

      if (book) {
        await booksAPI.updateBook(book._id, dataToSend);
      } else {
        await booksAPI.createBook(dataToSend);
      }

      onSuccess();
    } catch (err) {
      console.error('Error saving book:', err);
      setError(err.response?.data?.message || err.message || 'Failed to save book');
    } finally {
      setLoading(false);
      setPdfProgress('');
    }
  };

  return (
    <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[1.75rem] shadow-lift w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-ink-100 px-6 py-4 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            {book ? 'Edit book' : 'Add new book'}
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="w-10 h-10 rounded-xl bg-ink-100 text-ink-700 flex items-center justify-center hover:bg-ink-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="field-input"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="field-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">Age group *</label>
              <select
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleChange}
                required
                className="field-input"
              >
                {AGE_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                placeholder="e.g., Adventure, Science"
                className="field-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">Book format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUploadMode('pdf')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 font-semibold ${
                  uploadMode === 'pdf'
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-500'
                }`}
              >
                <FileText className="w-4 h-4" />
                PDF book
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('images')}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 font-semibold ${
                  uploadMode === 'images'
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-ink-200 text-ink-500'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Page images
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-700 mb-2">
              Cover image {uploadMode === 'pdf' ? '(optional)' : '*'}
            </label>
            <label className="field-input flex items-center gap-3 cursor-pointer">
              <Upload className="w-4 h-4 text-brand-600" />
              <span className="text-ink-500 truncate">
                {coverImage?.name || (book ? 'Keep current cover' : 'Choose cover image')}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                required={uploadMode === 'images' && !book}
                className="hidden"
              />
            </label>
          </div>

          {uploadMode === 'pdf' ? (
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">PDF file *</label>
              <label className="field-input flex items-center gap-3 cursor-pointer">
                <FileText className="w-4 h-4 text-brand-600" />
                <span className="text-ink-500 truncate">
                  {pdfFile?.name || (book ? 'Keep current pages' : 'Upload PDF')}
                </span>
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handlePdfChange}
                  required={!book}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-ink-500 mt-2">Each PDF page becomes a flip-book page (max 50).</p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-ink-700 mb-2">Page images *</label>
              <label className="field-input flex items-center gap-3 cursor-pointer">
                <ImageIcon className="w-4 h-4 text-brand-600" />
                <span className="text-ink-500 truncate">
                  {pageImages.length > 0
                    ? `${pageImages.length} image(s) selected`
                    : book
                      ? 'Keep current pages'
                      : 'Upload page images'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePageImagesChange}
                  required={!book}
                  className="hidden"
                />
              </label>
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-5 h-5 rounded border-ink-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="font-semibold text-ink-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-leaf" />
              Publish immediately
            </span>
          </label>

          {pdfProgress && (
            <div className="bg-brand-50 text-brand-700 px-4 py-3 rounded-2xl text-center font-medium flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {pdfProgress}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="flex-1 btn-success btn-large disabled:opacity-50">
              {loading ? 'Saving…' : book ? 'Update book' : 'Create book'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 btn-ghost btn-large">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
