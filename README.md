## Customizing

- **Model / creativity**: edit `model` in `backend/server.js`.
- **Genres or lengths**: edit `GENRE_GUIDE` / `LENGTH_GUIDE` in `server.js`, and match the buttons in `frontend/index.html`.
- **Writing style**: edit the system prompt in `buildSystemPrompt()` in `server.js`.

## Deploying

Since it's a single Express server, it deploys anywhere that runs Node (Render, Railway, Fly.io, a VPS, etc.):

1. Push this folder to a repo.
2. Set the `GEMINI_API_KEY` environment variable on your host.
3. Set the start command to `npm start` (run from `/backend`, or point your host's root/start dir at `backend`).

No separate frontend hosting needed — Express serves it.

## Notes

- Never commit your real `.env` file or API key — `.env` should stay out of version control (add it to `.gitignore`).
- The API key stays server-side only; the browser never sees it, since all calls go through your backend.
- The Gemini free tier has request-per-minute and per-day limits (generous, but not unlimited). If you hit a 429 error, you've hit that limit — wait a bit and try again.
