'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import VillageForm from '@/components/admin/VillageForm'
import { depopulatedVillagesService } from '@/services/depopulatedVillagesService'
import { villageOverridesService } from '@/services/villageOverridesService'
import type {
  DepopulatedVillage,
  DepopulatedVillageOverride,
} from '@/types/depopulated-village'
import { mergeOne } from '@/lib/villageMerge'

interface PageProps {
  params: { id: string }
}

export default function EditVillagePage({ params }: PageProps) {
  const [village, setVillage] = useState<DepopulatedVillage | null>(null)
  const [publicVillage, setPublicVillage] = useState<DepopulatedVillage | null>(null)
  const [override, setOverride] = useState<DepopulatedVillageOverride | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const isManual = params.id.startsWith('manual-')
    const ov = villageOverridesService.getOverride(params.id)
    setOverride(ov)

    if (isManual) {
      const manuals = villageOverridesService.getManual()
      const m = manuals.find(v => v.id === params.id) || null
      if (cancelled) return
      setVillage(m)
      setPublicVillage(null)
      setLoading(false)
      if (!m) setError('القرية غير موجودة')
      return () => {
        cancelled = true
      }
    }

    depopulatedVillagesService
      .fetchFromWikidata()
      .then(publicList => {
        if (cancelled) return
        const pub = publicList.find(v => v.id === params.id) || null
        setPublicVillage(pub)
        if (pub) {
          const merged = mergeOne(pub, ov || undefined)
          setVillage(merged)
        } else {
          setVillage(null)
          setError('القرية غير موجودة')
        }
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('تعذّر تحميل بيانات القرية')
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [params.id])

  return (
    <AdminLayout title="تعديل القرية">
      {loading && (
        <div className="bg-white border border-stone rounded-xl p-8 text-center text-ink-muted font-naskh">
          جارٍ التحميل...
        </div>
      )}
      {error && !loading && (
        <div className="bg-white border border-stone rounded-xl p-8 text-center text-ink font-naskh">
          {error}
        </div>
      )}
      {!loading && !error && village && (
        <VillageForm
          mode="edit"
          village={village}
          override={override}
          publicVillage={publicVillage}
        />
      )}
    </AdminLayout>
  )
}
