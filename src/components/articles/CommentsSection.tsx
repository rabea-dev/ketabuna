'use client'

import { useState, useEffect } from 'react'

interface Comment {
  id: string
  name: string
  text: string
  createdAt: string
}

interface CommentsSectionProps {
  articleSlug: string
}

export default function CommentsSection({ articleSlug }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/comments?article=${encodeURIComponent(articleSlug)}`)
      .then(r => r.json())
      .then(data => { setComments(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [articleSlug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleSlug, name, text }),
      })
      if (res.ok) {
        const newComment = await res.json()
        setComments(prev => [...prev, newComment])
        setName('')
        setText('')
        setSuccess(true)
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setError('حدث خطأ، حاول مجدداً')
      }
    } catch {
      setError('تعذّر الاتصال بالخادم')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
  }

  return (
    <div className="mt-12 pt-8 border-t border-stone">
      <h2 className="font-plex font-bold text-2xl text-ink mb-8 flex items-center gap-3">
        <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        التعليقات
        {comments.length > 0 && (
          <span className="text-sm font-normal text-ink-muted bg-stone rounded-full px-3 py-0.5">
            {comments.length}
          </span>
        )}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-cream-dark rounded-xl p-6 mb-8 border border-stone">
        <h3 className="font-naskh font-semibold text-ink mb-4">أضف تعليقاً</h3>

        {success && (
          <div className="bg-forest/10 border border-forest/20 text-forest font-naskh text-sm rounded-lg px-4 py-3 mb-4">
            ✓ تم إرسال تعليقك بنجاح!
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 font-naskh text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="اسمك *"
            required
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest bg-white"
          />
        </div>
        <div className="mb-4">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="اكتب تعليقك هنا... *"
            required
            rows={4}
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink text-sm focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest resize-none bg-white leading-relaxed"
          />
        </div>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !text.trim()}
          className="bg-forest text-white font-naskh text-sm px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'جارٍ الإرسال...' : 'إرسال التعليق'}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block w-6 h-6 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-ink-muted font-naskh">
          <svg className="w-12 h-12 mx-auto mb-3 text-stone-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p>لا توجد تعليقات بعد — كن أول من يعلّق!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map(comment => (
            <div key={comment.id} className="bg-white rounded-xl border border-stone p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-forest/10 flex items-center justify-center shrink-0 text-forest font-bold text-sm">
                  {comment.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <span className="font-naskh font-semibold text-ink text-sm">{comment.name}</span>
                    <span className="text-ink-faint text-xs font-naskh">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="font-naskh text-ink-light text-sm leading-relaxed">{comment.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
