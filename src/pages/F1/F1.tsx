// ─── F1 2026 Grid pagina ───────────────────────────────────────────────────────
// Rijders-afbeeldingen: public/f1/drivers/{rijder_id}.png  (320×180 px)
// Auto-afbeeldingen:    public/f1/cars/{team_id}.png       (280×120 px)
// Vlag-afbeeldingen:    public/f1/flags/{land_code}.svg    (32×20 px)
// ─────────────────────────────────────────────────────────────────────────────

const F1_ROOD   = '#e10600'
const F1_DONKER = '#1a0000'

// ─── F1 2026 Grid data ────────────────────────────────────────────────────────
const GRID_2026 = [
  // { id, naam, voornaam, land, landCode, nummer, teamId, teamNaam }
  { id: 'verstappen',    voornaam: 'Max',        naam: 'VERSTAPPEN',  land: 'Netherlands',  landCode: 'nl', nummer: 1,  teamId: 'redbull',   teamNaam: 'Oracle Red Bull Racing' },
  { id: 'norris',        voornaam: 'Lando',      naam: 'NORRIS',      land: 'United Kingdom', landCode: 'gb', nummer: 4,  teamId: 'mclaren',   teamNaam: 'McLaren Formula 1 Team' },
  { id: 'leclerc',       voornaam: 'Charles',    naam: 'LECLERC',     land: 'Monaco',       landCode: 'mc', nummer: 16, teamId: 'ferrari',   teamNaam: 'Scuderia Ferrari' },
  { id: 'piastri',       voornaam: 'Oscar',      naam: 'PIASTRI',     land: 'Australia',    landCode: 'au', nummer: 81, teamId: 'mclaren',   teamNaam: 'McLaren Formula 1 Team' },
  { id: 'hamilton',      voornaam: 'Lewis',      naam: 'HAMILTON',    land: 'United Kingdom', landCode: 'gb', nummer: 44, teamId: 'ferrari',   teamNaam: 'Scuderia Ferrari' },
  { id: 'russell',       voornaam: 'George',     naam: 'RUSSELL',     land: 'United Kingdom', landCode: 'gb', nummer: 63, teamId: 'mercedes',  teamNaam: 'Mercedes-AMG Petronas F1 Team' },
  { id: 'antonelli',     voornaam: 'Kimi',       naam: 'ANTONELLI',   land: 'Italy',        landCode: 'it', nummer: 12, teamId: 'mercedes',  teamNaam: 'Mercedes-AMG Petronas F1 Team' },
  { id: 'sainz',         voornaam: 'Carlos',     naam: 'SAINZ',       land: 'Spain',        landCode: 'es', nummer: 55, teamId: 'williams',  teamNaam: 'Williams Racing' },
  { id: 'alonso',        voornaam: 'Fernando',   naam: 'ALONSO',      land: 'Spain',        landCode: 'es', nummer: 14, teamId: 'aston',     teamNaam: 'Aston Martin Aramco F1 Team' },
  { id: 'stroll',        voornaam: 'Lance',      naam: 'STROLL',      land: 'Canada',       landCode: 'ca', nummer: 18, teamId: 'aston',     teamNaam: 'Aston Martin Aramco F1 Team' },
  { id: 'gasly',         voornaam: 'Pierre',     naam: 'GASLY',       land: 'France',       landCode: 'fr', nummer: 10, teamId: 'alpine',    teamNaam: 'Alpine F1 Team' },
  { id: 'doohan',        voornaam: 'Jack',       naam: 'DOOHAN',      land: 'Australia',    landCode: 'au', nummer: 7,  teamId: 'alpine',    teamNaam: 'Alpine F1 Team' },
  { id: 'tsunoda',       voornaam: 'Yuki',       naam: 'TSUNODA',     land: 'Japan',        landCode: 'jp', nummer: 22, teamId: 'redbull',   teamNaam: 'Oracle Red Bull Racing' },
  { id: 'lawson',        voornaam: 'Liam',       naam: 'LAWSON',      land: 'New Zealand',  landCode: 'nz', nummer: 30, teamId: 'rb',        teamNaam: 'Visa Cash App Racing Bulls' },
  { id: 'hadjar',        voornaam: 'Isack',      naam: 'HADJAR',      land: 'France',       landCode: 'fr', nummer: 6,  teamId: 'rb',        teamNaam: 'Visa Cash App Racing Bulls' },
  { id: 'hulkenberg',    voornaam: 'Nico',       naam: 'HÜLKENBERG',  land: 'Germany',      landCode: 'de', nummer: 27, teamId: 'sauber',    teamNaam: 'Stake F1 Team Sauber' },
  { id: 'bortoleto',     voornaam: 'Gabriel',    naam: 'BORTOLETO',   land: 'Brazil',       landCode: 'br', nummer: 5,  teamId: 'sauber',    teamNaam: 'Stake F1 Team Sauber' },
  { id: 'albon',         voornaam: 'Alexander',  naam: 'ALBON',       land: 'Thailand',     landCode: 'th', nummer: 23, teamId: 'williams',  teamNaam: 'Williams Racing' },
  { id: 'ocon',          voornaam: 'Esteban',    naam: 'OCON',        land: 'France',       landCode: 'fr', nummer: 31, teamId: 'haas',      teamNaam: 'Haas F1 Team' },
  { id: 'bearman',       voornaam: 'Oliver',     naam: 'BEARMAN',     land: 'United Kingdom', landCode: 'gb', nummer: 87, teamId: 'haas',      teamNaam: 'Haas F1 Team' },
  { id: 'perez',         voornaam: 'Sergio',     naam: 'PÉREZ',       land: 'Mexico',       landCode: 'mx', nummer: 11, teamId: 'cadillac',  teamNaam: 'Cadillac F1 Team' },
  { id: 'bottas',        voornaam: 'Valtteri',   naam: 'BOTTAS',      land: 'Finland',      landCode: 'fi', nummer: 77, teamId: 'cadillac',  teamNaam: 'Cadillac F1 Team' },
]

