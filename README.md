# HKids — Digital Reading Platform

A modern digital library for kids, teens, and adults. Visitors choose an age group first, then browse and read books with a real page-flip experience. Admins upload PDF or image books from a secure dashboard.

**Live site:** [https://hkids.vercel.app](https://hkids.vercel.app)

## Features

### Reading experience
- Age-first homepage (no mixed age libraries)
- Age groups: **3–5**, **6–8**, **9–12**, **13–15**, **Adults +16**
- Flip-book reader with previous/next controls and fullscreen mode
- Category + search filters within the selected age group
- Selected age is remembered (URL + browser storage)

### Admin
- Secure JWT login
- Upload books as **PDF** (auto-converted to pages) or page images
- Age group, category, cover, and publish controls
- Edit / delete books from the dashboard

## Tech stack

| Layer | Stack |
| --- | --- |
| Frontend | React (Vite), Tailwind CSS, Framer Motion, Lucide React, pdf.js, react-pageflip |
| Backend (local) | Node.js, Express, Multer |
| API (Vercel) | Serverless functions in `/api` |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |

## Project structure

```
hkids/
├── frontend/          # React app (Vite)
├── backend/           # Express API for local development
├── api/               # Vercel serverless API routes
├── vercel.json        # Vercel build + rewrite config
└── README.md
```

## Local development

### Prerequisites
- Node.js 18+
- MongoDB Atlas (recommended) or local MongoDB

### Install

```bash
npm run install:all
```

### Environment

Create `backend/.env`:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/HKids?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Create `frontend/.env` (optional in local Vite; defaults to `http://localhost:5000/api`):

```env
VITE_API_URL=http://localhost:5000/api
```

> Never commit real `.env` files. Keep secrets only in local env / Vercel project settings.

### Run

```bash
# Terminal 1 — API
cd backend
npm run dev

# Terminal 2 — UI
cd frontend
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:5000  

### Seed sample data (optional)

```bash
cd backend
npm run seed
```

Default admin (local seed only):
- Email: `admin@hkids.com`
- Password: `admin123`

## Deploy to Vercel

This repo is set up as a **single Vercel project**:
- Frontend build from `frontend/`
- API from `/api/*` serverless functions
- MongoDB Atlas for data

### 1) Push to GitHub

```bash
git add .
git commit -m "Update platform and README for Vercel"
git push origin main
```

### 2) Import / connect on Vercel

1. Go to [vercel.com](https://vercel.com) and import the `hkids` GitHub repo (or reconnect if already imported).
2. Keep root directory empty (project root).
3. Vercel will use `vercel.json` for build/output settings.

### 3) Set environment variables (required)

In **Vercel → Project → Settings → Environment Variables**, add for Production (and Preview):

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/HKids?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret
FRONTEND_URL=https://hkids.vercel.app
NODE_ENV=production
```

Important:
- Use the **same Atlas user/password** that works locally.
- Database name should match (`HKids`).
- In Atlas → **Network Access**, allow `0.0.0.0/0` so Vercel can connect.
- After changing env vars, **Redeploy**.

### 4) Verify deployment

- Site: https://hkids.vercel.app  
- Health: https://hkids.vercel.app/api/health  
  Expected: `"status":"OK"` and `"mongodb":"connected"`  
- Admin: https://hkids.vercel.app/admin/login  

If login shows **Server error during login** / `bad auth`, the Vercel `MONGODB_URI` username/password is wrong or outdated.

## Usage

### Readers
1. Open the homepage
2. Choose an age group
3. Browse only books for that age
4. Open a book and flip pages (or use fullscreen)

### Admins
1. Open `/admin/login`
2. Sign in
3. Add a book (PDF recommended), set age group, publish

## API overview

### Public
- `GET /api/health`
- `GET /api/books/published?ageGroup=3-5`

### Auth
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)

### Books (admin)
- `GET /api/books`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`

## Troubleshooting

| Issue | Fix |
| --- | --- |
| White screen locally | Restart Vite; ensure Tailwind/CSS builds without errors |
| Login server error on Vercel | Fix `MONGODB_URI` credentials + redeploy |
| Health check DB timeout | Atlas Network Access must allow `0.0.0.0/0` |
| CORS issues | Set `FRONTEND_URL` to your exact Vercel domain |
| No books for an age | Publish books for that age group in admin |

## License

Proof of concept / educational project.
