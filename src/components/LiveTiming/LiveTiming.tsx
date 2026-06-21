import { useState, useEffect, useRef } from 'react'
import { getLiveTiming } from '@/services/raceApi'
import type { TimingEntry } from '@/types'

// ─── Serie kleuren config ─────────────────────────────────────────────────────
const SERIE_CONFIG: Record<string, { kleur: string; bg: string; naam: string; short: string }> = {
  F1:       { kleur: '#e10600', bg: '#1a0000', naam: 'Formula 1',               short: 'F1'   },
  MotoGP:   { kleur: '#f97316', bg: '#1a0d00', naam: 'MotoGP World Championship', short: 'MGP' },
  WEC:      { kleur: '#3b82f6', bg: '#00091a', naam: 'World Endurance Championship', short: 'WEC' },
  GT3:      { kleur: '#22c55e', bg: '#001a08', naam: 'GT3 Racing',               short: 'GT3'  },
  IMSA:     { kleur: '#a855f7', bg: '#0d0019', naam: 'IMSA SportsCar',           short: 'IMSA' },
  WorldSBK: { kleur: '#eab308', bg: '#1a1400', naam: 'WorldSBK Championship',    short: 'SBK'  },
}

const DEFAULT_CONFIG = { kleur: '#f97316', bg: '#1a0d00', naam: 'Live Timing', short: 'LIVE' }

// ─── Positie verandering indicator ───────────────────────────────────────────
function PosChange({ change }: { change: number }) {
  if (change === 0) return <span className="font-ui text-[10px] text-brand-muted w-8 text-center">—0</span>
  if (change > 0)   return <span className="font-ui text-[10px] text-green-400 w-8 text-center">↑{change}</span>
  return               <span className="font-ui text-[10px] text-red-400 w-8 text-center">↓{Math.abs(change)}</span>
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TimingEntry['status'] }) {
  if (status === 'pit')  return <span className="font-ui text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">PIT</span>
  if (status === 'out')  return <span className="font-ui text-[9px] font-bold uppercase bg-red-900/40 text-red-400 px-1.5 py-0.5 rounded">OUT</span>
  if (status === 'slow') return <span className="font-ui text-[9px] font-bold uppercase bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded">SLOW</span>
  return null
}

interface Props {
  sessionId: string
  klasse:    string
  sessieNaam?: string
  status?:   string
  land?:     string
}

