# ⚡ Quick Deploy to Vercel - 5 Minutes

## 🚀 Fast Track Deployment

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel"
git push
```

### 2. Deploy on Vercel

1. Go to https://vercel.com → "Add New Project"
2. Import your GitHub repo
3. **Settings:**
   - Framework: Vite
   - Root Directory: (empty)
   - Build Command: `npm install; cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hkids?retryWrites=true&w=majority
JWT_SECRET=your_32_char_secret_key_here
FRONTEND_URL=https://your-project.vercel.app
NODE_ENV=production
```

### 4. Deploy & Test

- Click "Deploy"
- Wait 2-3 minutes
- Test: `https://your-project.vercel.app/api/health`
- Should return: `{"status":"OK","message":"HKids API is running"}`

### 5. Seed Database

Use MongoDB Compass or create admin user manually.

**Done!** 🎉

See `VERCEL_DEPLOYMENT.md` for detailed instructions.
