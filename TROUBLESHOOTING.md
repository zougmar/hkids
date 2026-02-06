# 🔧 Troubleshooting Guide - Admin Login Issues

## Quick Checklist

### 1. ✅ Backend Server Running?
**Check:** Open http://localhost:5000/api/health in your browser

**Should see:**
```json
{"status":"OK","message":"HKids API is running"}
```

**If not:**
```bash
cd backend
npm run dev
```

### 2. ✅ MongoDB Connected?
**Check backend terminal for:**
```
✅ MongoDB connected successfully
```

**If not:**
- Start MongoDB: `mongod`
- Or check your MongoDB Atlas connection string in `backend/.env`

### 3. ✅ Database Seeded?
**Run seed script:**
```bash
cd backend
npm run seed
```

**This creates:**
- Email: `admin@hkids.com`
- Password: `admin123`

### 4. ✅ Environment Variables Set?
**Check `frontend/.env` exists:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Check `backend/.env` exists:**
```env
MONGODB_URI=mongodb://localhost:27017/hkids
JWT_SECRET=hkids_secret_key_2024_change_in_production
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### 5. ✅ Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab:** Look for API URL and any errors
- **Network tab:** Check if login request is being made
  - Should see POST request to `/api/auth/login`
  - Check response status (should be 200 for success)

## Common Error Messages & Solutions

### "Cannot connect to server"
**Problem:** Backend not running or wrong URL

**Solution:**
1. Make sure backend is running: `cd backend && npm run dev`
2. Check `frontend/.env` has: `VITE_API_URL=http://localhost:5000/api`
3. Restart frontend after changing .env

### "Invalid credentials"
**Problem:** User doesn't exist or wrong password

**Solution:**
1. Run seed script: `cd backend && npm run seed`
2. Use exact credentials:
   - Email: `admin@hkids.com`
   - Password: `admin123`

### "Network Error" or "ECONNREFUSED"
**Problem:** Backend server not accessible

**Solution:**
1. Check backend is running on port 5000
2. Check firewall isn't blocking port 5000
3. Try accessing http://localhost:5000/api/health directly

### CORS Errors
**Problem:** Frontend and backend on different origins

**Solution:**
1. Check `backend/.env` has: `FRONTEND_URL=http://localhost:5173`
2. Restart backend after changing .env

### "MongoDB connection error"
**Problem:** MongoDB not running or wrong connection string

**Solution:**
1. **Local MongoDB:**
   ```bash
   mongod
   ```
2. **MongoDB Atlas:**
   - Get connection string from Atlas dashboard
   - Update `MONGODB_URI` in `backend/.env`

## Step-by-Step Debug Process

### Step 1: Verify Backend
```bash
# Terminal 1
cd backend
npm run dev
```

**Expected output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📚 HKids Backend API ready
```

### Step 2: Test Backend API
Open browser: http://localhost:5000/api/health

**Should see:** `{"status":"OK","message":"HKids API is running"}`

### Step 3: Verify Frontend
```bash
# Terminal 2
cd frontend
npm run dev
```

**Check browser console (F12):**
- Should see: `🔗 API URL: http://localhost:5000/api`
- No CORS errors

### Step 4: Test Login
1. Go to http://localhost:5173/admin/login
2. Check backend status indicator (should show ✅ Backend connected)
3. Enter credentials:
   - Email: `admin@hkids.com`
   - Password: `admin123`
4. Click Login

### Step 5: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Find the `/api/auth/login` request
5. Check:
   - **Status:** Should be 200 (green)
   - **Response:** Should have `token` and `user` fields
   - **Request URL:** Should be `http://localhost:5000/api/auth/login`

## Manual API Test

Test the login endpoint directly:

```bash
# Using curl (if available)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hkids.com","password":"admin123"}'
```

**Expected response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "username": "admin",
    "email": "admin@hkids.com",
    "role": "admin"
  }
}
```

## Still Not Working?

1. **Clear browser cache and localStorage:**
   - Open DevTools (F12)
   - Application tab → Local Storage → Clear all
   - Refresh page

2. **Restart everything:**
   - Stop both servers (Ctrl+C)
   - Restart backend: `cd backend && npm run dev`
   - Restart frontend: `cd frontend && npm run dev`

3. **Check for port conflicts:**
   - Make sure nothing else is using port 5000 or 5173
   - Windows: `netstat -ano | findstr :5000`

4. **Verify Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

5. **Reinstall dependencies:**
   ```bash
   # Backend
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   # Frontend
   cd ../frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## Getting Help

If still having issues, provide:
1. Backend terminal output
2. Frontend terminal output
3. Browser console errors (F12)
4. Network tab screenshot of login request
5. Contents of `backend/.env` (hide sensitive data)
6. Contents of `frontend/.env`
