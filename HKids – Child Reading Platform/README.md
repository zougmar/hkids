# 📚 HKids – Child Reading Platform

A complete digital reading platform designed for young children, featuring a distraction-free reading interface and a secure content management system for administrators.

## 🎯 Features

### Child Reading Interface
- **Full-screen distraction-free UI** - Immersive reading experience
- **Page flip animations** - Smooth transitions using Framer Motion
- **Large, child-friendly buttons** - Easy navigation for young users
- **Category & age group filtering** - Find books by age (3-5, 6-8, 9-12) and category
- **No ads, no external links** - Safe, focused reading environment

### Admin Dashboard
- **Secure authentication** - JWT-based admin login
- **Book management** - Upload, edit, delete books
- **Content organization** - Categorize by age group and category
- **Publish control** - Toggle book visibility (published/unpublished)
- **File upload** - Support for PDF and image formats

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite) - Modern React with fast build tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth page flip animations
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** (Mongoose) - NoSQL database
- **JWT** - Secure authentication
- **Multer** - File upload handling

## 📁 Project Structure

```
HKids – Child Reading Platform/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/         # API and auth services
│   │   ├── assets/          # Static assets
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── controllers/         # Request handlers
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── middleware/          # Auth middleware
│   ├── uploads/             # Uploaded book files
│   ├── server.js            # Express server
│   └── package.json
├── README.md
└── architecture.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   cd "HKids – Child Reading Platform"
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   Backend: Create `backend/.env` from `backend/.env.example`
   ```env
   MONGODB_URI=mongodb://localhost:27017/hkids
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   PORT=5000
   FRONTEND_URL=http://localhost:5173
   ```

   Frontend: Create `frontend/.env` from `frontend/.env.example`
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas (cloud) and update `MONGODB_URI` in `.env`

6. **Seed the database** (optional)
   ```bash
   cd backend
   npm run seed
   ```
   
   This creates a sample admin account and books:
   - **Email:** admin@hkids.com
   - **Password:** admin123

7. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   
   Server runs on `http://localhost:5000`

8. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   
   Frontend runs on `http://localhost:5173`

## 📖 Usage

### For Children (Reading Interface)

1. Navigate to `http://localhost:5173`
2. Click **"Start Reading"**
3. Filter books by age group and category
4. Click on a book to open it
5. Use **Previous** and **Next** buttons or swipe to navigate pages
6. Click **Back** to return to book selection

### For Administrators

1. Navigate to `http://localhost:5173/admin/login`
2. Login with admin credentials:
   - Email: `admin@hkids.com`
   - Password: `admin123`
3. **Add a new book:**
   - Click **"+ Add Book"**
   - Fill in book details (title, description, age group, category)
   - Upload cover image
   - Upload page images (multiple files)
   - Toggle "Publish immediately" if you want it visible to children
   - Click **"Create Book"**
4. **Edit a book:**
   - Click **"Edit"** on any book card
   - Modify fields and upload new images if needed
   - Click **"Update Book"**
5. **Delete a book:**
   - Click **"Delete"** on any book card
   - Confirm deletion

## 🔒 Security Features

- JWT-based authentication for admin access
- Password hashing with bcrypt
- Protected API routes (admin-only endpoints)
- File upload validation (images and PDFs only)
- CORS configuration for secure cross-origin requests

## 🎨 Design Principles

- **Child-friendly colors:** Soft blue, green, and orange
- **Large, readable fonts:** Easy for children to read
- **Rounded corners:** Friendly, approachable design
- **Simple navigation:** Large buttons, clear icons
- **Distraction-free:** No ads, no external links

## 📝 API Endpoints

### Public Endpoints
- `GET /api/books/published` - Get all published books
- `GET /api/health` - Health check

### Auth Endpoints
- `POST /api/auth/register` - Register new admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/profile` - Get current user (protected)

### Book Endpoints (Admin Only)
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create new book
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

## 🧪 Development

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚢 Production Deployment

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set production environment variables:**
   - Update `MONGODB_URI` to production database
   - Set strong `JWT_SECRET`
   - Configure `FRONTEND_URL` for production domain

3. **Serve frontend:**
   - Deploy `frontend/dist` to a static hosting service (Vercel, Netlify, etc.)
   - Or serve via Express static middleware

4. **Deploy backend:**
   - Deploy to services like Heroku, Railway, or AWS
   - Ensure MongoDB is accessible
   - Configure environment variables

## 🔮 Future Enhancements

The architecture is designed to support:
- **Audio narration** - Text-to-speech or recorded audio
- **Parental dashboard** - Track reading progress, set time limits
- **Reading analytics** - Track which books are popular
- **Multi-language support** - Books in different languages
- **Offline mode** - PWA support for offline reading

## 📄 License

This project is a Proof of Concept (POC) for educational purposes.

## 👥 Contributing

This is a POC project. For production use, consider:
- Adding comprehensive error handling
- Implementing rate limiting
- Adding input validation and sanitization
- Setting up automated testing
- Adding CI/CD pipeline
- Implementing proper logging

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Verify `MONGODB_URI` in `.env` is correct

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env` accordingly

### File Upload Issues
- Ensure `backend/uploads` directory exists and is writable
- Check file size limits (default: 10MB)
- Verify file types (images and PDFs only)

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that frontend is making requests to correct API URL

---

**Built with ❤️ for young readers**
