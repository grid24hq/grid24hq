// ─── Klassementspagina 2026 ───────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react'

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

// ─── Filter config ────────────────────────────────────────────────────────────
const FILTERS = [
  { id: 'alle',       label: 'Alle',         kleur: '#888' },
  { id: 'hypercar',   label: 'Hypercar',     kleur: '#3b82f6' },
  { id: 'lmp2',       label: 'LMP2',         kleur: '#f97316' },
  { id: 'lmp2proam',  label: 'LMP2 Pro/Am',  kleur: '#fb923c' },
  { id: 'lmp3',       label: 'LMP3',         kleur: '#a855f7' },
  { id: 'lmp3proam',  label: 'LMP3 Pro/Am',  kleur: '#f59e0b' },
  { id: 'gt3',        label: 'GT3 / LMGT3',  kleur: '#22c55e' },
]

// ─── Firebase paden per filter ────────────────────────────────────────────────
const FIREBASE_PADEN: Record<string, { pad: string; serie: string; klasse: string }[]> = {
  hypercar:  [{ pad: 'WEC/2026/championship_standings/Hypercar',         serie: 'WEC',      klasse: 'Hypercar' }],
  lmp2:      [{ pad: 'ELMS/2026/championship_standings/LMP2',            serie: 'ELMS',     klasse: 'LMP2' }],
  lmp2proam: [{ pad: 'ELMS/2026/championship_standings/LMP2_ProAm',      serie: 'ELMS',     klasse: 'LMP2 Pro/Am' }],
  lmp3:      [
    { pad: 'ELMS/2026/championship_standings/LMP3',                       serie: 'ELMS',     klasse: 'LMP3' },
    { pad: 'LeMansCup/2026/championship_standings/LMP3',                  serie: 'LM Cup',   klasse: 'LMP3' },
  ],
  lmp3proam: [{ pad: 'LeMansCup/2026/championship_standings/LMP3_ProAm', serie: 'LM Cup',   klasse: 'LMP3 Pro/Am' }],
  gt3:       [
    { pad: 'WEC/2026/championship_standings/LMGT3',                       serie: 'WEC',      klasse: 'LMGT3' },
    { pad: 'ELMS/2026/championship_standings/LMGT3',                      serie: 'ELMS',     klasse: 'LMGT3' },
    { pad: 'LeMansCup/2026/championship_standings/GT3',                   serie: 'LM Cup',   klasse: 'GT3' },
  ],
}

// Alle paden voor 'alle' filter
const ALLE_PADEN = Object.values(FIREBASE_PADEN).flat()

