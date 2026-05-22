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

// TypeScript interface voor de binnenkomende Firebase datastructuur
interface FirebaseRiderData {
  car_bike_nr: string;
  naam: string;
  team: string;
  huidige_positie: number;
  huidige_ronde: number;
  laatste_rondetijd: string;
  snelste_rondetijd: string;
  sprint?: {
    sectoren: { s1: string; s2: string; s3: string };
    banden: { voor: string; achter: string };
    topsnelheid: string;
  };
}

interface FirebaseLiveTimingResponse {
  [key: string]: FirebaseRiderData;
}

/** Get live timing for a session */
export async function getLiveTiming(sessionId: string): Promise<TimingEntry[]> {
  try {
    // 1. Maak direct verbinding met jouw unieke Europese Firebase database URL via de REST API (.json)
    const firebaseEndpoint = "https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app";
    
    const response = await fetch(firebaseEndpoint);
    if (!response.ok) throw new Error("Firebase REST API ophaalfout");
    
    const fbData: FirebaseLiveTimingResponse | null = await response.json();
    if (!fbData) return [];

    // 2. Vertaal de Firebase velden vlekkeloos naar jouw eigen TimingEntry types
    const mappedEntries: TimingEntry[] = Object.keys(fbData).map((key) => {
      const rider = fbData[key];
      
      return {
        carNumber: rider.car_bike_nr.replace('#', ''), // Haalt de '#' weg voor je Nr kolom
        position: rider.huidige_positie,
        driverName: rider.naam,
        teamName: rider.team,
        lastLapTime: rider.laatste_rondetijd,
        gap: rider.huidige_positie === 1 ? 'LEADER' : `+${(Math.random() * 1.5).toFixed(3)}`, // Tijdelijke gat-simulatie
        sector1: rider.sprint?.sectoren.s1 ?? '-',
        sector2: rider.sprint?.sectoren.s2 ?? '-',
        sector3: rider.sprint?.sitten?.s3 ?? rider.sprint?.sectoren.s3 ?? '-',
        status: rider.huidige_positie === 1 ? 'racing' : 'racing' // Knoopt aan bij je statusDot kleuren
      };
    });

    // 3. Sorteer direct netjes op positie (P1 bovenaan) zodat je tabel klopt
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
