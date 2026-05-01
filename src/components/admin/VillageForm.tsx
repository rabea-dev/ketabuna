'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type {
  DepopulatedVillage,
  DepopulatedVillageOverride,
} from '@/types/depopulated-village'
import { villageOverridesService } from '@/services/villageOverridesService'
import { depopulatedVillagesService } from '@/services/depopulatedVillagesService'

interface VillageFormProps {
  village?: DepopulatedVillage | null
  override?: DepopulatedVillageOverride | null
  mode: 'edit' | 'new'
  publicVillage?: DepopulatedVillage | null
}

type FormState = {
  arabicName: string
  englishName: string
  district: string
  populationYear1945: string
  populationEstimatedRefugees: string
  populationNotes: string
  depopulatedDate: string
  depopulatedYear: string
  depopulationNotes: string
  latitude: string
  longitude: string
  mapUrl: string
  imageUrl: string
  familyNames: string
  manualSource: string
}

function toFormState(v: DepopulatedVillage | null | undefined): FormState {
  return {
    arabicName: v?.arabicName || '',
    englishName: v?.englishName || '',
    district: v?.district || '',
    populationYear1945:
      v?.population.year1945 !== null && v?.population.year1945 !== undefined
        ? String(v.population.year1945)
        : '',
    populationEstimatedRefugees:
      v?.population.estimatedRefugees !== null && v?.population.estimatedRefugees !== undefined
        ? String(v.population.estimatedRefugees)
        : '',
    populationNotes: v?.population.notes || '',
    depopulatedDate: v?.depopulatedDate || '',
    depopulatedYear:
      v?.depopulatedYear !== null && v?.depopulatedYear !== undefined
        ? String(v.depopulatedYear)
        : '',
    depopulationNotes: v?.depopulationNotes || '',
    latitude:
      v?.location.latitude !== null && v?.location.latitude !== undefined
        ? String(v.location.latitude)
        : '',
    longitude:
      v?.location.longitude !== null && v?.location.longitude !== undefined
        ? String(v.location.longitude)
        : '',
    mapUrl: v?.location.mapUrl || '',
    imageUrl: v?.imageUrl || '',
    familyNames: v?.familyNames?.join('، ') || '',
    manualSource: v?.sources?.manual || '',
  }
}

function parseFamilyNames(str: string): string[] {
  return str
    .split(/[,،]/)
    .map(s => s.trim())
    .filter(Boolean)
}

