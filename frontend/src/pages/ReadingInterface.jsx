import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home as HomeIcon,
  Library,
  Search,
  BookOpen,
  Filter,
  RefreshCcw
} from 'lucide-react';
import { booksAPI, getBaseBackendURL } from '../services/api';
import FlipBookReader from '../components/FlipBookReader';
import { AgeIcon } from '../components/AgeIcons';
import {
  AGE_GROUPS,
  getAgeGroup,
  loadSelectedAge,
  saveSelectedAge,
  AGE_GROUP_IDS
} from '../constants/ageGroups';

const ReadingInterface = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const ageFromUrl = searchParams.get('age');
  const selectedAge = AGE_GROUP_IDS.includes(ageFromUrl)
    ? ageFromUrl
    : loadSelectedAge();

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedAge) {
      navigate('/', { replace: true });
      return;
    }

    if (ageFromUrl !== selectedAge) {
      saveSelectedAge(selectedAge);
      setSearchParams({ age: selectedAge }, { replace: true });
    }
  }, [selectedAge, ageFromUrl, navigate, setSearchParams]);

  useEffect(() => {
    if (!selectedAge) return;
    fetchBooks(selectedAge);
  }, [selectedAge]);

  const fetchBooks = async (ageGroup) => {
    try {
      setLoading(true);
      const response = await booksAPI.getPublishedBooks({ ageGroup });
      setBooks(response.data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const ageMeta = getAgeGroup(selectedAge);

  const categories = useMemo(
    () => [...new Set(books.map((book) => book.category).filter(Boolean))],
    [books]
  );

  const filteredBooks = books.filter((book) => {
    if (book.ageGroup !== selectedAge) return false;
    if (selectedCategory && book.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const hay = `${book.title} ${book.description} ${book.category}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const getCoverImageUrl = (coverImage) => {
    if (!coverImage) return null;
    if (coverImage.startsWith('data:image/') || coverImage.startsWith('data:application/')) {
      return coverImage;
    }
    if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
      return coverImage;
    }
    if (coverImage.startsWith('/9j/') || coverImage.startsWith('iVBORw0KGgo')) {
      const mimeType = coverImage.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      return `data:${mimeType};base64,${coverImage}`;
    }
    const baseUrl = getBaseBackendURL();
    return baseUrl
      ? `${baseUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`
      : coverImage;
  };

  const changeAge = (ageId) => {
    saveSelectedAge(ageId);
    setSelectedCategory('');
    setSearchQuery('');
    setSelectedBook(null);
    setSearchParams({ age: ageId });
  };

  if (!selectedAge) {
    return null;
  }

  if (selectedBook) {
    return <FlipBookReader book={selectedBook} onClose={() => setSelectedBook(null)} />;
  }

  return (
    <div className="site-shell">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center shadow-soft"
              title="Home"
            >
              <HomeIcon className="w-5 h-5" />
            </Link>
            <div>
              <div className="font-display text-xl font-bold text-ink-900 leading-none">HKids</div>
              <div className="text-sm text-ink-500 flex items-center gap-1.5 mt-1">
                <Library className="w-3.5 h-3.5" />
                Library
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className={`chip bg-white border border-ink-200 ${ageMeta?.accent || ''}`}>
              <AgeIcon ageId={selectedAge} className="w-4 h-4" />
              {ageMeta?.label || selectedAge}
            </div>
            <Link to="/" className="btn-ghost btn-large text-sm px-4 py-2 min-h-0">
              <RefreshCcw className="w-4 h-4" />
              Change age
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink-900 mb-2">
            Your library
          </h1>
          <p className="text-ink-500 text-lg">
            Showing books for <span className="font-semibold text-brand-700">{ageMeta?.label}</span> only.
          </p>
        </div>

        <div className="surface-panel p-4 md:p-5 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-ink-500 mb-2">Search</label>
              <div className="relative">
                <Search className="w-5 h-5 text-ink-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or topic"
                  className="field-input pl-12"
                />
              </div>
            </div>

            <div className="w-full lg:w-56">
              <label className="block text-sm font-semibold text-ink-500 mb-2">Category</label>
              <div className="relative">
                <Filter className="w-4 h-4 text-ink-300 absolute left-4 top-1/2 -translate-y-1/2" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="field-input pl-10 appearance-none"
                >
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full lg:w-56">
              <label className="block text-sm font-semibold text-ink-500 mb-2">Age group</label>
              <select
                value={selectedAge}
                onChange={(e) => changeAge(e.target.value)}
                className="field-input"
              >
                {AGE_GROUPS.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-24 text-ink-500 text-xl">Loading books…</div>
        ) : filteredBooks.length === 0 ? (
          <div className="surface-panel p-12 text-center">
            <BookOpen className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">No books in this age group yet</h2>
            <p className="text-ink-500 mb-6">Try another age group, or ask an admin to publish books.</p>
            <Link to="/" className="btn-primary btn-large">
              Choose another age
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBooks.map((book, index) => {
              const coverImageUrl = getCoverImageUrl(book.coverImage);
              return (
                <motion.button
                  key={book._id}
                  type="button"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.04, 0.3) }}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedBook(book)}
                  className="text-left surface-panel overflow-hidden group"
                >
                  <div className="relative h-56 bg-ink-100 overflow-hidden">
                    {coverImageUrl ? (
                      <img
                        src={coverImageUrl}
                        alt={book.title}
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white">
                        <BookOpen className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-ink-900 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-ink-500 mb-4 line-clamp-2 text-sm leading-relaxed">
                      {book.description || 'Open this book to start reading.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="chip bg-brand-50 text-brand-700">
                        <AgeIcon ageId={book.ageGroup} className="w-3.5 h-3.5" />
                        {getAgeGroup(book.ageGroup)?.shortLabel || book.ageGroup}
                      </span>
                      <span className="chip bg-ink-100 text-ink-700">{book.category}</span>
                      <span className="chip bg-white border border-ink-200 text-ink-500">
                        {book.pages?.length || 0} pages
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ReadingInterface;
