'use client'

import { useState, useEffect } from 'react'

interface AudioPlayerProps {
  text: string
}

export default function AudioPlayer({ text }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsSupported('speechSynthesis' in window)
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [])

  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  const play = () => {
    if (!isSupported) return

    if (isPaused) {
      window.speechSynthesis.resume()
      setIsPaused(false)
      setIsPlaying(true)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = 'ar-SA'
    utterance.rate = 0.85
    utterance.pitch = 1

    // Wait for voices to load
    const trySetVoice = () => {
      const voices = window.speechSynthesis.getVoices()
      const arabicVoice = voices.find(v => v.lang.startsWith('ar'))
      if (arabicVoice) utterance.voice = arabicVoice
    }
    trySetVoice()
    window.speechSynthesis.onvoiceschanged = trySetVoice

    utterance.onstart = () => { setIsPlaying(true); setIsPaused(false) }
    utterance.onend = () => { setIsPlaying(false); setIsPaused(false); setProgress(0) }
    utterance.onerror = () => { setIsPlaying(false); setIsPaused(false) }
    utterance.onboundary = (e) => {
      if (e.name === 'word' && cleanText.length > 0) {
        setProgress(Math.round((e.charIndex / cleanText.length) * 100))
      }
    }

    window.speechSynthesis.speak(utterance)
  }

  const pause = () => {
    window.speechSynthesis.pause()
    setIsPlaying(false)
    setIsPaused(true)
  }

  const stop = () => {
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
    setProgress(0)
  }

  if (!isSupported) return null

  return (
    <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 mb-8">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0A7.975 7.975 0 0120 12m-2.343 5.657A7.975 7.975 0 0112 20m0 0a7.975 7.975 0 01-5.657-2.343m0 0A7.975 7.975 0 014 12m2.343-5.657A7.975 7.975 0 0112 4" />
          </svg>
        </div>

        {/* Info + progress */}
        <div className="flex-1 min-w-0">
          <p className="font-naskh text-forest text-sm font-semibold">استمع إلى المقال</p>
          <p className="font-naskh text-ink-muted text-xs">
            {isPlaying ? 'جارٍ القراءة...' : isPaused ? 'متوقف مؤقتاً — اضغط للمتابعة' : 'اضغط للاستماع بالعربية'}
          </p>
          {(isPlaying || isPaused) && (
            <div className="mt-2 h-1 bg-forest/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {!isPlaying ? (
            <button
              onClick={play}
              className="flex items-center gap-1.5 bg-forest text-white font-naskh text-sm px-4 py-2 rounded-lg hover:bg-forest-light transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              {isPaused ? 'متابعة' : 'استمع'}
            </button>
          ) : (
            <button
              onClick={pause}
              className="flex items-center gap-1.5 bg-forest/20 text-forest font-naskh text-sm px-4 py-2 rounded-lg hover:bg-forest/30 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
              إيقاف مؤقت
            </button>
          )}
          {(isPlaying || isPaused) && (
            <button
              onClick={stop}
              className="p-2 rounded-lg text-ink-muted hover:text-forest hover:bg-forest/10 transition-colors"
              title="إيقاف"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
