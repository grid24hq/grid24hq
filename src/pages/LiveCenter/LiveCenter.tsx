import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import SeriesBadge from '@/components/SeriesBadge/SeriesBadge'
import LiveTiming from '@/components/LiveTiming/LiveTiming'
import { getLiveSessies, type LiveSessie } from '@/services/raceApi'

// Klasse → SeriesBadge type mapping (moet overeenkomen met SeriesId in types/index.ts)
const klasseToSeries: Record<string, 'wec' | 'motogp' | 'gt3' | 'imsa' | 'wsb'> = {
  WEC:      'wec',
  MotoGP:   'motogp',
  GT3:      'gt3',
  IMSA:     'imsa',
  WorldSBK: 'wsb',
  // F1 staat niet in SeriesId, wordt getoond als tekst
}

const klasseKleur: Record<string, string> = {
  F1:       '#e10600',
  MotoGP:   '#f97316',
  WEC:      '#3b82f6',
  GT3:      '#22c55e',
  IMSA:     '#a855f7',
  WorldSBK: '#eab308',
}

export default function LiveCenter() {
  const { isLoggedIn }                    = useAuth()
  const { t }                             = useTranslation()
  const [sessies,     setSessies]         = useState<LiveSessie[]>([])
  const [actieveSessie, setActieveSessie] = useState<LiveSessie | null>(null)
  const [laden,       setLaden]           = useState(true)

  // Haal live sessies op uit Firebase
  useEffect(() => {
    if (!isLoggedIn) return

    async function laadSessies() {
      setLaden(true)
      const gevonden = await getLiveSessies()
      setSessies(gevonden)
      if (gevonden.length > 0) setActieveSessie(gevonden[0])
      setLaden(false)
    }

    laadSessies()
    // Ververs elke 30 seconden
    const interval = setInterval(laadSessies, 30_000)
    return () => clearInterval(interval)
  }, [isLoggedIn])

  // Niet ingelogd
  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-brand-card border border-brand-border rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🔒</span>
          </div>
          <h1 className="font-head font-black text-3xl uppercase tracking-wide mb-3">{t('live.locked')}</h1>
          <p className="font-ui text-sm text-brand-muted mb-8">{t('live.lockedDesc')}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login"    className="btn-primary">{t('nav.login')}</Link>
            <Link to="/register" className="btn-secondary">{t('auth.createFree')}</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-head font-black text-4xl uppercase tracking-wide">{t('live.title')}</h1>
          <span className="flex items-center gap-1.5 bg-brand-red text-white font-ui text-xs font-bold uppercase tracking-[1.5px] px-3 py-1.5 rounded">
            <span className="live-dot" /> Live
          </span>
        </div>
        <p className="font-ui text-sm text-brand-muted">{t('live.subtitle')}</p>
      </div>

      {/* Laden */}
      {laden && (
        <div className="flex items-center justify-center gap-3 py-20">
          <div className="w-6 h-6 border-2 border-brand-border border-t-brand-orange rounded-full animate-spin" />
          <span className="font-ui text-sm text-brand-muted">Live sessies ophalen...</span>
        </div>
      )}

      {/* Geen sessies */}
      {!laden && sessies.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-4xl mb-4">🏁</div>
          <h2 className="font-head text-xl font-bold uppercase mb-2">Geen live sessies</h2>
          <p className="font-ui text-sm text-brand-muted">
            Start je Python tracker om data naar Firebase te sturen.
          </p>
        </div>
      )}

      {/* Live sessie kaarten */}
      {!laden && sessies.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {sessies.map((sessie) => {
              const kleur    = klasseKleur[sessie.klasse] ?? '#f97316'
              const series   = klasseToSeries[sessie.klasse]
              const isActief = actieveSessie?.gp === sessie.gp && actieveSessie?.klasse === sessie.klasse

              return (
                <div
                  key={`${sessie.klasse}-${sessie.gp}`}
                  onClick={() => setActieveSessie(sessie)}
                  className={`card p-5 cursor-pointer transition-colors ${
                    isActief ? 'border-brand-orange' : 'hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    {series
                      ? <SeriesBadge series={series} />
                      : <span className="font-ui text-xs font-bold uppercase tracking-wider" style={{ color: kleur }}>{sessie.klasse}</span>
                    }
                    <span className="flex items-center gap-1.5 font-ui text-[10px] font-bold uppercase tracking-wider" style={{ color: kleur }}>
                      <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: kleur }} />
                      Live
                    </span>
                  </div>

                  <div className="font-head text-xl font-bold uppercase mb-1">{sessie.gpNaam}</div>
                  <div className="font-ui text-xs text-brand-muted mb-1">{sessie.status}</div>

                  {sessie.weer && (
                    <div className="font-ui text-[10px] text-brand-muted mt-2 flex gap-3">
                      <span>🌡 Baan: {sessie.weer.baan}</span>
                      <span>💨 Lucht: {sessie.weer.lucht}</span>
                      <span>{sessie.weer.conditie}</span>
                    </div>
                  )}

                  <div className="mt-4 h-1 bg-brand-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full animate-pulse"
                      style={{ width: '62%', background: `linear-gradient(90deg, ${kleur}80, ${kleur})` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Live timing tabel voor actieve sessie */}
          {actieveSessie && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-head font-bold text-lg uppercase tracking-wide">
                  Live Timing — {actieveSessie.klasse} {actieveSessie.gpNaam}
                </h2>
                {klasseToSeries[actieveSessie.klasse] && (
                  <SeriesBadge series={klasseToSeries[actieveSessie.klasse]!} size="md" />
                )}
              </div>
              <LiveTiming
                sessionId={`${actieveSessie.klasse}/${actieveSessie.jaar}/${actieveSessie.gp}`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