export default function LiveTiming({ sessionId, klasse, sessieNaam, status, land }: Props) {
  const cfg = SERIE_CONFIG[klasse] ?? DEFAULT_CONFIG
  const [entries, setEntries]       = useState<TimingEntry[]>([])
  const [isLoading, setIsLoading]   = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [tab, setTab]               = useState<'live' | 'previous'>('live')
  const prevPositions               = useRef<Record<string, number>>({})

  useEffect(() => {
    if (!sessionId) return
    let cancelled = false

    async function load() {
      const data = await getLiveTiming(sessionId)
      if (cancelled) return
      // Bereken positie veranderingen
      const withChange = data.map(e => {
        const prev = prevPositions.current[e.carNumber]
        const change = prev !== undefined ? prev - e.position : 0
        return { ...e, posChange: change }
      })
      // Sla huidige posities op
      data.forEach(e => { prevPositions.current[e.carNumber] = e.position })
      setEntries(withChange as any)
      setLastUpdate(new Date())
      setIsLoading(false)
    }

    load()
    const interval = setInterval(load, 5_000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [sessionId])

  const leader = entries[0]

  return (
    <div className="rounded-xl overflow-hidden border border-white/10" style={{ background: '#111' }}>

      {/* ── Header balk met serie branding ── */}
      <div className="flex items-center justify-between px-4 py-2.5" style={{ background: cfg.kleur + '18', borderBottom: `1px solid ${cfg.kleur}30` }}>
        {/* Links: logo + serie + sessie */}
        <div className="flex items-center gap-3">
          <span className="font-head font-black text-sm tracking-widest text-white">
            GRID<span style={{ color: cfg.kleur }}>24</span>HQ
          </span>
          <div className="w-px h-5 bg-white/20" />
          <span className="font-head font-black text-sm uppercase tracking-wider" style={{ color: cfg.kleur }}>
            {klasse}
          </span>
          {sessieNaam && (
            <span className="font-ui text-xs font-bold text-white uppercase tracking-wider">{sessieNaam}</span>
          )}
          {status && (
            <span className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand-muted flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              {status}
            </span>
          )}
        </div>
        {/* Rechts: land + tijd */}
        <div className="flex items-center gap-3">
          {land && <span className="font-ui text-xs font-semibold text-brand-light uppercase tracking-wider">{land}</span>}
          {lastUpdate && (
            <span className="font-ui text-[10px] text-brand-muted">
              {lastUpdate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* ── Tab balk ── */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10" style={{ background: '#0d0d0d' }}>
        <span className="font-ui text-xs font-bold text-white uppercase tracking-wider">Timing Dashboard</span>
        <div className="flex gap-1">
          <button
            onClick={() => setTab('live')}
            className={`font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-colors ${tab === 'live' ? 'bg-white/15 text-white' : 'text-brand-muted hover:text-white'}`}
          >
            Live timing
          </button>
          <button
            onClick={() => setTab('previous')}
            className={`font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-colors ${tab === 'previous' ? 'bg-white/15 text-white' : 'text-brand-muted hover:text-white'}`}
          >
            Previous sessions
          </button>
        </div>
      </div>

      {/* ── Laden ── */}
      {isLoading && (
        <div className="flex items-center justify-center gap-3 py-16">
          <div className="w-5 h-5 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: cfg.kleur }} />
          <span className="font-ui text-sm text-brand-muted">Live timing laden...</span>
        </div>
      )}

      {/* ── Geen data ── */}
      {!isLoading && entries.length === 0 && (
        <div className="py-16 text-center">
          <div className="text-3xl mb-3">📡</div>
          <p className="font-ui text-sm text-brand-muted">Geen live timing beschikbaar.</p>
          <p className="font-ui text-xs text-brand-muted/60 mt-1">Start de Python tracker voor {klasse}.</p>
        </div>
      )}

      {/* ── Timing tabel ── */}
      {!isLoading && entries.length > 0 && tab === 'live' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr style={{ background: '#0d0d0d', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['P', 'Rijder', '#', 'S1', 'S2', 'S3', 'Last Lap', 'Gap', 'Gap Leader', 'Team'].map(h => (
                  <th key={h} className="px-3 py-2.5 font-ui text-[10px] font-semibold uppercase tracking-wider text-brand-muted whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((entry: any, idx) => {
                const isLeider = entry.position === 1
                const isTop3   = entry.position <= 3
                const rowBg    = isLeider
                  ? `${cfg.kleur}12`
                  : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'

                return (
                  <tr
                    key={entry.carNumber}
                    style={{ background: rowBg, borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    className="hover:brightness-110 transition-all"
                  >
                    {/* Positie */}
                    <td className="px-3 py-2.5 w-10">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-head text-base font-black w-6 ${
                          entry.position === 1 ? 'text-yellow-400'
                          : entry.position === 2 ? 'text-gray-300'
                          : entry.position === 3 ? 'text-amber-600'
                          : 'text-brand-muted'
                        }`}>
                          {entry.position === 900 ? 'NC' : entry.position}
                        </span>
                        <PosChange change={entry.posChange ?? 0} />
                      </div>
                    </td>

                    {/* Rijder */}
                    <td className="px-2 py-2.5 min-w-[160px]">
                      <div className="flex items-center gap-2">
                        <div className="w-0.5 h-5 rounded-full flex-shrink-0" style={{ background: cfg.kleur }} />
                        <span className={`font-head text-sm font-bold uppercase ${isTop3 ? 'text-white' : 'text-brand-light'}`}>
                          {entry.driverName}
                        </span>
                        {entry.status && entry.status !== 'racing' && <StatusBadge status={entry.status} />}
                      </div>
                    </td>

                    {/* Nummer */}
                    <td className="px-2 py-2.5">
                      <span
                        className="font-head text-xs font-black px-2 py-1 rounded"
                        style={{ background: cfg.kleur, color: '#fff', minWidth: 28, display: 'inline-block', textAlign: 'center' }}
                      >
                        {entry.carNumber}
                      </span>
                    </td>

                    {/* Sector 1 */}
                    <td className="px-3 py-2.5 font-mono text-xs text-brand-muted whitespace-nowrap">
                      {entry.sector1 !== '-' ? <span className="text-purple-400">{entry.sector1}</span> : <span className="text-brand-muted/40">—</span>}
                    </td>

                    {/* Sector 2 */}
                    <td className="px-3 py-2.5 font-mono text-xs text-brand-muted whitespace-nowrap">
                      {entry.sector2 !== '-' ? <span className="text-blue-400">{entry.sector2}</span> : <span className="text-brand-muted/40">—</span>}
                    </td>

                    {/* Sector 3 */}
                    <td className="px-3 py-2.5 font-mono text-xs text-brand-muted whitespace-nowrap">
                      {entry.sector3 !== '-' ? <span className="text-green-400">{entry.sector3}</span> : <span className="text-brand-muted/40">—</span>}
                    </td>

                    {/* Last lap */}
                    <td className="px-3 py-2.5 font-mono text-xs text-brand-light whitespace-nowrap">
                      {entry.lastLapTime}
                    </td>

                    {/* Gap to previous */}
                    <td className="px-3 py-2.5 font-mono text-xs whitespace-nowrap">
                      {isLeider
                        ? <span style={{ color: cfg.kleur }} className="font-bold">—0</span>
                        : <span className="text-brand-light">{entry.gap}</span>
                      }
                    </td>

                    {/* Gap to first */}
                    <td className="px-3 py-2.5 font-mono text-xs text-brand-muted whitespace-nowrap">
                      {isLeider ? <span style={{ color: cfg.kleur }}>—0</span> : entry.gapToLeader}
                    </td>

                    {/* Team */}
                    <td className="px-3 py-2.5 font-ui text-xs text-brand-muted whitespace-nowrap max-w-[200px] truncate">
                      <div className="flex items-center gap-1.5">
                        <div className="w-0.5 h-3 rounded-full flex-shrink-0" style={{ background: cfg.kleur + '80' }} />
                        {entry.teamName}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Previous sessions tab ── */}
      {tab === 'previous' && (
        <div className="py-12 text-center">
          <div className="text-3xl mb-3">🏁</div>
          <p className="font-ui text-sm text-brand-muted">Vorige sessies komen hier.</p>
        </div>
      )}

      {/* ── Footer ── */}
      {entries.length > 0 && (
        <div className="flex items-center justify-end gap-2 px-4 py-2.5" style={{ background: '#0d0d0d', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button className="flex items-center gap-1.5 font-ui text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded border border-white/15 text-brand-muted hover:text-white transition-colors">
            ⛶ Full screen
          </button>
          <button className="flex items-center gap-1.5 font-ui text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded border border-white/15 text-brand-muted hover:text-white transition-colors">
            ↑ Share
          </button>
        </div>
      )}
    </div>
  )
}
