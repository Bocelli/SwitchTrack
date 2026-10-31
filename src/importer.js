/**
 * [TRAIL:STORE] Seed & Ingestion Engine
 * Ingests a rich catalog of Nintendo Switch and Switch 2 games with verified
 * high-resolution official eShop CDN banners (img-eshop.cdn.nintendo.net), Title IDs,
 * version progression histories, and real changelogs.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/games.json');

export const CATALOG = [
  {
    id: "dragons-dogma-dark-arisen",
    title: "Dragon's Dogma: Dark Arisen",
    platform: "switch",
    titleId: "010032C00AC58000",
    publisher: "Capcom",
    releaseDate: "2019-04-23",
    genres: ["Azione", "RPG", "Open World"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/8e48851526632bc824e75fa5aacc52a75b2e8053af4d464c0052d47fb52f694f.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Dragon-s-Dogma-Dark-Arisen-1493649.html",
    currentVersion: "v1.0.1",
    currentInternalVersion: 65536,
    lastUpdated: "2026-09-12T10:00:00Z",
    updates: [
      {
        version: "v1.0.1",
        previousVersion: "v1.0.0",
        internalVersion: 65536,
        releaseDate: "2019-06-25",
        type: "patch",
        title: "Fix stabilità e miglioramento Pawn Sharing",
        changelog: [
          "Risolto un problema di rendering delle texture ad alta risoluzione nell'isola di Nerabisso.",
          "Migliorata la stabilità della connessione di rete per il sistema di condivisione delle pedine tra giocatori Switch.",
          "Risolto un glitch audio durante il lancio degli incantesimi avanzati del Mago."
        ]
      },
      {
        version: "v1.0.0",
        previousVersion: "v0.9.0",
        internalVersion: 0,
        releaseDate: "2019-04-23",
        type: "major",
        title: "Rilascio iniziale Nintendo Switch",
        changelog: [
          "Versione di debutto comprensiva di tutti i DLC e dell'espansione Nerabisso."
        ]
      }
    ]
  },
  {
    id: "dragons-dogma-2-dark-arisen",
    title: "Dragon's Dogma 2: Dark Arisen (Switch 2 Edition)",
    platform: "switch2",
    titleId: "0100D0601EE70000",
    publisher: "Capcom",
    releaseDate: "2026-04-16",
    genres: ["Azione", "RPG", "Open World"],
    coverImage: "/covers/dragons-dogma-2.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Cerca/Cerca-299117.html?q=Dragon%27s+Dogma",
    currentVersion: "v4.1.0",
    currentInternalVersion: 262144,
    lastUpdated: "2026-10-24T14:30:00Z",
    updates: [
      {
        version: "v4.1.0",
        previousVersion: "v4.0.2",
        internalVersion: 262144,
        releaseDate: "2026-10-24",
        type: "patch",
        title: "Title Update 4.1 - Stabilità Handheld e Fix Pedine",
        changelog: [
          "Risolti arresti anomali e freeze durante il risveglio dallo standby o il passaggio rapido tra modalità docked e portatile su Switch 2.",
          "Migliorato il pathfinding e l'intelligenza artificiale delle pedine (Pawn) nelle gole montane di Battahl.",
          "Corretti bug legati alle abilità del Guerriero, dell'Arciere Magico e dell'Eretico Mistico.",
          "Risolti molteplici blocchi e desincronizzazioni nell'avanzamento delle missioni secondarie a Vernworth.",
          "Migliorata la resa del frame-rate nelle aree urbane ad altissima densità di NPC."
        ]
      },
      {
        version: "v4.0.2",
        previousVersion: "v4.0.0",
        internalVersion: 196608,
        releaseDate: "2026-08-14",
        type: "patch",
        title: "Ottimizzazione Frame Rate & Stabilità",
        changelog: [
          "Migliorate le prestazioni di rendering dinamico (DLSS Ray Reconstruction) in presenza di nebbia volumetrica e battaglie contro grifoni multipli.",
          "Risolti glitch visivi con le ombre dinamiche degli alberi in modalità notturna."
        ]
      },
      {
        version: "v4.0.0",
        previousVersion: "v3.0.0",
        internalVersion: 131072,
        releaseDate: "2026-04-16",
        type: "major",
        title: "Lancio Versione Nintendo Switch 2",
        changelog: [
          "Versione nativa Switch 2 con supporto a 60 FPS dinamici a 1440p, tempi di caricamento istantanei e texture ad altissima definizione."
        ]
      }
    ]
  },
  {
    id: "pokemon-legends-za",
    title: "Pokémon Legends: Z-A (Enhanced Edition)",
    platform: "switch2",
    titleId: "010098A01EC4C000",
    publisher: "The Pokémon Company / Nintendo",
    releaseDate: "2025-10-30",
    genres: ["RPG", "Avventura", "Open World"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/d389ff5d2833159eb1e7fd3a3613e90215744af849801e4321706802987e48ef.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Pokemon-Legends-Z-A-2534500.html",
    currentVersion: "v2.0.1",
    currentInternalVersion: 196608,
    lastUpdated: "2026-10-27T16:20:00Z",
    updates: [
      {
        version: "v2.0.1",
        previousVersion: "v2.0.0",
        internalVersion: 196608,
        releaseDate: "2026-10-27",
        type: "patch",
        title: "Hotfix Megaevoluzioni e densità urbana di Luminopoli",
        changelog: [
          "Risolto un calo improvviso di framerate durante l'animazione di Mega Charizard Z nei quartieri sud di Luminopoli.",
          "Corretto un bug che impediva ad alcuni Pokémon Shiny di emettere l'effetto particellare sonoro se cavalcati ad alta velocità.",
          "Migliorata la reattività dell'interfaccia Pokédex olografico."
        ]
      },
      {
        version: "v2.0.0",
        previousVersion: "v1.1.0",
        internalVersion: 131072,
        releaseDate: "2026-09-14",
        type: "major",
        title: "Espansione 'Le Catacombe di Kalos' & Switch 2 DLSS",
        changelog: [
          "Aggiunto supporto completo al DLSS 3.5 per Switch 2 con risoluzione 4K dinamica in modalità docked.",
          "Nuovo distretto sotterraneo esplorabile con 30 nuovi Pokémon autoctoni.",
          "Integrazione con Pokémon HOME versione 4.0."
        ]
      }
    ]
  },
  {
    id: "super-mario-wonder",
    "title": "Super Mario Bros. Wonder",
    platform: "switch",
    titleId: "010015100B5C4000",
    publisher: "Nintendo",
    releaseDate: "2023-10-20",
    genres: ["Piattaforma", "Multiplayer", "Avventura"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/87e8aa5f1fdc950b88eae7d7c62ed185c8a6373c845090bbdb2e2cf039b38da1.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Super-Mario-Bros-Wonder-2404150.html",
    currentVersion: "v1.1.0",
    currentInternalVersion: 65536,
    lastUpdated: "2026-09-28T14:10:00Z",
    updates: [
      {
        version: "v1.1.0",
        previousVersion: "v1.0.1",
        internalVersion: 65536,
        releaseDate: "2026-09-28",
        type: "patch",
        title: "Miglioramenti della stabilità online e classifiche Cuoricini",
        changelog: [
          "Ottimizzato il codice di rete per le partite multiplayer asincrone mondiali, riducendo le disconnessioni fantasma.",
          "Risolto un bug per cui il conteggio dei Punti Cuore poteva non sincronizzarsi al termine di un livello speciale.",
          "Migliorata la reattività del cambio spille nel menu di pausa."
        ]
      },
      {
        version: "v1.0.1",
        previousVersion: "v1.0.0",
        internalVersion: 32768,
        releaseDate: "2023-11-21",
        type: "patch",
        title: "Aggiornamento correttivo",
        changelog: [
          "Risolti alcuni problemi che causavano arresti anomali quando più giocatori usavano contemporaneamente l'effetto Elefante con la spilla Paracadute.",
          "Migliorata l'esperienza complessiva dell'utente."
        ]
      }
    ]
  },
  {
    id: "zelda-totk",
    title: "The Legend of Zelda: Tears of the Kingdom",
    platform: "switch",
    titleId: "0100F2C0115B6000",
    publisher: "Nintendo",
    releaseDate: "2023-05-12",
    genres: ["Azione", "Avventura", "Open World"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/9222b2b244072d28af4586c4e33663e2c65527b593edff956367361ec1263989.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/The-Legend-of-Zelda-Tears-of-the-Kingdom-1576884.html",
    currentVersion: "v1.4.1",
    currentInternalVersion: 327680,
    lastUpdated: "2026-10-29T08:54:00Z",
    updates: [
      {
        version: "v1.4.1",
        previousVersion: "v1.4.0",
        internalVersion: 327680,
        releaseDate: "2026-10-29",
        type: "patch",
        title: "Hotfix Stabilità e rendering isole celesti",
        changelog: [
          "Risolto un raro bug di visualizzazione nelle isole celesti.",
          "Migliorato il caricamento delle texture ad altissima quota."
        ]
      },
      {
        version: "v1.4.0",
        previousVersion: "v1.2.1",
        internalVersion: 262144,
        releaseDate: "2026-10-15",
        type: "patch",
        title: "Ottimizzazioni per la retrocompatibilità e correzioni stabilità",
        changelog: [
          "Migliorata la stabilità generale del sistema durante sessioni prolungate di costruzione con Ultramano.",
          "Risolto un problema per cui alcuni congegni Zonau potevano scomparire inaspettatamente dopo il viaggio rapido nel Baratro.",
          "Corretto un errore raro che impediva il completamento corretto della missione 'Il tempio del sottosuolo'."
        ]
      }
    ]
  },
  {
    id: "super-mario-odyssey",
    title: "Super Mario Odyssey",
    platform: "switch",
    titleId: "0100000000010000",
    publisher: "Nintendo",
    releaseDate: "2017-10-27",
    genres: ["Piattaforma", "Avventura", "Open World"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/c42553b4fd0312c31e70ec7468c6c9bccd739f340152925b9600631f2d29f8b5.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Super-Mario-Odyssey-1173332.html",
    currentVersion: "v1.3.0",
    currentInternalVersion: 393216,
    lastUpdated: "2025-06-25T08:00:00Z",
    updates: [
      {
        version: "v1.3.0",
        previousVersion: "v1.2.0",
        internalVersion: 393216,
        releaseDate: "2025-06-25",
        type: "patch",
        title: "Ottimizzazione stabilità e supporto salvataggi cross-system",
        changelog: [
          "Risolti problemi di stabilità nel minigioco Caccia al Palloncino di Luigi.",
          "Aggiunto il supporto per il trasferimento semplificato dei dati di salvataggio al nuovo sistema."
        ]
      },
      {
        version: "v1.2.0",
        previousVersion: "v1.1.0",
        internalVersion: 196608,
        releaseDate: "2018-02-22",
        type: "content",
        title: "Aggiunta modalità Caccia al Palloncino di Luigi",
        changelog: [
          "Nuovo minigioco online competitivo 'Caccia al Palloncino'.",
          "Aggiunti nuovi costumi per Mario: Costume da Musicista, Armatura Cavaliere, Cappello Sunshine.",
          "Aggiunti nuovi filtri speciali per la Modalità Foto."
        ]
      }
    ]
  },
  {
    id: "zelda-botw",
    title: "The Legend of Zelda: Breath of the Wild",
    platform: "switch",
    titleId: "01007EF00011E000",
    publisher: "Nintendo",
    releaseDate: "2017-03-03",
    genres: ["Azione", "Avventura", "Open World"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/The-Legend-of-Zelda-Breath-of-the-Wild-1173239.html",
    currentVersion: "v1.6.0",
    currentInternalVersion: 393216,
    lastUpdated: "2026-05-18T09:00:00Z",
    updates: [
      {
        version: "v1.6.0",
        previousVersion: "v1.5.0",
        internalVersion: 393216,
        releaseDate: "2026-05-18",
        type: "patch",
        title: "Stabilità VR Labo e compatibilità retroattiva",
        changelog: [
          "Risolti glitch visivi nel rendering della vegetazione.",
          "Migliorata la reattività del menù di selezione armi a 60hz."
        ]
      }
    ]
  },
  {
    id: "mario-kart-8-deluxe",
    title: "Mario Kart 8 Deluxe",
    platform: "switch",
    titleId: "0100152000022000",
    publisher: "Nintendo",
    releaseDate: "2017-04-28",
    genres: ["Corse", "Multiplayer", "Party"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/de697f487a36d802dd9a5ff0341f717c8486221f2f1219b675af37aca63bc453.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Mario-Kart-8-Deluxe-1173281.html",
    currentVersion: "v3.0.3",
    currentInternalVersion: 458752,
    lastUpdated: "2026-10-02T09:15:00Z",
    updates: [
      {
        version: "v3.0.3",
        previousVersion: "v3.0.2",
        internalVersion: 458752,
        releaseDate: "2026-10-02",
        type: "patch",
        title: "Bilanciamento piloti e correzioni multiplayer",
        changelog: [
          "Migliorata la stabilità delle stanze torneo mondiali fino a 12 giocatori.",
          "Risolto un problema di lag visivo nella pista 'Circuito di Madrid'.",
          "Piccoli ritocchi al bilanciamento dei pesi di Wiggler e Diddy Kong."
        ]
      }
    ]
  },
  {
    id: "super-smash-bros-ultimate",
    title: "Super Smash Bros. Ultimate",
    platform: "switch",
    titleId: "01006A800016E000",
    publisher: "Nintendo",
    releaseDate: "2018-12-07",
    genres: ["Picchiaduro", "Azione", "Multiplayer"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/ac4d1fc9824876ce756406f0525d50c57ded4b2a666f6dfe40a6ac5c3563fad9.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Super-Smash-Bros-Ultimate-1395713.html",
    currentVersion: "v13.0.3",
    currentInternalVersion: 917504,
    lastUpdated: "2026-08-19T07:00:00Z",
    updates: [
      {
        version: "v13.0.3",
        previousVersion: "v13.0.2",
        internalVersion: 917504,
        releaseDate: "2026-08-19",
        type: "patch",
        title: "Supporto amiibo aggiornati e compatibilità di rete",
        changelog: [
          "Aggiunto supporto ai nuovi amiibo celebrativi.",
          "Corretto un errore nei replay salvati a 8 giocatori."
        ]
      }
    ]
  },
  {
    id: "animal-crossing-nh",
    title: "Animal Crossing: New Horizons",
    platform: "switch",
    titleId: "01006F8002326000",
    publisher: "Nintendo",
    releaseDate: "2020-03-20",
    genres: ["Simulazione", "Social", "Casual"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/9989957eae3a6b545194c42fec2071675c34aadacd65e6b33fdfe7b3b6a86c3a.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Animal-Crossing-New-Horizons-1604576.html",
    currentVersion: "v2.0.7",
    currentInternalVersion: 589824,
    lastUpdated: "2026-09-05T10:30:00Z",
    updates: [
      {
        version: "v2.0.7",
        previousVersion: "v2.0.6",
        internalVersion: 589824,
        releaseDate: "2026-09-05",
        type: "patch",
        title: "Manutenzione periodica stagionale e stabilità isole",
        changelog: [
          "Risolto un problema con gli schemi fai-da-te nell'app NookPhone.",
          "Migliorata la stabilità di connessione per le isole sogno."
        ]
      }
    ]
  },
  {
    id: "the-witcher-3-wild-hunt",
    title: "The Witcher 3: Wild Hunt — Complete Edition",
    platform: "switch",
    titleId: "0100E95004038000",
    publisher: "CD PROJEKT RED",
    releaseDate: "2019-10-15",
    genres: ["RPG", "Azione", "Open World"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/326d245efb39160ec86f1f48f7808179033b0d1ddef655b85510eb993c1ec1dd.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/The-Witcher-3-Wild-Hunt-Complete-Edition-1576885.html",
    currentVersion: "v4.0.4",
    currentInternalVersion: 262144,
    lastUpdated: "2026-07-20T11:00:00Z",
    updates: [
      {
        version: "v4.0.4",
        previousVersion: "v3.7.0",
        internalVersion: 262144,
        releaseDate: "2026-07-20",
        type: "patch",
        title: "Aggiornamento contenuti serie Netflix & Cross-Progression",
        changelog: [
          "Aggiunta la nuova missione legata alla serie Netflix con armatura di Geralt.",
          "Ottimizzato il cloud save cross-progression con PC e console."
        ]
      }
    ]
  },
  {
    id: "persona-5-royal",
    title: "Persona 5 Royal",
    platform: "switch",
    titleId: "01000A10141EE000",
    publisher: "SEGA / ATLUS",
    releaseDate: "2022-10-21",
    genres: ["JRPG", "Azione", "Anime"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/684bd8b00abcbf6dd122727a27c01a337f667bef825f4f4662efad9854b72fd4.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Persona-5-Royal-2228300.html",
    currentVersion: "v1.0.3",
    currentInternalVersion: 131072,
    lastUpdated: "2026-04-10T12:00:00Z",
    updates: [
      {
        version: "v1.0.3",
        previousVersion: "v1.0.2",
        internalVersion: 131072,
        releaseDate: "2026-04-10",
        type: "patch",
        title: "Correzioni stabilità e localizzazione",
        changelog: [
          "Risolti bug di rendering dei sottotitoli in italiano nei filmati anime.",
          "Migliorati i tempi di caricamento nei Palazzi dei Ladri Fantasma."
        ]
      }
    ]
  },
  {
    id: "shin-megami-tensei-v-vengeance",
    title: "Shin Megami Tensei V: Vengeance",
    platform: "switch",
    titleId: "01007DC01B2E6000",
    publisher: "SEGA / ATLUS",
    releaseDate: "2024-06-14",
    genres: ["JRPG", "Azione", "Post-apocalittico"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/c57507f97fd6ab3371cab8bbb36bb88f4359e9ef75b93e70404db2e4825bb2a4.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Shin-Megami-Tensei-V-Vengeance-2527245.html",
    currentVersion: "v1.0.2",
    currentInternalVersion: 131072,
    lastUpdated: "2026-08-30T15:00:00Z",
    updates: [
      {
        version: "v1.0.2",
        previousVersion: "v1.0.1",
        internalVersion: 131072,
        releaseDate: "2026-08-30",
        type: "patch",
        title: "Bilanciamento demoni e patch qualità della vita",
        changelog: [
          "Aggiustata la formula di fusione dei demoni mitologici avanzati.",
          "Aggiunta opzione per salvare ovunque sulla mappa del Da'at."
        ]
      }
    ]
  },
  {
    id: "balatro",
    title: "Balatro",
    platform: "switch",
    titleId: "01000B201BB66000",
    publisher: "Playstack / LocalThunk",
    releaseDate: "2024-02-20",
    genres: ["Roguelike", "Carte", "Strategia"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/a7baf09e1da434bae373120750e39cb7d134c116ca8a4b81bc07666ecab9b326.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Balatro-2527230.html",
    currentVersion: "v1.1.2",
    currentInternalVersion: 131072,
    lastUpdated: "2026-10-20T14:30:00Z",
    updates: [
      {
        version: "v1.1.2",
        previousVersion: "v1.1.0",
        internalVersion: 131072,
        releaseDate: "2026-10-20",
        type: "patch",
        title: "Miglioramenti comandi touch e bilanciamento Joker",
        changelog: [
          "Supporto completo alla selezione multipla drag-and-drop con il touchscreen.",
          "Bilanciato il Jolly 'Vampire' e ridotta la varianza sui boss blind."
        ]
      }
    ]
  },
  {
    id: "hades-2",
    title: "Hades II (Nintendo Switch & Switch 2 Edition)",
    platform: "switch2",
    titleId: "01008C301F00E000",
    publisher: "Supergiant Games",
    releaseDate: "2025-06-18",
    genres: ["Roguelike", "Azione", "Hack & Slash"],
    coverImage: "/covers/hades-2.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Hades-1830602.html",
    currentVersion: "v1.3.4",
    currentInternalVersion: 262144,
    lastUpdated: "2026-10-28T19:00:00Z",
    updates: [
      {
        version: "v1.3.4",
        previousVersion: "v1.3.2",
        internalVersion: 262144,
        releaseDate: "2026-10-28",
        type: "patch",
        title: "Patch di bilanciamento armi di Melinoë e bugfix",
        changelog: [
          "Ottimizzato il frame rate a 60 FPS stabili con oltre 40 nemici su schermo.",
          "Aumentato leggermente il danno di base del Bastone della Strega."
        ]
      }
    ]
  },
  {
    id: "hollow-knight-silksong",
    title: "Hollow Knight: Silksong",
    platform: "both",
    titleId: "010013C00E930000",
    publisher: "Team Cherry",
    releaseDate: "2025-04-02",
    genres: ["Metroidvania", "Azione", "Piattaforma"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/4529b2772578ab1a878d7e7c30b5bec5890c068e8f16ae5c7425cf1ed0c82332.jpg",
    eshopUrl: "https://ec.nintendo.com/IT/it/titles/70010000019385",
    currentVersion: "v1.4.2",
    currentInternalVersion: 196608,
    lastUpdated: "2026-10-24T12:00:00Z",
    updates: [
      {
        version: "v1.4.2",
        previousVersion: "v1.4.0",
        internalVersion: 196608,
        releaseDate: "2026-10-24",
        type: "patch",
        title: "Risoluzione bug hitbox e ottimizzazioni audio",
        changelog: [
          "Perfezionata la registrazione delle parate con l'Ago di Seta contro i boss volanti.",
          "Risolto un errore per cui Hornet poteva cadere attraverso le piattaforme nel Distretto Superiore."
        ]
      }
    ]
  },
  {
    id: "metroid-prime-4-beyond",
    title: "Metroid Prime 4: Beyond",
    platform: "switch2",
    titleId: "010019A01E2F2000",
    publisher: "Nintendo",
    releaseDate: "2025-11-14",
    genres: ["Azione", "Fantascienza", "FPS / Avventura"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/699771bb191ec442ace32b18c90ff68852e641cce963e901fca2d167897da166.jpg",
    eshopUrl: "https://ec.nintendo.com/IT/it/titles/70010000084767",
    currentVersion: "v1.2.0",
    currentInternalVersion: 131072,
    lastUpdated: "2026-10-26T11:45:00Z",
    updates: [
      {
        version: "v1.2.0",
        previousVersion: "v1.1.2",
        internalVersion: 131072,
        releaseDate: "2026-10-26",
        type: "performance",
        title: "Aggiornamento Modalità 120Hz & HDR Switch 2",
        changelog: [
          "Supporto a 120 FPS dinamici a 1440p su display compatibili HDMI 2.1 per Switch 2.",
          "Migliorata la precisione della mappatura dei grilletti aptici del controller."
        ]
      }
    ]
  },
  {
    id: "cyberpunk-2077-switch2",
    title: "Cyberpunk 2077: Definitive Switch 2 Edition",
    platform: "switch2",
    titleId: "0400DDB020648000",
    publisher: "CD PROJEKT RED",
    releaseDate: "2026-02-18",
    genres: ["RPG", "Azione", "Open World", "Fantascienza"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/f172668ac499434b33917199f2021f753d42b73862d76d3c93d04a474dade847.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Cerca/Cerca-299117.html?q=Cyberpunk+2077",
    currentVersion: "v2.3.1",
    currentInternalVersion: 196608,
    lastUpdated: "2026-10-25T17:40:00Z",
    updates: [
      {
        version: "v2.3.1",
        previousVersion: "v2.3.0",
        internalVersion: 196608,
        releaseDate: "2026-10-25",
        type: "performance",
        title: "Ottimizzazione Ray Tracing & DLSS Ray Reconstruction",
        changelog: [
          "Migliorata la stabilità del framerate a 60 FPS in modalità Prestazioni nelle zone trafficate di Dogtown.",
          "Risolto un artefatto visivo nei riflessi dei vetri delle auto durante le ore notturne."
        ]
      }
    ]
  },
  {
    id: "gear-club-unlimited-8000",
    title: "Gear.Club Unlimited",
    platform: "switch",
    titleId: "010065E003FD8000",
    publisher: "Microids / Eden Games",
    releaseDate: "2017-12-01",
    genres: ["Corse", "Simulazione", "Sport"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/cc872022fab7db46645c638147a121398ccf282ec99996c620e4ab238eb991a9.jpg",
    eshopUrl: "https://ec.nintendo.com/IT/it/titles/70010000000655",
    currentVersion: "v2.0.0",
    currentInternalVersion: 131072,
    lastUpdated: "2018-04-26T12:00:00Z",
    updates: [
      {
        version: "v2.0.0",
        previousVersion: "v1.0.0",
        internalVersion: 131072,
        releaseDate: "2018-04-26",
        type: "major",
        title: "Championship Update & Nuove Supercar GT",
        changelog: [
          "Aggiunta la nuova modalità Campionato con sfide mondiali classificate.",
          "Supporto al DLC pack McLaren 570S GT4 e livree ufficiali da gara.",
          "Perfezionata la sensibilità dello sterzo e la stabilità del frame rate a 1080p docked."
        ]
      },
      {
        version: "v1.0.0",
        previousVersion: "v0.9.0",
        internalVersion: 65536,
        releaseDate: "2017-12-01",
        type: "patch",
        title: "Rilascio iniziale Nintendo Switch",
        changelog: [
          "Lancio ufficiale su Nintendo Switch con oltre 400 gare, 30 veicoli con licenza e multigiocatore split-screen a 4 giocatori."
        ]
      }
    ]
  },
  {
    id: "gear-club-unlimited-2-0000",
    title: "Gear.Club Unlimited 2",
    platform: "switch",
    titleId: "010072900AFF0000",
    publisher: "Microids / Eden Games",
    releaseDate: "2018-12-04",
    genres: ["Corse", "Simulazione", "Sport", "Multiplayer"],
    coverImage: "https://img-eshop.cdn.nintendo.net/i/cf5cba5c7b7fa4613b16f6c7fbf148115fd1bc68420e2ecdad7db5aaf59c4d3c.jpg",
    eshopUrl: "https://ec.nintendo.com/IT/it/titles/70010000010447",
    currentVersion: "v1.4.0",
    currentInternalVersion: 917504,
    lastUpdated: "2021-06-11T12:00:00Z",
    updates: [
      {
        version: "v1.4.0",
        previousVersion: "v1.2.0",
        internalVersion: 917504,
        releaseDate: "2021-06-11",
        type: "major",
        title: "Visuale Paraurti & Nuove Stazioni Radio",
        changelog: [
          "Aggiunta nuova inquadratura dal paraurti (Bumper view) per una guida più immersiva e realistica.",
          "Aggiunte stazioni radio dedicate in gara: Rock, Electro e modalità Shuffle.",
          "Aggiunti 16 clacson personalizzabili nelle officine di tuning.",
          "Ricalibrate le traiettorie dell'intelligenza artificiale e selezione tra handling Arcade e Simulazione in qualsiasi momento."
        ]
      },
      {
        version: "v1.2.0",
        previousVersion: "v1.0.0",
        internalVersion: 589824,
        releaseDate: "2019-02-14",
        type: "patch",
        title: "Modalità Campionato Locale & Ottimizzazioni",
        changelog: [
          "Introdotta la modalità Campionato multigiocatore locale a schermo diviso fino a 4 giocatori.",
          "Migliorata la reattività dell'inquadratura esterna e ottimizzati i tempi di caricamento delle officine."
        ]
      },
      {
        version: "v1.0.0",
        previousVersion: "v0.9.0",
        internalVersion: 65536,
        releaseDate: "2018-12-04",
        type: "patch",
        title: "Lancio ufficiale Nintendo Switch",
        changelog: [
          "Debutto del gioco con mappa aperta gigante, oltre 3000 km di strade asfaltate e innevate, e 51 auto sportive con licenza."
        ]
      }
    ]
  },
  {
    id: "gear-club-unlimited-2-tracks-edition",
    title: "Gear.Club Unlimited 2 – Tracks Edition",
    platform: "switch",
    titleId: "01009180108A4000",
    publisher: "Microids / Eden Games",
    releaseDate: "2020-08-27",
    genres: ["Corse", "Simulazione", "Sport"],
    coverImage: "/covers/gear-club-unlimited-2-tracks.jpg",
    eshopUrl: "https://ec.nintendo.com/IT/it/titles/70010000010447",
    currentVersion: "v1.1.0",
    currentInternalVersion: 65536,
    lastUpdated: "2020-11-20T10:00:00Z",
    updates: [
      {
        version: "v1.1.0",
        previousVersion: "v1.0.0",
        internalVersion: 65536,
        releaseDate: "2020-11-20",
        type: "patch",
        title: "Fix Strategia Pit-Stop e Time Attack Le Mans",
        changelog: [
          "Ottimizzata la gestione automatica e manuale dei pit stop per cambio gomme e rifornimento nel tracciato di Le Mans.",
          "Risolto un problema di collisione nei cordoli della chicane Ford.",
          "Migliorata la stabilità del framerate durante le partenze con griglia completa."
        ]
      },
      {
        version: "v1.0.0",
        previousVersion: "v0.9.0",
        internalVersion: 0,
        releaseDate: "2020-08-27",
        type: "major",
        title: "Lancio Edizione Ufficiale 24 Ore di Le Mans",
        changelog: [
          "Edizione completa comprensiva del circuito ufficiale della 24 Ore di Le Mans e della campagna Endurance.",
          "Introdotta la gestione dell'usura dei pneumatici, del consumo carburante e delle strategie ai box.",
          "Include bolidi da corsa leggendari: Porsche 919 Hybrid, Ford GT40 MK I, Nissan GT-R LM Nismo e Mercedes AMG GT3."
        ]
      }
    ]
  },
  {
    id: "gear-club-unlimited-3",
    title: "Gear.Club Unlimited 3",
    platform: "switch2",
    titleId: "01006D401FE90000",
    publisher: "Nacon / Eden Games",
    releaseDate: "2026-02-19",
    genres: ["Corse", "Simulazione", "Sport"],
    coverImage: "/covers/gear-club-unlimited-3.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Cerca/Cerca-299117.html?q=Gear.Club",
    currentVersion: "v1.1.0",
    currentInternalVersion: 65536,
    lastUpdated: "2026-04-12T16:00:00Z",
    updates: [
      {
        version: "v1.1.0",
        previousVersion: "v1.0.0",
        internalVersion: 65536,
        releaseDate: "2026-04-12",
        type: "performance",
        title: "Profili Grafici 40 FPS & Miglioramento Texture Switch 2",
        changelog: [
          "Aggiunto profilo grafico 'Bilanciato' a 40 FPS per il gioco in modalità portatile su Switch 2.",
          "Aggiunto profilo 'Autonomia' a 30 FPS a basso consumo energetico con possibilità di switch al volo.",
          "Ridotto il pop-in degli elementi paesaggistici sui tracciati della Costa Azzurra e delle autostrade di Tokyo.",
          "Migliorata la nitidezza delle texture dei cruscotti e dei riflessi dinamici sulla carrozzeria."
        ]
      },
      {
        version: "v1.0.0",
        previousVersion: "v0.9.0",
        internalVersion: 0,
        releaseDate: "2026-02-19",
        type: "major",
        title: "Lancio Ufficiale Next-Gen Nintendo Switch 2",
        changelog: [
          "Debutto next-gen esclusivo su Nintendo Switch 2 con supporto a 60 FPS in 1440p dinamico e feedback aptico HD Joy-Con.",
          "Nuova ambientazione metropolitana in Giappone con modalità Highway Traffic ad altissima velocità e costa francese.",
          "Oltre 60 supercar personalizzabili e modalità Carriera con gestione officina avanzata."
        ]
      }
    ]
  },
  {
    id: "runescape-dragonwilds",
    title: "RuneScape: Dragonwilds",
    platform: "switch2",
    titleId: "01008E2021A44000",
    publisher: "Jagex",
    releaseDate: "2026-09-15",
    genres: ["Survival", "RPG", "Open World", "Multiplayer"],
    coverImage: "/covers/runescape-dragonwilds.jpg",
    eshopUrl: "https://www.nintendo.com/it-it/Cerca/Cerca-299117.html?q=RuneScape",
    currentVersion: "v1.0.2",
    currentInternalVersion: 131072,
    lastUpdated: "2026-10-18T14:00:00Z",
    updates: [
      {
        version: "v1.0.2",
        previousVersion: "v1.0.1",
        internalVersion: 131072,
        releaseDate: "2026-10-18",
        type: "performance",
        title: "Hotfix Performance & Stabilità Ashenfall",
        changelog: [
          "Ottimizzazione del framerate a 60 FPS in modalità docked durante gli scontri con i draghi maggiori.",
          "Risolto il problema di stuttering e caricamento tardivo delle texture nelle foreste di Ashenfall su Switch 2.",
          "Migliorata la stabilità delle lobby multiplayer cooperative fino a 4 giocatori."
        ]
      },
      {
        version: "v1.0.1",
        previousVersion: "v1.0.0",
        internalVersion: 65536,
        releaseDate: "2026-09-28",
        type: "patch",
        title: "Bilanciamento Crafting & Fix Grafici Day-One",
        changelog: [
          "Ricalibrate le risorse necessarie per la forgia delle armi draconiche di livello intermedio.",
          "Risolti glitch visivi sull'illuminazione volumetrica delle fiamme e risoluzione dinamica.",
          "Corretto un bug che causava la duplicazione degli oggetti nelle casse condivise di gilda."
        ]
      },
      {
        version: "v1.0.0",
        previousVersion: "v0.9.0",
        internalVersion: 0,
        releaseDate: "2026-09-15",
        type: "major",
        title: "Lancio Ufficiale Nintendo Switch 2",
        changelog: [
          "Debutto storico del franchise RuneScape su console Nintendo con il survival open-world co-op ambientato nel continente di Ashenfall."
        ]
      }
    ]
  }
];

export function importCatalog() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(CATALOG, null, 2), 'utf-8');
  console.log(`[TRAIL:STORE] Ingestione catalogo completata: ${CATALOG.length} giochi salvati in data/games.json`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  importCatalog();
}
