/**
 * [TRAIL:SYNC] Upstream Nintendo Switch & Switch 2 Updates Synchronizer
 * - Fetches upstream live version feeds from community / Nintendo TitleDB
 * - Detects newly released updates, delta versions, and patch timestamps
 * - Preserves curated flagship changelogs while keeping the remaining 19,000+ titles synced
 * - Designed to run in GitHub Actions daily cron or on-demand
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CATALOG } from '../src/importer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/games.json');

const UPSTREAM_VERSIONS_URL = 'https://raw.githubusercontent.com/blawar/titledb/master/versions.json';

const curatedIds = new Set(CATALOG.map(c => c.id));
const curatedTitleIds = new Set(CATALOG.map(c => c.titleId.toUpperCase()));

function formatVersion(num) {
  if (!num || num === 0) return 'v1.0.0';
  const major = (num >> 16) & 0xFFFF;
  const minor = (num >> 8) & 0xFF;
  const patch = num & 0xFF;
  return `v${major}.${minor}.${patch}`;
}

function formatDate(raw) {
  if (!raw) return new Date().toISOString().split('T')[0];
  const str = String(raw).trim();
  if (/^\d{8}$/.test(str)) {
    return `${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return str.slice(0, 10);
  }
  return new Date().toISOString().split('T')[0];
}

async function fetchUpstreamVersions() {
  console.log(`[SYNC] Scaricamento versioni aggiornate da ${UPSTREAM_VERSIONS_URL}...`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const res = await fetch(UPSTREAM_VERSIONS_URL, {
      signal: controller.signal,
      headers: { 'User-Agent': 'SwitchTrack-DailySync/1.0' }
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`Risposta HTTP non valida: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log(`[SYNC] Feed scaricato con successo. Titoli nel feed: ${Object.keys(data).length}`);
    return data;
  } catch (err) {
    clearTimeout(timeout);
    console.error(`[SYNC] Errore recupero feed upstream: ${err.message}`);
    return null;
  }
}

function isCurated(game) {
  if (curatedIds.has(game.id)) return true;
  if (game.titleId && curatedTitleIds.has(game.titleId.toUpperCase())) return true;
  if (Array.isArray(game.updates) && game.updates.some(u => u.title && !u.title.startsWith('Aggiornamento software v') && !u.title.startsWith('Software Update v'))) {
    return true;
  }
  return false;
}

export async function runSync() {
  console.log('========================================================');
  console.log('🔄 AVVIO SINCRONIZZAZIONE GIORNALIERA CATALOGO GIOCHI');
  console.log('========================================================');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`[SYNC] File non trovato: ${DATA_FILE}`);
    process.exit(1);
  }

  const rawGames = fs.readFileSync(DATA_FILE, 'utf8');
  const games = JSON.parse(rawGames);
  console.log(`[SYNC] Giochi nel database locale: ${games.length}`);

  const upstreamData = await fetchUpstreamVersions();
  if (!upstreamData) {
    console.log('[SYNC] Nessun dato upstream recuperato. Nessuna modifica applicata.');
    return { updatedCount: 0, newPatches: [] };
  }

  let updatedGamesCount = 0;
  const newPatches = [];

  for (const game of games) {
    if (!game.titleId) continue;
    const tidLower = game.titleId.toLowerCase();
    const tidUpper = game.titleId.toUpperCase();

    // I titoli curati hanno marketing versioning dedicato: non sovrascrivere con raw build numbers
    if (isCurated(game)) {
      continue;
    }

    const remoteVersions = upstreamData[tidLower] || upstreamData[tidUpper];
    if (!remoteVersions || typeof remoteVersions !== 'object') continue;

    const versionNums = Object.keys(remoteVersions).map(Number).filter(n => !isNaN(n)).sort((a, b) => b - a);
    if (versionNums.length === 0) continue;

    const highestRemoteInternal = versionNums[0];
    const currentInternal = game.currentInternalVersion || 0;

    // Se upstream ha una versione interna superiore a quella registrata
    if (highestRemoteInternal > currentInternal) {
      const prevInternal = currentInternal;
      const prevVer = game.currentVersion || (prevInternal ? formatVersion(prevInternal) : 'v1.0.0');
      const newVer = formatVersion(highestRemoteInternal);
      const rawRelDate = remoteVersions[String(highestRemoteInternal)];
      const releaseDate = formatDate(rawRelDate);

      const isMajor = (highestRemoteInternal >> 16) > (prevInternal >> 16);
      const updateType = isMajor ? 'major' : 'patch';

      const updateEntry = {
        version: newVer,
        previousVersion: prevVer,
        internalVersion: highestRemoteInternal,
        releaseDate: releaseDate,
        type: updateType,
        title: `Aggiornamento software ${newVer}`,
        changelog: [
          'Miglioramenti generali della stabilità di sistema per ottimizzare l\'esperienza utente.',
          'Correzioni di bug minori e ottimizzazioni di performance per Nintendo Switch.'
        ]
      };

      if (!Array.isArray(game.updates)) game.updates = [];

      // Evita duplicati di versione
      if (!game.updates.some(u => u.version === newVer)) {
        game.updates.unshift(updateEntry);
      }

      game.currentVersion = newVer;
      game.currentInternalVersion = highestRemoteInternal;
      game.lastUpdated = `${releaseDate}T12:00:00Z`;

      updatedGamesCount++;
      newPatches.push({
        title: game.title,
        id: game.id,
        titleId: game.titleId,
        from: prevVer,
        to: newVer,
        date: releaseDate
      });
    }
  }

  console.log(`\n📊 RISULTATI SINCRONIZZAZIONE:`);
  console.log(`- Nuovi aggiornamenti rilevati: ${updatedGamesCount}`);

  if (process.env.GITHUB_STEP_SUMMARY) {
    try {
      const summaryContent = [
        '### 🔄 SwitchTrack - Report Sincronizzazione Upstream',
        '',
        `| Metrica | Valore |`,
        `| :--- | :--- |`,
        `| **Giochi nel catalogo** | ${games.length.toLocaleString('it-IT')} |`,
        `| **Nuovi aggiornamenti rilevati** | **${updatedGamesCount}** |`,
        `| **Esito** | ${updatedGamesCount > 0 ? '✅ Catalogo aggiornato e salvato' : '✨ Tutti i giochi sono già allineati all\'ultima versione'} |`,
        '',
        updatedGamesCount > 0
          ? `#### 📦 Titoli aggiornati:\n` + newPatches.slice(0, 15).map(p => `- **${p.title}**: \`${p.from}\` ➔ \`${p.to}\` (${p.date})`).join('\n')
          : `> Nessuna nuova patch rilevata nei feed upstream di Nintendo nelle ultime ore. Nessun commit vuoto necessario.`
      ].join('\n');
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summaryContent + '\n', 'utf8');
    } catch (e) {
      console.warn('[SYNC] Impossibile scrivere GITHUB_STEP_SUMMARY:', e.message);
    }
  }

  if (updatedGamesCount > 0) {
    newPatches.slice(0, 10).forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.date}] ${p.title} (${p.from} -> ${p.to})`);
    });
    if (newPatches.length > 10) {
      console.log(`  ... e altri ${newPatches.length - 10} titoli.`);
    }

    // Riordina per data di aggiornamento più recente
    games.sort((a, b) => {
      const timeA = new Date(a.lastUpdated || a.releaseDate || 0).getTime();
      const timeB = new Date(b.lastUpdated || b.releaseDate || 0).getTime();
      return timeB - timeA;
    });

    // Scrittura atomica
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(games, null, 2), 'utf8');
    fs.renameSync(tempFile, DATA_FILE);
    console.log(`[SYNC] data/games.json aggiornato e salvato con successo!`);
  } else {
    console.log(`[SYNC] Tutti i giochi sono già allineati alle ultime versioni upstream.`);
  }

  return { updatedGamesCount, newPatches };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSync().catch(err => {
    console.error('[SYNC] Errore fatale:', err);
    process.exit(1);
  });
}
