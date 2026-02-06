import { useState } from 'react';
import { getBaseBackendURL } from '../services/api';

const BookCard = ({ book, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  
  // Handle base64 images or URLs
  const coverImageUrl = book.coverImage?.startsWith('data:') || book.coverImage?.startsWith('http')
    ? book.coverImage
    : `${getBaseBackendURL()}${book.coverImage}`;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="relative">
        {!imageError ? (
          <img
            src={coverImageUrl}
            alt={book.title}
            className="w-full h-64 object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-primary-blue to-primary-green flex items-center justify-center text-6xl">
            📚
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              book.isPublished
                ? 'bg-primary-green text-white'
                : 'bg-gray-400 text-white'
            }`}
          >
            {book.isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2">{book.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{book.description}</p>

        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-blue text-white rounded-full text-sm">
            Ages {book.ageGroup}
          </span>
          <span className="px-3 py-1 bg-primary-green text-white rounded-full text-sm">
            {book.category}
          </span>
        </div>

        <div className="text-sm text-gray-500 mb-4">
          {book.pages?.length || 0} pages
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(book)}
            className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-xl hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
