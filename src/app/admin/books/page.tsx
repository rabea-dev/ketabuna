import Link from 'next/link'
import Image from 'next/image'
import AdminLayout from '@/components/admin/AdminLayout'
import { books } from '@/data/books'
import Badge from '@/components/ui/Badge'

export default function AdminBooksPage() {
  return (
    <AdminLayout title="إدارة الكتب">
      <div className="flex justify-between items-center mb-6">
        <p className="text-ink-muted font-naskh">{books.length} كتاب إجمالاً</p>
        <Link
          href="/admin/books/new"
          className="bg-navy text-white font-plex font-medium px-4 py-2 rounded-lg hover:bg-navy-light transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          كتاب جديد
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {books.map(book => (
          <div key={book.id} className="bg-white border border-stone rounded-xl p-4 flex gap-4 items-center hover:shadow-sm transition-shadow">
            <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden">
              <Image src={book.coverImage} alt={book.title} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-plex font-bold text-sm text-ink line-clamp-1 mb-0.5">{book.title}</h3>
              <p className="text-ink-muted font-naskh text-xs mb-2">{book.author} · {book.publishYear}</p>
              <div className="flex items-center gap-2">
                <Badge variant="navy" className="text-xs">{book.category}</Badge>
                <span className={`text-xs font-plex font-medium px-2 py-0.5 rounded-full ${
                  book.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {book.status === 'published' ? 'منشور' : 'مسودة'}
                </span>
                {book.downloadAllowed && (
                  <span className="text-xs font-plex font-medium px-2 py-0.5 rounded-full bg-gold/10 text-gold-dark">
                    تحميل مجاني
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/books/${book.slug}`}
                className="text-xs text-navy hover:underline font-naskh"
                target="_blank"
              >
                عرض
              </Link>
              <Link
                href="/admin/books/new"
                className="text-xs text-forest hover:underline font-naskh"
              >
                تعديل
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  )
}
