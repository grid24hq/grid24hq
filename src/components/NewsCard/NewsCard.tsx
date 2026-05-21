import SeriesBadge from './SeriesBadge'
import { formatRaceDate } from '@/lib/utils'
import type { NewsArticle } from '@/types'

interface Props {
  article:  NewsArticle
  featured?: boolean
}

export default function NewsCard({ article, featured = false }: Props) {
  const published = formatRaceDate(article.publishedAt)

  if (featured) {
    return (
      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="card card-accent block group hover:border-brand-orange transition-colors"
      >
        {/* Large image */}
        <div
          className="h-48 relative overflow-hidden flex items-end p-4"
          style={{
            background: article.imageUrl
              ? `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url(${article.imageUrl}) center/cover`
              : 'linear-gradient(135deg, #1a0800, #0d0500)',
          }}
        >
          {article.series && <SeriesBadge series={article.series} />}
        </div>

        <div className="p-4">
          <h3 className="font-head text-xl font-bold leading-snug mb-2 group-hover:text-brand-orange transition-colors">
            {article.title}
          </h3>
          <p className="font-ui text-xs text-brand-muted line-clamp-2 mb-3">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-ui text-[10px] text-brand-muted">{article.source}</span>
            <span className="font-ui text-[10px] text-brand-muted">{published}</span>
          </div>
        </div>
      </a>
    )
  }

  // Compact card
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex gap-3 p-3 group hover:border-brand-orange transition-colors"
    >
      {/* Thumbnail */}
      <div
        className="w-20 h-16 rounded flex-shrink-0"
        style={{
          background: article.imageUrl
            ? `url(${article.imageUrl}) center/cover`
            : 'linear-gradient(135deg, #1a0800, #0d0500)',
        }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {article.series && <SeriesBadge series={article.series} />}
        <h3 className="font-head text-sm font-bold leading-tight mt-1 mb-1 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-ui text-[10px] text-brand-muted">{article.source}</span>
          <span className="font-ui text-[10px] text-brand-muted">·</span>
          <span className="font-ui text-[10px] text-brand-muted">{published}</span>
        </div>
      </div>
    </a>
  )
}
