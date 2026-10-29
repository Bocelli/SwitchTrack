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
