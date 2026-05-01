import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getBookBySlug, getPublishedBooks, getRelatedBooks } from '@/data/books'
import RelatedBooks from '@/components/books/RelatedBooks'
import Badge from '@/components/ui/Badge'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const books = getPublishedBooks()
  return books.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const book = getBookBySlug(params.slug)
  if (!book) return {}
  return {
    title: book.title,
    description: book.summary,
  }
}

export default function BookPage({ params }: PageProps) {
  const book = getBookBySlug(params.slug)
  if (!book || book.status !== 'published') notFound()

  const related = getRelatedBooks(book)

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-content mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-naskh text-ink-muted mb-8">
          <Link href="/" className="hover:text-forest transition-colors">الرئيسية</Link>
          <span>/</span>
          <Link href="/books" className="hover:text-forest transition-colors">الكتب</Link>
          <span>/</span>
          <span className="text-ink">{book.title}</span>
        </nav>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Cover Image */}
          <div className="md:col-span-1">
            <div className="relative rounded-xl overflow-hidden shadow-xl" style={{ aspectRatio: '2/3' }}>
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <div className="mb-3">
              <Badge variant="navy">{book.category}</Badge>
            </div>

            <h1 className="font-plex font-bold text-3xl md:text-4xl text-ink mb-3">
              {book.title}
            </h1>
            <p className="text-ink-muted font-naskh text-xl mb-6">{book.author}</p>

            <p className="text-ink-light font-naskh text-base leading-loose mb-8">
              {book.summary}
            </p>

            {/* Book Info Table */}
            <div className="bg-white border border-stone rounded-xl overflow-hidden mb-8">
              <table className="w-full text-sm">
                <tbody>
                  {[
                    { label: 'المؤلف', value: book.author },
                    { label: 'سنة النشر', value: book.publishYear },
                    { label: 'عدد الصفحات', value: `${book.pageCount} صفحة` },
                    { label: 'اللغة', value: book.language },
                    { label: 'التصنيف', value: book.category },
                    { label: 'التحميل', value: book.downloadAllowed ? 'مجاني' : 'غير متاح' },
                  ].map((row, i) => (
                    <tr key={row.label} className={i % 2 === 0 ? 'bg-stone/20' : 'bg-white'}>
                      <td className="px-4 py-3 font-naskh text-ink-muted font-medium w-32">{row.label}</td>
                      <td className="px-4 py-3 font-naskh text-ink">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {book.onlineReadUrl && (
                <Link
                  href={book.onlineReadUrl}
                  className="flex items-center gap-2 bg-forest text-white font-plex font-semibold px-6 py-3 rounded-lg hover:bg-forest-light transition-all hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  قراءة أونلاين
                </Link>
              )}
              {book.downloadAllowed && book.pdfUrl && (
                <Link
                  href={book.pdfUrl}
                  className="flex items-center gap-2 bg-navy text-white font-plex font-semibold px-6 py-3 rounded-lg hover:bg-navy-light transition-all hover:shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  تحميل PDF مجاناً
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Copyright Notice */}
        <div className="bg-gold-pale border border-gold/30 rounded-xl p-5 mb-10">
          <h3 className="font-plex font-semibold text-gold-dark text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ملاحظة حقوق النشر
          </h3>
          <p className="text-ink-muted text-sm font-naskh leading-relaxed">
            {book.downloadAllowed
              ? 'هذا الكتاب متاح للتحميل والقراءة المجانية. يُرجى الإشارة إلى المصدر عند الاقتباس.'
              : 'هذا الكتاب محمي بحقوق الطبع والنشر. القراءة الأونلاين للأغراض الشخصية والتعليمية فقط. لا يُسمح بالتوزيع أو إعادة النشر بدون إذن.'}
          </p>
        </div>

        {/* Related Books */}
        <RelatedBooks books={related} />
      </div>
    </div>
  )
}
