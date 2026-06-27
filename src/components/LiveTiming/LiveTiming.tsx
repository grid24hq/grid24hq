// ─── GRID24HQ — LiveTiming v2 (F1Dashboard-stijl) ───────────────────────────
// Vervangt: src/components/LiveTiming/LiveTiming.tsx
// Firebase structuur: /{serie}/{jaar}/{gp}/Live_Timing + Algemeen_Sessie
// Ondersteunt: F1 (banden via "banden"), MotoGP/Moto2/Moto3 (via "sprint.banden"),
//              WEC/IMSA (klasse via "klasse", pit_count, interval)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import { getLiveTiming } from '@/services/raceApi'
import type { TimingEntry } from '@/types'

const FIREBASE_RTDB = 'https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app'
const POLL_MS       = 5_000

// ── Serie config ──────────────────────────────────────────────────────────────
const SERIE: Record<string, { k: string; bg: string }> = {
  F1:       { k: '#e10600', bg: 'rgba(225,6,0,0.07)'    },
  MotoGP:   { k: '#f97316', bg: 'rgba(249,115,22,0.07)' },
  Moto2:    { k: '#f97316', bg: 'rgba(249,115,22,0.07)' },
  Moto3:    { k: '#f97316', bg: 'rgba(249,115,22,0.07)' },
  WEC:      { k: '#3b82f6', bg: 'rgba(59,130,246,0.07)' },
  ELMS:     { k: '#06b6d4', bg: 'rgba(6,182,212,0.07)'  },
  IMSA:     { k: '#a855f7', bg: 'rgba(168,85,247,0.07)' },
  WorldSBK: { k: '#eab308', bg: 'rgba(234,179,8,0.07)'  },
  GT3:      { k: '#22c55e', bg: 'rgba(34,197,94,0.07)'  },
}
const DEF = { k: '#e10600', bg: 'rgba(225,6,0,0.07)' }

// ── Tyre kleuren (F1: SOFT/MEDIUM/HARD/INTER/WET, MotoGP: -)
const TYRE: Record<string, [string, string]> = {
  soft:   ['#e10600','S'], s: ['#e10600','S'],
  medium: ['#f5c518','M'], m: ['#f5c518','M'],
  hard:   ['#e8e8e8','H'], h: ['#e8e8e8','H'],
  inter:  ['#39b54a','I'], i: ['#39b54a','I'],
  wet:    ['#0067ff','W'], w: ['#0067ff','W'],
}

// ── WEC klasse kleuren
const KLASSE_KLEUR: Record<string, string> = {
  hypercar: '#facc15', lmp2: '#60a5fa', lmgt3: '#4ade80',
  gtp: '#facc15', gtd: '#4ade80', gtd_pro: '#f472b6', lmp3: '#a78bfa',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cfg(klasse: string) { return SERIE[klasse] ?? DEF }

function TyreBadge({ tyre }: { tyre?: string }) {
  if (!tyre || tyre === '-') return <span className="text-gray-600 text-xs">—</span>
  const key = tyre.trim().toLowerCase()
  const [kleur, label] = TYRE[key] ?? TYRE[key.charAt(0)] ?? ['#888', tyre.charAt(0).toUpperCase()]
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black"
      style={{ background: kleur+'22', color: kleur, border: `1px solid ${kleur}55` }}>
      {label}
    </span>
  )
}

function PosChange({ v }: { v: number }) {
  if (!v) return <span className="text-[9px] text-gray-700 w-4 inline-block">—</span>
  return v > 0
    ? <span className="text-[9px] text-green-400 w-4 inline-block">▲{v}</span>
    : <span className="text-[9px] text-red-400 w-4 inline-block">▼{Math.abs(v)}</span>
}

function KlasseBadge({ klasse }: { klasse?: string }) {
  if (!klasse || klasse === 'f1') return null
  const k = klasse.toLowerCase()
  const kleur = KLASSE_KLEUR[k] ?? '#888'
  return (
    <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded ml-1"
      style={{ background: kleur+'22', color: kleur, border: `1px solid ${kleur}44` }}>
      {klasse.toUpperCase()}
    </span>
  )
}

