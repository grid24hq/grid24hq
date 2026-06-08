// ─── WEC 2026 — Compact overzicht + Modal detail ──────────────────────────────
import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Driver {
  id: string
  naam: string
  nationaliteit: string
  vlag: string
}
interface Team {
  id: string
  nr: number
  nrPad?: string
  naam: string
  fabrikant: string
  carModel: string
  klasse: 'Hypercar' | 'GT3 Am'
  kleur: string
  info: string
  drivers: Driver[]
}

// ─── Kleuren ──────────────────────────────────────────────────────────────────
const KLASSE_KLEUR: Record<string, string> = {
  'Hypercar': '#3b82f6',
  'GT3 Am':   '#22c55e',
}
const KLASSE_MAP: Record<string, string> = {
  'Hypercar': 'hypercar',
  'GT3 Am':   'gt3',
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const TEAMS: Team[] = [
  { id: 'toyota-7',    nr: 7,   carModel: 'toyota-gr010',         naam: 'Toyota Gazoo Racing',       fabrikant: 'Toyota',       klasse: 'Hypercar', kleur: '#e8002d', info: 'Toyota GR010 Hybrid — verdedigt het constructeurskampioenschap met een beproefd LMH-prototype.',
    drivers: [{ id: 'kamui-kobayashi', naam: 'Kamui Kobayashi', nationaliteit: 'Japan',       vlag: '🇯🇵' }, { id: 'mike-conway', naam: 'Mike Conway', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'nyck-de-vries', naam: 'Nyck de Vries', nationaliteit: 'Nederland', vlag: '🇳🇱' }] },
  { id: 'toyota-8',    nr: 8,   carModel: 'toyota-gr010',         naam: 'Toyota Gazoo Racing',       fabrikant: 'Toyota',       klasse: 'Hypercar', kleur: '#e8002d', info: 'Toyota GR010 Hybrid — identiek package, maximale setup-vrijheid per race.',
    drivers: [{ id: 'sebastien-buemi', naam: 'Sébastien Buemi', nationaliteit: 'Zwitserland', vlag: '🇨🇭' }, { id: 'brendon-hartley', naam: 'Brendon Hartley', nationaliteit: 'N. Zeeland', vlag: '🇳🇿' }, { id: 'ryo-hirakawa', naam: 'Ryo Hirakawa', nationaliteit: 'Japan', vlag: '🇯🇵' }] },
  { id: 'aston-007',   nr: 7,   nrPad: '007', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b', info: 'Aston Martin Valkyrie AMR Pro — de ultieme hypercar rechtstreeks van de weg naar Le Mans.',
    drivers: [{ id: 'harry-tincknell', naam: 'Harry Tincknell', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'tom-gamble', naam: 'Tom Gamble', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'aston-009',   nr: 9,   nrPad: '009', carModel: 'aston-martin-valkyrie', naam: 'Aston Martin Aramco', fabrikant: 'Aston Martin', klasse: 'Hypercar', kleur: '#006b5b', info: 'Aston Martin Valkyrie AMR Pro — tweede exemplaar, dezelfde razendsnelle V12-krachtbron.',
    drivers: [{ id: 'alex-riberas', naam: 'Alex Riberas', nationaliteit: 'Spanje', vlag: '🇪🇸' }, { id: 'marco-sorensen', naam: 'Marco Sørensen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }] },
  { id: 'cadillac-12', nr: 12,  carModel: 'cadillac',             naam: 'Cadillac Racing',            fabrikant: 'Cadillac',     klasse: 'Hypercar', kleur: '#a0001c', info: 'Cadillac V-Series.R — de Amerikaanse uitdager in de Hypercar-klasse.',
    drivers: [{ id: 'norman-nato', naam: 'Norman Nato', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'will-stevens', naam: 'Will Stevens', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'bmw-15',      nr: 15,  carModel: 'bmwm-hybrid-v8',       naam: 'BMW M Team WRT',             fabrikant: 'BMW',          klasse: 'Hypercar', kleur: '#1c69d4', info: 'BMW M Hybrid V8 — BMW keert terug naar Le Mans met een moderne LMDh-hypercar.',
    drivers: [{ id: 'dries-vanthoor', naam: 'Dries Vanthoor', nationaliteit: 'België', vlag: '🇧🇪' }, { id: 'kevin-magnussen', naam: 'Kevin Magnussen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }, { id: 'raffaele-marciello', naam: 'Raffaele Marciello', nationaliteit: 'Italië', vlag: '🇮🇹' }] },
  { id: 'genesis-17',  nr: 17,  carModel: 'genesis',              naam: 'Genesis X Gran Berlinetta',  fabrikant: 'Genesis',      klasse: 'Hypercar', kleur: '#c0a020', info: 'Genesis X Gran Berlinetta — het Koreaanse luxemerk maakt zijn debuut in de Hypercar-klasse.',
    drivers: [{ id: 'andre-lotterer', naam: 'André Lotterer', nationaliteit: 'Duitsland', vlag: '🇩🇪' }, { id: 'luis-felipe-derani', naam: 'Luis Felipe Derani', nationaliteit: 'Brazilië', vlag: '🇧🇷' }, { id: 'mathys-jaubert', naam: 'Mathys Jaubert', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
  { id: 'genesis-19',  nr: 19,  carModel: 'genesis',              naam: 'Genesis X Gran Berlinetta',  fabrikant: 'Genesis',      klasse: 'Hypercar', kleur: '#c0a020', info: 'Genesis X Gran Berlinetta — tweede exemplaar voor maximale dataverzameling.',
    drivers: [{ id: 'daniel-juncadella', naam: 'Daniel Juncadella', nationaliteit: 'Spanje', vlag: '🇪🇸' }, { id: 'mathieu-jaminet', naam: 'Mathieu Jaminet', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'paul-loup-chatin', naam: 'Paul-Loup Chatin', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
  { id: 'bmw-20',      nr: 20,  carModel: 'bmwm-hybrid-v8',       naam: 'BMW M Team WRT',             fabrikant: 'BMW',          klasse: 'Hypercar', kleur: '#1c69d4', info: 'BMW M Hybrid V8 — tweede BMW met drie topcoureurs.',
    drivers: [{ id: 'rene-rast', naam: 'René Rast', nationaliteit: 'Duitsland', vlag: '🇩🇪' }, { id: 'robin-frijns', naam: 'Robin Frijns', nationaliteit: 'Nederland', vlag: '🇳🇱' }, { id: 'sheldon-van-der-linde', naam: 'Sheldon van der Linde', nationaliteit: 'Z. Afrika', vlag: '🇿🇦' }] },
  { id: 'alpine-35',   nr: 35,  carModel: 'alpine-a424',          naam: 'Alpine Endurance Team',      fabrikant: 'Alpine',       klasse: 'Hypercar', kleur: '#0093cc', info: 'Alpine A424 — Alpines LMDh-prototype, aangedreven door een Mecachrome-motor.',
    drivers: [{ id: 'antonio-felix-da-costa', naam: 'António Félix da Costa', nationaliteit: 'Portugal', vlag: '🇵🇹' }, { id: 'charles-milesi', naam: 'Charles Milesi', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'ferdinand-habsburg', naam: 'Ferdinand Habsburg', nationaliteit: 'Oostenrijk', vlag: '🇦🇹' }] },
  { id: 'alpine-36',   nr: 36,  carModel: 'alpine-a424',          naam: 'Alpine Endurance Team',      fabrikant: 'Alpine',       klasse: 'Hypercar', kleur: '#0093cc', info: 'Alpine A424 — tweede Alpine met een sterk trio.',
    drivers: [{ id: 'frederic-makowiecki', naam: 'Frédéric Makowiecki', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'jules-gounon', naam: 'Jules Gounon', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'victor-martins', naam: 'Victor Martins', nationaliteit: 'Monaco', vlag: '🇲🇨' }] },
  { id: 'cadillac-38', nr: 38,  carModel: 'cadillac',             naam: 'Cadillac Racing',            fabrikant: 'Cadillac',     klasse: 'Hypercar', kleur: '#a0001c', info: 'Cadillac V-Series.R — tweede Cadillac met drie ervaren coureurs.',
    drivers: [{ id: 'earl-bamber', naam: 'Earl Bamber', nationaliteit: 'N. Zeeland', vlag: '🇳🇿' }, { id: 'jack-aitken', naam: 'Jack Aitken', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'sebastien-bourdais', naam: 'Sébastien Bourdais', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
  { id: 'ferrari-50',  nr: 50,  carModel: 'ferrari-499',          naam: 'Ferrari AF Corse',           fabrikant: 'Ferrari',      klasse: 'Hypercar', kleur: '#e8002d', info: 'Ferrari 499P — Il Cavallino Rampante strijdt voor de Hypercar-titel.',
    drivers: [{ id: 'antonio-fuoco', naam: 'Antonio Fuoco', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'miguel-molina', naam: 'Miguel Molina', nationaliteit: 'Spanje', vlag: '🇪🇸' }, { id: 'nicklas-nielsen', naam: 'Nicklas Nielsen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }] },
  { id: 'ferrari-51',  nr: 51,  carModel: 'ferrari-499',          naam: 'Ferrari AF Corse',           fabrikant: 'Ferrari',      klasse: 'Hypercar', kleur: '#e8002d', info: 'Ferrari 499P — twee identieke exemplaren, maximale datacollectie voor Ferrari.',
    drivers: [{ id: 'alessandro-pier-guidi', naam: 'Alessandro Pier Guidi', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'antonio-giovinazzi', naam: 'Antonio Giovinazzi', nationaliteit: 'Italië', vlag: '🇮🇹' }, { id: 'james-calado', naam: 'James Calado', nationaliteit: 'Engeland', vlag: '🇬🇧' }] },
  { id: 'ferrari-83',  nr: 83,  carModel: 'ferrari-499',          naam: 'AF Corse',                   fabrikant: 'Ferrari',      klasse: 'Hypercar', kleur: '#e8002d', info: 'Ferrari 499P — derde Ferrari-entry, gedreven door een sterk internationaal trio.',
    drivers: [{ id: 'philip-hanson', naam: 'Philip Hanson', nationaliteit: 'Engeland', vlag: '🇬🇧' }, { id: 'robert-kubica', naam: 'Robert Kubica', nationaliteit: 'Polen', vlag: '🇵🇱' }, { id: 'yifei-ye', naam: 'Yifei Ye', nationaliteit: 'China', vlag: '🇨🇳' }] },
  { id: 'peugeot-93',  nr: 93,  carModel: 'peugeot-9x8',         naam: 'Peugeot TotalEnergies',      fabrikant: 'Peugeot',      klasse: 'Hypercar', kleur: '#00aaff', info: 'Peugeot 9X8 — de vleugelloze LMH, strak, snel en onmiskenbaar Frans.',
    drivers: [{ id: 'nick-cassidy', naam: 'Nick Cassidy', nationaliteit: 'N. Zeeland', vlag: '🇳🇿' }, { id: 'paul-di-resta', naam: 'Paul Di Resta', nationaliteit: 'Schotland', vlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' }, { id: 'stoffel-vandoorne', naam: 'Stoffel Vandoorne', nationaliteit: 'België', vlag: '🇧🇪' }] },
  { id: 'peugeot-94',  nr: 94,  carModel: 'peugeot-9x8',         naam: 'Peugeot TotalEnergies',      fabrikant: 'Peugeot',      klasse: 'Hypercar', kleur: '#00aaff', info: 'Peugeot 9X8 — tweede exemplaar met drie topcoureurs.',
    drivers: [{ id: 'loic-duval', naam: 'Loïc Duval', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }, { id: 'malthe-jakobsen', naam: 'Malthe Jakobsen', nationaliteit: 'Denemarken', vlag: '🇩🇰' }, { id: 'theo-pourchaire', naam: 'Théo Pourchaire', nationaliteit: 'Frankrijk', vlag: '🇫🇷' }] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function nrStr(team: Team) { return team.nrPad ?? String(team.nr) }
function carSrc(team: Team) {
  const map = KLASSE_MAP[team.klasse] ?? 'hypercar'
  return `/wec/${map}/cars/2026-wec-${nrStr(team)}-${team.carModel}.webp`
}
function driverSrc(team: Team, driver: Driver) {
  const map = KLASSE_MAP[team.klasse] ?? 'hypercar'
  return `/wec/${map}/drivers/2026-wec-${nrStr(team)}-${driver.id}.webp`
}

function KlasseBadge({ klasse }: { klasse: string }) {
  const c = KLASSE_KLEUR[klasse] ?? '#888'
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-ui font-bold uppercase tracking-widest"
      style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}>
      {klasse}
    </span>
  )
}

// ─── Team Rij (compact overzicht) ─────────────────────────────────────────────
function TeamRij({ team, onClick }: { team: Team; onClick: () => void }) {
  const klasseKleur = KLASSE_KLEUR[team.klasse] ?? '#888'
  return (
    <button
      onClick={onClick}
      className="w-full text-left group flex items-center gap-0 hover:bg-white/[0.03] transition-colors border-b border-brand-border/40 last:border-0 cursor-pointer"
    >
      {/* Kleur accent */}
      <div className="w-0.5 self-stretch flex-shrink-0" style={{ background: klasseKleur }} />

      {/* Nr */}
      <div className="w-16 flex-shrink-0 px-3 py-3">
        <span className="font-head text-xl font-black text-brand-orange">
          #{nrStr(team)}
        </span>
      </div>

      {/* Auto thumbnail */}
      <div className="w-32 flex-shrink-0 py-2 pr-3 hidden sm:block">
        <div className="overflow-hidden rounded" style={{ aspectRatio: '900/260', background: '#111' }}>
          <img
            src={carSrc(team)}
            alt={team.carModel}
            className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.2' }}
          />
        </div>
      </div>

      {/* Team naam + fabrikant */}
      <div className="flex-1 min-w-0 py-3 pr-3">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="font-head font-bold text-sm text-brand-light group-hover:text-white transition-colors">{team.naam}</span>
          <KlasseBadge klasse={team.klasse} />
        </div>
        <span className="font-ui text-xs text-brand-muted">{team.fabrikant}</span>
      </div>

      {/* Rijders */}
      <div className="flex items-center gap-1.5 py-3 pr-4 flex-wrap justify-end hidden md:flex">
        {team.drivers.map(d => (
          <span key={d.id} className="font-ui text-xs text-brand-muted whitespace-nowrap">
            {d.vlag} {d.naam}
          </span>
        ))}
      </div>

      {/* Pijl */}
      <div className="pr-4 text-brand-muted group-hover:text-brand-orange transition-colors flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </div>
    </button>
  )
}

// ─── Modal detail ─────────────────────────────────────────────────────────────
function TeamModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const klasseKleur = KLASSE_KLEUR[team.klasse] ?? '#888'
  const cols = team.drivers.length === 2 ? 'grid-cols-2' : team.drivers.length === 3 ? 'grid-cols-3' : 'grid-cols-4'

  // Sluit bij Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-brand-card border border-brand-border rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Kleur accent balk */}
        <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl" style={{ background: klasseKleur }} />

        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-head text-4xl font-black text-brand-orange">#{nrStr(team)}</span>
              <KlasseBadge klasse={team.klasse} />
            </div>
            <h2 className="font-head text-2xl font-bold text-brand-light">{team.naam}</h2>
            <p className="font-ui text-sm text-brand-muted">{team.fabrikant}</p>
          </div>
          <button
            onClick={onClose}
            className="text-brand-muted hover:text-brand-light transition-colors ml-4 mt-1 flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Auto afbeelding */}
        <div className="mx-5 mb-4 overflow-hidden rounded-lg" style={{ background: '#0d0d0d', aspectRatio: '900/260' }}>
          <img
            src={carSrc(team)}
            alt={`${team.naam} #${nrStr(team)}`}
            className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.1' }}
          />
        </div>

        {/* Info */}
        <p className="font-ui text-sm text-brand-muted px-5 mb-5 leading-relaxed">{team.info}</p>

        {/* Rijders */}
        <div className="px-5 pb-5">
          <div className="font-ui text-[10px] text-brand-muted uppercase tracking-[2px] mb-3 flex items-center gap-2">
            <span className="block w-4 h-px bg-brand-border" />
            Rijders
          </div>
          <div className={`grid ${cols} gap-4`}>
            {team.drivers.map(d => (
              <div key={d.id} className="flex flex-col items-center gap-2">
                <div className="w-full overflow-hidden rounded-md" style={{ aspectRatio: '233/350', background: '#111' }}>
                  <img
                    src={driverSrc(team, d)}
                    alt={d.naam}
                    className="w-full h-full object-cover object-top"
                    onError={e => { (e.currentTarget as HTMLImageElement).style.opacity = '0.1' }}
                  />
                </div>
                <div className="text-center">
                  <p className="font-head font-bold text-sm text-brand-light leading-tight">{d.naam}</p>
                  <p className="font-ui text-[11px] text-brand-muted">{d.vlag} {d.nationaliteit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Hoofd pagina ─────────────────────────────────────────────────────────────
export default function WEC() {
  const [geselecteerd, setGeselecteerd] = useState<Team | null>(null)
  const [filterKlasse, setFilterKlasse] = useState<string>('Alle')
  const [zoek, setZoek] = useState('')

  const klassen = ['Alle', 'Hypercar', 'GT3 Am']

  const gefilterd = TEAMS.filter(t => {
    const matchKlasse = filterKlasse === 'Alle' || t.klasse === filterKlasse
    const matchZoek   = !zoek || [t.naam, t.fabrikant, ...t.drivers.map(d => d.naam)]
      .some(s => s.toLowerCase().includes(zoek.toLowerCase()))
    return matchKlasse && matchZoek
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">

      {/* ── Hero ── */}
      <div className="relative mb-8 overflow-hidden rounded-xl bg-brand-card border border-brand-border">
        <div className="absolute inset-0 bg-grid-pattern bg-grid-40 opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', transform: 'translate(30%,-30%)' }} />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="font-head font-black text-3xl sm:text-4xl uppercase tracking-wide leading-none">
                World Endurance Championship
              </h1>
              <SeriesBadge series="wec" size="md" />
            </div>
            <p className="font-ui text-sm text-brand-muted">FIA WEC 2026 · Hypercar · GT3 Am</p>
          </div>
          <div className="flex gap-6">
            {[{ l: 'Teams', v: TEAMS.length }, { l: 'Rijders', v: TEAMS.reduce((s,t) => s + t.drivers.length, 0) }].map(s => (
              <div key={s.l} className="text-center">
                <div className="font-head text-3xl font-black text-brand-orange">{s.v}</div>
                <div className="font-ui text-xs text-brand-muted uppercase tracking-widest">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" placeholder="Zoek team of rijder…" value={zoek} onChange={e => setZoek(e.target.value)}
            className="w-full bg-brand-card border border-brand-border rounded-lg pl-8 pr-4 py-2 font-ui text-sm text-brand-light placeholder:text-brand-muted focus:outline-none focus:border-brand-orange/50 transition-colors" />
        </div>
        <div className="flex gap-1.5">
          {klassen.map(k => (
            <button key={k} onClick={() => setFilterKlasse(k)}
              className={`px-3 py-2 rounded-lg font-ui text-xs font-semibold uppercase tracking-wider border transition-all duration-200 ${filterKlasse === k ? 'text-white border-transparent' : 'text-brand-muted border-brand-border hover:border-brand-border/80'}`}
              style={filterKlasse === k && k !== 'Alle' ? { background: KLASSE_KLEUR[k], borderColor: KLASSE_KLEUR[k] }
                : filterKlasse === k ? { background: '#333', borderColor: '#444' } : {}}>
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* ── Klasse groepen ── */}
      {(['Hypercar', 'GT3 Am'] as const).map(klasse => {
        const teams = gefilterd.filter(t => t.klasse === klasse)
        if (teams.length === 0) return null
        const kl = KLASSE_KLEUR[klasse]
        return (
          <div key={klasse} className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-5 rounded-full" style={{ background: kl }} />
              <h2 className="font-head font-black text-xl uppercase tracking-wide" style={{ color: kl }}>{klasse}</h2>
              <div className="flex-1 h-px bg-brand-border" />
              <span className="font-ui text-xs text-brand-muted">{teams.length} teams</span>
            </div>
            <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
              {teams.map(team => (
                <TeamRij key={team.id} team={team} onClick={() => setGeselecteerd(team)} />
              ))}
            </div>
          </div>
        )
      })}

      {gefilterd.length === 0 && (
        <div className="text-center py-16 text-brand-muted">
          <p className="font-head text-xl">Geen teams gevonden</p>
          <p className="font-ui text-sm mt-1">Pas je zoekterm of filter aan.</p>
        </div>
      )}

      {/* ── Modal ── */}
      {geselecteerd && (
        <TeamModal team={geselecteerd} onClose={() => setGeselecteerd(null)} />
      )}
    </div>
  )
}
