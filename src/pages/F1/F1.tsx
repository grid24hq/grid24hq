// ─── F1 2026 Grid + Premium Popup ─────────────────────────────────────────────
import { useState, useEffect } from 'react'

const F1_ROOD = '#e10600'

const TEAM_KLEUREN: Record<string, string> = {
  ferrari:  '#e8002d', redbull:  '#3671c6', mercedes: '#27f4d2',
  mclaren:  '#ff8000', aston:    '#229971', alpine:   '#0093cc',
  williams: '#64c4ff', rb:       '#6692ff', audi:     '#bb0a14',
  haas:     '#b6babd', cadillac: '#cc0000',
}

// ─── Statische rijder data (uitbreidbaar) ─────────────────────────────────────
const RIJDER_INFO: Record<string, {
  geboortedatum: string; leeftijd: number; geboorteplaats: string
  lengte: string; debuut: string; wereldtitels: number
  carModel: string; motor: string; chassis: string; banden: string
  carOmschrijving: string
}> = {
   norris:     { geboortedatum: '13 nov. 1999', leeftijd: 26, geboorteplaats: 'Bristol, Engeland',    lengte: '1.75 m', debuut: '2019, Australië', wereldtitels: 0, carModel: 'MCL40',    motor: 'Mercedes',      chassis: 'MCL40',    banden: 'Pirelli', carOmschrijving: 'De MCL40 is McLarens bolide voor het 2026-seizoen. Met een vernieuwd aerodynamisch pakket en Mercedes power unit.' },
  piastri:    { geboortedatum: '6 apr. 2001',  leeftijd: 25, geboorteplaats: 'Melbourne, Australië', lengte: '1.78 m', debuut: '2023, Bahrein',   wereldtitels: 0, carModel: 'MCL40',    motor: 'Mercedes',      chassis: 'MCL40',    banden: 'Pirelli', carOmschrijving: 'De MCL40 is McLarens bolide voor het 2026-seizoen. Ontworpen voor maximale mechanische grip.' },
  verstappen: { geboortedatum: '30 sep. 1997', leeftijd: 28, geboorteplaats: 'Hasselt, België',      lengte: '1.81 m', debuut: '2015, Australië', wereldtitels: 4, carModel: 'RB22',     motor: 'Red Bull Ford', chassis: 'RB22',     banden: 'Pirelli', carOmschrijving: 'De RB22 is Red Bulls wapen voor 2026. Ontworpen voor maximale downforce en aerodynamische efficiëntie.' },
  hadjar:     { geboortedatum: '28 sep. 2004', leeftijd: 21, geboorteplaats: 'Parijs, Frankrijk',    lengte: '1.71 m', debuut: '2025, Australië', wereldtitels: 0, carModel: 'RB22',     motor: 'Red Bull Ford', chassis: 'RB22',     banden: 'Pirelli', carOmschrijving: 'De RB22 is Red Bulls wapen voor 2026. Uitgerust met de gloednieuwe Red Bull Ford-krachtbron.' },
  leclerc:    { geboortedatum: '16 okt. 1997', leeftijd: 28, geboorteplaats: 'Monte Carlo, Monaco',  lengte: '1.80 m', debuut: '2018, Australië', wereldtitels: 0, carModel: 'SF-26',    motor: 'Ferrari',       chassis: 'SF-26',    banden: 'Pirelli', carOmschrijving: 'De SF-26 is Ferraris bolide voor 2026, gebouwd op een volledig nieuw technisch reglement.' },
  hamilton:   { geboortedatum: '7 jan. 1985',  leeftijd: 41, geboorteplaats: 'Stevenage, Engeland',  lengte: '1.74 m', debuut: '2007, Australië', wereldtitels: 7, carModel: 'SF-26',    motor: 'Ferrari',       chassis: 'SF-26',    banden: 'Pirelli', carOmschrijving: 'De SF-26 is Ferraris bolide voor 2026, gebouwd rond een herontworpen chassis en een sterke hybride motor.' },
  russell:    { geboortedatum: '15 feb. 1998', leeftijd: 28, geboorteplaats: 'Kings Lynn, Engeland', lengte: '1.85 m', debuut: '2019, Australië', wereldtitels: 0, carModel: 'W17',      motor: 'Mercedes',      chassis: 'W17',      banden: 'Pirelli', carOmschrijving: 'De W17 is Mercedes\' antwoord op de nieuwe technische reglementen voor het 2026-seizoen.' },
  antonelli:  { geboortedatum: '25 aug. 2006', leeftijd: 19, geboorteplaats: 'Bologna, Italië',      lengte: '1.72 m', debuut: '2025, Australië', wereldtitels: 0, carModel: 'W17',      motor: 'Mercedes',      chassis: 'W17',      banden: 'Pirelli', carOmschrijving: 'De W17 is Mercedes\' antwoord op de nieuwe reglementen, geoptimaliseerd voor actieve aerodynamica.' },
  alonso:     { geboortedatum: '29 jul. 1981', leeftijd: 44, geboorteplaats: 'Oviedo, Spanje',       lengte: '1.71 m', debuut: '2001, Australië', wereldtitels: 2, carModel: 'AMR26',    motor: 'Honda',         chassis: 'AMR26',    banden: 'Pirelli', carOmschrijving: 'De AMR26 is Aston Martins meest ambitieuze project ooit, aangedreven door Honda.' },
  stroll:     { geboortedatum: '29 okt. 1998', leeftijd: 27, geboorteplaats: 'Montréal, Canada',     lengte: '1.82 m', debuut: '2017, Australië', wereldtitels: 0, carModel: 'AMR26',    motor: 'Honda',         chassis: 'AMR26',    banden: 'Pirelli', carOmschrijving: 'De AMR26 is Aston Martins meest ambitieuze project ooit, ontworpen rond de nieuwe Honda-krachtbron.' },
  albon:      { geboortedatum: '23 mrt. 1996', leeftijd: 30, geboorteplaats: 'Londen, Engeland',     lengte: '1.86 m', debuut: '2019, Australië', wereldtitels: 0, carModel: 'FW47',     motor: 'Mercedes',      chassis: 'FW47',     banden: 'Pirelli', carOmschrijving: 'De FW47 is Williams\' bolide voor 2026, gebouwd voor maximale wendbaarheid en snelheid.' },
  sainz:      { geboortedatum: '1 sep. 1994',  leeftijd: 31, geboorteplaats: 'Madrid, Spanje',       lengte: '1.78 m', debuut: '2015, Australië', wereldtitels: 0, carModel: 'FW47',     motor: 'Mercedes',      chassis: 'FW47',     banden: 'Pirelli', carOmschrijving: 'De FW47 is Williams\' bolide voor 2026, geoptimaliseerd om te presteren onder de nieuwe motorregels.' },
  lawson:     { geboortedatum: '11 feb. 2002', leeftijd: 24, geboorteplaats: 'Hastings, Nieuw-Z.',   lengte: '1.75 m', debuut: '2023, Zandvoort', wereldtitels: 0, carModel: 'VCARB 02', motor: 'Red Bull Ford', chassis: 'VCARB02',  banden: 'Pirelli', carOmschrijving: 'De VCARB02 is Racing Bulls\' wapen voor 2026 met krachtige Red Bull Ford-ondersteuning.' },
  lindblad:   { geboortedatum: '26 sep. 2005', leeftijd: 20, geboorteplaats: 'Sheffield, Engeland',  lengte: '1.73 m', debuut: '2025, Australië', wereldtitels: 0, carModel: 'VCARB 02', motor: 'Red Bull Ford', chassis: 'VCARB02',  banden: 'Pirelli', carOmschrijving: 'De VCARB02 is Racing Bulls\' wapen voor 2026, ontworpen voor maximale mechanische grip.' },
  ocon:       { geboortedatum: '17 sep. 1996', leeftijd: 29, geboorteplaats: 'Évreux, Frankrijk',    lengte: '1.86 m', debuut: '2016, België',    wereldtitels: 0, carModel: 'VF-26',    motor: 'Ferrari',       chassis: 'VF-26',    banden: 'Pirelli', carOmschrijving: 'De VF-26 is Haas\' bolide voor 2026 met vertrouwde Ferrari power.' },
  bearman:    { geboortedatum: '8 mei 2005',   leeftijd: 21, geboorteplaats: 'Chelmsford, Engeland', lengte: '1.80 m', debuut: '2024, S.-Arabië', wereldtitels: 0, carModel: 'VF-26',    motor: 'Ferrari',       chassis: 'VF-26',    banden: 'Pirelli', carOmschrijving: 'De VF-26 is Haas\' bolide voor 2026, gebouwd voor maximale stabiliteit in de bochten.' },
  hulkenberg: { geboortedatum: '19 aug. 1987', leeftijd: 38, geboorteplaats: 'Emmerich, Duitsland',  lengte: '1.84 m', debuut: '2010, Bahrein',   wereldtitels: 0, carModel: 'C45',      motor: 'Audi',          chassis: 'C45',      banden: 'Pirelli', carOmschrijving: 'De C45 is de allereerste historische Audi-bolide in de Formule 1.' },
  bortoleto:  { geboortedatum: '14 okt. 2004', leeftijd: 21, geboorteplaats: 'São Paulo, Brazilië',  lengte: '1.73 m', debuut: '2025, Australië', wereldtitels: 0, carModel: 'C45',      motor: 'Audi',          chassis: 'C45',      banden: 'Pirelli', carOmschrijving: 'De C45 is de eerste Audi-bolide in de Formule 1, aangedreven door de fabrieksmotor uit Neuburg.' },
  gasly:      { geboortedatum: '7 feb. 1996',  leeftijd: 30, geboorteplaats: 'Rouen, Frankrijk',     lengte: '1.77 m', debuut: '2017, Maleisië',  wereldtitels: 0, carModel: 'A526',     motor: 'Mercedes',      chassis: 'A526',     banden: 'Pirelli', carOmschrijving: 'De A526 is Alpines bolide voor 2026, uitgerust met krachtige Mercedes power.' },
  colapinto:  { geboortedatum: '27 mei 2003',  leeftijd: 23, geboorteplaats: 'Pilar, Argentinië',    lengte: '1.76 m', debuut: '2024, Singapore', wereldtitels: 0, carModel: 'A526',     motor: 'Mercedes',      chassis: 'A526',     banden: 'Pirelli', carOmschrijving: 'De A526 is Alpines bolide voor 2026, gebouwd op een gloednieuw aerodynamisch concept.' },
  perez:      { geboortedatum: '26 jan. 1990', leeftijd: 36, geboorteplaats: 'Guadalajara, Mexico',  lengte: '1.73 m', debuut: '2011, Australië', wereldtitels: 0, carModel: 'CF-1',     motor: 'Ferrari',       chassis: 'CF-1',     banden: 'Pirelli', carOmschrijving: 'De CF-1 is Cadillacs debuutbolide in de Formule 1, uitgerust met een krachtige Ferrari-krachtbron.' },
  bottas:     { geboortedatum: '28 aug. 1989', leeftijd: 36, geboorteplaats: 'Nastola, Finland',     lengte: '1.73 m', debuut: '2013, Australië', wereldtitels: 0, carModel: 'CF-1',     motor: 'Ferrari',       chassis: 'CF-1',     banden: 'Pirelli', carOmschrijving: 'De CF-1 is Cadillacs debuutbolide in de Formule 1, gebouwd voor het nieuwe technische tijdperk.' },
}

