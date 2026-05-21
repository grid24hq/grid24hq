import { Link } from 'react-router-dom'
import SeriesBadge from '@/components/SeriesBadge'
import type { Driver } from '@/types'

interface Props {
  driver:  Driver
  compact?: boolean
}

export default function DriverCard({ driver, compact = false }: Props) {
  const fullName = `${driver.firstName} ${driver.lastName}`

  if (compact) {
    return (
      <div className="card flex items-center gap-3 px-4 py-3 hover:border-brand-orange transition-colors cursor-pointer">
        {/* Number badge */}
        <div
          className="w-9 h-9 rounded flex items-center justify-center font-head text-sm font-black flex-shrink-0"
          style={{ background: 'rgba(230,51,0,0.15)', color: '#ff6600' }}
        >
          {driver.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-head text-sm font-bold">{fullName}</div>
          <div className="font-ui text-xs text-brand-muted truncate">{driver.team.name}</div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <SeriesBadge series={driver.series} />
          <span className="font-ui text-xs font-semibold text-brand-orange">
            {driver.stats.points} pts
          </span>
        </div>
      </div>
    )
  }

  return (
    <Link to={`/drivers/${driver.id}`} className="card card-accent block hover:border-brand-orange transition-colors group">
      {/* Header */}
      <div
        className="h-36 flex flex-col justify-between p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #150800, #0a0500)' }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(rgba(230,51,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(230,51,0,0.08) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
        {/* Car number — big background */}
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 font-head font-black opacity-10 leading-none select-none"
          style={{ fontSize: '96px', color: '#ff6600' }}
        >
          {driver.number}
        </div>

        <div className="relative z-10">
          <SeriesBadge series={driver.series} />
        </div>

        <div className="relative z-10">
          <div className="font-ui text-2xl mb-1">{driver.flagEmoji}</div>
          <div
            className="font-head text-2xl font-black uppercase leading-none"
            style={{ color: '#ff6600' }}
          >
            #{driver.number}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-head text-xl font-bold uppercase tracking-wide leading-tight mb-0.5 group-hover:text-brand-orange transition-colors">
          {fullName}
        </h3>
        <p className="font-ui text-xs text-brand-muted mb-4">{driver.team.name} · {driver.team.car}</p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Punten', value: driver.stats.points },
            { label: 'Overwinningen', value: driver.stats.wins },
            { label: 'Podiums', value: driver.stats.podiums },
          ].map(({ label, value }) => (
            <div key={label} className="bg-brand-dark rounded p-2 text-center">
              <div className="font-head text-xl font-bold text-brand-orange">{value}</div>
              <div className="font-ui text-[10px] text-brand-muted uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}
