import { SERIES_CONFIG } from '@/lib/utils'
import type { SeriesId } from '@/types'

interface Props {
  series: SeriesId
  size?: 'sm' | 'md'
}

export default function SeriesBadge({ series, size = 'sm' }: Props) {
  const config = SERIES_CONFIG[series]
  if (!config) return null

  return (
    <span
      className={`badge ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}
      style={{
        backgroundColor: `${config.hex}20`,
        color:           config.hex,
        borderColor:     `${config.hex}40`,
        border:          '1px solid',
      }}
    >
      {config.label}
    </span>
  )
}
