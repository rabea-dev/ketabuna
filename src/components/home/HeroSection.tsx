import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'

interface HeroSectionProps {
  article: Article
}

export default function HeroSection({ article }: HeroSectionProps) {
  return (
    <section className="bg-forest-dark overflow-hidden">
      <div className="max-w-content mx-auto px-4 py-14 md:py-20">
        {/* In RTL flex-row: first child → right side, second child → left side */}
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* ── RIGHT: Text content (first in DOM = right side in RTL) ── */}
          <div className="w-full md:w-7/12 text-white order-2 md:order-1">
            {/* Label */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-gold/50" />
              <span className="text-gold/80 text-xs font-naskh tracking-widest">
                المقال المميز
              </span>
            </div>

            {/* Title */}
            <h1 className="font-naskh font-bold text-3xl md:text-4xl lg:text-[2.6rem] text-white leading-loose mb-5">
              {article.title}
            </h1>

            {/* Gold divider */}
            <div className="h-0.5 w-16 bg-gold mb-5" />

            {/* Summary */}
            <p className="text-white/75 font-naskh text-lg leading-relaxed mb-7 line-clamp-4">
              {article.summary}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-5 mb-8 text-white/50 text-sm font-naskh">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {article.author}
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.publishedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="w-px h-4 bg-white/20" />
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readingTime} دقائق قراءة
              </span>
            </div>

            {/* Category + CTA */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="bg-gold/20 text-gold text-sm font-naskh px-3 py-1 rounded-full border border-gold/30">
                {article.category}
              </span>
              <Link
                href={`/articles/${article.slug}`}
                className="inline-flex items-center gap-2.5 bg-gold hover:bg-gold-light text-white font-naskh font-semibold px-7 py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                اقرأ المقال
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── LEFT: Framed image (second in DOM = left side in RTL) ── */}
          <div className="w-full md:w-5/12 flex-shrink-0 order-1 md:order-2">
            <div className="relative">
              {/* Decorative offset frames */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-gold/40"
                style={{ transform: 'translate(-12px, 12px)' }}
              />
              <div
                className="absolute inset-0 rounded-2xl border border-gold/20"
                style={{ transform: 'translate(-6px, 6px)' }}
              />

              {/* Main image card */}
              <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.7)] border border-white/10">
                {/* Fixed-height image container */}
                <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                  {/* Bottom fade */}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />

                  {/* Caption */}
                  {article.imageCaption && (
                    <p className="absolute bottom-3 inset-x-4 text-white/70 text-xs font-naskh leading-tight line-clamp-1 z-10">
                      {article.imageCaption}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
