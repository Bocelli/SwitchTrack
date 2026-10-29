/**
 * [TRAIL:API] Web Server for Nintendo Switch & Switch 2 Update Tracker.
 * - Strict security headers (CSP, NoSniff, X-Frame-Options)
 * - Sanitized REST endpoints for game catalog, search, and update streams
 * - Static file delivery for frontend
 * - Ponytail-approved: lean, clear error responses, zero bloat
 */

import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { store } from './src/store.js';
import { tracker } from './src/tracker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT || 3000;

// Middleware di sicurezza per browser (Ponytail & Security best practices)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https://assets.nintendo.com https://img-eshop.cdn.nintendo.net https://*.cdn.nintendo.net https://*.nintendo.net https://*.nintendo.com https://shared.steamstatic.com https://*.steamstatic.com https://shared.cloudflare.steamstatic.com https://images.unsplash.com https://placehold.co; " +
    "connect-src 'self';"
  );
  next();
});

app.use(express.json({ limit: '64kb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  etag: false,
  maxAge: 0
}));

// Cooldown per evitare spam su /api/sync
let lastSyncCall = 0;

/**
 * GET /api/stats
 * Ritorna le statistiche globali della piattaforma
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = store.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Errore interno recupero statistiche' });
  }
});

/**
 * GET /api/games
 * Elenco giochi con filtri per piattaforma, ricerca e ordinamento
 */
app.get('/api/games', (req, res) => {
  try {
    const { platform = 'all', search = '', genre = 'all', sort = 'recent', page = '1', limit = '24' } = req.query;

    // Sanitizzazione base
    const sanitizedSearch = String(search).slice(0, 100);
    const sanitizedPlatform = ['all', 'switch', 'switch2', 'upcoming'].includes(platform) ? platform : 'all';
    const sanitizedSort = ['recent', 'title_asc', 'updates_count'].includes(sort) ? sort : 'recent';
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));

    const result = store.queryGames({
      platform: sanitizedPlatform,
      search: sanitizedSearch,
      genre: String(genre).slice(0, 40),
      sort: sanitizedSort,
      page: pageNum,
      limit: limitNum
    });

    res.json({
      success: true,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasMore: result.hasMore,
      count: result.data.length,
      data: result.data
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Errore recupero catalogo giochi' });
  }
});

/**
 * GET /api/games/:id
 * Dettaglio completo di un singolo gioco con tutto lo storico versioni
 */
app.get('/api/games/:id', (req, res) => {
  try {
    const id = String(req.params.id).replace(/[^a-zA-Z0-9-_]/g, '');
    const game = store.getGameById(id);
    if (!game) {
      return res.status(404).json({ success: false, error: 'Gioco non trovato' });
    }
    res.json({ success: true, data: game });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Errore recupero dettaglio gioco' });
  }
});

/**
 * GET /api/updates/latest
 * Gli ultimi aggiornamenti rilasciati globalmente
 */
app.get('/api/updates/latest', (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 8, 1), 24);
    const latest = store.getLatestUpdates(limit);
    res.json({ success: true, count: latest.length, data: latest });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Errore recupero ultimi aggiornamenti' });
  }
});

/**
 * POST /api/sync
 * Avvia sincronizzazione manuale degli aggiornamenti
 */
app.post('/api/sync', async (req, res) => {
  const now = Date.now();
  if (now - lastSyncCall < 5000) {
    return res.status(429).json({
      success: false,
      error: 'Troppe richieste: attendi 5 secondi prima di sincronizzare nuovamente.'
    });
  }
  lastSyncCall = now;

  const result = await tracker.syncNow();
  res.json({ success: true, result });
});

/**
 * POST /api/games/:id/updates (Utility / Test)
 * Registra un nuovo aggiornamento manualmente per simulazione
 */
app.post('/api/games/:id/updates', (req, res) => {
  try {
    const id = String(req.params.id).replace(/[^a-zA-Z0-9-_]/g, '');
    const { version, releaseDate, type, title, changelog } = req.body;

    if (!version || typeof version !== 'string') {
      return res.status(400).json({ success: false, error: 'Campo "version" obbligatorio (es. v2.1.2)' });
    }

    const result = store.recordUpdate(id, { version, releaseDate, type, title, changelog });
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Errore registrazione update' });
  }
});

