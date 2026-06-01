import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SeriesBadge from '@/components/SeriesBadge'
import { getKalender, type KalenderRace } from '@/services/kalenderApi'

const serieToSeriesId: Record<string, string> = {
  F1: 'f1', WEC: 'wec', MotoGP: 'motogp', GT3: 'gt3', IMSA: 'imsa', WorldSBK: 'wsb',
}

// ─── Ticker ───────────────────────────────────────────────────────────────────
function LiveTicker() {
  const items = [
    '🔴 F1 Canada GP — Live timing op Grid24HQ',
    'WEC Spa — Lap 142/177 — #8 Toyota GR010 leads',
    'MotoGP Mugello — FP3: Bagnaia P1 — 1:45.231',
    'GT3 Nürburgring 24h — 6h remaining — #42 BMW M4 GT3 P1',
    'WorldSBK Donington — Race 1: Toprak wins',
    'IMSA Watkins Glen — #10 Wayne Taylor Racing leads',
  ]
  const doubled = [...items, ...items]
  return (
    <div className="bg-brand-red overflow-hidden py-2">
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 font-ui text-[11px] font-semibold uppercase tracking-wider text-white after:content-['//'] after:ml-6 after:opacity-50">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { t } = useTranslation()
  return (
    <section className="relative min-h-[400px] md:h-[480px] flex items-end pb-10 md:pb-14 px-4 md:px-8 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 40%, #0d0500 100%)' }} />
      <div className="absolute inset-0 opacity-100" style={{
        backgroundImage: `linear-gradient(rgba(230,51,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(230,51,0,0.07) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 60% 50%, black 40%, transparent 100%)',
      }} />
      <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[280px] h-[280px] md:w-[360px] md:h-[360px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,51,0,0.12) 0%, transparent 70%)' }} />
      <div className="relative z-10 max-w-2xl animate-slide-up">
        <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 text-brand-orange font-ui text-xs font-semibold uppercase tracking-[2px] px-3 py-1.5 rounded mb-4">
          🏁 {t('hero.tag')}
        </div>
        <h1 className="font-head font-black text-[56px] md:text-[72px] leading-none tracking-tight uppercase mb-4">
          GRID<span className="text-brand-orange">24</span><br />HQ
        </h1>
        <p className="font-ui text-sm text-brand-muted mb-7 leading-relaxed max-w-md">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/live"     className="btn-primary text-center">{t('hero.cta_live')}</Link>
          <Link to="/kalender" className="btn-secondary text-center">{t('hero.cta_cal')}</Link>
        </div>
      </div>
    </section>
  )
}

// ─── Live Card ────────────────────────────────────────────────────────────────
function LiveRaceCard() {
  const positions = [
    { pos: 1, num: '#1',  driver: 'Max Verstappen',    team: 'Red Bull Racing', gap: 'Leader',  lap: '1:13.820', color: '#3b82f6' },
    { pos: 2, num: '#4',  driver: 'Lando Norris',      team: 'McLaren',         gap: '+2.4s',   lap: '1:14.012', color: '#f97316' },
    { pos: 3, num: '#16', driver: 'Charles Leclerc',   team: 'Ferrari',         gap: '+5.8s',   lap: '1:14.201', color: '#e10600' },
  ]
  return (
    <div className="card card-accent p-4 md:p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 bg-brand-red text-white font-ui text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded">
          <span className="live-dot" /> Live
        </span>
        <span className="font-ui text-[10px] font-bold uppercase tracking-wider text-red-500">F1</span>
      </div>
      <h3 className="font-head font-bold text-lg md:text-xl uppercase tracking-wide mb-0.5">Canadian Grand Prix</h3>
      <p className="font-ui text-xs text-brand-orange uppercase tracking-[2px] mb-4">F1 2026 · Circuit Gilles Villeneuve</p>
      <div className="space-y-1.5">
        {positions.map(({ pos, num, driver, team, gap, lap, color }) => (
          <div key={pos} className="flex items-center gap-2 md:gap-3 bg-white/[0.03] rounded px-2 md:px-3 py-2">
            <span className={`font-head text-base md:text-lg font-black w-5 text-center ${pos === 1 ? 'text-brand-amber' : pos === 2 ? 'text-gray-300' : 'text-yellow-700'}`}>{pos}</span>
            <span className="font-ui text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: `${color}25`, color }}>{num}</span>
            <div className="flex-1 min-w-0">
              <div className="font-head font-bold text-xs md:text-sm truncate">{driver}</div>
              <div className="font-ui text-[10px] text-brand-muted truncate">{team}</div>
            </div>
            <div className="font-ui text-xs font-semibold text-brand-orange w-12 md:w-16 text-right">{gap}</div>
            <div className="font-ui text-[10px] text-brand-muted w-16 text-right hidden lg:block">{lap}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Upcoming Races ───────────────────────────────────────────────────────────
function UpcomingRaces() {
  const { t } = useTranslation()
  const [races, setRaces] = useState<KalenderRace[]>([])
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    getKalender().then((maanden) => {
      const vandaag = new Date()
      vandaag.setHours(0, 0, 0, 0)
      // Verzamel alle toekomstige races, sorteer op datum, pak de eerste 5
      const alleRaces = maanden.flatMap((m) => m.races)
      const komend = alleRaces
        .filter((r) => new Date(r.datum) >= vandaag)
        .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
        .slice(0, 5)
      setRaces(komend)
      setLaden(false)
    })
  }, [])

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">{t('sections.upcoming')}</h2>
        <Link to="/kalender" className="font-ui text-xs text-brand-orange uppercase tracking-wider hover:underline">
          {t('sections.fullCal')}
        </Link>
      </div>
      {laden ? (
        <div className="flex items-center gap-2 py-6">
          <div className="w-4 h-4 border-2 border-brand-border border-t-brand-orange rounded-full animate-spin" />
          <span className="font-ui text-xs text-brand-muted">Laden...</span>
        </div>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
          {races.map((r, i) => {
            const datum = new Date(r.datum)
            const seriesId = serieToSeriesId[r.serie] as any
            const isNext = i === 0
            const dag = String(datum.getDate()).padStart(2, '0')
            const maand = datum.toLocaleDateString('nl-NL', { month: 'short' }).toUpperCase()
            return (
              <Link
                key={`${r.serie}-${r.id}`}
                to="/kalender"
                className={`card p-3 md:p-4 text-center hover:border-brand-orange transition-colors flex-shrink-0 w-36 md:w-auto ${isNext ? 'border-brand-red bg-red-950/10' : ''}`}
              >
                <div className="font-head text-xl md:text-2xl font-black text-brand-orange leading-none">{dag}</div>
                <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider mb-2">{maand}</div>
                <div className="font-head text-xs md:text-sm font-bold leading-tight mb-1">{r.naam}</div>
                {seriesId && <SeriesBadge series={seriesId} />}
                <div className="font-ui text-[10px] text-brand-muted mt-1 truncate">{r.baan}</div>
              </Link>
            )
          })}
          {races.length === 0 && (
            <div className="col-span-5 font-ui text-sm text-brand-muted py-6 text-center">Geen aankomende races gevonden.</div>
          )}
        </div>
      )}
    </section>
  )
}

// ─── Series List ──────────────────────────────────────────────────────────────
const SERIES_HEX: Record<string, string> = {
  f1: '#e10600', wec: '#3b82f6', motogp: '#f97316', gt3: '#22c55e', imsa: '#a855f7', wsb: '#ec4899',
}

function SeriesList() {
  const { t } = useTranslation()
  const items = [
    { id: 'f1',     label: 'Formula 1',                    sub: '22 races · 2026 seizoen',               to: '/f1' },
    { id: 'wec',    label: 'World Endurance Championship', sub: '8 rounds · Hypercar · LMP2 · GT3',      to: '/wec' },
    { id: 'motogp', label: 'MotoGP World Championship',   sub: '20 rounds · MotoGP · Moto2 · Moto3',    to: '/motogp' },
    { id: 'gt3',    label: 'GT3 / Fanatec Series',         sub: 'Sprint & endurance · Multi-class',       to: '/gt3' },
    { id: 'imsa',   label: 'IMSA SportsCar Championship',  sub: '11 rounds · GTP · GTD · LMP3',          to: '/imsa' },
    { id: 'wsb',    label: 'WorldSBK Championship',        sub: '12 rounds · Superbike · SSP',           to: '/worldsbk' },
  ]
  return (
    <section>
      <h2 className="section-title mb-4">{t('sections.series')}</h2>
      <div className="space-y-2">
        {items.map(({ id, label, sub, to }) => (
          <Link key={id} to={to} className="card flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:border-brand-orange transition-all group">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-md flex items-center justify-center font-head text-xs font-black flex-shrink-0"
              style={{ background: `${SERIES_HEX[id]}18`, color: SERIES_HEX[id] }}>
              {id === 'wsb' ? 'SBK' : id.toUpperCase().slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-head text-sm md:text-base font-bold uppercase tracking-wide truncate">{label}</div>
              <div className="font-ui text-xs text-brand-muted">{sub}</div>
            </div>
            <span className="text-brand-muted group-hover:text-brand-orange transition-colors text-lg flex-shrink-0">›</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ─── Standings ────────────────────────────────────────────────────────────────
const STANDINGS_DATA = [
  {
    key: 'f1',
    label: 'F1 — Rijders 2026',
    items: [
      { pos: 1, name: 'M. Verstappen', pts: 136, pct: 85 },
      { pos: 2, name: 'L. Norris',     pts: 118, pct: 74 },
      { pos: 3, name: 'C. Leclerc',    pts: 105, pct: 66 },
      { pos: 4, name: 'O. Piastri',    pts: 98,  pct: 61 },
      { pos: 5, name: 'L. Hamilton',   pts: 87,  pct: 54 },
    ]
  },
  {
    key: 'wec',
    label: 'WEC — Autocoureurs 2026',
    items: [
      { pos: 1, name: 'S. Buemi',        pts: 87, pct: 80 },
      { pos: 2, name: 'K. Kobayashi',    pts: 82, pct: 75 },
      { pos: 3, name: 'K. Estre',        pts: 74, pct: 68 },
      { pos: 4, name: 'A. Pier Guidi',   pts: 70, pct: 64 },
      { pos: 5, name: 'R. Frijns',       pts: 65, pct: 60 },
    ]
  },
  {
    key: 'motogp',
    label: 'MotoGP — Motorcoureurs 2026',
    items: [
      { pos: 1, name: 'F. Bagnaia',    pts: 156, pct: 78 },
      { pos: 2, name: 'J. Martín',     pts: 144, pct: 72 },
      { pos: 3, name: 'M. Márquez',    pts: 132, pct: 66 },
      { pos: 4, name: 'E. Bastianini', pts: 110, pct: 55 },
      { pos: 5, name: 'B. Binder',     pts: 96,  pct: 48 },
    ]
  },
  {
    key: 'worldsbk',
    label: 'WorldSBK — Motorcoureurs 2026',
    items: [
      { pos: 1, name: 'T. Razgatlioglu', pts: 201, pct: 85 },
      { pos: 2, name: 'N. Bulega',       pts: 178, pct: 75 },
      { pos: 3, name: 'A. Bautista',     pts: 165, pct: 70 },
      { pos: 4, name: 'J. Rea',          pts: 142, pct: 60 },
      { pos: 5, name: 'A. Lowes',        pts: 128, pct: 54 },
    ]
  },
]

function Standings() {
  const { t }     = useTranslation()
  const [idx, setIdx] = useState(0)
  const current   = STANDINGS_DATA[idx]

  // Automatisch wisselen verwijderd — gebruiker kiest zelf via de tabs

  return (
    <section>
      <h2 className="section-title mb-4">{t('sections.standings')}</h2>
      <div className="card p-4 md:p-5">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {STANDINGS_DATA.map((s, i) => (
            <button key={s.key} onClick={() => setIdx(i)}
              className={`font-ui text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded transition-colors ${
                i === idx ? 'bg-brand-orange text-white' : 'text-brand-muted hover:text-brand-light'
              }`}>
              {s.key === 'worldsbk' ? 'SBK' : s.key.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="font-ui text-xs text-brand-orange uppercase tracking-[2px] mb-4">{current.label}</div>
        {current.items.map(({ pos, name, pts, pct }) => (
          <div key={pos} className="flex items-center gap-3 py-2.5 border-b border-brand-border last:border-0">
            <span className={`font-head text-lg md:text-xl font-black w-6 ${pos === 1 ? 'text-brand-amber' : pos === 2 ? 'text-gray-300' : pos === 3 ? 'text-yellow-700' : 'text-brand-muted'}`}>{pos}</span>
            <span className="font-head text-sm font-bold flex-1">{name}</span>
            <div className="flex-1 h-1 bg-white/[0.07] rounded-full overflow-hidden hidden sm:block">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #e63300, #ff6600)' }} />
            </div>
            <span className="font-ui text-xs font-semibold text-brand-orange w-14 text-right">{pts} pts</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { t } = useTranslation()
  return (
    <>
      <LiveTicker />
      <Hero />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10 space-y-10 md:space-y-12">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">{t('sections.liveRecent')} 2026</h2>
            <Link to="/live" className="font-ui text-xs text-brand-orange uppercase tracking-wider hover:underline">
              {t('sections.seeAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LiveRaceCard />
            <LiveRaceCard />
          </div>
        </section>
        <UpcomingRaces />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SeriesList />
          <Standings />
        </div>
      </div>
    </>
  )
}
