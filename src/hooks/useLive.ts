import { useState, useEffect } from 'react'
import { useLiveEvents, useLiveTiming } from './useRace'
import type { RaceEvent, TimingEntry } from '@/types'

// ─── Active live session state ────────────────────────────────────────────────

interface LiveState {
  liveEvents:      RaceEvent[]
  hasLive:         boolean
  isLoading:       boolean
  activeSessionId: string | null
  setActiveSession:(id: string) => void
}

export function useLive(): LiveState {
  const { data: events, isLoading } = useLiveEvents()
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  const liveEvents = events ?? []

  // Auto-select the first live session if nothing is selected
  useEffect(() => {
    if (!activeSessionId && liveEvents.length > 0) {
      const firstEvent   = liveEvents[0]
      const liveSession  = firstEvent.sessions.find((s) => s.status === 'live')
      if (liveSession) setActiveSessionId(liveSession.id)
    }
  }, [liveEvents, activeSessionId])

  return {
    liveEvents,
    hasLive:         liveEvents.length > 0,
    isLoading,
    activeSessionId,
    setActiveSession: setActiveSessionId,
  }
}

// ─── Live timing for a single session ────────────────────────────────────────

interface LiveTimingState {
  entries:    TimingEntry[]
  isLoading:  boolean
  lastUpdate: Date | null
  leader:     TimingEntry | null
}

export function useSessionTiming(sessionId: string | null): LiveTimingState {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const { data, isLoading, dataUpdatedAt } = useLiveTiming(sessionId ?? '')

  useEffect(() => {
    if (dataUpdatedAt) setLastUpdate(new Date(dataUpdatedAt))
  }, [dataUpdatedAt])

  const entries = data ?? []
  const leader  = entries.find((e) => e.position === 1) ?? null

  return { entries, isLoading, lastUpdate, leader }
}

// ─── Countdown to next session ────────────────────────────────────────────────

export function useCountdown(targetDate: string | null): string {
  const [display, setDisplay] = useState('')

  useEffect(() => {
    if (!targetDate) return

    function update() {
      const diff = new Date(targetDate!).getTime() - Date.now()
      if (diff <= 0) { setDisplay('Nu bezig!'); return }

      const days    = Math.floor(diff / 86_400_000)
      const hours   = Math.floor((diff % 86_400_000) / 3_600_000)
      const minutes = Math.floor((diff % 3_600_000) / 60_000)
      const seconds = Math.floor((diff % 60_000) / 1_000)

      if (days > 0)  setDisplay(`${days}d ${hours}u ${minutes}m`)
      else           setDisplay(`${hours}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`)
    }

    update()
    const interval = setInterval(update, 1_000)
    return () => clearInterval(interval)
  }, [targetDate])

  return display
}
