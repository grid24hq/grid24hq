// ─── Racing Series ────────────────────────────────────────────────────────────

export type SeriesId =
  | 'wec'
  | 'elms'
  | 'lemanscup'
  | 'motogp'
  | 'moto2'
  | 'moto3'
  | 'gt3'
  | 'imsa'
  | 'wsb'
  | 'ssp'
  | 'f1'

export interface Series {
  id: SeriesId
  name: string
  shortName: string
  color: string        // Tailwind class e.g. 'series-wec'
  hex: string          // Raw hex for inline styles
  category: 'auto' | 'moto'
}

// ─── Race & Event ─────────────────────────────────────────────────────────────

export type RaceStatus = 'upcoming' | 'live' | 'finished' | 'delayed' | 'cancelled'
export type SessionType = 'race' | 'qualifying' | 'practice' | 'sprint' | 'warmup'

export interface RaceEvent {
  id: string
  name: string
  series: SeriesId
  circuit: Circuit
  startDate: string    // ISO 8601
  endDate: string
  status: RaceStatus
  round: number
  totalRounds: number
  sessions: Session[]
}

export interface Session {
  id: string
  type: SessionType
  name: string
  startTime: string
  endTime: string
  status: RaceStatus
  laps?: number
  currentLap?: number
  timeElapsed?: string
  timeRemaining?: string
}

// ─── Live Timing ──────────────────────────────────────────────────────────────

export interface TimingEntry {
  position: number
  carNumber: string
  driverName: string
  teamName: string
  lastLapTime: string
  bestLapTime: string
  gap: string          // '+12.4s' | 'Leader' | '+1 Lap'
  gapToLeader: string
  sector1: string
  sector2: string
  sector3: string
  pits: number
  status: 'racing' | 'pit' | 'out' | 'slow'
  tyre?: string
}

// ─── Driver & Rider ───────────────────────────────────────────────────────────

export interface Driver {
  id: string
  firstName: string
  lastName: string
  number: string
  nationality: string  // ISO country code e.g. 'NL'
  flagEmoji: string
  photoUrl?: string
  team: Team
  series: SeriesId
  stats: DriverStats
  bio?: string
}

export interface DriverStats {
  points: number
  position: number
  wins: number
  podiums: number
  poles: number
  fastestLaps: number
  races: number
}

// ─── Team ────────────────────────────────────────────────────────────────────

export interface Team {
  id: string
  name: string
  shortName: string
  series: SeriesId
  car: string          // 'Toyota GR010 Hypercar' | 'Ducati Panigale V4 R'
  logoUrl?: string
  primaryColor: string
  drivers: string[]    // Driver IDs
  stats: TeamStats
}

export interface TeamStats {
  points: number
  position: number
  wins: number
  podiums: number
}

// ─── Circuit ─────────────────────────────────────────────────────────────────

export interface Circuit {
  id: string
  name: string
  shortName: string
  city: string
  country: string
  countryCode: string  // ISO e.g. 'NL'
  flagEmoji: string
  lengthKm: number
  turns: number
  lapRecord: LapRecord
  trackLayoutUrl?: string
  heroImageUrl?: string
  timezone: string
  established: number
  history?: string
  sectors: Sector[]
}

export interface LapRecord {
  time: string         // '1:44.701'
  driver: string
  year: number
  series: SeriesId
}

export interface Sector {
  id: 1 | 2 | 3
  name: string
  description: string
  lengthKm: number
}

// ─── News ────────────────────────────────────────────────────────────────────

export interface NewsArticle {
  id: string
  title: string
  excerpt: string
  imageUrl?: string
  series?: SeriesId
  publishedAt: string
  source: string
  url: string
  tags: string[]
}

// ─── User & Auth ──────────────────────────────────────────────────────────────

export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  language: 'nl' | 'en'
  favoriteSeries: SeriesId[]
  favoriteDrivers: string[]
  favoriteTeams: string[]
  favoriteCircuits: string[]
  theme: 'dark'        // Only dark for now — racing vibes
  emailNotifications: boolean
}

// ─── Calendar ────────────────────────────────────────────────────────────────

export interface CalendarEntry {
  id: string
  event: RaceEvent
  isInWatchlist: boolean
  reminder?: string    // ISO datetime
}

// ─── API Response wrappers ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}
