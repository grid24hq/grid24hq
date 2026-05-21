import { useSessionTiming } from '@/hooks/useLive'
import type { TimingEntry } from '@/types'

interface Props {
  sessionId: string
  maxRows?:  number
}

function statusDot(status: TimingEntry['status']) {
  const map = {
    racing: 'bg-green-500',
    pit:    'bg-brand-amber',
    slow:   'bg-blue-400',
    out:    'bg-red-700',
  }
  return map[status] ?? 'bg-brand-muted'
}

export default function LiveTiming({ sessionId, maxRows = 20 }: Props) {
  const { entries, isLoading, lastUpdate } = useSessionTiming(sessionId)

  if (isLoading) {
    return (
      <div className="card p-6 flex items-center justify-center gap-3">
        <div className="w-5 h-5 border-2 border-brand-border border-t-brand-orange rounded-full animate-spin" />
        <span className="font-ui text-sm text-brand-muted">Live timing laden...</span>
      </div>
    )
  }

  if (!entries.length) {
    return (
      <div className="card p-6 text-center">
        <p className="font-ui text-sm text-brand-muted">Geen live timing beschikbaar.</p>
      </div>
    )
  }

  const visible = entries.slice(0, maxRows)

  return (
    <div className="card card-accent overflow-hidden">
      {/* Table header */}
      <div className="px-4 py-3 border-b border-brand-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-brand-red text-white font-ui text-[10px] font-bold uppercase tracking-[1.5px] px-2.5 py-1 rounded">
            <span className="live-dot" /> Live Timing
          </span>
        </div>
        {lastUpdate && (
          <span className="font-ui text-[10px] text-brand-muted">
            Bijgewerkt: {lastUpdate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        )}
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-brand-border bg-brand-dark/50">
              {['Pos', 'Nr', 'Rijder / Team', 'Ronde', 'Gap', 'Sec 1', 'Sec 2', 'Sec 3', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 font-ui text-[10px] font-semibold uppercase tracking-wider text-brand-muted whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => (
              <tr
                key={entry.carNumber}
                className="border-b border-brand-border/40 hover:bg-white/[0.02] transition-colors"
              >
                {/* Position */}
                <td className="px-3 py-2.5">
                  <span className={`font-head text-lg font-black ${
                    entry.position === 1 ? 'text-brand-amber'
                    : entry.position === 2 ? 'text-gray-300'
                    : entry.position === 3 ? 'text-yellow-700'
                    : 'text-brand-muted'
                  }`}>
                    {entry.position}
                  </span>
                </td>

                {/* Car number */}
                <td className="px-3 py-2.5">
                  <span className="font-ui text-xs font-bold text-brand-orange">
                    #{entry.carNumber}
                  </span>
                </td>

                {/* Driver + Team */}
                <td className="px-3 py-2.5 min-w-[160px]">
                  <div className="font-head text-sm font-bold">{entry.driverName}</div>
                  <div className="font-ui text-[11px] text-brand-muted">{entry.teamName}</div>
                </td>

                {/* Last lap */}
                <td className="px-3 py-2.5 font-mono text-xs text-brand-light whitespace-nowrap">
                  {entry.lastLapTime}
                </td>

                {/* Gap */}
                <td className="px-3 py-2.5 font-ui text-xs font-semibold text-brand-orange whitespace-nowrap">
                  {entry.gap}
                </td>

                {/* Sectors */}
                <td className="px-3 py-2.5 font-mono text-xs text-brand-muted">{entry.sector1}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-brand-muted">{entry.sector2}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-brand-muted">{entry.sector3}</td>

                {/* Status dot */}
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${statusDot(entry.status)}`}
                    title={entry.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {entries.length > maxRows && (
        <div className="px-4 py-2 border-t border-brand-border text-center">
          <span className="font-ui text-xs text-brand-muted">
            +{entries.length - maxRows} rijders niet getoond
          </span>
        </div>
      )}
    </div>
  )
}
