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
    for (const game of this.games) {
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

    // Filtro Piattaforma
    if (platform && platform !== 'all') {
      result = result.filter(g => g.platform === platform || g.platform === 'both');
    }

    // Filtro Genere
    if (genre && genre !== 'all') {
      result = result.filter(g => g.genres && g.genres.some(ge => ge.toLowerCase() === genre.toLowerCase()));
    }

    // Ricerca testuale (Titolo, Title ID, Editore)
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(g =>
        g.title.toLowerCase().includes(q) ||
        (g.titleId && g.titleId.toLowerCase().includes(q)) ||
        (g.publisher && g.publisher.toLowerCase().includes(q))
      );
    }

    // Ordinamento
    if (sort === 'title_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'updates_count') {
      result.sort((a, b) => (b.updates?.length || 0) - (a.updates?.length || 0));
    } else {
      // Default: ordinamento per ultimo aggiornamento (più recente prima)
      result.sort((a, b) => {
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

    for (const g of this.games) {
      totalUpdates += (g.updates?.length || 0);
      if (g.platform === 'switch' || g.platform === 'both') switch1Count++;
      if (g.platform === 'switch2' || g.platform === 'both') switch2Count++;
    }

    return {
      totalGames: this.games.length,
      totalUpdates,
      switch1Count,
      switch2Count,
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
