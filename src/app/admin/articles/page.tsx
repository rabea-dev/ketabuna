'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { Article } from '@/types/article'
import Badge from '@/components/ui/Badge'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [toDelete, setToDelete] = useState<Article | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function loadArticles() {
    try {
      const res = await fetch('/api/articles', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as Article[]
        setArticles(data)
      }
    } catch {
      showToast('تعذّر تحميل المقالات', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  function confirmDelete(article: Article) {
    setToDelete(article)
  }

  async function handleDelete() {
    if (!toDelete) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/articles/${toDelete.id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('تم حذف المقال بنجاح', 'success')
        await loadArticles()
      } else {
        showToast('فشل حذف المقال', 'error')
      }
    } catch {
      showToast('تعذّر الاتصال بالخادم', 'error')
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  function cancelDelete() {
    setToDelete(null)
  }

  return (
    <AdminLayout title="إدارة المقالات">

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 font-naskh text-sm px-5 py-3 rounded-xl shadow-xl animate-fade-in ${
          toast.type === 'success' ? 'bg-forest text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {toDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 font-naskh">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>

            <h2 className="font-plex font-bold text-xl text-ink text-center mb-2">
              تأكيد حذف المقال
            </h2>
            <p className="text-ink-muted text-sm text-center leading-relaxed mb-1">
              هل أنت متأكد من حذف هذا المقال؟
            </p>
            <p className="text-ink font-semibold text-sm text-center line-clamp-2 bg-stone/40 rounded-lg px-3 py-2 mb-5">
              «{toDelete.title}»
            </p>
            <p className="text-red-500 text-xs text-center mb-6">
              ⚠️ هذا الإجراء لا يمكن التراجع عنه
            </p>

            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 border border-stone text-ink-muted font-naskh text-sm py-2.5 rounded-xl hover:bg-stone/30 transition-colors disabled:opacity-60"
              >
                إلغاء
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-naskh text-sm py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6" />
                </svg>
                {deleting ? 'جارٍ الحذف...' : 'نعم، احذف المقال'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header row ── */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-ink-muted font-naskh text-sm">
          {loading ? 'جارٍ التحميل...' : `${articles.length} مقال إجمالاً`}
        </p>
        <Link
          href="/admin/articles/new"
          className="bg-forest text-white font-plex font-medium px-4 py-2 rounded-lg hover:bg-forest-light transition-colors text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          مقال جديد
        </Link>
      </div>

      {/* ── Loading skeleton ── */}
      {loading ? (
        <div className="bg-white border border-stone rounded-xl p-6 space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-stone/30 rounded animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white border border-stone rounded-xl py-20 text-center">
          <svg className="w-12 h-12 text-stone-dark mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-naskh text-ink-muted text-sm">لا توجد مقالات بعد</p>
          <Link href="/admin/articles/new" className="text-forest text-sm font-naskh hover:underline mt-2 inline-block">
            أضف مقالك الأول
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-stone/30 text-right">
                <th className="px-4 py-3 font-plex font-semibold text-sm text-ink-muted">العنوان</th>
                <th className="px-4 py-3 font-plex font-semibold text-sm text-ink-muted hidden md:table-cell">الكاتب</th>
                <th className="px-4 py-3 font-plex font-semibold text-sm text-ink-muted hidden lg:table-cell">التصنيف</th>
                <th className="px-4 py-3 font-plex font-semibold text-sm text-ink-muted">الحالة</th>
                <th className="px-4 py-3 font-plex font-semibold text-sm text-ink-muted hidden md:table-cell">التاريخ</th>
                <th className="px-4 py-3 font-plex font-semibold text-sm text-ink-muted text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => (
                <tr
                  key={article.id}
                  className={`border-t border-stone/50 hover:bg-stone/10 transition-colors ${i % 2 === 0 ? '' : 'bg-stone/5'}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-naskh text-ink font-medium text-sm line-clamp-1 max-w-xs">
                      {article.title}
                    </p>
                  </td>

                  <td className="px-4 py-3 font-naskh text-ink-muted text-sm hidden md:table-cell">
                    {article.author}
                  </td>

                  <td className="px-4 py-3 hidden lg:table-cell">
                    <Badge variant="forest" className="text-xs">{article.category}</Badge>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-xs font-plex font-medium px-2 py-0.5 rounded-full ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {article.status === 'published' ? 'منشور' : 'مسودة'}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-ink-muted font-naskh text-xs hidden md:table-cell">
                    {article.publishedAt}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Link
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        title="عرض المقال"
                        className="p-1.5 rounded-lg text-navy hover:bg-navy/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>

                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        title="تعديل المقال"
                        className="p-1.5 rounded-lg text-forest hover:bg-forest/10 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => confirmDelete(article)}
                        title="حذف المقال"
                        className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
