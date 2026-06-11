import { clsx, type ClassValue } from 'clsx'
import type { SeriesId } from '@/types'

// ─── Class merging ────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

// ─── Series helpers ───────────────────────────────────────────────────────────

export const SERIES_CONFIG: Record<SeriesId, { name: string; shortName: string; hex: string; label: string }> = {
  f1:         { name: 'Formula 1 World Championship',       shortName: 'F1',        hex: '#e10600', label: 'F1' },
  wec:        { name: 'FIA World Endurance Championship',   shortName: 'WEC',       hex: '#3b82f6', label: 'WEC' },
  elms:       { name: 'European Le Mans Series',            shortName: 'ELMS',      hex: '#06b6d4', label: 'ELMS' },
  lemanscup:  { name: 'Michelin Le Mans Cup',               shortName: 'LM Cup',    hex: '#f59e0b', label: 'LM Cup' },
  motogp:     { name: 'MotoGP World Championship',          shortName: 'MotoGP',    hex: '#f97316', label: 'MotoGP' },
  moto2:      { name: 'Moto2 World Championship',           shortName: 'Moto2',     hex: '#eab308', label: 'Moto2' },
  moto3:      { name: 'Moto3 World Championship',           shortName: 'Moto3',     hex: '#14b8a6', label: 'Moto3' },
  gt3:        { name: 'GT3 / Fanatec GT World Challenge',   shortName: 'GT3',       hex: '#22c55e', label: 'GT3' },
  imsa:       { name: 'IMSA WeatherTech SportsCar',         shortName: 'IMSA',      hex: '#a855f7', label: 'IMSA' },
  wsb:        { name: 'WorldSBK Championship',              shortName: 'WSBK',      hex: '#ec4899', label: 'WorldSBK' },
  ssp:        { name: 'WorldSSP Championship',              shortName: 'SSP',       hex: '#0ea5e9', label: 'WorldSSP' },
}

export function getSeriesColor(series: SeriesId): string {
  return SERIES_CONFIG[series]?.hex ?? '#888'
}

export function getSeriesName(series: SeriesId): string {
  return SERIES_CONFIG[series]?.name ?? series.toUpperCase()
}

// ─── Time & date helpers ──────────────────────────────────────────────────────

export function formatLapTime(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis  = ms % 1000
  return `${minutes}:${String(seconds).padStart(2, '0')}.${String(millis).padStart(3, '0')}`
}

export function formatGap(ms: number): string {
  if (ms === 0) return 'Leader'
  if (ms >= 60000) {
    const laps = Math.floor(ms / 90000)
    return `+${laps} Lap${laps > 1 ? 's' : ''}`
  }
  return `+${(ms / 1000).toFixed(3)}s`
}

export function daysUntil(dateStr: string): number {
  const now   = new Date()
  const target = new Date(dateStr)
  const diff  = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function formatRaceDate(dateStr: string, locale: string = 'nl-NL'): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

// ─── Country / flag helpers ───────────────────────────────────────────────────

export function countryToFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    )
}

// ─── Number helpers ───────────────────────────────────────────────────────────

export function formatPoints(pts: number): string {
  return pts.toLocaleString('nl-NL')
}
