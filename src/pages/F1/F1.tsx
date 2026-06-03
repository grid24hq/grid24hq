// ─── F1 2026 Grid pagina — lijst layout met popup ─────────────────────────────
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
  audi:     '#bb0a14',
  haas:     '#b6babd',
  cadillac: '#cc0000',
}

const GRID_2026 = [
  { id: 'norris',      voornaam: 'Lando',     naam: 'NORRIS',     landCode: 'gb', nummer: 1,  teamId: 'mclaren',  teamNaam: 'McLaren Mastercard F1 Team'         },
  { id: 'piastri',     voornaam: 'Oscar',     naam: 'PIASTRI',    landCode: 'au', nummer: 81, teamId: 'mclaren',  teamNaam: 'McLaren Mastercard F1 Team'         },
  { id: 'verstappen',  voornaam: 'Max',       naam: 'VERSTAPPEN', landCode: 'nl', nummer: 3,  teamId: 'redbull',  teamNaam: 'Oracle Red Bull Racing'             },
  { id: 'hadjar',      voornaam: 'Isack',     naam: 'HADJAR',     landCode: 'fr', nummer: 6,  teamId: 'redbull',  teamNaam: 'Oracle Red Bull Racing'             },
  { id: 'leclerc',     voornaam: 'Charles',   naam: 'LECLERC',    landCode: 'mc', nummer: 16, teamId: 'ferrari',  teamNaam: 'Scuderia Ferrari HP'                },
  { id: 'hamilton',    voornaam: 'Lewis',     naam: 'HAMILTON',   landCode: 'gb', nummer: 44, teamId: 'ferrari',  teamNaam: 'Scuderia Ferrari HP'                },
  { id: 'russell',     voornaam: 'George',    naam: 'RUSSELL',    landCode: 'gb', nummer: 63, teamId: 'mercedes', teamNaam: 'Mercedes-AMG PETRONAS F1 Team'      },
  { id: 'antonelli',   voornaam: 'Kimi',      naam: 'ANTONELLI',  landCode: 'it', nummer: 12, teamId: 'mercedes', teamNaam: 'Mercedes-AMG PETRONAS F1 Team'      },
  { id: 'alonso',      voornaam: 'Fernando',  naam: 'ALONSO',     landCode: 'es', nummer: 14, teamId: 'aston',    teamNaam: 'Aston Martin Aramco F1 Team'        },
  { id: 'stroll',      voornaam: 'Lance',     naam: 'STROLL',     landCode: 'ca', nummer: 18, teamId: 'aston',    teamNaam: 'Aston Martin Aramco F1 Team'        },
  { id: 'albon',       voornaam: 'Alexander', naam: 'ALBON',      landCode: 'th', nummer: 23, teamId: 'williams', teamNaam: 'Atlassian Williams F1 Team'         },
  { id: 'sainz',       voornaam: 'Carlos',    naam: 'SAINZ',      landCode: 'es', nummer: 55, teamId: 'williams', teamNaam: 'Atlassian Williams F1 Team'         },
  { id: 'lawson',      voornaam: 'Liam',      naam: 'LAWSON',     landCode: 'nz', nummer: 30, teamId: 'rb',       teamNaam: 'Visa Cash App Racing Bulls F1 Team' },
  { id: 'lindblad',    voornaam: 'Arvid',     naam: 'LINDBLAD',   landCode: 'gb', nummer: 41, teamId: 'rb',       teamNaam: 'Visa Cash App Racing Bulls F1 Team' },
  { id: 'ocon',        voornaam: 'Esteban',   naam: 'OCON',       landCode: 'fr', nummer: 31, teamId: 'haas',     teamNaam: 'TGR Haas F1 Team'                  },
  { id: 'bearman',     voornaam: 'Oliver',    naam: 'BEARMAN',    landCode: 'gb', nummer: 87, teamId: 'haas',     teamNaam: 'TGR Haas F1 Team'                  },
  { id: 'hulkenberg',  voornaam: 'Nico',      naam: 'HÜLKENBERG', landCode: 'de', nummer: 27, teamId: 'audi',     teamNaam: 'Audi Revolut F1 Team'              },
  { id: 'bortoleto',   voornaam: 'Gabriel',   naam: 'BORTOLETO',  landCode: 'br', nummer: 5,  teamId: 'audi',     teamNaam: 'Audi Revolut F1 Team'              },
  { id: 'gasly',       voornaam: 'Pierre',    naam: 'GASLY',      landCode: 'fr', nummer: 10, teamId: 'alpine',   teamNaam: 'BWT Alpine F1 Team'                },
  { id: 'colapinto',   voornaam: 'Franco',    naam: 'COLAPINTO',  landCode: 'ar', nummer: 43, teamId: 'alpine',   teamNaam: 'BWT Alpine F1 Team'                },
  { id: 'perez',       voornaam: 'Sergio',    naam: 'PÉREZ',      landCode: 'mx', nummer: 11, teamId: 'cadillac', teamNaam: 'Cadillac Formula 1 Team'            },
  { id: 'bottas',      voornaam: 'Valtteri',  naam: 'BOTTAS',     landCode: 'fi', nummer: 77, teamId: 'cadillac', teamNaam: 'Cadillac Formula 1 Team'            },
]

