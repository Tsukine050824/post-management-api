Deploying to Vercel

1. Create a new Vercel project and point it to this repo.
2. Set `REACT_APP_API_URL` in Project > Settings > Environment Variables.
3. Build command: `npm run build` Publish directory: `dist`

Render (for backend)

- Deploy backend to Render or another host, then use that backend URL in Vercel env var.
