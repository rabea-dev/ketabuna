'use client'

import { useState, useEffect, useRef } from 'react'

// Shown immediately while fetching — real Arabic headlines as placeholders
const FALLBACK = [
  'مرحباً بكم في كتابنا — موقع عربي للمقالات الثقافية والأدبية',
  'اكتشف أحدث المقالات من كتّاب فلسطينيين وعرب مميزين',
  'الكابري المهجرة — قرية الجنان والينابيع والأمجاد',
  'من ذاكرة لا تشيخ — قصص اللجوء والهوية والحق في العودة',
  'الثقافة العربية تراث إنساني عريق يستحق الحفاظ عليه',
]

const REFRESH_INTERVAL = 10 * 60 * 1000 // 10 minutes

export default function NewsBanner() {
  const [isPaused, setIsPaused] = useState(false)
  const [headlines, setHeadlines] = useState<string[]>(FALLBACK)
  const tickerRef = useRef<HTMLDivElement>(null)

  const fetchNews = () => {
    fetch('/api/news')
      .then(r => r.json())
      .then(data => {
        if (data.titles?.length > 0) {
          setHeadlines(data.titles)
        }
      })
      .catch(() => {
        // Keep current headlines on error — never go empty
      })
  }

  useEffect(() => {
    // Fetch immediately on mount
    fetchNews()

    // Then refresh every 10 minutes
    const interval = setInterval(fetchNews, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Triplicate for extra-long seamless loop
  const items = [...headlines, ...headlines, ...headlines]

  return (
    <div className="bg-gold border-b border-gold-dark/30 overflow-hidden">
      <div className="max-w-content mx-auto px-4">
        <div className="flex items-stretch h-10">

          {/* Label */}
          <div className="flex items-center gap-2 bg-gold-dark px-4 shrink-0 z-10">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-white font-naskh font-bold text-sm tracking-wide">
              أخبار
            </span>
          </div>

          {/* Thin divider */}
          <div className="w-px bg-gold-dark/40 shrink-0" />

          {/* Ticker — force LTR so the scroll direction works in RTL pages */}
          <div
            dir="ltr"
            className="flex-1 overflow-hidden relative flex items-center cursor-pointer"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Fade edges */}
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gold to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gold to-transparent z-10 pointer-events-none" />

            {/* Scrolling track */}
            <div
              ref={tickerRef}
              suppressHydrationWarning
              className={`flex items-center whitespace-nowrap ticker-track ${isPaused ? 'paused' : ''}`}
            >
              {items.map((item, i) => (
                <span key={i} className="inline-flex items-center shrink-0">
                  <span className="text-white font-naskh text-sm font-bold leading-none px-4">
                    {item}
                  </span>
                  <span className="text-white/40 text-base">◆</span>
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
