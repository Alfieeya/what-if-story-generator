## Customizing

- **Model / creativity**: edit `model` in `backend/server.js`.
- **Genres or lengths**: edit `GENRE_GUIDE` / `LENGTH_GUIDE` in `server.js`, and match the buttons in `frontend/index.html`.
- **Writing style**: edit the system prompt in `buildSystemPrompt()` in `server.js`.

## Deploying

Since it's a single Express server, it deploys anywhere that runs Node (Render, Railway, Fly.io, a VPS, etc.):


## Notes

- The API key stays server-side only; the browser never sees it, since all calls go throughbackend.
- The Gemini free tier has request-per-minute and per-day limits (generous, but not unlimited). If hit a 429 error, you've hit that limit — wait a bit and try again.

- Live at: https://alfieeya.github.io/what-if-story-generator/
