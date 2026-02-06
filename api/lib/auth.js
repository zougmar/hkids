import jwt from 'jsonwebtoken';
import User from '../../backend/models/User.js';

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verify JWT token and get user
 */
export const verifyToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('No token provided');
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.userId).select('-password');
  
  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Check if user is admin
 */
export const checkAdmin = (user) => {
  if (!user || user.role !== 'admin') {
    throw new Error('Access denied. Admin privileges required.');
  }
};
