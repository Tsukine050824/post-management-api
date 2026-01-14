# Post Management - Client (React, Vite)

This is a minimal React frontend intended to be deployed separately from the backend.

Quick start

```bash
cd client
npm install
npm run dev
```

Build for production

```bash
npm run build
```

Deployment notes

- Set `VITE_API_URL` in your Vercel/host environment to point to your backend (for example, `https://my-backend.onrender.com`).
- The client will call endpoints like `${VITE_API_URL}/posts` and `${VITE_API_URL}/auth/*`.
- CORS must be enabled on the backend for the client origin.

Files of interest

- `src/services/api.js`: API wrapper using `VITE_API_URL`.
- `src/components/PostList.jsx`: Shows posts.
- `src/components/PostForm.jsx`: Create post with optional file upload.
- `src/pages/Login.jsx` and `src/pages/Register.jsx`: Minimal auth flows.

You can style or extend UI as you like.
