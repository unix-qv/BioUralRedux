import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persistent views counter file - placed in node_modules/.cache to avoid triggering Vite's file watcher and page reloads
const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.cache');
const DATA_FILE = path.join(CACHE_DIR, 'views.json');

function getViews(): number {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      return typeof parsed.views === 'number' ? parsed.views : 1;
    }
    // Backward compatibility if root views.json exists
    const oldFile = path.join(process.cwd(), 'views.json');
    if (fs.existsSync(oldFile)) {
      const data = fs.readFileSync(oldFile, 'utf-8');
      const parsed = JSON.parse(data);
      return typeof parsed.views === 'number' ? parsed.views : 1;
    }
  } catch (err) {
    console.error('Error reading views file:', err);
  }
  return 1;
}

function saveViews(views: number) {
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify({ views }), 'utf-8');
  } catch (err) {
    console.error('Error saving views file:', err);
  }
}

// In-memory set of visitor tokens to prevent duplicate counts from the same browser session
const visitorTokens = new Set<string>();

// Real Views API endpoint
app.get('/api/views', (req, res) => {
  const visitorId = (req.headers['x-visitor-id'] as string) || req.ip || 'anonymous';
  const shouldIncrement = req.query.increment === 'true' && !visitorTokens.has(visitorId);

  let currentViews = getViews();

  if (shouldIncrement) {
    visitorTokens.add(visitorId);
    currentViews += 1;
    saveViews(currentViews);
  }

  res.json({ views: currentViews });
});

// Reset endpoint for testing if needed
app.post('/api/views/reset', (req, res) => {
  visitorTokens.clear();
  saveViews(0);
  res.json({ views: 0 });
});

async function start() {
  // Directly serve public directory so uploaded files (avatar.png, musik.png) are instantly accessible
  app.use(express.static(path.join(process.cwd(), 'public')));

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        watch: {
          ignored: ['**/views.json', '**/.views*', '**/node_modules/**'],
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
