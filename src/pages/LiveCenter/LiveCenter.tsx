import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import LiveTiming from '@/components/LiveTiming/LiveTiming'
import { getLiveSessies, type LiveSessie } from '@/services/raceApi'
import { getKalender, getDagenTot, type KalenderRace } from '@/services/kalenderApi'

// ─── Configuratie per serie ───────────────────────────────────────────────────
const SERIE_CONFIG: Record<string, {
  kleur: string; gradient: string; naam: string; subklassen?: string[]
}> = {
  F1:       { kleur: '#e10600', gradient: 'from-red-950/60',   naam: 'Formula 1' },
  MotoGP:   { kleur: '#f97316', gradient: 'from-orange-950/60', naam: 'MotoGP World Championship', subklassen: ['MotoGP', 'Moto2', 'Moto3'] },
  WEC:      { kleur: '#3b82f6', gradient: 'from-blue-950/60',  naam: 'World Endurance Championship', subklassen: ['Hypercar', 'LMP2', 'GT3 Am'] },
  GT3:      { kleur: '#22c55e', gradient: 'from-green-950/60', naam: 'GT3 Racing' },
  IMSA:     { kleur: '#a855f7', gradient: 'from-purple-950/60', naam: 'IMSA SportsCar Championship' },
  WorldSBK: { kleur: '#eab308', gradient: 'from-yellow-950/60', naam: 'WorldSBK Championship', subklassen: ['Superbike', 'Supersport'] },
}