type Rijder = typeof GRID_2026[0]

// ─── Helper: auto afbeelding met fallback ─────────────────────────────────────
function CarImg({ teamId, style }: { teamId: string; style?: React.CSSProperties }) {
  return (
    <img
      src={`/f1/cars/${teamId}.webp`}
      alt={teamId}
      style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `/f1/cars/${teamId}.svg`
        else if (img.src.includes('.svg')) img.src = `/f1/cars/${teamId}.png`
        else img.style.visibility = 'hidden'
      }}
    />
  )
}

// ─── Helper: rijder foto met fallback ────────────────────────────────────────
function DriverImg({ rijder, style, className }: { rijder: Rijder; style?: React.CSSProperties; className?: string }) {
  const teamKleur = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD
  return (
    <img
      src={`/f1/drivers/${rijder.id}.webp`}
      alt={rijder.naam}
      className={className}
      style={style}
      onError={e => {
        const img = e.currentTarget as HTMLImageElement
        if (img.src.includes('.webp')) img.src = `/f1/drivers/${rijder.id}.svg`
        else if (img.src.includes('.svg')) img.src = `/f1/drivers/${rijder.id}.png`
        else {
          img.style.display = 'none'
          const fb = img.nextElementSibling as HTMLElement
          if (fb) fb.style.display = 'flex'
        }
      }}
    />
  )
}

