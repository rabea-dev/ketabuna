import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-forest-dark text-white">
      {/* Gold separator */}
      <div className="h-0.5 bg-gold/40 w-full" />

      <div className="max-w-content mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            {/* Footer logo — white variant */}
            <div className="mb-5 inline-flex flex-col leading-none gap-0.5">
              <span className="font-naskh font-bold text-[1.55rem] leading-none text-white tracking-tight">
                كِتَابُنَا
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex-1 h-px bg-gold/60" />
                <span
                  className="w-1.5 h-1.5 bg-gold shrink-0"
                  style={{ transform: 'rotate(45deg)' }}
                  aria-hidden="true"
                />
              </span>
              <span className="font-naskh text-[0.6rem] tracking-[0.25em] text-white/55 uppercase leading-none">
                KETABUNA
              </span>
            </div>
            {/* Tagline */}
            <p className="text-white/60 text-xs font-naskh mb-4">مقالات وكتب</p>
            <p className="text-white/70 text-sm font-naskh leading-relaxed">
              منصة عربية متخصصة في المقالات الثقافية والأدبية والكتب العربية المتميزة. نحن نؤمن بأن القراءة طريق إلى عالم أفضل.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-naskh font-semibold text-gold mb-5 text-sm uppercase tracking-wider">
              روابط سريعة
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/articles', label: 'المقالات' },
                { href: '/writers', label: 'الكتّاب' },
                { href: '/depopulated-villages', label: 'قرى مهجّرة' },
                { href: '/books', label: 'الكتب' },
                { href: '/search', label: 'البحث' },
                { href: '/about', label: 'من نحن' },
                { href: '/contact', label: 'تواصل معنا' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors font-naskh text-sm flex items-center gap-2"
                  >
                    <span className="text-gold/50">◂</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-naskh font-semibold text-gold mb-5 text-sm uppercase tracking-wider">
              قانوني
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: '/privacy', label: 'سياسة الخصوصية' },
                { href: '/terms', label: 'شروط الاستخدام' },
                { href: '/copyright', label: 'حقوق النشر' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors font-naskh text-sm flex items-center gap-2"
                  >
                    <span className="text-gold/50">◂</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-naskh font-semibold text-gold mb-5 text-sm uppercase tracking-wider">
              تواصل معنا
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm font-naskh">
                <svg className="w-4 h-4 text-gold/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@ketabuna.com
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm font-naskh">
                <svg className="w-4 h-4 text-gold/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                القاهرة، مصر
              </li>
            </ul>

            <div className="mt-6">
              <p className="text-white/50 text-xs font-naskh mb-3">تابعنا على</p>
              <div className="flex gap-3">
                {['X', 'FB', 'IG'].map(s => (
                  <button key={s} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold hover:text-gold transition-colors text-xs font-bold">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-content mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/40 text-xs font-naskh">
            © {new Date().getFullYear()} كتابنا — جميع الحقوق محفوظة
          </p>
          <p className="text-white/30 text-xs font-naskh">
            صُنع بـ ❤ للقارئ العربي
          </p>
        </div>
      </div>
    </footer>
  )
}
