import { useSeriesEvents, useDriverStandings, useTeamStandings } from '@/hooks/useRace'
import RaceCard from '@/components/RaceCard'
import SeriesBadge from '@/components/SeriesBadge'

export default function WEC() {
  const { data: events,  isLoading: eventsLoading  } = useSeriesEvents('wec')
  const { data: drivers, isLoading: driversLoading } = useDriverStandings('wec')
  const { data: teams }                              = useTeamStandings('wec')

  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-head font-black text-4xl uppercase tracking-wide">World Endurance Championship</h1>
            <SeriesBadge series="wec" size="md" />
          </div>
          <p className="font-ui text-sm text-brand-muted">FIA WEC 2025 · Hypercar · LMP2 · GT3 Am</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Events */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Race Kalender</h2>
          </div>
          {eventsLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="card h-40 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {events?.map(event => <RaceCard key={event.id} event={event} />) ?? (
                <p className="font-ui text-sm text-brand-muted col-span-2">Geen races gevonden.</p>
              )}
            </div>
          )}
        </div>

        {/* Standings */}
        <div>
          <h2 className="section-title mb-5">Klassement</h2>
          <div className="card p-4 mb-4">
            <div className="font-ui text-xs text-brand-orange uppercase tracking-[2px] mb-3">Rijders</div>
            {driversLoading ? (
              <div className="animate-pulse space-y-2">{[1,2,3].map(i=><div key={i} className="h-8 bg-brand-dark rounded"/>)}</div>
            ) : (
              <div className="space-y-1">
                {drivers?.data.slice(0,8).map(d => (
                  <div key={d.id} className="flex items-center gap-2 py-1.5 border-b border-brand-border last:border-0">
                    <span className={`font-head text-base font-black w-5 ${d.position===1?'text-brand-amber':d.position===2?'text-gray-300':d.position===3?'text-yellow-700':'text-brand-muted'}`}>{d.position}</span>
                    <span className="font-head text-sm font-bold flex-1">{d.name}</span>
                    <span className="font-ui text-xs text-brand-orange font-semibold">{d.points}</span>
                  </div>
                )) ?? <p className="font-ui text-xs text-brand-muted">Geen data.</p>}
              </div>
            )}
          </div>
          <div className="card p-4">
            <div className="font-ui text-xs text-blue-400 uppercase tracking-[2px] mb-3">Teams</div>
            <div className="space-y-1">
              {teams?.data.slice(0,6).map(t => (
                <div key={t.id} className="flex items-center gap-2 py-1.5 border-b border-brand-border last:border-0">
                  <span className={`font-head text-base font-black w-5 ${t.position===1?'text-brand-amber':t.position===2?'text-gray-300':'text-brand-muted'}`}>{t.position}</span>
                  <span className="font-head text-sm font-bold flex-1 truncate">{t.name}</span>
                  <span className="font-ui text-xs text-brand-orange font-semibold">{t.points}</span>
                </div>
              )) ?? <p className="font-ui text-xs text-brand-muted">Geen data.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
