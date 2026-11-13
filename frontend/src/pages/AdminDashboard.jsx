import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  LogOut,
  BookOpen,
  CheckCircle2,
  FileWarning,
  Home
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import { booksAPI } from '../services/api';
import BookForm from '../components/BookForm';
import BookCard from '../components/BookCard';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await booksAPI.deleteBook(id);
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingBook(null);
    fetchBooks();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const publishedCount = books.filter((b) => b.isPublished).length;
  const draftCount = books.filter((b) => !b.isPublished).length;

  return (
    <div className="site-shell">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand-600 text-white flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-ink-900">Admin dashboard</h1>
              <p className="text-sm text-ink-500">Welcome, {user?.username}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link to="/" className="btn-ghost btn-large text-base min-h-0 py-2.5 px-4">
              <Home className="w-4 h-4" />
              Site
            </Link>
            <button onClick={handleCreate} className="btn-success btn-large text-base min-h-0 py-2.5 px-4">
              <Plus className="w-4 h-4" />
              Add book
            </button>
            <button onClick={handleLogout} className="btn-accent btn-large text-base min-h-0 py-2.5 px-4">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="surface-panel p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-ink-900">{books.length}</div>
              <div className="text-ink-500">Total books</div>
            </div>
          </div>
          <div className="surface-panel p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-50 text-accent-leaf flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-ink-900">{publishedCount}</div>
              <div className="text-ink-500">Published</div>
            </div>
          </div>
          <div className="surface-panel p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-accent-coral flex items-center justify-center">
              <FileWarning className="w-6 h-6" />
            </div>
            <div>
              <div className="font-display text-3xl font-bold text-ink-900">{draftCount}</div>
              <div className="text-ink-500">Drafts</div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-ink-500 text-xl py-20">Loading books…</div>
        ) : books.length === 0 ? (
          <div className="surface-panel p-12 text-center">
            <BookOpen className="w-12 h-12 text-brand-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold mb-2">No books yet</h2>
            <p className="text-ink-500 mb-6">Upload your first PDF or page set to get started.</p>
            <button onClick={handleCreate} className="btn-success btn-large">
              <Plus className="w-5 h-5" />
              Add first book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showForm && (
        <BookForm
          book={editingBook}
          onClose={handleFormClose}
          onSuccess={handleFormClose}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
