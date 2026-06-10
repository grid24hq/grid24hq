import { useState, useEffect } from 'react'
import SeriesBadge from '@/components/SeriesBadge/SeriesBadge'
import { getKalender, getDagenTot, getRaceStatus, type KalenderRace, type KalenderMaand } from '@/services/kalenderApi'
import type { SeriesId } from '@/types'

// ─── Serie → SeriesId mapping ─────────────────────────────────────────────────
const serieMap: Record<string, SeriesId> = {
  WEC: 'wec', MotoGP: 'motogp', GT3: 'gt3', IMSA: 'imsa', WorldSBK: 'wsb',
  ELMS: 'elms', MLMC: 'lemanscup',
}

const serieKleur: Record<string, string> = {
  F1: '#e10600', WEC: '#3b82f6', MotoGP: '#f97316',
  GT3: '#22c55e', IMSA: '#a855f7', WorldSBK: '#ec4899',
  ELMS: '#f97316', MLMC: '#f97316',
}

const sessieLabels: Record<string, string> = {
  fp1: 'VT1', fp2: 'VT2', fp3: 'VT3',
  kwalificatie: 'Kwalificatie', race: 'Race',
  vrije_training: 'Vrije Training',
  vrije_training_1: 'VT1', vrije_training_2: 'VT2',
  race1: 'Race 1', race2: 'Race 2', superpole_race: 'Superpole Race',
  fp: 'Vrije Training',
}

// ─── Circuit SVG pad resolver ─────────────────────────────────────────────────
// Bestandsnamen in public/circuits/ volgen het patroon: {serie}_{id}.svg
// Voor ELMS en MLMC mappen we race-id → exacte bestandsnaam
const ELMS_SVG: Record<string, string> = {
  barcelona_4h:      'Barcelona_elms',
  le_castellet_4h:   'Paul_Ricard_elms',
  imola_4h:          'Imola_elms',
  spa_4h:            'Spa_elms',           // gebruik fallback als dit ontbreekt
  silverstone_4h:    'Silverstone_elms',
  portimao_4h:       'Algarve_elms',
}

const MLMC_SVG: Record<string, string> = {
  barcelona:         'Barcelona_mlmc',
  le_castellet:      'Paul_Ricard_mlms',   // let op: mlms (jouw bestandsnaam)
  road_to_le_mans:   'la_Sarthe_mlmc',
  imola:             'Imola_mlmc',
  spa:               'Spa_Francorchamps_mlmc',
  silverstone:       'Silverstone_mlmc',
  portimao:          'Algarve_mlmc',
}

function getCircuitSvgPath(serie: string, id: string): string {
  if (serie === 'ELMS') {
    const naam = ELMS_SVG[id]
    return naam ? `/circuits/${naam}.svg` : `/circuits/elms_${id}.svg`
  }
  if (serie === 'MLMC') {
    const naam = MLMC_SVG[id]
    return naam ? `/circuits/${naam}.svg` : `/circuits/mlmc_${id}.svg`
  }
  return `/circuits/${serie.toLowerCase()}_${id}.svg`
}

// ─── ELMS / MLMC klassen pills ────────────────────────────────────────────────
const ELMS_KLASSEN = ['LMP2', 'LMP2 Pro/Am', 'LMP3', 'LMGT3']
const MLMC_KLASSEN = ['LMP3', 'LMP3 Pro/Am', 'GT3']

const KLASSE_STIJL: Record<string, string> = {
  'LMP2':         'bg-blue-900/40 text-blue-300 border-blue-700/40',
  'LMP2 Pro/Am':  'bg-blue-900/30 text-blue-400 border-blue-700/30',
  'LMP3':         'bg-orange-900/40 text-orange-300 border-orange-700/40',
  'LMP3 Pro/Am':  'bg-orange-900/30 text-orange-400 border-orange-700/30',
  'LMGT3':        'bg-green-900/40 text-green-300 border-green-700/40',
  'GT3':          'bg-green-900/40 text-green-300 border-green-700/40',
}


