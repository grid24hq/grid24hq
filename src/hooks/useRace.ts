import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getEvents,
  getEvent,
  getEventsBySeries,
  getLiveEvents,
  getLiveTiming,
  getDriverStandings,
  getTeamStandings,
  getRaceResults,
} from '@/services/raceApi'
import type { SeriesId } from '@/types'

// ─── Query keys ───────────────────────────────────────────────────────────────
// Centralised so we can invalidate/refetch anywhere

export const raceKeys = {
  all:            ['races'] as const,
  events:         () => [...raceKeys.all, 'events'] as const,
  event:          (id: string) => [...raceKeys.events(), id] as const,
  bySeries:       (id: SeriesId) => [...raceKeys.events(), 'series', id] as const,
  live:           () => [...raceKeys.all, 'live'] as const,
  timing:         (sessionId: string) => [...raceKeys.all, 'timing', sessionId] as const,
  standings:      (series: SeriesId, type: 'drivers' | 'teams') => [...raceKeys.all, 'standings', series, type] as const,
  results:        (eventId: string) => [...raceKeys.all, 'results', eventId] as const,
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/** All events (upcoming + recent) */
export function useEvents() {
  return useQuery({
    queryKey: raceKeys.events(),
    queryFn:  getEvents,
    staleTime: 1000 * 60 * 5, // 5 min
  })
}

/** Single event */
export function useEvent(id: string) {
  return useQuery({
    queryKey: raceKeys.event(id),
    queryFn:  () => getEvent(id),
    enabled:  Boolean(id),
  })
}

/** Events for a specific series */
export function useSeriesEvents(series: SeriesId) {
  return useQuery({
    queryKey: raceKeys.bySeries(series),
    queryFn:  () => getEventsBySeries(series),
    staleTime: 1000 * 60 * 5,
  })
}

/** Currently live events — refetch every 30 seconds */
export function useLiveEvents() {
  return useQuery({
    queryKey:         raceKeys.live(),
    queryFn:          getLiveEvents,
    refetchInterval:  1000 * 30,
    staleTime:        0,
  })
}

/** Live timing for a session — refetch every 10 seconds */
export function useLiveTiming(sessionId: string) {
  return useQuery({
    queryKey:        raceKeys.timing(sessionId),
    queryFn:         () => getLiveTiming(sessionId),
    refetchInterval: 1000 * 10,
    staleTime:       0,
    enabled:         Boolean(sessionId),
  })
}

/** Driver standings */
export function useDriverStandings(series: SeriesId, season?: number) {
  return useQuery({
    queryKey: raceKeys.standings(series, 'drivers'),
    queryFn:  () => getDriverStandings(series, season),
    staleTime: 1000 * 60 * 15, // 15 min
  })
}

/** Team/constructor standings */
export function useTeamStandings(series: SeriesId, season?: number) {
  return useQuery({
    queryKey: raceKeys.standings(series, 'teams'),
    queryFn:  () => getTeamStandings(series, season),
    staleTime: 1000 * 60 * 15,
  })
}

/** Race results */
export function useRaceResults(eventId: string) {
  return useQuery({
    queryKey: raceKeys.results(eventId),
    queryFn:  () => getRaceResults(eventId),
    enabled:  Boolean(eventId),
    staleTime: 1000 * 60 * 60, // Results don't change — 1 hour
  })
}

/** Prefetch an event (call on hover for instant navigation) */
export function usePrefetchEvent() {
  const queryClient = useQueryClient()
  return (id: string) =>
    queryClient.prefetchQuery({
      queryKey: raceKeys.event(id),
      queryFn:  () => getEvent(id),
    })
}