const GRID_2026 = [
  { id: 'norris',     voornaam: 'Lando',     naam: 'NORRIS',     landCode: 'gb', nummer: 4,  teamId: 'mclaren',  teamNaam: 'McLaren Mastercard F1 Team'         },
  { id: 'piastri',    voornaam: 'Oscar',     naam: 'PIASTRI',    landCode: 'au', nummer: 81, teamId: 'mclaren',  teamNaam: 'McLaren Mastercard F1 Team'         },
  { id: 'verstappen', voornaam: 'Max',       naam: 'VERSTAPPEN', landCode: 'nl', nummer: 3,  teamId: 'redbull',  teamNaam: 'Oracle Red Bull Racing'             },
  { id: 'hadjar',     voornaam: 'Isack',     naam: 'HADJAR',     landCode: 'fr', nummer: 6,  teamId: 'redbull',  teamNaam: 'Oracle Red Bull Racing'             },
  { id: 'leclerc',    voornaam: 'Charles',   naam: 'LECLERC',    landCode: 'mc', nummer: 16, teamId: 'ferrari',  teamNaam: 'Scuderia Ferrari HP'                },
  { id: 'hamilton',   voornaam: 'Lewis',     naam: 'HAMILTON',   landCode: 'gb', nummer: 44, teamId: 'ferrari',  teamNaam: 'Scuderia Ferrari HP'                },
  { id: 'russell',    voornaam: 'George',    naam: 'RUSSELL',    landCode: 'gb', nummer: 63, teamId: 'mercedes', teamNaam: 'Mercedes-AMG PETRONAS F1 Team'      },
  { id: 'antonelli',  voornaam: 'Kimi',      naam: 'ANTONELLI',  landCode: 'it', nummer: 12, teamId: 'mercedes', teamNaam: 'Mercedes-AMG PETRONAS F1 Team'      },
  { id: 'alonso',     voornaam: 'Fernando',  naam: 'ALONSO',     landCode: 'es', nummer: 14, teamId: 'aston',    teamNaam: 'Aston Martin Aramco F1 Team'        },
  { id: 'stroll',     voornaam: 'Lance',     naam: 'STROLL',     landCode: 'ca', nummer: 18, teamId: 'aston',    teamNaam: 'Aston Martin Aramco F1 Team'        },
  { id: 'albon',      voornaam: 'Alexander', naam: 'ALBON',      landCode: 'th', nummer: 23, teamId: 'williams', teamNaam: 'Atlassian Williams F1 Team'         },
  { id: 'sainz',      voornaam: 'Carlos',    naam: 'SAINZ',      landCode: 'es', nummer: 55, teamId: 'williams', teamNaam: 'Atlassian Williams F1 Team'         },
  { id: 'lawson',     voornaam: 'Liam',      naam: 'LAWSON',     landCode: 'nz', nummer: 30, teamId: 'rb',       teamNaam: 'Visa Cash App Racing Bulls F1 Team' },
  { id: 'lindblad',   voornaam: 'Arvid',     naam: 'LINDBLAD',   landCode: 'gb', nummer: 41, teamId: 'rb',       teamNaam: 'Visa Cash App Racing Bulls F1 Team' },
  { id: 'ocon',       voornaam: 'Esteban',   naam: 'OCON',       landCode: 'fr', nummer: 31, teamId: 'haas',     teamNaam: 'TGR Haas F1 Team'                   },
  { id: 'bearman',    voornaam: 'Oliver',    naam: 'BEARMAN',    landCode: 'gb', nummer: 87, teamId: 'haas',     teamNaam: 'TGR Haas F1 Team'                   },
  { id: 'hulkenberg', voornaam: 'Nico',      naam: 'HÜLKENBERG', landCode: 'de', nummer: 27, teamId: 'audi',     teamNaam: 'Audi Revolut F1 Team'               },
  { id: 'bortoleto',  voornaam: 'Gabriel',   naam: 'BORTOLETO',  landCode: 'br', nummer: 5,  teamId: 'audi',     teamNaam: 'Audi Revolut F1 Team'               },
  { id: 'gasly',      voornaam: 'Pierre',    naam: 'GASLY',      landCode: 'fr', nummer: 10, teamId: 'alpine',   teamNaam: 'BWT Alpine F1 Team'                 },
  { id: 'colapinto',  voornaam: 'Franco',    naam: 'COLAPINTO',  landCode: 'ar', nummer: 43, teamId: 'alpine',   teamNaam: 'BWT Alpine F1 Team'                 },
  { id: 'perez',      voornaam: 'Sergio',    naam: 'PÉREZ',      landCode: 'mx', nummer: 11, teamId: 'cadillac', teamNaam: 'Cadillac Formula 1 Team'            },
  { id: 'bottas',     voornaam: 'Valtteri',  naam: 'BOTTAS',     landCode: 'fi', nummer: 77, teamId: 'cadillac', teamNaam: 'Cadillac Formula 1 Team'            }

]

