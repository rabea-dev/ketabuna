'use client'

import { useState, useMemo } from 'react'
import ArticleCard from './ArticleCard'
import { Article } from '@/types/article'

const allCategories = ['الكل', 'ثقافة وأدب', 'تراث وتاريخ', 'شعر وأدب', 'لغة وترجمة', 'مجتمع وثقافة', 'شخصيات أدبية']

interface Props {
  articles: Article[]
}

export default function ArticlesListWithFilter({ articles }: Props) {
  const [activeCategory, setActiveCategory] = useState('الكل')

  // Build a list of categories that actually appear in articles, plus الكل first
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { 'الكل': articles.length }
    for (const a of articles) {
      counts[a.category] = (counts[a.category] || 0) + 1
    }
    return allCategories
      .filter(c => c === 'الكل' || (counts[c] && counts[c] > 0))
      .map(c => ({ name: c, count: counts[c] || 0 }))
  }, [articles])

  const filtered = useMemo(() => {
    if (activeCategory === 'الكل') return articles
    return articles.filter(a => a.category === activeCategory)
  }, [articles, activeCategory])

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-stone">
        {categoriesWithCounts.map(({ name, count }) => (
          <button
            key={name}
            onClick={() => setActiveCategory(name)}
            className={`px-4 py-1.5 rounded-full text-sm font-naskh transition-colors flex items-center gap-1.5 ${
              activeCategory === name
                ? 'bg-forest text-white'
                : 'bg-stone text-ink-muted hover:bg-forest/10 hover:text-forest'
            }`}
          >
            {name}
            <span className={`text-xs ${activeCategory === name ? 'text-white/70' : 'text-ink-faint'}`}>
              ({count.toLocaleString('ar-EG')})
            </span>
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-ink-muted font-naskh text-xl">
            لا توجد مقالات في تصنيف «{activeCategory}»
          </p>
          <button
            onClick={() => setActiveCategory('الكل')}
            className="mt-4 text-forest font-naskh text-sm hover:underline"
          >
            ← عرض كل المقالات
          </button>
        </div>
      )}
    </>
  )
}
