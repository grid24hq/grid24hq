// ─── Standen pagina — generiek per serie ──────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'

const RTDB = 'https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Rijder {
  positie:      number
  naam:         string
  nationaliteit:string
  vlag:         string
  team:         string
  nr:           number
  punten:       number
  serie:        string
  klasse:       string
}
interface FilterDef { id: string; label: string; kleur: string }
interface PadDef    { pad: string; serie: string; klasse: string }

// ─── Serie configuratie ────────────────────────────────────────────────────────
interface SerieConfig {
  titel:   string
  subtitel:string
  filters: FilterDef[]
  paden:   Record<string, PadDef[]>
}

const SERIES: Record<string, SerieConfig> = {
  f1: {
    titel: 'Formula 1', subtitel: 'FIA Formula 1 World Championship 2026',
    filters: [
      { id: 'alle',     label: 'Alle',           kleur: '#888' },
      { id: 'rijders',  label: 'Rijders',        kleur: '#e10600' },
      { id: 'teams',    label: 'Constructeurs',  kleur: '#ff8700' },
    ],
    paden: {
      rijders: [{ pad: 'F1/2026/championship_standings/Drivers/riders', serie: 'F1', klasse: 'Rijders' }],
      teams:   [{ pad: 'F1/2026/championship_standings/Constructors/riders', serie: 'F1', klasse: 'Constructeurs' }],
    },
  },
  wec: {
    titel: 'WEC', subtitel: 'FIA World Endurance Championship 2026',
    filters: [
      { id: 'alle',       label: 'Alle',         kleur: '#888' },
      { id: 'hypercar',   label: 'Hypercar',     kleur: '#3b82f6' },
      { id: 'lmp2',       label: 'LMP2',         kleur: '#f97316' },
      { id: 'lmp2proam',  label: 'LMP2 Pro/Am',  kleur: '#fb923c' },
      { id: 'lmp3',       label: 'LMP3',         kleur: '#a855f7' },
      { id: 'lmp3proam',  label: 'LMP3 Pro/Am',  kleur: '#f59e0b' },
      { id: 'gt3',        label: 'GT3 / LMGT3',  kleur: '#22c55e' },
    ],
    paden: {
      hypercar:  [{ pad: 'WEC/2026/championship_standings/Hypercar/riders',         serie: 'WEC',      klasse: 'Hypercar' }],
      lmp2:      [{ pad: 'ELMS/2026/championship_standings/LMP2/riders',            serie: 'ELMS',     klasse: 'LMP2' }],
      lmp2proam: [{ pad: 'ELMS/2026/championship_standings/LMP2_ProAm/riders',      serie: 'ELMS',     klasse: 'LMP2 Pro/Am' }],
      lmp3:      [
        { pad: 'ELMS/2026/championship_standings/LMP3/riders',                       serie: 'ELMS',     klasse: 'LMP3' },
        { pad: 'LeMansCup/2026/championship_standings/LMP3/riders',                  serie: 'LM Cup',   klasse: 'LMP3' },
      ],
      lmp3proam: [{ pad: 'LeMansCup/2026/championship_standings/LMP3_ProAm/riders', serie: 'LM Cup',   klasse: 'LMP3 Pro/Am' }],
      gt3:       [
        { pad: 'WEC/2026/championship_standings/LMGT3/riders',                       serie: 'WEC',      klasse: 'LMGT3' },
        { pad: 'ELMS/2026/championship_standings/LMGT3/riders',                      serie: 'ELMS',     klasse: 'LMGT3' },
        { pad: 'LeMansCup/2026/championship_standings/GT3/riders',                   serie: 'LM Cup',   klasse: 'GT3' },
      ],
    },
  },
  imsa: {
    titel: 'WeatherTech', subtitel: 'IMSA WeatherTech SportsCar Championship 2026',
    filters: [
      { id: 'alle',  label: 'Alle',  kleur: '#888' },
      { id: 'gtp',   label: 'GTP',   kleur: '#3b82f6' },
      { id: 'lmp2',  label: 'LMP2',  kleur: '#f97316' },
      { id: 'gtd',   label: 'GTD',   kleur: '#22c55e' },
      { id: 'gtdpro',label: 'GTD Pro', kleur: '#a855f7' },
    ],
    paden: {
      gtp:    [{ pad: 'IMSA/2026/championship_standings/GTP/riders',    serie: 'IMSA', klasse: 'GTP' }],
      lmp2:   [{ pad: 'IMSA/2026/championship_standings/LMP2/riders',   serie: 'IMSA', klasse: 'LMP2' }],
      gtd:    [{ pad: 'IMSA/2026/championship_standings/GTD/riders',    serie: 'IMSA', klasse: 'GTD' }],
      gtdpro: [{ pad: 'IMSA/2026/championship_standings/GTD_Pro/riders',serie: 'IMSA', klasse: 'GTD Pro' }],
    },
  },
  motogp: {
    titel: 'MotoGP', subtitel: 'MotoGP · Moto2 · Moto3 World Championship 2026',
    filters: [
      { id: 'alle',   label: 'Alle',   kleur: '#888' },
      { id: 'motogp', label: 'MotoGP', kleur: '#f97316' },
      { id: 'moto2',  label: 'Moto2',  kleur: '#eab308' },
      { id: 'moto3',  label: 'Moto3',  kleur: '#14b8a6' },
    ],
    paden: {
      motogp: [{ pad: 'MotoGP/2026/championship_standings/MotoGP/riders', serie: 'MotoGP', klasse: 'MotoGP' }],
      moto2:  [{ pad: 'MotoGP/2026/championship_standings/Moto2/riders',  serie: 'Moto2',  klasse: 'Moto2' }],
      moto3:  [{ pad: 'MotoGP/2026/championship_standings/Moto3/riders',  serie: 'Moto3',  klasse: 'Moto3' }],
    },
  },
  worldsbk: {
    titel: 'WorldSBK', subtitel: 'WorldSBK · WorldSSP Championship 2026',
    filters: [
      { id: 'alle', label: 'Alle',     kleur: '#888' },
      { id: 'wsbk', label: 'WorldSBK', kleur: '#ec4899' },
      { id: 'wssp', label: 'WorldSSP', kleur: '#06b6d4' },
    ],
    paden: {
      wsbk: [{ pad: 'WorldSBK/2026/championship_standings/WorldSBK/riders', serie: 'WorldSBK', klasse: 'WorldSBK' }],
      wssp: [{ pad: 'WorldSBK/2026/championship_standings/WorldSSP/riders', serie: 'WorldSSP', klasse: 'WorldSSP' }],
    },
  },
}

