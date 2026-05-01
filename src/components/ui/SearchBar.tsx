'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  className?: string
  onClose?: () => void
}

export default function SearchBar({ placeholder = 'ابحث عن مقالات وكتب...', className = '', onClose }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      if (onClose) onClose()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="w-full bg-white border border-stone rounded-lg py-2.5 pr-10 pl-4 text-ink placeholder:text-ink-faint focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest font-naskh text-base"
        />
      </div>
      <button
        type="submit"
        className="bg-forest text-white px-4 py-2.5 rounded-lg font-plex font-medium hover:bg-forest-light transition-colors text-sm"
      >
        بحث
      </button>
    </form>
  )
}
