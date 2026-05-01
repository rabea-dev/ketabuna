'use client'

import { useState, useEffect } from 'react'

interface A11ySettings {
  fontSize: 'normal' | 'large' | 'xlarge'
  highContrast: boolean
  reduceMotion: boolean
  dyslexiaFont: boolean
}

const DEFAULT: A11ySettings = {
  fontSize: 'normal',
  highContrast: false,
  reduceMotion: false,
  dyslexiaFont: false,
}

function applySettings(s: A11ySettings) {
  const html = document.documentElement
  html.classList.remove('a11y-large', 'a11y-xlarge')
  if (s.fontSize === 'large') html.classList.add('a11y-large')
  if (s.fontSize === 'xlarge') html.classList.add('a11y-xlarge')
  html.classList.toggle('a11y-contrast', s.highContrast)
  html.classList.toggle('a11y-no-motion', s.reduceMotion)
  html.classList.toggle('a11y-dyslexia', s.dyslexiaFont)
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('a11y')
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        applySettings(parsed)
      }
    } catch {}
  }, [])

  const update = (patch: Partial<A11ySettings>) => {
    const next = { ...settings, ...patch }
    setSettings(next)
    applySettings(next)
    localStorage.setItem('a11y', JSON.stringify(next))
  }

  const reset = () => {
    setSettings(DEFAULT)
    applySettings(DEFAULT)
    localStorage.removeItem('a11y')
  }

  const isActive = settings.highContrast || settings.reduceMotion ||
    settings.dyslexiaFont || settings.fontSize !== 'normal'

  if (!mounted) return null

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-forest"
        style={{ background: isActive ? '#C9A84C' : '#165337' }}
        aria-label="إعدادات إمكانية الوصول"
        title="إمكانية الوصول"
      >
        {/* Universal accessibility icon */}
        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 5h2l1 4 3-1 .5 2-3.5 1v4l1 4h-2l-1-3.5L11 18H9l1-4v-4l-3.5-1L7 7l3 1 1-4z"/>
        </svg>
        {isActive && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full border-2 border-white" />
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-6 z-50 bg-white border border-stone rounded-2xl shadow-2xl p-5 w-72"
          role="dialog"
          aria-label="لوحة إمكانية الوصول"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-forest/10 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-forest" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 5h2l1 4 3-1 .5 2-3.5 1v4l1 4h-2l-1-3.5L11 18H9l1-4v-4l-3.5-1L7 7l3 1 1-4z"/>
                </svg>
              </div>
              <h3 className="font-naskh font-bold text-ink text-base">إمكانية الوصول</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-ink-muted hover:text-ink hover:bg-stone transition-colors"
              aria-label="إغلاق"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-4">
            <p className="font-naskh text-xs text-ink-muted mb-2 uppercase tracking-wider">حجم الخط</p>
            <div className="flex gap-2">
              {([
                { val: 'normal', label: 'أ', size: 'text-sm', tip: 'عادي' },
                { val: 'large',  label: 'أ', size: 'text-base', tip: 'كبير' },
                { val: 'xlarge', label: 'أ', size: 'text-xl', tip: 'أكبر' },
              ] as const).map(opt => (
                <button
                  key={opt.val}
                  onClick={() => update({ fontSize: opt.val })}
                  title={opt.tip}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all ${opt.size} ${
                    settings.fontSize === opt.val
                      ? 'bg-forest text-white shadow-md'
                      : 'bg-stone text-ink hover:bg-forest/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1 px-1">
              <span className="text-xs text-ink-faint font-naskh">عادي</span>
              <span className="text-xs text-ink-faint font-naskh">كبير</span>
              <span className="text-xs text-ink-faint font-naskh">أكبر</span>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-1 border-t border-stone pt-3">
            {([
              {
                key: 'highContrast',
                label: 'تباين عالٍ',
                desc: 'ألوان أوضح للنصوص',
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13l-.87.5M4.21 16.5l-.87.5M20.66 16.5l-.87-.5M4.21 7.5l-.87-.5M21 12h-1M4 12H3m15.36-6.36l-.7.7M6.34 17.66l-.7.7M17.66 17.66l-.7-.7M6.34 6.34l-.7-.7" />
                  </svg>
                ),
              },
              {
                key: 'reduceMotion',
                label: 'تقليل الحركة',
                desc: 'إيقاف التحريكات',
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                key: 'dyslexiaFont',
                label: 'خط القراءة السهل',
                desc: 'خط أوضح للقراءة',
                icon: (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                ),
              },
            ] as const).map(item => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2.5 px-1 rounded-xl hover:bg-stone/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className={settings[item.key] ? 'text-forest' : 'text-ink-muted'}>
                    {item.icon}
                  </span>
                  <div>
                    <p className="font-naskh text-sm text-ink font-medium leading-none mb-0.5">{item.label}</p>
                    <p className="font-naskh text-xs text-ink-faint">{item.desc}</p>
                  </div>
                </div>
                {/* Toggle switch */}
                <button
                  role="switch"
                  aria-checked={settings[item.key]}
                  onClick={() => update({ [item.key]: !settings[item.key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    settings[item.key] ? 'bg-forest' : 'bg-stone-dark'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                      settings[item.key] ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Reset */}
          {isActive && (
            <button
              onClick={reset}
              className="w-full mt-3 py-2 text-sm font-naskh text-ink-muted hover:text-forest border border-stone rounded-xl transition-colors hover:border-forest/30"
            >
              ↺ إعادة الضبط الافتراضي
            </button>
          )}

          <p className="text-center text-ink-faint text-xs font-naskh mt-3">
            تُحفظ الإعدادات تلقائياً
          </p>
        </div>
      )}
    </>
  )
}
