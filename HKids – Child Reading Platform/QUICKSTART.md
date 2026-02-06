# 🚀 Quick Start Guide - HKids Platform

## Step-by-Step Instructions

### 1. Prerequisites Check

Make sure you have installed:
- **Node.js** (v18+) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) OR use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud option)

Verify installation:
```bash
node --version
npm --version
mongod --version  # If using local MongoDB
```

### 2. Install Dependencies

Open a terminal in the project root directory:

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

**Backend (.env file):**

Create `backend/.env` file with:
```env
MONGODB_URI=mongodb://localhost:27017/hkids
JWT_SECRET=hkids_secret_key_2024_change_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

**For MongoDB Atlas (Cloud):**
- Get your connection string from MongoDB Atlas
- Replace `MONGODB_URI` with: `mongodb+srv://username:password@cluster.mongodb.net/hkids`

**Frontend (.env file):**

Create `frontend/.env` file with:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# On Windows (if MongoDB is installed as service, it may already be running)
# Or start manually:
mongod
```

**Option B: MongoDB Atlas (Cloud)**
- No need to start anything, just use the connection string in `.env`

### 5. Seed the Database (Optional but Recommended)

This creates a sample admin account and books:
```bash
cd backend
npm run seed
```

**Sample Admin Credentials:**
- Email: `admin@hkids.com`
- Password: `admin123`

### 6. Start the Backend Server

Open a terminal and run:
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📚 HKids Backend API ready
```

### 7. Start the Frontend Server

Open a **NEW terminal** (keep backend running) and run:
```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 8. Access the Application

Open your browser and go to:
- **Main App:** http://localhost:5173
- **Admin Login:** http://localhost:5173/admin/login

## 🎯 What to Do Next

### For Children (Reading Interface):
1. Click **"Start Reading"** on the home page
2. Filter books by age group (3-5, 6-8, 9-12) or category
3. Click on any book to start reading
4. Use **Previous** and **Next** buttons to navigate pages

### For Administrators:
1. Go to **Admin Login** page
2. Login with: `admin@hkids.com` / `admin123`
3. Click **"+ Add Book"** to upload new books
4. Fill in book details and upload cover + page images
5. Toggle **"Publish immediately"** to make it visible to children
6. Edit or delete existing books as needed

## 🐛 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB connection error
```
**Solution:**
- Make sure MongoDB is running (`mongod` command)
- Check `MONGODB_URI` in `backend/.env` is correct
- For Atlas: Verify username/password and network access

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change `PORT` in `backend/.env` to another port (e.g., 5001)
- Update `VITE_API_URL` in `frontend/.env` accordingly

### Frontend Can't Connect to Backend
**Solution:**
- Make sure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env` matches backend URL
- Verify CORS settings in `backend/server.js`

### Module Not Found Errors
**Solution:**
- Delete `node_modules` folders
- Delete `package-lock.json` files
- Run `npm install` again in both frontend and backend

### File Upload Issues
**Solution:**
- Make sure `backend/uploads` directory exists
- Check file size (max 10MB)
- Only upload images (JPG, PNG) or PDFs

## 📝 Development Commands

### Backend:
- `npm run dev` - Start development server (with auto-reload)
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

### Frontend:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎉 You're All Set!

The platform is now running. Start by logging in as admin and uploading some books, then test the reading interface!
