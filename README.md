# SwitchTrack &mdash; Nintendo Switch & Switch 2 Update Tracker

Un'applicazione web ad alte prestazioni per monitorare **costantemente gli aggiornamenti, i passaggi di versione (delta), i changelog e le patch notes** di tutti i giochi per **Nintendo Switch** e **Nintendo Switch 2**, con rimando diretto alle schede ufficiali su **Nintendo eShop**.

![SwitchTrack Banner](https://assets.nintendo.com/image/upload/ar_16:9,b_auto:border,c_pad,dpr_2.0,f_auto,q_auto,w_800/b_rgb:ffffff/v1/ncom/en_US/games/switch/t/the-legend-of-zelda-tears-of-the-kingdom-switch/hero)

---

## Caratteristiche Principali

* **Tracciamento Versioni & Salti Semantici**: Visualizza chiaramente la transizione (es. `v1.4.0` ➔ `v1.4.1`) e la versione interna di Horizon OS (multiplo di 65536).
* **Changelog Dettagliati**: Note di rilascio complete con elenco puntato delle correzioni, bilanciamento, ottimizzazioni performance e fix di stabilità.
* **Sezione "Ultimi Aggiornamenti Rilasciati"**: Feed orizzontale in tempo reale delle patch più recenti distribuite da Nintendo e dagli sviluppatori terzi.
* **Filtro Piattaforma Istantaneo**: Filtra per `Tutti`, `Nintendo Switch` o `Nintendo Switch 2` (inclusi i giochi con patch di miglioramento next-gen/retrocompatibilità).
* **Ricerca Real-Time**: Cerca istantaneamente per Titolo, Title ID univoco a 16 caratteri (`0100...`) o Editore, con scorciatoia da tastiera (`/`).
* **Rimando Diretto all'eShop**: Pulsante con link diretto alla scheda del gioco sul Nintendo eShop per acquistare o riscattare il titolo.
* **Mobile-First & UI UX Pro Max**: Design dark con accenti Joy-Con Red (`#E60012`) e Neon Cyan (`#00C3E3`), touch target minimi da 44px, zero layout shift (CLS), modale desktop centrata e drawer bottom-sheet su smartphone.
* **Architettura Ponytail**: Zero complessità superflua, server Node.js leggero e sicuro con policy CSP restrittive, zero vulnerabilità XSS e test integrati senza librerie esterne pesanti.

---

## Architettura & Trail Map

L'applicazione segue la suddivisione modulare rigida per evitare modifiche a cascata:

| Tag Trail | File | Descrizione |
|:---|:---|:---|
| `[TRAIL:DATA]` | `data/games.json` | Database JSON persistente con storico versioni e metadati. |
| `[TRAIL:STORE]` | `src/store.js` | Cache in memoria, indici di ricerca O(1) e scrittura atomica su disco. |
| `[TRAIL:SYNC]` | `src/tracker.js` | Motore di monitoraggio periodico automatico (ogni 60 minuti) e classificazione salti di versione. |
| `[TRAIL:API]` | `server.js` | Server HTTP Node.js/Express, rate limiting e intestazioni di sicurezza (CSP, NoSniff, X-Frame-Options). |
| `[TRAIL:UI-DOM]` | `public/index.html` | Scheletro semantico HTML5 accessibile. |
| `[TRAIL:UI-CSS]` | `public/style.css` | Design system, token colori e supporto responsive. |
| `[TRAIL:UI-JS]` | `public/app.js` | Client interattivo con escape sicuro anti-XSS e gestione bottom-sheet. |

---

## Come Avviare l'Applicazione

### Prerequisiti
* Node.js (v18+)

### Installazione ed Esecuzione
```bash
# Entra nella cartella del progetto
cd switch-update-tracker

# Installa le dipendenze
npm install

# Avvia il server
npm start
```

Il sito sarà subito accessibile all'indirizzo:
👉 **`http://localhost:3000`**

### Eseguire i Test
```bash
npm test
```
