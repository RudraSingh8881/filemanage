# Deployment & Re-creation Guide

This document helps you recreate the backend and frontend deployments (e.g. on Render).

1) Prepare repository

- Ensure `backend/` and `frontend/` directories are present and contain the code.
- Add your secretion values in `backend/.env` (locally) or set environment variables in your host (Render).

2) Required environment variables

Backend (set in Render service or local `.env`):

- `MONGODB_URI` — MongoDB connection string.
- `JWT_SECRET` — Random secret used to sign JWTs.
- `FRONTEND_URL` — The public URL of your deployed frontend (used for CORS).
- `PORT` — Optional, Render provides `PORT` automatically.

Frontend (set in Render static site or environment settings):

- `VITE_API_URL` — The backend base URL (e.g. `https://your-backend.onrender.com`). Do NOT include a trailing `/api` — the frontend will append `/api`.

3) Backend (Render) — Basic steps

- Create a new **Web Service** on Render.
- Connect your Git repository and choose the `main` branch.
- Build command: `npm install` (or leave default)
- Start command: `npm start` (this runs `node server.js` per `backend/package.json`).
- Set environment variables listed above in the Render dashboard.
- Confirm health by visiting `https://<your-backend>.onrender.com/api/test` (should return `{ msg: 'API Working!' }`).

4) Frontend (Render) — Basic steps

- Create a new **Static Site** on Render (recommended for Vite SPA).
- Connect your Git repository and choose the `main` branch.
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/dist`
- Set environment variable `VITE_API_URL` to your backend URL (e.g. `https://your-backend.onrender.com`).

5) CORS and API URL notes

- The backend CORS is controlled by `FRONTEND_URL` (set to your frontend domain). If you see CORS errors, make sure this matches the origin shown in the browser console.
- The frontend will request the API at `${VITE_API_URL}/api` when `VITE_API_URL` is set. If you host frontend and backend under the same origin, leave `VITE_API_URL` unset and the frontend will use relative `/api`.

6) Quick local test

Run both services locally (we added a root `package.json`):

```powershell
cd 'c:\Users\Akhilesh Singh\OneDrive\Desktop\rp'
npm install
npm run dev
```

This runs the backend (nodemon) and the frontend (Vite) concurrently.

7) Troubleshooting

- If registration requests fail in the browser, open DevTools -> Network. Inspect the POST to `/api/register` and see the response body and status code.
- If the request URL points to `http://localhost:5000` while you are on your deployed frontend, set `VITE_API_URL` to the correct backend URL in Render.
- If you see CORS blocked errors, re-check `FRONTEND_URL` in backend env.

8) (Optional) render.yaml template

- See `render.yaml` in the repo root for a template you can adapt for Render's Infrastructure-as-Code.

If you'd like, I can:
- Create and customize `render.yaml` for your Render setup, or
- Walk through the Render dashboard step-by-step and set variables interactively.
