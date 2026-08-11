# What If — Story Generator

Give it a "what if" premise, and it writes a short story around it, using the Claude API.

## How it's built

- **Backend**: Node + Express (`/backend`). One route, `POST /api/generate`, calls the Anthropic API and returns a story. It also serves the frontend as static files, so the whole app runs on a single port.
- **Frontend**: Plain HTML/CSS/JS (`/frontend`) — no build step, no framework required.

## 1. Get an API key

Create a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).

## 2. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and paste in your key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

## 3. Run it

```bash
npm start
```

Then open **http://localhost:3001** — the frontend and API are served from the same server.

For auto-restart on file changes during development:

```bash
npm run dev
```

## Project structure

```
what-if-story-generator/
├── backend/
│   ├── server.js         # Express server + Claude API call
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── README.md
```

## Customizing

- **Model / creativity**: edit `model` and `max_tokens` in `backend/server.js`.
- **Genres or lengths**: edit `GENRE_GUIDE` / `LENGTH_GUIDE` in `server.js`, and match the buttons in `frontend/index.html`.
- **Writing style**: edit the system prompt in `buildSystemPrompt()` in `server.js`.

## Deploying

Since it's a single Express server, it deploys anywhere that runs Node (Render, Railway, Fly.io, a VPS, etc.):

1. Push this folder to a repo.
2. Set the `ANTHROPIC_API_KEY` environment variable on your host.
3. Set the start command to `npm start` (run from `/backend`, or point your host's root/start dir at `backend`).

No separate frontend hosting needed — Express serves it.

## Notes

- Never commit your real `.env` file or API key — `.env` should stay out of version control (add it to `.gitignore`).
- The API key stays server-side only; the browser never sees it, since all calls go through your backend.
