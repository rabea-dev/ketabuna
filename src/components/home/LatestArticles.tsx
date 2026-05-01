import Link from 'next/link'
import { Article } from '@/types/article'
import ArticleCard from '@/components/articles/ArticleCard'

interface LatestArticlesProps {
  articles: Article[]
}

export default function LatestArticles({ articles }: LatestArticlesProps) {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-plex font-bold text-2xl text-ink">أحدث المقالات</h2>
          <div className="h-0.5 w-16 bg-gold mt-2" />
        </div>
        <Link
          href="/articles"
          className="text-forest font-naskh text-sm hover:text-forest-light transition-colors flex items-center gap-1"
        >
          عرض الكل
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
