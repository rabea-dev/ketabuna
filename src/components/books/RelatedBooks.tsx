import { Book } from '@/types/book'
import BookCard from './BookCard'

interface RelatedBooksProps {
  books: Book[]
}

export default function RelatedBooks({ books }: RelatedBooksProps) {
  if (books.length === 0) return null

  return (
    <section className="py-10 border-t border-stone">
      <h2 className="font-plex font-bold text-xl text-ink mb-2">كتب ذات صلة</h2>
      <div className="h-0.5 w-12 bg-gold mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {books.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  )
}
