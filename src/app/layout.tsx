import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AccessibilityWidget from '@/components/ui/AccessibilityWidget'

export const metadata: Metadata = {
  title: {
    default: 'كتابنا — مقالات وكتب عربية',
    template: '%s | كتابنا',
  },
  description: 'موقع عربي متخصص في المقالات الثقافية والأدبية والكتب العربية المميزة',
  keywords: ['مقالات عربية', 'كتب عربية', 'ثقافة', 'أدب', 'قراءة'],
  authors: [{ name: 'كتابنا' }],
  creator: 'كتابنا',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_AR',
    siteName: 'كتابنا',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-cream text-ink font-naskh">
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  )
}
