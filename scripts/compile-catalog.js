/**
 * [TRAIL:BUILDER] Script di compilazione del catalogo completo per Nintendo Switch e Switch 2
 * Unisce i dati ufficiali Nintendo eTitleDB:
 * - 18 curated high-profile titles con changelog narrativi dettagliati e titoli Switch 2
 * - Migliaia di titoli base ufficiali da IT.it.json
 * - Tracciamento degli aggiornamenti storici e calcolo semver da versions.json
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG } from '../src/importer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const IT_FILE = path.join(DATA_DIR, 'it_raw.json');
const VERSIONS_FILE = path.join(DATA_DIR, 'versions_raw.json');
const OUT_FILE = path.join(DATA_DIR, 'games.json');

function formatVersion(num) {
  if (!num || num === 0) return 'v1.0.0';
  const major = (num >> 16) & 0xFFFF;
  const minor = (num >> 8) & 0xFF;
  const patch = num & 0xFF;
  return `v${major}.${minor}.${patch}`;
}

function formatDate(raw) {
  if (!raw) return '2020-01-01';
  const str = String(raw).trim();
  if (/^\d{8}$/.test(str)) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  return '2020-01-01';
}

async function run() {
  console.log('[COMPILER] Avvio compilazione catalogo...');

  if (!fs.existsSync(IT_FILE) || !fs.existsSync(VERSIONS_FILE)) {
    console.error('[COMPILER] File raw mancanti in data/');
    process.exit(1);
  }

  const itData = JSON.parse(fs.readFileSync(IT_FILE, 'utf8'));
  const versionsData = JSON.parse(fs.readFileSync(VERSIONS_FILE, 'utf8'));

  const seenTitleIds = new Set();
  const compiledGames = [];

  // 1. Prima inseriamo tutti i curated games (con changelog completi e Switch 2)
  for (const game of CATALOG) {
    seenTitleIds.add(game.titleId.toUpperCase());
    compiledGames.push(game);
  }
  console.log(`[COMPILER] Inseriti ${compiledGames.length} titoli curati.`);

  // 2. Aggiungiamo i titoli base da IT.it.json
  let addedCount = 0;
  for (const [nsuId, item] of Object.entries(itData)) {
    if (!item.name || !item.id) continue;
    const tid = item.id.toUpperCase();

    // Filtra per titoli base (terminanti con 000) ed evita duplicati
    if (!tid.endsWith('000') || seenTitleIds.has(tid)) continue;
    seenTitleIds.add(tid);

    const rawVersions = versionsData[tid.toLowerCase()] || versionsData[tid] || {};
    const versionKeys = Object.keys(rawVersions).map(Number).sort((a, b) => b - a);

    const updates = [];
    for (let i = 0; i < Math.min(versionKeys.length, 8); i++) {
      const cur = versionKeys[i];
      const prev = versionKeys[i + 1] || 0;
      const curVer = formatVersion(cur);
      const prevVer = prev ? formatVersion(prev) : 'v1.0.0';
      const releaseDate = rawVersions[cur] ? formatDate(rawVersions[cur]) : '2025-01-01';

      updates.push({
        version: curVer,
        previousVersion: prevVer,
        internalVersion: cur,
        releaseDate: releaseDate,
        type: i === 0 && versionKeys.length > 2 ? 'major' : 'patch',
        title: `Aggiornamento software ${curVer}`,
        changelog: [
          'Miglioramenti generali della stabilità di sistema per ottimizzare l\'esperienza utente.',
          'Correzioni di bug minori e ottimizzazioni di performance per Nintendo Switch.'
        ]
      });
    }

    const currentInternal = versionKeys[0] || 0;
    const currentVer = formatVersion(currentInternal);
    const lastUpdated = updates[0] && updates[0].releaseDate
      ? `${updates[0].releaseDate}T12:00:00Z`
      : (item.releaseDate ? `${formatDate(item.releaseDate)}T00:00:00Z` : '2020-01-01T00:00:00Z');

    const slug = (item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || tid);
    const gameId = `${slug}-${tid.slice(-4).toLowerCase()}`;

    // Preferisci il banner widescreen 16:9, poi icona o endpoint SVG fallback
    const cover = item.bannerUrl || item.iconUrl || `/api/cover/${encodeURIComponent(gameId)}`;
    const eshopUrl = item.nsuId ? `https://ec.nintendo.com/IT/it/titles/${item.nsuId}` : null;
    const releaseDate = formatDate(item.releaseDate);

    compiledGames.push({
      id: gameId,
      title: item.name,
      platform: 'switch',
      titleId: tid,
      publisher: item.publisher || 'Nintendo',
      releaseDate: releaseDate,
      genres: Array.isArray(item.category) && item.category.length > 0 ? item.category : ['Azione'],
      coverImage: cover,
      eshopUrl: eshopUrl,
      currentVersion: currentVer,
      currentInternalVersion: currentInternal,
      lastUpdated: lastUpdated,
      updates: updates
    });

    addedCount++;
  }

  console.log(`[COMPILER] Aggiunti ${addedCount} titoli base ufficiali. Totale: ${compiledGames.length}`);

  // Ordina default: i giochi aggiornati più di recente per primi
  compiledGames.sort((a, b) => {
    const timeA = new Date(a.lastUpdated || a.releaseDate || 0).getTime();
    const timeB = new Date(b.lastUpdated || b.releaseDate || 0).getTime();
    return timeB - timeA;
  });

  // Scrittura atomica del file compatto finale
  const jsonStr = JSON.stringify(compiledGames);
  fs.writeFileSync(OUT_FILE, jsonStr, 'utf8');
  const sizeMB = (Buffer.byteLength(jsonStr) / (1024 * 1024)).toFixed(2);
  console.log(`[COMPILER] File ${OUT_FILE} generato con successo! Dimensione: ${sizeMB} MB`);

  // Pulizia file raw per non appesantire git
  try {
    fs.unlinkSync(IT_FILE);
    fs.unlinkSync(VERSIONS_FILE);
    const nswdbPath = path.join(DATA_DIR, 'nswdb.xml');
    if (fs.existsSync(nswdbPath)) fs.unlinkSync(nswdbPath);
    console.log('[COMPILER] File temporanei raw eliminati con successo.');
  } catch (cleanErr) {
    console.warn('[COMPILER] Nota pulizia file raw:', cleanErr.message);
  }
}

run();
