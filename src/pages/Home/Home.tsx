import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SeriesBadge from '@/components/SeriesBadge/SeriesBadge'

// ─── Ticker ───────────────────────────────────────────────────────────────────

function LiveTicker() {
  const items = [
    '🔴 WEC Spa — Lap 142/177 — #8 Toyota GR010 leads',
    'MotoGP Mugello — FP3: Bagnaia P1 — 1:45.231',
    'GT3 Nürburgring 24h — 6h remaining — #42 BMW M4 GT3 P1',
    'WorldSBK Donington — Race 1: Toprak wins',
    'WEC — #7 Toyota pitstop — 23.4s — back P2',
  ]
  const doubled = [...items, ...items]

  return (
    <div className="bg-brand-red overflow-hidden py-2">
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 px-8 font-ui text-xs font-semibold uppercase tracking-wider text-white after:content-['//'] after:ml-8 after:opacity-50"
            >
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
    <section className="relative h-[480px] flex items-end pb-14 px-8 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 40%, #0d0500 100%)' }}
      />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(rgba(230,51,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(230,51,0,0.07) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 60% 50%, black 40%, transparent 100%)',
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[360px] h-[360px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(230,51,0,0.12) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-2xl animate-slide-up">
        <div className="inline-flex items-center gap-2 bg-red-900/30 border border-red-700/40 text-brand-orange font-ui text-xs font-semibold uppercase tracking-[2px] px-3 py-1.5 rounded mb-4">
          🏁 {t('hero.tag')}
        </div>
        <h1 className="font-head font-black text-[72px] leading-none tracking-tight uppercase mb-4">
          GRID<span className="text-brand-orange">24</span><br />HQ
        </h1>
        <p className="font-ui text-sm text-brand-muted mb-7 leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <div className="flex gap-3">
          <Link to="/live"     className="btn-primary">{t('hero.cta_live')}</Link>
          <Link to="/calendar" className="btn-secondary">{t('hero.cta_cal')}</Link>
        </div>
      </div>
    </section>
  )
}

// ─── Live Card ────────────────────────────────────────────────────────────────

function LiveRaceCard() {
  const positions = [
    { pos: 1, num: '#8',  driver: 'Buemi / Hartley / Hirakawa', team: 'Toyota Gazoo Racing',  gap: 'Leader',  lap: '1:52.834', color: '#ff4020' },
    { pos: 2, num: '#7',  driver: 'Conway / Kobayashi / Lopez', team: 'Toyota Gazoo Racing',  gap: '+12.4s',  lap: '1:53.001', color: '#ff4020' },
    { pos: 3, num: '#93', driver: 'Jenson / Cullen / Nato',     team: 'Peugeot TotalEnergies',gap: '+48.2s',  lap: '1:54.211', color: '#4080ff' },
  ]

  return (
    <div className="card card-accent p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center gap-1.5 bg-brand-red text-white font-ui text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded">
          <span className="live-dot" /> Live
        </span>
        <SeriesBadge series="wec" />
      </div>
      <h3 className="font-head font-bold text-xl uppercase tracking-wide mb-0.5">
        6 Hours of Spa-Francorchamps
      </h3>
      <p className="font-ui text-xs text-brand-orange uppercase tracking-[2px] mb-4">
        WEC 2025 · Ronde 3/8 · Lap 142/177
      </p>
      <div className="space-y-1.5">
        {positions.map(({ pos, num, driver, team, gap, lap, color }) => (
          <div key={pos} className="flex items-center gap-3 bg-white/[0.03] rounded px-3 py-2">
            <span className={`font-head text-lg font-black w-6 text-center ${
              pos === 1 ? 'text-brand-amber' : pos === 2 ? 'text-gray-300' : 'text-yellow-700'
            }`}>{pos}</span>
            <span className="font-ui text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}25`, color }}>
              {num}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-head font-bold text-sm truncate">{driver}</div>
              <div className="font-ui text-xs text-brand-muted truncate">{team}</div>
            </div>
            <div className="font-ui text-xs font-semibold text-brand-orange w-16 text-right">{gap}</div>
            <div className="font-ui text-xs text-brand-muted w-20 text-right hidden lg:block">{lap}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Calendar strip ───────────────────────────────────────────────────────────

function UpcomingRaces() {
  const { t } = useTranslation()
  const races = [
    { date: '25', month: 'MEI', event: 'Le Mans Test Day', series: 'wec'    as const, circuit: 'Circuit de la Sarthe', next: true },
    { date: '01', month: 'JUN', event: 'Mugello GP',       series: 'motogp' as const, circuit: 'Autodromo del Mugello' },
    { date: '14', month: 'JUN', event: '24h Le Mans',      series: 'wec'    as const, circuit: 'Circuit de la Sarthe' },
    { date: '22', month: 'JUN', event: 'Assen TT',         series: 'motogp' as const, circuit: 'TT Circuit Assen' },
    { date: '28', month: 'JUN', event: 'Misano WSBK',      series: 'wsb'    as const, circuit: 'Marco Simoncelli' },
  ]
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title">{t('sections.upcoming')}</h2>
        <Link to="/calendar" className="font-ui text-xs text-brand-orange uppercase tracking-wider hover:underline">
          {t('sections.fullCal')}
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-2.5">
        {races.map((r, i) => (
          <div
            key={i}
            className={`card p-4 text-center cursor-pointer hover:border-brand-orange transition-colors ${
              r.next ? 'border-brand-red bg-red-950/10' : ''
            }`}
          >
            <div className="font-head text-2xl font-black text-brand-orange leading-none">{r.date}</div>
            <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider mb-2">{r.month}</div>
            <div className="font-head text-sm font-bold leading-tight mb-1">{r.event}</div>
            <SeriesBadge series={r.series} />
            <div className="font-ui text-[10px] text-brand-muted mt-1 truncate">{r.circuit}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Series list ──────────────────────────────────────────────────────────────

function SeriesList() {
  const { t } = useTranslation()
  const items = [
    { id: 'wec'    as const, sub: '8 rounds · Hypercar · LMP2 · GT3',  to: '/wec' },
    { id: 'motogp' as const, sub: '20 rounds · MotoGP · Moto2 · Moto3', to: '/motogp' },
    { id: 'gt3'    as const, sub: 'Sprint & endurance · Multi-class',   to: '/gt3' },
    { id: 'wsb'    as const, sub: '13 rounds · Superbike · SSP',        to: '/worldsbk' },
  ]
  return (
    <section>
      <h2 className="section-title mb-5">{t('sections.series')}</h2>
      <div className="space-y-2">
        {items.map(({ id, sub, to }) => (
          <Link
            key={id}
            to={to}
            className="card flex items-center gap-4 p-4 hover:border-brand-orange transition-all group"
          >
            <div
              className="w-11 h-11 rounded-md flex items-center justify-center font-head text-xs font-black flex-shrink-0"
              style={{ background: `${SERIES_HEX[id]}18`, color: SERIES_HEX[id] }}
            >
              {id.toUpperCase().slice(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-head text-base font-bold uppercase tracking-wide">
                {id === 'wec' ? 'World Endurance Championship' :
                 id === 'motogp' ? 'MotoGP World Championship' :
                 id === 'gt3' ? 'GT3 / Fanatec Series' : 'WorldSBK Championship'}
              </div>
              <div className="font-ui text-xs text-brand-muted">{sub}</div>
            </div>
            <span className="text-brand-muted group-hover:text-brand-orange transition-colors text-lg">›</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

const SERIES_HEX: Record<string, string> = {
  wec: '#3b82f6', motogp: '#f97316', gt3: '#22c55e', wsb: '#ec4899',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <LiveTicker />
      <Hero />

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-12">
        {/* Live races */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">{t('sections.liveRecent')}</h2>
            <Link to="/live" className="font-ui text-xs text-brand-orange uppercase tracking-wider hover:underline">
              {t('sections.seeAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LiveRaceCard />
            <LiveRaceCard />
          </div>
        </section>

        <UpcomingRaces />

        <div className="grid grid-cols-2 gap-8">
          <SeriesList />

          {/* Standings placeholder */}
          <section>
            <h2 className="section-title mb-5">{t('sections.standings')}</h2>
            <div className="card p-5">
              <div className="font-ui text-xs text-brand-orange uppercase tracking-[2px] mb-4">
                MotoGP — Rijders 2025
              </div>
              {[
                { pos: 1, name: 'F. Bagnaia',   pts: 156, pct: 78 },
                { pos: 2, name: 'J. Martín',    pts: 144, pct: 72 },
                { pos: 3, name: 'M. Márquez',   pts: 132, pct: 66 },
                { pos: 4, name: 'E. Bastianini',pts: 110, pct: 55 },
                { pos: 5, name: 'B. Binder',    pts: 96,  pct: 48 },
              ].map(({ pos, name, pts, pct }) => (
                <div key={pos} className="flex items-center gap-3 py-2.5 border-b border-brand-border last:border-0">
                  <span className={`font-head text-xl font-black w-7 ${
                    pos === 1 ? 'text-brand-amber' : pos === 2 ? 'text-gray-300' : pos === 3 ? 'text-yellow-700' : 'text-brand-muted'
                  }`}>{pos}</span>
                  <span className="font-head text-sm font-bold flex-1">{name}</span>
                  <div className="flex-1 h-1 bg-white/[0.07] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #e63300, #ff6600)' }} />
                  </div>
                  <span className="font-ui text-xs font-semibold text-brand-orange w-14 text-right">{pts} pts</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
