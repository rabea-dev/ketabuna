'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { isAdminAuthenticated, clearAdminAuth } from '@/lib/auth'

const sidebarLinks = [
  {
    href: '/admin',
    label: 'لوحة التحكم',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/articles',
    label: 'المقالات',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/admin/articles/new',
    label: 'إضافة مقال',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    href: '/admin/books',
    label: 'الكتب',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/admin/books/new',
    label: 'إضافة كتاب',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  // Guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace('/admin/login')
    } else {
      setChecked(true)
    }
  }, [router])

  function handleLogout() {
    clearAdminAuth()
    router.push('/admin/login')
  }

  // Show nothing while checking auth (prevents flash of content)
  if (!checked) return null

  return (
    <div className="min-h-screen bg-cream-dark flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-64 bg-forest-dark text-white flex flex-col shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="flex flex-col leading-none gap-0.5 mb-1">
            <span className="font-naskh font-bold text-xl text-white tracking-tight">كِتَابُنَا</span>
            <span className="flex items-center gap-1">
              <span className="flex-1 h-px bg-gold/50" />
              <span className="w-1 h-1 bg-gold shrink-0" style={{ transform: 'rotate(45deg)' }} />
            </span>
          </Link>
          <p className="text-white/40 text-xs font-naskh mt-2">لوحة الإدارة</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarLinks.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-naskh',
                    pathname === link.href
                      ? 'bg-white/15 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-naskh transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            العودة للموقع
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-naskh transition-colors px-2 py-1.5 rounded-lg hover:bg-red-500/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {title && (
          <header className="bg-white border-b border-stone px-8 py-5 flex items-center justify-between">
            <h1 className="font-naskh font-bold text-2xl text-ink">{title}</h1>
            <span className="text-ink-muted text-sm font-naskh">salahdabaja</span>
          </header>
        )}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
