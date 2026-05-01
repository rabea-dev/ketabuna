'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { depopulatedVillagesService } from '@/services/depopulatedVillagesService'
import type { DepopulatedVillage } from '@/types/depopulated-village'

function MissingValue() {
  return <span className="text-ink-faint italic text-sm font-naskh">غير متوفر</span>
}

interface PageProps {
  params: { id: string }
}

const SOURCE_LABELS: Record<string, string> = {
  wikidata: 'ويكي بيانات',
  palestineRemembered: 'Palestine Remembered',
  palestineOpenMaps: 'Palestine Open Maps',
  manual: 'مصدر يدوي',
}

export default function VillageDetailPage({ params }: PageProps) {
  const [village, setVillage] = useState<DepopulatedVillage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    depopulatedVillagesService
      .getById(params.id)
      .then(v => {
        if (cancelled) return
        setVillage(v)
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

  if (loading) {
    return (
      <div className="max-w-content mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/3 bg-stone rounded" />
          <div className="h-72 bg-stone rounded-xl" />
          <div className="h-6 w-1/4 bg-stone rounded" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-content mx-auto px-4 py-12 text-center">
        <p className="text-ink font-naskh text-lg mb-4">{error}</p>
        <Link href="/depopulated-villages" className="text-forest font-naskh hover:underline">
          الرجوع إلى القائمة
        </Link>
      </div>
    )
  }

  if (!village) {
    return (
      <div className="max-w-content mx-auto px-4 py-20 text-center">
        <h1 className="font-plex font-bold text-2xl text-ink mb-4">القرية غير موجودة</h1>
        <Link href="/depopulated-villages" className="text-forest font-naskh hover:underline">
          الرجوع إلى قائمة القرى
        </Link>
      </div>
    )
  }

  const populationText =
    village.population.year1945 !== null
      ? village.population.year1945.toLocaleString('ar-EG')
      : null
  const refugeesText =
    village.population.estimatedRefugees !== null
      ? village.population.estimatedRefugees.toLocaleString('ar-EG')
      : null

  const lat = village.location.latitude
  const lng = village.location.longitude
  const hasCoords = lat !== null && lng !== null
  const embedUrl = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.05}%2C${lat - 0.05}%2C${lng + 0.05}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lng}`
    : null
  const mapLink =
    village.location.mapUrl ||
    (hasCoords
      ? `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`
      : null)

  const sourceEntries = Object.entries(village.sources).filter(([, v]) => !!v) as [
    string,
    string,
  ][]

  return (
    <div className="max-w-content mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm font-naskh text-ink-muted mb-4">
        <Link href="/" className="hover:text-forest">
          الرئيسية
        </Link>
        <span className="mx-2">/</span>
        <Link href="/depopulated-villages" className="hover:text-forest">
          قرى فلسطين المهجرة
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{village.arabicName || village.id}</span>
      </nav>

      {/* Back link */}
      <Link
        href="/depopulated-villages"
        className="inline-flex items-center gap-1 text-forest font-naskh text-sm mb-6 hover:text-forest-light"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        رجوع
      </Link>

      {/* Hero image */}
      {village.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={village.imageUrl}
          alt={village.arabicName || ''}
          className="w-full h-72 object-cover rounded-xl mb-8"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main info */}
        <div className="lg:col-span-2 bg-white border border-stone rounded-xl p-6">
          <h1 className="font-plex font-bold text-3xl text-forest mb-1">
            {village.arabicName || <MissingValue />}
          </h1>
          {village.englishName ? (
            <p className="text-ink-muted font-naskh mb-6">{village.englishName}</p>
          ) : (
            <p className="mb-6"><MissingValue /></p>
          )}

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-6 font-naskh">
            <Field label="اسم القرية بالعربي" value={village.arabicName} />
            <Field label="الاسم" value={village.englishName} />
            <Field label="القضاء" value={village.district} />
            <Field label="عدد السكان" value={populationText} />
            <Field label="عدد اللاجئين التقديري" value={refugeesText} />
            <Field label="ملاحظات السكان" value={village.population.notes} fullWidth />
            <Field label="تاريخ التهجير" value={village.depopulatedDate} />
            <Field
              label="سنة التهجير"
              value={village.depopulatedYear !== null ? String(village.depopulatedYear) : null}
            />
            <Field label="ملاحظات التهجير" value={village.depopulationNotes} fullWidth />
            <div className="md:col-span-2">
              <dt className="text-ink-faint text-xs mb-1.5">أسماء العائلات</dt>
              <dd>
                {village.familyNames.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {village.familyNames.map(name => (
                      <span
                        key={name}
                        className="text-sm font-naskh px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <MissingValue />
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Map */}
          <div className="bg-white border border-stone rounded-xl p-5">
            <h2 className="font-plex font-bold text-lg text-ink mb-3">الموقع</h2>
            {embedUrl && mapLink ? (
              <>
                <iframe
                  src={embedUrl}
                  className="w-full h-56 rounded-lg border border-stone mb-3"
                  title={`خريطة ${village.arabicName || ''}`}
                />
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-forest text-white font-naskh py-2 rounded-lg hover:bg-forest-light transition-colors text-sm"
                >
                  عرض على الخريطة
                </a>
              </>
            ) : (
              <MissingValue />
            )}
          </div>

          {/* Sources */}
          <div className="bg-white border border-stone rounded-xl p-5">
            <h2 className="font-plex font-bold text-lg text-ink mb-3">المصادر</h2>
            {sourceEntries.length > 0 ? (
              <ul className="space-y-2">
                {sourceEntries.map(([key, url]) => {
                  const isUrl = /^https?:\/\//.test(url)
                  return (
                    <li key={key} className="font-naskh text-sm">
                      <span className="text-ink-muted">{SOURCE_LABELS[key] || key}: </span>
                      {isUrl ? (
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-forest hover:underline break-all"
                        >
                          {url}
                        </a>
                      ) : (
                        <span className="text-ink">{url}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <MissingValue />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  fullWidth = false,
}: {
  label: string
  value: string | null | undefined
  fullWidth?: boolean
}) {
  return (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
      <dt className="text-ink-faint text-xs mb-1">{label}</dt>
      <dd className="text-ink">
        {value ? <span>{value}</span> : <MissingValue />}
      </dd>
    </div>
  )
}
