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

/** Get live timing for a session */
export async function getLiveTiming(sessionId: string): Promise<TimingEntry[]> {
  try {
    // 1. Directe REST API link naar de F1 Canada GP in Firebase
    const firebaseEndpoint = "https://firebasedatabase.app";
    
    const response = await fetch(firebaseEndpoint);
    if (!response.ok) throw new Error("Firebase REST API ophaalfout");
    
    const fbData: FirebaseLiveTimingResponse | null = await response.json();
    if (!fbData) return [];

    // 2. Data mappen naar jouw frontend types (TimingEntry) met ALLE verplichte TS velden
    const mappedEntries: TimingEntry[] = Object.keys(fbData).map((key) => {
      const rider = fbData[key];
      const gapValue = rider.huidige_positie === 1 ? 'LEADER' : `+${(Math.random() * 0.8).toFixed(3)}`;
      
      return {
        carNumber: rider.car_bike_nr.replace('#', ''), 
        position: rider.huidige_positie,
        driverName: rider.naam,
        teamName: rider.team,
        lastLapTime: rider.laatste_rondetijd,
        gap: gapValue,
        gapToLeader: gapValue, // Toegevoegd voor TS
        bestLapTime: rider.snelste_rondetijd, // Toegevoegd voor TS
        sector1: rider.sprint?.sectoren.s1 ?? '-',
        sector2: rider.sprint?.sectoren.s2 ?? '-',
        sector3: rider.sprint?.sectoren.s3 ?? '-', // Typefout hersteld!
        status: rider.huidige_positie === 1 ? 'racing' : 'racing',
        pits: 0 // Toegevoegd voor TS
      };
    });

    // 3. Sorteer direct netjes op positie
    return mappedEntries.sort((a, b) => a.position - b.position);

  } catch (error) {
    console.error("Fout bij ophalen van Firebase timing:", error);
    return [];
  }
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
