import { Metadata } from 'next'
import BookCard from '@/components/books/BookCard'
import { getPublishedBooks } from '@/data/books'

export const metadata: Metadata = {
  title: 'الكتب',
  description: 'مكتبة كتابنا العربية — كتب منتقاة في الأدب والتاريخ والفلسفة',
}

const allCategories = ['الكل', 'رواية عربية', 'تراث وأدب شعبي', 'فلسفة وتاريخ', 'شعر وفلسفة', 'تاريخ إسلامي', 'سيرة ذاتية']

export default function BooksPage() {
  const books = getPublishedBooks()

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="font-plex font-bold text-3xl text-ink mb-2">المكتبة العربية</h1>
        <div className="h-0.5 w-16 bg-gold mb-4" />
        <p className="text-ink-muted font-naskh text-lg">
          كتب عربية مختارة في الأدب والتاريخ والفلسفة، بعضها متاح للتحميل المجاني.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-stone">
        {[
          { label: 'كتاب متاح', value: books.length },
          { label: 'للتحميل مجاناً', value: books.filter(b => b.downloadAllowed).length },
          { label: 'تصنيف', value: allCategories.length - 1 },
        ].map(stat => (
          <div key={stat.label} className="text-center bg-white border border-stone rounded-lg p-4">
            <p className="font-plex font-bold text-2xl text-forest">{stat.value}</p>
            <p className="text-ink-muted text-sm font-naskh">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map(cat => (
          <button
            key={cat}
            className={`px-4 py-1.5 rounded-full text-sm font-naskh transition-colors ${
              cat === 'الكل'
                ? 'bg-navy text-white'
                : 'bg-stone text-ink-muted hover:bg-navy/10 hover:text-navy'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <div className="text-center py-20">
          <p className="text-ink-muted font-naskh text-xl">لا توجد كتب منشورة حالياً</p>
        </div>
      )}
    </div>
  )
}
