# 🚀 Deploy to Vercel (Frontend) + Render (Backend)

Complete step-by-step guide to host your Patient Appointment System online.

## 📋 Prerequisites

- GitHub account with your repository: `Dafi-web/patient-appointment-`
- MongoDB Atlas account (already configured)

---

## 🔧 Step 1: Deploy Backend on Render

### 1.1 Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (recommended)

### 1.2 Create New Web Service
1. In Render dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select repository: **`Dafi-web/patient-appointment-`**

### 1.3 Configure Backend Service
Fill in the following settings:

**Basic Settings:**
- **Name**: `patient-appointment-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`

**Build & Deploy:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`

**Environment Variables:**
Click **"Add Environment Variable"** and add:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://musiedelayselam:yesno1212@cluster0.nc9xfdg.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `your-secret-key-here-123456` (generate a random string) |
| `NODE_ENV` | `production` |
| `PORT` | `5001` |

**Note**: You can also use the `render.yaml` file in your repo - Render will auto-detect it!

### 1.4 Deploy
1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, copy your backend URL (e.g., `https://patient-appointment-backend.onrender.com`)
4. **Important**: Add `/api` to test: `https://patient-appointment-backend.onrender.com/api/health`

---

## 🎨 Step 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Account
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Sign up with your **GitHub account** (recommended)

### 2.2 Import Project
1. In Vercel dashboard, click **"Add New Project"**
2. Click **"Import Git Repository"**
3. Select repository: **`Dafi-web/patient-appointment-`**

### 2.3 Configure Frontend Project
Fill in the following settings:

**Framework Preset:**
- Select **"Create React App"** (or leave as "Other")

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Set to: `frontend`

**Build Settings:**
- **Build Command**: `npm run build` or `react-scripts build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

**Environment Variables:**
Click **"Add"** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com/api` |

**Replace `your-backend-url.onrender.com` with your actual Render backend URL!**

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (takes 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://patient-appointment-xxxxx.vercel.app`
4. Copy this URL - you'll need it for the next step!

---

## 🔄 Step 3: Update Backend CORS

After deploying frontend, update backend to allow your Vercel domain:

### 3.1 Update Environment Variable in Render
1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"** tab
4. Add new environment variable:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://your-vercel-url.vercel.app` |

Replace with your actual Vercel frontend URL!

### 3.2 Redeploy Backend
1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait for redeployment

---

## ✅ Step 4: Verify Deployment

### Test Backend:
1. Visit: `https://your-backend-url.onrender.com/api/health`
2. Should see: `{"success":true,"message":"Server is running",...}`

### Test Frontend:
1. Visit your Vercel URL
2. Try to register/login
3. Check browser console for any errors

### Common Issues:
- **CORS Error**: Make sure `FRONTEND_URL` is set in Render
- **API Connection Error**: Verify `REACT_APP_API_URL` in Vercel matches your Render URL
- **MongoDB Error**: Check MongoDB Atlas Network Access allows all IPs (`0.0.0.0/0`)

---

## 🔐 Step 5: MongoDB Atlas Network Access

1. Go to **https://cloud.mongodb.com**
2. Select your cluster
3. Click **"Network Access"** in left sidebar
4. Click **"Add IP Address"**
5. Click **"Allow Access from Anywhere"** (adds `0.0.0.0/0`)
6. Click **"Confirm"**

---

## 🎉 You're Done!

Your application is now live:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

---

## 🔄 Auto-Deployment

Both Vercel and Render automatically deploy when you push to GitHub:

```bash
git add .
git commit -m "Your changes"
git push
```

Deployment happens automatically! 🚀

---

## 📝 Quick Reference

### Backend URL Format:
```
https://patient-appointment-backend.onrender.com/api
```

### Frontend Environment Variable:
```
REACT_APP_API_URL=https://patient-appointment-backend.onrender.com/api
```

### Backend Environment Variables:
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🆘 Troubleshooting

### Backend not starting:
- Check Render logs: Go to your service → "Logs" tab
- Verify all environment variables are set
- Check MongoDB connection string is correct

### Frontend can't connect to backend:
- Verify `REACT_APP_API_URL` in Vercel includes `/api`
- Check CORS settings in backend
- Verify `FRONTEND_URL` is set in Render

### 404 errors:
- Make sure routes are correct
- Check API base URL includes `/api`

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas
