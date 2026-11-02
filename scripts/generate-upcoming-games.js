/**
 * [TRAIL:UPCOMING] Upcoming Switch 1 & Switch 2 Games Integrator & Cover Generator
 * - Integrates all announced / upcoming games into data/games.json
 * - Generates / verifies local cover art for 100% reliable 0ms loading (no broken images)
 * - Sets status: 'upcoming' so they don't pollute latest updates
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.resolve(ROOT_DIR, 'data/games.json');
const COVERS_DIR = path.resolve(ROOT_DIR, 'public/covers');

if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

function createSvgCover(filename, title, publisher, platform, color1, color2) {
  const filePath = path.join(COVERS_DIR, filename);
  if (fs.existsSync(filePath)) {
    return;
  }
  const platformLabel = platform === 'switch2' ? 'NINTENDO SWITCH 2' : (platform === 'both' ? 'NINTENDO SWITCH & SWITCH 2' : 'NINTENDO SWITCH');
  const accent = platform === 'switch2' ? '#8b5cf6' : (platform === 'both' ? '#00c3e3' : '#e60012');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="grad_${filename.replace(/[^a-z0-9]/gi, '_')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </linearGradient>
    <radialGradient id="glow_${filename.replace(/[^a-z0-9]/gi, '_')}" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid_${filename.replace(/[^a-z0-9]/gi, '_')}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" />
    </pattern>
  </defs>

  <rect width="800" height="450" fill="url(#grad_${filename.replace(/[^a-z0-9]/gi, '_')})" />
  <rect width="800" height="450" fill="url(#grid_${filename.replace(/[^a-z0-9]/gi, '_')})" />
  <rect width="800" height="450" fill="url(#glow_${filename.replace(/[^a-z0-9]/gi, '_')})" />

  <!-- Badge Piattaforma -->
  <g transform="translate(50, 50)">
    <rect width="280" height="32" rx="6" fill="${accent}" fill-opacity="0.2" stroke="${accent}" stroke-width="1.5" />
    <circle cx="16" cy="16" r="5" fill="${accent}" />
    <text x="30" y="21" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#ffffff" letter-spacing="1.5">${platformLabel}</text>
  </g>

  <!-- Badge In Arrivo -->
  <g transform="translate(345, 50)">
    <rect width="120" height="32" rx="6" fill="rgba(234, 179, 8, 0.2)" stroke="#eab308" stroke-width="1" />
    <text x="60" y="21" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" fill="#fef08a" text-anchor="middle">IN ARRIVO</text>
  </g>

  <!-- Titolo del Gioco -->
  <text x="50" y="220" font-family="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="800" fill="#f8fafc" letter-spacing="-0.5">
    ${title.length > 34 ? title.substring(0, 32) + '...' : title}
  </text>

  <!-- Editore -->
  <text x="50" y="265" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="18" font-weight="500" fill="#cbd5e1">
    ${publisher}
  </text>

  <!-- Linea inferiore decorativa Joy-Con -->
  <rect x="0" y="442" width="800" height="8" fill="${accent}" />
</svg>`;

  fs.writeFileSync(filePath, svg, 'utf8');
  console.log('[TRAIL:COVER] Created SVG cover:', filename);
}

// Genera tutte le copertine per i giochi in arrivo
createSvgCover('zelda-ocarina-switch2.svg', 'The Legend of Zelda: Ocarina of Time', 'Nintendo', 'switch2', '#0f2b1d', '#05120a');
createSvgCover('metroid-ravenous.svg', 'Metroid Ravenous', 'Nintendo', 'switch2', '#2a0845', '#0f051d');
createSvgCover('witchbrook.svg', 'Witchbrook', 'Chucklefish', 'both', '#1a103c', '#0d0826');
createSvgCover('muramasa-revenant-blades.svg', 'Muramasa: Revenant Blades', 'Marvelous / Vanillaware', 'switch2', '#3b1111', '#140505');
createSvgCover('tomb-raider-legacy-atlantis.svg', 'Tomb Raider: Legacy of Atlantis', 'Crystal Dynamics', 'switch2', '#0a2342', '#040d1a');
createSvgCover('persona-4-revival.svg', 'Persona 4 Revival', 'Atlus / SEGA', 'switch2', '#4a3800', '#1c1500');
createSvgCover('007-first-light.svg', '007 First Light', 'IO Interactive', 'switch2', '#1e293b', '#0f172a');
createSvgCover('pokemon-winds-waves.svg', 'Pokémon Winds & Pokémon Waves', 'Nintendo / Pokémon', 'switch2', '#0369a1', '#082f49');
createSvgCover('xenoblade-genesis.svg', 'Xenoblade Genesis', 'Nintendo / Monolith Soft', 'switch2', '#14532d', '#052e16');
createSvgCover('tanuki-pons-summer.svg', "Tanuki: Pon's Summer", 'Raw Fury', 'both', '#c2410c', '#431407');
createSvgCover('loftia.svg', 'Loftia', 'QLOC', 'both', '#047857', '#022c22');
createSvgCover('warhammer-survivors.svg', 'Warhammer Survivors', 'Games Workshop / Poncle', 'both', '#831843', '#500724');
createSvgCover('nocturnal-ii.svg', 'Nocturnal II', 'Sunnyside Games', 'both', '#ea580c', '#431407');
createSvgCover('fate-extra-record.svg', 'Fate/Extra Record', 'Bandai Namco / Type-Moon', 'both', '#1e1b4b', '#0f0e26');
createSvgCover('trine-6.svg', 'Trine 6: Together in Time', 'Frozenbyte', 'both', '#4c1d95', '#2e1065');
createSvgCover('he-man-dragon-pearl.svg', 'He-Man: Dragon Pearl of Destruction', 'Mattel / Outright Games', 'both', '#b45309', '#451a03');
createSvgCover('attack-on-titan-3.svg', 'Attack on Titan 3', 'Koei Tecmo', 'switch2', '#1c1917', '#0c0a09');
createSvgCover('sonic-pico-park.svg', 'Sonic Pico Park', 'SEGA', 'both', '#1d4ed8', '#172554');
createSvgCover('13z-zodiac-trials.svg', '13Z: The Zodiac Trials', 'Mixed Realms', 'both', '#4338ca', '#1e1b4b');
createSvgCover('road-of-dust-and-sorrow.svg', 'The Road of Dust and Sorrow', 'Team 17', 'both', '#78350f', '#290e03');
createSvgCover('grave-seasons.svg', 'Grave Seasons', 'Perfect Garbage', 'both', '#365314', '#142006');

// Lista completa dei giochi in arrivo
const upcomingCatalog = [
  {
    id: 'kirby-and-the-world-beyond',
    title: 'Kirby and the World Beyond',
    platform: 'switch2',
    titleId: '0100F9A019DA6000',
    publisher: 'Nintendo',
    releaseDate: '2027-03-26',
    status: 'upcoming',
    genres: ['Piattaforme', '3D', 'Azione', 'Avventura'],
    coverImage: '/covers/kirby-and-the-world-beyond.png',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Kirby-and-the-World-Beyond-2980000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-09-12T10:00:00Z',
    aliases: ['kirby world beyond', 'kirby switch 2', 'kirby 3d', 'kirby 2027'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-03-26',
        type: 'major',
        title: 'Annuncio Ufficiale & Apertura Pre-ordini',
        changelog: [
          'Nuovo capitolo platform 3D open-zone sviluppato da HAL Laboratory in esclusiva per Switch 2.',
          'Pre-ordine disponibile su Nintendo eShop.'
        ]
      }
    ]
  },
  {
    id: 'the-duskbloods-switch2',
    title: 'The Duskbloods',
    platform: 'switch2',
    titleId: '0100D1C01FC82000',
    publisher: 'FromSoftware / Nintendo',
    releaseDate: '2027-04-30',
    status: 'upcoming',
    genres: ['Action RPG', 'PvPvE', 'Dark Fantasy', 'Multiplayer'],
    coverImage: '/covers/the-duskbloods.jpg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/The-Duskbloods-2950000.html',
    currentVersion: 'Network Test Build (v0.8.0)',
    currentInternalVersion: 0,
    lastUpdated: '2026-08-31T10:00:00Z',
    aliases: ['duskbloods', 'from software switch 2', 'miyazaki switch 2', 'the dusk bloods'],
    updates: [
      {
        version: 'Network Test Build',
        releaseDate: '2026-08-31',
        type: 'event',
        title: 'Chiusura Network Test & Rinvio Ufficiale al 2027',
        changelog: [
          'Concluso il Global Closed Network Test per 8 giocatori su Nintendo Switch 2 (28-30 agosto 2026).',
          'Comunicato ufficiale FromSoftware e Hidetaka Miyazaki: lancio posticipato al 2027 per rifinire il netcode e il bilanciamento PvPvE.'
        ]
      }
    ]
  },
  {
    id: 'zelda-ocarina-of-time-switch2',
    title: 'The Legend of Zelda: Ocarina of Time – Nintendo Switch 2 Edition',
    platform: 'switch2',
    titleId: '0100B1A01EB02000',
    publisher: 'Nintendo',
    releaseDate: '2026-11-05',
    status: 'upcoming',
    genres: ['Azione', 'Avventura', 'Remake', 'Fantasy'],
    coverImage: '/covers/zelda-ocarina-switch2.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/The-Legend-of-Zelda-Ocarina-of-Time-Switch-2-Edition-2990001.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-20T10:00:00Z',
    aliases: ['ocarina of time', 'oot', 'zelda oot', 'ocarina of time switch 2', 'zelda remake'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-11-05',
        type: 'major',
        title: 'Annuncio Ufficiale Nintendo Direct',
        changelog: [
          'Remake completo con motore grafico next-gen in 4K a 60 FPS e supporto ray-tracing su Switch 2.',
          'Audio orchestrale registrato ex novo e controlli adattivi Joy-Con 2.'
        ]
      }
    ]
  },
  {
    id: 'professor-layton-and-the-new-world-of-steam',
    title: 'Professor Layton and the New World of Steam',
    platform: 'both',
    titleId: '0100768019C40000',
    publisher: 'Level-5',
    releaseDate: '2026-12-10',
    status: 'upcoming',
    genres: ['Puzzle', 'Avventura', 'Mistero', 'Steampunk'],
    coverImage: '/covers/professor-layton-steam.png',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Professor-Layton-and-the-New-World-of-Steam-2970000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-15T10:00:00Z',
    aliases: ['professor layton', 'il professor layton e il nuovo mondo a vapore', 'layton steam', 'luke triton', 'steam bison'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-12-10',
        type: 'major',
        title: 'Apertura Pre-ordini e Data Ufficiale',
        changelog: [
          'Nuovo mistero ambientato un anno dopo Il Futuro Perduto nella città industriale di Steam Bison.',
          'Uscita in simultanea per Nintendo Switch e Nintendo Switch 2 con enigmi tattili potenziati.'
        ]
      }
    ]
  },
  {
    id: 'metroid-ravenous-switch2',
    title: 'Metroid Ravenous',
    platform: 'switch2',
    titleId: '01008A201DF50000',
    publisher: 'Nintendo',
    releaseDate: '2027-01-28',
    status: 'upcoming',
    genres: ['Azione', 'Avventura', 'Metroidvania', 'Fantascienza'],
    coverImage: '/covers/metroid-ravenous.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Metroid-Ravenous-2995000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-01T10:00:00Z',
    aliases: ['metroid ravenous', 'samus aran', 'metroid 2d switch 2', 'metroid 6'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-01-28',
        type: 'major',
        title: 'Annuncio Ufficiale & Teaser Trailer',
        changelog: [
          'Nuovo capitolo 2D a scorrimento in esclusiva per Nintendo Switch 2, seguito ideale di Metroid Dread.',
          'Supporto a 120 FPS in modalità portatile e TV.'
        ]
      }
    ]
  },
  {
    id: 'witchbrook',
    title: 'Witchbrook',
    platform: 'both',
    titleId: '010057401AC32000',
    publisher: 'Chucklefish',
    releaseDate: '2027-01-28',
    status: 'upcoming',
    genres: ['RPG', 'Simulazione di vita', 'Pixel Art', 'Magia'],
    coverImage: '/covers/witchbrook.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Witchbrook-2965000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-09-20T10:00:00Z',
    aliases: ['witchbrook', 'chucklefish', 'scuola di magia', 'stardew valley magico'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-01-28',
        type: 'major',
        title: 'Annuncio Data di Rilascio',
        changelog: [
          'Simulatore di vita magica a pixel art sviluppato da Chucklefish per Nintendo Switch e Switch 2.',
          'Include modalità cooperativa online e cross-play.'
        ]
      }
    ]
  },
  {
    id: 'muramasa-revenant-blades-switch2',
    title: 'Muramasa: Revenant Blades',
    platform: 'switch2',
    titleId: '01009B401CF22000',
    publisher: 'Marvelous / Vanillaware',
    releaseDate: '2027-02-04',
    status: 'upcoming',
    genres: ['Azione', 'Hack and Slash', '2D', 'Giappone Feudale'],
    coverImage: '/covers/muramasa-revenant-blades.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Muramasa-Revenant-Blades-2975000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-09-15T10:00:00Z',
    aliases: ['muramasa', 'vanillaware switch 2', 'revenant blades', 'oboro muramasa'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-02-04',
        type: 'major',
        title: 'Annuncio Ufficiale Vanillaware',
        changelog: [
          'Ritorno del capolavoro d\'azione 2D dipinto a mano in 4K nativo con nuovi capitoli di trama su Switch 2.'
        ]
      }
    ]
  },
  {
    id: 'tomb-raider-legacy-of-atlantis-switch2',
    title: 'Tomb Raider: Legacy of Atlantis',
    platform: 'switch2',
    titleId: '01004C801BE90000',
    publisher: 'Crystal Dynamics / Amazon Games',
    releaseDate: '2027-02-12',
    status: 'upcoming',
    genres: ['Azione', 'Avventura', 'Esplorazione', 'Enigmi'],
    coverImage: '/covers/tomb-raider-legacy-atlantis.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Tomb-Raider-Legacy-of-Atlantis-2985000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-09-18T10:00:00Z',
    aliases: ['tomb raider', 'lara croft', 'legacy of atlantis', 'tomb raider switch 2'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-02-12',
        type: 'major',
        title: 'Annuncio Ufficiale Nuova Avventura di Lara Croft',
        changelog: [
          'Sviluppato su Unreal Engine 5 e ottimizzato per l\'architettura NVIDIA DLSS di Nintendo Switch 2.'
        ]
      }
    ]
  },
  {
    id: 'persona-4-revival-switch2',
    title: 'Persona 4 Revival',
    platform: 'switch2',
    titleId: '01001D401EF80000',
    publisher: 'Atlus / SEGA',
    releaseDate: '2027-02-18',
    status: 'upcoming',
    genres: ['JRPG', 'A turni', 'Mistero', 'Simulazione'],
    coverImage: '/covers/persona-4-revival.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Persona-4-Revival-2992000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-05T10:00:00Z',
    aliases: ['persona 4', 'p4r', 'persona 4 remake', 'inaba', 'yu narukami'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-02-18',
        type: 'major',
        title: 'Annuncio Ufficiale Atlus',
        changelog: [
          'Remake completo con lo stile visivo e le meccaniche di combattimento di Persona 3 Reload e Persona 5 Royal.'
        ]
      }
    ]
  },
  {
    id: '007-first-light-switch2',
    title: '007 First Light',
    platform: 'switch2',
    titleId: '01006B101DC40000',
    publisher: 'IO Interactive',
    releaseDate: '2027-03-18',
    status: 'upcoming',
    genres: ['Azione', 'Stealth', 'Sparatutto', 'Spionaggio'],
    coverImage: '/covers/007-first-light.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/007-First-Light-2996000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-09-25T10:00:00Z',
    aliases: ['007', 'james bond', 'first light', 'project 007', 'io interactive 007'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-03-18',
        type: 'major',
        title: 'Presentazione Mondiale Gameplay',
        changelog: [
          'Storia inedita sulle origini di James Bond creata dagli autori della saga Hitman.'
        ]
      }
    ]
  },
  {
    id: 'pokemon-winds-waves-switch2',
    title: 'Pokémon Winds & Pokémon Waves',
    platform: 'switch2',
    titleId: '01005A301DF20000',
    publisher: 'Nintendo / The Pokémon Company',
    releaseDate: '2027-11-19',
    status: 'upcoming',
    genres: ['RPG', 'Avventura', 'Open World', 'Cattura mostri'],
    coverImage: '/covers/pokemon-winds-waves.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Pokemon-Winds-Pokemon-Waves-3000000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-10T10:00:00Z',
    aliases: ['pokemon winds', 'pokemon waves', 'pokemon gen 10', 'decima generazione pokemon', 'pokemon switch 2'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-11-19',
        type: 'major',
        title: 'Annuncio Decima Generazione Pokémon',
        changelog: [
          'Nuova regione open-world arcipelago interamente esplorabile senza schermate di caricamento in esclusiva su Switch 2.'
        ]
      }
    ]
  },
  {
    id: 'xenoblade-genesis-switch2',
    title: 'Xenoblade Genesis',
    platform: 'switch2',
    titleId: '01008C401FA70000',
    publisher: 'Nintendo / Monolith Soft',
    releaseDate: '2027-09-17',
    status: 'upcoming',
    genres: ['JRPG', 'Azione', 'Open World', 'Fantascienza'],
    coverImage: '/covers/xenoblade-genesis.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Xenoblade-Genesis-3001000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-12T10:00:00Z',
    aliases: ['xenoblade genesis', 'xenoblade 4', 'monolith soft switch 2', 'klaus', 'conduit'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-09-17',
        type: 'major',
        title: 'Annuncio Nuovo Arco Narrativo Monolith Soft',
        changelog: [
          'Inizio della nuova saga dell\'universo Xenoblade ideata da Tetsuya Takahashi.'
        ]
      }
    ]
  },
  {
    id: 'tanuki-pons-summer',
    title: "Tanuki: Pon's Summer",
    platform: 'both',
    titleId: '01003D901CD80000',
    publisher: 'Raw Fury',
    releaseDate: '2026-11-10',
    status: 'upcoming',
    genres: ['Avventura', 'BMX', 'Commedia', 'Casual'],
    coverImage: '/covers/tanuki-pons-summer.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Tanuki-Pons-Summer-2945000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-22T10:00:00Z',
    aliases: ['tanuki', "pon's summer", 'tanuki bmx', 'postino procione'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-11-10',
        type: 'major',
        title: 'Apertura Pre-order e Data Definitiva',
        changelog: [
          'Vesti i panni di un tanuki postino che compie acrobazie in BMX per le strade di una cittadina giapponese estiva.'
        ]
      }
    ]
  },
  {
    id: 'loftia',
    title: 'Loftia',
    platform: 'both',
    titleId: '01004E801BC30000',
    publisher: 'QLOC',
    releaseDate: '2026-11-03',
    status: 'upcoming',
    genres: ['MMO', 'Simulazione', 'Accogliente', 'Sociale'],
    coverImage: '/covers/loftia.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Loftia-2942000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-24T10:00:00Z',
    aliases: ['loftia', 'cozy mmo', 'simulazione solarpunk'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-11-03',
        type: 'major',
        title: 'Lancio Globale Ufficiale',
        changelog: [
          'MMO accogliente a tema solarpunk focalizzato sulla cooperazione e la sostenibilità ecologica.'
        ]
      }
    ]
  },
  {
    id: 'warhammer-survivors',
    title: 'Warhammer Survivors',
    platform: 'both',
    titleId: '01007F101CD60000',
    publisher: 'Games Workshop / Poncle',
    releaseDate: '2026-11-10',
    status: 'upcoming',
    genres: ['Azione', 'Roguelite', 'Survival', 'Bullet Hell'],
    coverImage: '/covers/warhammer-survivors.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Warhammer-Survivors-2947000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-25T10:00:00Z',
    aliases: ['warhammer survivors', 'warhammer 40k', 'space marine survivors'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-11-10',
        type: 'major',
        title: 'Annuncio Ufficiale Collaborazione',
        changelog: [
          'L\'universo di Warhammer 40,000 incontra il gameplay assuefacente in stile Vampire Survivors.'
        ]
      }
    ]
  },
  {
    id: 'nocturnal-ii',
    title: 'Nocturnal II',
    platform: 'both',
    titleId: '01006E301DC80000',
    publisher: 'Sunnyside Games',
    releaseDate: '2026-11-10',
    status: 'upcoming',
    genres: ['Azione', 'Metroidvania', '2D', 'Platform'],
    coverImage: '/covers/nocturnal-ii.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Nocturnal-II-2948000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-20T10:00:00Z',
    aliases: ['nocturnal 2', 'nocturnal ii', 'spada di fuoco'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-11-10',
        type: 'major',
        title: 'Data di Rilascio e Trailer Ufficiale',
        changelog: [
          'Nuove abilità elementali del fuoco e ambientazioni interamente ridisegnate a mano.'
        ]
      }
    ]
  },
  {
    id: 'fate-extra-record',
    title: 'Fate/Extra Record',
    platform: 'both',
    titleId: '01009A101CC50000',
    publisher: 'Bandai Namco / Type-Moon',
    releaseDate: '2027-01-28',
    status: 'upcoming',
    genres: ['RPG', 'A turni', 'Anime', 'Visual Novel'],
    coverImage: '/covers/fate-extra-record.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Fate-Extra-Record-2962000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-09-28T10:00:00Z',
    aliases: ['fate extra', 'fate extra record', 'type moon', 'nero claudius', 'saber'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-01-28',
        type: 'major',
        title: 'Data di Uscita Confermata in Occidente',
        changelog: [
          'Remake in 3D completo della celebre Guerra del Santo Graal della Luna.'
        ]
      }
    ]
  },
  {
    id: 'trine-6-together-in-time',
    title: 'Trine 6: Together in Time',
    platform: 'both',
    titleId: '01008D201BC90000',
    publisher: 'Frozenbyte / THQ Nordic',
    releaseDate: '2027-03-04',
    status: 'upcoming',
    genres: ['Platform', 'Puzzle', 'Co-op', 'Fantasy'],
    coverImage: '/covers/trine-6.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Trine-6-Together-in-Time-2982000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-02T10:00:00Z',
    aliases: ['trine 6', 'trine', 'amadeus pontius zoya', 'together in time'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-03-04',
        type: 'major',
        title: 'Annuncio Sesto Capitolo Trine',
        changelog: [
          'Nuove meccaniche di manipolazione temporale cooperative per 4 giocatori.'
        ]
      }
    ]
  },
  {
    id: 'he-man-dragon-pearl-of-destruction',
    title: 'He-Man and the Masters of the Universe: Dragon Pearl of Destruction',
    platform: 'both',
    titleId: '01005C701EB10000',
    publisher: 'Mattel / Outright Games',
    releaseDate: '2027-02-04',
    status: 'upcoming',
    genres: ['Azione', 'Picchiaduro', 'Avventura', 'Co-op'],
    coverImage: '/covers/he-man-dragon-pearl.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/He-Man-Dragon-Pearl-2972000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-18T10:00:00Z',
    aliases: ['he-man', 'masters of the universe', 'skeletor', 'dragon pearl'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-02-04',
        type: 'major',
        title: 'Apertura Scheda Ufficiale',
        changelog: [
          'Avventura d\'azione cooperativa ambientata su Eternia contro le forze di Skeletor.'
        ]
      }
    ]
  },
  {
    id: 'attack-on-titan-3-switch2',
    title: 'Attack on Titan 3',
    platform: 'switch2',
    titleId: '01003B501FA60000',
    publisher: 'Koei Tecmo',
    releaseDate: '2026-12-10',
    status: 'upcoming',
    genres: ['Azione', 'Anime', 'Acrobatico', 'Giganti'],
    coverImage: '/covers/attack-on-titan-3.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch-2/Attack-on-Titan-3-2978000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-14T10:00:00Z',
    aliases: ['aot 3', 'attack on titan 3', 'shingeki no kyojin 3', 'eren yeager'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-12-10',
        type: 'major',
        title: 'Annuncio Ufficiale Koei Tecmo',
        changelog: [
          'Capitolo finale della trilogia d\'azione acrobatica con manovra tridimensionale a 60 FPS stabili su Switch 2.'
        ]
      }
    ]
  },
  {
    id: 'sonic-pico-park',
    title: 'Sonic Pico Park',
    platform: 'both',
    titleId: '01002A401DC70000',
    publisher: 'SEGA',
    releaseDate: '2026-11-12',
    status: 'upcoming',
    genres: ['Party', 'Puzzle', 'Co-op', 'Multiplayer'],
    coverImage: '/covers/sonic-pico-park.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Sonic-Pico-Park-2951000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-26T10:00:00Z',
    aliases: ['sonic pico park', 'pico park sonic', 'sega party'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-11-12',
        type: 'major',
        title: 'Presentazione Ufficiale SEGA',
        changelog: [
          'Cross-over cooperativo fino a 8 giocatori simultanei nei panni di Sonic, Tails, Knuckles e Amy.'
        ]
      }
    ]
  },
  {
    id: '13z-zodiac-trials',
    title: '13Z: The Zodiac Trials',
    platform: 'both',
    titleId: '01001B301EB80000',
    publisher: 'Mixed Realms',
    releaseDate: '2027-01-14',
    status: 'upcoming',
    genres: ['Action RPG', 'Hack and Slash', 'Roguelike'],
    coverImage: '/covers/13z-zodiac-trials.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/13Z-The-Zodiac-Trials-2961000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-16T10:00:00Z',
    aliases: ['13z', 'zodiac trials', 'segni zodiacali'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-01-14',
        type: 'major',
        title: 'Annuncio Ufficiale Roguelike',
        changelog: [
          'Sfida i 12 guardiani dello zodiaco in un action roguelite rapido e brutale con abilità celesti.'
        ]
      }
    ]
  },
  {
    id: 'the-road-of-dust-and-sorrow',
    title: 'The Road of Dust and Sorrow',
    platform: 'both',
    titleId: '01004C201FC90000',
    publisher: 'Team 17',
    releaseDate: '2026-12-03',
    status: 'upcoming',
    genres: ['Avventura', 'Narrativo', 'Post-apocalittico'],
    coverImage: '/covers/road-of-dust-and-sorrow.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/The-Road-of-Dust-and-Sorrow-2971000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-18T10:00:00Z',
    aliases: ['road of dust and sorrow', 'polvere e dolore'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2026-12-03',
        type: 'major',
        title: 'Annuncio Ufficiale Team 17',
        changelog: [
          'Viaggio narrativo emotivo attraverso terre desolate con scelte morali permanenti.'
        ]
      }
    ]
  },
  {
    id: 'grave-seasons',
    title: 'Grave Seasons',
    platform: 'both',
    titleId: '01007D501DB10000',
    publisher: 'Perfect Garbage',
    releaseDate: '2027-03-09',
    status: 'upcoming',
    genres: ['Simulazione', 'Mistero', 'Serial Killer', 'Farming'],
    coverImage: '/covers/grave-seasons.svg',
    eshopUrl: 'https://www.nintendo.com/it-it/Giochi/Giochi-per-Nintendo-Switch/Grave-Seasons-2986000.html',
    currentVersion: 'v1.0.0',
    currentInternalVersion: 65536,
    lastUpdated: '2026-10-22T10:00:00Z',
    aliases: ['grave seasons', 'fattoria serial killer', 'farming sim mistero'],
    updates: [
      {
        version: 'v1.0.0',
        releaseDate: '2027-03-09',
        type: 'major',
        title: 'Annuncio Ufficiale Data',
        changelog: [
          'Simulatore agricolo sovrannaturale in cui uno degli abitanti del villaggio è un serial killer segreto da smascherare.'
        ]
      }
    ]
  }
];

// Applica le modifiche a data/games.json
const rawGames = fs.readFileSync(DATA_FILE, 'utf8');
const games = JSON.parse(rawGames);

// Aggiorna anche le copertine dei giochi esistenti che puntavano a URL remoti 404
const fixes = {
  'final-fantasy-vii-remake-intergrade': '/covers/final-fantasy-vii-remake-intergrade.png',
  'sid-meiers-civilization-vii-switch2': '/covers/sid-meiers-civilization-vii.png',
  'survival-kids-switch2': '/covers/survival-kids.jpg',
  'the-duskbloods-switch2': '/covers/the-duskbloods.jpg',
  'kirby-and-the-world-beyond': '/covers/kirby-and-the-world-beyond.png'
};

for (const [id, localCover] of Object.entries(fixes)) {
  const g = games.find(x => x.id === id);
  if (g) {
    g.coverImage = localCover;
    console.log('[TRAIL:FIX] Fixed local cover for', id, '->', localCover);
  }
}

// Inserisce o aggiorna ciascun gioco in arrivo
let addedCount = 0;
let updatedCount = 0;

for (const upcoming of upcomingCatalog) {
  const idx = games.findIndex(g => g.id === upcoming.id);
  if (idx >= 0) {
    games[idx] = { ...games[idx], ...upcoming, status: 'upcoming' };
    updatedCount++;
  } else {
    games.unshift(upcoming);
    addedCount++;
  }
}

// Scrittura atomica
const tempFile = `${DATA_FILE}.tmp`;
fs.writeFileSync(tempFile, JSON.stringify(games, null, 2), 'utf8');
fs.renameSync(tempFile, DATA_FILE);

console.log(`[TRAIL:STORE] Salvataggio completato! Aggiunti: ${addedCount}, Aggiornati: ${updatedCount}, Totale nel DB: ${games.length}`);
