# Deployment Guide

## Pushing to GitHub

### Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `patient-appointment-systems`
3. Description: "Full-stack Patient Appointment Management System with MongoDB, React, and Node.js"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
cd "/Users/dawitabrhaweldegebriel/Desktop/patient Appoitment"
git remote add origin https://github.com/YOUR_USERNAME/patient-appointment-systems.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Hosting Options

### Option 1: Vercel (Recommended for Frontend)

#### Frontend Deployment on Vercel:

1. Go to https://vercel.com and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Environment Variables**:
     - `REACT_APP_API_URL`: Your backend URL (e.g., `https://your-backend.herokuapp.com/api`)

5. Deploy!

#### Backend Deployment on Heroku:

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create patient-appointment-backend`
4. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set PORT=5001
   ```
5. Deploy:
   ```bash
   cd backend
   git subtree push --prefix backend heroku main
   ```
   Or use Heroku Git:
   ```bash
   heroku git:remote -a patient-appointment-backend
   git push heroku main
   ```

### Option 2: Netlify (Frontend) + Railway/Render (Backend)

#### Frontend on Netlify:

1. Go to https://netlify.com
2. Click "New site from Git"
3. Connect GitHub and select your repo
4. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`
   - **Environment variables**: Add `REACT_APP_API_URL`

#### Backend on Railway:

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT` (Railway will auto-assign)
6. Deploy!

### Option 3: Render (Full Stack)

1. Go to https://render.com
2. Create two services:

#### Backend Service:
- **Type**: Web Service
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Environment Variables**:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `PORT=5001`

#### Frontend Service:
- **Type**: Static Site
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`
- **Environment Variables**:
  - `REACT_APP_API_URL`: Your backend service URL

## Environment Variables

### Backend (.env):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secret_key_here
PORT=5001
```

### Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5001/api
```

For production, update `REACT_APP_API_URL` to your deployed backend URL.

## Important Notes

1. **MongoDB**: Make sure your MongoDB Atlas cluster allows connections from your hosting provider's IP addresses (or use 0.0.0.0/0 for all IPs in development)

2. **CORS**: Update CORS settings in `backend/server.js` to include your frontend URL

3. **File Uploads**: For production, consider using cloud storage (AWS S3, Cloudinary) instead of local file storage

4. **Environment Variables**: Never commit `.env` files to GitHub

## Quick Deploy Commands

```bash
# After setting up GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/patient-appointment-systems.git
git branch -M main
git push -u origin main
```
