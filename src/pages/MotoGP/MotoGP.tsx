// ─── MotoGP 2026 — MotoGP / Moto2 / Moto3 grid pagina ────────────────────────
//
// MAPPENSTRUCTUUR AFBEELDINGEN:
//
// public/motogp/
//   flags/          ← landvlaggen SVG  (zelfde als F1: nl.svg, es.svg etc.)
//   motogp/
//     riders/       ← rijder foto's    (320×240 px WebP, bv: marquez.webp)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: ducati.webp)
//   moto2/
//     riders/       ← rijder foto's    (320×240 px WebP)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: kalex.webp)
//   moto3/
//     riders/       ← rijder foto's    (320×240 px WebP)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: ktm_moto3.webp)
//
// MERK IDs (voor bikes map):
//   MotoGP: ducati, aprilia, ktm, yamaha, honda
//   Moto2:  kalex, boscoscuro, forward
//   Moto3:  ktm_moto3, honda_moto3
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

const MGP_ORANJE = '#f97316'

// ─── Jolpica MotoGP standings (gratis API) ────────────────────────────────────
interface Standing { pos: number; naam: string; team: string; punten: number }

async function fetchMGPStandings(klasse: string): Promise<Standing[]> {
  // Jolpica heeft geen MotoGP — toon lege lijst, kan later gevuld worden via Firebase
  return []
}

