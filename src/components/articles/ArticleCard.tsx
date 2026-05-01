import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'
import Badge from '@/components/ui/Badge'

interface ArticleCardProps {
  article: Article
  layout?: 'grid' | 'list'
}

export default function ArticleCard({ article, layout = 'grid' }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (layout === 'list') {
    return (
      <Link href={`/articles/${article.slug}`} className="group block">
        <article className="flex gap-4 bg-white border border-stone rounded-lg p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
          <div className="relative w-24 h-20 shrink-0 rounded-md overflow-hidden">
            <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="forest" className="mb-1 text-xs">{article.category}</Badge>
            <h3 className="font-plex font-bold text-base text-ink group-hover:text-forest transition-colors line-clamp-2 leading-snug mt-1 mb-1">
              {article.title}
            </h3>
            <p className="text-ink-muted text-xs font-naskh">{article.author} · {formattedDate}</p>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="bg-white border border-stone rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge variant="forest">{article.category}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-plex font-bold text-lg text-ink group-hover:text-forest transition-colors line-clamp-2 leading-snug mb-2">
            {article.title}
          </h3>
          <p className="text-ink-muted font-naskh text-sm line-clamp-3 leading-relaxed flex-1 mb-4">
            {article.summary}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-ink-faint text-xs font-naskh pt-4 border-t border-stone/60">
            <span>{article.author}</span>
            <span className="text-stone-dark">·</span>
            <span>{formattedDate}</span>
            <span className="text-stone-dark">·</span>
            <span>{article.readingTime} د</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
