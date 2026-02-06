import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Book from './models/Book.js';

dotenv.config();

/**
 * Seed script to populate database with sample data
 */
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hkids');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    // Note: Pass plain password - User model will hash it automatically
    const admin = await User.create({
      username: 'admin',
      email: 'admin@hkids.com',
      password: 'admin123', // Plain password - will be hashed by User model
      role: 'admin'
    });
    console.log('👤 Created admin user:', admin.username);

    // Create sample books (without actual files, using placeholder paths)
    const sampleBooks = [
      {
        title: 'The Little Red Hen',
        description: 'A classic tale about hard work and cooperation',
        ageGroup: '3-5',
        category: 'Fairy Tales',
        coverImage: '/uploads/placeholder-cover-1.jpg',
        pages: [
          '/uploads/placeholder-page-1-1.jpg',
          '/uploads/placeholder-page-1-2.jpg',
          '/uploads/placeholder-page-1-3.jpg'
        ],
        fileType: 'images',
        isPublished: true,
        uploadedBy: admin._id
      },
      {
        title: 'Adventures in Space',
        description: 'Join Captain Star on an exciting space adventure',
        ageGroup: '6-8',
        category: 'Adventure',
        coverImage: '/uploads/placeholder-cover-2.jpg',
        pages: [
          '/uploads/placeholder-page-2-1.jpg',
          '/uploads/placeholder-page-2-2.jpg',
          '/uploads/placeholder-page-2-3.jpg',
          '/uploads/placeholder-page-2-4.jpg'
        ],
        fileType: 'images',
        isPublished: true,
        uploadedBy: admin._id
      },
      {
        title: 'The Magic Forest',
        description: 'Discover the secrets of the enchanted forest',
        ageGroup: '3-5',
        category: 'Fantasy',
        coverImage: '/uploads/placeholder-cover-3.jpg',
        pages: [
          '/uploads/placeholder-page-3-1.jpg',
          '/uploads/placeholder-page-3-2.jpg'
        ],
        fileType: 'images',
        isPublished: true,
        uploadedBy: admin._id
      },
      {
        title: 'Science Explorers',
        description: 'Learn about the wonders of science',
        ageGroup: '9-12',
        category: 'Educational',
        coverImage: '/uploads/placeholder-cover-4.jpg',
        pages: [
          '/uploads/placeholder-page-4-1.jpg',
          '/uploads/placeholder-page-4-2.jpg',
          '/uploads/placeholder-page-4-3.jpg',
          '/uploads/placeholder-page-4-4.jpg',
          '/uploads/placeholder-page-4-5.jpg'
        ],
        fileType: 'images',
        isPublished: true,
        uploadedBy: admin._id
      },
      {
        title: 'Animal Friends',
        description: 'Meet friendly animals from around the world',
        ageGroup: '3-5',
        category: 'Animals',
        coverImage: '/uploads/placeholder-cover-5.jpg',
        pages: [
          '/uploads/placeholder-page-5-1.jpg',
          '/uploads/placeholder-page-5-2.jpg',
          '/uploads/placeholder-page-5-3.jpg'
        ],
        fileType: 'images',
        isPublished: false, // Unpublished example
        uploadedBy: admin._id
      }
    ];

    const createdBooks = await Book.insertMany(sampleBooks);
    console.log(`📚 Created ${createdBooks.length} sample books`);

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📝 Sample Admin Credentials:');
    console.log('   Email: admin@hkids.com');
    console.log('   Password: admin123');
    console.log('\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
