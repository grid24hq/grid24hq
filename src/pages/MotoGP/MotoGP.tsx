// ─── MotoGP 2026 — MotoGP grid pagina ────────────────────────────────────────
//
// MAPPENSTRUCTUUR AFBEELDINGEN:
//
// public/motogp/
//   flags/          ← landvlaggen SVG  (zelfde als F1: nl.svg, es.svg etc.)
//   motogp/
//     riders/       ← rijder foto's    (320×240 px WebP, bv: marquez.webp)
//     bikes/        ← motor per merk   (400×200 px WebP, bv: ducati.webp)
//
// MERK IDs (voor bikes map):
//   MotoGP: ducati, aprilia, ktm, yamaha, honda
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
// overzichtTekst en motorTekst worden geladen vanuit:
//   public/motogp/motogp/info/{rijderId}.txt   (MotoGP)
//   public/motogp/moto2/info/{rijderId}.txt    (Moto2)
//   public/motogp/moto3/info/{rijderId}.txt    (Moto3)
//
// Formaat van het .txt bestand:
//   === OVERZICHT ===
//   ... tekst voor het Overzicht-tabblad ...
//   === MOTOR ===
//   ... tekst voor het Motor-tabblad ...
const RIJDER_INFO: Record<string, {
  geboortedatum: string; leeftijd: number; geboorteplaats: string
  lengte: string; debuut: string; wereldtitels: number
  bikeModel: string; motor: string; omschrijving: string
  bikeFront?: string; bikeSide?: string
}> = {
  // MotoGP
  bagnaia:        { geboortedatum: '14 jan. 1997',  leeftijd: 28, geboorteplaats: 'Torino, Italië',        lengte: '1.78 m', debuut: '2019, Qatar',  wereldtitels: 2, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',  omschrijving: 'Francesco Bagnaia is tweevoudig wereldkampioen MotoGP en verdedigt zijn titel in 2026 met de nieuwste Ducati Desmosedici.',
    bikeFront: 'bagnaia_ducati_lenovo_front',  bikeSide: 'ducati_lenovo_side' },
  mmarquez:       { geboortedatum: '17 feb. 1993',  leeftijd: 32, geboorteplaats: 'Cervera, Spanje',       lengte: '1.68 m', debuut: '2013, Qatar',  wereldtitels: 8, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',  omschrijving: 'Marc Márquez is de meest succesvolle rijder van zijn generatie met 8 wereldtitels en rijdt in 2026 voor het fabrieksteam van Ducati.',
    bikeFront: 'mmarquez_ducati_lenovo_front', bikeSide: 'ducati_lenovo_side' },
  martin:         { geboortedatum: '29 jan. 1998',  leeftijd: 27, geboorteplaats: 'Madrid, Spanje',        lengte: '1.80 m', debuut: '2021, Qatar',  wereldtitels: 1, bikeModel: 'RS-GP26',          motor: 'Aprilia V4', omschrijving: 'Jorge Martín is regerend wereldkampioen en maakt in 2026 de overstap naar Aprilia Racing.',
    bikeFront: 'martin_aprilia_racing_front',  bikeSide: 'aprilia_racing_side' },
  bezzecchi:      { geboortedatum: '26 sep. 1998',  leeftijd: 26, geboorteplaats: 'Rimini, Italië',        lengte: '1.73 m', debuut: '2021, Qatar',  wereldtitels: 0, bikeModel: 'RS-GP26',          motor: 'Aprilia V4', omschrijving: 'Marco Bezzecchi is een van de meest opvallende talenten van zijn generatie en rijdt in 2026 voor Aprilia Racing.',
    bikeFront: 'bezzecchi_aprilia_racing_front', bikeSide: 'aprilia_racing_side' },
  acosta:         { geboortedatum: '25 mei 2004',   leeftijd: 21, geboorteplaats: 'Murcia, Spanje',        lengte: '1.73 m', debuut: '2024, Qatar',  wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',     omschrijving: 'Pedro Acosta geldt als het grootste talent van zijn generatie en rijdt in 2026 voor het KTM fabrieksteam.',
    bikeFront: 'ktm_factory_acosta_front',     bikeSide: 'ktm_factory_side' },
  binder:         { geboortedatum: '22 sep. 1995',  leeftijd: 29, geboorteplaats: 'Potchefstroom, Z-A',   lengte: '1.76 m', debuut: '2020, Qatar',  wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',     omschrijving: 'Brad Binder is een van de meest consistente rijders in het veld en vertegenwoordigt Zuid-Afrika in MotoGP.',
    bikeFront: 'ktm_factory_binder_front',     bikeSide: 'ktm_factory_side' },
  quartararo:     { geboortedatum: '20 apr. 1999',  leeftijd: 26, geboorteplaats: 'Nice, Frankrijk',       lengte: '1.69 m', debuut: '2019, Qatar',  wereldtitels: 1, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',  omschrijving: 'Fabio Quartararo was wereldkampioen in 2021 en probeert in 2026 Yamaha terug naar de top te brengen.',
    bikeFront: 'yamaha_monster_quartararo_front', bikeSide: 'yamaha_monster_side' },
  rins:           { geboortedatum: '8 dec. 1995',   leeftijd: 29, geboorteplaats: 'Barcelona, Spanje',     lengte: '1.75 m', debuut: '2017, Qatar',  wereldtitels: 0, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',  omschrijving: 'Alex Rins is een ervaren rijder die in 2026 zijn kracht bundelt met Yamaha.',
    bikeFront: 'yamaha_monster_rins_front',    bikeSide: 'yamaha_monster_side' },
  morbidelli:     { geboortedatum: '4 dec. 1994',   leeftijd: 30, geboorteplaats: 'Rome, Italië',          lengte: '1.75 m', debuut: '2018, Qatar',  wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',  omschrijving: 'Franco Morbidelli rijdt in 2026 voor het VR46 team van zijn mentor Valentino Rossi.',
    bikeFront: 'morbidelli_vr46__front',       bikeSide: 'vr46_side' },
  digiannantonio: { geboortedatum: '10 okt. 1998',  leeftijd: 26, geboorteplaats: 'Rome, Italië',          lengte: '1.72 m', debuut: '2022, Qatar',  wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',  omschrijving: 'Fabio Di Giannantonio maakt indruk in MotoGP en wil in 2026 zijn eerste overwinning behalen.',
    bikeFront: 'digiannantonio_vr46_front',    bikeSide: 'vr46_side' },
  aldeguer:       { geboortedatum: '19 jan. 2003',  leeftijd: 22, geboorteplaats: 'Murcia, Spanje',        lengte: '1.76 m', debuut: '2025, Qatar',  wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',  omschrijving: 'Fermin Aldeguer is een van de meest veelbelovende rijders en maakt zijn volledig debuut in 2026.',
    bikeFront: 'aldeguer_gresini_front',       bikeSide: 'gresini_side' },
  amarquez:       { geboortedatum: '23 apr. 1996',  leeftijd: 29, geboorteplaats: 'Cervera, Spanje',       lengte: '1.68 m', debuut: '2020, Qatar',  wereldtitels: 0, bikeModel: 'Desmosedici GP26', motor: 'Ducati V4',  omschrijving: 'Alex Márquez rijdt samen met zijn broer Marc bij Gresini Racing op een Ducati.',
    bikeFront: 'amarquez_gresini_front',       bikeSide: 'gresini_side' },
  rfernandez:     { geboortedatum: '22 nov. 2000',  leeftijd: 24, geboorteplaats: 'Murcia, Spanje',        lengte: '1.73 m', debuut: '2022, Qatar',  wereldtitels: 0, bikeModel: 'RS-GP26',          motor: 'Aprilia V4', omschrijving: 'Raul Fernández liet indrukwekkende prestaties zien bij Trackhouse en rijdt in 2026 op een Aprilia.',
    bikeFront: 'trackhouse_rfernanez_front',   bikeSide: 'trackhouse_side' },
  ogura:          { geboortedatum: '4 okt. 2001',   leeftijd: 23, geboorteplaats: 'Aichi, Japan',          lengte: '1.68 m', debuut: '2024, Japan',  wereldtitels: 0, bikeModel: 'RS-GP26',          motor: 'Aprilia V4', omschrijving: 'Ai Ogura maakte indruk in Moto2 en bevestigt zijn klasse in 2026 bij Trackhouse Racing.',
    bikeFront: 'trackhouse_ogura_front',       bikeSide: 'trackhouse_side' },
  vinales:        { geboortedatum: '12 jan. 1995',  leeftijd: 30, geboorteplaats: 'Figueres, Spanje',      lengte: '1.71 m', debuut: '2015, Qatar',  wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',     omschrijving: 'Maverick Viñales is een voormalige race-winnaar die in 2026 overstapt naar KTM Tech3.',
    bikeFront: 'ktm_tech3_vinales_front',      bikeSide: 'ktm_tech3_side' },
  bastianini:     { geboortedatum: '30 dec. 1997',  leeftijd: 27, geboorteplaats: 'Rimini, Italië',        lengte: '1.82 m', debuut: '2021, Qatar',  wereldtitels: 0, bikeModel: 'RC16',             motor: 'KTM V4',     omschrijving: 'Enea Bastianini rijdt in 2026 voor KTM Tech3 en wil zijn snelheid omzetten in consistente resultaten.',
    bikeFront: 'ktm_tech3_bastianini_front',   bikeSide: 'ktm_tech3_side' },
  miller:         { geboortedatum: '18 jan. 1995',  leeftijd: 30, geboorteplaats: 'Townsville, Australië', lengte: '1.73 m', debuut: '2015, Qatar',  wereldtitels: 0, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',  omschrijving: 'Jack Miller is een populaire rijder die in 2026 de Pramac Yamaha op de kaart wil zetten.',
    bikeFront: 'pramac_yamaha_miller_front',   bikeSide: 'pramac_yamaha_side' },
  razgatlioglu:   { geboortedatum: '16 okt. 1996',  leeftijd: 27, geboorteplaats: 'Alanya, Turkije',       lengte: '1.75 m', debuut: '2026, Qatar',  wereldtitels: 1, bikeModel: 'YZR-M1',           motor: 'Yamaha I4',  omschrijving: 'Toprak Razgatlioğlu is WorldSBK-kampioen en maakt in 2026 zijn MotoGP-debuut bij Prima Pramac Yamaha.',
    bikeFront: 'pramac_yamaha_razgatlioglu_front', bikeSide: 'pramac_yamaha_side' },
  zarco:          { geboortedatum: '16 jul. 1990',  leeftijd: 35, geboorteplaats: 'Cannes, Frankrijk',     lengte: '1.74 m', debuut: '2017, Qatar',  wereldtitels: 0, bikeModel: 'RC213V',           motor: 'Honda V4',   omschrijving: 'Johann Zarco is een ervaren veteraan die in 2026 Honda helpt terug aan de top te komen.',
    bikeFront: 'honda_hrc_zarco_front',        bikeSide: 'honda_hrc_side' },
  moreira:        { geboortedatum: '9 apr. 2003',   leeftijd: 22, geboorteplaats: 'São Paulo, Brazilië',   lengte: '1.70 m', debuut: '2025, Qatar',  wereldtitels: 0, bikeModel: 'RC213V',           motor: 'Honda V4',   omschrijving: 'Diogo Moreira is een Braziliaans talent dat zijn kans grijpt bij Honda HRC Castrol in 2026.',
    bikeFront: 'honda_hrc_moreira_front',      bikeSide: 'honda_hrc_side' },
  marini:         { geboortedatum: '10 aug. 1996',  leeftijd: 28, geboorteplaats: 'Urbino, Italië',        lengte: '1.76 m', debuut: '2021, Qatar',  wereldtitels: 0, bikeModel: 'RC213V',           motor: 'Honda V4',   omschrijving: 'Luca Marini is de halfbroer van Valentino Rossi en rijdt in 2026 voor LCR Honda.',
    bikeFront: 'lcr_honda_marini_front',       bikeSide: 'lcr_honda_side' },
  mir:            { geboortedatum: '1 sep. 1997',   leeftijd: 27, geboorteplaats: 'Palma, Spanje',         lengte: '1.74 m', debuut: '2019, Qatar',  wereldtitels: 1, bikeModel: 'RC213V',           motor: 'Honda V4',   omschrijving: 'Joan Mir is wereldkampioen van 2020 en rijdt in 2026 voor LCR Honda.',
    bikeFront: 'lcr_honda_mir_front',          bikeSide: 'lcr_honda_side' },
}



