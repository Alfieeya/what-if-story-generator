const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const errorMsg = document.getElementById('errorMsg');
const branchTrack = document.getElementById('branchTrack');
const branchStatus = document.getElementById('branchStatus');
const manuscript = document.getElementById('manuscript');
const storyText = document.getElementById('storyText');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const againBtn = document.getElementById('againBtn');
const genreRow = document.getElementById('genreRow');
const lengthRow = document.getElementById('lengthRow');

let state = {
  genre: 'any',
  length: 'medium',
  generating: false,
};

const STATUS_MESSAGES = [
  'weighing possibilities…',
  'following one thread…',
  'letting it unfold…',
];

function setupPillRow(row, key) {
  row.addEventListener('click', (e) => {
    const btn = e.target.closest('.pill');
    if (!btn) return;
    row.querySelectorAll('.pill').forEach((p) => p.classList.remove('is-active'));
    btn.classList.add('is-active');
    state[key] = btn.dataset[key];
  });
}

setupPillRow(genreRow, 'genre');
setupPillRow(lengthRow, 'length');

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.hidden = false;
}

function clearError() {
  errorMsg.hidden = true;
  errorMsg.textContent = '';
}

function cycleStatusMessages() {
  let i = 0;
  branchStatus.textContent = STATUS_MESSAGES[0];
  return setInterval(() => {
    i = (i + 1) % STATUS_MESSAGES.length;
    branchStatus.textContent = STATUS_MESSAGES[i];
  }, 1800);
}

async function generateStory() {
  if (state.generating) return;
  const prompt = promptInput.value.trim();

  if (!prompt) {
    showError('Type a premise first — even a few words will do.');
    promptInput.focus();
    return;
  }

  clearError();
  state.generating = true;
  generateBtn.disabled = true;
  manuscript.hidden = true;
  branchTrack.hidden = false;
  const statusTimer = cycleStatusMessages();

  try {
    const API_BASE = 'https://what-if-story-generator.onrender.com'; 

    const res = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          genre: state.genre,
          length: state.length,
        }),
      });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong. Try again.');
    }

    storyText.textContent = data.story;
    manuscript.hidden = false;
    manuscript.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    showError(err.message || 'Something went wrong. Try again.');
  } finally {
    clearInterval(statusTimer);
    branchTrack.hidden = true;
    state.generating = false;
    generateBtn.disabled = false;
  }
}

generateBtn.addEventListener('click', generateStory);

promptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    generateStory();
  }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(storyText.textContent);
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = original; }, 1500);
  } catch {
    showError('Could not copy — select and copy the text manually.');
  }
});

downloadBtn.addEventListener('click', () => {
  const blob = new Blob([storyText.textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'what-if-story.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

againBtn.addEventListener('click', () => {
  manuscript.hidden = true;
  promptInput.value = '';
  promptInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
