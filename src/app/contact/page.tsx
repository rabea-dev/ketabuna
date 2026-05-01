'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-content mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h1 className="font-plex font-bold text-4xl text-ink mb-3">تواصل معنا</h1>
          <div className="h-0.5 w-16 bg-gold mb-6" />
          <p className="text-ink-muted font-naskh text-lg leading-loose mb-8">
            نُسعدنا التواصل معك سواء كان ذلك للمساهمة بمقال، أو اقتراح كتاب، أو أي استفسار آخر. فريقنا يُجيب خلال 48 ساعة.
          </p>

          <div className="space-y-5">
            {[
              { icon: '📧', label: 'البريد الإلكتروني', value: 'info@ketabuna.com' },
              { icon: '📍', label: 'الموقع', value: 'القاهرة، مصر' },
              { icon: '🕐', label: 'أوقات الرد', value: 'الأحد - الخميس، 9ص - 5م' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="font-plex font-semibold text-sm text-ink">{item.label}</p>
                  <p className="text-ink-muted font-naskh text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div>
          {sent ? (
            <div className="bg-forest/5 border border-forest/20 rounded-xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-plex font-bold text-xl text-ink mb-2">تم الإرسال بنجاح!</h2>
              <p className="text-ink-muted font-naskh">شكراً لتواصلك. سنردّ عليك في أقرب وقت ممكن.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-stone rounded-xl p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-naskh text-sm text-ink-light mb-1.5">الاسم *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
                    placeholder="اسمك الكريم"
                  />
                </div>
                <div>
                  <label className="block font-naskh text-sm text-ink-light mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block font-naskh text-sm text-ink-light mb-1.5">الموضوع</label>
                <input
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                  className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
                  placeholder="موضوع رسالتك"
                />
              </div>
              <div>
                <label className="block font-naskh text-sm text-ink-light mb-1.5">الرسالة *</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest resize-none text-sm leading-relaxed"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-forest text-white font-plex font-semibold py-3 rounded-lg hover:bg-forest-light transition-colors"
              >
                إرسال الرسالة
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
