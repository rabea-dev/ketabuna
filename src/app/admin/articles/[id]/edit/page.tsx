import { notFound } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import ArticleForm from '@/components/admin/ArticleForm'
import { getArticleById } from '@/data/articles'

interface PageProps {
  params: { id: string }
}

export default function EditArticlePage({ params }: PageProps) {
  const article = getArticleById(params.id)
  if (!article) notFound()

  // Convert Article → ArticleFormData shape
  const initialData = {
    title:    article.title,
    summary:  article.summary,
    author:   article.author,
    content:  article.content,
    sources:  (article.sources ?? []).join('\n'),
    status:   article.status,
    category: article.category,
    tags:     article.tags.join('، '),
  }

  return (
    <AdminLayout title={`تعديل: ${article.title}`}>
      <ArticleForm initialData={initialData} articleId={article.id} />
    </AdminLayout>
  )
}
