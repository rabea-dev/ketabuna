import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getArticleBySlug, getPublishedArticles, getRelatedArticles } from '@/data/articles'
import ArticleContent from '@/components/articles/ArticleContent'
import RelatedArticles from '@/components/articles/RelatedArticles'
import Badge from '@/components/ui/Badge'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const articles = getPublishedArticles()
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.summary,
  }
}

export default function ArticlePage({ params }: PageProps) {
  const article = getArticleBySlug(params.slug)
  if (!article || article.status !== 'published') notFound()

  const related = getRelatedArticles(article)

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-content mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-naskh text-ink-muted mb-8">
          <Link href="/" className="hover:text-forest transition-colors">الرئيسية</Link>
          <span className="text-stone-dark">/</span>
          <Link href="/articles" className="hover:text-forest transition-colors">المقالات</Link>
          <span className="text-stone-dark">/</span>
          <span className="text-ink line-clamp-1">{article.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Article Main */}
          <article className="lg:col-span-2">
            {/* Category */}
            <div className="mb-4">
              <Badge variant="forest">{article.category}</Badge>
            </div>

            {/* Title */}
            <h1 className="font-plex font-bold text-3xl md:text-4xl text-ink leading-tight mb-5">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-ink-muted font-naskh text-xl leading-loose italic mb-6 pb-6 border-b border-stone">
              {article.summary}
            </p>

            {/* Author Row */}
            <div className="flex flex-wrap items-center gap-4 text-ink-muted text-sm font-naskh mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-ink font-semibold text-sm">{article.author}</p>
                  {article.authorBio && <p className="text-xs text-ink-faint">{article.authorBio}</p>}
                </div>
              </div>
              <span className="text-stone-dark">|</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formattedDate}
              </span>
              <span className="text-stone-dark">|</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readingTime} دقائق قراءة
              </span>
            </div>

            {/* Hero Image */}
            <div className="relative h-72 md:h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
              {article.imageCaption && (
                <div className="absolute bottom-0 inset-x-0 bg-black/50 px-4 py-2">
                  <p className="text-white/80 text-xs font-naskh">{article.imageCaption}</p>
                </div>
              )}
            </div>

            {/* Article Content */}
            <ArticleContent article={article} />

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-stone">
                <span className="text-ink-muted text-sm font-naskh ml-2">الوسوم:</span>
                {article.tags.map(tag => (
                  <span key={tag} className="bg-stone text-ink-muted text-xs font-naskh px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Article Info Box */}
              <div className="bg-white border border-stone rounded-xl p-5">
                <h3 className="font-plex font-semibold text-base text-ink mb-4">معلومات المقال</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-muted font-naskh">الكاتب</dt>
                    <dd className="font-naskh text-ink font-medium">{article.author}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted font-naskh">التاريخ</dt>
                    <dd className="font-naskh text-ink">{formattedDate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted font-naskh">وقت القراءة</dt>
                    <dd className="font-naskh text-ink">{article.readingTime} دقائق</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-muted font-naskh">التصنيف</dt>
                    <dd><Badge variant="forest" className="text-xs">{article.category}</Badge></dd>
                  </div>
                </dl>
              </div>

              {/* Share */}
              <div className="bg-white border border-stone rounded-xl p-5">
                <h3 className="font-plex font-semibold text-base text-ink mb-4">مشاركة المقال</h3>
                <div className="flex gap-2">
                  {['تويتر', 'فيسبوك', 'واتساب'].map(s => (
                    <button key={s} className="flex-1 bg-stone text-ink-muted text-xs font-naskh py-2 rounded-lg hover:bg-forest/10 hover:text-forest transition-colors">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <RelatedArticles articles={related} />
        </div>
      </div>
    </div>
  )
}