// ─── Popup ────────────────────────────────────────────────────────────────────
function RijderPopup({ rijder, onSluit }: { rijder: Rijder; onSluit: () => void }) {
  const teamKleur = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onSluit}
    >
      {/* Popup venster */}
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden"
        style={{ background: '#111', border: `2px solid ${teamKleur}`, maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Gekleurde top balk ── */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${teamKleur}, ${teamKleur}88)` }}
        />

        {/* ── Header: rijder naam + sluit ── */}
        <div className="flex items-center justify-between px-8 pt-6 pb-2">
          <div>
            <div className="font-ui text-xs font-bold uppercase tracking-[3px] mb-1" style={{ color: teamKleur }}>
              {rijder.teamNaam}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-ui text-xl text-white/60">{rijder.voornaam}</span>
              <span className="font-head font-black text-4xl uppercase text-white tracking-tight">{rijder.naam}</span>
              <span
                className="font-head font-black text-2xl px-3 py-0.5 rounded ml-2"
                style={{ background: teamKleur + '33', color: teamKleur, border: `1px solid ${teamKleur}66` }}
              >
                {rijder.nummer}
              </span>
            </div>
          </div>
          <button
            onClick={onSluit}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ── Hoofd content: rijder foto links, info rechts ── */}
        <div className="flex gap-0 px-8 pb-4">

          {/* Rijder foto — groot, transparant */}
          <div className="relative flex-shrink-0" style={{ width: 220, height: 280 }}>
            <DriverImg
              rijder={rijder}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'top center',
                borderRadius: 12,
              }}
            />
            {/* Gradient onderaan foto */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16 rounded-b-xl"
              style={{ background: 'linear-gradient(transparent, #111)' }}
            />
            {/* Vlag op foto */}
            <div className="absolute top-3 left-3">
              <img
                src={`/f1/flags/${rijder.landCode}.svg`}
                alt={rijder.landCode}
                className="rounded shadow-lg"
                style={{ width: 36, height: 24, objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>

          {/* Rechts: team info + auto */}
          <div className="flex-1 flex flex-col justify-between pl-6 py-2">

            {/* Team badge */}
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4"
                style={{ background: teamKleur + '18', border: `1px solid ${teamKleur}40` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: teamKleur }} />
                <span className="font-ui text-xs font-bold uppercase tracking-wider" style={{ color: teamKleur }}>
                  {rijder.teamNaam}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: 'Racenummer', value: `#${rijder.nummer}` },
                  { label: 'Nationaliteit', value: rijder.landCode.toUpperCase() },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="font-ui text-[10px] uppercase tracking-wider text-white/40 mb-1">{label}</div>
                    <div className="font-head font-black text-lg text-white">{value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* F1 Auto — groot centraal */}
            <div>
              <div className="font-ui text-[10px] uppercase tracking-wider text-white/30 mb-2">2026 Bolide</div>
              <div
                className="rounded-xl flex items-center justify-center p-3"
                style={{
                  background: `linear-gradient(135deg, ${teamKleur}18, rgba(255,255,255,0.03))`,
                  border: `1px solid ${teamKleur}30`,
                  height: 110,
                }}
              >
                <CarImg
                  teamId={rijder.teamId}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    filter: `drop-shadow(0 4px 12px ${teamKleur}60)`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Gekleurde bottom balk ── */}
        <div
          className="h-1 w-full"
          style={{ background: `linear-gradient(90deg, ${teamKleur}44, ${teamKleur})` }}
        />
      </div>
    </div>
  )
}