// Team kleuren (accent streep)
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

// ─── Rijder kaart ─────────────────────────────────────────────────────────────
function RijderKaart({ rijder }: { rijder: typeof GRID_2026[0] }) {
  const teamKleur = TEAM_KLEUREN[rijder.teamId] ?? F1_ROOD

  return (
    <div
      className="relative rounded-xl overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      style={{ background: '#161616', border: '1px solid #222', borderTop: `3px solid ${teamKleur}` }}
    >
      {/* Rijder foto */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', background: '#111' }}>
        <img
          src={`/f1/drivers/${rijder.id}.png`}
          alt={`${rijder.voornaam} ${rijder.naam}`}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            // Fallback: toon initialen als foto ontbreekt
            const el = e.currentTarget
            el.style.display = 'none'
            const fb = el.nextElementSibling as HTMLElement
            if (fb) fb.style.display = 'flex'
          }}
        />
        {/* Fallback placeholder */}
        <div
          className="absolute inset-0 items-center justify-center font-head font-black text-4xl"
          style={{ display: 'none', background: teamKleur + '18', color: teamKleur }}
        >
          {rijder.voornaam[0]}{rijder.naam[0]}
        </div>

        {/* Nummer badge */}
        <div
          className="absolute top-2 right-2 font-head font-black text-sm px-2 py-0.5 rounded"
          style={{ background: teamKleur, color: '#fff', lineHeight: 1.4 }}
        >
          {rijder.nummer}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        {/* Vlag + naam */}
        <div className="flex items-center gap-2">
          <img
            src={`/f1/flags/${rijder.landCode}.svg`}
            alt={rijder.land}
            className="rounded-sm flex-shrink-0"
            style={{ width: 24, height: 16, objectFit: 'cover' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <div>
            <div className="font-ui text-[10px] text-brand-muted leading-none">{rijder.voornaam}</div>
            <div className="font-head font-black text-sm uppercase leading-tight text-white">{rijder.naam}</div>
          </div>
        </div>

        {/* Auto foto */}
        <div className="w-full rounded overflow-hidden" style={{ background: '#0d0d0d', height: 52 }}>
          <img
            src={`/f1/cars/${rijder.teamId}.png`}
            alt={rijder.teamNaam}
            className="w-full h-full object-contain"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
        </div>

        {/* Team naam */}
        <div className="flex items-center gap-1.5">
          <div className="w-0.5 h-3 rounded-full flex-shrink-0" style={{ background: teamKleur }} />
          <span className="font-ui text-[10px] text-brand-muted truncate">{rijder.teamNaam}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Team filter knop ─────────────────────────────────────────────────────────
const TEAMS_UNIEK = Array.from(new Set(GRID_2026.map(r => r.teamId)))
  .map(id => ({ id, naam: GRID_2026.find(r => r.teamId === id)!.teamNaam }))

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
import { useState } from 'react'

export default function F1() {
  const [teamFilter, setTeamFilter] = useState<string | null>(null)
  const [zoek, setZoek]             = useState('')

  const gefilterd = GRID_2026.filter(r => {
    const matchTeam = !teamFilter || r.teamId === teamFilter
    const matchZoek = !zoek || `${r.voornaam} ${r.naam} ${r.teamNaam}`.toLowerCase().includes(zoek.toLowerCase())
    return matchTeam && matchZoek
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* ── Header ── */}
      <div className="mb-2" style={{ color: F1_ROOD }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[3px]">2026 Seizoen</span>
      </div>
      <div className="flex items-end gap-4 mb-8">
        <h1 className="font-head font-black text-5xl uppercase tracking-tight leading-none">
          Formula <span style={{ color: F1_ROOD }}>1</span>
        </h1>
        <span className="font-ui text-sm text-brand-muted mb-1">Volledige grid · {GRID_2026.length} rijders</span>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Zoekbalk */}
        <input
          type="text"
          placeholder="Zoek rijder of team..."
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="font-ui text-sm px-4 py-2 rounded-lg bg-brand-card border border-brand-border text-brand-light placeholder-brand-muted focus:outline-none focus:border-red-600 transition-colors w-full md:w-64"
        />

        {/* Team filter */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTeamFilter(null)}
            className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
            style={!teamFilter
              ? { background: F1_ROOD + '22', borderColor: F1_ROOD, color: F1_ROOD }
              : { background: 'transparent', borderColor: '#333', color: '#666' }}
          >
            Alle
          </button>
          {TEAMS_UNIEK.map(t => {
            const kleur   = TEAM_KLEUREN[t.id] ?? F1_ROOD
            const isActief = teamFilter === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTeamFilter(isActief ? null : t.id)}
                className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded border transition-colors"
                style={isActief
                  ? { background: kleur + '22', borderColor: kleur, color: kleur }
                  : { background: 'transparent', borderColor: '#333', color: '#666' }}
              >
                {t.naam}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {gefilterd.map(rijder => (
          <RijderKaart key={rijder.id} rijder={rijder} />
        ))}
      </div>

      {gefilterd.length === 0 && (
        <div className="text-center py-16 font-ui text-sm text-brand-muted">
          Geen rijders gevonden voor deze filter.
        </div>
      )}

      {/* ── Afbeelding info box ── */}
      <div className="mt-10 rounded-xl p-5" style={{ background: '#161616', border: '1px solid #222' }}>
        <div className="font-ui text-xs font-bold uppercase tracking-wider mb-3" style={{ color: F1_ROOD }}>
          📁 Afbeeldingen plaatsen
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-ui text-xs text-brand-muted">
          <div>
            <div className="text-white font-semibold mb-1">Rijder foto's</div>
            <div className="font-mono text-[10px] bg-black/40 rounded px-2 py-1.5 mb-1">public/f1/drivers/{'{rijder_id}'}.png</div>
            <div>Formaat: <span className="text-white">320 × 180 px</span></div>
            <div className="mt-1">Voorbeelden: <span className="text-white">verstappen.png, norris.png</span></div>
          </div>
          <div>
            <div className="text-white font-semibold mb-1">Auto foto's (per team)</div>
            <div className="font-mono text-[10px] bg-black/40 rounded px-2 py-1.5 mb-1">public/f1/cars/{'{team_id}'}.png</div>
            <div>Formaat: <span className="text-white">280 × 120 px</span></div>
            <div className="mt-1">Voorbeelden: <span className="text-white">ferrari.png, redbull.png, cadillac.png</span></div>
          </div>
          <div>
            <div className="text-white font-semibold mb-1">Vlaggen</div>
            <div className="font-mono text-[10px] bg-black/40 rounded px-2 py-1.5 mb-1">public/f1/flags/{'{land_code}'}.svg</div>
            <div>Formaat: <span className="text-white">32 × 20 px (SVG)</span></div>
            <div className="mt-1">Voorbeelden: <span className="text-white">nl.svg, gb.svg, it.svg</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
