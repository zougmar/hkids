import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get base backend URL (without /api) for serving images and static files
export const getBaseBackendURL = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
  }
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
