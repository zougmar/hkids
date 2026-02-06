# 🚀 Complete Vercel Deployment Guide - HKids Platform

## ✅ Pre-Deployment Checklist

### 1. Project Structure
- [x] `api/` directory with serverless functions
- [x] `frontend/` directory with React app
- [x] `vercel.json` configuration file
- [x] Root `package.json` with API dependencies

### 2. Code Requirements
- [x] API routes converted to serverless functions
- [x] MongoDB connection cached for serverless
- [x] Frontend uses relative API URLs
- [x] CORS configured in API routes

## 📋 Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Ensure all files are committed:**
   ```bash
   git status
   git add .
   git commit -m "Ready for Vercel deployment"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### Step 2: Set Up MongoDB Atlas

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose **FREE (M0)** tier
   - Select region closest to you
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `hkids-admin`
   - Password: Generate secure password (save it!)
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String:**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://hkids-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hkids?retryWrites=true&w=majority`

### Step 3: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com
   - Sign up/Login with GitHub

2. **Import Project:**
   - Click "Add New Project"
   - Select your GitHub repository (`zougmar/hkids`)
   - Click "Import"

3. **Configure Project Settings:**
   
   **General Settings:**
   - **Project Name:** `hkids` (or your choice)
   - **Framework Preset:** Vite
   - **Root Directory:** Leave empty (uses root)
   
   **Build & Development Settings:**
   - **Build Command:** `npm install; cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install`
   - **Development Command:** Leave empty

4. **Add Environment Variables:**
   
   Click "Environment Variables" and add:
   
   ```
   MONGODB_URI=mongodb+srv://hkids-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hkids?retryWrites=true&w=majority
   ```
   - Replace `YOUR_PASSWORD` with your MongoDB password
   - Replace the cluster URL with your actual cluster URL
   
   ```
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
   ```
   - Use a strong random string (minimum 32 characters)
   - You can generate one: `openssl rand -base64 32`
   
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
   - You'll get this URL after first deployment
   - Update this after the first deploy
   
   ```
   NODE_ENV=production
   ```

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - Note your deployment URL (e.g., `hkids-xxxxx.vercel.app`)

### Step 4: Update Environment Variables

After first deployment:

1. **Go to Settings → Environment Variables**
2. **Update `FRONTEND_URL`:**
   - Change to your actual Vercel URL: `https://hkids-xxxxx.vercel.app`
3. **Redeploy:**
   - Go to "Deployments"
   - Click "Redeploy" on latest deployment

### Step 5: Test Your Deployment

1. **Test Health Endpoint:**
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return: `{"status":"OK","message":"HKids API is running"}`

2. **Test Frontend:**
   - Visit: `https://your-project.vercel.app`
   - Should load the home page
   - Check browser console (F12) for any errors

3. **Test API Connection:**
   - Go to `/admin/login`
   - Should show "✅ Backend connected" (green)
   - If red, check:
     - MongoDB connection
     - Environment variables
     - Vercel function logs

### Step 6: Seed the Database

**Option A: Use MongoDB Compass (Recommended)**
1. Download: https://www.mongodb.com/products/compass
2. Connect using your Atlas connection string
3. Navigate to `hkids` database → `users` collection
4. Click "Insert Document"
5. Add:
   ```json
   {
     "username": "admin",
     "email": "admin@hkids.com",
     "password": "$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq",
     "role": "admin"
   }
   ```
   **Note:** The password needs to be hashed with bcrypt. Use an online bcrypt generator or the seed script.

**Option B: Create Temporary Seed Endpoint**
1. Create `api/seed.js` (temporary):
   ```javascript
   import connectDB from './lib/db.js';
   import User from '../backend/models/User.js';
   
   export default async function handler(req, res) {
     if (req.method !== 'POST') {
       return res.status(405).json({ message: 'Method not allowed' });
     }
     
     try {
       await connectDB();
       const user = new User({
         username: 'admin',
         email: 'admin@hkids.com',
         password: 'admin123',
         role: 'admin'
       });
       await user.save();
       res.json({ message: 'Database seeded successfully' });
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   }
   ```
2. Call: `POST https://your-project.vercel.app/api/seed`
3. Delete the endpoint after seeding

**Option C: Use Local Seed Script**
1. Set up local environment
2. Run: `cd backend && npm run seed`
3. This creates: `admin@hkids.com` / `admin123`

## 🔧 Troubleshooting

### Build Fails

**Error: "vite: command not found"**
- ✅ Fixed: Build command now installs frontend dependencies
- If still fails, check Vercel build logs

**Error: "Module not found"**
- Check that root `package.json` has all API dependencies
- Verify `installCommand` runs before `buildCommand`

### API Routes Not Working

**404 on `/api/health`**
- Check that `api/` directory is in root
- Verify `vercel.json` has correct rewrites
- Check Vercel function logs

**500 Error**
- Check MongoDB connection string
- Verify `MONGODB_URI` environment variable
- Check MongoDB Atlas network access (should allow 0.0.0.0/0)
- View Vercel function logs for detailed errors

### Frontend Can't Connect

**"Cannot connect to backend server"**
- Check browser console (F12) for errors
- Verify API URL is `/api` (relative)
- Test health endpoint directly: `https://your-project.vercel.app/api/health`
- Check CORS settings in API routes

**CORS Errors**
- Verify `FRONTEND_URL` matches your Vercel domain
- Check API routes have CORS headers
- Ensure `Access-Control-Allow-Origin` is set correctly

### Database Connection Issues

**"Database connection failed"**
- Verify MongoDB Atlas cluster is running
- Check connection string format
- Ensure password in connection string matches database user
- Verify network access allows all IPs (0.0.0.0/0)
- Check MongoDB Atlas dashboard for connection errors

## 📊 Project Structure

```
hkids/
├── api/                      # Vercel serverless functions
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
│       ├── db.js            # MongoDB connection (cached)
│       ├── auth.js          # Auth utilities
│       └── models.js        # Model exports
├── frontend/                # React frontend
│   ├── src/
│   ├── dist/               # Build output
│   └── package.json
├── backend/                 # Original Express (for local dev)
├── package.json             # Root dependencies (for API)
└── vercel.json              # Vercel configuration
```

## 🔐 Environment Variables Summary

**Required in Vercel:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
FRONTEND_URL=https://your-project.vercel.app
NODE_ENV=production
```

**Optional (for local dev):**
Create `frontend/.env.local`:
```
VITE_API_URL=http://localhost:5000/api
```

## ✅ Post-Deployment Checklist

- [ ] Frontend deployed successfully
- [ ] API routes accessible (`/api/health` works)
- [ ] MongoDB connected (check health endpoint)
- [ ] Environment variables set correctly
- [ ] Database seeded with admin user
- [ ] Can login at `/admin/login`
- [ ] Can create books
- [ ] Can view books in reading interface
- [ ] Images display correctly (base64)
- [ ] No console errors

## 🎯 Your Deployment URL

After deployment, your app will be available at:
- **Frontend:** `https://your-project.vercel.app`
- **API:** `https://your-project.vercel.app/api/*`

## 📝 Notes

- **File Uploads:** Currently using base64 (stored in MongoDB). For production, consider cloud storage (Cloudinary, S3).
- **Free Tier Limits:** Vercel free tier has generous limits. MongoDB Atlas free tier (M0) has 512MB storage.
- **Cold Starts:** Serverless functions may have ~1-2 second cold start on first request.

---

**Need Help?** Check Vercel function logs in Dashboard → Your Project → Functions → View logs
