'use client'

import { useState } from 'react'
import { Article } from '@/types/article'

interface ArticleContentProps {
  article: Article
}

const languages = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'he', label: 'עברית' },
  { code: 'fr', label: 'Français' },
  { code: 'tr', label: 'Türkçe' },
]

export default function ArticleContent({ article }: ArticleContentProps) {
  const [selectedLang, setSelectedLang] = useState('ar')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  const handleTranslate = () => {
    if (selectedLang === 'ar') return
    setIsTranslating(true)
    setTimeout(() => setIsTranslating(false), 1500)
  }

  return (
    <div>
      {/* Article Body */}
      <div
        className="article-body"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Key Points Box */}
      {article.keyPoints && article.keyPoints.length > 0 && (
        <div className="my-8 border-r-4 border-forest bg-forest/5 rounded-lg p-6">
          <h3 className="font-plex font-bold text-lg text-forest mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            أهم النقاط
          </h3>
          <ul className="space-y-3">
            {article.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 font-naskh text-ink-light text-base leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-forest text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Box */}
      <div className="my-8 border border-gold/30 bg-gold-pale rounded-lg p-6">
        <h3 className="font-plex font-bold text-base text-gold-dark mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          ملخص المقال
        </h3>
        <p className="font-naskh text-ink-light leading-loose text-base">
          {article.summary}
        </p>
      </div>

      {/* Sources */}
      {article.sources && article.sources.length > 0 && (
        <div className="my-8 pt-6 border-t border-stone">
          <h3 className="font-plex font-semibold text-base text-ink mb-3">المصادر والمراجع</h3>
          <ul className="space-y-1.5">
            {article.sources.map((source, i) => (
              <li key={i} className="flex items-start gap-2 font-naskh text-ink-muted text-sm">
                <span className="text-gold mt-0.5">◆</span>
                {source}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Translation Section */}
      <div className="my-8 p-5 bg-navy/5 border border-navy/10 rounded-lg">
        <h3 className="font-plex font-semibold text-base text-navy mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          ترجمة المقال
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-2 bg-white border border-stone rounded-lg px-4 py-2 text-sm font-naskh text-ink hover:border-navy/30 transition-colors"
            >
              {languages.find(l => l.code === selectedLang)?.label}
              <svg className="w-4 h-4 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showLangDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-stone rounded-lg shadow-lg z-10 min-w-[140px]">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLang(lang.code); setShowLangDropdown(false) }}
                    className={`w-full text-right px-4 py-2 text-sm font-naskh hover:bg-stone/50 transition-colors ${selectedLang === lang.code ? 'text-navy font-semibold' : 'text-ink'}`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleTranslate}
            disabled={selectedLang === 'ar' || isTranslating}
            className="bg-navy text-white font-plex font-medium text-sm px-5 py-2 rounded-lg hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isTranslating ? 'جارٍ الترجمة...' : 'ترجمة المقال'}
          </button>
          {selectedLang === 'ar' && (
            <p className="text-ink-muted text-xs font-naskh">اختر لغة أخرى للترجمة</p>
          )}
        </div>
      </div>
    </div>
  )
}
