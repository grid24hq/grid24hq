import { Link } from 'react-router-dom'
import { formatRaceDate, daysUntil, countryToFlag } from '@/lib/utils'
import SeriesBadge from './SeriesBadge'
import type { RaceEvent } from '@/types'

interface Props {
  event:    RaceEvent
  compact?: boolean
}

export default function RaceCard({ event, compact = false }: Props) {
  const days = daysUntil(event.startDate)
  const flag = countryToFlag(event.circuit.countryCode)

  const statusColor =
    event.status === 'live'     ? 'text-brand-red'
    : event.status === 'upcoming' ? 'text-brand-orange'
    : 'text-brand-muted'

  const statusLabel =
    event.status === 'live'     ? 'LIVE'
    : event.status === 'upcoming' ? days === 0 ? 'Vandaag' : days === 1 ? 'Morgen' : `Over ${days} dagen`
    : 'Afgelopen'

  if (compact) {
    return (
      <div className="card flex items-center gap-4 px-4 py-3 hover:border-brand-orange transition-colors cursor-pointer">
        <div className="text-2xl">{flag}</div>
        <div className="flex-1 min-w-0">
          <div className="font-head text-sm font-bold uppercase truncate">{event.name}</div>
          <div className="font-ui text-xs text-brand-muted">{event.circuit.name}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SeriesBadge series={event.series} />
          <span className={`font-ui text-[10px] font-bold ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>
    )
  }

  return (
    <Link to={`/events/${event.id}`} className="card card-accent block hover:border-brand-orange transition-colors group">
      {/* Hero section */}
      <div
        className="h-28 flex items-end p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0800, #0d0500)' }}
      >
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'linear-gradient(rgba(230,51,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(230,51,0,0.06) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative z-10 flex items-end justify-between w-full">
          <div>
            <div className="text-3xl mb-1">{flag}</div>
            <SeriesBadge series={event.series} />
          </div>
          {event.status === 'live' && (
            <span className="flex items-center gap-1.5 bg-brand-red text-white font-ui text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded">
              <span className="live-dot" /> Live
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-head text-lg font-bold uppercase tracking-wide leading-tight mb-1 group-hover:text-brand-orange transition-colors">
          {event.name}
        </h3>
        <p className="font-ui text-xs text-brand-muted mb-3">
          {event.circuit.name} · {event.circuit.city}, {event.circuit.country}
        </p>

        {/* Sessions */}
        <div className="space-y-1 mb-3">
          {event.sessions.slice(0, 3).map((session) => (
            <div key={session.id} className="flex justify-between items-center">
              <span className="font-ui text-xs text-brand-muted">{session.name}</span>
              <span className="font-ui text-xs text-brand-light">
                {formatRaceDate(session.startTime)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-brand-border">
          <span className="font-ui text-xs text-brand-muted">
            Ronde {event.round}/{event.totalRounds}
          </span>
          <span className={`font-ui text-xs font-semibold ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>
    </Link>
  )
}