// ─── Statische rijder info ────────────────────────────────────────────────────
const RIJDER_INFO: Record<string, {
  geboortedatum: string; leeftijd: number; geboorteplaats: string
  lengte: string; debuut: string; wereldtitels: number
  bikeModel: string; motor: string; omschrijving: string
  overzichtTekst?: string; motorTekst?: string
}> = {
  // MotoGP
  bagnaia:        { geboortedatum: '14 jan. 1997',  leeftijd: 28, geboorteplaats: 'Torino, Italië',       lengte: '1.78 m', debuut: '2019, Qatar',     wereldtitels: 2, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',     omschrijving: 'Francesco Bagnaia is tweevoudig wereldkampioen MotoGP en verdedigt zijn titel in 2026 met de nieuwste Ducati Desmosedici.' },
  mmarquez:       { geboortedatum: '17 feb. 1993',  leeftijd: 32, geboorteplaats: 'Cervera, Spanje',      lengte: '1.68 m', debuut: '2013, Qatar',     wereldtitels: 8, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',     omschrijving: 'Marc Márquez is de meest succesvolle rijder van zijn generatie met 8 wereldtitels en rijdt in 2026 voor het fabrieksteam van Ducati.' },
  martin:         { geboortedatum: '29 jan. 1998',  leeftijd: 27, geboorteplaats: 'Madrid, Spanje',       lengte: '1.80 m', debuut: '2021, Qatar',     wereldtitels: 1, bikeModel: 'RS-GP26',          motor: 'Aprilia V4',    omschrijving: 'Jorge Martín is regerend wereldkampioen en maakt in 2026 de overstap naar Aprilia Racing.' },
  bezzecchi:      { geboortedatum: '26 sep. 1998',  leeftijd: 26, geboorteplaats: 'Rimini, Italië',       lengte: '1.73 m', debuut: '2021, Qatar',     wereldtitels: 0, bikeModel: 'RS-GP26',          motor: 'Aprilia V4',    omschrijving: 'Marco Bezzecchi is een van de meest opvallende talenten van zijn generatie en rijdt in 2026 voor Aprilia Racing.' },
  acosta:         { geboortedatum: '25 mei 2004',   leeftijd: 21, geboorteplaats: 'Murcia, Spanje',       lengte: '1.73 m', debuut: '2024, Qatar',     wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',        omschrijving: 'Pedro Acosta geldt als het grootste talent van zijn generatie en rijdt in 2026 voor het KTM fabrieksteam.' },
  binder:         { geboortedatum: '22 sep. 1995',  leeftijd: 29, geboorteplaats: 'Potchefstroom, Z-A',  lengte: '1.76 m', debuut: '2020, Qatar',     wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',        omschrijving: 'Brad Binder is een van de meest consistente rijders in het veld en vertegenwoordigt Zuid-Afrika in MotoGP.' },
  quartararo:     { geboortedatum: '20 apr. 1999',  leeftijd: 26, geboorteplaats: 'Nice, Frankrijk',      lengte: '1.69 m', debuut: '2019, Qatar',     wereldtitels: 1, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',     omschrijving: 'Fabio Quartararo was wereldkampioen in 2021 en probeert in 2026 Yamaha terug naar de top te brengen.' },
  rins:           { geboortedatum: '8 dec. 1995',   leeftijd: 29, geboorteplaats: 'Barcelona, Spanje',    lengte: '1.75 m', debuut: '2017, Qatar',     wereldtitels: 0, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',     omschrijving: 'Alex Rins is een ervaren rijder die in 2026 zijn kracht bundelt met Yamaha.' },
  morbidelli:     { geboortedatum: '4 dec. 1994',   leeftijd: 30, geboorteplaats: 'Rome, Italië',         lengte: '1.75 m', debuut: '2018, Qatar',     wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',     omschrijving: 'Franco Morbidelli rijdt in 2026 voor het VR46 team van zijn mentor Valentino Rossi.' },
  digiannantonio: { geboortedatum: '10 okt. 1998',  leeftijd: 26, geboorteplaats: 'Rome, Italië',         lengte: '1.72 m', debuut: '2022, Qatar',     wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',     omschrijving: 'Fabio Di Giannantonio maakt indruk in MotoGP en wil in 2026 zijn eerste overwinning behalen.' },
  aldeguer:       { geboortedatum: '19 jan. 2003',  leeftijd: 22, geboorteplaats: 'Murcia, Spanje',       lengte: '1.76 m', debuut: '2025, Qatar',     wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',     omschrijving: 'Fermin Aldeguer is een van de meest veelbelovende rijders en maakt zijn volledig debuut in 2026.' },
  amarquez:       { geboortedatum: '23 apr. 1996',  leeftijd: 29, geboorteplaats: 'Cervera, Spanje',      lengte: '1.68 m', debuut: '2020, Qatar',     wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',     omschrijving: 'Alex Márquez rijdt samen met zijn broer Marc bij Gresini Racing op een Ducati.' },
  rfernandez:     { geboortedatum: '22 nov. 2000',  leeftijd: 24, geboorteplaats: 'Murcia, Spanje',       lengte: '1.73 m', debuut: '2022, Qatar',     wereldtitels: 0, bikeModel: 'RS-GP26',          motor: 'Aprilia V4',    omschrijving: 'Raul Fernández liet indrukwekkende prestaties zien bij Trackhouse en rijdt in 2026 op een Aprilia.' },
  ogura:          { geboortedatum: '4 okt. 2001',   leeftijd: 23, geboorteplaats: 'Aichi, Japan',         lengte: '1.68 m', debuut: '2024, Japan',     wereldtitels: 0, bikeModel: 'RS-GP26',          motor: 'Aprilia V4',    omschrijving: 'Ai Ogura maakte indruk in Moto2 en bevestigt zijn klasse in 2026 bij Trackhouse Racing.' },
  vinales:        { geboortedatum: '12 jan. 1995',  leeftijd: 30, geboorteplaats: 'Figueres, Spanje',     lengte: '1.71 m', debuut: '2015, Qatar',     wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',        omschrijving: 'Maverick Viñales is een voormalige race-winnaar die in 2026 overstapt naar KTM Tech3.' },
  bastianini:     { geboortedatum: '30 dec. 1997',  leeftijd: 27, geboorteplaats: 'Rimini, Italië',       lengte: '1.82 m', debuut: '2021, Qatar',     wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',        omschrijving: 'Enea Bastianini rijdt in 2026 voor KTM Tech3 en wil zijn snelheid omzetten in consistente resultaten.' },
  miller:         { geboortedatum: '18 jan. 1995',  leeftijd: 30, geboorteplaats: 'Townsville, Australië',lengte: '1.73 m', debuut: '2015, Qatar',     wereldtitels: 0, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',     omschrijving: 'Jack Miller is een populaire rijder die in 2026 de Pramac Yamaha op de kaart wil zetten.' },
  razgatlioglu:   { geboortedatum: '16 okt. 1996',  leeftijd: 27, geboorteplaats: 'Alanya, Turkije',      lengte: '1.75 m', debuut: '2026, Qatar',     wereldtitels: 1, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',     omschrijving: 'Toprak Razgatlioğlu is WorldSBK-kampioen en maakt in 2026 zijn MotoGP-debuut bij Prima Pramac Yamaha.' },
  zarco:          { geboortedatum: '16 jul. 1990',  leeftijd: 35, geboorteplaats: 'Cannes, Frankrijk',    lengte: '1.74 m', debuut: '2017, Qatar',     wereldtitels: 0, bikeModel: 'RC213V',           motor: 'Honda V4',
    omschrijving: 'Johann Zarco is een ervaren veteraan die in 2026 Honda helpt terug aan de top te komen.',
    overzichtTekst: `Kleurstelling:\nDe motor van Zarco is voorzien van de iconische rode, witte en groene Castrol-kleuren, in combinatie met zwarte en blauwe accenten.\n\nSpecificaties:\nHet is een 1000cc V4 viertaktmotor met een vermogen van ruim 240 pk, wat zorgt voor topsnelheden van meer dan 360 km/u.\n\nOntwikkelingsstatus:\nDit is het laatste seizoen dat de RC213V (die sinds 2012 meedoet) in deze vorm wordt gebruikt, aangezien de sport in 2027 overstapt op 850cc. Omdat Honda zich al volop richt op de nieuwe 850cc-motor voor 2027, heeft HRC besloten de ontwikkeling van de huidige RC213V te staken.\n\nZarco's ervaring:\nZarco testte de nieuwste specificaties (waaronder een verbeterd chassis en aerodynamica) die de motor meer grip gaven.`,
    motorTekst: `HONDA RC213V (2026) — TECHNISCHE SPECIFICATIES\n\nMOTOR & PRESTATIES\nEngine Type        : Vloeistofgekoeld, viertakt, DOHC 4-kleppen, 90° V-4\nCilinderinhoud     : 1.000 cc\nMaximaal vermogen  : Meer dan 300 pk (>180 kW)\nTopsnelheid        : > 360 km/u\nBrandstofcapaciteit: 22 liter\n\nCHASSIS & AFMETINGEN\nFrame              : Aluminium dubbelbuis (Twin-tube)\nTotale lengte      : 2.052 mm\nTotale breedte     : 645 mm\nGewicht            : 157 kg (FIM-limiet)\n\nOPHANGING\nVoorvering         : Öhlins telescopische upside-down voorvork\nAchtervering       : Öhlins schokdemper met Honda Pro-Link\nWielen             : 17-inch magnesium (Michelin MotoGP-spec)\n\nREMSYSTEEM\nVoorremmen         : Dubbele Brembo carbon remschijven\nAchterrem          : Enkele stalen Brembo remschijf\n\nELEKTRONICA\nECU                : Magneti Marelli (Unified MotoGP)\nUitlaat            : SC-Project titanium 4-in-2`,
  },
  moreira:        { geboortedatum: '9 apr. 2003',   leeftijd: 22, geboorteplaats: 'São Paulo, Brazilië',  lengte: '1.70 m', debuut: '2025, Qatar',     wereldtitels: 0, bikeModel: 'RC213V',           motor: 'Honda V4',      omschrijving: 'Diogo Moreira is een Braziliaans talent dat zijn kans grijpt bij LCR Honda in 2026.' },
  marini:         { geboortedatum: '10 aug. 1996',  leeftijd: 28, geboorteplaats: 'Urbino, Italië',       lengte: '1.76 m', debuut: '2021, Qatar',     wereldtitels: 0, bikeModel: 'RC213V',           motor: 'Honda V4',      omschrijving: 'Luca Marini is de halfbroer van Valentino Rossi en rijdt in 2026 voor Honda HRC Castrol.' },
  mir:            { geboortedatum: '1 sep. 1997',   leeftijd: 27, geboorteplaats: 'Palma, Spanje',        lengte: '1.74 m', debuut: '2019, Qatar',     wereldtitels: 1, bikeModel: 'RC213V',           motor: 'Honda V4',      omschrijving: 'Joan Mir is wereldkampioen van 2020 en werkt in 2026 hard om Honda terug naar de top te brengen.' },
}



// ─── Klasse kleuren ───────────────────────────────────────────────────────────
const KLASSE_CONFIG = {
  MotoGP: { kleur: '#f97316', label: 'MotoGP',  sub: 'Koningsklasse' },
  Moto2:  { kleur: '#3b82f6', label: 'Moto2',   sub: 'Intermediaire klasse' },
  Moto3:  { kleur: '#22c55e', label: 'Moto3',   sub: 'Lichtste klasse' },
}

// ─── Merk kleuren ─────────────────────────────────────────────────────────────
const MERK_KLEUREN: Record<string, string> = {
  Ducati:     '#cc0000',
  Aprilia:    '#1a1aff',
  KTM:        '#ff6600',
  Yamaha:     '#0033cc',
  Honda:      '#cc0000',
  Kalex:      '#3b82f6',
  Boscoscuro: '#8b5cf6',
  Forward:    '#f59e0b',
}

// ─── MOTOGP GRID ─────────────────────────────────────────────────────────────
const MOTOGP_GRID = [
  { id: 'bagnaia',        voornaam: 'Francesco', naam: 'BAGNAIA',         landCode: 'it', nummer: 63, merk: 'Ducati',   team: 'Ducati Lenovo Team'           },
  { id: 'mmarquez',       voornaam: 'Marc',      naam: 'MÁRQUEZ',         landCode: 'es', nummer: 93, merk: 'Ducati',   team: 'Ducati Lenovo Team'           },
  { id: 'martin',         voornaam: 'Jorge',     naam: 'MARTÍN',          landCode: 'es', nummer: 89, merk: 'Aprilia',  team: 'Aprilia Racing'               },
  { id: 'bezzecchi',      voornaam: 'Marco',     naam: 'BEZZECCHI',       landCode: 'it', nummer: 72, merk: 'Aprilia',  team: 'Aprilia Racing'               },
  { id: 'acosta',         voornaam: 'Pedro',     naam: 'ACOSTA',          landCode: 'es', nummer: 37, merk: 'KTM',      team: 'Red Bull KTM Factory Racing'  },
  { id: 'binder',         voornaam: 'Brad',      naam: 'BINDER',          landCode: 'za', nummer: 33, merk: 'KTM',      team: 'Red Bull KTM Factory Racing'  },
  { id: 'quartararo',     voornaam: 'Fabio',     naam: 'QUARTARARO',      landCode: 'fr', nummer: 20, merk: 'Yamaha',   team: 'Monster Energy Yamaha'        },
  { id: 'rins',           voornaam: 'Alex',      naam: 'RINS',            landCode: 'es', nummer: 42, merk: 'Yamaha',   team: 'Monster Energy Yamaha'        },
  { id: 'morbidelli',     voornaam: 'Franco',    naam: 'MORBIDELLI',      landCode: 'it', nummer: 21, merk: 'Ducati',   team: 'Pertamina VR46 Racing Team'   },
  { id: 'digiannantonio', voornaam: 'Fabio',     naam: 'DI GIANNANTONIO', landCode: 'it', nummer: 49, merk: 'Ducati',   team: 'Pertamina VR46 Racing Team'   },
  { id: 'aldeguer',       voornaam: 'Fermin',    naam: 'ALDEGUER',        landCode: 'es', nummer: 54, merk: 'Ducati',   team: 'Gresini Racing'               },
  { id: 'amarquez',       voornaam: 'Alex',      naam: 'MÁRQUEZ',         landCode: 'es', nummer: 73, merk: 'Ducati',   team: 'Gresini Racing'               },
  { id: 'rfernanez',      voornaam: 'Raul',      naam: 'FERNÁNDEZ',       landCode: 'es', nummer: 25, merk: 'Aprilia',  team: 'Trackhouse Racing'            },
  { id: 'ogura',          voornaam: 'Ai',        naam: 'OGURA',           landCode: 'jp', nummer: 79, merk: 'Aprilia',  team: 'Trackhouse Racing'            },
  { id: 'vinales',        voornaam: 'Maverick',  naam: 'VIÑALES',         landCode: 'es', nummer: 12, merk: 'KTM',      team: 'Red Bull KTM Tech3'           },
  { id: 'bastianini',     voornaam: 'Enea',      naam: 'BASTIANINI',      landCode: 'it', nummer: 23, merk: 'KTM',      team: 'Red Bull KTM Tech3'           },
  { id: 'miller',         voornaam: 'Jack',      naam: 'MILLER',          landCode: 'au', nummer: 43, merk: 'Yamaha',   team: 'Prima Pramac Yamaha'          },
  { id: 'razgatlioglu',   voornaam: 'Toprak',    naam: 'RAZGATLIOĞLU',    landCode: 'tr', nummer: 7,  merk: 'Yamaha',   team: 'Prima Pramac Yamaha'          },
  { id: 'zarco',          voornaam: 'Johann',    naam: 'ZARCO',           landCode: 'fr', nummer: 5,  merk: 'Honda',    team: 'LCR Honda'                    },
  { id: 'moreira',        voornaam: 'Diogo',     naam: 'MOREIRA',         landCode: 'br', nummer: 11, merk: 'Honda',    team: 'LCR Honda'                    },
  { id: 'marini',         voornaam: 'Luca',      naam: 'MARINI',          landCode: 'it', nummer: 10, merk: 'Honda',    team: 'Honda HRC Castrol'            },
  { id: 'mir',            voornaam: 'Joan',      naam: 'MIR',             landCode: 'es', nummer: 36, merk: 'Honda',    team: 'Honda HRC Castrol'            },
]

// ─── MOTO2 GRID ───────────────────────────────────────────────────────────────
const MOTO2_GRID = [
  { id: 'garcia',      voornaam: 'Sergio',   naam: 'GARCIA',      landCode: 'es', nummer: 3,  merk: 'Boscoscuro', team: 'MSI Racing Team'              },
  { id: 'alonso',      voornaam: 'David',    naam: 'ALONSO',      landCode: 'co', nummer: 80, merk: 'Kalex',      team: 'Aspar Team'                   },
  { id: 'holgado',     voornaam: 'Daniel',   naam: 'HOLGADO',     landCode: 'es', nummer: 96, merk: 'Kalex',      team: 'Aspar Team'                   },
  { id: 'guevara',     voornaam: 'Izan',     naam: 'GUEVARA',     landCode: 'es', nummer: 28, merk: 'Kalex',      team: 'Aspar Team'                   },
  { id: 'baltus',      voornaam: 'Barry',    naam: 'BALTUS',      landCode: 'be', nummer: 7,  merk: 'Kalex',      team: 'Fantic Racing'                },
  { id: 'arbolino',    voornaam: 'Tony',     naam: 'ARBOLINO',    landCode: 'it', nummer: 14, merk: 'Kalex',      team: 'Fantic Racing'                },
  { id: 'canet',       voornaam: 'Aron',     naam: 'CANET',       landCode: 'es', nummer: 44, merk: 'Kalex',      team: 'Fantic Racing'                },
  { id: 'veijer',      voornaam: 'Collin',   naam: 'VEIJER',      landCode: 'nl', nummer: 95, merk: 'Kalex',      team: 'Red Bull KTM Ajo'             },
  { id: 'rueda',       voornaam: 'Jose A.',  naam: 'RUEDA',       landCode: 'es', nummer: 98, merk: 'Kalex',      team: 'Red Bull KTM Ajo'             },
  { id: 'roberts',     voornaam: 'Joe',      naam: 'ROBERTS',     landCode: 'us', nummer: 16, merk: 'Kalex',      team: 'American Racing Team'         },
  { id: 'gonzalez',    voornaam: 'Manuel',   naam: 'GONZALEZ',    landCode: 'es', nummer: 18, merk: 'Kalex',      team: 'Intact GP'                    },
  { id: 'agius',       voornaam: 'Senna',    naam: 'AGIUS',       landCode: 'au', nummer: 81, merk: 'Kalex',      team: 'Intact GP'                    },
  { id: 'salac',       voornaam: 'Filip',    naam: 'SALAC',       landCode: 'cz', nummer: 12, merk: 'Boscoscuro', team: 'Marc VDS Racing'              },
  { id: 'oncu',        voornaam: 'Deniz',    naam: 'ÖNCÜ',        landCode: 'tr', nummer: 53, merk: 'Boscoscuro', team: 'Marc VDS Racing'              },
  { id: 'vietti',      voornaam: 'Celestino',naam: 'VIETTI',      landCode: 'it', nummer: 13, merk: 'Boscoscuro', team: 'Beta Tools SpeedRS Team'      },
  { id: 'lopezm2',     voornaam: 'Alonso',   naam: 'LOPEZ',       landCode: 'es', nummer: 21, merk: 'Boscoscuro', team: 'MSI Racing Team'              },
  { id: 'escrig',      voornaam: 'Alex',     naam: 'ESCRIG',      landCode: 'es', nummer: 11, merk: 'Forward',    team: 'KLINT Forward Factory Team'   },
  { id: 'ferrandez',   voornaam: 'Alberto',  naam: 'FERRANDEZ',   landCode: 'es', nummer: 54, merk: 'Forward',    team: 'Forward Factory Team'         },
  { id: 'munoz',       voornaam: 'Daniel',   naam: 'MUNOZ',       landCode: 'co', nummer: 17, merk: 'Kalex',      team: 'Preicanos Racing Team'        },
  { id: 'aji',         voornaam: 'Mario',    naam: 'AJI',         landCode: 'id', nummer: 64, merk: 'Kalex',      team: 'Idemitsu Honda Team Asia'     },
  { id: 'furusato',    voornaam: 'Taiyo',    naam: 'FURUSATO',    landCode: 'jp', nummer: 72, merk: 'Kalex',      team: 'Honda Team Asia'              },
  { id: 'sasaki',      voornaam: 'Ayumu',    naam: 'SASAKI',      landCode: 'jp', nummer: 71, merk: 'Kalex',      team: 'RW Racing GP'                 },
  { id: 'vandengoorbergh', voornaam: 'Zonta', naam: 'VAN DEN GOORBERGH', landCode: 'nl', nummer: 84, merk: 'Kalex', team: 'RW Racing GP'              },
  { id: 'huertas',     voornaam: 'Adrian',   naam: 'HUERTAS',     landCode: 'es', nummer: 99, merk: 'Kalex',      team: 'Italtrans Racing Team'        },
]

// ─── MOTO3 GRID ───────────────────────────────────────────────────────────────
const MOTO3_GRID = [
  { id: 'moodley',     voornaam: 'Ruche',    naam: 'MOODLEY',     landCode: 'za', nummer: 21, merk: 'KTM',   team: 'BOE Motorsports'           },
  { id: 'buchanan',    voornaam: 'Cormac',   naam: 'BUCHANAN',    landCode: 'nz', nummer: 14, merk: 'KTM',   team: 'BOE Motorsports'           },
  { id: 'rammerstorfer',voornaam: 'Leo',     naam: 'RAMMERSTORFER',landCode: 'at',nummer: 5,  merk: 'KTM',   team: 'CIP Green Power'           },
  { id: 'cruces',      voornaam: 'Adrian',   naam: 'CRUCES',      landCode: 'es', nummer: 11, merk: 'KTM',   team: 'CIP Green Power'           },
  { id: 'ogden',       voornaam: 'Scott',    naam: 'OGDEN',       landCode: 'gb', nummer: 19, merk: 'KTM',   team: 'CIP Green Power'           },
  { id: 'bertelle',    voornaam: 'Matteo',   naam: 'BERTELLE',    landCode: 'it', nummer: 18, merk: 'KTM',   team: 'LEVELUP-MTA'               },
  { id: 'ogorman',     voornaam: 'Casey',    naam: "O'GORMAN",    landCode: 'ie', nummer: 67, merk: 'KTM',   team: 'LEVELUP-MTA'               },
  { id: 'quiles',      voornaam: 'Maximo',   naam: 'QUILES',      landCode: 'es', nummer: 28, merk: 'KTM',   team: 'Aspar Team'                },
  { id: 'rios',        voornaam: 'Jesus',    naam: 'RIOS',        landCode: 'es', nummer: 54, merk: 'KTM',   team: 'Aspar Team'                },
  { id: 'esteban',     voornaam: 'Joel',     naam: 'ESTEBAN',     landCode: 'es', nummer: 78, merk: 'KTM',   team: 'Aspar Team'                },
  { id: 'uriarte',     voornaam: 'Brian',    naam: 'URIARTE',     landCode: 'es', nummer: 51, merk: 'KTM',   team: 'Red Bull KTM Ajo'          },
  { id: 'carpe',       voornaam: 'Alvaro',   naam: 'CARPE',       landCode: 'es', nummer: 83, merk: 'KTM',   team: 'Red Bull KTM Ajo'          },
  { id: 'perrone',     voornaam: 'Valentin', naam: 'PERRONE',     landCode: 'ar', nummer: 73, merk: 'KTM',   team: 'Red Bull KTM Tech3'        },
  { id: 'munozm3',     voornaam: 'David',    naam: 'MUNOZ',       landCode: 'co', nummer: 64, merk: 'KTM',   team: 'Intact GP'                 },
  { id: 'oshea',       voornaam: 'Eddie',    naam: "O'SHEA",      landCode: 'gb', nummer: 8,  merk: 'Honda', team: 'MLav Racing'               },
  { id: 'salmela',     voornaam: 'Rico',     naam: 'SALMELA',     landCode: 'fi', nummer: 27, merk: 'Honda', team: 'MLav Racing'               },
  { id: 'kelso',       voornaam: 'Joel',     naam: 'KELSO',       landCode: 'au', nummer: 66, merk: 'Honda', team: 'MLav Racing'               },
  { id: 'pratama',     voornaam: 'Veda',     naam: 'PRATAMA',     landCode: 'id', nummer: 9,  merk: 'Honda', team: 'Honda Team Asia'           },
  { id: 'carraro',     voornaam: 'Nicola',   naam: 'CARRARO',     landCode: 'it', nummer: 10, merk: 'Honda', team: 'Rivacold Snipers Team'     },
  { id: 'morelli',     voornaam: 'Marco',    naam: 'MORELLI',     landCode: 'it', nummer: 97, merk: 'Honda', team: 'Snipers Team'              },
  { id: 'almansa',     voornaam: 'David',    naam: 'ALMANSA',     landCode: 'es', nummer: 22, merk: 'Honda', team: 'Leopard Racing'            },
  { id: 'afernandez',  voornaam: 'Adrian',   naam: 'FERNÁNDEZ',   landCode: 'es', nummer: 31, merk: 'Honda', team: 'Leopard Racing'            },
  { id: 'pini',        voornaam: 'Guido',    naam: 'PINI',        landCode: 'it', nummer: 94, merk: 'Honda', team: 'Leopard Racing'            },
  { id: 'danish',      voornaam: 'Hakim',    naam: 'DANISH',      landCode: 'my', nummer: 13, merk: 'Honda', team: 'SIC58 Squadra Corse'       },
  { id: 'yamanaka',    voornaam: 'Ryusei',   naam: 'YAMANAKA',    landCode: 'jp', nummer: 6,  merk: 'KTM',   team: 'MT Helmets MSI'            },
]

type Rijder = { id: string; voornaam: string; naam: string; landCode: string; nummer: number; merk: string; team: string }
type Klasse = 'MotoGP' | 'Moto2' | 'Moto3'

// ─── Helpers ──────────────────────────────────────────────────────────────────
// ─── Team → bestandsnaam mapping ─────────────────────────────────────────────
// MotoGP bikes: public/motogp/motogp/bikes/{team_id}.webp
// Moto2  bikes: public/motogp/moto2/bikes/{team_id}.webp
// Moto3  bikes: public/motogp/moto3/bikes/{team_id}.webp
const TEAM_BIKE_ID: Record<string, string> = {
  // MotoGP
  'Ducati Lenovo Team':          'ducati_lenovo',
  'Gresini Racing':              'gresini',
  'Pertamina VR46 Racing Team':  'vr46',
  'Aprilia Racing':              'aprilia_racing',
  'Trackhouse Racing':           'trackhouse',
  'Red Bull KTM Factory Racing': 'ktm_factory',
  'Red Bull KTM Tech3':          'ktm_tech3',
  'Monster Energy Yamaha':       'yamaha_monster',
  'Prima Pramac Yamaha':         'pramac_yamaha',
  'LCR Honda':                   'lcr_honda',
  'Honda HRC Castrol':           'honda_hrc',
  // Moto2
  'MSI Racing Team':             'boscoscuro',
  'Aspar Team':                  'kalex_aspar',
  'Fantic Racing':               'kalex_fantic',
  'Red Bull KTM Ajo':            'kalex_ajo',
  'American Racing Team':        'kalex_american',
  'Intact GP':                   'kalex_intact',
  'Marc VDS Racing':             'boscoscuro_marcvds',
  'Beta Tools SpeedRS Team':     'boscoscuro_speedrs',
  'KLINT Forward Factory Team':  'forward',
  'Forward Factory Team':        'forward',
  'Preicanos Racing Team':       'kalex_preicanos',
  'Idemitsu Honda Team Asia':    'kalex_asia',
  'Honda Team Asia':             'kalex_honda_asia',
  'RW Racing GP':                'kalex_rw',
  'Italtrans Racing Team':       'kalex_italtrans',
  // Moto3
  'BOE Motorsports':             'ktm_boe',
  'CIP Green Power':             'ktm_cip',
  'LEVELUP-MTA':                 'ktm_mta',
  'Aspar Team Moto3':            'ktm_aspar_m3',
  'Red Bull KTM Ajo Moto3':      'ktm_ajo_m3',
  'Red Bull KTM Tech3 Moto3':    'ktm_tech3_m3',
  'Intact GP Moto3':             'ktm_intact_m3',
  'MLav Racing':                 'honda_mlav',
  'Honda Team Asia Moto3':       'honda_asia_m3',
  'Rivacold Snipers Team':       'honda_snipers',
  'Snipers Team':                'honda_snipers',
  'Leopard Racing':              'honda_leopard',
  'SIC58 Squadra Corse':         'honda_sic58',
  'MT Helmets MSI':              'ktm_msi',
}

function teamBikeId(team: string, klasse: Klasse): string {
  if (TEAM_BIKE_ID[team]) return TEAM_BIKE_ID[team]
  // Fallback: merk lowercase
  return team.split(' ')[0].toLowerCase()
}

function BikeImg({ team, merk, klasse, style }: { team: string; merk: string; klasse: Klasse; style?: React.CSSProperties }) {
  const id  = teamBikeId(team, klasse)
  const pad = `/motogp/${klasse.toLowerCase()}/bikes/${id}`
  return (
    <img src={`${pad}.webp`} alt={team} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `${pad}.svg`
        else if (img.src.includes('.svg')) img.src = `${pad}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

function RiderImg({ rijder, klasse, style }: { rijder: Rijder; klasse: Klasse; style?: React.CSSProperties }) {
  const pad = `/motogp/${klasse.toLowerCase()}/riders/${rijder.id}`
  return (
    <img src={`${pad}.webp`} alt={rijder.naam} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `${pad}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

// ─── Popup ────────────────────────────────────────────────────────────────────
function RijderPopup({ rijder, klasse, onSluit }: { rijder: Rijder; klasse: Klasse; onSluit: () => void }) {
  const klasseKleur = KLASSE_CONFIG[klasse].kleur
  const merkKleur   = MERK_KLEUREN[rijder.merk] ?? klasseKleur
  const info        = RIJDER_INFO[rijder.id]
  const [tab, setTab] = useState<'overzicht' | 'motor' | 'stats'>('overzicht')

  const tabs = [
    { id: 'overzicht' as const, label: 'Overzicht'    },
    { id: 'motor'     as const, label: 'Motor'         },
    { id: 'stats'     as const, label: 'Statistieken'  },
  ]

  // Motor tekst per rijder uit RIJDER_INFO
  const motorTekst = info?.motorTekst ?? info?.omschrijving ?? ''
  const overzichtTekst = info?.overzichtTekst ?? info?.omschrijving ?? ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onSluit}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{ background: '#0f0f0f', border: `1px solid ${klasseKleur}50`, maxHeight: '90vh', minHeight: 520 }}
        onClick={e => e.stopPropagation()}>

        {/* ── LINKER PANEEL — scrollbaar ── */}
        <div className="relative flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ width: 240, background: `linear-gradient(180deg, ${klasseKleur}22 0%, #0a0a0a 60%)`, maxHeight: '90vh' }}>

          {/* Team naam */}
          <div className="px-5 pt-4 pb-1 flex-shrink-0">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{ color: klasseKleur }}>
              {rijder.team}
            </span>
          </div>

          {/* Naam + vlag + klasse */}
          <div className="px-5 pb-2 flex-shrink-0">
            <div className="font-ui text-base text-white/70">{rijder.voornaam}</div>
            <div className="font-head font-black text-3xl uppercase text-white leading-tight">{rijder.naam}</div>
            <div className="flex items-center gap-2 mt-1">
              <img src={`/motogp/flags/${rijder.landCode}.svg`} alt={rijder.landCode}
                className="rounded-sm" style={{ width: 24, height: 16, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <span className="font-ui text-xs text-white/50 uppercase">{rijder.landCode}</span>
            </div>
            <div className="mt-2">
              <span className="font-ui text-[10px] font-bold uppercase px-2 py-1 rounded"
                style={{ background: klasseKleur + '22', color: klasseKleur, border: `1px solid ${klasseKleur}44` }}>
                {klasse}
              </span>
            </div>
          </div>

          {/* Rijder foto */}
          <div className="relative flex-shrink-0 mx-3 rounded-xl overflow-hidden" style={{ height: 260 }}>
            <RiderImg rijder={rijder} klasse={klasse}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            <div className="absolute bottom-0 left-0 right-0 h-20"
              style={{ background: 'linear-gradient(transparent, #0a0a0a)' }} />
            <div className="absolute bottom-2 right-3 font-head font-black text-5xl leading-none"
              style={{ color: klasseKleur, opacity: 0.4 }}>
              {rijder.nummer}
            </div>
          </div>

          {/* Persoonlijke info */}
          <div className="px-4 py-4 space-y-3 flex-shrink-0">
            {info ? (
              [
                { icon: '📅', label: 'Geboortedatum', val: `${info.geboortedatum} (${info.leeftijd})` },
                { icon: '📍', label: 'Geboorteplaats', val: info.geboorteplaats },
                { icon: '📏', label: 'Lengte',          val: info.lengte },
                { icon: '🏁', label: 'Debuut MotoGP',   val: info.debuut },
                { icon: '🏆', label: 'Wereldtitels',    val: String(info.wereldtitels) },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                    <div className="font-ui text-xs text-white/80">{val}</div>
                  </div>
                </div>
              ))
            ) : (
              [
                { icon: '#️⃣', label: 'Racenummer', val: `#${rijder.nummer}` },
                { icon: '🏭', label: 'Merk',        val: rijder.merk },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                    <div className="font-ui text-xs text-white/80">{val}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── RECHTER PANEEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tabs + sluit */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0"
            style={{ borderBottom: `1px solid ${klasseKleur}25` }}>
            <div className="flex gap-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
                  style={tab === t.id
                    ? { color: klasseKleur, borderBottom: `2px solid ${klasseKleur}` }
                    : { color: 'rgba(255,255,255,0.35)', borderBottom: '2px solid transparent' }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={onSluit}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm">
              ✕
            </button>
          </div>

          {/* Tab inhoud — scrollbaar */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* ── OVERZICHT ── */}
            {tab === 'overzicht' && (
              <div className="space-y-4">
                {/* Info blokjes */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Team',          val: rijder.team },
                    { label: 'Racenummer',    val: `#${rijder.nummer}` },
                    { label: 'Nationaliteit', val: rijder.landCode.toUpperCase() },
                  ].map(({ label, val }) => (
                    <div key={label} className="rounded-xl p-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">{label}</div>
                      <div className="font-ui text-sm font-semibold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Motor preview — voor + zij aanzicht */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: klasseKleur }} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">
                      {info?.bikeModel ?? rijder.merk} · 2026 Motor
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden flex items-center justify-center gap-2 p-4"
                    style={{ background: `linear-gradient(135deg, ${merkKleur}12, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}25`, minHeight: 200 }}>
                    {/* Voor-aanzicht */}
                    <div style={{ width: '38%', height: 180 }}>
                      <BikeImg team={rijder.team} merk={rijder.merk} klasse={klasse}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${merkKleur}50)` }} />
                    </div>
                    {/* Zij-aanzicht */}
                    <div style={{ width: '58%', height: 180 }}>
                      <BikeImg team={rijder.team} merk={rijder.merk} klasse={klasse}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${merkKleur}50)` }} />
                    </div>
                  </div>
                </div>

                {/* Info tekst — scrollbaar blok */}
                {overzichtTekst && (
                  <div className="rounded-xl p-4 overflow-y-auto"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', maxHeight: 160 }}>
                    <p className="font-ui text-sm text-white/60 leading-relaxed whitespace-pre-line">{overzichtTekst}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── MOTOR TAB ── */}
            {tab === 'motor' && (
              <div className="space-y-4">
                <div>
                  <div className="font-head font-black text-2xl text-white mb-0.5">{info?.bikeModel ?? rijder.merk}</div>
                  <div className="font-ui text-xs text-white/40 uppercase tracking-wider">2026 · {klasse}</div>
                </div>

                {/* Motor groot liggend */}
                <div className="rounded-2xl flex items-center justify-center p-5"
                  style={{ background: `linear-gradient(135deg, ${merkKleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}30`, height: 210 }}>
                  <BikeImg team={rijder.team} merk={rijder.merk} klasse={klasse}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 8px 24px ${merkKleur}60)` }} />
                </div>

                {/* Specs 2x2 */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '⚙️', label: 'Motor',   val: info?.motor ?? rijder.merk },
                    { icon: '🏗️', label: 'Klasse',  val: klasse },
                    { icon: '🔄', label: 'Banden',  val: 'Michelin' },
                    { icon: '🏁', label: 'Team',    val: rijder.team },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="rounded-xl p-3 flex items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                        <div className="font-ui text-sm font-semibold text-white truncate">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Motor tekst scrollbaar */}
                {motorTekst && (
                  <div className="rounded-xl p-4 overflow-y-auto"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', maxHeight: 200 }}>
                    <p className="font-ui text-sm text-white/60 leading-relaxed whitespace-pre-line">{motorTekst}</p>
                  </div>
                )}
              </div>
            )}

            {/* ── STATISTIEKEN TAB ── */}
            {tab === 'stats' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 rounded-full" style={{ background: klasseKleur }} />
                  <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Seizoenstatistieken 2026</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: '🏁', label: 'Races',          val: '—' },
                    { icon: '🏆', label: 'Overwinningen',  val: '—' },
                    { icon: '🥇', label: 'Podiums',        val: '—' },
                    { icon: '⚡', label: 'Poles',          val: '—' },
                    { icon: '⏱️', label: 'Snelste ronde',  val: '—' },
                    { icon: '📊', label: 'Punten',         val: '—' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="rounded-xl p-4 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="font-head font-black text-2xl" style={{ color: klasseKleur }}>{val}</div>
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mt-1">{label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-4"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="font-ui text-xs text-white/40 text-center">
                    Live statistieken worden beschikbaar via het Command Center zodra het seizoen loopt.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