// ─── Firebase fetch helper ────────────────────────────────────────────────────
async function fetchFirebase(pad: string, serie: string, klasse: string): Promise<Rijder[]> {
  try {
    const r = await fetch(`${RTDB}/${pad}.json`)
    if (!r.ok) return []
    const data = await r.json()
    if (!data) return []
    // Firebase geeft object terug met keys als positie of rijder-id
    const items = Array.isArray(data) ? data : Object.values(data)
    return items
      .filter((item: any) => item && item.naam)
      .map((item: any, i: number) => ({
        positie:       item.positie      ?? i + 1,
        naam:          item.naam         ?? '',
        nationaliteit: item.nationaliteit?? '',
        vlag:          item.vlag         ?? '',
        team:          item.team         ?? '',
        nr:            item.nummer           ?? 0,
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
  const code = VLAG_CODES[emoji]
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
  'WEC':    '#3b82f6',
  'ELMS':   '#f97316',
  'LM Cup': '#f59e0b',
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
      {/* Positie */}
      <div className={`absolute top-2 left-3 font-head font-black ${groottes[rijder.positie - 1]} leading-none opacity-10`}
        style={{ color: kleur }}>
        {rijder.positie}
      </div>
      {/* Medaille */}
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
      {/* Positie */}
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

      {/* Vlag + naam */}
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
          {/* Puntenbalk */}
          <div className="mt-1.5 h-0.5 w-full bg-brand-border rounded-full overflow-hidden max-w-[200px]">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${breedte}%`, background: filterKleur }} />
          </div>
        </div>
      </div>

      {/* Nr */}
      <div className="w-12 flex-shrink-0 text-center hidden sm:block">
        <span className="font-head text-sm font-bold text-brand-orange">#{rijder.nr}</span>
      </div>

      {/* Punten */}
      <div className="w-20 flex-shrink-0 text-right pr-4 py-3">
        <span className="font-head text-lg font-black text-brand-light">{rijder.punten}</span>
        <div className="font-ui text-[10px] text-brand-muted">pts</div>
      </div>
    </div>
  )
}

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function Klassement() {
  const [actief, setActief]         = useState('alle')
  const [rijders, setRijders]       = useState<Rijder[]>([])
  const [laden, setLaden]           = useState(false)
  const [zoek, setZoek]             = useState('')

  const filterConfig = FILTERS.find(f => f.id === actief) ?? FILTERS[0]

  const laadData = useCallback(async (filterId: string) => {
    setLaden(true)
    setRijders([])
    const paden = filterId === 'alle' ? ALLE_PADEN : FIREBASE_PADEN[filterId] ?? []
    const resultaten = await Promise.all(paden.map(p => fetchFirebase(p.pad, p.serie, p.klasse)))
    const gecombineerd = resultaten
      .flat()
      .sort((a, b) => b.punten - a.punten)
      .map((r, i) => ({ ...r, positie: i + 1 }))
    setRijders(gecombineerd)
    setLaden(false)
  }, [])

  useEffect(() => { laadData(actief) }, [actief, laadData])

  const gefilterd = rijders.filter(r =>
    !zoek || [r.naam, r.team, r.nationaliteit].some(s => s.toLowerCase().includes(zoek.toLowerCase()))
  )

  const top3      = gefilterd.slice(0, 3)
  const rest      = gefilterd.slice(3)
  const maxPunten = gefilterd[0]?.punten ?? 1
  const toonKlasse = actief === 'alle' || actief === 'lmp3' || actief === 'gt3'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Hero ── */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-brand-card border border-brand-border">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${filterConfig.kleur}18 0%, transparent 70%)`, transform: 'translate(30%,-30%)' }} />
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-head font-black text-3xl sm:text-4xl uppercase tracking-wide leading-none">
              Klassement 2026
            </h1>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-ui font-bold uppercase tracking-widest"
              style={{ background: `${filterConfig.kleur}22`, color: filterConfig.kleur, border: `1px solid ${filterConfig.kleur}44` }}>
              {filterConfig.label}
            </span>
          </div>
          <p className="font-ui text-sm text-brand-muted">WEC · ELMS · Michelin Le Mans Cup</p>
        </div>
      </div>

      {/* ── Filter knoppen ── */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {FILTERS.map(f => (
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
          {/* Volgorde: 2 - 1 - 3 */}
          {[top3[1], top3[0], top3[2]].filter(Boolean).map(r => (
            <PodiumKaart key={`${r.naam}-${r.serie}`} rijder={r} filterKleur={filterConfig.kleur} />
          ))}
        </div>
      )}

      {/* ── Volledige tabel ── */}
      {!laden && gefilterd.length > 0 && (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          {/* Tabel header */}
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

          {/* Top 3 in tabel */}
          {top3.map(r => (
            <TabelRij key={`${r.naam}-${r.serie}-t`} rijder={r} maxPunten={maxPunten} filterKleur={filterConfig.kleur} toonKlasse={toonKlasse} />
          ))}

          {/* Scheidingslijn na top 3 */}
          {rest.length > 0 && top3.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-white/[0.01]">
              <div className="flex-1 h-px bg-brand-border/30" />
            </div>
          )}

          {/* Rest */}
          {rest.map(r => (
            <TabelRij key={`${r.naam}-${r.serie}-r`} rijder={r} maxPunten={maxPunten} filterKleur={filterConfig.kleur} toonKlasse={toonKlasse} />
          ))}
        </div>
      )}

      {/* ── Noot onderaan ── */}
      {!laden && (
        <p className="font-ui text-xs text-brand-muted mt-4 text-right">
          Data via Firebase · Alkamel API wordt later gekoppeld
        </p>
      )}
    </div>
  )
}
