import { useState, useEffect } from 'react';
import { getBaseBackendURL } from '../services/api';

const BookCard = ({ book, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  
  useEffect(() => {
    if (!book.coverImage) {
      setCoverImageUrl(null);
      return;
    }
    
    // Check if it's a base64 data URL
    if (book.coverImage.startsWith('data:image/') || book.coverImage.startsWith('data:application/')) {
      setCoverImageUrl(book.coverImage);
      return;
    }
    
    // Check if it's a full URL
    if (book.coverImage.startsWith('http://') || book.coverImage.startsWith('https://')) {
      setCoverImageUrl(book.coverImage);
      return;
    }
    
    // Check if it might be base64 without data: prefix (fix it)
    if (book.coverImage.startsWith('/9j/') || book.coverImage.startsWith('iVBORw0KGgo')) {
      // It's base64 JPEG or PNG without prefix, add it
      const mimeType = book.coverImage.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      setCoverImageUrl(`data:${mimeType};base64,${book.coverImage}`);
      return;
    }
    
    // Otherwise, treat as relative path
    const baseUrl = getBaseBackendURL();
    if (baseUrl) {
      setCoverImageUrl(`${baseUrl}${book.coverImage.startsWith('/') ? '' : '/'}${book.coverImage}`);
    } else {
      setCoverImageUrl(book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`);
    }
  }, [book.coverImage]);

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="relative">
        {!imageError && coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={book.title}
            className="w-full h-64 object-cover"
            onError={(e) => {
              console.error('Image load error:', {
                src: coverImageUrl,
                bookId: book._id,
                coverImage: book.coverImage?.substring(0, 50)
              });
              setImageError(true);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', book.title);
            }}
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