// ─── Firebase fetch helper ────────────────────────────────────────────────────
async function fetchFirebase(pad: string, serie: string, klasse: string): Promise<Rijder[]> {
  try {
    const r = await fetch(`${RTDB}/${pad}.json`)
    if (!r.ok) return []
    const data = await r.json()
    if (!data) return []
    const items = Array.isArray(data) ? data : Object.values(data)
    return items
      .filter((item: any) => item && item.naam)
      .map((item: any, i: number) => ({
        positie:       item.positie      ?? i + 1,
        naam:          item.naam         ?? '',
        nationaliteit: item.nationaliteit?? '',
        vlag:          item.vlag         ?? '',
        team:          item.team         ?? '',
        nr:            item.nr ?? item.nummer ?? 0,
        punten:        item.punten       ?? 0,
        serie,
        klasse,
      }))
      .sort((a, b) => b.punten - a.punten)
      .map((r, i) => ({ ...r, positie: i + 1 }))
  } catch {
    return []
  }
}

// ─── Vlag helper ──────────────────────────────────────────────────────────────
const VLAG_CODES: Record<string, string> = {
  '🇯🇵':'jp','🇬🇧':'gb','🇳🇱':'nl','🇨🇭':'ch','🇳🇿':'nz','🇪🇸':'es','🇩🇰':'dk',
  '🇧🇪':'be','🇩🇪':'de','🇫🇷':'fr','🇮🇹':'it','🇵🇹':'pt','🇦🇹':'at','🇲🇨':'mc',
  '🇧🇷':'br','🇺🇸':'us','🇵🇱':'pl','🇨🇳':'cn','🇿🇦':'za','🇦🇺':'au','🇸🇪':'se',
  '🇹🇷':'tr','🇬🇷':'gr','🇮🇪':'ie','🇫🇮':'fi','🇷🇺':'ru','🇰🇷':'kr','🇲🇽':'mx',
  '🇨🇦':'ca','🇦🇷':'ar','🇧🇬':'bg','🏴󠁧󠁢󠁳󠁣󠁴󠁿':'gb',
}
function VlagImg({ emoji }: { emoji: string }) {
  // Accepteer zowel emoji (🇳🇱) als directe landcode (nl, gb, etc.)
  const code = VLAG_CODES[emoji] ?? (emoji?.length <= 4 ? emoji : undefined)
  if (!code) return <span className="text-sm">{emoji}</span>
  return (
    <img
      src={`/wec/flags/${code}.webp`}
      alt={code}
      width={24} height={18}
      className="inline-block object-cover rounded-sm flex-shrink-0"
      style={{ height: 18 }}
      onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
    />
  )
}

