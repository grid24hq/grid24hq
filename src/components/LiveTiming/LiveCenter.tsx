import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import LiveTiming from '@/components/LiveTiming/LiveTiming'
import {
  getLiveSessies,
  getSessieStatus,
  getChampionshipStandings,
  type LiveSessie,
  type ChampionshipRijder,
} from '@/services/raceApi'
import { getKalender, type KalenderRace } from '@/services/kalenderApi'

const FIREBASE_RTDB = 'https://grid24hq-4ecf5-default-rtdb.europe-west1.firebasedatabase.app'

// ─── Serie config ─────────────────────────────────────────────────────────────
const SERIE_CONFIG: Record<string, { kleur: string; naam: string }> = {
  F1:       { kleur: '#e10600', naam: 'Formula 1' },
  MotoGP:   { kleur: '#f97316', naam: 'MotoGP World Championship' },
  WEC:      { kleur: '#3b82f6', naam: 'World Endurance Championship' },
  GT3:      { kleur: '#22c55e', naam: 'GT3 Racing' },
  IMSA:     { kleur: '#a855f7', naam: 'IMSA SportsCar Championship' },
  WorldSBK: { kleur: '#eab308', naam: 'WorldSBK Championship' },
}

// ─── Countdown ────────────────────────────────────────────────────────────────
function Countdown({ targetDate }: { targetDate: string }) {
  const [p, setP] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    function upd() {
      const now  = Date.now()
      const diff = new Date(targetDate).getTime() - now
      if (diff <= 0) { setP({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setP({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      })
    }
    upd(); const iv = setInterval(upd, 1_000); return () => clearInterval(iv)
  }, [targetDate])
  return (
    <div className="flex gap-2 mt-4">
      {[{ v: p.days, l: 'Days' }, { v: p.hours, l: 'Hours' }, { v: p.minutes, l: 'Minutes' }, { v: p.seconds, l: 'Seconds' }].map(({ v, l }) => (
        <div key={l} className="flex-1 text-center rounded-lg py-2" style={{ background: '#c0392b' }}>
          <div className="font-head font-black text-2xl leading-none text-white">{v}</div>
          <div className="font-ui text-[9px] uppercase tracking-wider text-white/70 mt-0.5">{l}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Serie kleuren voor badges ────────────────────────────────────────────────
const SERIE_KLEUR: Record<string, string> = {
  F1:       '#e10600',
  MotoGP:   '#f97316',
  WEC:      '#3b82f6',
  GT3:      '#22c55e',
  IMSA:     '#a855f7',
  WorldSBK: '#eab308',
  ELMS:     '#06b6d4',
  MLMC:     '#ec4899',
}

// ─── Upcoming Event kaart met tabs ────────────────────────────────────────────
function UpcomingEventCard() {
  const [komende, setKomende]   = useState<KalenderRace[]>([])
  const [actieveTab, setActieveTab] = useState(0)

  useEffect(() => {
    getKalender().then(maanden => {
      const vandaag = new Date(); vandaag.setHours(0, 0, 0, 0)
      const alleKomend = maanden.flatMap(m => m.races)
        .filter(r => new Date(r.datum) >= vandaag)
        .sort((a, b) => new Date(a.datum).getTime() - new Date(b.datum).getTime())

      if (alleKomend.length === 0) { setKomende([]); return }

      // Pak de datum van de eerstvolgende race en alle races op die dag
      const eersteDatum = alleKomend[0].datum.slice(0, 10)
      const opZelfdeDag = alleKomend.filter(r => r.datum.slice(0, 10) === eersteDatum)
      setKomende(opZelfdeDag)
    })
  }, [])

  if (komende.length === 0) return (
    <div className="rounded-xl p-5 flex items-center justify-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', minHeight: 200 }}>
      <span className="font-ui text-xs text-brand-muted">Laden...</span>
    </div>
  )

  const volgend    = komende[actieveTab] ?? komende[0]
  const kleur      = SERIE_KLEUR[volgend.serie] ?? '#f97316'
  const sessieKeys = Object.entries(volgend.sessies ?? {})
  const meerdere   = komende.length > 1

  return (
    <div className="rounded-xl p-5 h-full" style={{ background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="font-ui text-[10px] font-bold uppercase tracking-[2px] text-brand-muted mb-3">
        {meerdere ? 'Upcoming events' : 'Upcoming event'}
      </div>

      {/* Tabs — alleen tonen als er meerdere series zijn */}
      {meerdere && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {komende.map((race, i) => {
            const tabKleur = SERIE_KLEUR[race.serie] ?? '#f97316'
            const isActief = i === actieveTab
            return (
              <button
                key={`${race.serie}-${race.id}`}
                onClick={() => setActieveTab(i)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md font-ui text-[10px] font-bold uppercase tracking-wider transition-all"
                style={isActief
                  ? { background: tabKleur + '25', border: `1px solid ${tabKleur}`, color: tabKleur }
                  : { background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: '#666' }}
              >
                {race.serie}
              </button>
            )
          })}
        </div>
      )}

      {/* Race info */}
      <div className="font-ui text-sm font-semibold text-brand-light mb-0.5">{volgend.land}</div>
      <div className="font-head font-black text-2xl uppercase text-white mb-1">
        {volgend.stad?.toUpperCase() ?? volgend.land.toUpperCase()}
      </div>
      <div className="font-ui text-xs text-brand-muted mb-4">
        {new Date(volgend.datum).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()} · {volgend.baan}
      </div>

      <Countdown targetDate={volgend.datum} />

      {sessieKeys.length > 0 && (
        <div className="mt-4">
          <div className="font-ui text-[9px] uppercase tracking-[2px] text-brand-muted mb-2">Key sessions (times local to you)</div>
          <div className="flex flex-wrap gap-2">
            {sessieKeys.slice(0, 4).map(([key, sessie]) => {
              const isSprint = key.includes('sprint')
              const isRace   = key === 'race' || key === 'race1' || key === 'race2'
              return (
                <span key={key} className="flex items-center gap-1.5 font-ui text-[10px] font-semibold">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                    style={{ background: isSprint ? '#9333ea' : isRace ? '#e10600' : '#374151', color: '#fff' }}>
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

// ─── Championship Standings widget ────────────────────────────────────────────
function ChampionshipStandingsWidget({ klasse, kleur }: { klasse: string; kleur: string }) {
  const [rijders, setRijders]   = useState<ChampionshipRijder[]>([])
  const [laden, setLaden]       = useState(true)

  useEffect(() => {
    setLaden(true)
    getChampionshipStandings(klasse).then(data => {
      setRijders(data)
      setLaden(false)
    })
  }, [klasse])

  return (
    <div className="rounded-xl overflow-hidden h-full" style={{ background: '#1c1c1c', border: `1px solid ${kleur}30` }}>
      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between" style={{ background: kleur + '15', borderBottom: `1px solid ${kleur}25` }}>
        <span className="font-ui text-[10px] font-bold uppercase tracking-[2px]" style={{ color: kleur }}>
          {klasse} 2026 Championship Standings
        </span>
      </div>

      {laden && (
        <div className="flex items-center justify-center py-10">
          <div className="w-4 h-4 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: kleur }} />
        </div>
      )}

      {!laden && rijders.length === 0 && (
        <div className="flex items-center justify-center py-10 px-5 text-center">
          <div>
            <div className="text-2xl mb-2">📊</div>
            <p className="font-ui text-xs text-brand-muted">
              Nog geen standen beschikbaar.<br />
              Voer <code className="text-brand-orange">update_standings.py</code> uit via het Command Center.
            </p>
          </div>
        </div>
      )}

      {!laden && rijders.length > 0 && (
        <div className="overflow-y-auto" style={{ maxHeight: 340 }}>
          {rijders.slice(0, 10).map((r, i) => (
            <div
              key={r.nummer}
              className="flex items-center gap-3 px-5 py-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
              style={i === 0 ? { background: kleur + '10' } : undefined}
            >
              {/* Positie */}
              <span className={`font-head font-black text-xl w-7 flex-shrink-0 ${
                i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-brand-muted'
              }`}>{r.positie}</span>

              {/* Foto placeholder + info */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-head text-xs font-black"
                style={{ background: kleur + '30', color: kleur }}>
                {r.naam.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-head text-sm font-bold text-white truncate">{r.naam}</div>
                <div className="font-ui text-[10px] text-brand-muted truncate">{r.team}</div>
              </div>

              {/* Punten */}
              <div className="text-right flex-shrink-0">
                <span className="font-head font-black text-sm" style={{ color: kleur }}>{r.punten}</span>
                <span className="font-ui text-[10px] text-brand-muted ml-0.5">pts</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to={`/${klasse.toLowerCase()}`}
          className="font-ui text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded border border-white/20 text-brand-muted hover:text-white hover:border-white/40 transition-colors inline-block">
          View full standings
        </Link>
      </div>
    </div>
  )
}

// ─── Serie tabs (meerdere live sessies) ───────────────────────────────────────
function SerieTabs({ sessies, actief, onKies }: { sessies: LiveSessie[]; actief: LiveSessie | null; onKies: (s: LiveSessie) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {sessies.map(s => {
        const kleur    = SERIE_CONFIG[s.klasse]?.kleur ?? '#f97316'
        const isActief = actief?.klasse === s.klasse && actief?.gp === s.gp
        return (
          <button key={`${s.klasse}-${s.gp}`} onClick={() => onKies(s)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all font-ui text-xs font-bold uppercase tracking-wider"
            style={isActief
              ? { background: kleur + '22', borderColor: kleur, color: kleur }
              : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#888' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: kleur }} />
            {s.klasse} — {s.gpNaam}
          </button>
        )
      })}
    </div>
  )
}

// ─── Geen live ────────────────────────────────────────────────────────────────
function GeenLive() {
  return (
    <div className="rounded-xl p-12 text-center" style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="text-5xl mb-4">🏁</div>
      <h2 className="font-head font-black text-2xl uppercase tracking-wide mb-3">Geen live sessies</h2>
      <p className="font-ui text-sm text-brand-muted max-w-sm mx-auto">
        Zodra een sessie start verschijnt de live timing hier.
      </p>
    </div>
  )
}

// ─── Hoofdpagina ──────────────────────────────────────────────────────────────
export default function LiveCenter() {
  const { isLoggedIn }    = useAuth()
  const { t }             = useTranslation()

  const [sessies,          setSessies]         = useState<LiveSessie[]>([])
  const [actieveSessie,    setActieveSessie]   = useState<LiveSessie | null>(null)
  const [sessieStatus,     setSessieStatus]    = useState<Record<string, boolean>>({})
  const [laden,            setLaden]           = useState(true)

  // Welke specifieke GP is nu geselecteerd via de tab? (Pakt direct 'motogp_race', 'moto2_race', etc.)
  const actieveKlasse = actieveSessie?.klasse ?? null;
  const statusKey = actieveSessie?.gp ?? null;

  // De website springt op LIVE als jouw specifieke gp-sleutel op TRUE staat in Firebase
  const isNuLive = statusKey ? (sessieStatus[statusKey] === true) : false;

  const cfg   = actieveKlasse ? SERIE_CONFIG[actieveKlasse] : null
  const kleur = cfg?.kleur ?? '#f97316'

  // ── Polling: sessies + Sessie_Status samen elke 10s ──
  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false

    async function laad() {
      const [gevonden, status] = await Promise.all([
        getLiveSessies(),
        getSessieStatus(),
      ])
      if (cancelled) return
      setSessies(gevonden)
      setSessieStatus(status)
      // Auto-selecteer eerste sessie als nog niets gekozen
      setActieveSessie(prev => prev ?? (gevonden[0] ?? null))
      setLaden(false)
    }

    laad()
    const interval = setInterval(laad, 2000)
    return () => { cancelled = true; clearInterval(interval) }
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

      {/* ── Laden ── */}
      {laden && (
        <div className="flex items-center justify-center gap-3 py-20">
          <div className="w-6 h-6 border-2 border-white/10 border-t-orange-500 rounded-full animate-spin" />
          <span className="font-ui text-sm text-brand-muted">Live data laden...</span>
        </div>
      )}

      {!laden && (
        <>
          {/* ── Bovenste rij: Upcoming event + SCHAKELAAR (standings of live badge) ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <UpcomingEventCard />

            {/* Rechts: als live → live badge + sessie info, anders → championship standings */}
            {isNuLive && actieveSessie ? (
              <div className="rounded-xl p-5 flex flex-col justify-between" style={{ background: '#1c1c1c', border: `2px solid ${kleur}` }}>
                <div className="flex gap-4">
                  {/* Links: sessie info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: kleur, boxShadow: `0 0 8px ${kleur}` }} />
                      <span className="font-ui text-xs font-bold uppercase tracking-wider" style={{ color: kleur }}>
                        {actieveSessie.klasse} — Live nu
                      </span>
                    </div>
                    <div className="font-head font-black text-2xl uppercase text-white mb-1">{actieveSessie.gpNaam}</div>
                    <div className="font-ui text-sm text-brand-muted mb-1">{actieveSessie.status}</div>
                    {actieveSessie.circuit && (
                      <div className="font-ui text-xs text-brand-muted/70 mb-3">📍 {actieveSessie.circuit}</div>
                    )}
                    {actieveSessie.weer && (
                      <div className="flex gap-4 font-ui text-xs text-brand-muted">
                        <span>🌡 Baan: {actieveSessie.weer.baan}</span>
                        <span>💨 Lucht: {actieveSessie.weer.lucht}</span>
                        <span>{actieveSessie.weer.conditie}</span>
                      </div>
                    )}
                  </div>
                  {/* Rechts: circuit SVG */}
                  {actieveSessie.circuit_slug && (
                    <div className="flex-shrink-0 flex items-center justify-center" style={{ width: 260, height: 200 }}>
                      <img
                        src={`/motogp/livetime_circuits/${actieveSessie.circuit_slug}.svg`}
                        alt={actieveSessie.circuit ?? ''}
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'brightness(0) invert(1) opacity(0.7)' }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full animate-pulse" style={{ width: '70%', background: `linear-gradient(90deg, ${kleur}60, ${kleur})` }} />
                </div>
              </div>
            ) : (
              <ChampionshipStandingsWidget
                klasse={actieveKlasse ?? 'MotoGP'}
                kleur={kleur}
              />
            )}
          </div>

          {/* ── Sessie tabs (meerdere live) ── */}
          {heeftLive && sessies.length > 1 && (
            <SerieTabs sessies={sessies} actief={actieveSessie} onKies={setActieveSessie} />
          )}

          {/* ── Geen live sessies ── */}
          {!heeftLive && <GeenLive />}

          {/* ── SCHAKELAAR: Live Timing ÓÓÓF Championship Standings ── */}
          {heeftLive && actieveSessie && (
            isNuLive ? (
              /* Live timing tabel */
              <LiveTiming
                sessionId={`${actieveSessie.klasse}/${actieveSessie.jaar}/${actieveSessie.gp}`}
                klasse={actieveSessie.klasse}
              />
            ) : (
              /* Grote championship standings tabel als race klaar/gestopt is */
              <div className="rounded-xl overflow-hidden" style={{ background: '#1c1c1c', border: `1px solid ${kleur}30` }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ background: kleur + '15', borderBottom: `1px solid ${kleur}25` }}>
                  <span className="font-head font-black text-lg uppercase tracking-wide" style={{ color: kleur }}>
                    {actieveSessie.klasse} 2026 Championship Standings
                  </span>
                  <span className="font-ui text-[10px] text-brand-muted uppercase tracking-wider">Na afloop sessie</span>
                </div>
                <ChampionshipStandingsWidget klasse={actieveSessie.klasse} kleur={kleur} />
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}
