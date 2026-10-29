/**
 * [TRAIL:UI-JS] Frontend Client Application
 * - Reactive search, filtering, and sorting
 * - Safe HTML escaping to guarantee zero XSS
 * - Interactive game detail modal & mobile bottom-sheet
 * - Direct eShop integration and Title ID copy
 */

// Stato dell'applicazione
const state = {
  platform: 'all',
  search: '',
  sort: 'recent',
  games: [],
  latestUpdates: [],
  stats: null,
  activeGame: null
};

// Elementi DOM
const elements = {
  statTotalGames: document.getElementById('stat-total-games'),
  statTotalUpdates: document.getElementById('stat-total-updates'),
  statSwitch1Count: document.getElementById('stat-switch1-count'),
  statSwitch2Count: document.getElementById('stat-switch2-count'),
  latestContainer: document.getElementById('latest-updates-carousel'),
  gamesGrid: document.getElementById('games-grid'),
  emptyState: document.getElementById('empty-state'),
  searchInput: document.getElementById('search-input'),
  searchClearBtn: document.getElementById('search-clear-btn'),
  tabBtns: document.querySelectorAll('.tab-btn'),
  sortSelect: document.getElementById('sort-select'),
  syncBtn: document.getElementById('sync-btn'),
  resetFiltersBtn: document.getElementById('reset-filters-btn'),
  modal: document.getElementById('game-modal'),
  modalContent: document.getElementById('modal-content'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  toastContainer: document.getElementById('toast-container')
};

/**
 * Funzione di sanitizzazione stringhe contro XSS (Ponytail & Browser Security)
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formatta date ISO in formato italiano leggibile (es. "26 Ott 2026")
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Data n/d';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Mostra una notifica toast transitoria
 */
function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
    <span>${escapeHtml(message)}</span>
  `;
  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/**
 * Carica le statistiche generali
 */
async function loadStats() {
  try {
    const res = await fetch('/api/stats');
    const json = await res.json();
    if (json.success && json.data) {
      state.stats = json.data;
      elements.statTotalGames.textContent = json.data.totalGames;
      elements.statTotalUpdates.textContent = json.data.totalUpdates;
      elements.statSwitch1Count.textContent = json.data.switch1Count;
      elements.statSwitch2Count.textContent = json.data.switch2Count;
    }
  } catch (err) {
    console.error('Errore caricamento statistiche:', err);
  }
}

/**
 * Carica gli ultimi aggiornamenti rilasciati
 */
async function loadLatestUpdates() {
  try {
    const res = await fetch('/api/updates/latest?limit=8');
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      state.latestUpdates = json.data;
      renderLatestUpdates();
    }
  } catch (err) {
    elements.latestContainer.innerHTML = '<div class="loading-state">Errore caricamento aggiornamenti.</div>';
  }
}

/**
 * Renderizza la sezione orizzontale "Ultimi Aggiornamenti Rilasciati"
 */
function renderLatestUpdates() {
  if (!state.latestUpdates.length) {
    elements.latestContainer.innerHTML = '<div class="loading-state">Nessun aggiornamento recente registrato.</div>';
    return;
  }

  elements.latestContainer.innerHTML = state.latestUpdates.map(up => {
    const platformClass = up.gamePlatform === 'switch2' ? 'switch2' : 'switch';
    const platformLabel = up.gamePlatform === 'switch2' ? 'Switch 2' : 'Switch';
    
    return `
      <article class="latest-update-card" data-game-id="${escapeHtml(up.gameId)}" role="button" tabindex="0" aria-label="Visualizza dettagli di ${escapeHtml(up.gameTitle)}">
        <div class="card-top-badges">
          <span class="badge-version">${escapeHtml(up.version)}</span>
          <span class="badge-date">${formatDate(up.releaseDate)}</span>
        </div>
        <h3 class="latest-card-game-title">${escapeHtml(up.gameTitle)}</h3>
        <p class="latest-card-headline">${escapeHtml(up.title || 'Nuovo aggiornamento software')}</p>
        <div class="latest-card-footer">
          <span class="platform-pill ${platformClass}">${platformLabel}</span>
          <span style="font-size: 0.72rem; color: var(--switch-cyan); font-weight: 600;">Dettagli &rarr;</span>
        </div>
      </article>
    `;
  }).join('');

  // Click handler per aprire direttamente il gioco
  elements.latestContainer.querySelectorAll('.latest-update-card').forEach(card => {
    const gameId = card.getAttribute('data-game-id');
    card.addEventListener('click', () => openGameModal(gameId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGameModal(gameId);
      }
    });
  });
}

/**
 * Carica e filtra il catalogo giochi
 */
async function loadGames() {
  try {
    const params = new URLSearchParams({
      platform: state.platform,
      search: state.search,
      sort: state.sort
    });

    const res = await fetch(`/api/games?${params.toString()}`);
    const json = await res.json();

    if (json.success && Array.isArray(json.data)) {
      state.games = json.data;
      renderGames();
    }
  } catch (err) {
    elements.gamesGrid.innerHTML = '<div class="loading-state">Errore durante il caricamento dei giochi.</div>';
  }
}

/**
 * Renderizza la griglia principale dei giochi
 */
function renderGames() {
  if (!state.games.length) {
    elements.gamesGrid.innerHTML = '';
    elements.emptyState.classList.add('visible');
    elements.emptyState.hidden = false;
    return;
  }

  elements.emptyState.classList.remove('visible');
  elements.emptyState.hidden = true;

  elements.gamesGrid.innerHTML = state.games.map(game => {
    const platformClass = game.platform === 'switch2' ? 'switch2' : (game.platform === 'both' ? 'both' : 'switch');
    const platformLabel = game.platform === 'switch2' ? 'Nintendo Switch 2' : (game.platform === 'both' ? 'Switch 1 & 2' : 'Nintendo Switch');

    const latestUpdate = game.updates && game.updates[0];
    const prevVersion = latestUpdate?.previousVersion || 'v1.0.0';
    const currentVersion = game.currentVersion || 'v1.0.0';

    return `
      <article class="game-card" data-id="${escapeHtml(game.id)}">
        <div class="game-card-banner">
          <img 
            class="game-cover-img" 
            src="${escapeHtml(game.coverImage)}" 
            data-fallback="/api/cover/${encodeURIComponent(game.id)}"
            alt="Copertina di ${escapeHtml(game.title)}"
            loading="lazy"
          >
          <div class="game-card-overlay-badges">
            <span class="platform-pill ${platformClass}">${platformLabel}</span>
            <span class="badge-version">${escapeHtml(currentVersion)}</span>
          </div>
        </div>

        <div class="game-card-content">
          <div class="game-meta-row">
            <span class="game-publisher">${escapeHtml(game.publisher || 'Nintendo')}</span>
            <span class="title-id-badge" title="Clicca per copiare Title ID" data-copy-title-id="${escapeHtml(game.titleId || '')}">
              ID: ${escapeHtml(game.titleId || 'N/A')}
            </span>
          </div>

          <h3 class="game-title">${escapeHtml(game.title)}</h3>

          <!-- Box progressione versione -->
          <div class="version-progression-box">
            <div class="version-info-left">
              <span class="version-status-label">Ultima Versione</span>
              <span class="version-number-tag">${escapeHtml(currentVersion)}</span>
            </div>
            <div class="version-transition-arrow" title="Passaggio dalla versione precedente">
              <span>${escapeHtml(prevVersion)}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <strong>${escapeHtml(currentVersion)}</strong>
            </div>
          </div>

          <div style="font-size: 0.75rem; color: var(--text-dim); display: flex; justify-content: space-between;">
            <span>Aggiornato: ${formatDate(game.lastUpdated)}</span>
            <span>${(game.updates || []).length} update archiviati</span>
          </div>

          <!-- Pulsanti Azione -->
          <div class="game-card-actions">
            <button class="btn btn-secondary open-modal-btn" data-game-id="${escapeHtml(game.id)}" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Changelog
            </button>

            ${game.eshopUrl ? `
              <a 
                href="${escapeHtml(game.eshopUrl)}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-eshop"
                title="Apri scheda ufficiale su Nintendo eShop"
                aria-label="Apri ${escapeHtml(game.title)} su Nintendo eShop"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                eShop
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Fallback immagini CSP-safe per copertine non disponibili o 404
  elements.gamesGrid.querySelectorAll('.game-cover-img').forEach(img => {
    const handleFallback = () => {
      const fallback = img.getAttribute('data-fallback');
      if (fallback && img.getAttribute('src') !== fallback) {
        img.src = fallback;
      }
    };
    if (img.complete && img.naturalWidth === 0) {
      handleFallback();
    } else {
      img.addEventListener('error', handleFallback, { once: true });
    }
  });

  // Event listener per apertura modale
  elements.gamesGrid.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-game-id');
      openGameModal(id);
    });
  });

  // Event listener per copia Title ID
  elements.gamesGrid.querySelectorAll('[data-copy-title-id]').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const titleId = badge.getAttribute('data-copy-title-id');
      if (titleId) {
        navigator.clipboard.writeText(titleId).then(() => {
          showToast(`Title ID copiato: ${titleId}`);
        }).catch(() => {
          showToast(`Title ID: ${titleId}`);
        });
      }
    });
  });
}

/**
 * Apre la modale con lo storico completo degli aggiornamenti e changelog
 */
async function openGameModal(gameId) {
  try {
    const res = await fetch(`/api/games/${encodeURIComponent(gameId)}`);
    const json = await res.json();
    if (!json.success || !json.data) return;

    const game = json.data;
    state.activeGame = game;

    const platformClass = game.platform === 'switch2' ? 'switch2' : (game.platform === 'both' ? 'both' : 'switch');
    const platformLabel = game.platform === 'switch2' ? 'Nintendo Switch 2' : (game.platform === 'both' ? 'Switch 1 & 2' : 'Nintendo Switch');

    const updatesHtml = (game.updates || []).map(up => {
      const typeClass = up.type || 'patch';
      const typeLabel = up.type === 'major' ? 'Major Update' : (up.type === 'content' ? 'Nuovi Contenuti' : (up.type === 'performance' ? 'Performance Patch' : 'Bugfix & Stabilità'));

      const changelogItems = (up.changelog || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');

      return `
        <div class="timeline-item">
          <div class="timeline-item-top">
            <div class="version-jump-pill">
              <span>${escapeHtml(up.previousVersion || 'v1.0.0')}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <strong>${escapeHtml(up.version)}</strong>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span class="update-type-pill ${typeClass}">${typeLabel}</span>
              <span style="font-size: 0.75rem; color: var(--text-dim);">${formatDate(up.releaseDate)}</span>
            </div>
          </div>

          <h4 class="timeline-headline">${escapeHtml(up.title || 'Note di rilascio')}</h4>
          <ul class="changelog-list">
            ${changelogItems || '<li>Miglioramenti generali della stabilità di sistema per ottimizzare l\'esperienza utente.</li>'}
          </ul>
        </div>
      `;
    }).join('');

    elements.modalContent.innerHTML = `
      <div class="modal-game-info">
        <img class="modal-cover" src="${escapeHtml(game.coverImage)}" data-fallback="/api/cover/${encodeURIComponent(game.id)}" alt="${escapeHtml(game.title)}">
        <div class="modal-game-meta">
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="platform-pill ${platformClass}">${platformLabel}</span>
            <span class="badge-version">${escapeHtml(game.currentVersion)}</span>
          </div>

          <h2 class="modal-title">${escapeHtml(game.title)}</h2>

          <div class="modal-tags-row">
            <span class="modal-detail-pill">Editore: ${escapeHtml(game.publisher || 'Nintendo')}</span>
            <span class="modal-detail-pill">Lancio: ${formatDate(game.releaseDate)}</span>
            <span class="modal-detail-pill" style="font-family: var(--font-mono);">ID: ${escapeHtml(game.titleId || 'N/D')}</span>
          </div>

          <div class="modal-actions-bar">
            ${game.eshopUrl ? `
              <a href="${escapeHtml(game.eshopUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-eshop">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Apri su Nintendo eShop
              </a>
            ` : ''}

            <button class="btn btn-secondary" id="modal-copy-id-btn" data-id="${escapeHtml(game.titleId)}">
              Copia Title ID
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 class="timeline-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--switch-cyan)" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          Storico Versioni & Changelog (${(game.updates || []).length} release)
        </h3>
        <div class="update-timeline" style="margin-top: 1rem;">
          ${updatesHtml}
        </div>
      </div>
    `;

    // Handler per copia Title ID interno
    const copyBtn = document.getElementById('modal-copy-id-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(game.titleId).then(() => {
          showToast(`Title ID copiato: ${game.titleId}`);
        });
      });
    }

    // Fallback immagine modale
    const modalCover = elements.modalContent.querySelector('.modal-cover');
    if (modalCover) {
      const handleModalFallback = () => {
        const fallback = modalCover.getAttribute('data-fallback');
        if (fallback && modalCover.getAttribute('src') !== fallback) {
          modalCover.src = fallback;
        }
      };
      if (modalCover.complete && modalCover.naturalWidth === 0) {
        handleModalFallback();
      } else {
        modalCover.addEventListener('error', handleModalFallback, { once: true });
      }
    }

    elements.modal.classList.add('open');
    elements.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    console.error('Errore apertura dettagli gioco:', err);
  }
}

function closeGameModal() {
  elements.modal.classList.remove('open');
  elements.modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  state.activeGame = null;
}

/**
 * Gestione sincronizzazione manuale
 */
async function handleSync() {
  const syncIcon = elements.syncBtn.querySelector('.sync-icon');
  syncIcon.classList.add('spin');
  elements.syncBtn.disabled = true;

  try {
    const res = await fetch('/api/sync', { method: 'POST' });
    const json = await res.json();

    if (json.success) {
      showToast('Database sincronizzato con successo!');
      await loadStats();
      await loadLatestUpdates();
      await loadGames();
    } else {
      showToast(json.error || 'Errore durante la sincronizzazione');
    }
  } catch (err) {
    showToast('Errore di connessione al server di sync');
  } finally {
    syncIcon.classList.remove('spin');
    elements.syncBtn.disabled = false;
  }
}

/**
 * Event Listeners & Inizializzazione
 */
function setupEventListeners() {
  // Ricerca con debounce
  let searchTimeout = null;
  elements.searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    elements.searchClearBtn.hidden = !val;

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.search = val;
      loadGames();
    }, 250);
  });

  elements.searchClearBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.searchClearBtn.hidden = true;
    state.search = '';
    elements.searchInput.focus();
    loadGames();
  });

  // Scorciatoia da tastiera: premi '/' per cercare
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== elements.searchInput) {
      e.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
    }
    if (e.key === 'Escape' && elements.modal.classList.contains('open')) {
      closeGameModal();
    }
  });

  // Filtro piattaforma (tabs)
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elements.tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      state.platform = btn.getAttribute('data-platform');
      loadGames();
    });
  });

  // Ordinamento
  elements.sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    loadGames();
  });

  // Reset filtri
  elements.resetFiltersBtn.addEventListener('click', () => {
    state.platform = 'all';
    state.search = '';
    state.sort = 'recent';
    elements.searchInput.value = '';
    elements.searchClearBtn.hidden = true;
    elements.sortSelect.value = 'recent';
    elements.emptyState.classList.remove('visible');
    elements.emptyState.hidden = true;

    elements.tabBtns.forEach(b => {
      const isAll = b.getAttribute('data-platform') === 'all';
      b.classList.toggle('active', isAll);
      b.setAttribute('aria-selected', isAll ? 'true' : 'false');
    });

    loadGames();
  });

  // Sincronizzazione
  elements.syncBtn.addEventListener('click', handleSync);

  // Chiusura modale
  elements.modalCloseBtn.addEventListener('click', closeGameModal);
  elements.modal.querySelector('.modal-backdrop').addEventListener('click', closeGameModal);
}

// Avvio applicazione
async function init() {
  setupEventListeners();
  await Promise.all([
    loadStats(),
    loadLatestUpdates(),
    loadGames()
  ]);
}

document.addEventListener('DOMContentLoaded', init);