// ─── Rijder rij ───────────────────────────────────────────────────────────────
function RijderRij({ rijder, isEven, onKlik }: { rijder: Rijder; isEven: boolean; onKlik: () => void }) {
  const teamKleur = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD

  return (
    <div
      className="relative grid items-center group transition-all cursor-pointer hover:brightness-110"
      style={{
        gridTemplateColumns: '40px 96px 280px 60px 220px 1fr',
        background: isEven ? 'rgba(255,255,255,0.03)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        minHeight: 80,
      }}
      onClick={onKlik}
    >
      {/* Hover streep links */}
      <div
        className="absolute left-0 top-0 h-full w-1 opacity-0 group-hover:opacity-100 transition-opacity rounded-r"
        style={{ background: teamKleur }}
      />

      {/* 1 — Vlag */}
      <div className="flex items-center justify-center pl-3">
        <img
          src={`/f1/flags/${rijder.landCode}.svg`}
          alt={rijder.landCode}
          className="rounded-sm"
          style={{ width: 28, height: 18, objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden' }}
        />
      </div>

      {/* 2 — Driver foto */}
      <div className="flex items-center justify-center py-2">
        <div className="overflow-hidden rounded-lg" style={{ width: 96, height: 72 }}>
          <DriverImg
            rijder={rijder}
            style={{ width: 96, height: 72, objectFit: 'cover', objectPosition: 'top center' }}
          />
          {/* Fallback initialen */}
          <div
            className="items-center justify-center font-head font-black text-sm rounded-lg"
            style={{ display: 'none', width: 96, height: 72, background: teamKleur + '25', color: teamKleur }}
          >
            {rijder.voornaam[0]}{rijder.naam[0]}
          </div>
        </div>
      </div>

      {/* 3 — Naam */}
      <div className="flex items-center gap-2 px-4">
        <span className="font-ui text-sm text-white/50 group-hover:text-white/80 transition-colors whitespace-nowrap">
          {rijder.voornaam}
        </span>
        <span className="font-head font-black text-lg uppercase text-white tracking-wide whitespace-nowrap">
          {rijder.naam}
        </span>
      </div>

      {/* 4 — Race nummer */}
      <div className="flex items-center justify-center">
        <span
          className="font-head font-black text-sm w-11 h-8 flex items-center justify-center rounded"
          style={{ background: teamKleur + '33', color: teamKleur, border: `1px solid ${teamKleur}55` }}
        >
          {rijder.nummer}
        </span>
      </div>

      {/* 5 — F1 Auto */}
      <div
        className="flex items-center justify-center rounded-lg mx-2"
        style={{
          height: 56,
          background: `linear-gradient(135deg, ${teamKleur}15, rgba(255,255,255,0.03))`,
          border: `1px solid ${teamKleur}25`,
        }}
      >
        <CarImg
          teamId={rijder.teamId}
          style={{
            width: 210,
            height: 48,
            objectFit: 'contain',
            filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.7))',
          }}
        />
      </div>

      {/* 6 — Teamnaam */}
      <div className="flex items-center gap-2 px-4">
        <div className="w-0.5 self-stretch my-3 rounded-full flex-shrink-0" style={{ background: teamKleur }} />
        <span className="font-ui text-sm text-white/50 group-hover:text-white transition-colors truncate">
          {rijder.teamNaam}
        </span>
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

      {/* ── Header ── */}
      <div className="mb-1" style={{ color: F1_ROOD }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end gap-3 mb-8">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          Formula <span style={{ color: F1_ROOD }}>1</span>
        </h1>
        <span className="font-ui text-sm text-white/40 md:mb-1">Volledige grid · {GRID_2026.length} rijders · 11 teams</span>
      </div>

      {/* ── Filter balk ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Zoek rijder of team..."
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none focus:border-red-600 transition-colors w-full md:w-64"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTeamFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!teamFilter
              ? { background: F1_ROOD + '22', borderColor: F1_ROOD, color: F1_ROOD }
              : { background: 'transparent', borderColor: '#333', color: '#555' }}
          >Alle</button>
          {teams.map(t => {
            const kleur  = TEAM_KLEUREN[t.id] ?? F1_ROOD
            const actief = teamFilter === t.id
            return (
              <button key={t.id}
                onClick={() => setTeamFilter(actief ? null : t.id)}
                className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
                style={actief
                  ? { background: kleur + '22', borderColor: kleur, color: kleur }
                  : { background: 'transparent', borderColor: '#333', color: '#555' }}
              >
                {t.naam.split(' ')[0]}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Tabel ── */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#111', border: '1px solid #1e1e1e' }}>
        {/* Header */}
        <div
          className="grid items-center"
          style={{ gridTemplateColumns: '40px 96px 280px 60px 220px 1fr', background: '#0a0a0a', borderBottom: '1px solid #222' }}
        >
          <div /><div />
          <div className="px-4 py-3">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Driver</span>
          </div>
          <div className="flex justify-center py-3">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">#</span>
          </div>
          <div className="px-2 py-3">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Car</span>
          </div>
          <div className="px-4 py-3">
            <span className="font-ui text-[11px] font-bold uppercase tracking-[2px] text-white/40">Team</span>
          </div>
        </div>

        {/* Rijders */}
        {gefilterd.map((rijder, i) => (
          <RijderRij key={rijder.id} rijder={rijder} isEven={i % 2 === 0} onKlik={() => setPopup(rijder)} />
        ))}

        {gefilterd.length === 0 && (
          <div className="py-16 text-center font-ui text-sm text-white/30">Geen rijders gevonden.</div>
        )}
      </div>

      {/* ── Popup ── */}
      {popup && <RijderPopup rijder={popup} onSluit={() => setPopup(null)} />}
    </div>
  )
}