export default function VillageForm({
  village,
  override,
  mode,
  publicVillage,
}: VillageFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(toFormState(village))
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(
    null
  )

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Determine if a given override field path is set in the override
  const overrideHas = (path: string): boolean => {
    if (!override) return false
    const parts = path.split('.')
    let cur: any = override
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') return false
      if (!(p in cur)) return false
      cur = cur[p]
    }
    return cur !== undefined
  }

  // The public-source value at a given path (for restore button visibility)
  const publicHas = (path: string): boolean => {
    if (!publicVillage) return false
    const parts = path.split('.')
    let cur: any = publicVillage
    for (const p of parts) {
      if (cur == null || typeof cur !== 'object') return false
      cur = cur[p]
    }
    return cur !== undefined && cur !== null && cur !== ''
  }

  const restoreField = (
    path: string,
    formField: keyof FormState,
    publicValueFormatter?: (v: any) => string
  ) => {
    if (!village) return
    villageOverridesService.clearOverrideField(village.id, path)
    // Set the form field back to the public source value
    let cur: any = publicVillage
    const parts = path.split('.')
    for (const p of parts) {
      if (cur == null) break
      cur = cur[p]
    }
    const formatted = publicValueFormatter
      ? publicValueFormatter(cur)
      : cur === null || cur === undefined
        ? ''
        : String(cur)
    setForm(prev => ({ ...prev, [formField]: formatted }))
    showToast('تمت استعادة القيمة الأصلية', 'success')
  }

  const validate = (): string | null => {
    if (!form.arabicName.trim() && !form.englishName.trim()) {
      return 'يرجى تعبئة الحقول المطلوبة'
    }
    if (form.latitude.trim()) {
      const n = Number(form.latitude)
      if (Number.isNaN(n) || n < -90 || n > 90) return 'خط العرض غير صحيح'
    }
    if (form.longitude.trim()) {
      const n = Number(form.longitude)
      if (Number.isNaN(n) || n < -180 || n > 180) return 'خط الطول غير صحيح'
    }
    if (form.depopulatedYear.trim()) {
      const n = Number(form.depopulatedYear)
      if (Number.isNaN(n) || n < 1800 || n > 2100) return 'سنة التهجير غير صحيحة'
    }
    const numFields: [string, string][] = [
      ['populationYear1945', 'عدد السكان'],
      ['populationEstimatedRefugees', 'عدد اللاجئين التقديري'],
    ]
    for (const [k, label] of numFields) {
      const v = (form as any)[k] as string
      if (v.trim()) {
        const n = Number(v)
        if (Number.isNaN(n) || n < 0) return `${label} غير صحيح`
      }
    }
    const urlFields: [keyof FormState, string][] = [
      ['mapUrl', 'رابط الخريطة'],
      ['imageUrl', 'رابط الصورة'],
    ]
    for (const [k, label] of urlFields) {
      const v = form[k]
      if (v.trim()) {
        try {
          new URL(v)
        } catch {
          return `${label} غير صالح`
        }
      }
    }
    if (form.manualSource.trim() && /^https?:\/\//i.test(form.manualSource.trim())) {
      try {
        new URL(form.manualSource.trim())
      } catch {
        return 'رابط المصدر غير صالح'
      }
    }
    return null
  }

  const buildVillage = (id: string): DepopulatedVillage => {
    const lat = form.latitude.trim() ? Number(form.latitude) : null
    const lng = form.longitude.trim() ? Number(form.longitude) : null
    const autoMap =
      lat !== null && lng !== null
        ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`
        : null
    return {
      id,
      arabicName: form.arabicName.trim() || null,
      englishName: form.englishName.trim() || null,
      district: form.district.trim() || null,
      population: {
        year1945: form.populationYear1945.trim() ? Number(form.populationYear1945) : null,
        estimatedRefugees: form.populationEstimatedRefugees.trim()
          ? Number(form.populationEstimatedRefugees)
          : null,
        notes: form.populationNotes.trim() || null,
      },
      depopulatedDate: form.depopulatedDate.trim() || null,
      depopulatedYear: form.depopulatedYear.trim() ? Number(form.depopulatedYear) : null,
      depopulationNotes: form.depopulationNotes.trim() || null,
      location: {
        latitude: lat,
        longitude: lng,
        mapUrl: form.mapUrl.trim() || autoMap,
      },
      imageUrl: form.imageUrl.trim() || null,
      familyNames: parseFamilyNames(form.familyNames),
      sources: form.manualSource.trim() ? { manual: form.manualSource.trim() } : {},
    }
  }

  const handleSave = () => {
    const err = validate()
    if (err) {
      showToast(err, 'error')
      return
    }
    setSaving(true)
    try {
      if (mode === 'new') {
        const id = `manual-${Date.now()}`
        const v = buildVillage(id)
        villageOverridesService.addManual(v)
      } else if (village) {
        const v = buildVillage(village.id)
        // Save as override (full snapshot of the merged record)
        const ov: DepopulatedVillageOverride = {
          id: v.id,
          arabicName: v.arabicName,
          englishName: v.englishName,
          district: v.district,
          population: v.population,
          depopulatedDate: v.depopulatedDate,
          depopulatedYear: v.depopulatedYear,
          depopulationNotes: v.depopulationNotes,
          location: v.location,
          imageUrl: v.imageUrl,
          familyNames: v.familyNames,
          sources: v.sources,
        }
        // If it's a manual village (id starts with manual-), update manual instead
        if (village.id.startsWith('manual-')) {
          villageOverridesService.updateManual(village.id, v)
        } else {
          villageOverridesService.setOverride(village.id, ov)
        }
      }
      depopulatedVillagesService.clearCache()
      showToast('تم حفظ التغييرات بنجاح', 'success')
      setTimeout(() => {
        router.push('/admin/depopulated-villages')
      }, 1000)
    } catch {
      showToast('حدث خطأ أثناء حفظ التغييرات', 'error')
    } finally {
      setSaving(false)
    }
  }

  const isEditMode = mode === 'edit' && !!village && !village.id.startsWith('manual-')

  const RestoreButton = ({
    path,
    formField,
    formatter,
  }: {
    path: string
    formField: keyof FormState
    formatter?: (v: any) => string
  }) => {
    if (!isEditMode) return null
    if (!overrideHas(path)) return null
    if (!publicHas(path)) return null
    return (
      <button
        type="button"
        onClick={() => restoreField(path, formField, formatter)}
        className="text-xs font-naskh text-gold-dark hover:text-gold underline"
      >
        استعادة القيمة الأصلية
      </button>
    )
  }

  const autoMapPlaceholder =
    form.latitude.trim() && form.longitude.trim()
      ? `https://www.openstreetmap.org/?mlat=${form.latitude}&mlon=${form.longitude}#map=13/${form.latitude}/${form.longitude}`
      : 'https://...'

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-xl shadow-lg font-naskh text-sm transition-all ${
            toast.type === 'success' ? 'bg-forest text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone p-6 space-y-5">
        <h2 className="font-plex font-bold text-lg text-ink border-b border-stone pb-3">
          بيانات القرية
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">اسم القرية بالعربي</label>
              <RestoreButton path="arabicName" formField="arabicName" />
            </div>
            <input
              name="arabicName"
              value={form.arabicName}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <label className="block font-naskh text-sm text-ink-light mb-1.5">الاسم</label>
            <input
              name="englishName"
              value={form.englishName}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">القضاء</label>
              <RestoreButton path="district" formField="district" />
            </div>
            <input
              name="district"
              value={form.district}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">عدد السكان</label>
              <RestoreButton path="population.year1945" formField="populationYear1945" />
            </div>
            <input
              type="number"
              min={0}
              name="populationYear1945"
              value={form.populationYear1945}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">
                عدد اللاجئين التقديري
              </label>
              <RestoreButton
                path="population.estimatedRefugees"
                formField="populationEstimatedRefugees"
              />
            </div>
            <input
              type="number"
              min={0}
              name="populationEstimatedRefugees"
              value={form.populationEstimatedRefugees}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">تاريخ التهجير</label>
              <RestoreButton path="depopulatedDate" formField="depopulatedDate" />
            </div>
            <input
              name="depopulatedDate"
              value={form.depopulatedDate}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">سنة التهجير</label>
              <RestoreButton path="depopulatedYear" formField="depopulatedYear" />
            </div>
            <input
              type="number"
              name="depopulatedYear"
              value={form.depopulatedYear}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">خط العرض</label>
              <RestoreButton path="location.latitude" formField="latitude" />
            </div>
            <input
              type="number"
              step="any"
              name="latitude"
              value={form.latitude}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">خط الطول</label>
              <RestoreButton path="location.longitude" formField="longitude" />
            </div>
            <input
              type="number"
              step="any"
              name="longitude"
              value={form.longitude}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">رابط الخريطة</label>
              <RestoreButton path="location.mapUrl" formField="mapUrl" />
            </div>
            <input
              type="url"
              name="mapUrl"
              value={form.mapUrl}
              onChange={handleChange}
              placeholder={autoMapPlaceholder}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-naskh text-sm text-ink-light">رابط الصورة</label>
              <RestoreButton path="imageUrl" formField="imageUrl" />
            </div>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">ملاحظات السكان</label>
          <textarea
            name="populationNotes"
            value={form.populationNotes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest resize-none text-sm"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">ملاحظات التهجير</label>
          <textarea
            name="depopulationNotes"
            value={form.depopulationNotes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest resize-none text-sm"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">
            أسماء العائلات (مفصولة بفواصل)
          </label>
          <textarea
            name="familyNames"
            value={form.familyNames}
            onChange={handleChange}
            rows={2}
            placeholder="مثال: آل فلان، آل علان"
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest resize-none text-sm"
          />
        </div>

        <div>
          <label className="block font-naskh text-sm text-ink-light mb-1.5">المصادر</label>
          <input
            name="manualSource"
            value={form.manualSource}
            onChange={handleChange}
            placeholder="رابط أو وصف المصدر"
            className="w-full border border-stone rounded-lg px-4 py-2.5 font-naskh text-ink focus:outline-none focus:border-forest text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-forest text-white font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-forest-light transition-colors disabled:opacity-60"
        >
          {saving ? 'جارٍ الحفظ...' : 'حفظ'}
        </button>
        <button
          onClick={() => router.back()}
          className="bg-stone text-ink font-plex font-medium px-6 py-2.5 rounded-lg hover:bg-stone-dark transition-colors"
        >
          إلغاء
        </button>
      </div>
    </div>
  )
}