// ─── Serie badge ──────────────────────────────────────────────────────────────
const SERIE_KLEUR: Record<string, string> = {
  'WEC': '#3b82f6', 'ELMS': '#f97316', 'LM Cup': '#f59e0b',
  'F1': '#e10600', 'IMSA': '#a855f7', 'MotoGP': '#f97316',
  'Moto2': '#eab308', 'Moto3': '#14b8a6', 'WorldSBK': '#ec4899', 'WorldSSP': '#06b6d4',
}
function SerieBadge({ serie }: { serie: string }) {
  const c = SERIE_KLEUR[serie] ?? '#888'
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-ui font-bold uppercase tracking-wider flex-shrink-0"
      style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}>
      {serie}
    </span>
  )
}

// ─── Podium kaartjes (top 3) ──────────────────────────────────────────────────
function PodiumKaart({ rijder, filterKleur }: { rijder: Rijder; filterKleur: string }) {
  const podiumKleuren = ['#f59e0b', '#9ca3af', '#cd7f32']
  const kleur = podiumKleuren[rijder.positie - 1] ?? filterKleur
  const groottes = ['text-5xl', 'text-4xl', 'text-3xl']
  const hoogtes  = ['h-36', 'h-28', 'h-24']

  return (
    <div className={`relative bg-brand-card border border-brand-border rounded-xl overflow-hidden flex flex-col items-center justify-end ${hoogtes[rijder.positie - 1]} px-4 pb-4 pt-8`}
      style={{ borderTopColor: kleur }}>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: kleur }} />
      <div className={`absolute top-2 left-3 font-head font-black ${groottes[rijder.positie - 1]} leading-none opacity-10`}
        style={{ color: kleur }}>
        {rijder.positie}
      </div>
      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-head font-black"
        style={{ background: kleur, color: '#000' }}>
        {rijder.positie}
      </div>
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1">
          <VlagImg emoji={rijder.vlag} />
          <span className="font-head font-black text-base text-brand-light leading-tight">{rijder.naam}</span>
        </div>
        <div className="font-ui text-xs text-brand-muted mb-2 truncate max-w-[140px]">{rijder.team}</div>
        <div className="font-head text-2xl font-black" style={{ color: kleur }}>{rijder.punten}</div>
        <div className="font-ui text-[10px] text-brand-muted uppercase tracking-widest">punten</div>
      </div>
    </div>
  )
}

