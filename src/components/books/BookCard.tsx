import Link from 'next/link'
import Image from 'next/image'
import { Book } from '@/types/book'
import Badge from '@/components/ui/Badge'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <div className="group bg-white border border-stone rounded-lg overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
      {/* Cover */}
      <Link href={`/books/${book.slug}`} className="block relative overflow-hidden bg-stone-light" style={{ aspectRatio: '2/3' }}>
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge variant="navy">{book.category}</Badge>
        </div>
        {book.downloadAllowed && (
          <div className="absolute bottom-3 left-3">
            <span className="bg-gold text-white text-xs font-plex font-semibold px-2 py-0.5 rounded-sm">
              تحميل مجاني
            </span>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/books/${book.slug}`}>
          <h3 className="font-plex font-bold text-base text-ink group-hover:text-navy transition-colors line-clamp-2 leading-snug mb-1">
            {book.title}
          </h3>
        </Link>
        <p className="text-ink-muted text-sm font-naskh mb-2">{book.author}</p>
        <p className="text-ink-muted font-naskh text-xs line-clamp-2 leading-relaxed flex-1 mb-4">
          {book.summary}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            href={`/books/${book.slug}`}
            className="flex-1 text-center bg-forest/10 text-forest hover:bg-forest hover:text-white font-plex font-medium text-sm py-2 rounded-lg transition-colors"
          >
            قراءة المزيد
          </Link>
          {book.downloadAllowed && (
            <Link
              href={`/books/${book.slug}`}
              className="flex-1 text-center bg-navy/10 text-navy hover:bg-navy hover:text-white font-plex font-medium text-sm py-2 rounded-lg transition-colors"
            >
              تحميل
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