// ─── Klasse kleuren ───────────────────────────────────────────────────────────
const KLASSE_CONFIG = {
  MotoGP: { kleur: '#f97316', label: 'MotoGP',  sub: 'Koningsklasse' },
}

// ─── Merk kleuren ─────────────────────────────────────────────────────────────
const MERK_KLEUREN: Record<string, string> = {
  Ducati:     '#cc0000',
  Aprilia:    '#1a1aff',
  KTM:        '#ff6600',
  Yamaha:     '#0033cc',
  Honda:      '#cc0000',
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
  { id: 'zarco',          voornaam: 'Johann',    naam: 'ZARCO',           landCode: 'fr', nummer: 5,  merk: 'Honda',    team: 'Honda HRC Castrol'            },
  { id: 'moreira',        voornaam: 'Diogo',     naam: 'MOREIRA',         landCode: 'br', nummer: 11, merk: 'Honda',    team: 'Honda HRC Castrol'            },
  { id: 'marini',         voornaam: 'Luca',      naam: 'MARINI',          landCode: 'it', nummer: 10, merk: 'Honda',    team: 'LCR Honda'                    },
  { id: 'mir',            voornaam: 'Joan',      naam: 'MIR',             landCode: 'es', nummer: 36, merk: 'Honda',    team: 'LCR Honda'                    },
]