// ─── Tabel rij ────────────────────────────────────────────────────────────────
function TabelRij({ rijder, maxPunten, filterKleur, toonKlasse }: {
  rijder: Rijder; maxPunten: number; filterKleur: string; toonKlasse: boolean
}) {
  const podiumKleur = rijder.positie === 1 ? '#f59e0b' : rijder.positie === 2 ? '#9ca3af' : rijder.positie === 3 ? '#cd7f32' : 'transparent'
  const breedte = Math.round((rijder.punten / maxPunten) * 100)

  return (
    <div className="flex items-center gap-0 border-b border-brand-border/40 last:border-0 hover:bg-white/[0.02] transition-colors group">
      <div className="w-12 flex-shrink-0 flex items-center justify-center py-3">
        {rijder.positie <= 3 ? (
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-head font-black"
            style={{ background: podiumKleur, color: '#000' }}>
            {rijder.positie}
          </div>
        ) : (
          <span className="font-head text-sm font-bold text-brand-muted">{rijder.positie}</span>
        )}
      </div>

      <div className="flex-1 min-w-0 flex items-center gap-2.5 py-3 pr-3">
        <VlagImg emoji={rijder.vlag} />
        <div className="min-w-0">
          <div className="font-head font-bold text-sm text-brand-light group-hover:text-white transition-colors leading-tight truncate">
            {rijder.naam}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="font-ui text-[11px] text-brand-muted truncate">{rijder.team}</span>
            {toonKlasse && (
              <>
                <SerieBadge serie={rijder.serie} />
                <span className="font-ui text-[10px] text-brand-muted/60">{rijder.klasse}</span>
              </>
            )}
          </div>
          <div className="mt-1.5 h-0.5 w-full bg-brand-border rounded-full overflow-hidden max-w-[200px]">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${breedte}%`, background: filterKleur }} />
          </div>
        </div>
      </div>

      <div className="w-12 flex-shrink-0 text-center hidden sm:block">
        <span className="font-head text-sm font-bold text-brand-orange">#{rijder.nr}</span>
      </div>

      <div className="w-20 flex-shrink-0 text-right pr-4 py-3">
        <span className="font-head text-lg font-black text-brand-light">{rijder.punten}</span>
        <div className="font-ui text-[10px] text-brand-muted">pts</div>
      </div>
    </div>
  )
}

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function Standen() {
  const { serie } = useParams<{ serie: string }>()
  const config = serie ? SERIES[serie.toLowerCase()] : undefined

  const [actief, setActief]   = useState('alle')
  const [rijders, setRijders] = useState<Rijder[]>([])
  const [laden, setLaden]     = useState(false)
  const [zoek, setZoek]       = useState('')

  // Reset filter bij wisselen van serie
  useEffect(() => { setActief('alle'); setZoek('') }, [serie])

  const ALLE_PADEN = config ? Object.values(config.paden).flat() : []
  const filterConfig = config?.filters.find(f => f.id === actief) ?? config?.filters[0]

  const laadData = useCallback(async (filterId: string) => {
    if (!config) return
    setLaden(true)
    setRijders([])
    const paden = filterId === 'alle' ? ALLE_PADEN : config.paden[filterId] ?? []
    const resultaten = await Promise.all(paden.map(p => fetchFirebase(p.pad, p.serie, p.klasse)))
    const gecombineerd = resultaten
      .flat()
      .sort((a, b) => b.punten - a.punten)
      .map((r, i) => ({ ...r, positie: i + 1 }))
    setRijders(gecombineerd)
    setLaden(false)
  }, [config, serie])

  useEffect(() => { laadData(actief) }, [actief, laadData])

  if (!config) return <Navigate to="/standen/f1" replace />

  const gefilterd = rijders.filter(r =>
    !zoek || [r.naam, r.team, r.nationaliteit].some(s => s.toLowerCase().includes(zoek.toLowerCase()))
  )

  const top3      = gefilterd.slice(0, 3)
  const rest      = gefilterd.slice(3)
  const maxPunten = gefilterd[0]?.punten ?? 1
  const toonKlasse = actief === 'alle'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Hero ── */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-brand-card border border-brand-border">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${filterConfig?.kleur ?? '#888'}18 0%, transparent 70%)`, transform: 'translate(30%,-30%)' }} />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-head font-black text-3xl sm:text-4xl uppercase tracking-wide leading-none">
              {config.titel} Standen
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-ui font-bold uppercase tracking-widest"
              style={{ background: `${filterConfig?.kleur}22`, color: filterConfig?.kleur, border: `1px solid ${filterConfig?.kleur}44` }}>
              {filterConfig?.label}
            </span>
          </div>
          <p className="font-ui text-sm text-brand-muted">{config.subtitel}</p>
        </div>
      </div>

      {/* ── Filter knoppen ── */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {config.filters.map(f => (
          <button
            key={f.id}
            onClick={() => { setActief(f.id); setZoek('') }}
            className={`px-3 py-2 rounded-lg font-ui text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${
              actief === f.id ? 'text-white border-transparent' : 'text-brand-muted border-brand-border hover:border-brand-border/80'
            }`}
            style={actief === f.id ? { background: f.kleur, borderColor: f.kleur } : {}}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Zoekbalk ── */}
      <div className="relative mb-6 max-w-sm">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Zoek rijder of team…"
          value={zoek}
          onChange={e => setZoek(e.target.value)}
          className="w-full bg-brand-card border border-brand-border rounded-lg pl-8 pr-4 py-2 font-ui text-sm text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-orange/50 transition-colors"
        />
      </div>

      {/* ── Laden ── */}
      {laden && (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-2 border-brand-border border-t-brand-orange rounded-full animate-spin mb-3" />
          <p className="font-ui text-sm text-brand-muted">Klassement laden…</p>
        </div>
      )}

      {/* ── Geen data ── */}
      {!laden && gefilterd.length === 0 && (
        <div className="text-center py-20 bg-brand-card border border-brand-border rounded-xl">
          <div className="text-4xl mb-3">🏁</div>
          <p className="font-head text-xl text-brand-light mb-1">Geen data beschikbaar</p>
          <p className="font-ui text-sm text-brand-muted">
            {zoek ? 'Geen resultaten voor je zoekopdracht.' : 'Klassementsdata wordt later toegevoegd via Firebase.'}
          </p>
        </div>
      )}

      {/* ── Podium top 3 ── */}
      {!laden && gefilterd.length >= 3 && !zoek && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[top3[1], top3[0], top3[2]].filter(Boolean).map(r => (
            <PodiumKaart key={`${r.naam}-${r.serie}`} rijder={r} filterKleur={filterConfig?.kleur ?? '#888'} />
          ))}
        </div>
      )}

      {/* ── Volledige tabel ── */}
      {!laden && gefilterd.length > 0 && (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="flex items-center border-b border-brand-border bg-white/[0.02]">
            <div className="w-12 flex-shrink-0 px-3 py-2.5">
              <span className="font-ui text-[10px] text-brand-muted uppercase tracking-widest">#</span>
            </div>
            <div className="flex-1 px-2 py-2.5">
              <span className="font-ui text-[10px] text-brand-muted uppercase tracking-widest">Rijder / Team</span>
            </div>
            <div className="w-12 flex-shrink-0 text-center hidden sm:block py-2.5">
              <span className="font-ui text-[10px] text-brand-muted uppercase tracking-widest">Nr</span>
            </div>
            <div className="w-20 flex-shrink-0 text-right pr-4 py-2.5">
              <span className="font-ui text-[10px] text-brand-muted uppercase tracking-widest">Punten</span>
            </div>
          </div>

          {top3.map(r => (
            <TabelRij key={`${r.naam}-${r.serie}-t`} rijder={r} maxPunten={maxPunten} filterKleur={filterConfig?.kleur ?? '#888'} toonKlasse={toonKlasse} />
          ))}

          {rest.length > 0 && top3.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.01]">
              <div className="flex-1 h-px bg-brand-border/30" />
            </div>
          )}

          {rest.map(r => (
            <TabelRij key={`${r.naam}-${r.serie}-r`} rijder={r} maxPunten={maxPunten} filterKleur={filterConfig?.kleur ?? '#888'} toonKlasse={toonKlasse} />
          ))}
        </div>
      )}

      {!laden && (
        <p className="font-ui text-xs text-brand-muted mt-4 text-right">
          Data via Firebase · Alkamel/API koppeling volgt later
        </p>
      )}
    </div>
  )
}
