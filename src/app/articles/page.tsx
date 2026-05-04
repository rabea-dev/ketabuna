import { Metadata } from 'next'
import { getPublishedArticles } from '@/data/articles'
import ArticlesListWithFilter from '@/components/articles/ArticlesListWithFilter'

export const metadata: Metadata = {
  title: 'المقالات',
  description: 'اكتشف أحدث المقالات الثقافية والأدبية والفكرية على كتابنا',
}

export const dynamic = 'force-dynamic'

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

      {articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink-muted font-naskh text-xl">لا توجد مقالات منشورة حالياً</p>
        </div>
      ) : (
        <ArticlesListWithFilter articles={articles} />
      )}
    </div>
  )
}
