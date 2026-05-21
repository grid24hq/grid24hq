import SeriesBadge from '@/components/SeriesBadge'
import { formatRaceDate } from '@/lib/utils'
import type { NewsArticle } from '@/types'

interface Props {
  article: NewsArticle
  featured?: boolean
}

export default function NewsCard({ article, featured = false }: Props) {
  const published = formatRaceDate(article.publishedAt)

  return (
    
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="card flex gap-3 p-3 group hover:border-brand-orange transition-colors"
    >
      <div
        className="w-20 h-16 rounded flex-shrink-0"
        style={{
          background: article.imageUrl
            ? `url(${article.imageUrl}) center/cover`
            : 'linear-gradient(135deg, #1a0800, #0d0500)',
        }}
      />
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