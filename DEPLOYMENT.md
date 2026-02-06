# 🚀 Deployment Guide - HKids Platform (Vercel)

## Deploy Everything to Vercel

This guide will help you deploy both frontend and backend to Vercel as a single full-stack application.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

### Step 1: Push to GitHub

1. **Initialize Git (if not already done):**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HKids Platform"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `hkids-platform` (or your preferred name)
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/hkids-platform.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up MongoDB Atlas

1. **Go to MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
2. **Sign up/Login** (free tier available)
3. **Create a Cluster:**
   - Click "Build a Database"
   - Choose **FREE (M0)** tier
   - Select region closest to you
   - Click "Create"
4. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `hkids-admin` (or your choice)
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
5. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
6. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://hkids-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hkids?retryWrites=true&w=majority`

### Step 3: Deploy to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** Leave empty (uses root)
     - **Build Command:** `cd frontend && npm install && npm run build`
     - **Output Directory:** `frontend/dist`
     - **Install Command:** `npm install` (installs root dependencies for API routes)
4. **Environment Variables:**
   Add these in Vercel project settings (Settings → Environment Variables):
   ```
   MONGODB_URI=mongodb+srv://hkids-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hkids?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
   FRONTEND_URL=https://your-project.vercel.app
   NODE_ENV=production
   ```
   **Important:** Replace:
   - `YOUR_PASSWORD` with your MongoDB password
   - `your-project.vercel.app` with your actual Vercel domain (you'll get this after first deploy)
5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Note your deployment URL (e.g., `hkids-platform.vercel.app`)

### Step 4: Update Environment Variables

After the first deployment, update `FRONTEND_URL`:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `FRONTEND_URL` to match your actual Vercel URL
3. Redeploy (go to Deployments → Redeploy)

### Step 5: Seed the Database

After deployment, seed the database with an admin user:

**Option A: Use MongoDB Compass**
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect to your Atlas cluster using the connection string
3. Navigate to `hkids` database → `users` collection
4. Insert a document:
   ```json
   {
     "username": "admin",
     "email": "admin@hkids.com",
     "password": "$2a$10$YourHashedPasswordHere",
     "role": "admin"
   }
   ```
   **Note:** You'll need to hash the password using bcrypt. Use an online bcrypt generator or create a temporary seed endpoint.

**Option B: Create Temporary Seed Endpoint**
1. Add a seed API route (temporary): `api/seed.js`
2. Call it once: `POST https://your-project.vercel.app/api/seed`
3. Remove the endpoint after seeding

**Option C: Use the Backend Seed Script Locally**
1. Set up local environment with MongoDB connection
2. Run: `cd backend && npm run seed`
3. This creates: `admin@hkids.com` / `admin123`

### Step 6: Test Your Deployment

1. **Test Health Endpoint:**
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"HKids API is running"}`

2. **Test Frontend:**
   - Visit: `https://your-project.vercel.app`
   - Try logging in at `/admin/login`
   - Check browser console for any errors

## Project Structure

```
hkids/
├── api/                    # Vercel serverless functions
│   ├── auth/
│   │   ├── login.js
│   │   ├── register.js
│   │   └── profile.js
│   ├── books/
│   │   ├── index.js
│   │   ├── [id].js
│   │   └── published.js
│   ├── health.js
│   └── lib/
│       ├── db.js          # MongoDB connection (cached)
│       ├── auth.js        # Auth utilities
│       └── models.js      # Model exports
├── frontend/              # React frontend
│   ├── src/
│   └── dist/              # Build output
├── backend/               # Original Express backend (for local dev)
├── package.json           # Root dependencies (for API routes)
└── vercel.json            # Vercel configuration
```

## Environment Variables

**Vercel Environment Variables:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
FRONTEND_URL=https://your-project.vercel.app
NODE_ENV=production
```

**Frontend Environment Variables (Optional - for local dev):**
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5173/api
```

For production, the frontend automatically uses the same domain for API calls.

## File Uploads

**Current Implementation:**
- Files are converted to base64 strings in the frontend
- Base64 strings are stored directly in MongoDB
- Images are served as data URIs

**Limitations:**
- Base64 images increase database size
- Not ideal for large files
- Consider using cloud storage for production:
  - **Cloudinary** (free tier available)
  - **AWS S3**
  - **Vercel Blob** (requires Pro plan)

## Local Development

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start backend (local):**
   ```bash
   cd backend
   npm run dev
   ```

3. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

4. **For local development with API routes:**
   - Use Vercel CLI: `vercel dev`
   - Or run backend separately and frontend separately

## Troubleshooting

### API Routes Not Working
- Check that `package.json` at root includes backend dependencies
- Verify environment variables are set in Vercel
- Check Vercel function logs in dashboard

### MongoDB Connection Issues
- Verify MongoDB Atlas network access allows all IPs (0.0.0.0/0)
- Check connection string format
- Ensure password in connection string matches database user password

### Frontend Can't Connect to API
- Verify API routes are accessible: `https://your-project.vercel.app/api/health`
- Check CORS settings (should allow your frontend URL)
- Ensure `FRONTEND_URL` environment variable is set correctly

### Build Failures
- Check that all dependencies are in root `package.json`
- Verify build commands in `vercel.json`
- Check Vercel build logs for specific errors

### File Upload Issues
- Base64 images have size limits
- Large images may cause timeouts
- Consider implementing cloud storage for production

## Post-Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] API routes accessible (`/api/health` works)
- [ ] MongoDB Atlas configured and connected
- [ ] Environment variables set in Vercel
- [ ] Database seeded with admin user
- [ ] Test login functionality
- [ ] Test book creation with images
- [ ] Test book reading interface
- [ ] Verify CORS settings

## Production Considerations

1. **Security:**
   - Use strong `JWT_SECRET` (minimum 32 characters)
   - Keep MongoDB password secure
   - Enable HTTPS (automatic on Vercel)

2. **Performance:**
   - Consider using cloud storage for images
   - Implement image optimization
   - Add caching headers

3. **Monitoring:**
   - Use Vercel Analytics
   - Monitor API function logs
   - Set up error tracking (Sentry, etc.)

4. **Scaling:**
   - Vercel automatically scales serverless functions
   - MongoDB Atlas free tier has limitations
   - Consider upgrading for production traffic

---

**Your deployment URL:** `https://your-project.vercel.app`  
**API endpoints:** `https://your-project.vercel.app/api/*`
