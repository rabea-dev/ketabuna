import AdminLayout from '@/components/admin/AdminLayout'
import BookForm from '@/components/admin/BookForm'

export default function NewBookPage() {
  return (
    <AdminLayout title="إضافة كتاب جديد">
      <BookForm />
    </AdminLayout>
  )
}
