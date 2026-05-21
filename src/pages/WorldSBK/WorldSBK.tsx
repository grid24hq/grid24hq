import SeriesBadge from '@/components/SeriesBadge'
export default function WorldSBK() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-head font-black text-4xl uppercase tracking-wide">WorldSBK Championship</h1>
        <SeriesBadge series="wsb" size="md" />
      </div>
      <p className="font-ui text-sm text-brand-muted">WorldSBK pagina — in aanbouw 🏁</p>
    </div>
  )
}
