# Hosting from GitHub - Complete Guide

Your application is now on GitHub and can be automatically deployed using various services that integrate with GitHub.

## 🚀 Quick Deploy Options

### Option 1: Vercel (Frontend) + Render (Backend) - Easiest

Both services auto-deploy from GitHub!

#### Frontend on Vercel:
1. Go to https://vercel.com
2. Sign in with **GitHub**
3. Click **"Add New Project"**
4. Select repository: `Dafi-web/patient-appointment-`
5. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: (set after backend is deployed)
6. Click **Deploy**
7. ✅ Vercel will auto-deploy on every push to GitHub!

#### Backend on Render:
1. Go to https://render.com
2. Sign in with **GitHub**
3. Click **"New +"** → **"Web Service"**
4. Connect repository: `Dafi-web/patient-appointment-`
5. Configure:
   - **Name**: `patient-appointment-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     - `MONGODB_URI`: `mongodb+srv://musiedelayselam:yesno1212@cluster0.nc9xfdg.mongodb.net/?appName=Cluster0`
     - `JWT_SECRET`: (generate a random string)
     - `PORT`: `5001`
6. Click **"Create Web Service"**
7. ✅ Render will auto-deploy on every push to GitHub!

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend on Netlify:
1. Go to https://netlify.com
2. Sign in with **GitHub**
3. Click **"Add new site"** → **"Import an existing project"**
4. Select repository: `Dafi-web/patient-appointment-`
5. Configure:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment variables**: Add `REACT_APP_API_URL`
6. Click **"Deploy site"**
7. ✅ Netlify will auto-deploy on every push!

#### Backend on Railway:
1. Go to https://railway.app
2. Sign in with **GitHub**
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select repository: `Dafi-web/patient-appointment-`
5. Set **Root Directory** to `backend`
6. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (auto-set)
7. ✅ Railway will auto-deploy on every push!

### Option 3: GitHub Pages (Frontend Only)

GitHub Pages can host the frontend for free:

1. Go to your repository: https://github.com/Dafi-web/patient-appointment-
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. The GitHub Action workflow will automatically build and deploy to GitHub Pages on every push!

**Note**: You'll need to update `frontend/package.json` to add:
```json
"homepage": "https://Dafi-web.github.io/patient-appointment-"
```

## 🔧 After Deployment

### 1. Update CORS Settings

After deploying backend, update `backend/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'https://your-frontend.vercel.app',  // Your Vercel URL
    'https://your-frontend.netlify.app',  // Your Netlify URL
    'https://Dafi-web.github.io'         // GitHub Pages URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
```

Then commit and push:
```bash
git add backend/server.js
git commit -m "Update CORS for production"
git push
```

### 2. Set Frontend Environment Variable

In your frontend hosting service (Vercel/Netlify), add:
- `REACT_APP_API_URL`: Your backend URL (e.g., `https://patient-appointment-backend.onrender.com/api`)

### 3. Update MongoDB Atlas Network Access

1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click **Network Access**
3. Add IP Address: `0.0.0.0/0` (allows all IPs) or add your hosting provider's IP ranges

## 📝 Environment Variables Summary

### Backend:
- `MONGODB_URI`: `mongodb+srv://musiedelayselam:yesno1212@cluster0.nc9xfdg.mongodb.net/?appName=Cluster0`
- `JWT_SECRET`: (generate a secure random string)
- `PORT`: `5001` (or auto-set by hosting provider)

### Frontend:
- `REACT_APP_API_URL`: Your deployed backend URL + `/api`

## ✅ Deployment Checklist

- [ ] Deploy backend (Render/Railway)
- [ ] Get backend URL
- [ ] Update CORS in `backend/server.js`
- [ ] Commit and push CORS changes
- [ ] Deploy frontend (Vercel/Netlify/GitHub Pages)
- [ ] Set `REACT_APP_API_URL` in frontend
- [ ] Update MongoDB Atlas network access
- [ ] Test the deployed application

## 🔄 Auto-Deployment

All recommended services (Vercel, Netlify, Render, Railway) automatically deploy when you push to GitHub! Just:

1. Make changes to your code
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push`
4. ✅ Automatic deployment happens!

## 📚 Repository Links

- **GitHub**: https://github.com/Dafi-web/patient-appointment-
- **Frontend**: (will be available after deployment)
- **Backend**: (will be available after deployment)
