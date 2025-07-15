Deployment
Backend on Render
Push backend folder to GitHub.
Create Web Service → pick repo → Environment = Node → set build command npm install and start node src/server.js.
Add environment variables (.env contents).
Render provides HTTPS URL → add to frontend env.
4.2  Frontend on Vercel
Push frontend folder.
Vercel auto-detects Vite → build command npm run build, output dist.
Add VITE_API_URL=https://your-backend.onrender.com.
4.3  CI / CD
.github/workflows/ci.yml

name: CI
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: npm ci && npm run build
        working-directory: frontend

Stretch Goals Checklist
[ ] Social follow endpoints & UI
[ ] Collaborative lists
[ ] Recommendation engine using cosine similarity on user ratings
[ ] PWA: vite-plugin-pwa, service worker caching images
[ ] Trailer modal via YouTube iframe API