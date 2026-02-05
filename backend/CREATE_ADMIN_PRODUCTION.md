# Create Admin User in Production

Your **Render backend** uses a **production MongoDB** (e.g. Atlas). The admin user must exist in that same database.

## Default admin credentials (after you run the script)

- **Email:** `admin@example.com`
- **Password:** `admin123`

---

## Steps to create the admin in production

### 1. Get your production MongoDB URI

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Open your backend service (e.g. `patient-appointment-8nfa`)
3. Go to **Environment**
4. Copy the value of **`MONGODB_URI`** (same URI your Render app uses)

### 2. Run the script from your computer

Open a terminal and run (replace `YOUR_PRODUCTION_MONGODB_URI` with the copied value):

```bash
cd backend
MONGODB_URI="YOUR_PRODUCTION_MONGODB_URI" node scripts/createAdmin.js
```

**Example** (use your real URI from Render):

```bash
cd backend
MONGODB_URI="mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/yourdb?retryWrites=true&w=majority" node scripts/createAdmin.js
```

### 3. Expected output

- **Success:** `Admin user created successfully!` and `Email: admin@example.com`
- **Already exists:** `Admin user already exists!` (then use **admin@example.com** / **admin123** to log in)

### 4. Log in on your live app

1. Open your **Vercel frontend** URL
2. Go to Login
3. Use **admin@example.com** and **admin123**

---

## If login still fails

- Confirm the frontend is using the correct API: in Vercel → Project → Settings → Environment Variables, you must have  
  **`REACT_APP_API_URL`** = `https://patient-appointment-8nfa.onrender.com/api`
- Confirm the backend is up (Render free tier may spin down; first request can take ~50 seconds).
- Try in an incognito window or after clearing site data for your app’s domain.
