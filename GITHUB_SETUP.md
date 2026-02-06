# 📦 Push to GitHub - Quick Guide

## Step 1: Initialize Git and Commit

Open a terminal in the project root and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: HKids Child Reading Platform"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `hkids-platform` (or your preferred name)
3. Description: "Child Reading Platform - Full Stack POC"
4. Choose Public or Private
5. **Don't** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 3: Push to GitHub

Copy the commands from GitHub (or use these):

```bash
# Add remote (replace YOUR_USERNAME and YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/hkids-platform.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 4: Deploy to Vercel

### Frontend Deployment

1. **Go to Vercel:** https://vercel.com
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. **Environment Variables:**
   - Add: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - (You'll update this after deploying backend)
7. **Click "Deploy"**

### Backend Deployment (Railway - Recommended)

**Why Railway?** Vercel is great for frontend but backend needs a different service.

1. **Go to Railway:** https://railway.app
2. **Sign up** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**
5. **Configure:**
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`
6. **Add Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
7. **Get your backend URL** (e.g., `https://hkids-backend.railway.app`)
8. **Update frontend `VITE_API_URL` in Vercel** to your backend URL

### MongoDB Atlas Setup

1. **Create account:** https://www.mongodb.com/cloud/atlas
2. **Create free cluster** (M0)
3. **Database Access:** Create user (username/password)
4. **Network Access:** Allow from anywhere (0.0.0.0/0)
5. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your user password
6. **Add to Railway environment variables** as `MONGODB_URI`

### Seed Database

After backend is deployed:

1. **Option 1:** SSH into Railway and run `npm run seed`
2. **Option 2:** Create a temporary seed endpoint
3. **Option 3:** Use MongoDB Compass to manually add admin user

## Important Notes

### File Uploads
- Railway/Vercel file systems are ephemeral
- **Solution:** Use cloud storage (Cloudinary, AWS S3) for uploaded images
- Or use external image hosting services

### Environment Variables Checklist

**Frontend (Vercel):**
- ✅ `VITE_API_URL` = Your backend URL

**Backend (Railway):**
- ✅ `MONGODB_URI` = MongoDB Atlas connection string
- ✅ `JWT_SECRET` = Random secret key (min 32 chars)
- ✅ `PORT` = 5000 (or Railway's assigned port)
- ✅ `FRONTEND_URL` = Your Vercel frontend URL

## Quick Commands Reference

```bash
# Git setup
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main

# Update later
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

**Git push fails:**
- Make sure you've created the GitHub repository first
- Check your GitHub username and repo name are correct
- You may need to authenticate (GitHub will prompt)

**Vercel build fails:**
- Check that Root Directory is set to `frontend`
- Verify Build Command is `npm run build`
- Check Output Directory is `dist`

**Backend not connecting:**
- Verify MongoDB Atlas network access allows all IPs
- Check connection string format
- Make sure environment variables are set in Railway

---

**See DEPLOYMENT.md for detailed deployment instructions!**