function StatusBadge({ status }: { status?: string }) {
  if (!status || status === 'racing') return null
  const map: Record<string, [string,string]> = {
    pit:  ['rgba(245,197,24,0.2)','#f5c518'],
    out:  ['rgba(239,68,68,0.2)', '#ef4444'],
    dnf:  ['rgba(239,68,68,0.2)', '#ef4444'],
    slow: ['rgba(96,165,250,0.2)','#60a5fa'],
  }
  const [bg, col] = map[status.toLowerCase()] ?? ['rgba(100,100,100,0.2)', '#888']
  const labels: Record<string,string> = { pit:'IN PIT', out:'OUT', dnf:'DNF', slow:'SLOW' }
  return (
    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ml-1"
      style={{ background: bg, color: col, border: `1px solid ${col}55` }}>
      {labels[status.toLowerCase()] ?? status.toUpperCase()}
    </span>
  )
}

function Sector({ t, kleur }: { t?: string; kleur: string }) {
  if (!t || t === '-') return (
    <span className="inline-block w-11 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.06)' }} />
  )
  return (
    <span className="inline-flex items-center justify-center h-2 min-w-[2.75rem] rounded-sm font-mono text-[8px] font-bold px-1"
      style={{ background: kleur+'33', color: kleur }}>
      {t}
    </span>
  )
}

// ── Weer balk ─────────────────────────────────────────────────────────────────

interface Weer {
  lucht_temp?: string|number; baan_temp?: string|number
  luchtvochtigheid?: string|number; wind_speed?: string|number
  droog_nat?: string; conditie?: string
  lucht?: string; baan?: string  // legacy
  race_klok?: string  // WEC
}

function WeerBalk({ w }: { w: Weer|null }) {
  if (!w) return null
  const lucht = w.lucht_temp ?? w.lucht ?? '—'
  const baan  = w.baan_temp  ?? w.baan  ?? '—'
  const vocht = w.luchtvochtigheid ?? '—'
  const wind  = w.wind_speed ?? '—'
  const cond  = w.droog_nat ?? w.conditie ?? ''

  const items = [
    { icon: '🌡', lbl: 'AIR',   val: lucht !== '—' ? `${lucht}°C` : '—' },
    { icon: '🏁', lbl: 'TRACK', val: baan  !== '—' ? `${baan}°C`  : '—' },
    { icon: '💧', lbl: 'HUM',   val: vocht !== '—' ? `${vocht}%`  : '—' },
    { icon: '💨', lbl: 'WIND',  val: wind  !== '—' ? `${wind} m/s`: '—' },
    ...(cond ? [{ icon: cond.toLowerCase().includes('wet')||cond.toLowerCase().includes('nat') ? '🌧' : '☀️', lbl: 'COND', val: cond }] : []),
  ]

  return (
    <div className="flex items-center flex-wrap gap-x-5 gap-y-1 px-4 py-1.5 border-b border-white/5" style={{ background:'#0a0a0a' }}>
      {items.map(({ icon, lbl, val }) => (
        <div key={lbl} className="flex items-center gap-1">
          <span className="text-[10px]">{icon}</span>
          <span className="font-ui text-[9px] font-semibold uppercase tracking-wider text-gray-600">{lbl}</span>
          <span className="font-mono text-[10px] font-bold text-gray-300">{val}</span>
        </div>
      ))}
    </div>
  )
}

// ── Interfaces ────────────────────────────────────────────────────────────────

interface AlgemeenSessie {
  status?: string; sessie_naam?: string; circuit?: string
  circuit_slug?: string; event?: string; ronden_totaal?: number|string
  laatste_update?: string; weer?: Weer; race_klok?: string
  verstreken_seconden?: number
}

interface Props {
  sessionId:    string   // 'F1/2026/austria_gp'
  klasse:       string   // 'F1' | 'MotoGP' | 'WEC' | ...
  compact?:     boolean  // compacte modus zonder sectoren
}

// ── Hoofd component ───────────────────────────────────────────────────────────

