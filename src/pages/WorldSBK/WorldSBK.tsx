// ─── WorldSBK 2026 — SBK & SSP grid pagina ───────────────────────────────────
//
// MAPPENSTRUCTUUR AFBEELDINGEN:
//
// public/worldsbk/
//   sbk/
//     riders/    ← voornaam_achternaam.webp
//     bikes/     ← voornaam_achternaam_bike_side.webp
//                   voornaam_achternaam_bike_front.webp
//                   voornaam_achternaam_bike_45.webp
//     helmets/   ← voornaam_achternaam_helmet.webp
//     flags/     ← voornaam_achternaam_vlag.svg
//   ssp/
//     riders/    ← zelfde conventie
//     bikes/
//     helmets/
//     flags/
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

const SBK_ROOD  = '#e4002b'
const SSP_BLAUW = '#0057b8'

// ─── Klasse config ────────────────────────────────────────────────────────────
const KLASSE_CONFIG = {
  SBK: { kleur: SBK_ROOD,  label: 'WorldSBK', sub: 'Superbike',   banden: 'Pirelli' },
  SSP: { kleur: SSP_BLAUW, label: 'WorldSSP', sub: 'Supersport',  banden: 'Pirelli' },
}

// ─── Merk kleuren ─────────────────────────────────────────────────────────────
const MERK_KLEUREN: Record<string, string> = {
  Ducati:   '#cc0000',
  BMW:      '#1c69d4',
  Yamaha:   '#0033cc',
  Kawasaki: '#2d8a00',
  Honda:    '#cc0000',
  Aprilia:  '#1a1aff',
  Triumph:  '#003399',
  MV:       '#c41230',
  QJMOTOR:  '#d4a017',
}

// ─── Rijder info ──────────────────────────────────────────────────────────────
interface RijderInfo {
  geboortedatum: string; leeftijd: number; geboorteplaats: string
  lengte: string; debuut: string; wereldtitels: number
  bikeModel: string; motor: string; omschrijving: string
}

