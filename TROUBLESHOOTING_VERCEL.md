# 🔧 Troubleshooting Vercel Deployment - Backend Connection Issues

## Common Issues and Solutions

### ❌ "Cannot connect to backend server"

#### 1. Check API Endpoint Directly

Visit your health endpoint directly in the browser:
```
https://your-project.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "HKids API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "production"
}
```

**If you get 404:**
- API routes not deployed correctly
- Check Vercel function logs
- Verify `api/` directory exists in root

**If you get 500:**
- MongoDB connection issue
- Check `MONGODB_URI` environment variable
- Verify MongoDB Atlas network access

#### 2. Check Environment Variables

In Vercel Dashboard → Settings → Environment Variables, verify:

✅ **Required Variables:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids?retryWrites=true&w=majority
JWT_SECRET=your_32_character_secret_key
FRONTEND_URL=https://your-project.vercel.app
NODE_ENV=production
```

**Common Issues:**
- ❌ `MONGODB_URI` missing or incorrect
- ❌ Password in connection string doesn't match MongoDB user
- ❌ `FRONTEND_URL` doesn't match your actual Vercel URL
- ❌ Special characters in password not URL-encoded

#### 3. Check MongoDB Atlas

**Network Access:**
1. Go to MongoDB Atlas → Network Access
2. Ensure IP `0.0.0.0/0` is allowed (all IPs)
3. Or add Vercel's IP ranges

**Database User:**
1. Go to Database Access
2. Verify user exists and has correct password
3. Check user has "Read and write" permissions

**Connection String:**
- Format: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- Replace `<password>` with actual password
- URL-encode special characters in password

#### 4. Check Browser Console

Open browser DevTools (F12) → Console tab:

**Look for:**
- `🔗 API URL: /api` (should be relative URL in production)
- Any CORS errors
- Network errors
- Timeout errors

**Common Console Errors:**

**"Network Error" or "ERR_NETWORK":**
- API route not found (404)
- Check Vercel function logs
- Verify API routes are deployed

**"Request timeout":**
- MongoDB connection taking too long
- Check MongoDB Atlas status
- Verify network access settings

**CORS Error:**
- `FRONTEND_URL` doesn't match your domain
- Check CORS headers in API routes

#### 5. Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project
2. Click "Functions" tab
3. Click on a function (e.g., `api/health`)
4. View logs for errors

**Common Log Errors:**

**"MONGODB_URI environment variable is not set":**
- Add `MONGODB_URI` in environment variables
- Redeploy after adding

**"MongoServerError: Authentication failed":**
- Wrong password in connection string
- User doesn't exist
- Check MongoDB Atlas credentials

**"MongoNetworkError: getaddrinfo ENOTFOUND":**
- Invalid connection string format
- Check cluster URL is correct

#### 6. Verify API Routes Structure

Ensure your project has:
```
api/
├── health.js
├── auth/
│   ├── login.js
│   ├── register.js
│   └── profile.js
└── books/
    ├── index.js
    ├── [id].js
    └── published.js
```

#### 7. Test API Routes Manually

**Using curl or browser:**

```bash
# Health check
curl https://your-project.vercel.app/api/health

# Should return:
# {"status":"OK","message":"HKids API is running",...}
```

**Using browser:**
- Visit: `https://your-project.vercel.app/api/health`
- Should see JSON response

#### 8. Redeploy After Changes

After updating environment variables:
1. Go to Deployments
2. Click "Redeploy" on latest deployment
3. Or push a new commit to trigger auto-deploy

## Quick Fixes

### Fix 1: Missing MONGODB_URI
```bash
# In Vercel Dashboard → Environment Variables
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids?retryWrites=true&w=majority
```
Then redeploy.

### Fix 2: Wrong FRONTEND_URL
```bash
# Update to match your actual Vercel URL
FRONTEND_URL=https://your-actual-project.vercel.app
```
Then redeploy.

### Fix 3: MongoDB Network Access
1. MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allow all)
3. Wait 1-2 minutes for changes to propagate

### Fix 4: Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

## Debugging Steps

1. ✅ Test `/api/health` directly in browser
2. ✅ Check browser console (F12) for errors
3. ✅ Check Vercel function logs
4. ✅ Verify environment variables
5. ✅ Test MongoDB connection string locally
6. ✅ Check MongoDB Atlas network access
7. ✅ Verify API routes are deployed
8. ✅ Check CORS settings

## Still Not Working?

1. **Check Vercel Status:** https://vercel-status.com
2. **Check MongoDB Atlas Status:** https://status.mongodb.com
3. **View Detailed Logs:** Vercel Dashboard → Functions → View logs
4. **Test Locally:** Run `vercel dev` to test serverless functions locally

## Success Indicators

✅ Health endpoint returns: `{"status":"OK",...}`
✅ Browser console shows: `🔗 API URL: /api`
✅ Login page shows: "✅ Backend connected" (green)
✅ No errors in browser console
✅ No errors in Vercel function logs

---

**Need more help?** Check the detailed logs in Vercel Dashboard → Functions
