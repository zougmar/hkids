import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-primary-blue">📚 Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome, {user?.username}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleCreate}
              className="btn-large bg-primary-green text-white"
            >
              + Add Book
            </button>
            <button
              onClick={handleLogout}
              className="btn-large bg-primary-orange text-white"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary-blue">{books.length}</div>
            <div className="text-gray-600">Total Books</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary-green">
              {books.filter(b => b.isPublished).length}
            </div>
            <div className="text-gray-600">Published</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-primary-orange">
              {books.filter(b => !b.isPublished).length}
            </div>
            <div className="text-gray-600">Unpublished</div>
          </div>
        </div>

        {/* Books List */}
        {loading ? (
          <div className="text-center text-3xl py-20">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📖</div>
            <h2 className="text-2xl font-bold mb-2">No books yet</h2>
            <p className="text-gray-600 mb-6">Get started by adding your first book!</p>
            <button
              onClick={handleCreate}
              className="btn-large bg-primary-green text-white"
            >
              + Add First Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Book Form Modal */}
        {showForm && (
          <BookForm
            book={editingBook}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
