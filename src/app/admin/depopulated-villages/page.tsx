'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import { depopulatedVillagesService } from '@/services/depopulatedVillagesService'
import { villageOverridesService } from '@/services/villageOverridesService'
import type { DepopulatedVillage } from '@/types/depopulated-village'

type Row = DepopulatedVillage & {
  source: 'wikidata' | 'manual' | 'overridden'
  hasOverride: boolean
  isManual: boolean
}

export default function AdminVillagesPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([
      depopulatedVillagesService.getAll(),
      Promise.resolve(villageOverridesService.getAll()),
    ])
      .then(([all, store]) => {
        if (cancelled) return
        const enriched: Row[] = all.map(v => {
          const isManual = v.id.startsWith('manual-')
          const hasOverride = !isManual && !!store.overrides[v.id]
          let source: Row['source'] = 'wikidata'
          if (isManual) source = 'manual'
          else if (hasOverride) source = 'overridden'
          return { ...v, source, hasOverride, isManual }
        })
        setRows(enriched)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('تعذّر تحميل قائمة القرى')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reload])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r =>
      [r.arabicName || '', r.englishName || '', r.district || '', ...r.familyNames]
        .some(f => f.toLowerCase().includes(q))
    )
  }, [rows, search])

  const handleRestore = (id: string) => {
    villageOverridesService.clearOverride(id)
    depopulatedVillagesService.clearCache()
    setReload(r => r + 1)
  }

  const handleDelete = (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه القرية؟')) return
    villageOverridesService.deleteManual(id)
    depopulatedVillagesService.clearCache()
    setReload(r => r + 1)
  }

  return (
    <AdminLayout title="إدارة القرى المهجرة">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن قرية"
          className="w-full md:w-80 border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
        />
        <Link
          href="/admin/depopulated-villages/new"
          className="bg-forest text-white font-naskh px-5 py-2.5 rounded-lg hover:bg-forest-light transition-colors text-sm text-center"
        >
          إضافة قرية
        </Link>
      </div>

      {loading && (
        <div className="bg-white border border-stone rounded-xl p-8 text-center text-ink-muted font-naskh">
          جارٍ التحميل...
        </div>
      )}

      {error && !loading && (
        <div className="bg-white border border-stone rounded-xl p-8 text-center">
          <p className="text-ink font-naskh mb-3">{error}</p>
          <button
            onClick={() => {
              depopulatedVillagesService.clearCache()
              setReload(r => r + 1)
            }}
            className="bg-forest text-white font-naskh px-4 py-2 rounded-lg text-sm"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="bg-white border border-stone rounded-xl p-8 text-center text-ink-muted font-naskh">
          لا توجد قرى لعرضها
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="bg-white border border-stone rounded-xl overflow-x-auto">
          <table className="w-full text-sm font-naskh">
            <thead className="bg-cream-dark text-ink-light">
              <tr>
                <th className="text-right px-4 py-3 font-semibold">الاسم بالعربي</th>
                <th className="text-right px-4 py-3 font-semibold">الاسم</th>
                <th className="text-right px-4 py-3 font-semibold">القضاء</th>
                <th className="text-right px-4 py-3 font-semibold">عدد السكان</th>
                <th className="text-right px-4 py-3 font-semibold">سنة التهجير</th>
                <th className="text-right px-4 py-3 font-semibold">المصدر</th>
                <th className="text-right px-4 py-3 font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-t border-stone hover:bg-cream-dark/40">
                  <td className="px-4 py-3 text-ink">{r.arabicName || '—'}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.englishName || '—'}</td>
                  <td className="px-4 py-3 text-ink-muted">{r.district || '—'}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {r.population.year1945 !== null
                      ? r.population.year1945.toLocaleString('ar-EG')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {r.depopulatedYear !== null ? String(r.depopulatedYear) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {r.source === 'wikidata' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-navy/10 text-navy">
                        Wikidata
                      </span>
                    )}
                    {r.source === 'manual' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark">
                        يدوي
                      </span>
                    )}
                    {r.source === 'overridden' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-forest/10 text-forest">
                        معدّل
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/depopulated-villages/${r.id}/edit`}
                        className="text-forest hover:underline"
                      >
                        تعديل
                      </Link>
                      {r.hasOverride && (
                        <button
                          onClick={() => handleRestore(r.id)}
                          className="text-gold-dark hover:underline"
                        >
                          استعادة القيمة الأصلية
                        </button>
                      )}
                      {r.isManual && (
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-red-600 hover:underline"
                        >
                          حذف
                        </button>
                      )}
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
