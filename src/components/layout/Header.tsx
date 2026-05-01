'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import MobileMenu from './MobileMenu'
import SearchBar from '@/components/ui/SearchBar'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/articles', label: 'المقالات' },
  { href: '/writers', label: 'الكتّاب' },
  { href: '/depopulated-villages', label: 'قرى مهجّرة' },
  { href: '/books', label: 'الكتب' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-30 bg-cream border-b transition-shadow duration-200 ${
          isScrolled ? 'shadow-md border-stone' : 'border-transparent'
        }`}
      >
        {/* Gold top border */}
        <div className="h-1 bg-gold w-full" />

        <div className="max-w-content mx-auto px-4">
          {/* Main header row */}
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="shrink-0 group" aria-label="كتابنا — الرئيسية">
              <div className="flex flex-col leading-none gap-1">
                {/* Arabic wordmark with tashkeel */}
                <span className="font-naskh font-bold text-[2rem] leading-none text-forest group-hover:text-forest-light transition-colors duration-200 tracking-tight">
                  كِتَابُنَا
                </span>
                {/* Gold rule + diamond */}
                <span className="flex items-center gap-1.5">
                  <span className="flex-1 h-px bg-gold/70" />
                  <span
                    className="w-2 h-2 bg-gold shrink-0"
                    style={{ transform: 'rotate(45deg)' }}
                    aria-hidden="true"
                  />
                </span>
                {/* Latin lockup */}
                <span className="font-naskh text-[0.65rem] tracking-[0.28em] text-ink-muted uppercase leading-none">
                  KETABUNA
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-ink-light font-naskh text-sm hover:text-forest hover:bg-forest/5 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg text-ink-muted hover:text-forest hover:bg-forest/5 transition-colors"
                aria-label="بحث"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Admin link - desktop */}
              <Link
                href="/admin"
                className="hidden md:flex items-center gap-1 text-xs text-ink-muted border border-stone rounded-lg px-3 py-1.5 hover:border-forest/30 hover:text-forest transition-colors font-naskh"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                إدارة
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg text-ink-muted hover:text-forest hover:bg-forest/5 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="فتح القائمة"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search bar - expands below header */}
          {isSearchOpen && (
            <div className="pb-3 border-t border-stone/50 pt-3">
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          )}
        </div>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}
