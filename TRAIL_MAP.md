# TRAIL MAP: Nintendo Switch & Switch 2 Update Tracker

Questa mappa architetturale definisce le responsabilità isolate di ciascun modulo ("trail code"). Ogni componente ha un confine netto per evitare modifiche a cascata o regressioni.

```
                      ┌─────────────────────────────────┐
                      │    TRAIL:SYNC (src/tracker.js)  │
                      │  - Monitoraggio feed & update   │
                      │  - Calcolo delta versioni       │
                      │  - Schedulatore periodico       │
                      └────────────────┬────────────────┘
                                       │ Scrittura atomica
                                       ▼
┌───────────────────────┐     ┌─────────────────────────────────┐
│     TRAIL:DATA        │◄────┤    TRAIL:STORE (src/store.js)   │
│  (data/games.json)    │Persi│  - Database in memoria          │
│                       │sten-│  - Indici di ricerca & filtri   │
│                       │za   │  - Operazioni CRUD & Atomic I/O │
└───────────────────────┘     └────────────────┬────────────────┘
                                               │ Lettura rapida
                                               ▼
                              ┌─────────────────────────────────┐
                              │     TRAIL:API (server.js)       │
                              │  - Headers di sicurezza (CSP)   │
                              │  - Sanitizzazione parametri     │
                              │  - Endpoint REST /api/*         │
                              └────────────────┬────────────────┘
                                               │ HTTP / JSON
                                               ▼
                              ┌─────────────────────────────────┐
                              │     TRAIL:UI (public/)          │
                              │  - public/index.html (Skeleton) │
                              │  - public/style.css  (Design)   │
                              │  - public/app.js     (Client)   │
                              └─────────────────────────────────┘
```

## Regole di Isolamento (Non toccare ciò che è sigillato)

| Tag Trail | File | Ruolo Esclusivo | Non toccare se modifichi: |
|:---|:---|:---|:---|
| `[TRAIL:DATA]` | `data/games.json` | Struttura schematica e persistenza dati JSON. | UI, stili, logica API. |
| `[TRAIL:STORE]` | `src/store.js` | Gestione atomica del DB locale, caching in RAM, query & ordinamenti. | Scraper, template HTML. |
| `[TRAIL:SYNC]` | `src/tracker.js` | Download e rilevamento di nuovi update, calcolo versione precedente -> nuova, cron. | Interfaccia grafica. |
| `[TRAIL:API]` | `server.js` | Server HTTP Node.js, policy di sicurezza (CSP, CORS, NoSniff), rate-limiting. | Algoritmi di comparazione versioni. |
| `[TRAIL:UI-DOM]` | `public/index.html` | Scheletro semantico HTML5 accessibile (WAI-ARIA, safe-areas). | Logica di backend. |
| `[TRAIL:UI-CSS]` | `public/style.css` | Design System (Nintendo Dark + Neon Red/Cyan), layout mobile-first, animazioni. | Chiamate fetch o parsing. |
| `[TRAIL:UI-JS]` | `public/app.js` | Rendering reattivo, debouncing ricerca, gestione modale/bottom-sheet, XSS escaping. | File server. |
