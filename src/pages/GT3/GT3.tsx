import SeriesBadge from '@/components/SeriesBadge'
export default function GT3() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-head font-black text-4xl uppercase tracking-wide">GT3 Racing</h1>
        <SeriesBadge series="gt3" size="md" />
      </div>
      <p className="font-ui text-sm text-brand-muted">GT3 pagina — in aanbouw 🏁</p>
    </div>
  )
}
