import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/games.json');

const games = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

const CURATED_FLAGSHIPS = {
  'pok-mon-scarlatto-c000': {
    currentVersion: 'v3.0.1',
    currentInternalVersion: 720896,
    lastUpdated: '2024-02-01T10:00:00Z',
    updates: [
      {
        version: 'v3.0.1',
        previousVersion: 'v3.0.0',
        internalVersion: 720896,
        releaseDate: '2024-02-01',
        type: 'patch',
        title: 'Hotfix Epilogo Frangimare & Stabilità Terarium',
        changelog: [
          'Risolti problemi di progressione durante l\'evento epilogo Frangimare a Nordivia.',
          'Corretto un crash raro quando si utilizzano oggetti speciali nel Cerchio Sincronia dell\'Istituto Mirtillo.',
          'Migliorata la fluidità del framerate nei biomi acquatici e polari del Terarium.'
        ]
      },
      {
        version: 'v3.0.0',
        previousVersion: 'v2.0.2',
        internalVersion: 655360,
        releaseDate: '2023-12-14',
        type: 'major',
        title: 'DLC Parte 2: Il disco indaco & Volo Koraidon/Miraidon',
        changelog: [
          'Rilasciato il DLC Il disco indaco con accesso all\'Istituto Mirtillo e al Terarium subacqueo.',
          'Sbloccata la nuova abilità di volo permanente per Koraidon e Miraidon.',
          'Aggiunte oltre 200 specie storiche e leggendari di precedenti generazioni catturabili.',
          'Introdotta la funzione Sincronizzazione Pokémon per controllare direttamente i Pokémon nel mondo aperto.'
        ]
      },
      {
        version: 'v2.0.1',
        previousVersion: 'v1.3.2',
        internalVersion: 524288,
        releaseDate: '2023-09-13',
        type: 'major',
        title: 'DLC Parte 1: La maschera turchese & Nuova Fotocamera',
        changelog: [
          'Rilasciato il DLC La maschera turchese nella regione di Nordivia con festival dei folletti.',
          'Nuova funzione Fotocamera con bastone per selfie ed espressioni Pokémon personalizzate.',
          'Aggiunta la Roto-stick e la modalità Caccia all\'orco.'
        ]
      }
    ]
  },
  'pok-mon-violetto-e000': {
    currentVersion: 'v3.0.1',
    currentInternalVersion: 720896,
    lastUpdated: '2024-02-01T10:00:00Z',
    updates: [
      {
        version: 'v3.0.1',
        previousVersion: 'v3.0.0',
        internalVersion: 720896,
        releaseDate: '2024-02-01',
        type: 'patch',
        title: 'Hotfix Epilogo Frangimare & Stabilità Terarium',
        changelog: [
          'Risolti problemi di progressione durante l\'evento epilogo Frangimare a Nordivia.',
          'Corretto un crash raro quando si utilizzano oggetti speciali nel Cerchio Sincronia dell\'Istituto Mirtillo.',
          'Migliorata la fluidità del framerate nei biomi acquatici e polari del Terarium.'
        ]
      },
      {
        version: 'v3.0.0',
        previousVersion: 'v2.0.2',
        internalVersion: 655360,
        releaseDate: '2023-12-14',
        type: 'major',
        title: 'DLC Parte 2: Il disco indaco & Volo Koraidon/Miraidon',
        changelog: [
          'Rilasciato il DLC Il disco indaco con accesso all\'Istituto Mirtillo e al Terarium subacqueo.',
          'Sbloccata la nuova abilità di volo permanente per Koraidon e Miraidon.',
          'Aggiunte oltre 200 specie storiche e leggendari di precedenti generazioni catturabili.',
          'Introdotta la funzione Sincronizzazione Pokémon per controllare direttamente i Pokémon nel mondo aperto.'
        ]
      },
      {
        version: 'v2.0.1',
        previousVersion: 'v1.3.2',
        internalVersion: 524288,
        releaseDate: '2023-09-13',
        type: 'major',
        title: 'DLC Parte 1: La maschera turchese & Nuova Fotocamera',
        changelog: [
          'Rilasciato il DLC La maschera turchese nella regione di Nordivia con festival dei folletti.',
          'Nuova funzione Fotocamera con bastone per selfie ed espressioni Pokémon personalizzate.',
          'Aggiunta la Roto-stick e la modalità Caccia all\'orco.'
        ]
      }
    ]
  },
  'leggende-pok-mon-arceus-a000': {
    currentVersion: 'v1.1.1',
    currentInternalVersion: 196608,
    lastUpdated: '2022-03-18T10:00:00Z',
    updates: [
      {
        version: 'v1.1.1',
        previousVersion: 'v1.1.0',
        internalVersion: 196608,
        releaseDate: '2022-03-18',
        type: 'patch',
        title: 'Fix Missioni Secondarie & Stabilità Hisui',
        changelog: [
          'Corretto un problema che impediva di ottenere la Pietra Splendente completando la richiesta 102.',
          'Risolto un glitch di telecamera durante l\'esplorazione del Tempio di Nevepoli.'
        ]
      },
      {
        version: 'v1.1.0',
        previousVersion: 'v1.0.2',
        internalVersion: 131072,
        releaseDate: '2022-02-27',
        type: 'major',
        title: 'La nuova alba di Hisui (Daybreak) & Comparse Massicce Multiple',
        changelog: [
          'Introdotte le comparse massicce multiple in tutte le terre di Hisui con condizioni meteo tempestose.',
          'Aggiunta la Sfida dei Guardiani al Villaggio Giubilo per sfidare i capitani in battaglie consecutive.',
          'Aggiunta la Lotta eterna dei sogni con Arceus nei sogni di riposo del protagonista.',
          'Nuovi arredi e opzioni per lo studio fotografico del villaggio.'
        ]
      }
    ]
  },
  'metroid-dread-c000': {
    currentVersion: 'v2.1.0',
    currentInternalVersion: 196608,
    lastUpdated: '2022-04-07T10:00:00Z',
    updates: [
      {
        version: 'v2.1.0',
        previousVersion: 'v2.0.0',
        internalVersion: 196608,
        releaseDate: '2022-04-07',
        type: 'major',
        title: 'Aggiornamento Boss Rush (Boss Rush, Survival & Dread Rush)',
        changelog: [
          'Aggiunta la modalità "Boss Rush": affronta i 12 boss principali di ZDR in sequenza rapida.',
          'Aggiunta la modalità "Survival Rush": sconfiggi il maggior numero di boss prima che scada il tempo di 5 minuti.',
          'Aggiunta la modalità "Dread Rush": sfida consecutiva senza tregua con morte al primo colpo subito.'
        ]
      },
      {
        version: 'v2.0.0',
        previousVersion: 'v1.0.3',
        internalVersion: 131072,
        releaseDate: '2022-02-09',
        type: 'major',
        title: 'Modalità Terrore (Dread Mode) & Modalità Principiante (Rookie Mode)',
        changelog: [
          'Introdotta la Modalità Terrore: qualsiasi danno subito da nemici, pericoli o E.M.M.I. causa game over immediato.',
          'Introdotta la Modalità Principiante: recupero energia aumentato e danni ridotti per completare la storia in tranquillità.',
          'Aggiunta schermata riepilogativa finale con statistiche accurate sui tempi e percentuali.'
        ]
      }
    ]
  },
  'kirby-e-la-terra-perduta-e000': {
    currentVersion: 'v1.0.1',
    currentInternalVersion: 65536,
    lastUpdated: '2022-04-20T10:00:00Z',
    updates: [
      {
        version: 'v1.0.1',
        previousVersion: 'v1.0.0',
        internalVersion: 65536,
        releaseDate: '2022-04-20',
        type: 'patch',
        title: 'Miglioramento Stabilità Coop & Rendering Boccomorfosi',
        changelog: [
          'Risolto un bug che poteva non conteggiare correttamente i Waddle Dee salvati durante la modalità cooperativa a 2 giocatori.',
          'Migliorata la fluidità della telecamera durante le sequenze Boccomorfosi nei livelli acquatici e industriali.',
          'Corretto un glitch di collisione che poteva spingere Kirby fuori dalla mappa nella Città di Waddle Dee.'
        ]
      }
    ]
  },
  'paper-mario-il-portale-millenario-e000': {
    currentVersion: 'v1.0.1',
    currentInternalVersion: 65536,
    lastUpdated: '2024-06-18T10:00:00Z',
    updates: [
      {
        version: 'v1.0.1',
        previousVersion: 'v1.0.0',
        internalVersion: 65536,
        releaseDate: '2024-06-18',
        type: 'patch',
        title: 'Fix Progressione Capitolo 7 & Stabilità Mostra Galleria',
        changelog: [
          'Risolto un problema di progressione raro nel Capitolo 7 che poteva impedire l\'interazione con il cannone di Fannullonia.',
          'Corretti glitch di rendering sulle animazioni delle ombre di Mario di carta durante il salto avvitato.',
          'Migliorata la reattività dell\'interfaccia durante il cambio compagni nelle battaglie sul palco.'
        ]
      }
    ]
  },
  'luigi-s-mansion-3-6000': {
    currentVersion: 'v1.4.0',
    currentInternalVersion: 262144,
    lastUpdated: '2020-04-29T10:00:00Z',
    updates: [
      {
        version: 'v1.4.0',
        previousVersion: 'v1.3.0',
        internalVersion: 262144,
        releaseDate: '2020-04-29',
        type: 'major',
        title: 'Pacchetto Multigiocatore Parte 2: Tre Nuovi Minigiochi Torre del Caos',
        changelog: [
          'Aggiunti tre nuovi minigiochi per la modalità Giochi di Fantasmi: Flipper spettrale, Sfida della zattera e Hockey spettrale.',
          'Nuovi costumi speciali per Luigi: Mago, Medievale e Discoteca con fantasmi tematici abbinati.',
          'Migliorata la stabilità delle stanze online per 8 giocatori.'
        ]
      },
      {
        version: 'v1.3.0',
        previousVersion: 'v1.2.0',
        internalVersion: 196608,
        releaseDate: '2020-03-03',
        type: 'major',
        title: 'Pacchetto Multigiocatore Parte 1: Modalità 20 Piani Torre del Caos',
        changelog: [
          'Aggiunta l\'opzione a 20 piani per la scalata della Torre del Caos.',
          'Aggiunti i costumi Cavaliere, Grottesco e Mummia.',
          'Nuova sezione Galleria d\'arte per ascoltare le tracce della colonna sonora.'
        ]
      }
    ]
  },
  'pikmin-4-a000': {
    currentVersion: 'v1.0.2',
    currentInternalVersion: 131072,
    lastUpdated: '2023-09-26T10:00:00Z',
    updates: [
      {
        version: 'v1.0.2',
        previousVersion: 'v1.0.1',
        internalVersion: 131072,
        releaseDate: '2023-09-26',
        type: 'patch',
        title: 'Fix Progressione Esplorazione 100% & Dandori Split-Screen',
        changelog: [
          'Corretto un errore in cui il contatore di completamento delle caverne poteva rimanere bloccato al 99%.',
          'Risolto un bug che poteva far incastrare Occin durante il trasporto di tesori subacquei con i Pikmin blu.',
          'Migliorato il framerate e ridotti i cali di fluidità durante le Battaglie Dandori a 2 giocatori su schermo diviso.'
        ]
      },
      {
        version: 'v1.0.1',
        previousVersion: 'v1.0.0',
        internalVersion: 65536,
        releaseDate: '2023-07-28',
        type: 'patch',
        title: 'Miglioramento Salvataggi Missioni Notturne',
        changelog: [
          'Risolto un problema nei salvataggi automatici durante le difese notturne dei lumipolli.',
          'Corrette anomalie nel puntamento del fischietto con il controllo sensori di movimento dei Joy-Con.'
        ]
      }
    ]
  },
  'splatoon-3-0000': {
    currentVersion: 'v9.0.0',
    currentInternalVersion: 589824,
    lastUpdated: '2024-09-12T10:00:00Z',
    updates: [
      {
        version: 'v9.0.0',
        previousVersion: 'v8.0.0',
        internalVersion: 589824,
        releaseDate: '2024-09-12',
        type: 'major',
        title: 'Grand Festival Finale & Ricalibrazione Totale Armi',
        changelog: [
          'Supporto al Grand Festival celebrativo mondiale di 72 ore con tre palchi dal vivo per i gruppi musicali.',
          'Ricalibrate le statistiche di danno e raggio per oltre 40 armi principali e speciali.',
          'Sbloccati i badge celebrativi per i fan di Sea Sirens, Off the Hook e Deep Cut.'
        ]
      },
      {
        version: 'v8.0.0',
        previousVersion: 'v7.0.0',
        internalVersion: 524288,
        releaseDate: '2024-06-01',
        type: 'major',
        title: 'Sizzle Season 2024: Nuove Armi Decavitator e Wellstring V',
        changelog: [
          'Aggiunte le armi Decavitator (Lama tergicristallo pesante) e Wellstring V (Arco a ventaglio a 5 frecce).',
          'Nuovo scenario di battaglia competitivo: Lemuria Hub.',
          'Nuova modalità Big Run speciale su Salmon Run Next Wave.'
        ]
      },
      {
        version: 'v7.0.0',
        previousVersion: 'v6.0.0',
        internalVersion: 458752,
        releaseDate: '2024-02-22',
        type: 'major',
        title: 'DLC Torre dell\'Ordine (Side Order) & Fresh Season',
        changelog: [
          'Rilasciato il DLC per giocatore singolo "Torre dell\'Ordine" con progressione a chip di colore e stile roguelite.',
          'Nuovo hub di piazza Coloropoli vintage ispirato a Inkopolis Square.',
          'Nuovi set di armi Ordine con finiture monocromatiche esclusive.'
        ]
      }
    ]
  },
  'xenoblade-chronicles-3-2000': {
    currentVersion: 'v2.2.0',
    currentInternalVersion: 262144,
    lastUpdated: '2024-01-19T10:00:00Z',
    updates: [
      {
        version: 'v2.2.0',
        previousVersion: 'v2.1.0',
        internalVersion: 262144,
        releaseDate: '2024-01-19',
        type: 'patch',
        title: 'Supporto Completo amiibo Noah e Mio',
        changelog: [
          'Aggiunto il supporto agli amiibo di Noah e Mio per sbloccare l\'abito da console N e la divisa casual di Mio.',
          'Ottimizzata la gestione della memoria nei viaggi rapidi per prevenire stuttering nell\'area di Cadensia.'
        ]
      },
      {
        version: 'v2.0.0',
        previousVersion: 'v1.3.0',
        internalVersion: 196608,
        releaseDate: '2023-04-26',
        type: 'major',
        title: 'Un Futuro Redento (Future Redeemed) - Volume 4 Expansion Pass',
        changelog: [
          'Rilasciata la nuova campagna prequel "Un Futuro Redento" con Matthew, Shulk, Rex, A, Nikol e Glimmer.',
          'Nuovo sistema di sviluppo "Manuale d\'armonia" e attacchi d\'intesa combinati.',
          'Nuove musiche composte da Yasunori Mitsuda e Manami Kiyota.'
        ]
      }
    ]
  },
  'monster-hunter-rise-2000': {
    currentVersion: 'v16.0.0',
    currentInternalVersion: 1048576,
    lastUpdated: '2023-06-08T10:00:00Z',
    updates: [
      {
        version: 'v16.0.0',
        previousVersion: 'v15.0.0',
        internalVersion: 1048576,
        releaseDate: '2023-06-08',
        type: 'major',
        title: 'Sunbreak Aggiornamento Finale: Malzeno Primordiale',
        changelog: [
          'Aggiunto il Malzeno Primordiale come scontro finale epico della saga Sunbreak.',
          'Nuove abilità di armatura "Risveglio del Sangue" e decorazioni gioiello livello 4 potenziate.',
          'Aumentato il livello massimo delle Ricerche Anomalie fino al Grado 300.',
          'Aggiunte le missioni "Indagine Speciale" per i cacciatori più esperti.'
        ]
      },
      {
        version: 'v15.0.0',
        previousVersion: 'v14.0.0',
        internalVersion: 983040,
        releaseDate: '2023-04-20',
        type: 'major',
        title: 'Sunbreak Free Title Update 5: Amatsu & Shagaru Magala Risorto',
        changelog: [
          'Aggiunto il Drago Antico Amatsu con tempeste violente alla Fonte Infernale.',
          'Aggiunto lo Shagaru Magala Risorto con attacchi frenesia ampliati.',
          'Nuova funzione di fusione talismani "Fusione Qurious".'
        ]
      }
    ]
  },
  'super-mario-rpg-8000': {
    currentVersion: 'v1.0.1',
    currentInternalVersion: 65536,
    lastUpdated: '2023-12-13T10:00:00Z',
    updates: [
      {
        version: 'v1.0.1',
        previousVersion: 'v1.0.0',
        internalVersion: 65536,
        releaseDate: '2023-12-13',
        type: 'patch',
        title: 'Fix Blocco Paratroopa a Monstro Town & Stabilità Culex',
        changelog: [
          'Corretto il bug in cui Paratroopa poteva scomparire a Monstro Town, impedendo la scalata della scogliera.',
          'Risolto un problema audio che causava un loop sonoro infinito durante lo scontro opzionale con Culex 3D.',
          'Migliorata la reattività dell\'input per i comandi d\'azione a catena con tempismo perfetto.'
        ]
      }
    ]
  },
  'hogwarts-legacy-e000': {
    currentVersion: 'v1.0.5',
    currentInternalVersion: 327680,
    lastUpdated: '2024-06-06T10:00:00Z',
    updates: [
      {
        version: 'v1.0.5',
        previousVersion: 'v1.0.4',
        internalVersion: 327680,
        releaseDate: '2024-06-06',
        type: 'major',
        title: 'Summer Update: Modalità Fotografica & Quest Negozio di Hogsmeade',
        changelog: [
          'Aggiunta la Modalità Fotografica completa con filtri, pose, effetti luce e controllo inclinazione.',
          'Sbloccata per tutti i giocatori la quest del negozio infestate di Hogsmeade con l\'elfa Penny.',
          'Aggiunta la ricetta della pozione Felix Felicis e la cavalcatura Ippogrifo d\'Onice.',
          'Ottimizzati i caricamenti delle porte di Hogwarts e la stabilità audio durante il volo con scopa.'
        ]
      }
    ]
  },
  'minecraft-4000': {
    currentVersion: 'v1.21.30',
    currentInternalVersion: 1048576,
    lastUpdated: '2024-10-22T10:00:00Z',
    updates: [
      {
        version: 'v1.21.30',
        previousVersion: 'v1.20.0',
        internalVersion: 1048576,
        releaseDate: '2024-10-22',
        type: 'major',
        title: 'Tricky Trials (Prove Impegnative) & Nuova Arma Mazza',
        changelog: [
          'Introdotte le monumentali Camere delle Prove sotterranee con i Generatori di Prove e i forzieri protetti.',
          'Nuova arma da mischia Mazza (Mace) con colpi devastanti proporzionali all\'altezza di caduta.',
          'Nuovi mob ostili: il Breeze che rimbalza proiettili d\'aria e il Bogged (scheletro delle paludi velenoso).',
          'Aggiunto il blocco Artigiano (Crafter) per l\'autofabbricazione automatica alimentata da pietrarossa.'
        ]
      }
    ]
  },
  'fortnite-e000': {
    currentVersion: 'v31.40',
    currentInternalVersion: 1048576,
    lastUpdated: '2024-10-12T10:00:00Z',
    updates: [
      {
        version: 'v31.40',
        previousVersion: 'v30.00',
        internalVersion: 1048576,
        releaseDate: '2024-10-12',
        type: 'major',
        title: 'Fortnitemares 2024 & Ottimizzazione Motore Switch',
        changelog: [
          'Evento di Halloween Fortnitemares con motosega da combattimento e fucile a pompa a pallettoni.',
          'Ottimizzazione del rendering Unreal Engine per mantenere 30 FPS più stabili durante i combattimenti ravvicinati.',
          'Ridotti i tempi di caricamento delle texture all\'atterraggio dal bus della battaglia.'
        ]
      }
    ]
  },
  'stardew-valley-8000': {
    currentVersion: 'v1.6.9',
    currentInternalVersion: 131072,
    lastUpdated: '2024-11-04T10:00:00Z',
    updates: [
      {
        version: 'v1.6.9',
        previousVersion: 'v1.5.4',
        internalVersion: 131072,
        releaseDate: '2024-11-04',
        type: 'major',
        title: 'Aggiornamento Monumentale Stardew Valley 1.6 su Console',
        changelog: [
          'Nuovo festival monumentale della Fiera del Deserto di tre giorni in primavera, e due festival di pesca.',
          'Nuovo tipo di fattoria: Meadowlands Farm con erba blu nutriente per gli animali.',
          'Aggiunto il sistema di maestria avanzata per forgiare attrezzi di iridio con abilità speciali.',
          'Supporto per animali domestici multipli (cani, gatti, tartarughe) e oltre 280 nuovi oggetti d\'arredo.'
        ]
      }
    ]
  },
  'the-legend-of-zelda-echoes-of-wisdom-c000': {
    currentVersion: 'v1.0.2',
    currentInternalVersion: 131072,
    lastUpdated: '2024-10-15T10:00:00Z',
    updates: [
      {
        version: 'v1.0.2',
        previousVersion: 'v1.0.1',
        internalVersion: 131072,
        releaseDate: '2024-10-15',
        type: 'patch',
        title: 'Fix Stabilità Mondo del Nulla & Fluidità Hyrule',
        changelog: [
          'Risolto un problema per cui le repliche di determinati mostri volanti potevano incastrarsi negli squarci.',
          'Migliorata la stabilità del framerate durante l\'esplorazione a cavallo e nei villaggi affollati.',
          'Corretto un bug nella quest secondaria delle fate radiose che impediva il conteggio dei cuori.'
        ]
      }
    ]
  },
  'super-mario-3d-world-bowser-s-fury-a000': {
    currentVersion: 'v1.1.0',
    currentInternalVersion: 65536,
    lastUpdated: '2021-03-24T10:00:00Z',
    updates: [
      {
        version: 'v1.1.0',
        previousVersion: 'v1.0.0',
        internalVersion: 65536,
        releaseDate: '2021-03-24',
        type: 'patch',
        title: 'Miglioramento Stabilità Online & Movimento Sgattaiolante',
        changelog: [
          'Migliorata la sincronizzazione di rete nelle sessioni cooperative online a 4 giocatori.',
          'Corretti glitch di collisione che potevano verificarsi controllando Bowser Jr. in modalità cooperativa su Sgattaiolago.',
          'Risolto un problema grafico durante l\'apparizione della tempesta di Bowser Furioso.'
        ]
      }
    ]
  },
  'super-mario-party-jamboree-8000': {
    currentVersion: 'v1.1.0',
    currentInternalVersion: 65536,
    lastUpdated: '2024-10-28T10:00:00Z',
    updates: [
      {
        version: 'v1.1.0',
        previousVersion: 'v1.0.0',
        internalVersion: 65536,
        releaseDate: '2024-10-28',
        type: 'patch',
        title: 'Bilanciamento Minigiochi Bowserathlon & Stabilità Online',
        changelog: [
          'Ricalibrati i punti e la difficoltà nei minigiochi della modalità Bowserathlon a 20 giocatori.',
          'Migliorata la stabilità delle stanze di gioco online per le partite a tabellone classico.',
          'Corretti bug nelle animazioni dei compagni Jamboree durante le prove speciali dei tabelloni.'
        ]
      }
    ]
  }
};

let updatedCount = 0;
for (const game of games) {
  if (CURATED_FLAGSHIPS[game.id]) {
    const cur = CURATED_FLAGSHIPS[game.id];
    game.currentVersion = cur.currentVersion;
    game.currentInternalVersion = cur.currentInternalVersion;
    game.lastUpdated = cur.lastUpdated;
    game.updates = cur.updates;
    updatedCount++;
    console.log(`Curated ${game.id} -> ${game.title} (Ver: ${game.currentVersion}, Updates: ${game.updates.length})`);
  }
}

fs.writeFileSync(DATA_FILE, JSON.stringify(games, null, 2), 'utf-8');
console.log(`Successfully updated ${updatedCount} flagship games in data/games.json!`);
