import SeriesBadge from '@/components/SeriesBadge'
export default function IMSA() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-head font-black text-4xl uppercase tracking-wide">IMSA WeatherTech</h1>
        <SeriesBadge series="imsa" size="md" />
      </div>
      <p className="font-ui text-sm text-brand-muted">IMSA pagina — in aanbouw 🏁</p>
    </div>
  )
}
