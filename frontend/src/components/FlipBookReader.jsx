import { useRef, useState, useEffect, forwardRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { getBaseBackendURL } from '../services/api';

const normalizeImageUrl = (imageUrl) => {
  if (!imageUrl) return null;

  if (imageUrl.startsWith('data:image/') || imageUrl.startsWith('data:application/')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  if (imageUrl.startsWith('/9j/') || imageUrl.startsWith('iVBORw0KGgo')) {
    const mimeType = imageUrl.startsWith('/9j/') ? 'image/jpeg' : 'image/png';
    return `data:${mimeType};base64,${imageUrl}`;
  }

  const baseUrl = getBaseBackendURL();
  return baseUrl
    ? `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
    : imageUrl;
};

const BookPage = forwardRef(({ src, alt, label, hideLabel }, ref) => (
  <div
    ref={ref}
    className="book-page bg-[#faf6ee] overflow-hidden relative"
    style={{
      width: '100%',
      height: '100%',
      boxShadow: 'inset 0 0 40px rgba(0,0,0,0.08)'
    }}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain select-none"
      draggable={false}
    />
    {label && !hideLabel && (
      <span className="absolute bottom-3 right-4 text-xs text-stone-500/80 font-medium">
        {label}
      </span>
    )}
  </div>
));

BookPage.displayName = 'BookPage';

const FlipBookReader = ({ book, onClose }) => {
  const flipBookRef = useRef(null);
  const readerRef = useRef(null);
  const hideTimerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [bookSize, setBookSize] = useState({ width: 420, height: 560 });
  const [usePortrait, setUsePortrait] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  const cover = normalizeImageUrl(book.coverImage);
  const pages = (book.pages || []).map(normalizeImageUrl).filter(Boolean);
  const allPages =
    cover && pages[0] !== cover ? [cover, ...pages] : pages.length > 0 ? pages : cover ? [cover] : [];
  const totalPages = allPages.length;

  const updateSize = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fullscreen = Boolean(document.fullscreenElement);
    const portrait = vw < 768;
    setUsePortrait(portrait);

    if (fullscreen) {
      const chrome = 24;
      if (portrait) {
        setBookSize({
          width: Math.max(260, vw - chrome),
          height: Math.max(360, vh - chrome)
        });
      } else {
        setBookSize({
          width: Math.floor((vw - chrome) / 2),
          height: vh - chrome
        });
      }
      return;
    }

    const maxH = Math.min(vh - 180, 720);
    const pageW = portrait
      ? Math.min(Math.floor(vw - 48), 420)
      : Math.min(Math.floor(maxH * 0.72), Math.floor((vw - 80) / 2), 480);
    setBookSize({ width: pageW, height: Math.floor(pageW * 1.33) });
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      setControlsVisible(true);
      requestAnimationFrame(updateSize);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('resize', updateSize);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [updateSize]);

  useEffect(() => {
    if (!isFullscreen) {
      setControlsVisible(true);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      return undefined;
    }

    const scheduleHide = () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
    };

    scheduleHide();
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isFullscreen, currentPage]);

  const revealControls = () => {
    setControlsVisible(true);
    if (!isFullscreen) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setControlsVisible(false), 2500);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await readerRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  const flipNext = () => flipBookRef.current?.pageFlip()?.flipNext();
  const flipPrev = () => flipBookRef.current?.pageFlip()?.flipPrev();
  const onFlip = (e) => setCurrentPage(e.data);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        flipBookRef.current?.pageFlip()?.flipNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        flipBookRef.current?.pageFlip()?.flipPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        if (e.target?.tagName === 'INPUT' || e.target?.tagName === 'TEXTAREA') return;
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      ref={readerRef}
      className={`fullscreen book-reader-bg flex flex-col ${isFullscreen ? 'is-fullscreen' : ''}`}
      onMouseMove={revealControls}
      onTouchStart={revealControls}
    >
      <div
        className={`bg-black/40 text-white px-4 py-3 flex justify-between items-center backdrop-blur-sm z-20 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button onClick={onClose} className="btn-large bg-accent-coral text-white text-base min-h-0 py-2.5 px-4">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="font-display text-lg md:text-2xl font-bold truncate px-4">{book.title}</h2>
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-sm md:text-lg whitespace-nowrap">
            {Math.min(currentPage + 1, totalPages)} / {totalPages}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="btn-large bg-brand-600 text-white text-sm md:text-base min-h-0 py-2.5 px-3 md:px-4"
            title={isFullscreen ? 'Exit full screen (F)' : 'Full screen (F)'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full screen'}</span>
          </button>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center overflow-hidden ${isFullscreen ? 'px-0 py-0' : 'px-2 py-4'}`}>
        <div className="book-stage relative">
          {!isFullscreen && <div className="book-glow pointer-events-none" />}
          {totalPages > 0 ? (
            <HTMLFlipBook
              key={`book-${isFullscreen ? 'fs' : 'win'}`}
              width={bookSize.width}
              height={bookSize.height}
              size="fixed"
              minWidth={240}
              maxWidth={isFullscreen ? 1400 : 560}
              minHeight={320}
              maxHeight={isFullscreen ? 1200 : 760}
              showCover
              mobileScrollSupport
              onFlip={onFlip}
              className="flip-book shadow-2xl"
              ref={flipBookRef}
              drawShadow
              flippingTime={700}
              usePortrait={usePortrait}
              startZIndex={1}
              autoSize={false}
              maxShadowOpacity={0.45}
              showPageCorners
              disableFlipByClick={false}
              startPage={currentPage}
            >
              {allPages.map((src, index) => (
                <BookPage
                  key={`${book._id}-page-${index}`}
                  src={src}
                  alt={index === 0 ? `${book.title} cover` : `Page ${index}`}
                  label={index === 0 ? 'Cover' : String(index)}
                  hideLabel={isFullscreen}
                />
              ))}
            </HTMLFlipBook>
          ) : (
            <div className="text-white text-2xl">This book has no pages yet.</div>
          )}
        </div>
      </div>

      <div
        className={`bg-black/40 p-4 md:p-6 flex justify-center gap-4 md:gap-8 backdrop-blur-sm z-20 transition-opacity duration-300 ${
          controlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={flipPrev}
          disabled={currentPage === 0}
          className={`btn-large min-h-0 py-3 px-5 ${
            currentPage === 0 ? 'bg-gray-600 cursor-not-allowed text-white' : 'bg-brand-600 text-white'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>
        <button
          onClick={flipNext}
          disabled={currentPage >= totalPages - 1}
          className={`btn-large min-h-0 py-3 px-5 ${
            currentPage >= totalPages - 1
              ? 'bg-gray-600 cursor-not-allowed text-white'
              : 'bg-accent-leaf text-white'
          }`}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FlipBookReader;
