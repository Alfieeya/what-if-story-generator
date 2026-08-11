require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    '\n⚠️  GEMINI_API_KEY is not set. Copy .env.example to .env and add your free key from https://aistudio.google.com/apikey\n'
  );
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const LENGTH_GUIDE = {
  short: 'about 150-250 words — a tight flash-fiction scene',
  medium: 'about 400-600 words — a short scene with a clear arc',
  long: 'about 800-1100 words — a fuller short story with setup, turn, and resolution',
};

const GENRE_GUIDE = {
  any: 'Choose whatever genre best fits the premise.',
  scifi: 'Science fiction.',
  fantasy: 'Fantasy.',
  mystery: 'Mystery / suspense.',
  historical: 'Historical fiction, grounded in a plausible past setting.',
  comedy: 'Comedic / absurdist tone.',
  horror: 'Horror / unsettling tone.',
};

function buildSystemPrompt({ genre, length }) {
  const lengthNote = LENGTH_GUIDE[length] || LENGTH_GUIDE.medium;
  const genreNote = GENRE_GUIDE[genre] || GENRE_GUIDE.any;

  return [
    'You are a skilled fiction writer for a "What If" story generator app.',
    'The user gives a short "what if" premise. Turn it into a complete, self-contained short story that takes the premise seriously and explores one interesting consequence of it.',
    `Genre guidance: ${genreNote}`,
    `Length guidance: ${lengthNote}`,
    'Write only the story itself — no title, no preamble, no meta-commentary, no "Here is your story".',
    'Use vivid, concrete detail and a clear beginning, middle, and end.',
  ].join(' ');
}

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, genre = 'any', length = 'medium' } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'A "what if" prompt is required.' });
    }
    if (prompt.length > 500) {
      return res.status(400).json({ error: 'Prompt is too long (max 500 characters).' });
    }

    const interaction = await ai.interactions.create({
      model: 'gemini-3.6-flash',
      system_instruction: buildSystemPrompt({ genre, length }),
      input: `What if ${prompt.trim().replace(/^what if/i, '').trim()}`,
    });

    const story = (interaction.output_text || '').trim();

    if (!story) {
      return res.status(502).json({ error: 'The model returned an empty response. Try again.' });
    }

    res.json({ story });
  } catch (err) {
    console.error('Generate error:', err);
    const status = err?.status || err?.code || 500;
    const message =
      status === 401 || status === 403
        ? 'Invalid or missing API key on the server.'
        : status === 429
        ? 'Rate limited — free tier allows a limited number of requests per minute/day. Wait a moment and try again.'
        : 'Something went wrong generating the story.';
    res.status([401, 403, 429].includes(status) ? status : 500).json({ error: message });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use(express.static(FRONTEND_DIR));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`What-If Story Generator API running on http://localhost:${PORT}`);
});