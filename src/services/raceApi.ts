import axios from 'axios'
import type { RaceEvent, TimingEntry, ApiResponse, PaginatedResponse } from '@/types'

// ─── Axios instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_RACE_API_BASE_URL ?? 'https://api.grid24hq.pages.dev',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_RACE_API_KEY ?? '',
  },
})

// ─── Race Events ──────────────────────────────────────────────────────────────

/** Get all upcoming + recent race events */
export async function getEvents(): Promise<RaceEvent[]> {
  const { data } = await api.get<ApiResponse<RaceEvent[]>>('/events')
  return data.data
}

/** Get a single event by ID */
export async function getEvent(id: string): Promise<RaceEvent> {
  const { data } = await api.get<ApiResponse<RaceEvent>>(`/events/${id}`)
  return data.data
}

/** Get events filtered by series (e.g. 'wec', 'motogp') */
export async function getEventsBySeries(seriesId: string): Promise<RaceEvent[]> {
  const { data } = await api.get<ApiResponse<RaceEvent[]>>('/events', {
    params: { series: seriesId },
  })
  return data.data
}

/** Get live events only */
export async function getLiveEvents(): Promise<RaceEvent[]> {
  const { data } = await api.get<ApiResponse<RaceEvent[]>>('/events', {
    params: { status: 'live' },
  })
  return data.data
}

// ─── Live Timing ──────────────────────────────────────────────────────────────

/** Get live timing for a session */
export async function getLiveTiming(sessionId: string): Promise<TimingEntry[]> {
  const { data } = await api.get<ApiResponse<TimingEntry[]>>(
    `/sessions/${sessionId}/timing`,
  )
  return data.data
}

// ─── Standings ────────────────────────────────────────────────────────────────

export interface StandingEntry {
  position: number
  id: string
  name: string
  team?: string
  points: number
  wins: number
  nationality?: string
}

/** Get driver/rider standings for a series */
export async function getDriverStandings(
  seriesId: string,
  season?: number,
): Promise<PaginatedResponse<StandingEntry>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<StandingEntry>>>(
    `/standings/${seriesId}/drivers`,
    { params: { season: season ?? new Date().getFullYear() } },
  )
  return data.data
}

/** Get constructor/team standings for a series */
export async function getTeamStandings(
  seriesId: string,
  season?: number,
): Promise<PaginatedResponse<StandingEntry>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<StandingEntry>>>(
    `/standings/${seriesId}/teams`,
    { params: { season: season ?? new Date().getFullYear() } },
  )
  return data.data
}

// ─── Results ──────────────────────────────────────────────────────────────────

export interface RaceResult {
  position: number
  carNumber: string
  driverName: string
  teamName: string
  totalTime: string
  gap: string
  laps: number
  fastestLap: string
  points: number
}

export async function getRaceResults(eventId: string): Promise<RaceResult[]> {
  const { data } = await api.get<ApiResponse<RaceResult[]>>(
    `/events/${eventId}/results`,
  )
  return data.data
}
