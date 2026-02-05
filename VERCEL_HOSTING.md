# Host Frontend on Vercel (Backend on Render)

Your backend is live on **Render**. Follow these steps to host the **frontend on Vercel**.

---

## 1. Push your code to GitHub

Make sure your project is on GitHub (e.g. `Dafi-web/patient-appointment-` or your repo name).

```bash
git add .
git commit -m "Add Vercel config for frontend"
git push origin main
```

---

## 2. Deploy on Vercel

1. Go to **https://vercel.com** and sign in (use **GitHub**).
2. Click **“Add New…”** → **“Project”**.
3. **Import** your GitHub repo (e.g. `patient-appointment-`).
4. Configure the project:

   | Setting           | Value        |
   |-------------------|-------------|
   | **Framework**     | Create React App |
   | **Root Directory** | `frontend` (click “Edit” and set it) |
   | **Build Command** | `npm run build` (default) |
   | **Output Directory** | `build` (default) |

5. **Environment variable** (required):

   | Name                | Value |
   |---------------------|--------|
   | `REACT_APP_API_URL` | `https://patient-appointment-8nfa.onrender.com/api` |

   **Backend URL:** `https://patient-appointment-8nfa.onrender.com` — the value above must end with `/api`.

6. Click **Deploy** and wait for the build to finish.

---

## 3. Allow your Vercel URL in the backend (Render)

So the frontend can call the API without CORS errors:

1. Open **Render** → your backend service → **Environment**.
2. Add or set:

   | Key           | Value |
   |---------------|--------|
   | `FRONTEND_URL` | `https://YOUR-PROJECT.vercel.app` |

   Use the exact URL Vercel gave you (e.g. `https://patient-appointment-xxxxx.vercel.app`).

3. Save and trigger a **Manual Deploy** so the new env var is applied.

---

## 4. Check that it works

- **Frontend:** Open your Vercel URL and use login/register.
- **Backend:** Your app already allows `*.vercel.app` in CORS; with `FRONTEND_URL` set, your exact domain is also allowed.

---

## Quick reference

- **Backend (Render):** `https://patient-appointment-8nfa.onrender.com`
- **API base (for frontend):** `https://patient-appointment-8nfa.onrender.com/api`
- **Frontend (Vercel):** `https://your-project.vercel.app`
- **Vercel env:** `REACT_APP_API_URL=https://patient-appointment-8nfa.onrender.com/api`
- **Render env:** `FRONTEND_URL=https://your-project.vercel.app`

Every push to `main` will auto-deploy the frontend on Vercel.
