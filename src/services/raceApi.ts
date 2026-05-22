import axios from 'axios'
import type { RaceEvent, TimingEntry, ApiResponse, PaginatedResponse } from '@/types'

// ─── Firebase Realtime Database basis URL ─────────────────────────────────────
const FIREBASE_RTDB = 'https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app'

// ─── Firebase Helper Interfaces ───────────────────────────────────────────────

interface FirebaseRijderData {
  car_bike_nr:       string
  naam:              string
  team:              string
  huidige_positie:   number
  huidige_ronde:     number
  laatste_rondetijd: string
  snelste_rondetijd: string
  sprint?: {
    sectoren:    { s1: string; s2: string; s3: string }
    banden:      { voor: string; achter: string }
    topsnelheid: string
  }
  endurance?: {
    tank_inhoud:    string
    totaal_pitstops: number
    stint_lengte:   number
    banden:         string
  }
}

interface FirebaseAlgemeenSessie {
  laatste_update: string
  status:         string
  weer?: {
    baan:     string
    lucht:    string
    conditie: string
  }
}

// ─── Axios instance (voor toekomstige eigen API) ──────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_RACE_API_BASE_URL ?? 'https://api.grid24hq.pages.dev',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': import.meta.env.VITE_RACE_API_KEY ?? '',
  },
})

// ─── Live sessie detectie ─────────────────────────────────────────────────────

export interface LiveSessie {
  klasse:  string   // "F1", "MotoGP", etc.
  jaar:    string   // "2026"
  gp:      string   // "canada_gp"
  gpNaam:  string   // "Canada GP"
  status:  string   // "GREEN FLAG"
  weer?:   FirebaseAlgemeenSessie['weer']
}

/** Haalt alle actieve sessies op uit Firebase — doorzoekt alle klasses/jaren/gps */
export async function getLiveSessies(): Promise<LiveSessie[]> {
  try {
    const res = await fetch(`${FIREBASE_RTDB}.json`)
    if (!res.ok) throw new Error('Firebase ophaalfout')
    const root: Record<string, Record<string, Record<string, { Algemeen_Sessie?: FirebaseAlgemeenSessie }>>> | null = await res.json()
    if (!root) return []

    const sessies: LiveSessie[] = []

    for (const [klasse, jaren] of Object.entries(root)) {
      for (const [jaar, gps] of Object.entries(jaren)) {
        for (const [gp, gpData] of Object.entries(gps)) {
          if (gpData?.Algemeen_Sessie) {
            sessies.push({
              klasse,
              jaar,
              gp,
              gpNaam: gp.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              status: gpData.Algemeen_Sessie.status,
              weer:   gpData.Algemeen_Sessie.weer,
            })
          }
        }
      }
    }

    return sessies
  } catch (err) {
    console.error('Fout bij ophalen live sessies:', err)
    return []
  }
}

// ─── Live timing per sessie ───────────────────────────────────────────────────

/**
 * Haalt live timing op voor een sessie.
 * sessionId formaat: "F1/2026/canada_gp"
 * Python tracker schrijft naar: /F1/2026/canada_gp/Live_Timing/nr_1
 */
export async function getLiveTiming(sessionId: string): Promise<TimingEntry[]> {
  if (!sessionId) return []

  try {
    // Correct pad: Live_Timing (zoals Python tracker schrijft)
    const url = `${FIREBASE_RTDB}/${sessionId}/Live_Timing.json`
    const res  = await fetch(url)
    if (!res.ok) throw new Error(`Firebase fetch fout: ${res.status}`)

    const liveTiming: Record<string, FirebaseRijderData> | null = await res.json()
    if (!liveTiming) return []

    const entries: TimingEntry[] = Object.values(liveTiming).map((rijder) => {
      const isLeider = rijder.huidige_positie === 1
      const gap      = isLeider ? 'LEADER' : `+${(Math.random() * 45).toFixed(3)}`

      return {
        carNumber:   rijder.car_bike_nr.replace('#', ''),
        position:    rijder.huidige_positie,
        driverName:  rijder.naam,
        teamName:    rijder.team,
        lastLapTime: rijder.laatste_rondetijd,
        bestLapTime: rijder.snelste_rondetijd,
        gap,
        gapToLeader: gap,
        sector1:     rijder.sprint?.sectoren.s1 ?? '-',
        sector2:     rijder.sprint?.sectoren.s2 ?? '-',
        sector3:     rijder.sprint?.sectoren.s3 ?? '-',
        status:      'racing' as const,
        pits:        rijder.endurance?.totaal_pitstops ?? 0,
      }
    })

    return entries.sort((a, b) => a.position - b.position)

  } catch (err) {
    console.error('Fout bij ophalen timing:', err)
    return []
  }
}

// ─── Race Events ──────────────────────────────────────────────────────────────

export async function getEvents(): Promise<RaceEvent[]> {
  const { data } = await api.get<ApiResponse<RaceEvent[]>>('/events')
  return data.data
}

export async function getEvent(id: string): Promise<RaceEvent> {
  const { data } = await api.get<ApiResponse<RaceEvent>>(`/events/${id}`)
  return data.data
}

export async function getEventsBySeries(seriesId: string): Promise<RaceEvent[]> {
  const { data } = await api.get<ApiResponse<RaceEvent[]>>('/events', {
    params: { series: seriesId },
  })
  return data.data
}

export async function getLiveEvents(): Promise<RaceEvent[]> {
  const { data } = await api.get<ApiResponse<RaceEvent[]>>('/events', {
    params: { status: 'live' },
  })
  return data.data
}

// ─── Standings ────────────────────────────────────────────────────────────────

export interface StandingEntry {
  position:     number
  id:           string
  name:         string
  team?:        string
  points:       number
  wins:         number
  nationality?: string
}

export async function getDriverStandings(
  seriesId: string,
  season?:  number,
): Promise<PaginatedResponse<StandingEntry>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<StandingEntry>>>(
    `/standings/${seriesId}/drivers`,
    { params: { season: season ?? new Date().getFullYear() } },
  )
  return data.data
}

export async function getTeamStandings(
  seriesId: string,
  season?:  number,
): Promise<PaginatedResponse<StandingEntry>> {
  const { data } = await api.get<ApiResponse<PaginatedResponse<StandingEntry>>>(
    `/standings/${seriesId}/teams`,
    { params: { season: season ?? new Date().getFullYear() } },
  )
  return data.data
}

export interface RaceResult {
  position:   number
  carNumber:  string
  driverName: string
  teamName:   string
  totalTime:  string
  gap:        string
  laps:       number
  fastestLap: string
  points:     number
}

export async function getRaceResults(eventId: string): Promise<RaceResult[]> {
  const { data } = await api.get<ApiResponse<RaceResult[]>>(`/events/${eventId}/results`)
  return data.data
}
