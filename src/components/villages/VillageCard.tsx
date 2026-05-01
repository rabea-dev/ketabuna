'use client'

import Link from 'next/link'
import type { DepopulatedVillage } from '@/types/depopulated-village'

interface VillageCardProps {
  village: DepopulatedVillage
}

function MissingValue() {
  return <span className="text-ink-faint italic text-sm font-naskh">غير متوفر</span>
}

export default function VillageCard({ village }: VillageCardProps) {
  const populationText =
    village.population.year1945 !== null
      ? village.population.year1945.toLocaleString('ar-EG')
      : null

  const depopulatedText =
    village.depopulatedDate ||
    (village.depopulatedYear !== null ? String(village.depopulatedYear) : null)

  const visibleFamilies = village.familyNames.slice(0, 3)
  const extraFamilies = Math.max(0, village.familyNames.length - 3)

  const hasCoords =
    village.location.latitude !== null && village.location.longitude !== null
  const mapHref =
    village.location.mapUrl ||
    (hasCoords
      ? `https://www.openstreetmap.org/?mlat=${village.location.latitude}&mlon=${village.location.longitude}#map=13/${village.location.latitude}/${village.location.longitude}`
      : null)

  return (
    <Link
      href={`/depopulated-villages/${village.id}`}
      className="block bg-white border border-stone rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
    >
      {/* Image */}
      {village.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={village.imageUrl}
          alt={village.arabicName || ''}
          className="w-full h-44 object-cover"
        />
      ) : (
        <div className="w-full h-44 bg-gradient-to-br from-forest to-gold flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
      )}

      {/* Body */}
      <div className="p-5">
        <h3 className="font-naskh font-bold text-lg text-forest mb-1">
          {village.arabicName || <MissingValue />}
        </h3>
        {village.englishName ? (
          <p className="text-ink-muted text-sm mb-3">{village.englishName}</p>
        ) : (
          <p className="text-ink-faint italic text-xs mb-3 font-naskh">غير متوفر</p>
        )}

        <div className="grid grid-cols-2 gap-2 text-sm font-naskh mb-3">
          <div>
            <span className="text-ink-faint block text-xs">القضاء</span>
            {village.district ? (
              <span className="text-ink">{village.district}</span>
            ) : (
              <MissingValue />
            )}
          </div>
          <div>
            <span className="text-ink-faint block text-xs">عدد السكان</span>
            {populationText ? (
              <span className="text-ink">{populationText}</span>
            ) : (
              <MissingValue />
            )}
          </div>
          <div className="col-span-2">
            <span className="text-ink-faint block text-xs">تاريخ التهجير</span>
            {depopulatedText ? (
              <span className="text-ink">{depopulatedText}</span>
            ) : (
              <MissingValue />
            )}
          </div>
        </div>

        {/* Families */}
        <div className="mb-3">
          <span className="text-ink-faint block text-xs font-naskh mb-1">العائلات</span>
          {village.familyNames.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {visibleFamilies.map(name => (
                <span
                  key={name}
                  className="text-xs font-naskh px-2 py-0.5 rounded-full bg-gold/15 text-gold-dark"
                >
                  {name}
                </span>
              ))}
              {extraFamilies > 0 && (
                <span className="text-xs font-naskh px-2 py-0.5 rounded-full bg-stone text-ink-muted">
                  +{extraFamilies.toLocaleString('ar-EG')}
                </span>
              )}
            </div>
          ) : (
            <MissingValue />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone">
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-gold-dark hover:text-gold text-sm font-naskh"
            >
              عرض على الخريطة
            </a>
          ) : (
            <MissingValue />
          )}
          <span className="text-forest text-sm font-naskh">← التفاصيل</span>
        </div>
      </div>
    </Link>
  )
}
