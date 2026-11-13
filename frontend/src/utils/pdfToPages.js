import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const MAX_PAGES = 50;
const RENDER_SCALE = 1.5;

/**
 * Convert a PDF File into an array of JPEG data URLs (one per page).
 */
export async function pdfFileToPageImages(file, onProgress) {
  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const total = Math.min(pdf.numPages, MAX_PAGES);
  const pages = [];

  for (let pageNum = 1; pageNum <= total; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: RENDER_SCALE });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    pages.push(canvas.toDataURL('image/jpeg', 0.82));

    if (onProgress) {
      onProgress(pageNum, total);
    }
  }

  return pages;
}
