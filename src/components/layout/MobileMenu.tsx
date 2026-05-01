'use client'

import Link from 'next/link'
import { useEffect } from 'react'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/articles', label: 'المقالات' },
  { href: '/writers', label: 'الكتّاب' },
  { href: '/books', label: 'الكتب' },
  { href: '/about', label: 'من نحن' },
  { href: '/contact', label: 'تواصل معنا' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone">
          <div>
            <span className="font-naskh font-bold text-xl text-forest">كِتَابُنَا</span>
            <p className="text-ink-muted text-xs font-naskh">مقالات وكتب</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-stone/50 transition-colors text-ink-muted"
            aria-label="إغلاق القائمة"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5">
          <ul className="space-y-1">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-ink font-naskh hover:bg-forest/5 hover:text-forest transition-colors text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 pt-6 border-t border-stone">
            <Link
              href="/search"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-ink-muted font-naskh hover:bg-forest/5 hover:text-forest transition-colors text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              البحث
            </Link>
            <Link
              href="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-ink-muted font-naskh hover:bg-forest/5 hover:text-forest transition-colors text-base"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              لوحة الإدارة
            </Link>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-stone">
          <p className="text-ink-faint text-xs font-naskh text-center">
            © 2024 كتابنا — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </>
  )
}
