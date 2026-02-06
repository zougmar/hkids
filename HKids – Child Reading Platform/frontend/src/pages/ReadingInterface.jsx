import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { booksAPI } from '../services/api';
import { Link } from 'react-router-dom';

const ReadingInterface = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, [selectedAgeGroup, selectedCategory]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedAgeGroup) params.ageGroup = selectedAgeGroup;
      if (selectedCategory) params.category = selectedCategory;
      
      const response = await booksAPI.getPublishedBooks(params);
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBook = (book) => {
    setSelectedBook(book);
    setCurrentPage(0);
  };

  const closeBook = () => {
    setSelectedBook(null);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (selectedBook && currentPage < selectedBook.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get unique categories
  const categories = [...new Set(books.map(book => book.category))];
  const ageGroups = ['3-5', '6-8', '9-12'];

  // Filter books based on selections
  const filteredBooks = books.filter(book => {
    if (selectedAgeGroup && book.ageGroup !== selectedAgeGroup) return false;
    if (selectedCategory && book.category !== selectedCategory) return false;
    return true;
  });

  // If a book is open, show reading view
  if (selectedBook) {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const coverImage = selectedBook.coverImage?.startsWith('http') 
      ? selectedBook.coverImage 
      : `${API_URL}${selectedBook.coverImage}`;
    
    const currentPageImage = selectedBook.pages?.[currentPage];
    const pageImageUrl = currentPageImage?.startsWith('http')
      ? currentPageImage
      : `${API_URL}${currentPageImage}`;

    return (
      <div className="fullscreen bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-black bg-opacity-50 text-white p-4 flex justify-between items-center">
          <button
            onClick={closeBook}
            className="btn-large bg-primary-orange text-white text-xl"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
          <div className="text-xl">
            {currentPage + 1} / {selectedBook.pages.length + 1}
          </div>
        </div>

        {/* Book Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="page-container w-full h-full max-w-6xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: -90, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full flex items-center justify-center"
              >
                {currentPage === 0 ? (
                  <img
                    src={coverImage}
                    alt={selectedBook.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                ) : (
                  <img
                    src={pageImageUrl}
                    alt={`Page ${currentPage}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-black bg-opacity-50 p-6 flex justify-center gap-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className={`btn-large ${
              currentPage === 0
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-primary-blue text-white'
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage >= selectedBook.pages.length}
            className={`btn-large ${
              currentPage >= selectedBook.pages.length
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-primary-green text-white'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  // Book selection view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold text-primary-blue">📚 Choose a Book</h1>
          <Link
            to="/"
            className="btn-large bg-primary-orange text-white"
          >
            Home
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Filter Books</h2>
          <div className="flex flex-wrap gap-4">
            {/* Age Group Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Age Group</label>
              <select
                value={selectedAgeGroup || ''}
                onChange={(e) => setSelectedAgeGroup(e.target.value || null)}
                className="px-4 py-2 text-xl rounded-xl border-2 border-gray-300 focus:border-primary-blue"
              >
                <option value="">All Ages</option>
                {ageGroups.map(age => (
                  <option key={age} value={age}>Ages {age}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-2 text-xl rounded-xl border-2 border-gray-300 focus:border-primary-blue"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedAgeGroup || selectedCategory) && (
              <button
                onClick={() => {
                  setSelectedAgeGroup(null);
                  setSelectedCategory(null);
                }}
                className="btn-large bg-gray-300 text-gray-700 mt-6"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center text-3xl py-20">Loading books...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center text-3xl py-20 text-gray-600">
            No books found. Try different filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
              const coverImageUrl = book.coverImage?.startsWith('http')
                ? book.coverImage
                : `${API_URL}${book.coverImage}`;

              return (
                <motion.div
                  key={book._id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 shadow-lg cursor-pointer"
                  onClick={() => {
                    // Use book data directly (pages are now included in published books)
                    openBook(book);
                  }}
                >
                  <img
                    src={coverImageUrl}
                    alt={book.title}
                    className="w-full h-64 object-cover rounded-2xl mb-4"
                  />
                  <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{book.description}</p>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-primary-blue text-white rounded-full text-sm">
                      Ages {book.ageGroup}
                    </span>
                    <span className="px-3 py-1 bg-primary-green text-white rounded-full text-sm">
                      {book.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingInterface;