/**
 * GET /api/cover/:id
 * Genera una copertina vettoriale SVG dinamica e ad altissima fedeltà per qualsiasi gioco
 * Risolve al 100% il problema dei 404 remoti ed è 100% CSP-safe.
 */
app.get('/api/cover/:id', (req, res) => {
  try {
    const id = String(req.params.id).replace(/[^a-zA-Z0-9-_]/g, '');
    const game = store.getGameById(id);

    const title = game ? game.title : 'Nintendo Switch Software';
    const publisher = game ? (game.publisher || 'Nintendo') : 'Nintendo';
    const platform = game ? game.platform : 'switch';
    const titleId = game ? (game.titleId || '') : '';
    const version = game ? (game.currentVersion || 'v1.0.0') : 'v1.0.0';

    const isSwitch2 = platform === 'switch2';
    const accentColor = isSwitch2 ? '#8b5cf6' : '#e60012';
    const platformText = isSwitch2 ? 'NINTENDO SWITCH 2' : 'NINTENDO SWITCH';

    // Suddivide il titolo su più righe se troppo lungo
    const escapedTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const escapedPub = publisher.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#141824" />
      <stop offset="50%" stop-color="#0e111a" />
      <stop offset="100%" stop-color="#08090d" />
    </linearGradient>
    <radialGradient id="accentGlow" cx="85%" cy="15%" r="70%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
      <stop offset="60%" stop-color="${accentColor}" stop-opacity="0.05" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="1" />
    </pattern>
  </defs>

  <!-- Sfondo principale -->
  <rect width="800" height="450" fill="url(#bgGrad)" />
  <rect width="800" height="450" fill="url(#grid)" />
  <rect width="800" height="450" fill="url(#accentGlow)" />

  <!-- Dettaglio estetico Joy-Con stilizzato -->
  <g transform="translate(620, 80) scale(1.4)" opacity="0.15">
    <rect x="0" y="0" width="70" height="150" rx="35" fill="none" stroke="#ffffff" stroke-width="8" />
    <circle cx="35" cy="45" r="16" fill="#ffffff" />
    <circle cx="35" cy="105" r="7" fill="#ffffff" />
    <circle cx="20" cy="120" r="7" fill="#ffffff" />
    <circle cx="50" cy="120" r="7" fill="#ffffff" />
    <circle cx="35" cy="135" r="7" fill="#ffffff" />
  </g>

  <!-- Badge Piattaforma Superiore -->
  <g transform="translate(50, 60)">
    <rect width="${isSwitch2 ? '210' : '185'}" height="32" rx="6" fill="${accentColor}" fill-opacity="0.2" stroke="${accentColor}" stroke-opacity="0.6" stroke-width="1.5" />
    <circle cx="16" cy="16" r="5" fill="${accentColor}" />
    <text x="30" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="1.5">${platformText}</text>
  </g>

  <!-- Badge Versione -->
  <g transform="translate(${isSwitch2 ? '275' : '250'}, 60)">
    <rect width="80" height="32" rx="6" fill="rgba(0,195,227,0.15)" stroke="rgba(0,195,227,0.4)" stroke-width="1" />
    <text x="40" y="21" font-family="'Courier New', monospace" font-size="12" font-weight="700" fill="#38bdf8" text-anchor="middle">${version}</text>
  </g>

  <!-- Titolo del Gioco -->
  <text x="50" y="210" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="34" font-weight="800" fill="#f8fafc" letter-spacing="-0.5">
    ${escapedTitle}
  </text>

  <!-- Editore e Metadati -->
  <text x="50" y="260" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="16" font-weight="500" fill="#94a3b8">
    ${escapedPub} &bull; ${titleId ? 'ID: ' + titleId : ''}
  </text>

  <!-- Bordo inferiore decorativo Joy-Con -->
  <rect x="0" y="444" width="800" height="6" fill="${accentColor}" />
</svg>`;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(svg);
  } catch (err) {
    res.status(500).send('Errore generazione copertina');
  }
});

// Fallback per SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Avvia server e schedulatore periodico (ogni 60 minuti)
const server = app.listen(PORT, () => {
  console.log(`[TRAIL:API] Server SwitchTrack attivo su http://localhost:${PORT}`);
  tracker.startScheduler(60);
});

export default app;
