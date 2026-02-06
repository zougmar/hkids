import axios from 'axios';

// Determine API URL: use env var if set, otherwise use relative URL (same domain)
// In production (Vercel), API routes are on the same domain, so we use relative URLs
const getAPIURL = () => {
  // Always use VITE_API_URL if explicitly set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development mode (Vite dev server), use localhost
  if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
    return 'http://localhost:5000/api';
  }
  
  // In production (Vercel), use relative URL
  return '/api';
};

const API_URL = getAPIURL();

// Get base backend URL (without /api) for serving images and static files
export const getBaseBackendURL = () => {
  const apiUrl = getAPIURL();
  // If it's a relative URL, return empty string (same domain)
  if (apiUrl.startsWith('/')) {
    return '';
  }
  // Remove /api suffix if present
  return apiUrl.replace(/\/api\/?$/, '');
};

// Log API URL for debugging
console.log('🔗 API URL:', API_URL);
console.log('🔗 Base Backend URL:', getBaseBackendURL());

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log detailed error for debugging
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timeout - API took too long to respond');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Network error - Cannot reach API server');
      console.error('API URL:', API_URL);
    } else if (error.response) {
      console.error('📡 API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Request error:', error.message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  getProfile: () => api.get('/auth/profile')
};

// Books API
export const booksAPI = {
  // Public - Get published books
  getPublishedBooks: (params = {}) => api.get('/books/published', { params }),
  
  // Admin - Get all books
  getAllBooks: () => api.get('/books'),
  
  // Admin - Get single book
  getBookById: (id) => api.get(`/books/${id}`),
  
  // Admin - Create book
  createBook: (data) => api.post('/books', data),
  
  // Admin - Update book
  updateBook: (id, data) => api.put(`/books/${id}`, data),
  
  // Admin - Delete book
  deleteBook: (id) => api.delete(`/books/${id}`)
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
