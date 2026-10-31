/**
 * Ponytail self-check test suite using Node built-in test runner
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { store } from '../src/store.js';
import { tracker } from '../src/tracker.js';

test('GameStore: carica correttamente i giochi dal file JSON', () => {
  const games = store.getGames();
  assert.ok(games.length > 0, 'Il catalogo giochi non deve essere vuoto');
  assert.ok(games.some(g => g.id === 'zelda-totk'), 'Deve contenere Zelda TotK');
});

test('GameStore: filtra correttamente per piattaforma switch e switch2', () => {
  const switch1 = store.getGames({ platform: 'switch' });
  const switch2 = store.getGames({ platform: 'switch2' });

  assert.ok(switch1.length > 0, 'Devono esserci giochi per Switch 1');
  assert.ok(switch2.length > 0, 'Devono esserci giochi per Switch 2');

  for (const g of switch1) {
    assert.ok(g.platform === 'switch' || g.platform === 'both');
  }
  for (const g of switch2) {
    assert.ok(g.platform === 'switch2' || g.platform === 'both');
  }
});

test('GameStore: ricerca testuale per nome e TitleID', () => {
  const byName = store.getGames({ search: 'Mario' });
  assert.ok(byName.length >= 2, 'La ricerca per Mario deve trovare Mario Wonder e Mario Kart');

  const byId = store.getGames({ search: '0100F2C0115B6000' });
  assert.equal(byId.length, 1, 'La ricerca per TitleID esatto deve trovare 1 gioco');
  assert.equal(byId[0].id, 'zelda-totk');
});

test('GameStore: estrae gli ultimi aggiornamenti con struttura integra', () => {
  const latest = store.getLatestUpdates(5);
  assert.ok(latest.length > 0);
  assert.ok(latest.length <= 5);

  const first = latest[0];
  assert.ok(first.gameTitle);
  assert.ok(first.version);
  assert.ok(first.releaseDate);
  assert.ok(Array.isArray(first.changelog));
});

test('UpdateTracker: classifica correttamente i salti di versione', () => {
  assert.equal(tracker.classifyVersionJump('v1.0.0', 'v2.0.0').type, 'major');
  assert.equal(tracker.classifyVersionJump('v1.1.0', 'v1.2.0').type, 'content');
  assert.equal(tracker.classifyVersionJump('v2.1.0', 'v2.1.2').type, 'patch');
});

test('GameStore: filtra e gestisce correttamente i titoli non ancora usciti (upcoming)', () => {
  const upcoming = store.getGames({ platform: 'upcoming' });
  assert.ok(upcoming.length > 0, 'Devono esserci giochi con status upcoming');
  for (const g of upcoming) {
    assert.equal(g.status, 'upcoming');
  }

  // Verifica che con sort recent i titoli non ancora usciti NON siano in testa
  const recent = store.getGames({ sort: 'recent', limit: 10 });
  assert.ok(recent.length > 0);
  assert.notEqual(recent[0].status, 'upcoming', 'Il primo risultato dei più recenti non deve essere un gioco non ancora uscito');
});

test('Audit Copertine: ogni scheda in "Ultimi Aggiornamenti" e titoli curati ha cover valida e unica', () => {
  const latest = store.getLatestUpdates(20);
  for (const item of latest) {
    assert.ok(item.gameCover && (item.gameCover.startsWith('http') || item.gameCover.startsWith('/')), `Copertina valida per ${item.gameTitle}`);
    assert.ok(item.gameTitle, 'Titolo presente');
    assert.ok(item.version, 'Versione presente');
  }

  // Verifica che i titoli curati chiave abbiano copertine univoche
  const totk = store.getGameById('zelda-totk');
  const botw = store.getGameById('zelda-botw');
  const metroid = store.getGameById('metroid-prime-4-beyond');
  const silksong = store.getGameById('hollow-knight-silksong');
  const dd1 = store.getGameById('dragons-dogma-dark-arisen');
  const dd2 = store.getGameById('dragons-dogma-2-dark-arisen');
  const hades2 = store.getGameById('hades-2');
  const cyberpunk = store.getGameById('cyberpunk-2077-switch2');
  const witcher = store.getGameById('the-witcher-3-wild-hunt');

  const covers = [totk.coverImage, botw.coverImage, metroid.coverImage, silksong.coverImage, dd1.coverImage, dd2.coverImage, hades2.coverImage, cyberpunk.coverImage, witcher.coverImage];
  const uniqueCovers = new Set(covers);
  assert.equal(covers.length, uniqueCovers.size, 'Nessuno dei titoli principali deve condividere la stessa copertina');
});

test('GameStore: Ricerca intelligente tollerante a punteggiatura, spazi e accenti', () => {
  // Ricerca senza punto (Gear Club invece di Gear.Club)
  const gcMatches = store.getGames({ search: 'Gear Club Unlimited' });
  assert.ok(gcMatches.length >= 3, 'Deve trovare tutti i titoli della serie Gear.Club Unlimited anche con spazio');
  assert.ok(gcMatches.some(g => g.id === 'gear-club-unlimited-8000'));
  assert.ok(gcMatches.some(g => g.id === 'gear-club-unlimited-2-0000'));
  assert.ok(gcMatches.some(g => g.id === 'gear-club-unlimited-3'));

  // Verifica Gear.Club Unlimited 3 su Switch 2 con update e changelog
  const gc3 = store.getGameById('gear-club-unlimited-3');
  assert.ok(gc3, 'Gear.Club Unlimited 3 deve esistere');
  assert.equal(gc3.platform, 'switch2');
  assert.ok(gc3.updates && gc3.updates.length > 0, 'Gear.Club 3 deve avere changelog');

  // Ricerca senza apostrofi / accenti / parole separate
  const zelda = store.getGames({ search: 'zelda tears' });
  assert.ok(zelda.some(g => g.id === 'zelda-totk'));

  const dogma = store.getGames({ search: 'dragons dogma' });
  assert.ok(dogma.length >= 2);

  const pokemon = store.getGames({ search: 'pokemon legends' });
  assert.ok(pokemon.some(g => g.id === 'pokemon-legends-za'));

  // Ricerca RuneScape (RuneScape: Dragonwilds per Switch 2)
  const runescape = store.getGames({ search: 'runescape' });
  assert.ok(runescape.length >= 1, 'Deve trovare RuneScape: Dragonwilds');
  assert.ok(runescape.some(g => g.id === 'runescape-dragonwilds'));
  const rsGame = store.getGameById('runescape-dragonwilds');
  assert.equal(rsGame.platform, 'switch2');
  assert.ok(rsGame.updates && rsGame.updates.length >= 2, 'RuneScape deve avere patch tracciate');

  // Ricerca Cross-Language & Acronimi Internazionali
  const scarlet = store.getGames({ search: 'pokemon scarlet' });
  assert.ok(scarlet.length > 0 && scarlet[0].title.includes('Scarlatto'), 'pokemon scarlet deve trovare Pokémon Scarlatto al 1° posto');

  const botw = store.getGames({ search: 'zelda botw' });
  assert.ok(botw.length > 0 && botw[0].title.includes('Breath of the Wild'), 'zelda botw deve trovare Breath of the Wild al 1° posto');

  const kirby = store.getGames({ search: 'kirby forgotten land' });
  assert.ok(kirby.length > 0 && kirby[0].title.includes('terra perduta'), 'kirby forgotten land deve trovare Kirby e la terra perduta');

  const ttyd = store.getGames({ search: 'thousand-year door' });
  assert.ok(ttyd.length > 0 && ttyd[0].title.includes('Portale Millenario'), 'thousand-year door deve trovare Paper Mario');

  const sunbreak = store.getGames({ search: 'sunbreak' });
  assert.ok(sunbreak.length > 0 && sunbreak[0].title.includes('Monster Hunter'), 'sunbreak deve trovare Monster Hunter Rise');

  const acnh = store.getGames({ search: 'acnh' });
  assert.ok(acnh.length > 0 && acnh[0].title.includes('Animal Crossing'), 'acnh deve trovare Animal Crossing');

  const mk8d = store.getGames({ search: 'mk8d' });
  assert.ok(mk8d.length > 0 && mk8d[0].title.includes('Mario Kart 8'), 'mk8d deve trovare Mario Kart 8 Deluxe');
});

test('Flagship Curati: verifica integrità changelog e patch notes reali', () => {
  const flagships = [
    'pok-mon-scarlatto-c000',
    'pok-mon-violetto-e000',
    'leggende-pok-mon-arceus-a000',
    'metroid-dread-c000',
    'kirby-e-la-terra-perduta-e000',
    'paper-mario-il-portale-millenario-e000',
    'luigi-s-mansion-3-6000',
    'pikmin-4-a000',
    'splatoon-3-0000',
    'xenoblade-chronicles-3-2000',
    'monster-hunter-rise-2000',
    'minecraft-4000',
    'fortnite-e000',
    'stardew-valley-8000',
    'donkey-kong-bananza-2000'
  ];

  for (const id of flagships) {
    const game = store.getGameById(id);
    assert.ok(game, `Il gioco ${id} deve esistere`);
    assert.ok(game.updates && game.updates.length > 0, `${game.title} deve avere aggiornamenti`);
    const hasDetailedNote = game.updates.some(u => u.changelog && u.changelog.some(c => !c.includes('stabilità di sistema')));
    assert.ok(hasDetailedNote, `${game.title} deve contenere note di patch dettagliate`);
  }
});

test('Donkey Kong Bananza & Switch 2: piattaforma, DLC ed update verificati', () => {
  const dkb = store.getGameById('donkey-kong-bananza-2000');
  assert.ok(dkb, 'Donkey Kong Bananza deve esistere nel catalogo');
  assert.equal(dkb.platform, 'switch2', 'Donkey Kong Bananza deve essere classificato come esclusiva Switch 2');
  assert.ok(dkb.titleId.startsWith('04'), 'Il Title ID di DK Bananza deve iniziare per 04');
  assert.equal(dkb.currentVersion, 'v3.2.0', 'La versione corrente deve essere v3.2.0');
  assert.equal(dkb.updates.length, 5, 'Deve avere 5 versioni storicizzate con changelog');
  assert.ok(dkb.dlc && dkb.dlc.length >= 1, 'Deve avere la sezione DLC con l\'espansione DK Island & Emerald Rush');
  assert.equal(dkb.dlc[0].title, 'DK Island & Emerald Rush');

  // Ricerca con alias
  const searchResults = store.getGames({ search: 'dk bananza' });
  assert.ok(searchResults.length > 0, 'La ricerca "dk bananza" deve trovare il gioco');
  assert.equal(searchResults[0].id, 'donkey-kong-bananza-2000');

  // Verifica che tutti i giochi con prefisso 04 siano marcati switch2
  const all04 = store.games.filter(g => g.titleId && g.titleId.startsWith('04'));
  assert.ok(all04.length >= 20, 'Devono esserci almeno 20 titoli Switch 2 con prefisso 04');
  assert.ok(all04.every(g => g.platform === 'switch2'), 'Tutti i titoli con Title ID 04 devono avere piattaforma switch2');
});

test('Xenoblade Chronicles Saga & Switch 2 Enhanced Catalog', () => {
  // Tutti i capitoli principali di Xenoblade devono essere presenti
  const xenoGames = store.getGames({ search: 'xenoblade' });
  assert.ok(xenoGames.length >= 5, 'Devono esserci tutti i 5 capitoli della saga Xenoblade');

  const x2 = store.getGameById('xenoblade-chronicles-2');
  assert.ok(x2, 'Xenoblade Chronicles 2 deve esistere');
  assert.equal(x2.platform, 'both', 'Xenoblade 2 deve essere cross-gen (Switch 1 & 2)');
  assert.equal(x2.titleId, '0100E95004038000', 'Title ID corretto per Xenoblade 2');
  assert.ok(x2.updates.some(u => u.title.includes('Nintendo Switch 2')), 'Xenoblade 2 deve avere la patch Switch 2');

  const x3 = store.getGameById('xenoblade-chronicles-3-2000');
  assert.ok(x3, 'Xenoblade Chronicles 3 deve esistere');
  assert.equal(x3.platform, 'both', 'Xenoblade 3 deve essere cross-gen');
  assert.ok(x3.updates.some(u => u.version === 'v2.3.0'), 'Xenoblade 3 deve avere la patch v2.3.0 Switch 2');

  // Verifica ampiezza catalogo Switch 2 (esclusive + cross-gen enhanced)
  const s2Catalog = store.getGames({ platform: 'switch2' });
  assert.ok(s2Catalog.length >= 50, `Il catalogo Switch 2 deve contenere almeno 50 titoli (trovati: ${s2Catalog.length})`);
  const stats = store.getStats();
  assert.ok(stats.switch2Count >= 50, `switch2Count deve essere >= 50 (attuale: ${stats.switch2Count})`);

  // Verifica rigore: NieR: Automata e titoli retrocompatibili standard sono solo Switch 1
  const nier = store.getGameById('nier-automata-the-end-of-yorha-edition-8000');
  assert.equal(nier.platform, 'switch', 'NieR: Automata deve essere rigorosamente piattaforma switch (Switch 1)');
  assert.ok(!s2Catalog.some(g => g.id === nier.id), 'NieR: Automata non deve comparire nel catalogo Switch 2');
});
