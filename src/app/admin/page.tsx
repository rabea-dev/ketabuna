import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { getPublishedArticles } from '@/data/articles'
import { getPublishedBooks } from '@/data/books'

export default function AdminDashboard() {
  const articles = getPublishedArticles()
  const books = getPublishedBooks()
  const drafts = 0 // placeholder

  const cards = [
    {
      title: 'إضافة مقال جديد',
      desc: 'كتابة ونشر مقال جديد',
      href: '/admin/articles/new',
      color: 'bg-forest',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'إضافة كتاب جديد',
      desc: 'رفع كتاب للمكتبة',
      href: '/admin/books/new',
      color: 'bg-navy',
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      title: 'المقالات',
      desc: `${articles.length} مقال منشور`,
      href: '/admin/articles',
      color: 'bg-white border border-stone',
      textColor: 'text-forest',
      icon: (
        <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: 'الكتب',
      desc: `${books.length} كتاب منشور`,
      href: '/admin/books',
      color: 'bg-white border border-stone',
      textColor: 'text-navy',
      icon: (
        <svg className="w-7 h-7 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      title: 'إدارة القرى المهجرة',
      desc: 'أرشيف القرى الفلسطينية',
      href: '/admin/depopulated-villages',
      color: 'bg-white border border-stone',
      textColor: 'text-forest',
      icon: (
        <svg className="w-7 h-7 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      title: 'المسودات',
      desc: `${drafts} مسودة`,
      href: '/admin/articles',
      color: 'bg-white border border-stone',
      textColor: 'text-gold-dark',
      icon: (
        <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      title: 'الإعدادات',
      desc: 'إعدادات الموقع',
      href: '/admin',
      color: 'bg-white border border-stone',
      textColor: 'text-ink-muted',
      icon: (
        <svg className="w-7 h-7 text-ink-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-plex font-bold text-3xl text-ink mb-1">مرحباً بك في لوحة الإدارة</h1>
        <p className="text-ink-muted font-naskh">إدارة محتوى موقع كتابنا</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {cards.map(card => (
          <Link key={card.title} href={card.href}>
            <div className={`${card.color} rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer`}>
              <div className={`mb-3 ${card.color.includes('bg-white') ? '' : 'text-white'}`}>
                {card.icon}
              </div>
              <h2 className={`font-plex font-bold text-lg mb-1 ${card.color.includes('bg-white') ? card.textColor || 'text-ink' : 'text-white'}`}>
                {card.title}
              </h2>
              <p className={`font-naskh text-sm ${card.color.includes('bg-white') ? 'text-ink-muted' : 'text-white/70'}`}>
                {card.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white border border-stone rounded-xl p-6">
        <h2 className="font-plex font-bold text-lg text-ink mb-5">آخر النشاطات</h2>
        <div className="space-y-4">
          {[...articles.slice(0, 3).map(a => ({ type: 'مقال', title: a.title, date: a.publishedAt, color: 'bg-forest/10 text-forest' })),
            ...books.slice(0, 2).map(b => ({ type: 'كتاب', title: b.title, date: b.publishYear.toString(), color: 'bg-navy/10 text-navy' }))
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-stone last:border-0">
              <span className={`text-xs font-plex font-semibold px-2 py-0.5 rounded-sm ${item.color}`}>
                {item.type}
              </span>
              <span className="font-naskh text-ink flex-1 line-clamp-1 text-sm">{item.title}</span>
              <span className="text-ink-faint text-xs font-naskh">{item.date}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
