import { useState, useEffect } from 'react';
import { BookOpen, Pencil, Trash2, Layers } from 'lucide-react';
import { getBaseBackendURL } from '../services/api';
import { getAgeGroup } from '../constants/ageGroups';
import { AgeIcon } from './AgeIcons';

const BookCard = ({ book, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(null);

  useEffect(() => {
    if (!book.coverImage) {
      setCoverImageUrl(null);
      return;
    }

    if (book.coverImage.startsWith('data:image/') || book.coverImage.startsWith('data:application/')) {
      setCoverImageUrl(book.coverImage);
      return;
    }

    if (book.coverImage.startsWith('http://') || book.coverImage.startsWith('https://')) {
      setCoverImageUrl(book.coverImage);
      return;
    }

    if (book.coverImage.startsWith('/9j/') || book.coverImage.startsWith('iVBORw0KGgo')) {
      const mimeType = book.coverImage.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
      setCoverImageUrl(`data:${mimeType};base64,${book.coverImage}`);
      return;
    }

    const baseUrl = getBaseBackendURL();
    if (baseUrl) {
      setCoverImageUrl(`${baseUrl}${book.coverImage.startsWith('/') ? '' : '/'}${book.coverImage}`);
    } else {
      setCoverImageUrl(book.coverImage.startsWith('/') ? book.coverImage : `/${book.coverImage}`);
    }
  }, [book.coverImage]);

  const ageMeta = getAgeGroup(book.ageGroup);

  return (
    <article className="surface-panel overflow-hidden">
      <div className="relative h-52 bg-ink-100">
        {!imageError && coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <BookOpen className="w-12 h-12" />
          </div>
        )}
        <span
          className={`absolute top-3 right-3 chip ${
            book.isPublished
              ? 'bg-accent-leaf text-white'
              : 'bg-ink-500 text-white'
          }`}
        >
          {book.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-ink-900 mb-2">{book.title}</h3>
        <p className="text-ink-500 mb-4 line-clamp-2 text-sm">{book.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="chip bg-brand-50 text-brand-700">
            <AgeIcon ageId={book.ageGroup} className="w-3.5 h-3.5" />
            {ageMeta?.label || book.ageGroup}
          </span>
          <span className="chip bg-ink-100 text-ink-700">{book.category}</span>
        </div>

        <div className="text-sm text-ink-500 mb-4 flex items-center gap-1.5">
          <Layers className="w-4 h-4" />
          {book.pages?.length || 0} pages
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(book)}
            className="flex-1 btn-primary btn-large text-base min-h-0 py-2.5"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(book._id)}
            className="flex-1 btn-large text-base min-h-0 py-2.5 bg-red-500 text-white hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default BookCard;
