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
  circuit?:       string
  circuit_slug?:  string
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
  klasse:        string
  jaar:          string
  gp:            string
  gpNaam:        string
  status:        string
  circuit?:      string
  circuit_slug?: string
  weer?:         FirebaseAlgemeenSessie['weer']
}

// Bekende race series — Kalender en andere keys worden overgeslagen
const RACE_SERIES = ['F1', 'MotoGP', 'Moto2', 'Moto3', 'WEC', 'ELMS', 'LeMansCup', 'IMSA', 'WorldSBK']

// ─── Sessie Status (schakelaar vanuit Command Center) ─────────────────────────

/**
 * Haalt de /Sessie_Status node op uit Firebase.
 * De Command Center schrijft hier naar toe bij start/stop van een sessie.
 * Voorbeeld: { motogp_live: true, f1_live: false, wec_live: false }
 */
export async function getSessieStatus(): Promise<Record<string, boolean>> {
  try {
    // Haalt direct de actuele /Sessie_Status.json op uit Firebase
    const res = await fetch(`${FIREBASE_RTDB}/Sessie_Status.json?t=${Date.now()}`)
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
    // Vlijmscherp pad dat exact matcht met de output van update_standings.py
    const res = await fetch(`${FIREBASE_RTDB}/${klasse}/${jaar}/championship_standings.json`)
    if (!res.ok) return []
    const data = await res.json()
    if (!data || !data.riders) return []
    
    // Converteert Firebase objecten of arrays direct naar een schone lijst
    const lijst: ChampionshipRijder[] = Array.isArray(data.riders)
      ? data.riders
      : Object.values(data.riders)
      
    return lijst.sort((a, b) => a.positie - b.positie)
  } catch {
    return []
  }
}

/** Haalt alleen ACTIEVE sessies op — filtert op Sessie_Status === true */
export async function getLiveSessies(): Promise<LiveSessie[]> {
  try {
    // Stap 1: Haal Sessie_Status op — alleen sessies met true zijn live
    const statusRes = await fetch(`${FIREBASE_RTDB}/Sessie_Status.json?t=${Date.now()}`)
    if (!statusRes.ok) return []
    const statusData: Record<string, boolean> | null = await statusRes.json()
    if (!statusData) return []

    // Alleen de gp-sleutels die écht op true staan
    const actieveGPs = Object.entries(statusData)
      .filter(([, v]) => v === true)
      .map(([k]) => k)

    if (actieveGPs.length === 0) return []

    // Stap 2: Zoek per actieve GP de bijbehorende data op in Firebase
    const sessies: LiveSessie[] = []

    for (const klasse of RACE_SERIES) {
      try {
        const res = await fetch(`${FIREBASE_RTDB}/${klasse}.json?t=${Date.now()}`)
        if (!res.ok) continue
        const jaren: Record<string, Record<string, { Algemeen_Sessie?: FirebaseAlgemeenSessie }>> | null = await res.json()
        if (!jaren) continue

        for (const [jaar, gps] of Object.entries(jaren)) {
          for (const [gp, gpData] of Object.entries(gps)) {
            // Alleen toevoegen als Sessie_Status[gp] === true
            if (actieveGPs.includes(gp) && gpData?.Algemeen_Sessie) {
              sessies.push({
                klasse,
                jaar,
                gp,
                gpNaam:       gp.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                status:       gpData.Algemeen_Sessie.status,
                circuit:      gpData.Algemeen_Sessie.circuit,
                circuit_slug: gpData.Algemeen_Sessie.circuit_slug,
                weer:         gpData.Algemeen_Sessie.weer,
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
    // Cache-busting timestamp om te voorkomen dat browser/CDN stale data toont
    const url = `${FIREBASE_RTDB}/${sessionId}/Live_Timing.json?t=${Date.now()}`
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

    const entries: TimingEntry[] = alleRijders.map((rijder) => {
      const isLeider = rijder.huidige_positie === 1

      // Gebruik gap/interval direct uit Firebase (formatter berekent dit al correct)
      // Fallback naar rondetijd-berekening alleen als Firebase-gap ontbreekt
      let gap = (rijder as any).gap ?? 'LEADER'
      if (!gap || gap === '-0' || gap === '') {
        gap = isLeider ? 'LEADER' : '-'
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
        tyre:        rijder.sprint?.banden ? `${rijder.sprint.banden.voor}/${rijder.sprint.banden.achter}` : undefined,
        status,
        pits:        (rijder as any).pit_count ?? rijder.endurance?.totaal_pitstops ?? 0,
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


// ─── Algemeen_Sessie ophalen ──────────────────────────────────────────────────
// Wordt gebruikt door LiveTiming component om sessie-info, weer en status te laden
// Pad: /{serie}/{jaar}/{gp}/Algemeen_Sessie

export interface AlgemeenSessie {
  status?:          string          // 'Live' | 'Finished' | 'Red Flag' | 'SC'
  sessie_naam?:     string          // 'Grand Prix' | 'Kwalificatie' | 'Sprint Race'
  circuit?:         string          // 'Red Bull Ring, Austria'
  circuit_slug?:    string          // 'at' (voor kaartweergave)
  event?:           string          // 'F1 Austria GP'
  ronden_totaal?:   number | string // 71
  race_klok?:       string          // '23:03:16' (WEC)
  verstreken_seconden?: number      // WEC
  laatste_update?:  string          // ISO timestamp
  weer?: {
    // Nieuwe velden (f1_formatter na update):
    lucht_temp?:        number | string
    baan_temp?:         number | string
    luchtvochtigheid?:  number | string
    wind_speed?:        number | string
    droog_nat?:         string       // 'Dry' | 'Wet'
    // Legacy velden (MotoGP/WEC formatters):
    lucht?:             string       // '33.3°C'
    baan?:              string       // '52.6°C'
    conditie?:          string       // 'Clear' | 'Droog'
  }
}

/**
 * Haalt Algemeen_Sessie op voor een sessie.
 * sessionId formaat: "F1/2026/austria_gp"
 * Geeft null terug als het pad niet bestaat of Firebase onbereikbaar is.
 */
export async function getAlgemeenSessie(sessionId: string): Promise<AlgemeenSessie | null> {
  if (!sessionId) return null
  try {
    const res = await fetch(`${FIREBASE_RTDB}/${sessionId}/Algemeen_Sessie.json?t=${Date.now()}`)
    if (!res.ok) return null
    return await res.json() as AlgemeenSessie
  } catch {
    return null
  }
}