type Rijder = { id: string; voornaam: string; naam: string; landCode: string; nummer: number; merk: string; team: string }
type Klasse = 'MotoGP'

// ─── Team → bestandsnaam mapping ─────────────────────────────────────────────
// MotoGP bikes: public/motogp/motogp/bikes/{team_id}.webp
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
}

function teamBikeId(team: string, klasse: Klasse): string {
  if (TEAM_BIKE_ID[team]) return TEAM_BIKE_ID[team]
  // Fallback: merk lowercase
  return team.split(' ')[0].toLowerCase()
}

// ─── Info-teksten laden vanuit externe .txt bestanden ────────────────────────
// Bestandsformaat: public/motogp/{klasse}/info/{rijderId}.txt
// Indeling van het .txt bestand:
//   === OVERZICHT ===
//   ... vrije tekst voor het Overzicht-tabblad ...
//   === MOTOR ===
//   ... vrije tekst voor het Motor-tabblad ...
//
// Als een sectie ontbreekt, valt de popup terug op info.omschrijving.

interface RijderTeksten { overzicht: string; motor: string }
const rijderTekstenCache: Record<string, RijderTeksten> = {}

function parseRijderTxt(raw: string): RijderTeksten {
  const ovMatch = raw.match(/===\s*OVERZICHT\s*===([\s\S]*?)(?:===\s*MOTOR\s*===|$)/i)
  const motMatch = raw.match(/===\s*MOTOR\s*===([\s\S]*?)(?:===|$)/i)
  return {
    overzicht: ovMatch ? ovMatch[1].trim() : raw.trim(),
    motor:     motMatch ? motMatch[1].trim() : '',
  }
}