const RIJDER_INFO: Record<string, RijderInfo> = {
  // SBK
  nicolo_bulega:         { geboortedatum: '12 mei 2000',   leeftijd: 25, geboorteplaats: 'Reggio Emilia, Italië', lengte: '1.74 m', debuut: '2024, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Nicolò Bulega is de opkomende ster van WorldSBK en rijdt in 2026 voor het fabrieksteam van Ducati.' },
  iker_lecuona:          { geboortedatum: '6 jan. 2000',   leeftijd: 25, geboorteplaats: 'Valencia, Spanje',      lengte: '1.77 m', debuut: '2023, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Iker Lecuona maakte zijn naam in MotoGP en rijdt nu voor het Aruba Ducati fabrieksteam.' },
  danilo_petrucci:       { geboortedatum: '24 okt. 1990',  leeftijd: 34, geboorteplaats: 'Terni, Italië',         lengte: '1.85 m', debuut: '2021, Phillip Island', wereldtitels: 0, bikeModel: 'BMW M 1000 RR',   motor: 'BMW S1000RR',    omschrijving: 'Danilo Petrucci is een ervaren veteraan en rijdt in 2026 voor het ROKiT BMW fabrieksteam.' },
  miguel_oliveira:       { geboortedatum: '4 jan. 1995',   leeftijd: 30, geboorteplaats: 'Almada, Portugal',      lengte: '1.75 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'BMW M 1000 RR',   motor: 'BMW S1000RR',    omschrijving: 'Miguel Oliveira stapt over van MotoGP naar WorldSBK en rijdt in 2026 voor ROKiT BMW.' },
  andrea_locatelli:      { geboortedatum: '10 apr. 1996',  leeftijd: 28, geboorteplaats: 'Brescia, Italië',       lengte: '1.73 m', debuut: '2021, Phillip Island', wereldtitels: 1, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Andrea Locatelli is WorldSSP-kampioen van 2020 en rijdt in 2026 voor Pata Maxus Yamaha.' },
  xavi_vierge:           { geboortedatum: '6 feb. 1997',   leeftijd: 28, geboorteplaats: 'Barcelona, Spanje',     lengte: '1.73 m', debuut: '2022, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Xavi Vierge is een snel groeiende talent in WorldSBK en rijdt in 2026 voor Pata Maxus Yamaha.' },
  alvaro_bautista:       { geboortedatum: '21 nov. 1984',  leeftijd: 40, geboorteplaats: 'Talavera, Spanje',      lengte: '1.67 m', debuut: '2019, Phillip Island', wereldtitels: 2, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Álvaro Bautista is tweevoudig WorldSBK-kampioen en rijdt in 2026 voor Barni Spark Ducati.' },
  yari_montella:         { geboortedatum: '2 mei 2001',    leeftijd: 24, geboorteplaats: 'Caserta, Italië',       lengte: '1.70 m', debuut: '2025, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Yari Montella is een jong Italiaans talent dat zijn kans grijpt bij Barni Spark Ducati.' },
  alex_lowes:            { geboortedatum: '14 sep. 1990',  leeftijd: 34, geboorteplaats: 'Lincoln, Engeland',     lengte: '1.76 m', debuut: '2016, Phillip Island', wereldtitels: 0, bikeModel: 'Bimota KB998',     motor: 'Kawasaki I4',    omschrijving: 'Alex Lowes is een van de meest ervaren rijders in WorldSBK en rijdt in 2026 voor Bimota Kawasaki.' },
  axel_bassani:          { geboortedatum: '26 jan. 2000',  leeftijd: 25, geboorteplaats: 'Treviso, Italië',       lengte: '1.75 m', debuut: '2021, Phillip Island', wereldtitels: 0, bikeModel: 'Bimota KB998',     motor: 'Kawasaki I4',    omschrijving: 'Axel Bassani is een opkomend talent dat in 2026 voor het Bimota Kawasaki team rijdt.' },
  garrett_gerloff:       { geboortedatum: '31 jan. 1995',  leeftijd: 30, geboorteplaats: 'Texas, USA',            lengte: '1.78 m', debuut: '2020, Phillip Island', wereldtitels: 0, bikeModel: 'ZX-10RR',          motor: 'Kawasaki I4',    omschrijving: 'Garrett Gerloff is de Amerikaanse vertegenwoordiger in WorldSBK en rijdt voor het Kawasaki fabrieksteam.' },
  lorenzo_baldassarri:   { geboortedatum: '7 sep. 1996',   leeftijd: 28, geboorteplaats: 'Ancona, Italië',        lengte: '1.73 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Lorenzo Baldassarri is WorldSSP-kampioen en maakt in 2026 de stap naar WorldSBK bij GoEleven Ducati.' },
  somkiat_chantra:       { geboortedatum: '4 aug. 2000',   leeftijd: 24, geboorteplaats: 'Bangkok, Thailand',     lengte: '1.66 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'CBR1000RR-R',      motor: 'Honda V4',       omschrijving: 'Somkiat Chantra is een Thais talent dat in 2026 de overstap maakt naar WorldSBK met Honda HRC.' },
  jake_dixon:            { geboortedatum: '26 mrt. 1996',  leeftijd: 29, geboorteplaats: 'Lincoln, Engeland',     lengte: '1.81 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'CBR1000RR-R',      motor: 'Honda V4',       omschrijving: 'Jake Dixon is een Brits talent dat in 2026 zijn kans grijpt bij Honda HRC in WorldSBK.' },
  sam_lowes:             { geboortedatum: '14 sep. 1990',  leeftijd: 34, geboorteplaats: 'Lincoln, Engeland',     lengte: '1.76 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Sam Lowes, tweelingbroer van Alex, maakt in 2026 zijn WorldSBK-debuut bij ELF Marc VDS Racing.' },
  alberto_surra:         { geboortedatum: '21 feb. 1999',  leeftijd: 26, geboorteplaats: 'Bergamo, Italië',       lengte: '1.75 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Alberto Surra is een Italiaans talent dat in 2026 zijn WorldSBK-debuut maakt bij Motocorsa Racing.' },
  tarran_mackenzie:      { geboortedatum: '7 mrt. 1994',   leeftijd: 31, geboorteplaats: 'Perth, Schotland',      lengte: '1.78 m', debuut: '2023, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Tarran Mackenzie is een Brits BSB-kampioen die in 2026 rijdt voor MGM Optical Express Racing.' },
  thomas_bridewell:      { geboortedatum: '21 sep. 1989',  leeftijd: 35, geboorteplaats: 'Swindon, Engeland',     lengte: '1.80 m', debuut: '2025, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V4R',    motor: 'Ducati V4R',     omschrijving: 'Thomas Bridewell is een ervaren Britse rijder die in 2026 rijdt voor Superbike Advocates.' },
  remy_gardner:          { geboortedatum: '26 feb. 1993',  leeftijd: 32, geboorteplaats: 'Sydney, Australië',     lengte: '1.80 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Remy Gardner is Moto2-kampioen van 2021 en rijdt in 2026 voor het GYTR GRT Yamaha team in WorldSBK.' },
  stefano_manzi:         { geboortedatum: '11 aug. 1999',  leeftijd: 25, geboorteplaats: 'Rimini, Italië',        lengte: '1.76 m', debuut: '2026, Phillip Island', wereldtitels: 1, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Stefano Manzi is WorldSSP-kampioen van 2025 en maakt in 2026 de stap naar WorldSBK bij GYTR GRT Yamaha.' },
  bahattin_sofuoglu:     { geboortedatum: '15 mrt. 2003',  leeftijd: 22, geboorteplaats: 'Bursa, Turkije',        lengte: '1.72 m', debuut: '2025, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Bahattin Sofuoğlu is een Turks talent dat in 2026 rijdt voor Motoxracing Yamaha.' },
  mattia_rato:           { geboortedatum: '8 jul. 2002',   leeftijd: 23, geboorteplaats: 'Brescia, Italië',       lengte: '1.74 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R1',           motor: 'Yamaha I4',      omschrijving: 'Mattia Rato is een jong Italiaans talent dat in 2026 zijn WorldSBK-debuut maakt bij Motoxracing Yamaha.' },
  // SSP
  can_oncu:              { geboortedatum: '28 okt. 2004',  leeftijd: 21, geboorteplaats: 'Bursa, Turkije',        lengte: '1.72 m', debuut: '2022, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Can Öncü is een van de snelste rijders in WorldSSP en rijdt in 2026 voor het Pata Ten Kate Yamaha team.' },
  yuki_okamoto:          { geboortedatum: '2 mrt. 2002',   leeftijd: 23, geboorteplaats: 'Osaka, Japan',          lengte: '1.68 m', debuut: '2024, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Yuki Okamoto is een Japans talent dat in 2026 rijdt naast Can Öncü bij Pata Ten Kate Yamaha.' },
  valentin_debise:       { geboortedatum: '7 mei 1991',    leeftijd: 34, geboorteplaats: 'Lyon, Frankrijk',       lengte: '1.76 m', debuut: '2022, Phillip Island', wereldtitels: 0, bikeModel: 'ZXMOTO 820RR',      motor: 'Kawasaki I4',    omschrijving: 'Valentin Debise is een ervaren Franse veteraan die in 2026 rijdt voor het ZXMOTO Evan Bros team.' },
  federico_caricasulo:   { geboortedatum: '14 apr. 1997',  leeftijd: 28, geboorteplaats: 'Catania, Italië',       lengte: '1.72 m', debuut: '2019, Phillip Island', wereldtitels: 0, bikeModel: 'ZXMOTO 820RR',      motor: 'Kawasaki I4',    omschrijving: 'Federico Caricasulo is een ervaren Italiaan die in 2026 rijdt voor ZXMOTO Evan Bros.' },
  dominique_aegerter:    { geboortedatum: '8 jan. 1990',   leeftijd: 35, geboorteplaats: 'Rohrbach, Zwitserland', lengte: '1.75 m', debuut: '2020, Phillip Island', wereldtitels: 2, bikeModel: 'ZX-6R',            motor: 'Kawasaki I4',    omschrijving: 'Dominique Aegerter is tweevoudig WorldSSP-kampioen en keert in 2026 terug naar de klasse met Kawasaki.' },
  jeremy_alcoba:         { geboortedatum: '14 sep. 2001',  leeftijd: 24, geboorteplaats: 'Barcelona, Spanje',     lengte: '1.72 m', debuut: '2023, Phillip Island', wereldtitels: 0, bikeModel: 'ZX-6R',            motor: 'Kawasaki I4',    omschrijving: 'Jeremy Alcoba is een Spaans talent dat in 2026 rijdt voor het Kawasaki WorldSSP fabrieksteam.' },
  albert_arenas:         { geboortedatum: '24 jul. 1996',  leeftijd: 29, geboorteplaats: 'Alella, Spanje',        lengte: '1.73 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Albert Arenas is Moto3-kampioen van 2020 en maakt in 2026 zijn WorldSSP-debuut bij AS BLU CRU Yamaha.' },
  aldi_mahendra:         { geboortedatum: '15 aug. 2004',  leeftijd: 21, geboorteplaats: 'Solo, Indonesië',       lengte: '1.65 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Aldi Mahendra is een Indonesisch talent en WorldSSP300-kampioen die in 2026 debuteert bij AS BLU CRU.' },
  roberto_garcia:        { geboortedatum: '15 jun. 2005',  leeftijd: 20, geboorteplaats: 'Murcia, Spanje',        lengte: '1.71 m', debuut: '2025, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Roberto García is een jong Spaans talent dat indruk maakte in 2025 en in 2026 rijdt voor GMT94 Yamaha.' },
  lucas_mahias:          { geboortedatum: '26 jan. 1989',  leeftijd: 36, geboorteplaats: 'Dijon, Frankrijk',      lengte: '1.76 m', debuut: '2017, Phillip Island', wereldtitels: 1, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Lucas Mahias is WorldSSP-kampioen van 2017 en een veteraan die in 2026 rijdt voor GMT94 Yamaha.' },
  jaume_masia:           { geboortedatum: '5 mrt. 2001',   leeftijd: 24, geboorteplaats: 'Valencia, Spanje',      lengte: '1.69 m', debuut: '2026, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V2',      motor: 'Ducati V2',      omschrijving: 'Jaume Masiá is Moto3-winnaar en stapt in 2026 over naar WorldSSP met Orelac Racing.' },
  corentin_perolari:     { geboortedatum: '22 sep. 1999',  leeftijd: 26, geboorteplaats: 'Lyon, Frankrijk',       lengte: '1.74 m', debuut: '2024, Phillip Island', wereldtitels: 0, bikeModel: 'CBR600RR',         motor: 'Honda I4',       omschrijving: 'Corentin Perolari rijdt in 2026 voor Honda Racing WorldSSP en is een van de Honda-pioniers in de klasse.' },
  ana_carrasco:          { geboortedatum: '20 mrt. 1997',  leeftijd: 28, geboorteplaats: 'Murcia, Spanje',        lengte: '1.60 m', debuut: '2017, Phillip Island', wereldtitels: 1, bikeModel: 'CBR600RR',         motor: 'Honda I4',       omschrijving: 'Ana Carrasco is de eerste vrouwelijke wereldkampioen in de motorracerij (WorldSSP300, 2018) en rijdt in 2026 voor Honda.' },
  raffaele_de_rosa:      { geboortedatum: '22 aug. 1988',  leeftijd: 36, geboorteplaats: 'Napels, Italië',        lengte: '1.78 m', debuut: '2014, Phillip Island', wereldtitels: 0, bikeModel: 'QJMOTOR',          motor: 'QJMOTOR I4',     omschrijving: 'Raffaele De Rosa is een veteraan in het WorldSSP-peloton en rijdt in 2026 voor QJMOTOR Factory Racing.' },
  marcos_ramirez:        { geboortedatum: '11 nov. 1999',  leeftijd: 26, geboorteplaats: 'Madrid, Spanje',        lengte: '1.73 m', debuut: '2021, Phillip Island', wereldtitels: 0, bikeModel: 'QJMOTOR',          motor: 'QJMOTOR I4',     omschrijving: 'Marcos Ramírez is een Spaans talent dat in 2026 rijdt voor QJMOTOR Factory Racing.' },
  philipp_oettl:         { geboortedatum: '6 aug. 1996',   leeftijd: 29, geboorteplaats: 'München, Duitsland',    lengte: '1.80 m', debuut: '2020, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V2',      motor: 'Ducati V2',      omschrijving: 'Philipp Oettl is een consistent presterende Duitser die in 2026 rijdt voor Feel Racing WorldSSP op Ducati.' },
  mattia_casadei:        { geboortedatum: '23 apr. 2000',  leeftijd: 25, geboorteplaats: 'Rimini, Italië',        lengte: '1.73 m', debuut: '2024, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V2',      motor: 'Ducati V2',      omschrijving: 'Mattia Casadei is MotoE-kampioen van 2023 en rijdt in 2026 voor D34G WorldSSP Racing op Ducati.' },
  simon_jespersen:       { geboortedatum: '14 mrt. 1999',  leeftijd: 26, geboorteplaats: 'Aarhus, Denemarken',    lengte: '1.79 m', debuut: '2024, Phillip Island', wereldtitels: 0, bikeModel: 'Panigale V2',      motor: 'Ducati V2',      omschrijving: 'Simon Jespersen is een Deens talent dat in 2026 rijdt voor EAB Racing op Ducati.' },
  borja_jimenez:         { geboortedatum: '19 aug. 1999',  leeftijd: 26, geboorteplaats: 'Murcia, Spanje',        lengte: '1.72 m', debuut: '2024, Phillip Island', wereldtitels: 0, bikeModel: 'YZF-R9',           motor: 'Yamaha I3',      omschrijving: 'Borja Jiménez is een Spaans talent dat in 2026 rijdt voor WRP Racing in WorldSSP.' },
  andrea_giombini:       { geboortedatum: '3 jul. 1995',   leeftijd: 30, geboorteplaats: 'Pesaro, Italië',        lengte: '1.77 m', debuut: '2025, Phillip Island', wereldtitels: 0, bikeModel: 'MV Agusta F3',     motor: 'MV Agusta I3',   omschrijving: 'Andrea Giombini rijdt in 2026 voor Motozoo op de MV Agusta F3 800 RR.' },
  alessandro_zaccone:    { geboortedatum: '12 dec. 1999',  leeftijd: 26, geboorteplaats: 'Pesaro, Italië',        lengte: '1.75 m', debuut: '2026, Phillip Island', wereldtitels: 1, bikeModel: 'Ducati Panigale V2', motor: 'Ducati V2',      omschrijving: 'Alessandro Zaccone is MotoE-kampioen van 2025 en maakt in 2026 zijn WorldSSP-debuut.' },
}

// ─── SBK Grid ─────────────────────────────────────────────────────────────────
const SBK_GRID = [
  { id: 'nicolo_bulega',       voornaam: 'Nicolò',    naam: 'BULEGA',         landCode: 'it', nummer: 11, merk: 'Ducati',   team: 'Aruba.it Racing Ducati'         },
  { id: 'iker_lecuona',        voornaam: 'Iker',      naam: 'LECUONA',        landCode: 'es', nummer: 7,  merk: 'Ducati',   team: 'Aruba.it Racing Ducati'         },
  { id: 'danilo_petrucci',     voornaam: 'Danilo',    naam: 'PETRUCCI',       landCode: 'it', nummer: 9,  merk: 'BMW',      team: 'ROKiT BMW Motorrad'             },
  { id: 'miguel_oliveira',     voornaam: 'Miguel',    naam: 'OLIVEIRA',       landCode: 'pt', nummer: 88, merk: 'BMW',      team: 'ROKiT BMW Motorrad'             },
  { id: 'andrea_locatelli',    voornaam: 'Andrea',    naam: 'LOCATELLI',      landCode: 'it', nummer: 55, merk: 'Yamaha',   team: 'Pata Maxus Yamaha'              },
  { id: 'xavi_vierge',         voornaam: 'Xavi',      naam: 'VIERGE',         landCode: 'es', nummer: 97, merk: 'Yamaha',   team: 'Pata Maxus Yamaha'              },
  { id: 'alvaro_bautista',     voornaam: 'Álvaro',    naam: 'BAUTISTA',       landCode: 'es', nummer: 19, merk: 'Ducati',   team: 'Barni Spark Racing'             },
  { id: 'yari_montella',       voornaam: 'Yari',      naam: 'MONTELLA',       landCode: 'it', nummer: 5,  merk: 'Ducati',   team: 'Barni Spark Racing'             },
  { id: 'alex_lowes',          voornaam: 'Alex',      naam: 'LOWES',          landCode: 'gb', nummer: 22, merk: 'Kawasaki', team: 'Bimota by Kawasaki'             },
  { id: 'axel_bassani',        voornaam: 'Axel',      naam: 'BASSANI',        landCode: 'it', nummer: 47, merk: 'Kawasaki', team: 'Bimota by Kawasaki'             },
  { id: 'garrett_gerloff',     voornaam: 'Garrett',   naam: 'GERLOFF',        landCode: 'us', nummer: 31, merk: 'Kawasaki', team: 'Kawasaki WorldSBK Team'         },
  { id: 'lorenzo_baldassarri', voornaam: 'Lorenzo',   naam: 'BALDASSARRI',    landCode: 'it', nummer: 34, merk: 'Ducati',   team: 'Team GoEleven'                  },
  { id: 'somkiat_chantra',     voornaam: 'Somkiat',   naam: 'CHANTRA',        landCode: 'th', nummer: 35, merk: 'Honda',    team: 'Honda HRC'                      },
  { id: 'jake_dixon',          voornaam: 'Jake',      naam: 'DIXON',          landCode: 'gb', nummer: 96, merk: 'Honda',    team: 'Honda HRC'                      },
  { id: 'sam_lowes',           voornaam: 'Sam',       naam: 'LOWES',          landCode: 'gb', nummer: 14, merk: 'Ducati',   team: 'ELF Marc VDS Racing'            },
  { id: 'alberto_surra',       voornaam: 'Alberto',   naam: 'SURRA',          landCode: 'it', nummer: 67, merk: 'Ducati',   team: 'Motocorsa Racing'               },
  { id: 'tarran_mackenzie',    voornaam: 'Tarran',    naam: 'MACKENZIE',      landCode: 'gb', nummer: 95, merk: 'Yamaha',   team: 'MGM Optical Express Racing'     },
  { id: 'thomas_bridewell',    voornaam: 'Thomas',    naam: 'BRIDEWELL',      landCode: 'gb', nummer: 46, merk: 'Ducati',   team: 'Superbike Advocates'            },
  { id: 'remy_gardner',        voornaam: 'Remy',      naam: 'GARDNER',        landCode: 'au', nummer: 87, merk: 'Yamaha',   team: 'GYTR GRT Yamaha'                },
  { id: 'stefano_manzi',       voornaam: 'Stefano',   naam: 'MANZI',          landCode: 'it', nummer: 62, merk: 'Yamaha',   team: 'GYTR GRT Yamaha'                },
  { id: 'bahattin_sofuoglu',   voornaam: 'Bahattin',  naam: 'SOFUOĞLU',       landCode: 'tr', nummer: 54, merk: 'Yamaha',   team: 'Motoxracing Yamaha'             },
  { id: 'mattia_rato',         voornaam: 'Mattia',    naam: 'RATO',           landCode: 'it', nummer: 13, merk: 'Yamaha',   team: 'Motoxracing Yamaha'             },
]

// ─── SSP Grid ─────────────────────────────────────────────────────────────────
const SSP_GRID = [
  { id: 'can_oncu',            voornaam: 'Can',       naam: 'ÖNCÜ',           landCode: 'tr', nummer: 61, merk: 'Yamaha',   team: 'Pata Ten Kate Yamaha'           },
  { id: 'yuki_okamoto',        voornaam: 'Yuki',      naam: 'OKAMOTO',        landCode: 'jp', nummer: 31, merk: 'Yamaha',   team: 'Pata Ten Kate Yamaha'           },
  { id: 'valentin_debise',     voornaam: 'Valentin',  naam: 'DEBISE',         landCode: 'fr', nummer: 53, merk: 'Kawasaki', team: 'ZXMOTO Evan Bros'               },
  { id: 'federico_caricasulo', voornaam: 'Federico',  naam: 'CARICASULO',     landCode: 'it', nummer: 64, merk: 'Kawasaki', team: 'ZXMOTO Evan Bros'               },
  { id: 'dominique_aegerter',  voornaam: 'Dominique', naam: 'AEGERTER',       landCode: 'ch', nummer: 77, merk: 'Kawasaki', team: 'Kawasaki WorldSSP'              },
  { id: 'jeremy_alcoba',       voornaam: 'Jeremy',    naam: 'ALCOBA',         landCode: 'es', nummer: 52, merk: 'Kawasaki', team: 'Kawasaki WorldSSP'              },
  { id: 'albert_arenas',       voornaam: 'Albert',    naam: 'ARENAS',         landCode: 'es', nummer: 75, merk: 'Yamaha',   team: 'AS BLU CRU Yamaha'             },
  { id: 'aldi_mahendra',       voornaam: 'Aldi',      naam: 'MAHENDRA',       landCode: 'id', nummer: 57, merk: 'Yamaha',   team: 'AS BLU CRU Yamaha'             },
  { id: 'roberto_garcia',      voornaam: 'Roberto',   naam: 'GARCIA',         landCode: 'es', nummer: 37, merk: 'Yamaha',   team: 'GMT94 Yamaha'                   },
  { id: 'lucas_mahias',        voornaam: 'Lucas',     naam: 'MAHIAS',         landCode: 'fr', nummer: 94, merk: 'Yamaha',   team: 'GMT94 Yamaha'                   },
  { id: 'jaume_masia',         voornaam: 'Jaume',     naam: 'MASIÁ',          landCode: 'es', nummer: 5,  merk: 'Ducati',   team: 'Orelac Racing'                  },
  { id: 'corentin_perolari',   voornaam: 'Corentin',  naam: 'PEROLARI',       landCode: 'fr', nummer: 6,  merk: 'Honda',    team: 'Honda Racing WorldSSP'          },
  { id: 'ana_carrasco',        voornaam: 'Ana',       naam: 'CARRASCO',       landCode: 'es', nummer: 22, merk: 'Honda',    team: 'Honda Racing WorldSSP'          },
  { id: 'raffaele_de_rosa',    voornaam: 'Raffaele',  naam: 'DE ROSA',        landCode: 'it', nummer: 3,  merk: 'QJMOTOR', team: 'QJMOTOR Factory Racing'         },
  { id: 'marcos_ramirez',      voornaam: 'Marcos',    naam: 'RAMÍREZ',        landCode: 'es', nummer: 24, merk: 'QJMOTOR', team: 'QJMOTOR Factory Racing'         },
  { id: 'philipp_oettl',       voornaam: 'Philipp',   naam: 'OETTL',          landCode: 'de', nummer: 65, merk: 'Ducati',   team: 'Feel Racing WorldSSP'           },
  { id: 'mattia_casadei',      voornaam: 'Mattia',    naam: 'CASADEI',        landCode: 'it', nummer: 40, merk: 'Ducati',   team: 'D34G WorldSSP Racing'           },
  { id: 'simon_jespersen',     voornaam: 'Simon',     naam: 'JESPERSEN',      landCode: 'dk', nummer: 43, merk: 'Ducati',   team: 'EAB Racing'                     },
  { id: 'borja_jimenez',       voornaam: 'Borja',     naam: 'JIMÉNEZ',        landCode: 'es', nummer: 91, merk: 'Yamaha',   team: 'WRP Racing'                     },
  { id: 'andrea_giombini',     voornaam: 'Andrea',    naam: 'GIOMBINI',       landCode: 'it', nummer: 88, merk: 'MV',       team: 'Motozoo MV Agusta'              },
  { id: 'alessandro_zaccone',  voornaam: 'Alessandro',naam: 'ZACCONE',        landCode: 'it', nummer: 36, merk: 'Ducati',   team: 'Ecosantagata Althea Racing'     },
]

type Rijder = typeof SBK_GRID[0]
type Klasse = 'SBK' | 'SSP'

// ─── Afbeelding helpers ───────────────────────────────────────────────────────
function RiderImg({ rijder, klasse, style }: { rijder: Rijder; klasse: Klasse; style?: React.CSSProperties }) {
  const pad = `/worldsbk/${klasse.toLowerCase()}/riders/${rijder.id}`
  return (
    <img src={`${pad}.webp`} alt={rijder.naam} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `${pad}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

function BikeImg({ rijder, klasse, view, style }: { rijder: Rijder; klasse: Klasse; view: 'side' | 'front' | '45'; style?: React.CSSProperties }) {
  const pad = `/worldsbk/${klasse.toLowerCase()}/bikes/${rijder.id}_bike_${view}`
  return (
    <img src={`${pad}.webp`} alt={`${rijder.naam} bike`} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        // Fallback: probeer side als front niet bestaat
        if (img.src.includes('_front') || img.src.includes('_45')) {
          img.src = `/worldsbk/${klasse.toLowerCase()}/bikes/${rijder.id}_bike_side.webp`
        } else img.style.visibility = 'hidden'
      }} />
  )
}

function HelmetImg({ rijder, klasse, style }: { rijder: Rijder; klasse: Klasse; style?: React.CSSProperties }) {
  const pad = `/worldsbk/${klasse.toLowerCase()}/helmets/${rijder.id}_helmet`
  return (
    <img src={`${pad}.webp`} alt="helm" style={style}
      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
  )
}

function FlagImg({ rijder, klasse, style, className }: { rijder: Rijder; klasse: Klasse; style?: React.CSSProperties; className?: string }) {
  return (
    <img src={`/worldsbk/${klasse.toLowerCase()}/flags/${rijder.id}_vlag.svg`} alt={rijder.landCode}
      className={className} style={style}
      onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
  )
}

// ─── Info teksten ─────────────────────────────────────────────────────────────
interface RijderTeksten { overzicht: string; motor: string }
const tekstenCache: Record<string, RijderTeksten> = {}

function parseRijderTxt(raw: string): RijderTeksten {
  const ovMatch  = raw.match(/===\s*OVERZICHT\s*===([\s\S]*?)(?:===\s*MOTOR\s*===|$)/i)
  const motMatch = raw.match(/===\s*MOTOR\s*===([\s\S]*?)(?:===|$)/i)
  return {
    overzicht: ovMatch  ? ovMatch[1].trim()  : raw.trim(),
    motor:     motMatch ? motMatch[1].trim() : '',
  }
}

function useRijderTeksten(rijderId: string, klasse: Klasse): RijderTeksten | null {
  const [teksten, setTeksten] = useState<RijderTeksten | null>(tekstenCache[`${klasse}:${rijderId}`] ?? null)
  useEffect(() => {
    const key = `${klasse}:${rijderId}`
    if (tekstenCache[key]) { setTeksten(tekstenCache[key]); return }
    fetch(`/worldsbk/${klasse.toLowerCase()}/info/${rijderId}.txt`)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(raw => { const p = parseRijderTxt(raw); tekstenCache[key] = p; setTeksten(p) })
      .catch(() => setTeksten({ overzicht: '', motor: '' }))
  }, [rijderId, klasse])
  return teksten
}

// ─── Popup ────────────────────────────────────────────────────────────────────
function RijderPopup({ rijder, klasse, onSluit }: { rijder: Rijder; klasse: Klasse; onSluit: () => void }) {
  const cfg       = KLASSE_CONFIG[klasse]
  const merkKleur = MERK_KLEUREN[rijder.merk] ?? cfg.kleur
  const info      = RIJDER_INFO[rijder.id]
  const [tab, setTab] = useState<'overzicht' | 'motor' | 'stats'>('overzicht')
  const teksten        = useRijderTeksten(rijder.id, klasse)
  const overzichtTekst = teksten?.overzicht || info?.omschrijving || ''
  const motorTekst     = teksten?.motor     || ''

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onSluit}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{ background: '#0f0f0f', border: `1px solid ${cfg.kleur}50`, maxHeight: '90vh', minHeight: 520 }}
        onClick={e => e.stopPropagation()}>

        {/* ── LINKER PANEEL ── */}
        <div className="relative flex-shrink-0 flex flex-col overflow-y-auto"
          style={{ width: 240, background: `linear-gradient(180deg, ${cfg.kleur}22 0%, #0a0a0a 60%)`, maxHeight: '90vh' }}>

          <div className="px-5 pt-4 pb-1 flex-shrink-0">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{ color: cfg.kleur }}>
              {rijder.team}
            </span>
          </div>

          <div className="px-5 pb-2 flex-shrink-0">
            <div className="font-ui text-base text-white/70">{rijder.voornaam}</div>
            <div className="font-head font-black text-3xl uppercase text-white leading-tight">{rijder.naam}</div>
            <div className="flex items-center gap-2 mt-1">
              <FlagImg rijder={rijder} klasse={klasse} className="rounded-sm" style={{ width: 24, height: 16, objectFit: 'cover' }} />
              <span className="font-ui text-xs text-white/50 uppercase">{rijder.landCode}</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-ui text-[10px] font-bold uppercase px-2 py-1 rounded"
                style={{ background: cfg.kleur + '22', color: cfg.kleur, border: `1px solid ${cfg.kleur}44` }}>
                {cfg.label}
              </span>
              {/* Helm icoontje in popup */}
              <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                style={{ background: '#1a1a1a', border: `1px solid ${cfg.kleur}33` }}>
                <HelmetImg rijder={rijder} klasse={klasse} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          </div>

          {/* Rijderfoto */}
          <div className="relative flex-shrink-0 mx-3 rounded-xl overflow-hidden" style={{ height: 260 }}>
            <RiderImg rijder={rijder} klasse={klasse}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            <div className="absolute bottom-0 left-0 right-0 h-20"
              style={{ background: 'linear-gradient(transparent, #0a0a0a)' }} />
            <div className="absolute bottom-2 right-3 font-head font-black text-5xl leading-none"
              style={{ color: cfg.kleur, opacity: 0.4 }}>
              {rijder.nummer}
            </div>
          </div>

          {/* Persoonlijke info */}
          <div className="px-4 py-4 space-y-3 flex-shrink-0">
            {info ? (
              [
                { icon: '📅', label: 'Geboortedatum',  val: `${info.geboortedatum} (${info.leeftijd})` },
                { icon: '📍', label: 'Geboorteplaats', val: info.geboorteplaats },
                { icon: '📏', label: 'Lengte',          val: info.lengte },
                { icon: '🏁', label: 'Debuut WorldSBK', val: info.debuut },
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
              <div className="flex items-start gap-2">
                <span className="text-xs mt-0.5">#️⃣</span>
                <div>
                  <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">Racenummer</div>
                  <div className="font-ui text-xs text-white/80">#{rijder.nummer}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RECHTER PANEEL ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tabs + sluit */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0 flex-shrink-0"
            style={{ borderBottom: `1px solid ${cfg.kleur}25` }}>
            <div className="flex gap-1">
              {(['overzicht', 'motor', 'stats'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all capitalize"
                  style={tab === t
                    ? { color: cfg.kleur, borderBottom: `2px solid ${cfg.kleur}` }
                    : { color: 'rgba(255,255,255,0.35)', borderBottom: '2px solid transparent' }}>
                  {t === 'overzicht' ? 'Overzicht' : t === 'motor' ? 'Motor' : 'Statistieken'}
                </button>
              ))}
            </div>
            <button onClick={onSluit}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors text-sm">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* OVERZICHT */}
            {tab === 'overzicht' && (
              <div className="space-y-4">
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

                {/* Bike preview — front + side */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: cfg.kleur }} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">
                      {info?.bikeModel ?? rijder.merk} · 2026 Motor
                    </span>
                  </div>
                  <div className="rounded-xl overflow-hidden flex items-center justify-center gap-2 p-4"
                    style={{ background: `linear-gradient(135deg, ${merkKleur}12, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}25`, minHeight: 240 }}>
                    {/* Voor-aanzicht (uniek WorldSBK asset!) */}
                    <div style={{ width: '35%', height: 220 }}>
                      <BikeImg rijder={rijder} klasse={klasse} view="front"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${merkKleur}50)` }} />
                    </div>
                    {/* Zij-aanzicht */}
                    <div style={{ width: '60%', height: 220 }}>
                      <BikeImg rijder={rijder} klasse={klasse} view="side"
                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${merkKleur}50)` }} />
                    </div>
                  </div>
                </div>

                {overzichtTekst && (
                  <div className="rounded-xl p-4 overflow-y-auto"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', maxHeight: 160 }}>
                    <p className="font-ui text-sm text-white/60 leading-relaxed whitespace-pre-line">{overzichtTekst}</p>
                  </div>
                )}
              </div>
            )}

            {/* MOTOR */}
            {tab === 'motor' && (
              <div className="space-y-4">
                <div>
                  <div className="font-head font-black text-2xl text-white mb-0.5">{info?.bikeModel ?? rijder.merk}</div>
                  <div className="font-ui text-xs text-white/40 uppercase tracking-wider">2026 · {cfg.label}</div>
                </div>

                {/* Motor groot + helm naast elkaar */}
                <div className="flex gap-3">
                  <div className="flex-1 rounded-2xl flex items-center justify-center p-5"
                    style={{ background: `linear-gradient(135deg, ${merkKleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${merkKleur}30`, height: 240 }}>
                    <BikeImg rijder={rijder} klasse={klasse} view="45"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 8px 24px ${merkKleur}60)` }} />
                  </div>
                  {/* Helm — uniek WorldSBK asset */}
                  <div className="flex-shrink-0 rounded-2xl flex items-center justify-center p-3"
                    style={{ width: 130, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', height: 240 }}>
                    <HelmetImg rijder={rijder} klasse={klasse}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${cfg.kleur}40)` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '⚙️', label: 'Motor',   val: info?.motor ?? rijder.merk },
                    { icon: '🏗️', label: 'Klasse',  val: cfg.label },
                    { icon: '🔄', label: 'Banden',  val: cfg.banden },
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

                {motorTekst && (
                  <div className="rounded-xl p-4 overflow-y-auto"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', maxHeight: 200 }}>
                    <p className="font-ui text-sm text-white/60 leading-relaxed whitespace-pre-line">{motorTekst}</p>
                  </div>
                )}
              </div>
            )}

            {/* STATISTIEKEN */}
            {tab === 'stats' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 rounded-full" style={{ background: cfg.kleur }} />
                  <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Seizoenstatistieken 2026</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: '🏁', label: 'Races',         val: '—' },
                    { icon: '🏆', label: 'Overwinningen', val: '—' },
                    { icon: '🥇', label: 'Podiums',       val: '—' },
                    { icon: '⚡', label: 'Poles',         val: '—' },
                    { icon: '⏱️', label: 'Snelste ronde', val: '—' },
                    { icon: '📊', label: 'Punten',        val: '—' },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="rounded-xl p-4 text-center"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="text-xl mb-1">{icon}</div>
                      <div className="font-head font-black text-2xl" style={{ color: cfg.kleur }}>{val}</div>
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

// ─── Rijder rij ───────────────────────────────────────────────────────────────
function RijderRij({ rijder, klasse, isEven, onKlik }: { rijder: Rijder; klasse: Klasse; isEven: boolean; onKlik: () => void }) {
  const cfg       = KLASSE_CONFIG[klasse]
  const merkKleur = MERK_KLEUREN[rijder.merk] ?? cfg.kleur

  return (
    <div
      className="relative flex items-center group cursor-pointer overflow-hidden transition-all duration-300"
      style={{
        background: isEven ? 'rgba(255,255,255,0.025)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        minHeight: 88,
      }}
      onClick={onKlik}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = isEven ? 'rgba(255,255,255,0.025)' : 'transparent' }}
    >
      {/* Gekleurde linkerkant balk */}
      <div className="absolute left-0 top-0 h-full w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r"
        style={{ background: cfg.kleur }} />

      {/* Groot racenummer op achtergrond */}
      <div className="absolute font-head font-black select-none pointer-events-none"
        style={{ fontSize: 96, color: merkKleur, opacity: 0.07, left: '55%', top: '50%', transform: 'translate(-50%, -50%)', lineHeight: 1, letterSpacing: '-4px' }}>
        {rijder.nummer}
      </div>

      {/* Vlag — rijder-specifiek SVG */}
      <div className="flex-shrink-0 flex items-center justify-center pl-4" style={{ width: 44 }}>
        <FlagImg rijder={rijder} klasse={klasse} className="rounded-sm" style={{ width: 26, height: 17, objectFit: 'cover' }} />
      </div>

      {/* Rijderfoto */}
      <div className="flex-shrink-0 relative" style={{ width: 80, height: 88, overflow: 'hidden' }}>
        <RiderImg rijder={rijder} klasse={klasse} style={{
          width: 80, height: 100,
          objectFit: 'cover', objectPosition: 'top center',
          marginTop: -4,
          filter: 'drop-shadow(2px 0 8px rgba(0,0,0,0.5))',
        }} />
      </div>

      {/* Naam + merk + team */}
      <div className="flex-1 flex flex-col justify-center px-5 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-ui text-sm text-white/40 group-hover:text-white/60 transition-colors">{rijder.voornaam}</span>
          <span className="font-head font-black text-xl uppercase text-white tracking-wide">{rijder.naam}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-0.5 h-3 rounded-full flex-shrink-0" style={{ background: cfg.kleur }} />
          <span className="font-ui text-xs font-bold uppercase tracking-wider flex-shrink-0" style={{ color: merkKleur, opacity: 0.85 }}>
            {rijder.merk}
          </span>
          <span className="font-ui text-xs text-white/25">·</span>
          <span className="font-ui text-xs text-white/30 group-hover:text-white/50 transition-colors truncate">{rijder.team}</span>
        </div>
      </div>

      {/* Racenummer badge */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 56 }}>
        <span className="font-head font-black text-sm w-10 h-8 flex items-center justify-center rounded"
          style={{ background: cfg.kleur + '28', color: cfg.kleur, border: `1px solid ${cfg.kleur}50` }}>
          {rijder.nummer}
        </span>
      </div>

      {/* Motor zij-aanzicht + helm icoontje */}
      <div className="flex-shrink-0 relative flex items-center justify-center"
        style={{ width: 280, height: 88, overflow: 'hidden' }}>
        <div className="absolute inset-y-2 left-2 right-2 rounded-xl"
          style={{ background: `linear-gradient(135deg, ${merkKleur}22, ${merkKleur}08)`, border: `1px solid ${merkKleur}40` }} />
        <BikeImg rijder={rijder} klasse={klasse} view="side"
          style={{
            position: 'relative',
            width: 240, height: 72,
            objectFit: 'contain', objectPosition: 'center',
            filter: `drop-shadow(0 3px 12px ${merkKleur}60)`,
            transform: 'rotate(-3deg)',
            transition: 'transform 0.3s ease',
          }} />
        {/* Helm — zwevend rondje rechtsonder (uniek WorldSBK!) */}
        <div className="absolute bottom-2 right-2 w-9 h-9 rounded-full overflow-hidden flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: '#111', border: `1px solid ${cfg.kleur}60`, boxShadow: `0 2px 8px ${cfg.kleur}40` }}>
          <HelmetImg rijder={rijder} klasse={klasse} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function WorldSBK() {
  const [klasse, setKlasse]         = useState<Klasse>('SBK')
  const [zoek, setZoek]             = useState('')
  const [merkFilter, setMerkFilter] = useState<string | null>(null)
  const [popup, setPopup]           = useState<Rijder | null>(null)

  const cfg  = KLASSE_CONFIG[klasse]
  const grid = klasse === 'SBK' ? SBK_GRID : SSP_GRID
  const merken = Array.from(new Set(grid.map(r => r.merk)))

  const gefilterd = grid.filter(r => {
    const matchMerk = !merkFilter || r.merk === merkFilter
    const matchZoek = !zoek || `${r.voornaam} ${r.naam} ${r.team} ${r.merk}`.toLowerCase().includes(zoek.toLowerCase())
    return matchMerk && matchZoek
  })

  // Reset merkfilter bij klassewisseling
  const wisselKlasse = (k: Klasse) => { setKlasse(k); setMerkFilter(null); setZoek('') }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* Header */}
      <div className="mb-1" style={{ color: cfg.kleur }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          World<span style={{ color: cfg.kleur }}>SBK</span>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">
          {cfg.sub} · {grid.length} rijders
        </span>
      </div>

      {/* Klasse tabs SBK / SSP */}
      <div className="flex gap-2 mb-5">
        {(['SBK', 'SSP'] as Klasse[]).map(k => {
          const c = KLASSE_CONFIG[k]
          return (
            <button key={k} onClick={() => wisselKlasse(k)}
              className="font-ui text-xs font-bold uppercase tracking-wider px-5 py-2 rounded-lg border transition-all"
              style={klasse === k
                ? { background: c.kleur + '22', borderColor: c.kleur, color: c.kleur }
                : { background: 'transparent', borderColor: '#333', color: '#555' }}>
              {c.label}
            </button>
          )
        })}
      </div>

      {/* Zoek + merk filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <input type="text" placeholder="Zoek rijder of team..." value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none transition-colors w-full md:w-64" />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setMerkFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!merkFilter ? { background: cfg.kleur + '22', borderColor: cfg.kleur, color: cfg.kleur } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
            Alle
          </button>
          {merken.map(m => {
            const mk = MERK_KLEUREN[m] ?? cfg.kleur; const ac = merkFilter === m
            return (
              <button key={m} onClick={() => setMerkFilter(ac ? null : m)}
                className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
                style={ac ? { background: mk + '22', borderColor: mk, color: mk } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
                {m}
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid tabel */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        <div className="flex items-center" style={{ background: '#0a0a0a', borderBottom: '1px solid #222' }}>
          <div style={{ width: 44 }} />
          <div style={{ width: 80 }} />
          <div className="flex-1 px-5 py-3">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Rijder</span>
          </div>
          <div className="flex justify-center py-3" style={{ width: 56 }}>
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">#</span>
          </div>
          <div className="py-3" style={{ width: 280 }}>
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Motor</span>
          </div>
        </div>

        {gefilterd.map((r, i) => (
          <RijderRij key={r.id} rijder={r} klasse={klasse} isEven={i % 2 === 0} onKlik={() => setPopup(r)} />
        ))}
        {gefilterd.length === 0 && (
          <div className="py-16 text-center font-ui text-sm text-white/30">Geen rijders gevonden.</div>
        )}
      </div>

      {popup && <RijderPopup rijder={popup} klasse={klasse} onSluit={() => setPopup(null)} />}
    </div>
  )
}