type Rijder = typeof GRID_2026[0]

// ─── Jolpica API: live standings ──────────────────────────────────────────────
interface Standing { pos: number; code: string; naam: string; team: string; punten: number; teamId: string }

async function fetchStandings(): Promise<Standing[]> {
  try {
    const r = await fetch('https://api.jolpi.ca/ergast/f1/current/driverstandings.json')
    const d = await r.json()
    const lijst = d?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
    return lijst.slice(0, 5).map((s: any) => ({
      pos:    parseInt(s.position),
      code:   s.Driver.code,
      naam:   `${s.Driver.familyName[0]}. ${s.Driver.familyName}`,
      team:   s.Constructors?.[0]?.name ?? '',
      punten: parseFloat(s.points),
      teamId: s.Constructors?.[0]?.constructorId ?? '',
    }))
  } catch { return [] }
}

async function fetchRijderStats(driverId: string): Promise<{ races: number; wins: number; podiums: number; poles: number; punten: number; kampioen: number }> {
  try {
    const r = await fetch(`https://api.jolpi.ca/ergast/f1/current/drivers/${driverId}/results.json?limit=100`)
    const d = await r.json()
    const races = d?.MRData?.RaceTable?.Races ?? []
    let wins = 0, podiums = 0, punten = 0
    races.forEach((race: any) => {
      const res = race.Results?.[0]
      if (!res) return
      const pos = parseInt(res.position)
      if (pos === 1) wins++
      if (pos <= 3) podiums++
      punten += parseFloat(res.points ?? '0')
    })
    return { races: races.length, wins, podiums, poles: 0, punten, kampioen: 1 }
  } catch { return { races: 0, wins: 0, podiums: 0, poles: 0, punten: 0, kampioen: 0 } }
}

