import Link from 'next/link'
import { Book } from '@/types/book'
import BookCard from '@/components/books/BookCard'

interface FeaturedBooksProps {
  books: Book[]
}

export default function FeaturedBooks({ books }: FeaturedBooksProps) {
  return (
    <section className="py-12 bg-cream-dark rounded-xl px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-plex font-bold text-2xl text-ink">الكتب المميزة</h2>
          <div className="h-0.5 w-16 bg-gold mt-2" />
        </div>
        <Link
          href="/books"
          className="text-navy font-naskh text-sm hover:text-navy-light transition-colors flex items-center gap-1"
        >
          كل الكتب
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
