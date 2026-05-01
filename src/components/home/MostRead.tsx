import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'

interface MostReadProps {
  articles: Article[]
}

export default function MostRead({ articles }: MostReadProps) {
  return (
    <aside className="bg-white border border-stone rounded-xl p-6">
      <h3 className="font-plex font-bold text-lg text-ink mb-1">الأكثر قراءة</h3>
      <div className="h-0.5 w-12 bg-gold mb-5" />

      <ol className="space-y-5">
        {articles.map((article, index) => (
          <li key={article.id}>
            <Link href={`/articles/${article.slug}`} className="flex gap-3 group">
              {/* Number */}
              <span className="font-plex font-bold text-2xl text-stone-dark leading-none pt-1 w-7 shrink-0">
                {index + 1}
              </span>

              <div className="flex-1 min-w-0">
                <h4 className="font-plex font-semibold text-sm text-ink group-hover:text-forest transition-colors line-clamp-2 leading-snug mb-1">
                  {article.title}
                </h4>
                <p className="text-ink-faint text-xs font-naskh">
                  {article.author} · {article.readingTime} دقائق
                </p>
              </div>

              {/* Thumb */}
              <div className="relative w-14 h-12 shrink-0 rounded-md overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </Link>

            {index < articles.length - 1 && (
              <div className="mt-5 border-b border-stone/60" />
            )}
          </li>
        ))}
      </ol>

      <div className="mt-6 pt-4 border-t border-stone">
        <Link
          href="/articles"
          className="block text-center text-forest font-naskh text-sm hover:text-forest-light transition-colors"
        >
          عرض جميع المقالات ←
        </Link>
      </div>
    </aside>
  )
}
