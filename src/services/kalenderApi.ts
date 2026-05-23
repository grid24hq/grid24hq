// ─── Kalender data uit Firebase Realtime Database ────────────────────────────

const FIREBASE_RTDB = 'https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app'

export interface KalenderSessies {
  [key: string]: { datum: string; tijd_cet: string }
}

export interface KalenderRace {
  id:                    string
  serie:                 string   // "F1", "WEC", etc.
  naam:                  string
  baan:                  string
  datum:                 string   // "2026-06-15"
  tijd_cet:              string   // "20:00"
  land:                  string
  stad:                  string
  track_lengte_km:       string
  snelste_ronde_tijd:    string
  snelste_ronde_rijder:  string
  snelste_ronde_team:    string
  snelste_ronde_jaar:    number
  ronden?:               number
  duur_uren?:            number
  sessies:               KalenderSessies
}

export interface KalenderMaand {
  maand:  number   // 1-12
  naam:   string   // "Januari"
  races:  KalenderRace[]
}

const MAANDEN = [
  'Januari','Februari','Maart','April','Mei','Juni',
  'Juli','Augustus','September','Oktober','November','December'
]

const SERIE_VOLGORDE = ['F1','WEC','MotoGP','GT3','IMSA','WorldSBK']

export async function getKalender(): Promise<KalenderMaand[]> {
  try {
    const res = await fetch(`${FIREBASE_RTDB}/Kalender.json`)
    if (!res.ok) throw new Error('Firebase fout')
    const data: Record<string, Record<string, Record<string, any>>> | null = await res.json()
    if (!data) return []

    const alleRaces: KalenderRace[] = []

    for (const serie of SERIE_VOLGORDE) {
      const jaren = data[serie]
      if (!jaren) continue
      for (const [, races] of Object.entries(jaren)) {
        for (const [raceId, race] of Object.entries(races as Record<string, any>)) {
          alleRaces.push({
            id:                   raceId,
            serie,
            naam:                 race.naam,
            baan:                 race.baan,
            datum:                race.datum,
            tijd_cet:             race.tijd_cet,
            land:                 race.land,
            stad:                 race.stad,
            track_lengte_km:      race.track_lengte_km,
            snelste_ronde_tijd:   race.snelste_ronde_tijd,
            snelste_ronde_rijder: race.snelste_ronde_rijder,
            snelste_ronde_team:   race.snelste_ronde_team,
            snelste_ronde_jaar:   race.snelste_ronde_jaar,
            ronden:               race.ronden,
            duur_uren:            race.duur_uren,
            sessies:              race.sessies ?? {},
          })
        }
      }
    }

    // Sorteer op datum
    alleRaces.sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())

    // Groepeer per maand
    const maandMap = new Map<number, KalenderRace[]>()
    for (const race of alleRaces) {
      const maandNr = new Date(race.datum).getMonth() + 1
      if (!maandMap.has(maandNr)) maandMap.set(maandNr, [])
      maandMap.get(maandNr)!.push(race)
    }

    return Array.from(maandMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([maand, races]) => ({ maand, naam: MAANDEN[maand - 1], races }))

  } catch (err) {
    console.error('Kalender fout:', err)
    return []
  }
}

export function getDagenTot(datum: string): number {
  const nu    = new Date()
  const doel  = new Date(datum)
  nu.setHours(0,0,0,0)
  doel.setHours(0,0,0,0)
  return Math.ceil((doel.getTime() - nu.getTime()) / (1000 * 60 * 60 * 24))
}

export function getRaceStatus(datum: string): 'upcoming' | 'today' | 'finished' {
  const dagen = getDagenTot(datum)
  if (dagen > 0)  return 'upcoming'
  if (dagen === 0) return 'today'
  return 'finished'
}
