'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ArticleForm from '@/components/admin/ArticleForm'
import { Article } from '@/types/article'

interface PageProps {
  params: { id: string }
}

export default function EditArticlePage({ params }: PageProps) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/articles/${params.id}`, { cache: 'no-store' })
        if (!res.ok) {
          if (!cancelled) setNotFound(true)
          return
        }
        const data = (await res.json()) as Article
        if (!cancelled) setArticle(data)
      } catch {
        if (!cancelled) setNotFound(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [params.id])

  if (loading) {
    return (
      <AdminLayout title="تعديل المقال">
        <div className="bg-white border border-stone rounded-xl py-20 text-center">
          <p className="font-naskh text-ink-muted text-sm">جارٍ التحميل...</p>
        </div>
      </AdminLayout>
    )
  }

  if (notFound || !article) {
    return (
      <AdminLayout title="تعديل المقال">
        <div className="bg-white border border-stone rounded-xl py-20 text-center">
          <p className="font-naskh text-ink-muted text-sm">المقال غير موجود</p>
        </div>
      </AdminLayout>
    )
  }

  const initialData = {
    title: article.title,
    summary: article.summary,
    author: article.author,
    content: article.content,
    sources: (article.sources ?? []).join('\n'),
    status: article.status,
    category: article.category,
    tags: article.tags.join('، '),
    image: article.image || '',
  }

  return (
    <AdminLayout title={`تعديل: ${article.title}`}>
      <ArticleForm initialData={initialData} articleId={article.id} />
    </AdminLayout>
  )
}
