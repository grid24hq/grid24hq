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

// Bekende race series — Kalender en andere keys worden overgeslagen
const RACE_SERIES = ['F1', 'MotoGP', 'WEC', 'GT3', 'IMSA', 'WorldSBK']

// ─── Sessie Status (schakelaar vanuit Command Center) ─────────────────────────

/**
 * Haalt de /Sessie_Status node op uit Firebase.
 * De Command Center schrijft hier naar toe bij start/stop van een sessie.
 * Voorbeeld: { motogp_live: true, f1_live: false, wec_live: false }
 */
export async function getSessieStatus(): Promise<Record<string, boolean>> {
  try {
    const res = await fetch(`${FIREBASE_RTDB}/Sessie_Status.json`)
    if (!res.ok) return {}
    const data = await res.json()
    return data ?? {}
  } catch {
    return {}
  }
}

// ─── Championship Standings (uit Firebase, gepusht via update_standings.py) ───

export interface ChampionshipRijder {
  positie: number
  nummer:  string
  naam:    string
  team:    string
  punten:  number
}

/**
 * Haalt kampioenschapsstand op voor een serie.
 * Pad: /{serie}/{jaar}/championship_standings/riders
 * Voorbeeld: /MotoGP/2026/championship_standings/riders
 */
export async function getChampionshipStandings(
  klasse: string,
  jaar = '2026',
): Promise<ChampionshipRijder[]> {
  try {
    const res = await fetch(`${FIREBASE_RTDB}/${klasse}/${jaar}/championship_standings/riders.json`)
    if (!res.ok) return []
    const data = await res.json()
    if (!data) return []
    // Data kan een array of een object zijn
    const lijst: ChampionshipRijder[] = Array.isArray(data)
      ? data
      : Object.values(data)
    return lijst.sort((a, b) => a.positie - b.positie)
  } catch {
    return []
  }
}

/** Haalt alle actieve sessies op — doorzoekt alleen bekende race series */
export async function getLiveSessies(): Promise<LiveSessie[]> {
  try {
    const sessies: LiveSessie[] = []

    for (const klasse of RACE_SERIES) {
      try {
        const res = await fetch(`${FIREBASE_RTDB}/${klasse}.json`)
        if (!res.ok) continue
        const jaren: Record<string, Record<string, { Algemeen_Sessie?: FirebaseAlgemeenSessie }>> | null = await res.json()
        if (!jaren) continue

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
      } catch {
        continue
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

    // Helper: rondetijd "1:23.456" -> milliseconden
    function tijdNaarMs(tijd: string): number | null {
      if (!tijd || tijd === '-' || tijd === '--:--.---') return null
      const match = tijd.match(/^(\d+):(\d+\.\d+)$/)
      if (!match) return null
      return parseInt(match[1]) * 60_000 + parseFloat(match[2]) * 1000
    }

    // Sorteer op positie voor gap-berekening
    const alleRijders = Object.values(liveTiming).sort(
      (a, b) => a.huidige_positie - b.huidige_positie
    )

    // Leider referentietijd
    const leider      = alleRijders.find(r => r.huidige_positie === 1)
    const leiderTijdMs = leider
      ? (tijdNaarMs(leider.snelste_rondetijd) ?? tijdNaarMs(leider.laatste_rondetijd))
      : null

    const entries: TimingEntry[] = alleRijders.map((rijder) => {
      const isLeider = rijder.huidige_positie === 1

      let gap = 'LEADER'
      if (!isLeider) {
        const rijderTijdMs =
          tijdNaarMs(rijder.snelste_rondetijd) ?? tijdNaarMs(rijder.laatste_rondetijd)
        if (rijderTijdMs !== null && leiderTijdMs !== null) {
          const diffMs = rijderTijdMs - leiderTijdMs
          gap = diffMs >= 0 ? `+${(diffMs / 1000).toFixed(3)}` : '-'
        } else {
          gap = '-'
        }
      }

      // Status bepalen op basis van optioneel status-veld
      let status: TimingEntry['status'] = 'racing'
      const s = ((rijder as any).status ?? '').toLowerCase()
      if (s.includes('pit'))                         status = 'pit'
      if (s.includes('out') || s.includes('dnf'))   status = 'out'
      if (s.includes('slow'))                        status = 'slow'

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
        status,
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
