'use client'

import { useEffect, useMemo, useState } from 'react'
import VillageCard from '@/components/villages/VillageCard'
import { depopulatedVillagesService } from '@/services/depopulatedVillagesService'
import type { DepopulatedVillage } from '@/types/depopulated-village'

export default function DepopulatedVillagesPage() {
  const [villages, setVillages] = useState<DepopulatedVillage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    depopulatedVillagesService
      .getAll()
      .then(data => {
        if (cancelled) return
        setVillages(data)
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError('تعذّر تحميل بيانات القرى')
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const districts = useMemo(() => {
    const set = new Set<string>()
    villages.forEach(v => {
      if (v.district) set.add(v.district)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ar'))
  }, [villages])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return villages.filter(v => {
      if (district && v.district !== district) return false
      if (!q) return true
      const fields = [
        v.arabicName || '',
        v.englishName || '',
        v.district || '',
        ...v.familyNames,
      ]
      return fields.some(f => f.toLowerCase().includes(q))
    })
  }, [villages, search, district])

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-plex font-bold text-3xl text-ink mb-2">قرى فلسطين المهجرة</h1>
        <div className="h-0.5 w-16 bg-gold mb-4" />
        <p className="text-ink-muted font-naskh text-lg">
          أرشيف القرى الفلسطينية المهجّرة عام 1948 — موقعها، سكانها، وتاريخها.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">بحث</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن قرية"
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest text-base"
          />
        </div>
        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">القضاء</label>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-base bg-white"
          >
            <option value="">كل الأقضية</option>
            {districts.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Counter */}
      {!loading && !error && (
        <p className="text-ink-muted font-naskh text-sm mb-6">
          {filtered.length.toLocaleString('ar-EG')} من {villages.length.toLocaleString('ar-EG')} قرية
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-stone rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-44 bg-stone" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-1/2 bg-stone rounded" />
                <div className="h-3 w-1/3 bg-stone rounded" />
                <div className="h-3 w-full bg-stone rounded" />
                <div className="h-3 w-2/3 bg-stone rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-20">
          <p className="text-ink font-naskh text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              depopulatedVillagesService.clearCache()
              setReloadKey(k => k + 1)
            }}
            className="bg-forest text-white font-naskh px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <VillageCard key={v.id} village={v} />
          ))}
        </div>
      )}

      {/* Empty filtered */}
      {!loading && !error && filtered.length === 0 && villages.length > 0 && (
        <div className="text-center py-20">
          <p className="text-ink-muted font-naskh text-xl">لا توجد نتائج مطابقة</p>
        </div>
      )}

      {/* Empty entirely */}
      {!loading && !error && villages.length === 0 && (
        <div className="text-center py-20">
          <p className="text-ink-muted font-naskh text-xl">لا توجد قرى متاحة حالياً</p>
        </div>
      )}
    </div>
  )
}