// ─── Countdown blokje ─────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [parts, setParts] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function update() {
      const diff = new Date(targetDate).getTime() - Date.now()
      if (diff <= 0) { setParts({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setParts({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      })
    }
    update()
    const iv = setInterval(update, 1_000)
    return () => clearInterval(iv)
  }, [targetDate])

  return (
    <div className="flex gap-2 mt-4">
      {[
        { v: parts.days,    l: 'Days'    },
        { v: parts.hours,   l: 'Hours'   },
        { v: parts.minutes, l: 'Minutes' },
        { v: parts.seconds, l: 'Seconds' },
      ].map(({ v, l }) => (
        <div key={l} className="flex-1 text-center rounded-lg py-2" style={{ background: '#c0392b' }}>
          <div className="font-head font-black text-2xl leading-none text-white">{v}</div>
          <div className="font-ui text-[9px] uppercase tracking-wider text-white/70 mt-0.5">{l}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Upcoming Event kaart ─────────────────────────────────────────────────────
function UpcomingEventCard() {
  const [volgend, setVolgend] = useState<KalenderRace | null>(null)

  useEffect(() => {
    getKalender().then((maanden) => {
      const vandaag = new Date(); vandaag.setHours(0, 0, 0, 0)
      const alle = maanden.flatMap(m => m.races)
      const komend = alle
        .filter(r => new Date(r.datum) >= vandaag)
        .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())
      setVolgend(komend[0] ?? null)
    })
  }, [])

  if (!volgend) return (
    <div className="rounded-xl p-5 flex items-center justify-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', minHeight: 200 }}>
      <span className="font-ui text-xs text-brand-muted">Laden...</span>
    </div>
  )

  const cfg   = SERIE_CONFIG[volgend.serie]
  const kleur = cfg?.kleur ?? '#f97316'
  const start = new Date(volgend.datum)
  // Sessies: bepaal eerste en laatste sessie datum
  const sessieData = Object.values(volgend.sessies)
  const sessieKeys = Object.entries(volgend.sessies)

  return (
    <div className="rounded-xl p-5 h-full" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="font-ui text-[10px] font-bold uppercase tracking-[2px] text-brand-muted mb-3">Upcoming event</div>

      {/* Land en baan */}
      <div className="flex items-center gap-2 mb-1">
        <span className="font-ui text-sm font-semibold text-brand-light">{volgend.land}</span>
      </div>
      <div className="font-head font-black text-2xl uppercase text-white mb-1">{volgend.stad?.toUpperCase() ?? volgend.land.toUpperCase()}</div>
      <div className="font-ui text-xs text-brand-muted mb-4">
        {start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()} ·{' '}
        {volgend.baan}
      </div>

      <Countdown targetDate={volgend.datum} />

      {/* Key sessions */}
      {sessieKeys.length > 0 && (
        <div className="mt-4">
          <div className="font-ui text-[9px] uppercase tracking-[2px] text-brand-muted mb-2">Key sessions (times local to you)</div>
          <div className="flex flex-wrap gap-2">
            {sessieKeys.slice(0, 4).map(([key, sessie]) => {
              const isSprint = key.includes('sprint')
              const isRace   = key === 'race' || key === 'race1' || key === 'race2'
              return (
                <span key={key} className="flex items-center gap-1.5 font-ui text-[10px] font-semibold">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                    style={{ background: isSprint ? '#9333ea' : isRace ? '#e10600' : '#374151', color: '#fff' }}
                  >
                    {isSprint ? 'SPR' : isRace ? 'RAC' : 'FP'}
                  </span>
                  <span className="text-brand-muted">
                    {new Date(sessie.datum).toLocaleDateString('en-GB', { weekday: 'short' })} {sessie.tijd_cet}
                  </span>
                </span>
              )
            })}
          </div>
        </div>
      )}

      <Link to="/kalender" className="mt-4 inline-block font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded border border-white/20 text-brand-muted hover:text-white hover:border-white/40 transition-colors">
        View schedule
      </Link>
    </div>
  )
}

// ─── Live sessie selector tabs ────────────────────────────────────────────────
function SerieTabs({ sessies, actief, onKies }: {
  sessies: LiveSessie[]
  actief:  LiveSessie | null
  onKies:  (s: LiveSessie) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {sessies.map((s) => {
        const cfg    = SERIE_CONFIG[s.klasse]
        const kleur  = cfg?.kleur ?? '#f97316'
        const isActief = actief?.klasse === s.klasse && actief?.gp === s.gp
        return (
          <button
            key={`${s.klasse}-${s.gp}`}
            onClick={() => onKies(s)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-ui text-xs font-bold uppercase tracking-wider"
            style={isActief
              ? { background: kleur + '22', borderColor: kleur, color: kleur }
              : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#888' }
            }
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: kleur }} />
            {s.klasse} — {s.gpNaam}
          </button>
        )
      })}
    </div>
  )
}

// ─── Geen live scherm ─────────────────────────────────────────────────────────
function GeenLive() {
  return (
    <div className="rounded-xl p-12 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-5xl mb-4">🏁</div>
      <h2 className="font-head font-black text-2xl uppercase tracking-wide mb-3">Geen live sessies</h2>
      <p className="font-ui text-sm text-brand-muted max-w-sm mx-auto">
        Start je Python tracker om data naar Firebase te sturen. Zodra een sessie live gaat verschijnt de timing hier automatisch.
      </p>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function LiveCenter() {
  const { isLoggedIn }                      = useAuth()
  const { t }                               = useTranslation()
  const [sessies,      setSessies]          = useState<LiveSessie[]>([])
  const [actieveSessie, setActieveSessie]   = useState<LiveSessie | null>(null)
  const [laden,        setLaden]            = useState(true)

  useEffect(() => {
    if (!isLoggedIn) return

    async function laadSessies() {
      const gevonden = await getLiveSessies()
      setSessies(gevonden)
      if (gevonden.length > 0 && !actieveSessie) setActieveSessie(gevonden[0])
      setLaden(false)
    }

    laadSessies()
    const interval = setInterval(laadSessies, 30_000)
    return () => clearInterval(interval)
  }, [isLoggedIn])

  // ── Niet ingelogd ──
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

  const heeftLive = sessies.length > 0

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">

      {/* ── Bovenste rij: Upcoming + actief kampioenschap ── */}
      {actieveSessie && (() => {
        const cfg   = SERIE_CONFIG[actieveSessie.klasse]
        const kleur = cfg?.kleur ?? '#f97316'
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Upcoming event */}
            <UpcomingEventCard />

            {/* Kampioenschap standings placeholder */}
            <div className="rounded-xl p-5 h-full" style={{ background: '#1c1c1c', border: `1px solid ${kleur}30` }}>
              <div className="font-ui text-[10px] font-bold uppercase tracking-[2px] mb-3" style={{ color: kleur }}>
                {actieveSessie.klasse} 2026 Championship Standings
              </div>
              <div className="flex items-center justify-center h-32 text-brand-muted font-ui text-xs">
                Kampioenschapsstand komt beschikbaar via API.
              </div>
              <Link to={`/${actieveSessie.klasse.toLowerCase()}`} className="mt-2 inline-block font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded border border-white/20 text-brand-muted hover:text-white hover:border-white/40 transition-colors">
                View full standings
              </Link>
            </div>
          </div>
        )
      })()}

      {/* Geen live: toon alleen upcoming */}
      {!laden && !heeftLive && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <UpcomingEventCard />
          <GeenLive />
        </div>
      )}

      {/* ── Sessie tabs (als er meerdere live zijn) ── */}
      {!laden && heeftLive && sessies.length > 1 && (
        <SerieTabs sessies={sessies} actief={actieveSessie} onKies={setActieveSessie} />
      )}

      {/* ── Laden indicator ── */}
      {laden && (
        <div className="flex items-center justify-center gap-3 py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-orange-500 rounded-full animate-spin" />
          <span className="font-ui text-sm text-brand-muted">Live data laden...</span>
        </div>
      )}

      {/* ── Live timing tabel ── */}
      {!laden && heeftLive && actieveSessie && (
        <LiveTiming
          sessionId={`${actieveSessie.klasse}/${actieveSessie.jaar}/${actieveSessie.gp}`}
          klasse={actieveSessie.klasse}
          sessieNaam={actieveSessie.status}
          status={actieveSessie.status}
          land={actieveSessie.gpNaam}
        />
      )}
    </div>
  )
}
