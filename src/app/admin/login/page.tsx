'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { setAdminAuth } from '@/lib/auth'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setTimeout(() => {
      setLoading(false)
      if (form.username === 'salahdabaja' && form.password === 'dabaja') {
        setAdminAuth()
        router.push('/admin')
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة')
      }
    }, 800)
  }

  return (
    <div className="min-h-screen bg-forest-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="flex flex-col items-center leading-none gap-0.5">
              <span className="font-naskh font-bold text-[2rem] leading-none text-white tracking-tight">
                كِتَابُنَا
              </span>
              <span className="flex items-center gap-1.5 w-full">
                <span className="flex-1 h-px bg-gold/60" />
                <span className="w-1.5 h-1.5 bg-gold shrink-0" style={{ transform: 'rotate(45deg)' }} />
              </span>
              <span className="font-naskh text-[0.6rem] tracking-[0.25em] text-white/40 uppercase leading-none">
                KETABUNA
              </span>
            </div>
          </Link>
          <p className="text-white/50 font-naskh mt-4 text-sm">لوحة الإدارة</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border border-stone p-8">
          <h1 className="font-naskh font-bold text-2xl text-ink text-center mb-6">تسجيل الدخول</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5 font-naskh text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-naskh text-sm text-ink-light mb-1.5">اسم المستخدم</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                placeholder="اسم المستخدم"
                autoComplete="username"
                className="w-full border border-stone rounded-lg px-4 py-3 font-naskh text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
              />
            </div>
            <div>
              <label className="block font-naskh text-sm text-ink-light mb-1.5">كلمة المرور</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full border border-stone rounded-lg px-4 py-3 font-naskh text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-forest text-white font-naskh font-semibold py-3 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  جارٍ تسجيل الدخول...
                </>
              ) : 'دخول'}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-ink-muted font-naskh text-sm hover:text-forest transition-colors">
            ← العودة للموقع
          </Link>
        </div>
      </div>
    </div>
  )
}
