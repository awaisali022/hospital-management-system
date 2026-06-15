# 🚀 Deployment Guide

This guide covers deploying **DoctorHub AI** to production using Vercel (frontend) and Railway or Render (backend).

---

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] A [MongoDB Atlas](https://cloud.mongodb.com) cluster configured
- [ ] A [Supabase](https://supabase.com) project set up (Auth + Storage)
- [ ] A [Cloudinary](https://cloudinary.com) account (image/file hosting)
- [ ] An [Anthropic](https://console.anthropic.com) API key (AI features)
- [ ] A [Vercel](https://vercel.com) account
- [ ] A [Railway](https://railway.app) or [Render](https://render.com) account

---

## 1️⃣ MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user with read/write permissions
3. Add your IP to the allowlist (or use `0.0.0.0/0` for Railway/Render)
4. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/doctorhub
   ```
5. Create the following indexes for performance:
   ```js
   // In MongoDB Atlas Data Explorer or mongosh:
   db.users.createIndex({ email: 1 }, { unique: true })
   db.appointments.createIndex({ patientId: 1, appointmentDate: -1 })
   db.appointments.createIndex({ doctorId: 1, appointmentDate: -1 })
   db.doctors.createIndex({ city: 1, isVerified: 1 })
   ```

---

## 2️⃣ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API** and copy:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` key → `SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
3. Create a Storage bucket named `doctorhub-files` (set to **public**)
4. (Optional) Configure OAuth providers under **Authentication → Providers**

---

## 3️⃣ Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. From your dashboard, copy:
   - Cloud name → `CLOUDINARY_CLOUD_NAME`
   - API Key → `CLOUDINARY_API_KEY`
   - API Secret → `CLOUDINARY_API_SECRET`
3. Create an **unsigned upload preset** named `doctorhub_preset` for patient report uploads

---

## 4️⃣ Backend Deployment

### Option A: Railway (Recommended)

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. Initialize project from the repo root:
   ```bash
   railway init
   ```

3. Deploy (the `railway.toml` is pre-configured):
   ```bash
   railway up
   ```

4. Set environment variables in Railway dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_ACCESS_SECRET=<openssl rand -hex 32>
   JWT_REFRESH_SECRET=<openssl rand -hex 32>
   JWT_ACCESS_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   FRONTEND_URL=https://your-app.vercel.app
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=...
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

5. Get your backend URL from Railway dashboard (e.g. `https://doctorhub-backend.up.railway.app`)

---

### Option B: Render

The `render.yaml` is pre-configured. Simply:

1. Go to [render.com](https://render.com) and click **New → Blueprint**
2. Connect your GitHub repository
3. Render will detect `render.yaml` and configure services automatically
4. Fill in the required secret environment variables in the Render dashboard

---

## 5️⃣ Frontend Deployment (Vercel)

### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel --cwd frontend
```

### Option B: GitHub Integration (Recommended)

1. Go to [vercel.com](https://vercel.com) and click **Import Project**
2. Connect your GitHub repository
3. Set:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
5. Deploy — your app will be live at `https://your-app.vercel.app`

The `vercel.json` at the project root is pre-configured for SPA routing.

---

## 6️⃣ Post-Deployment Checklist

- [ ] Backend health check responds at `GET /` with `200 OK`
- [ ] Frontend loads at Vercel URL without errors
- [ ] CORS is working (frontend can reach backend API)
- [ ] Registration and login work end-to-end
- [ ] MongoDB Atlas shows incoming connections
- [ ] File uploads work (Cloudinary/Supabase dashboard shows files)
- [ ] AI chatbot responds (check Anthropic API usage dashboard)
- [ ] Seed the database: `cd backend && npx tsx scripts/seed.ts`
- [ ] Verify all 5 demo account logins work
- [ ] Enable Railway/Render health checks
- [ ] Add error monitoring (Sentry or equivalent)
- [ ] Review privacy policy and medical disclaimer

---

## 🔧 Troubleshooting

### CORS Errors
Ensure `FRONTEND_URL` in backend `.env` exactly matches your Vercel deployment URL (no trailing slash).

### MongoDB Connection Timeout
- Check Atlas IP allowlist includes Railway/Render IP ranges (or use `0.0.0.0/0`)
- Verify `SKIP_DATABASE_CONNECTION=false` in production

### Build Failures
```bash
# Test build locally first
npm run build
npm run type-check
```

### AI Not Responding
- Verify `ANTHROPIC_API_KEY` is set correctly
- Check Anthropic console for API usage/errors
- Ensure `AI_PROVIDER=anthropic` is set

---

## 📊 Recommended Infrastructure

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| MongoDB Atlas | 512MB | M10+ for production |
| Supabase | 500MB DB, 1GB storage | Pro for production |
| Cloudinary | 25 credits/month | Plus plan |
| Vercel | Hobby (unlimited) | Pro for teams |
| Railway | $5 credit/month | Starter plan |

---

## 🔐 Security Checklist for Production

- [ ] All secrets are stored as environment variables (never in code)
- [ ] JWT secrets are cryptographically random (256-bit): `openssl rand -hex 32`
- [ ] MongoDB Atlas has network access restricted to known IPs when possible
- [ ] Supabase RLS (Row Level Security) policies are configured
- [ ] Cloudinary signed upload presets are used for sensitive files
- [ ] Rate limiting is active (already enabled in the backend)
- [ ] HTTPS is enforced (handled by Vercel/Railway automatically)
