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

/**
 * Genera alias cross-language, acronimi e titoli alternativi per massimizzare la reperibilità.
 */
export function getGameAliases(game) {
  const aliases = [];
  if (Array.isArray(game.aliases)) aliases.push(...game.aliases);
  const t = (game.title || '').toLowerCase();
  const id = (game.id || '').toLowerCase();

  // Zelda acronyms & subtitles
  if (t.includes('tears of the kingdom') || id === 'zelda-totk') {
    aliases.push('totk', 'zelda totk', 'tears of the kingdom');
  }
  if (t.includes('breath of the wild') || id === 'zelda-botw') {
    aliases.push('botw', 'zelda botw', 'breath of the wild');
  }
  if (t.includes('echoes of wisdom')) {
    aliases.push('eow', 'zelda echoes of wisdom');
  }

  // Pokemon localized titles & acronyms
  if (t.includes('scarlatto') || id.includes('scarlatto')) {
    aliases.push('scarlet', 'pokemon scarlet', 'pokémon scarlet');
  }
  if (t.includes('violetto') || id.includes('violetto')) {
    aliases.push('violet', 'pokemon violet', 'pokémon violet');
  }
  if (t.includes('arceus')) {
    aliases.push('pokemon legends arceus', 'legends arceus', 'leggende arceus');
  }
  if (t.includes('z-a') || id.includes('z-a')) {
    aliases.push('pokemon legends za', 'legends za', 'pokemon za');
  }

  // Mario & Nintendo classics
  if (t.includes('smash bros') || t.includes('smash brothers')) {
    aliases.push('ssbu', 'smash ultimate', 'smash bros ultimate');
  }
  if (t.includes('mario kart 8')) {
    aliases.push('mk8', 'mk8d', 'mario kart 8 deluxe');
  }
  if (t.includes('animal crossing')) {
    aliases.push('acnh', 'animal crossing new horizons');
  }
  if (t.includes('terra perduta')) {
    aliases.push('kirby and the forgotten land', 'kirby forgotten land', 'forgotten land');
  }
  if (t.includes('portale millenario')) {
    aliases.push('thousand-year door', 'thousand year door', 'ttyd', 'paper mario ttyd');
  }
  if (t.includes('luigi') && t.includes('mansion 3')) {
    aliases.push('lm3', 'luigi mansion 3', 'luigis mansion 3');
  }
  if (t.includes('three houses')) {
    aliases.push('fe3h', 'fire emblem 3 houses', 'fe three houses');
  }
  if (t.includes('xenoblade chronicles 3')) {
    aliases.push('xc3', 'xenoblade 3');
  }
  if (t.includes('monster hunter rise')) {
    aliases.push('mhr', 'sunbreak', 'monster hunter rise sunbreak');
  }
  if (t.includes('dragon quest xi') || t.includes('dragon quest® xi')) {
    aliases.push('dq11', 'dqxi', 'dragon quest 11');
  }
  if (t.includes('runescape')) {
    aliases.push('osrs', 'runescape dragonwilds', 'jagex');
  }
  if (t.includes('gear.club') || t.includes('gear club') || id.includes('gear-club')) {
    aliases.push('gear club unlimited', 'gearclub');
  }
  if (t.includes('bananza') || id.includes('bananza')) {
    aliases.push('dk bananza', 'donkey kong bananza', 'donkey kong switch 2', 'emerald rush', 'dk island');
  }

  return aliases.join(' ');
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
      // Identifica automaticamente piattaforma Switch 2 (prefisso Title ID 0400... o titolo esplicito)
      if (game.titleId && game.titleId.toUpperCase().startsWith('04')) {
        game.platform = 'switch2';
      } else if (game.title && game.title.toLowerCase().includes('switch 2') && game.platform !== 'both') {
        game.platform = 'switch2';
      }

      // Identifica automaticamente se un gioco non è ancora uscito (pre-order o data futura)
      const isUpcoming = Boolean(game.releaseDate && game.releaseDate > today && (!game.updates || game.updates.length === 0));
      game.status = isUpcoming ? 'upcoming' : 'released';

      // Precalcola alias e indice di ricerca normalizzato per ricerche veloci in <5ms
      game._aliases = getGameAliases(game);
      game._searchIndex = normalizeSearchText(`${game.title} ${game.titleId || ''} ${game.publisher || ''} ${game.id || ''} ${game._aliases}`);

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
   * Restituisce i giochi filtrati e ordinati con ricerca semantica a rilevanza
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

    // Ricerca testuale intelligente (Normalizzazione, Token, Title ID, Editore, Alias e Rilevanza)
    if (search && search.trim()) {
      const rawQ = search.trim().toLowerCase();
      const normQ = normalizeSearchText(search);
      const tokens = normQ.split(' ').filter(Boolean);

      const scoredResults = [];
      for (const g of result) {
        let score = 0;
        const normTitle = normalizeSearchText(g.title);
        const normAliases = normalizeSearchText(g._aliases || '');
        const idx = g._searchIndex || normalizeSearchText(`${g.title} ${g.titleId || ''} ${g.publisher || ''}`);

        // Corrispondenza esatta o prefisso titolo
        if (normTitle === normQ) score += 1000;
        else if (normTitle.startsWith(normQ)) score += 500;
        else if (normTitle.includes(normQ)) score += 300;

        // Corrispondenza Title ID
        if (g.titleId && g.titleId.toLowerCase() === rawQ) score += 950;
        else if (g.titleId && g.titleId.toLowerCase().includes(rawQ)) score += 450;

        // Corrispondenza diretta su Alias (es. "pokemon scarlet" -> "Pokémon Scarlatto")
        if (normAliases.includes(normQ)) score += 400;
        else if (tokens.length > 0 && tokens.every(t => normAliases.includes(t))) score += 250;

        // Corrispondenza per token nel titolo
        if (tokens.length > 1 && tokens.every(t => normTitle.includes(t))) score += 200;

        // Corrispondenza nell'indice completo
        if (score === 0 && idx.includes(normQ)) score += 80;
        if (score === 0 && tokens.length > 1 && tokens.every(t => idx.includes(t))) score += 40;

        if (score > 0) {
          // Bonus per giochi con update reali e già usciti
          if (g.updates && g.updates.length > 0) score += 20;
          if (g.status !== 'upcoming') score += 10;
          scoredResults.push({ game: g, score });
        }
      }

      if (sort === 'title_asc') {
        scoredResults.sort((a, b) => a.game.title.localeCompare(b.game.title));
      } else if (sort === 'updates_count') {
        scoredResults.sort((a, b) => (b.game.updates?.length || 0) - (a.game.updates?.length || 0));
      } else {
        // Default 'recent': ordina per pertinenza di rilevanza (relevance) decrescente
        scoredResults.sort((a, b) => b.score - a.score);
      }

      result = scoredResults.map(s => s.game);
    } else {
      // Ordinamento standard quando non c'è ricerca attiva
      if (sort === 'title_asc') {
        result.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === 'updates_count') {
        result.sort((a, b) => (b.updates?.length || 0) - (a.updates?.length || 0));
      } else if (platform === 'upcoming') {
        result.sort((a, b) => new Date(a.releaseDate || '2099-01-01').getTime() - new Date(b.releaseDate || '2099-01-01').getTime());
      } else {
        result.sort((a, b) => {
          const aUpcoming = a.status === 'upcoming';
          const bUpcoming = b.status === 'upcoming';
          if (aUpcoming && !bUpcoming) return 1;
          if (!aUpcoming && bUpcoming) return -1;

          const aHasUpdates = a.updates && a.updates.length > 0;
          const bHasUpdates = b.updates && b.updates.length > 0;

          if (aHasUpdates && bHasUpdates) {
            return new Date(b.lastUpdated || b.releaseDate).getTime() - new Date(a.lastUpdated || a.releaseDate).getTime();
          }
          if (aHasUpdates && !bHasUpdates) return -1;
          if (!aHasUpdates && bHasUpdates) return 1;

          return new Date(b.releaseDate || '1970-01-01').getTime() - new Date(a.releaseDate || '1970-01-01').getTime();
        });
      }
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