export default function LiveTiming({ sessionId, klasse, compact = false }: Props) {
  const c = cfg(klasse)

  const [entries,    setEntries]    = useState<(TimingEntry & { posChange: number; interval?: string; klasse?: string; banden?: string; laps?: number })[]>([])
  const [sessie,     setSessie]     = useState<AlgemeenSessie | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [updated,    setUpdated]    = useState<Date | null>(null)
  const [tab,        setTab]        = useState<'timing'|'stints'>('timing')
  const [flash,      setFlash]      = useState<Set<string>>(new Set())

  const prevPos   = useRef<Record<string,number>>({})
  const prevBest  = useRef<Record<string,string>>({})

  // ── Algemeen_Sessie ophalen ────────────────────────────────────────────────
  const fetchSessie = useCallback(async () => {
    try {
      const r = await fetch(`${FIREBASE_RTDB}/${sessionId}/Algemeen_Sessie.json?t=${Date.now()}`)
      if (r.ok) setSessie(await r.json())
    } catch { /* stil */ }
  }, [sessionId])

  // ── Live_Timing ophalen ───────────────────────────────────────────────────
  const fetchTiming = useCallback(async () => {
    const data = await getLiveTiming(sessionId)
    const nieuweFlash = new Set<string>()

    const withMeta = data.map(e => {
      const prev   = prevPos.current[e.carNumber]
      const change = prev !== undefined ? prev - e.position : 0
      if (prevBest.current[e.carNumber] && prevBest.current[e.carNumber] !== e.bestLapTime)
        nieuweFlash.add(e.carNumber)
      return { ...e, posChange: change }
    })

    data.forEach(e => {
      prevPos.current[e.carNumber]  = e.position
      prevBest.current[e.carNumber] = e.bestLapTime
    })

    if (nieuweFlash.size) {
      setFlash(nieuweFlash)
      setTimeout(() => setFlash(new Set()), 900)
    }

    // Haal extra Firebase velden op die niet in TimingEntry zitten
    // (interval, banden als string, klasse voor WEC, laps)
    try {
      const r = await fetch(`${FIREBASE_RTDB}/${sessionId}/Live_Timing.json?t=${Date.now()}`)
      if (r.ok) {
        const raw = await r.json() as Record<string, any>
        const enriched = withMeta.map(e => {
          const key = `nr_${e.carNumber.replace('#','')}`
          const fb  = raw?.[key] ?? {}
          return {
            ...e,
            interval: fb.interval ?? e.gap,
            banden:   fb.banden ?? fb.sprint?.banden?.voor ?? fb.race?.banden?.voor ?? e.tyre,
            klasse:   fb.klasse,
            laps:     fb.huidige_ronde ?? 0,
          }
        })
        setEntries(enriched as any)
      } else {
        setEntries(withMeta as any)
      }
    } catch {
      setEntries(withMeta as any)
    }

    setUpdated(new Date())
    setLoading(false)
  }, [sessionId])

  // ── Polling ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId) return
    let cancelled = false
    const init = async () => { await fetchSessie(); if (!cancelled) await fetchTiming() }
    init()
    const iv = setInterval(() => { if (!cancelled) { fetchTiming(); fetchSessie() } }, POLL_MS)
    return () => { cancelled = true; clearInterval(iv) }
  }, [sessionId, fetchTiming, fetchSessie])

  // ── Berekende waarden ─────────────────────────────────────────────────────
  const isLive    = sessie?.status?.toLowerCase() === 'live'
  const leader    = entries[0]
  const sessieNm  = sessie?.sessie_naam ?? ''
  const gpNaam    = sessie?.event ?? sessionId.split('/').pop()?.replace(/_/g,' ') ?? ''
  const ronden    = sessie?.ronden_totaal
  const leaderLap = leader?.laps ?? 0

  // F1: banden als compound-string, MotoGP: uit sprint.banden.voor
  const getTyreBadge = (e: typeof entries[0]) => {
    const b = (e as any).banden
    if (!b || b === '-') return e.tyre
    return typeof b === 'object' ? b.voor ?? b.achter : b
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl overflow-hidden" style={{ background:'#111', border:'1px solid rgba(255,255,255,0.08)' }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3"
        style={{ background: c.bg, borderBottom:`1px solid ${c.k}22` }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-head font-black text-sm uppercase tracking-wider text-white truncate">
            {gpNaam}
          </span>
          {sessieNm && (
            <>
              <div className="w-px h-3 bg-white/15 flex-shrink-0" />
              <span className="font-ui text-xs font-bold uppercase text-gray-400 flex-shrink-0">{sessieNm}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* WEC race klok */}
          {sessie?.race_klok && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/30 border border-white/10">
              <span className="text-[9px]">⏱</span>
              <span className="font-mono text-xs font-bold text-white">{sessie.race_klok}</span>
            </div>
          )}
          {/* Ronde teller */}
          {ronden && leaderLap > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-black/30 border border-white/10">
              <span className="font-ui text-[9px] text-gray-500 uppercase">Lap</span>
              <span className="font-mono text-xs font-bold text-white">{leaderLap}</span>
              <span className="font-ui text-[9px] text-gray-500">/{ronden}</span>
            </div>
          )}
          {/* Live badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded"
            style={{
              background: isLive ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isLive ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.1)'}`,
            }}>
            {isLive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            <span className="font-ui text-[9px] font-bold uppercase tracking-wider"
              style={{ color: isLive ? '#ef4444' : '#555' }}>
              {isLive ? 'LIVE' : (sessie?.status ?? 'OFFLINE')}
            </span>
          </div>
          {updated && (
            <span className="font-mono text-[9px] text-gray-700 hidden sm:block">
              {updated.toLocaleTimeString('nl-NL',{hour:'2-digit',minute:'2-digit',second:'2-digit'})}
            </span>
          )}
        </div>
      </div>

      {/* ── Weer ── */}
      {sessie?.weer && <WeerBalk w={sessie.weer} />}

      {/* ── Tabs + best lap ── */}
      <div className="flex items-center justify-between px-4 py-2"
        style={{ background:'#0d0d0d', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex gap-1">
          {(['timing','stints'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded transition-all"
              style={tab===t
                ? { background:'rgba(255,255,255,0.12)', color:'#fff', border:'1px solid rgba(255,255,255,0.15)' }
                : { background:'transparent', color:'#555', border:'1px solid transparent' }}>
              {t === 'timing' ? 'Timing' : 'Stints'}
            </button>
          ))}
        </div>
        {leader?.bestLapTime && leader.bestLapTime !== '-' && (
          <div className="flex items-center gap-2">
            <span className="font-ui text-[9px] uppercase tracking-wider text-gray-600">Best</span>
            <span className="font-mono text-xs font-bold" style={{ color: c.k }}>{leader.bestLapTime}</span>
            <span className="font-ui text-[9px] text-gray-600">{leader.driverName.split(' ').pop()}</span>
          </div>
        )}
      </div>

      {/* ── Laden ── */}
      {loading && (
        <div className="flex items-center justify-center gap-3 py-14">
          <div className="w-4 h-4 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: c.k }} />
          <span className="font-ui text-sm text-gray-500">Live timing laden…</span>
        </div>
      )}

      {/* ── Geen data ── */}
      {!loading && entries.length === 0 && (
        <div className="py-14 text-center">
          <div className="text-3xl mb-3">📡</div>
          <p className="font-ui text-sm text-gray-500">Geen live data beschikbaar.</p>
          <p className="font-ui text-xs text-gray-600 mt-1">Start de Python formatter in het Command Center.</p>
        </div>
      )}

      {/* ── Timing tabel ── */}
      {!loading && entries.length > 0 && tab === 'timing' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#0d0d0d', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                {['POS','Driver', ...(compact ? [] : ['Laps','PIT','Tyre']),
                  'Best Lap','Gap', ...(compact ? [] : ['INT.','S1','S2','S3']),
                  'Last Lap'].map(h => (
                  <th key={h} className="px-3 py-2 font-ui text-[9px] font-semibold uppercase tracking-wider text-gray-600 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {entries.map((e, idx) => {
                const isFirst  = e.position === 1
                const isFlash  = flash.has(e.carNumber)
                const inPit    = e.status === 'pit'
                const rowBg    = isFlash ? `${c.k}18`
                               : isFirst  ? `${c.k}0c`
                               : idx % 2  ? 'rgba(255,255,255,0.015)' : 'transparent'
                const tyre     = getTyreBadge(e)

                return (
                  <tr key={e.carNumber}
                    style={{ background:rowBg, borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.3s' }}>

                    {/* POS */}
                    <td className="px-3 py-2.5 w-12">
                      <div className="flex items-center gap-1">
                        <span className="font-head font-black text-sm w-5 text-right"
                          style={{ color: e.position===1?'#facc15':e.position===2?'#d1d5db':e.position===3?'#b45309':'#555' }}>
                          {e.position===900||e.position===999?'NC':e.position}
                        </span>
                        <PosChange v={(e as any).posChange ?? 0} />
                      </div>
                    </td>

                    {/* Driver */}
                    <td className="px-2 py-2.5" style={{ minWidth: compact ? 110 : 150 }}>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <div className="w-0.5 h-4 rounded-full flex-shrink-0" style={{ background: c.k }} />
                        <span className="font-head text-xs font-bold uppercase" style={{ color: e.position<=3?'#fff':'#ccc' }}>
                          {/* Toon achternaam */}
                          {e.driverName.includes(' ')
                            ? e.driverName.split(' ').filter(Boolean).pop()?.toUpperCase()
                            : e.driverName.toUpperCase()}
                        </span>
                        <KlasseBadge klasse={(e as any).klasse} />
                        {(inPit || (e.status && e.status !== 'racing')) && (
                          <StatusBadge status={inPit ? 'pit' : e.status} />
                        )}
                      </div>
                      {!compact && e.teamName && (
                        <div className="font-ui text-[9px] text-gray-600 pl-2 leading-none mt-0.5 truncate max-w-[130px]">
                          {e.teamName}
                        </div>
                      )}
                    </td>

                    {!compact && (
                      <>
                        {/* Laps */}
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-xs text-gray-400">{(e as any).laps || '—'}</span>
                        </td>
                        {/* PIT count */}
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-xs text-gray-400">{e.pits > 0 ? e.pits : '—'}</span>
                        </td>
                        {/* Tyre */}
                        <td className="px-3 py-2.5"><TyreBadge tyre={tyre} /></td>
                      </>
                    )}

                    {/* Best Lap */}
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs font-bold"
                        style={{ color: isFirst ? '#c084fc' : e.bestLapTime!=='-'?'#ccc':'#444' }}>
                        {e.bestLapTime !== '-' ? e.bestLapTime : '—'}
                      </span>
                    </td>

                    {/* Gap */}
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs" style={{ color: isFirst ? c.k : '#777' }}>
                        {isFirst ? 'LEADER' : (e.gap ?? '—')}
                      </span>
                    </td>

                    {!compact && (
                      <>
                        {/* INT */}
                        <td className="px-3 py-2.5">
                          <span className="font-mono text-xs text-gray-600">
                            {(e as any).interval ?? '—'}
                          </span>
                        </td>
                        {/* Mini-sectoren */}
                        <td className="px-2 py-2.5"><Sector t={e.sector1} kleur="#facc15" /></td>
                        <td className="px-2 py-2.5"><Sector t={e.sector2} kleur="#22c55e" /></td>
                        <td className="px-2 py-2.5"><Sector t={e.sector3} kleur="#60a5fa" /></td>
                      </>
                    )}

                    {/* Last Lap */}
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs"
                        style={{ color: isFlash ? c.k : e.lastLapTime!=='-'?'#bbb':'#444', fontWeight: isFlash?700:400 }}>
                        {e.lastLapTime !== '-' ? e.lastLapTime : '—'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Stints tab ── */}
      {!loading && tab === 'stints' && (
        <div className="py-12 text-center">
          <div className="text-2xl mb-2">🛞</div>
          <p className="font-ui text-sm text-gray-500">Stint historie (binnenkort beschikbaar)</p>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-1.5"
        style={{ background:'#0a0a0a', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <span className="font-head font-black text-[9px] tracking-widest text-gray-600">
          GRID<span style={{ color: c.k }}>24</span>HQ · {klasse}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: isLive ? c.k : '#333' }} />
          <span className="font-ui text-[9px] text-gray-700">Polling elke {POLL_MS/1000}s</span>
        </div>
      </div>
    </div>
  )
}
