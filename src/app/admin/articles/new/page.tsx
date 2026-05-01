import AdminLayout from '@/components/admin/AdminLayout'
import ArticleForm from '@/components/admin/ArticleForm'

export default function NewArticlePage() {
  return (
    <AdminLayout title="إضافة مقال جديد">
      <ArticleForm />
    </AdminLayout>
  )
}
