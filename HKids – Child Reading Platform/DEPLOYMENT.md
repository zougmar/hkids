# 🚀 Deployment Guide - HKids Platform

## Deploying to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available) or your own MongoDB instance

### Step 1: Push to GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   ```

2. **Add all files:**
   ```bash
   git add .
   ```

3. **Create initial commit:**
   ```bash
   git commit -m "Initial commit: HKids Child Reading Platform"
   ```

4. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `hkids-platform` (or your preferred name)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

5. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hkids-platform.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy Frontend to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Environment Variables:**
   Add these in Vercel project settings:
   ```
   VITE_API_URL=https://your-backend-url.vercel.app/api
   ```
   (You'll update this after deploying the backend)

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Note the frontend URL (e.g., `hkids-platform.vercel.app`)

### Step 3: Deploy Backend to Vercel

**Important:** Vercel is primarily for frontend/static sites. For the backend, you have two options:

#### Option A: Deploy Backend to Vercel (Serverless Functions)

1. **Create API routes structure:**
   ```
   api/
     auth/
       login.js
       register.js
     books/
       index.js
       [id].js
   ```

2. **Convert Express routes to Vercel serverless functions**

3. **Deploy as separate Vercel project**

#### Option B: Deploy Backend to Railway/Render (Recommended)

**Railway (Recommended):**

1. **Go to Railway:**
   - Visit https://railway.app
   - Sign up with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Configure:**
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
   - **Build Command:** `npm install`

4. **Environment Variables:**
   Add in Railway dashboard:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Get Backend URL:**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Update frontend `VITE_API_URL` in Vercel to this URL

**Render (Alternative):**

1. **Go to Render:**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create New Web Service:**
   - Connect your GitHub repo
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

3. **Environment Variables:**
   Same as Railway above

### Step 4: Set Up MongoDB Atlas (Cloud)

1. **Create MongoDB Atlas Account:**
   - Visit https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster:**
   - Choose free tier (M0)
   - Select region closest to you
   - Create cluster

3. **Configure Database Access:**
   - Go to "Database Access"
   - Add new database user
   - Username: `hkids-admin`
   - Password: (generate secure password)
   - Save credentials

4. **Configure Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add specific IPs

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://hkids-admin:password@cluster0.xxxxx.mongodb.net/hkids?retryWrites=true&w=majority`

6. **Add to Backend Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://hkids-admin:password@cluster0.xxxxx.mongodb.net/hkids?retryWrites=true&w=majority
   ```

### Step 5: Update Frontend API URL

1. **Go to Vercel Dashboard:**
   - Select your frontend project
   - Go to "Settings" → "Environment Variables"
   - Update `VITE_API_URL` to your backend URL:
     ```
     VITE_API_URL=https://your-backend.railway.app/api
     ```

2. **Redeploy:**
   - Go to "Deployments"
   - Click "Redeploy" on latest deployment

### Step 6: Seed Database

After backend is deployed and MongoDB is connected:

1. **SSH into your backend (if possible)**
   OR
2. **Create a seed endpoint** (temporary):
   ```javascript
   // backend/routes/seedRoutes.js
   router.post('/seed', async (req, res) => {
     // Run seed script
   });
   ```
   Then call: `POST https://your-backend-url/api/seed`

3. **Or use MongoDB Compass:**
   - Connect to your Atlas cluster
   - Manually insert admin user

### Step 7: File Uploads (Important!)

**Problem:** Vercel/Railway file systems are ephemeral. Uploaded files will be lost on restart.

**Solutions:**

1. **Use Cloud Storage (Recommended):**
   - **AWS S3** or **Cloudinary**
   - Update `backend/routes/bookRoutes.js` to upload to cloud storage
   - Store URLs in database instead of file paths

2. **Use Vercel Blob Storage:**
   - Vercel's built-in file storage
   - Requires Vercel Pro plan

3. **External File Service:**
   - Use services like Imgur, ImgBB for images
   - Store URLs in database

### Environment Variables Summary

**Frontend (Vercel):**
```
VITE_API_URL=https://your-backend-url.railway.app/api
```

**Backend (Railway/Render):**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] MongoDB Atlas configured and connected
- [ ] Environment variables set in both services
- [ ] Database seeded with admin user
- [ ] Frontend API URL updated
- [ ] Test login functionality
- [ ] Test book upload (if using cloud storage)
- [ ] Update CORS settings if needed

### Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_API_URL` in Vercel environment variables
- Verify backend URL is accessible
- Check CORS settings in backend

**Backend can't connect to MongoDB:**
- Verify MongoDB Atlas network access allows your backend IP
- Check connection string format
- Verify database user credentials

**File uploads not working:**
- Implement cloud storage (S3/Cloudinary)
- Or use external image hosting service

### Alternative: Full-Stack on Vercel

If you want everything on Vercel, you can:
1. Convert Express routes to Vercel API routes
2. Use Vercel serverless functions
3. Store files in Vercel Blob (Pro plan) or external storage

This requires significant code restructuring.

---

**Recommended Setup:**
- Frontend: Vercel (free)
- Backend: Railway (free tier available) or Render (free tier)
- Database: MongoDB Atlas (free tier)
- File Storage: Cloudinary (free tier) or AWS S3
