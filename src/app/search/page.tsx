import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPublishedArticles } from '@/data/articles'
import { getPublishedBooks } from '@/data/books'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'البحث',
}

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const q = query.toLowerCase().trim()

  const articles = getPublishedArticles()
  const books = getPublishedBooks()

  const matchedArticles = q
    ? articles.filter(a =>
        a.title.includes(q) ||
        a.summary.includes(q) ||
        a.content.includes(q) ||
        a.author.includes(q) ||
        a.category.includes(q)
      )
    : []

  const matchedBooks = q
    ? books.filter(b =>
        b.title.includes(q) ||
        b.author.includes(q) ||
        b.summary.includes(q) ||
        b.category.includes(q)
      )
    : []

  const totalResults = matchedArticles.length + matchedBooks.length

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-plex font-bold text-3xl text-ink mb-2">نتائج البحث</h1>
        <div className="h-0.5 w-16 bg-gold mb-4" />
        {q && (
          <p className="text-ink-muted font-naskh text-base">
            {totalResults > 0
              ? `وجدنا ${totalResults} نتيجة للبحث عن: "${query}"`
              : `لا توجد نتائج للبحث عن: "${query}"`}
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-10">
        <form method="get" action="/search">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="ابحث عن مقالات وكتب..."
                className="w-full bg-white border border-stone rounded-lg py-3 pr-10 pl-4 font-naskh text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
              />
            </div>
            <button
              type="submit"
              className="bg-forest text-white px-6 py-3 rounded-lg font-plex font-medium hover:bg-forest-light transition-colors"
            >
              بحث
            </button>
          </div>
        </form>
      </div>

      {!q && (
        <div className="text-center py-20 text-ink-muted">
          <svg className="w-16 h-16 mx-auto mb-4 text-stone-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="font-naskh text-xl">اكتب كلمة للبحث في المقالات والكتب</p>
        </div>
      )}

      {q && totalResults === 0 && (
        <div className="text-center py-20">
          <svg className="w-16 h-16 mx-auto mb-4 text-stone-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="font-plex font-bold text-xl text-ink mb-2">لا توجد نتائج</h2>
          <p className="text-ink-muted font-naskh">حاول كلمات مختلفة أو تصفح المقالات والكتب</p>
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/articles" className="bg-forest text-white font-plex font-medium px-5 py-2 rounded-lg text-sm hover:bg-forest-light transition-colors">تصفح المقالات</Link>
            <Link href="/books" className="bg-navy text-white font-plex font-medium px-5 py-2 rounded-lg text-sm hover:bg-navy-light transition-colors">تصفح الكتب</Link>
          </div>
        </div>
      )}

      {/* Articles Results */}
      {matchedArticles.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-plex font-bold text-xl text-ink">المقالات</h2>
            <span className="bg-forest/10 text-forest text-sm font-plex px-2.5 py-0.5 rounded-full">
              {matchedArticles.length}
            </span>
          </div>
          <div className="space-y-4">
            {matchedArticles.map(article => (
              <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
                <div className="flex gap-4 bg-white border border-stone rounded-lg p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="relative w-20 h-16 shrink-0 rounded-md overflow-hidden">
                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="article">مقال</Badge>
                      <Badge variant="forest" className="text-xs">{article.category}</Badge>
                    </div>
                    <h3 className="font-plex font-bold text-base text-ink group-hover:text-forest transition-colors line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-ink-muted text-sm font-naskh line-clamp-1 mt-0.5">{article.summary}</p>
                    <p className="text-ink-faint text-xs font-naskh mt-1">{article.author} · {article.readingTime} دقائق</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Books Results */}
      {matchedBooks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-plex font-bold text-xl text-ink">الكتب</h2>
            <span className="bg-navy/10 text-navy text-sm font-plex px-2.5 py-0.5 rounded-full">
              {matchedBooks.length}
            </span>
          </div>
          <div className="space-y-4">
            {matchedBooks.map(book => (
              <Link key={book.id} href={`/books/${book.slug}`} className="group block">
                <div className="flex gap-4 bg-white border border-stone rounded-lg p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                  <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden">
                    <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="book">كتاب</Badge>
                      <Badge variant="navy" className="text-xs">{book.category}</Badge>
                    </div>
                    <h3 className="font-plex font-bold text-base text-ink group-hover:text-navy transition-colors line-clamp-1">
                      {book.title}
                    </h3>
                    <p className="text-ink-muted text-sm font-naskh mt-0.5">{book.author} · {book.publishYear}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