// Jolpica driver ID mapping
const JOLPICA_ID: Record<string, string> = {
  norris: 'norris', piastri: 'piastri', verstappen: 'max_verstappen',
  leclerc: 'leclerc', hamilton: 'hamilton', russell: 'russell',
  alonso: 'alonso', sainz: 'sainz', gasly: 'gasly', albon: 'albon',
  ocon: 'ocon', hulkenberg: 'hulkenberg', bottas: 'bottas',
  stroll: 'stroll', lawson: 'lawson', perez: 'perez',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function CarImg({ teamId, style }: { teamId: string; style?: React.CSSProperties }) {
  return (
    <img src={`/f1/cars/${teamId}.webp`} alt={teamId} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `/f1/cars/${teamId}.svg`
        else if (img.src.includes('.svg')) img.src = `/f1/cars/${teamId}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

function DriverImg({ rijder, style }: { rijder: Rijder; style?: React.CSSProperties }) {
  return (
    <img src={`/f1/drivers/${rijder.id}.webp`} alt={rijder.naam} style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `/f1/drivers/${rijder.id}.png`
        else img.style.visibility = 'hidden'
      }} />
  )
}

// ─── PREMIUM POPUP ────────────────────────────────────────────────────────────
function RijderPopup({ rijder, onSluit }: { rijder: Rijder; onSluit: () => void }) {
  const kleur   = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD
  const info    = RIJDER_INFO[rijder.id]
  const [tab, setTab]           = useState<'overzicht' | 'auto' | 'stats'>('overzicht')
  const [standings, setStandings] = useState<Standing[]>([])
  const [stats, setStats]         = useState<{ races: number; wins: number; podiums: number; poles: number; punten: number; kampioen: number } | null>(null)
  const [ladenStats, setLadenStats] = useState(false)

  useEffect(() => {
    fetchStandings().then(setStandings)
  }, [])

  useEffect(() => {
    if (tab === 'stats') {
      const jid = JOLPICA_ID[rijder.id]
      if (jid) {
        setLadenStats(true)
        fetchRijderStats(jid).then(s => { setStats(s); setLadenStats(false) })
      }
    }
  }, [tab, rijder.id])

  const tabs: { id: 'overzicht' | 'auto' | 'stats'; label: string }[] = [
    { id: 'overzicht', label: 'Overzicht' },
    { id: 'auto',      label: 'Auto' },
    { id: 'stats',     label: 'Statistieken' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)' }} onClick={onSluit}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden flex"
        style={{ background: '#0f0f0f', border: `1px solid ${kleur}50`, maxHeight: '90vh', minHeight: 500 }}
        onClick={e => e.stopPropagation()}>

        {/* ── LINKER PANEEL: rijder foto + persoonlijke info ── */}
        <div className="relative flex-shrink-0 flex flex-col" style={{ width: 240, background: `linear-gradient(180deg, ${kleur}22 0%, #0a0a0a 60%)` }}>

          {/* Team naam balk */}
          <div className="px-5 pt-4 pb-1">
            <span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{ color: kleur }}>
              {rijder.teamNaam}
            </span>
          </div>

          {/* Naam + nummer */}
          <div className="px-5 pb-2">
            <div className="font-ui text-base text-white/70">{rijder.voornaam}</div>
            <div className="font-head font-black text-3xl uppercase text-white leading-tight">{rijder.naam}</div>
            <div className="flex items-center gap-2 mt-1">
              <img src={`/f1/flags/${rijder.landCode}.svg`} alt={rijder.landCode}
                className="rounded-sm" style={{ width: 24, height: 16, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }} />
              <span className="font-ui text-xs text-white/50 uppercase">{rijder.landCode}</span>
            </div>
            <div className="mt-2">
              <span className="font-ui text-[10px] font-bold uppercase px-2 py-1 rounded"
                style={{ background: kleur + '22', color: kleur, border: `1px solid ${kleur}44` }}>
                {rijder.teamNaam.split(' ')[0]}
              </span>
            </div>
          </div>

          {/* Rijder foto */}
          <div className="relative flex-1 overflow-hidden mx-3 rounded-xl" style={{ minHeight: 200 }}>
            <DriverImg rijder={rijder} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
            <div className="absolute bottom-0 left-0 right-0 h-20" style={{ background: 'linear-gradient(transparent, #0a0a0a)' }} />
            {/* Groot nummer overlay */}
            <div className="absolute bottom-2 right-3 font-head font-black text-5xl leading-none"
              style={{ color: kleur, opacity: 0.4 }}>
              {rijder.nummer}
            </div>
          </div>

          {/* Persoonlijke info onderaan */}
          {info && (
            <div className="px-4 py-4 space-y-2">
              {[
                { icon: '📅', label: 'Geboortedatum', val: `${info.geboortedatum} (${info.leeftijd})` },
                { icon: '📍', label: 'Geboorteplaats', val: info.geboorteplaats },
                { icon: '📏', label: 'Lengte',         val: info.lengte },
                { icon: '🏆', label: 'Debuut',         val: info.debuut },
                { icon: '🌍', label: 'Wereldtitels',   val: String(info.wereldtitels) },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 flex-shrink-0">{icon}</span>
                  <div>
                    <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                    <div className="font-ui text-xs text-white/80">{val}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RECHTER PANEEL: tabs + content ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tabs + sluit */}
          <div className="flex items-center justify-between px-6 pt-5 pb-0" style={{ borderBottom: `1px solid ${kleur}25` }}>
            <div className="flex gap-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="font-ui text-xs font-bold uppercase tracking-wider px-4 py-2.5 transition-all"
                  style={tab === t.id
                    ? { color: kleur, borderBottom: `2px solid ${kleur}` }
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

          {/* Tab inhoud */}
          <div className="flex-1 overflow-y-auto px-6 py-5">

            {/* ── OVERZICHT TAB ── */}
            {tab === 'overzicht' && (
              <div className="space-y-5">
                {/* Team + nummer + nationaliteit */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Team',         val: rijder.teamNaam },
                    { label: 'Racenummer',   val: String(rijder.nummer) },
                    { label: 'Nationaliteit', val: rijder.landCode.toUpperCase() },
                  ].map(({ label, val }) => (
                    <div key={label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mb-1">{label}</div>
                      <div className="font-ui text-sm font-semibold text-white truncate">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Auto preview */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                    <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">
                      {info?.carModel ?? rijder.teamId.toUpperCase()} · 2026 Car
                    </span>
                  </div>
                  <div className="rounded-xl flex items-center justify-center p-4"
                    style={{ background: `linear-gradient(135deg, ${kleur}12, rgba(255,255,255,0.02))`, border: `1px solid ${kleur}25`, height: 120 }}>
                    <CarImg teamId={rijder.teamId} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 4px 16px ${kleur}50)` }} />
                  </div>
                </div>

                {/* Kampioenschapsstand */}
                {standings.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                      <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Kampioenschapsstand 2026</span>
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                      {standings.map((s, i) => (
                        <div key={s.code} className="flex items-center gap-3 px-4 py-2.5"
                          style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderBottom: i < standings.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <span className="font-head font-black text-sm w-5 text-center" style={{ color: i === 0 ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}>{s.pos}</span>
                          <span className="font-ui text-xs text-white/70 flex-1 truncate">{s.naam}</span>
                          <span className="font-ui text-[10px] text-white/40 truncate">{s.team}</span>
                          <span className="font-head font-black text-sm" style={{ color: kleur }}>{s.punten}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── AUTO TAB ── */}
            {tab === 'auto' && info && (
              <div className="space-y-5">
                <div>
                  <div className="font-head font-black text-2xl text-white mb-0.5">{info.carModel}</div>
                  <div className="font-ui text-xs text-white/40 uppercase tracking-wider">2026 Seizoen</div>
                </div>

                {/* Auto groot */}
                <div className="rounded-2xl flex items-center justify-center p-6"
                  style={{ background: `linear-gradient(135deg, ${kleur}15, rgba(255,255,255,0.02))`, border: `1px solid ${kleur}30`, height: 160 }}>
                  <CarImg teamId={rijder.teamId} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: `drop-shadow(0 6px 20px ${kleur}60)` }} />
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '⚙️', label: 'Motor',      val: info.motor },
                    { icon: '🏗️', label: 'Chassis',    val: info.chassis },
                    { icon: '🚗', label: 'Aandrijving', val: 'Achterwielaandrijving' },
                    { icon: '🔄', label: 'Banden',      val: info.banden },
                  ].map(({ icon, label, val }) => (
                    <div key={label} className="rounded-xl p-3 flex items-center gap-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <span className="text-lg">{icon}</span>
                      <div>
                        <div className="font-ui text-[9px] uppercase tracking-wider text-white/30">{label}</div>
                        <div className="font-ui text-sm font-semibold text-white">{val}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Omschrijving */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="font-ui text-sm text-white/60 leading-relaxed">{info.carOmschrijving}</p>
                </div>
              </div>
            )}

            {/* ── STATISTIEKEN TAB ── */}
            {tab === 'stats' && (
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                  <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Seizoenstatistieken 2026</span>
                </div>

                {ladenStats ? (
                  <div className="flex items-center gap-3 py-8 justify-center">
                    <div className="w-5 h-5 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: kleur }} />
                    <span className="font-ui text-sm text-white/40">Statistieken laden...</span>
                  </div>
                ) : stats ? (
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: '🏁', label: 'Races',          val: stats.races },
                      { icon: '🏆', label: 'Overwinningen',  val: stats.wins },
                      { icon: '🥇', label: 'Podiums',        val: stats.podiums },
                      { icon: '⚡', label: 'Poles',          val: stats.poles },
                      { icon: '⏱️', label: 'Snelste rondes', val: '—' },
                      { icon: '📊', label: 'Punten',         val: stats.punten },
                    ].map(({ icon, label, val }) => (
                      <div key={label} className="rounded-xl p-4 text-center"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                        <div className="text-xl mb-1">{icon}</div>
                        <div className="font-head font-black text-2xl" style={{ color: kleur }}>{val}</div>
                        <div className="font-ui text-[9px] uppercase tracking-wider text-white/30 mt-1">{label}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center font-ui text-sm text-white/30">Geen statistieken beschikbaar.</div>
                )}

                {/* Kampioenschap positie */}
                {standings.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-4 h-0.5 rounded-full" style={{ background: kleur }} />
                      <span className="font-ui text-[10px] uppercase tracking-[2px] text-white/40">Kampioenschapsstand 2026</span>
                    </div>
                    <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                      {standings.map((s, i) => (
                        <div key={s.code} className="flex items-center gap-3 px-4 py-2.5"
                          style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent', borderBottom: i < standings.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                          <span className="font-head font-black text-sm w-5 text-center" style={{ color: i === 0 ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}>{s.pos}</span>
                          <span className="font-ui text-xs text-white/70 flex-1 truncate">{s.naam}</span>
                          <span className="font-head font-black text-sm" style={{ color: kleur }}>{s.punten}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Rijder rij ───────────────────────────────────────────────────────────────
function RijderRij({ rijder, isEven, onKlik }: { rijder: Rijder; isEven: boolean; onKlik: () => void }) {
  const kleur = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD
  return (
    <div className="relative grid items-center group transition-all cursor-pointer hover:brightness-110"
      style={{ gridTemplateColumns: '40px 96px 280px 60px 220px 1fr', background: isEven ? 'rgba(255,255,255,0.03)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.06)', minHeight: 80 }}
      onClick={onKlik}>
      <div className="absolute left-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-r" style={{ background: kleur }} />
      {/* Vlag */}
      <div className="flex items-center justify-center pl-3">
        <img src={`/f1/flags/${rijder.landCode}.svg`} alt={rijder.landCode} className="rounded-sm"
          style={{ width: 28, height: 18, objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }} />
      </div>
      {/* Foto */}
      <div className="flex items-center justify-center py-2">
        <div className="overflow-hidden rounded-lg" style={{ width: 96, height: 72 }}>
          <DriverImg rijder={rijder} style={{ width: 96, height: 72, objectFit: 'cover', objectPosition: 'top center' }} />
        </div>
      </div>
      {/* Naam */}
      <div className="flex items-center gap-2 px-4">
        <span className="font-ui text-sm text-white/40 group-hover:text-white/70 transition-colors whitespace-nowrap">{rijder.voornaam}</span>
        <span className="font-head font-black text-lg uppercase text-white tracking-wide whitespace-nowrap">{rijder.naam}</span>
      </div>
      {/* Nummer */}
      <div className="flex items-center justify-center">
        <span className="font-head font-black text-sm w-11 h-8 flex items-center justify-center rounded"
          style={{ background: kleur + '33', color: kleur, border: `1px solid ${kleur}55` }}>
          {rijder.nummer}
        </span>
      </div>
      {/* Auto */}
      <div className="flex items-center justify-center rounded-lg mx-2"
        style={{ height: 56, background: `linear-gradient(135deg, ${kleur}15, rgba(255,255,255,0.03))`, border: `1px solid ${kleur}25` }}>
        <CarImg teamId={rijder.teamId} style={{ width: 210, height: 48, objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.7))' }} />
      </div>
      {/* Teamnaam */}
      <div className="flex items-center gap-2 px-4">
        <div className="w-0.5 self-stretch my-3 rounded-full flex-shrink-0" style={{ background: kleur }} />
        <span className="font-ui text-sm text-white/40 group-hover:text-white transition-colors truncate">{rijder.teamNaam}</span>
      </div>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function F1() {
  const [zoek, setZoek]             = useState('')
  const [teamFilter, setTeamFilter] = useState<string | null>(null)
  const [popup, setPopup]           = useState<Rijder | null>(null)

  const teams = Array.from(new Set(GRID_2026.map(r => r.teamId)))
    .map(id => ({ id, naam: GRID_2026.find(r => r.teamId === id)!.teamNaam }))

  const gefilterd = GRID_2026.filter(r => {
    const matchTeam = !teamFilter || r.teamId === teamFilter
    const matchZoek = !zoek || `${r.voornaam} ${r.naam} ${r.teamNaam}`.toLowerCase().includes(zoek.toLowerCase())
    return matchTeam && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
      <div className="mb-1" style={{ color: F1_ROOD }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-8">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          Formula <span style={{ color: F1_ROOD }}>1</span>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">Volledige grid · {GRID_2026.length} rijders · 11 teams</span>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input type="text" placeholder="Zoek rijder of team..." value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none focus:border-red-600 transition-colors w-full md:w-64" />
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setTeamFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!teamFilter ? { background: F1_ROOD + '22', borderColor: F1_ROOD, color: F1_ROOD } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
            Alle
          </button>
          {teams.map(t => {
            const kleur = TEAM_KLEUREN[t.id] ?? F1_ROOD
            const actief = teamFilter === t.id
            return (
              <button key={t.id} onClick={() => setTeamFilter(actief ? null : t.id)}
                className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
                style={actief ? { background: kleur + '22', borderColor: kleur, color: kleur } : { background: 'transparent', borderColor: '#333', color: '#555' }}>
                {t.naam.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        <div className="grid items-center"
          style={{ gridTemplateColumns: '40px 96px 280px 60px 220px 1fr', background: '#0a0a0a', borderBottom: '1px solid #222' }}>
          <div /><div />
          <div className="px-4 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Driver</span></div>
          <div className="flex justify-center py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">#</span></div>
          <div className="px-2 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Car</span></div>
          <div className="px-4 py-3"><span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Team</span></div>
        </div>
        {gefilterd.map((r, i) => (
          <RijderRij key={r.id} rijder={r} isEven={i % 2 === 0} onKlik={() => setPopup(r)} />
        ))}
        {gefilterd.length === 0 && (
          <div className="py-16 text-center font-ui text-sm text-white/30">Geen rijders gevonden.</div>
        )}
      </div>

      {popup && <RijderPopup rijder={popup} onSluit={() => setPopup(null)} />}
    </div>
  )
}
