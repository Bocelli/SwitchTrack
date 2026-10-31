/**
 * [TRAIL:STORE] Database layer for Nintendo Switch & Switch 2 games & updates.
 * - In-memory query index for instant response times
 * - Atomic persistence to JSON storage
 * - Ponytail-approved: minimal, zero-dependency, robust error handling
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/games.json');

/**
 * Normalizza il testo per una ricerca flessibile, tollerante a punteggiatura, punti, accenti e apostrofi.
 */
export function normalizeSearchText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

class GameStore {
  constructor() {
    this.games = [];
    this.gamesById = new Map();
    this.gamesByTitleId = new Map();
    this.lastSync = new Date().toISOString();
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        this.games = JSON.parse(raw);
      } else {
        this.games = [];
      }
      this.rebuildIndexes();
    } catch (err) {
      console.error('[TRAIL:STORE] Errore caricamento database games.json:', err.message);
      this.games = [];
    }
  }

  rebuildIndexes() {
    this.gamesById.clear();
    this.gamesByTitleId.clear();
    const today = new Date().toISOString().slice(0, 10);

    for (const game of this.games) {
      // Identifica automaticamente se un gioco non è ancora uscito (pre-order o data futura)
      const isUpcoming = Boolean(game.releaseDate && game.releaseDate > today && (!game.updates || game.updates.length === 0));
      game.status = isUpcoming ? 'upcoming' : 'released';

      // Precalcola indice di ricerca normalizzato per ricerche veloci in <5ms
      game._searchIndex = normalizeSearchText(`${game.title} ${game.titleId || ''} ${game.publisher || ''}`);

      this.gamesById.set(game.id, game);
      if (game.titleId) {
        this.gamesByTitleId.set(game.titleId.toUpperCase(), game);
      }
    }
  }

  save() {
    try {
      const tempPath = `${DATA_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.games, null, 2), 'utf-8');
      fs.renameSync(tempPath, DATA_FILE);
      return true;
    } catch (err) {
      console.error('[TRAIL:STORE] Errore scrittura atomica games.json:', err.message);
      return false;
    }
  }

  /**
   * Restituisce i giochi filtrati e ordinati
   * @param {Object} filters { platform, search, sort, genre }
   */
  getGames({ platform = 'all', search = '', genre = 'all', sort = 'recent' } = {}) {
    let result = [...this.games];

    // Filtro Piattaforma & Disponibilità
    if (platform === 'upcoming') {
      result = result.filter(g => g.status === 'upcoming');
    } else if (platform && platform !== 'all') {
      result = result.filter(g => (g.platform === platform || g.platform === 'both') && g.status !== 'upcoming');
    }

    // Filtro Genere
    if (genre && genre !== 'all') {
      result = result.filter(g => g.genres && g.genres.some(ge => ge.toLowerCase() === genre.toLowerCase()));
    }

    // Ricerca testuale intelligente (Normalizzazione, Token, Title ID, Editore)
    if (search && search.trim()) {
      const rawQ = search.trim().toLowerCase();
      const normQ = normalizeSearchText(search);
      const tokens = normQ.split(' ').filter(Boolean);

      result = result.filter(g => {
        // Corrispondenza diretta su Title ID o Titolo
        if (g.titleId && g.titleId.toLowerCase().includes(rawQ)) return true;
        if (g.title.toLowerCase().includes(rawQ)) return true;

        const idx = g._searchIndex || normalizeSearchText(`${g.title} ${g.titleId || ''} ${g.publisher || ''}`);
        // Corrispondenza frase normalizzata
        if (idx.includes(normQ)) return true;

        // Corrispondenza per token (tutti i termini della ricerca presenti)
        if (tokens.length > 1 && tokens.every(t => idx.includes(t))) return true;

        return false;
      });
    }

    // Ordinamento
    if (sort === 'title_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'updates_count') {
      result.sort((a, b) => (b.updates?.length || 0) - (a.updates?.length || 0));
    } else if (platform === 'upcoming') {
      // Per i titoli in arrivo: ordina per data di lancio prevista imminente (più vicina prima)
      result.sort((a, b) => new Date(a.releaseDate || '2099-01-01').getTime() - new Date(b.releaseDate || '2099-01-01').getTime());
    } else {
      // Default 'recent':
      // 1. I giochi con aggiornamenti reali hanno la priorità per data di patch più recente
      // 2. I giochi usciti senza update seguono per data di uscita
      // 3. I titoli in arrivo / non ancora usciti vengono messi in fondo, mai in testa
      result.sort((a, b) => {
        const aUpcoming = a.status === 'upcoming';
        const bUpcoming = b.status === 'upcoming';
        if (aUpcoming && !bUpcoming) return 1;
        if (!aUpcoming && bUpcoming) return -1;

        const aHasUpdates = a.updates && a.updates.length > 0;
        const bHasUpdates = b.updates && b.updates.length > 0;
        if (aHasUpdates && !bHasUpdates) return -1;
        if (!aHasUpdates && bHasUpdates) return 1;

        const timeA = new Date(a.lastUpdated || a.releaseDate || 0).getTime();
        const timeB = new Date(b.lastUpdated || b.releaseDate || 0).getTime();
        return timeB - timeA;
      });
    }

    return result;
  }

  /**
   * Ricerca paginata ottimizzata per cataloghi di grandi dimensioni (19.000+ giochi)
   */
  queryGames({ platform = 'all', search = '', genre = 'all', sort = 'recent', page = 1, limit = 24 } = {}) {
    const allFiltered = this.getGames({ platform, search, genre, sort });
    const total = allFiltered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 24));
    const offset = (pageNum - 1) * limitNum;
    const paginated = allFiltered.slice(offset, offset + limitNum);

    return {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: offset + limitNum < total,
      data: paginated
    };
  }

  getGameById(id) {
    if (!id) return null;
    return this.gamesById.get(id) || null;
  }

  getGameByTitleId(titleId) {
    if (!titleId) return null;
    return this.gamesByTitleId.get(titleId.toUpperCase()) || null;
  }

  /**
   * Estrae i singoli aggiornamenti più recenti tra tutti i giochi del catalogo
   */
  getLatestUpdates(limit = 8) {
    const allUpdates = [];

    for (const game of this.games) {
      if (Array.isArray(game.updates)) {
        for (const update of game.updates) {
          allUpdates.push({
            gameId: game.id,
            gameTitle: game.title,
            gamePlatform: game.platform,
            gameCover: game.coverImage,
            eshopUrl: game.eshopUrl,
            ...update
          });
        }
      }
    }

    // Ordina dal più recente
    allUpdates.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    return allUpdates.slice(0, limit);
  }

  /**
   * Statistiche del database
   */
  getStats() {
    let totalUpdates = 0;
    let switch1Count = 0;
    let switch2Count = 0;
    let upcomingCount = 0;

    for (const g of this.games) {
      totalUpdates += (g.updates?.length || 0);
      if (g.status === 'upcoming') upcomingCount++;
      if (g.platform === 'switch' || g.platform === 'both') switch1Count++;
      if (g.platform === 'switch2' || g.platform === 'both') switch2Count++;
    }

    return {
      totalGames: this.games.length,
      totalUpdates,
      switch1Count,
      switch2Count,
      upcomingCount,
      lastSync: this.lastSync
    };
  }

  /**
   * Registra un nuovo update per un gioco specifico
   */
  recordUpdate(gameId, updateData) {
    const game = this.gamesById.get(gameId);
    if (!game) return { success: false, error: 'Gioco non trovato' };

    // Evita duplicati della stessa versione
    const exists = game.updates?.some(u => u.version === updateData.version);
    if (exists) {
      return { success: false, message: 'Versione già presente per questo titolo' };
    }

    if (!Array.isArray(game.updates)) game.updates = [];

    const newUpdate = {
      version: updateData.version,
      previousVersion: game.currentVersion || updateData.previousVersion || 'v1.0.0',
      internalVersion: updateData.internalVersion || (game.currentInternalVersion ? game.currentInternalVersion + 65536 : 65536),
      releaseDate: updateData.releaseDate || new Date().toISOString().split('T')[0],
      type: updateData.type || 'patch',
      title: updateData.title || `Aggiornamento ${updateData.version}`,
      changelog: Array.isArray(updateData.changelog) ? updateData.changelog : [updateData.changelog || 'Miglioramenti di stabilità e risoluzione bug.']
    };

    game.updates.unshift(newUpdate);
    game.currentVersion = newUpdate.version;
    game.currentInternalVersion = newUpdate.internalVersion;
    game.lastUpdated = new Date().toISOString();

    this.save();
    return { success: true, update: newUpdate, game };
  }

  setLastSync(isoDate) {
    this.lastSync = isoDate;
  }
}

export const store = new GameStore();
