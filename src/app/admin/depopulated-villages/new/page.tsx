'use client'

import AdminLayout from '@/components/admin/AdminLayout'
import VillageForm from '@/components/admin/VillageForm'

export default function NewVillagePage() {
  return (
    <AdminLayout title="إضافة قرية">
      <VillageForm mode="new" />
    </AdminLayout>
  )
}
