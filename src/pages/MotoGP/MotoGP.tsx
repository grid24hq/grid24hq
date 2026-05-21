import { useSeriesEvents } from '@/hooks/useRace'
import RaceCard from '@/components/RaceCard'
import SeriesBadge from '@/components/SeriesBadge'

export default function MotoGP() {
  const { data: events, isLoading } = useSeriesEvents('motogp')
  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-head font-black text-4xl uppercase tracking-wide">MotoGP World Championship</h1>
            <SeriesBadge series="motogp" size="md" />
          </div>
          <p className="font-ui text-sm text-brand-muted">MotoGP · Moto2 · Moto3 · 2025</p>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i=><div key={i} className="card h-40 animate-pulse"/>)}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {events?.map(e=><RaceCard key={e.id} event={e}/>) ?? <p className="font-ui text-sm text-brand-muted">Geen races gevonden.</p>}
        </div>
      )}
    </div>
  )
}
