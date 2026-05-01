import { Article } from '@/types/article'
import ArticleCard from './ArticleCard'

interface RelatedArticlesProps {
  articles: Article[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="py-10 border-t border-stone">
      <h2 className="font-plex font-bold text-xl text-ink mb-2">مقالات ذات صلة</h2>
      <div className="h-0.5 w-12 bg-gold mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