function useRijderTeksten(rijderId: string, klasse: Klasse): RijderTeksten | null {
  const [teksten, setTeksten] = useState<RijderTeksten | null>(
    rijderTekstenCache[`${klasse}:${rijderId}`] ?? null
  )
  useEffect(() => {
    const cacheKey = `${klasse}:${rijderId}`
    if (rijderTekstenCache[cacheKey]) { setTeksten(rijderTekstenCache[cacheKey]); return }
    const pad = `/motogp/${klasse.toLowerCase()}/info/${rijderId}.txt`
    fetch(pad)
      .then(r => r.ok ? r.text() : Promise.reject())
      .then(raw => {
        const parsed = parseRijderTxt(raw)
        rijderTekstenCache[cacheKey] = parsed
        setTeksten(parsed)
      })
      .catch(() => {
        // Geen .txt gevonden — toon omschrijving als fallback (via info.omschrijving)
        setTeksten({ overzicht: '', motor: '' })
      })
  }, [rijderId, klasse])
  return teksten
}

function BikeImg({ team, merk, klasse, rijderId, style }: { team: string; merk: string; klasse: Klasse; rijderId?: string; style?: React.CSSProperties }) {
  // Als rijderId meegegeven: gebruik bikeSide uit RIJDER_INFO als fallback pad
  const info    = rijderId ? RIJDER_INFO[rijderId] : undefined
  const bestand = info?.bikeSide ?? teamBikeId(team, klasse)
  const pad     = `/motogp/${klasse.toLowerCase()}/bikes/${bestand}`
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

// Voor-aanzicht afbeelding (rijder-specifiek)
function BikeFrontImg({ rijderId, team, merk, klasse, style }: { rijderId: string; team: string; merk: string; klasse: Klasse; style?: React.CSSProperties }) {
  const info    = RIJDER_INFO[rijderId]
  const bestand = info?.bikeFront ?? teamBikeId(team, klasse)
  const pad     = `/motogp/${klasse.toLowerCase()}/bikes/${bestand}`
  return (
    <img src={`${pad}.webp`} alt={`${rijderId} front`} style={style}
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

  // Laad teksten vanuit public/motogp/{klasse}/info/{rijderId}.txt
  const teksten = useRijderTeksten(rijder.id, klasse)
  const overzichtTekst = teksten?.overzicht || info?.omschrijving || ''
  const motorTekst     = teksten?.motor     || info?.omschrijving || ''

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
                    {/* Voor-aanzicht — rijder-specifiek */}
                    <div style={{ width: '38%', height: 180 }}>
                      <BikeFrontImg rijderId={rijder.id} team={rijder.team} merk={rijder.merk} klasse={klasse}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 12px ${merkKleur}50)` }} />
                    </div>
                    {/* Zij-aanzicht — team-specifiek */}
                    <div style={{ width: '58%', height: 180 }}>
                      <BikeImg team={rijder.team} merk={rijder.merk} klasse={klasse} rijderId={rijder.id}
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
                  <BikeImg team={rijder.team} merk={rijder.merk} klasse={klasse} rijderId={rijder.id}
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

// ─── Rijder rij — Asymmetrical Layered Row (MotoGP) ──────────────────────────
function RijderRij({ rijder, klasse, isEven, onKlik }: { rijder: Rijder; klasse: Klasse; isEven: boolean; onKlik: () => void }) {
  const klasseKleur = KLASSE_CONFIG[klasse].kleur
  const merkKleur   = MERK_KLEUREN[rijder.merk] ?? klasseKleur

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
      {/* Hover: gekleurde linkerkant balk in klasse-kleur */}
      <div className="absolute left-0 top-0 h-full w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-r"
        style={{ background: klasseKleur }} />

      {/* Groot racenummer op achtergrond — merkkleur voor extra diepte */}
      <div className="absolute font-head font-black select-none pointer-events-none"
        style={{
          fontSize: 96,
          color: merkKleur,
          opacity: 0.07,
          left: '55%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          lineHeight: 1,
          letterSpacing: '-4px',
        }}>
        {rijder.nummer}
      </div>

      {/* Vlag */}
      <div className="flex-shrink-0 flex items-center justify-center pl-4" style={{ width: 44 }}>
        <img src={`/motogp/flags/${rijder.landCode}.svg`} alt={rijder.landCode}
          className="rounded-sm" style={{ width: 26, height: 17, objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
      </div>

      {/* Rijderfoto — snijdt iets omhoog uit de rij */}
      <div className="flex-shrink-0 relative" style={{ width: 80, height: 88, overflow: 'hidden' }}>
        <RiderImg rijder={rijder} klasse={klasse} style={{
          width: 80, height: 100,
          objectFit: 'cover', objectPosition: 'top center',
          marginTop: -4,
          filter: 'drop-shadow(2px 0 8px rgba(0,0,0,0.5))',
        }} />
      </div>

      {/* Naam + merk + teamnaam */}
      <div className="flex-1 flex flex-col justify-center px-5 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-ui text-sm text-white/40 group-hover:text-white/60 transition-colors">
            {rijder.voornaam}
          </span>
          <span className="font-head font-black text-xl uppercase text-white tracking-wide">
            {rijder.naam}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="w-0.5 h-3 rounded-full flex-shrink-0" style={{ background: klasseKleur }} />
          <span className="font-ui text-xs font-bold uppercase tracking-wider flex-shrink-0"
            style={{ color: merkKleur, opacity: 0.85 }}>
            {rijder.merk}
          </span>
          <span className="font-ui text-xs text-white/25">·</span>
          <span className="font-ui text-xs text-white/30 group-hover:text-white/50 transition-colors truncate">
            {rijder.team}
          </span>
        </div>
      </div>

      {/* Racenummer badge */}
      <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 56 }}>
        <span className="font-head font-black text-sm w-10 h-8 flex items-center justify-center rounded"
          style={{ background: klasseKleur + '28', color: klasseKleur, border: `1px solid ${klasseKleur}50` }}>
          {rijder.nummer}
        </span>
      </div>

      {/* Motor — brede box, merkkleur achtergrond, volledig zichtbaar */}
      <div className="flex-shrink-0 relative flex items-center justify-center"
        style={{ width: 280, height: 88, overflow: 'hidden' }}>
        <div className="absolute inset-y-2 left-2 right-2 rounded-xl"
          style={{ background: `linear-gradient(135deg, ${merkKleur}22, ${merkKleur}08)`, border: `1px solid ${merkKleur}40` }} />
        <BikeImg team={rijder.team} merk={rijder.merk} klasse={klasse} rijderId={rijder.id}
          style={{
            position: 'relative',
            width: 240,
            height: 72,
            objectFit: 'contain',
            objectPosition: 'center',
            filter: `drop-shadow(0 3px 12px ${merkKleur}60)`,
            transform: 'rotate(-3deg)',
            transition: 'transform 0.3s ease, filter 0.3s ease',
          }} />
      </div>
    </div>
  )
}


// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function MotoGP() {
  const [zoek, setZoek]             = useState('')
  const [merkFilter, setMerkFilter] = useState<string | null>(null)
  const [popup, setPopup]           = useState<Rijder | null>(null)

  const klasse: Klasse = 'MotoGP'
  const grid = MOTOGP_GRID
  const cfg  = KLASSE_CONFIG[klasse]
  const merken = Array.from(new Set(grid.map(r => r.merk)))

  const gefilterd = grid.filter(r => {
    const matchMerk = !merkFilter || r.merk === merkFilter
    const matchZoek = !zoek || `${r.voornaam} ${r.naam} ${r.team} ${r.merk}`.toLowerCase().includes(zoek.toLowerCase())
    return matchMerk && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="mb-1" style={{ color: MGP_ORANJE }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-6">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          Moto<span style={{ color: MGP_ORANJE }}>GP</span>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">{cfg.sub} · {grid.length} rijders</span>
      </div>

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
