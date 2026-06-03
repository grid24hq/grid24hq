// ─── F1 2026 Grid pagina — lijst layout ───────────────────────────────────────
// Vlag SVGs:   public/f1/flags/{land_code}.svg   → past zich aan naar formaat
// Auto SVGs:   public/f1/cars/{team_id}.svg      → past zich aan naar formaat
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react'

const F1_ROOD = '#e10600'

const TEAM_KLEUREN: Record<string, string> = {
  ferrari:  '#e8002d',
  redbull:  '#3671c6',
  mercedes: '#27f4d2',
  mclaren:  '#ff8000',
  aston:    '#229971',
  alpine:   '#0093cc',
  williams: '#64c4ff',
  rb:       '#6692ff',
  sauber:   '#52e252',
  haas:     '#b6babd',
  cadillac: '#cc0000',
}

const GRID_2026 = [
  { id: 'verstappen',  voornaam: 'Max',       naam: 'VERSTAPPEN', landCode: 'nl', nummer: 1,  teamId: 'redbull',  teamNaam: 'Oracle Red Bull Racing'        },
  { id: 'tsunoda',     voornaam: 'Yuki',      naam: 'TSUNODA',    landCode: 'jp', nummer: 22, teamId: 'redbull',  teamNaam: 'Oracle Red Bull Racing'        },
  { id: 'leclerc',     voornaam: 'Charles',   naam: 'LECLERC',    landCode: 'mc', nummer: 16, teamId: 'ferrari',  teamNaam: 'Scuderia Ferrari'               },
  { id: 'hamilton',    voornaam: 'Lewis',     naam: 'HAMILTON',   landCode: 'gb', nummer: 44, teamId: 'ferrari',  teamNaam: 'Scuderia Ferrari'               },
  { id: 'russell',     voornaam: 'George',    naam: 'RUSSELL',    landCode: 'gb', nummer: 63, teamId: 'mercedes', teamNaam: 'Mercedes-AMG Petronas F1 Team'  },
  { id: 'antonelli',   voornaam: 'Kimi',      naam: 'ANTONELLI',  landCode: 'it', nummer: 12, teamId: 'mercedes', teamNaam: 'Mercedes-AMG Petronas F1 Team'  },
  { id: 'norris',      voornaam: 'Lando',     naam: 'NORRIS',     landCode: 'gb', nummer: 4,  teamId: 'mclaren',  teamNaam: 'McLaren Formula 1 Team'         },
  { id: 'piastri',     voornaam: 'Oscar',     naam: 'PIASTRI',    landCode: 'au', nummer: 81, teamId: 'mclaren',  teamNaam: 'McLaren Formula 1 Team'         },
  { id: 'alonso',      voornaam: 'Fernando',  naam: 'ALONSO',     landCode: 'es', nummer: 14, teamId: 'aston',    teamNaam: 'Aston Martin Aramco F1 Team'    },
  { id: 'stroll',      voornaam: 'Lance',     naam: 'STROLL',     landCode: 'ca', nummer: 18, teamId: 'aston',    teamNaam: 'Aston Martin Aramco F1 Team'    },
  { id: 'gasly',       voornaam: 'Pierre',    naam: 'GASLY',      landCode: 'fr', nummer: 10, teamId: 'alpine',   teamNaam: 'Alpine F1 Team'                 },
  { id: 'doohan',      voornaam: 'Jack',      naam: 'DOOHAN',     landCode: 'au', nummer: 7,  teamId: 'alpine',   teamNaam: 'Alpine F1 Team'                 },
  { id: 'sainz',       voornaam: 'Carlos',    naam: 'SAINZ',      landCode: 'es', nummer: 55, teamId: 'williams', teamNaam: 'Williams Racing'                },
  { id: 'albon',       voornaam: 'Alexander', naam: 'ALBON',      landCode: 'th', nummer: 23, teamId: 'williams', teamNaam: 'Williams Racing'                },
  { id: 'lawson',      voornaam: 'Liam',      naam: 'LAWSON',     landCode: 'nz', nummer: 30, teamId: 'rb',       teamNaam: 'Visa Cash App Racing Bulls'     },
  { id: 'hadjar',      voornaam: 'Isack',     naam: 'HADJAR',     landCode: 'fr', nummer: 6,  teamId: 'rb',       teamNaam: 'Visa Cash App Racing Bulls'     },
  { id: 'hulkenberg',  voornaam: 'Nico',      naam: 'HÜLKENBERG', landCode: 'de', nummer: 27, teamId: 'sauber',   teamNaam: 'Stake F1 Team Sauber'           },
  { id: 'bortoleto',   voornaam: 'Gabriel',   naam: 'BORTOLETO',  landCode: 'br', nummer: 5,  teamId: 'sauber',   teamNaam: 'Stake F1 Team Sauber'           },
  { id: 'ocon',        voornaam: 'Esteban',   naam: 'OCON',       landCode: 'fr', nummer: 31, teamId: 'haas',     teamNaam: 'Haas F1 Team'                   },
  { id: 'bearman',     voornaam: 'Oliver',    naam: 'BEARMAN',    landCode: 'gb', nummer: 87, teamId: 'haas',     teamNaam: 'Haas F1 Team'                   },
  { id: 'perez',       voornaam: 'Sergio',    naam: 'PÉREZ',      landCode: 'mx', nummer: 11, teamId: 'cadillac', teamNaam: 'Cadillac F1 Team'               },
  { id: 'bottas',      voornaam: 'Valtteri',  naam: 'BOTTAS',     landCode: 'fi', nummer: 77, teamId: 'cadillac', teamNaam: 'Cadillac F1 Team'               },
]