function RaceModal({ race, onClose }: { race: KalenderRace; onClose: () => void }) {
  const kleur   = serieKleur[race.serie] ?? '#f97316'
  const serieId = serieMap[race.serie]
  const dagen   = getDagenTot(race.datum)
  const status  = getRaceStatus(race.datum)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}
    >
      <div
        className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `3px solid ${kleur}` }}
      >
        {/* Header */}
        <div className="p-6 border-b border-brand-border">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {serieId
                  ? <SeriesBadge series={serieId} size="md" />
                  : <span className="badge" style={{ color: kleur, borderColor: `${kleur}40`, backgroundColor: `${kleur}20` }}>{race.serie}</span>
                }
                {status === 'today' && (
                  <span className="flex items-center gap-1 font-ui text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse-dot" /> Vandaag
                  </span>
                )}
                {status === 'finished' && (
                  <span className="font-ui text-[10px] font-bold uppercase tracking-wider text-brand-muted">Afgelopen</span>
                )}
              </div>
              <h2 className="font-head font-black text-3xl uppercase tracking-wide">{race.naam}</h2>
              <p className="font-ui text-sm text-brand-muted mt-1">{race.baan} · {race.stad}, {race.land}</p>
            </div>
            <button onClick={onClose} className="text-brand-muted hover:text-white transition-colors text-xl font-bold flex-shrink-0">✕</button>
          </div>

          {/* Countdown */}
          {status === 'upcoming' && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded" style={{ background: `${kleur}15`, border: `1px solid ${kleur}30` }}>
              <span className="text-lg">⏱</span>
              <span className="font-head font-bold text-lg" style={{ color: kleur }}>{dagen} {dagen === 1 ? 'dag' : 'dagen'}</span>
              <span className="font-ui text-xs text-brand-muted">tot de race</span>
            </div>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Circuit info */}
          <div>
            <div className="section-title mb-4">Circuit</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-ui text-xs text-brand-muted">Datum</span>
                <span className="font-ui text-xs text-brand-light font-semibold">
                  {new Date(race.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-ui text-xs text-brand-muted">Starttijd</span>
                <span className="font-ui text-xs font-semibold" style={{ color: race.tijd_cet === 'TBC' ? '#666' : undefined }}>
                  {race.tijd_cet === 'TBC' ? 'Nog niet bevestigd' : `${race.tijd_cet} CET`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-ui text-xs text-brand-muted">Lengte</span>
                <span className="font-ui text-xs text-brand-light font-semibold">{race.track_lengte_km} km</span>
              </div>
              {race.ronden && (
                <div className="flex justify-between">
                  <span className="font-ui text-xs text-brand-muted">Ronden</span>
                  <span className="font-ui text-xs text-brand-light font-semibold">{race.ronden}</span>
                </div>
              )}
              {race.duur_uren && (
                <div className="flex justify-between">
                  <span className="font-ui text-xs text-brand-muted">Duur</span>
                  <span className="font-ui text-xs text-brand-light font-semibold">{race.duur_uren} uur</span>
                </div>
              )}
            </div>

            {/* Circuit SVG */}
            <div
              className="mt-4 rounded-lg flex items-center justify-center overflow-hidden"
              style={{ height: 160, background: `${kleur}08`, border: `1px solid ${kleur}20` }}
            >
              <img
                src={getCircuitSvgPath(race.serie, race.id)}
                alt={`${race.baan} layout`}
                style={{ maxHeight: 150, maxWidth: '100%', opacity: 0.9 }}
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  target.nextElementSibling?.removeAttribute('style')
                }}
              />
              <span className="font-ui text-xs text-brand-muted" style={{ display: 'none' }}>
                Circuit layout — binnenkort
              </span>
            </div>
          </div>

          {/* Snelste ronde */}
          <div>
            <div className="section-title mb-4">Snelste Ronde Ooit</div>
            <div
              className="rounded-lg p-4"
              style={{ background: `${kleur}10`, border: `1px solid ${kleur}25` }}
            >
              <div className="font-head font-black text-3xl mb-1" style={{ color: kleur }}>
                {race.snelste_ronde_tijd}
              </div>
              <div className="font-ui text-sm font-semibold text-brand-light">{race.snelste_ronde_rijder}</div>
              <div className="font-ui text-xs text-brand-muted">{race.snelste_ronde_team}</div>
              <div className="font-ui text-xs text-brand-muted mt-1">{race.snelste_ronde_jaar}</div>
            </div>

            {/* Klassen pills voor ELMS en MLMC */}
            {(race.serie === 'ELMS' || race.serie === 'MLMC') && (
              <div className="mt-4">
                <div className="section-title mb-3">Klassen</div>
                <div className="flex flex-wrap gap-1.5">
                  {(race.serie === 'ELMS' ? ELMS_KLASSEN : MLMC_KLASSEN).map(k => (
                    <span
                      key={k}
                      className={`px-2.5 py-1 rounded text-[11px] font-ui font-bold border ${KLASSE_STIJL[k] ?? 'bg-white/10 text-white/60 border-white/10'}`}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Sessie tijden */}
            {Object.keys(race.sessies).length > 0 && (
              <div className="mt-4">
                <div className="section-title mb-3">Programma</div>
                <div className="space-y-1.5">
                  {Object.entries(race.sessies).map(([key, sessie]) => (
                    <div key={key} className="flex justify-between items-center py-1 border-b border-brand-border/50">
                      <span className="font-ui text-xs text-brand-muted">{sessieLabels[key] ?? key}</span>
                      <span className="font-ui text-xs text-brand-light">
                        {new Date(sessie.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} · {sessie.tijd_cet}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Race Kaart ───────────────────────────────────────────────────────────────
function RaceKaart({ race, onClick }: { race: KalenderRace; onClick: () => void }) {
  const kleur   = serieKleur[race.serie] ?? '#f97316'
  const serieId = serieMap[race.serie]
  const status  = getRaceStatus(race.datum)
  const dagen   = getDagenTot(race.datum)
  const datum   = new Date(race.datum)

  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:border-white/20 transition-all hover:-translate-y-0.5 duration-200"
      style={{ borderTop: `2px solid ${kleur}` }}
    >
      <div className="p-4">
        {/* Datum + badge */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-center">
            <div className="font-head font-black text-2xl leading-none" style={{ color: kleur }}>
              {datum.getDate()}
            </div>
            <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider">
              {datum.toLocaleDateString('nl-NL', { month: 'short' })}
            </div>
          </div>
          {serieId
            ? <SeriesBadge series={serieId} />
            : <span className="badge" style={{ color: kleur, borderColor: `${kleur}40`, backgroundColor: `${kleur}20` }}>{race.serie}</span>
          }
        </div>

        {/* Naam + baan */}
        <div className="font-head font-bold text-base uppercase leading-tight mb-0.5">{race.naam}</div>
        <div className="font-ui text-xs text-brand-muted truncate">{race.baan}</div>

        {/* Status */}
        <div className="mt-3 pt-3 border-t border-brand-border/50 flex items-center justify-between">
          {status === 'upcoming' && (
            <span className="font-ui text-[10px] text-brand-muted">
              {dagen === 1 ? 'Morgen' : `${dagen} dagen`}
            </span>
          )}
          {status === 'today' && (
            <span className="flex items-center gap-1 font-ui text-[10px] font-bold text-brand-orange">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse-dot" /> Vandaag
            </span>
          )}
          {status === 'finished' && (
            <span className="font-ui text-[10px] text-brand-muted/50">Afgelopen</span>
          )}
          <span className="font-ui text-[10px] text-brand-muted">
            {race.tijd_cet === 'TBC' ? 'Tijd TBC' : `${race.tijd_cet} CET`}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Kalender Pagina ──────────────────────────────────────────────────────────
export default function Kalender() {
  const [maanden,       setMaanden]       = useState<KalenderMaand[]>([])
  const [laden,         setLaden]         = useState(true)
  const [geselecteerd,  setGeselecteerd]  = useState<KalenderRace | null>(null)
  const [filterSerie,   setFilterSerie]   = useState<string>('alle')

  useEffect(() => {
    getKalender().then((data) => {
      setMaanden(data)
      setLaden(false)
    })
  }, [])

  const series = ['alle', 'F1', 'WEC', 'ELMS', 'MLMC', 'MotoGP', 'GT3', 'IMSA', 'WorldSBK']

  const gefilterd = maanden.map((m) => ({
    ...m,
    races: filterSerie === 'alle' ? m.races : m.races.filter((r) => r.serie === filterSerie),
  })).filter((m) => m.races.length > 0)

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="section-title mb-3">2026 Seizoen</div>
        <h1 className="font-head font-black text-4xl uppercase tracking-wide mb-2">Racekalender</h1>
        <p className="font-ui text-sm text-brand-muted">Alle races van het 2026 seizoen — klik op een race voor meer info</p>
      </div>

      {/* Serie filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {series.map((serie) => {
          const kleur   = serieKleur[serie]
          const actief  = filterSerie === serie
          return (
            <button
              key={serie}
              onClick={() => setFilterSerie(serie)}
              className="font-ui text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded transition-all duration-200"
              style={actief
                ? { background: kleur ?? '#ff6600', color: '#fff', border: `1px solid ${kleur ?? '#ff6600'}` }
                : { background: 'transparent', color: '#888', border: '1px solid #222', cursor: 'pointer' }
              }
            >
              {serie === 'alle' ? 'Alle series' : serie === 'MLMC' ? 'LM Cup' : serie}
            </button>
          )
        })}
      </div>

      {/* Laden */}
      {laden && (
        <div className="flex items-center justify-center gap-3 py-20">
          <div className="w-6 h-6 border-2 border-brand-border border-t-brand-orange rounded-full animate-spin" />
          <span className="font-ui text-sm text-brand-muted">Kalender laden...</span>
        </div>
      )}

      {/* Geen data */}
      {!laden && gefilterd.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">📅</div>
          <h2 className="font-head text-xl font-bold uppercase mb-2">Geen races gevonden</h2>
          <p className="font-ui text-sm text-brand-muted">Probeer een andere serie filter.</p>
        </div>
      )}

      {/* Maanden */}
      {!laden && gefilterd.map((maand) => (
        <div key={maand.maand} className="mb-10">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="font-head font-bold text-xl uppercase tracking-wider">{maand.naam}</h2>
            <div className="flex-1 h-px bg-brand-border" />
            <span className="font-ui text-xs text-brand-muted">{maand.races.length} {maand.races.length === 1 ? 'race' : 'races'}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {maand.races.map((race) => (
              <RaceKaart
                key={`${race.serie}-${race.id}`}
                race={race}
                onClick={() => setGeselecteerd(race)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Modal */}
      {geselecteerd && (
        <RaceModal race={geselecteerd} onClose={() => setGeselecteerd(null)} />
      )}
    </div>
  )
}
