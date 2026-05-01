import { Metadata } from 'next'
import ArticleCard from '@/components/articles/ArticleCard'
import { getPublishedArticles } from '@/data/articles'

export const metadata: Metadata = {
  title: 'المقالات',
  description: 'اكتشف أحدث المقالات الثقافية والأدبية والفكرية على كتابنا',
}

const allCategories = ['الكل', 'ثقافة وأدب', 'تراث وتاريخ', 'شعر وأدب', 'لغة وترجمة', 'مجتمع وثقافة', 'شخصيات أدبية']

export default function ArticlesPage() {
  const articles = getPublishedArticles()

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-plex font-bold text-3xl text-ink mb-2">المقالات</h1>
        <div className="h-0.5 w-16 bg-gold mb-4" />
        <p className="text-ink-muted font-naskh text-lg">
          مقالات ثقافية وأدبية وفكرية مختارة، تُغني القارئ العربي وتُوسّع آفاقه.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-stone">
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-naskh transition-colors ${
              cat === 'الكل'
                ? 'bg-forest text-white'
                : 'bg-stone text-ink-muted hover:bg-forest/10 hover:text-forest'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-ink-muted font-naskh text-xl">لا توجد مقالات منشورة حالياً</p>
        </div>
      )}
    </div>
  )
}