// ─── Rijder rij ───────────────────────────────────────────────────────────────
function RijderRij({ rijder, isEven }: { rijder: typeof GRID_2026[0]; isEven: boolean }) {
  const teamKleur = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD

  return (
    <div
      className="flex items-center gap-0 group transition-colors"
      style={{
        background: isEven ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Hover highlight */}
      <div
        className="absolute left-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-r"
        style={{ background: teamKleur }}
      />

      {/* ── DRIVER kolom ── */}
      <div className="flex items-center gap-3 px-4 py-3 flex-1 min-w-0">
        {/* Vlag */}
        <img
          src={`/f1/flags/${rijder.landCode}.svg`}
          alt={rijder.landCode}
          className="flex-shrink-0 rounded-sm"
          style={{ width: 36, height: 24, objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }}
        />
        {/* Naam */}
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-ui text-sm text-brand-muted group-hover:text-white transition-colors truncate">
            {rijder.voornaam}
          </span>
          <span className="font-head font-black text-base uppercase text-white tracking-wide truncate">
            {rijder.naam}
          </span>
        </div>
        {/* Nummer badge */}
        <span
          className="flex-shrink-0 font-head font-black text-xs px-2 py-0.5 rounded ml-auto"
          style={{ background: teamKleur + '33', color: teamKleur, border: `1px solid ${teamKleur}55` }}
        >
          {rijder.nummer}
        </span>
      </div>

      {/* ── TEAM kolom ── */}
      <div className="flex items-center gap-3 px-4 py-2 w-[55%] min-w-0">
        {/* Auto SVG — past zich aan naar beschikbare ruimte */}
        <div className="flex-shrink-0" style={{ width: 120, height: 48 }}>
          <img
            src={`/f1/cars/${rijder.teamId}.svg`}
            alt={rijder.teamNaam}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => {
              // Probeer PNG als SVG niet bestaat
              const img = e.currentTarget as HTMLImageElement
              if (!img.src.endsWith('.png')) {
                img.src = `/f1/cars/${rijder.teamId}.png`
              } else {
                img.style.visibility = 'hidden'
              }
            }}
          />
        </div>

        {/* Team kleur streep + naam */}
        <div
          className="w-0.5 flex-shrink-0 self-stretch my-1 rounded-full"
          style={{ background: teamKleur }}
        />
        <span className="font-ui text-sm text-brand-muted group-hover:text-white transition-colors truncate">
          {rijder.teamNaam}
        </span>
      </div>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function F1() {
  const [zoek, setZoek]           = useState('')
  const [teamFilter, setTeamFilter] = useState<string | null>(null)

  const teams = Array.from(new Set(GRID_2026.map(r => r.teamId)))
    .map(id => ({ id, naam: GRID_2026.find(r => r.teamId === id)!.teamNaam }))

  const gefilterd = GRID_2026.filter(r => {
    const matchTeam = !teamFilter || r.teamId === teamFilter
    const matchZoek = !zoek || `${r.voornaam} ${r.naam} ${r.teamNaam}`.toLowerCase().includes(zoek.toLowerCase())
    return matchTeam && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* ── Header ── */}
      <div className="mb-1" style={{ color: F1_ROOD }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-8">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          Formula <span style={{ color: F1_ROOD }}>1</span>
        </h1>
        <span className="font-ui text-sm text-brand-muted md:mb-1">Volledige grid · {GRID_2026.length} rijders · 11 teams</span>
      </div>

      {/* ── Filter balk ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Zoek rijder of team..."
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none focus:border-red-600 transition-colors w-full md:w-60"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTeamFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!teamFilter
              ? { background: F1_ROOD + '22', borderColor: F1_ROOD, color: F1_ROOD }
              : { background: 'transparent', borderColor: '#333', color: '#666' }}
          >Alle</button>
          {teams.map(t => {
            const kleur = TEAM_KLEUREN[t.id] ?? F1_ROOD
            const actief = teamFilter === t.id
            return (
              <button key={t.id}
                onClick={() => setTeamFilter(actief ? null : t.id)}
                className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
                style={actief
                  ? { background: kleur + '22', borderColor: kleur, color: kleur }
                  : { background: 'transparent', borderColor: '#333', color: '#666' }}
              >
                {t.naam.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="rounded-xl overflow-hidden relative" style={{ background: '#111', border: '1px solid #222' }}>

        {/* Header rij */}
        <div className="flex items-center" style={{ background: '#0d0d0d', borderBottom: '2px solid #222' }}>
          <div className="flex-1 px-4 py-3">
            <span className="font-ui text-xs font-bold uppercase tracking-[2px] text-white">Driver</span>
          </div>
          <div className="w-[55%] px-4 py-3">
            <span className="font-ui text-xs font-bold uppercase tracking-[2px] text-white">Team</span>
          </div>
        </div>

        {/* Rijders */}
        {gefilterd.map((rijder, i) => (
          <RijderRij key={rijder.id} rijder={rijder} isEven={i % 2 === 0} />
        ))}

        {gefilterd.length === 0 && (
          <div className="py-16 text-center font-ui text-sm text-brand-muted">
            Geen rijders gevonden.
          </div>
        )}
      </div>

    </div>
  )
}
