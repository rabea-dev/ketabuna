import type {
  DepopulatedVillage,
  DepopulatedVillageOverride,
} from '@/types/depopulated-village'

function pick<T>(overrideVal: T | null | undefined, baseVal: T): T {
  return overrideVal !== undefined && overrideVal !== null ? overrideVal : baseVal
}

function mergeOne(
  base: DepopulatedVillage,
  override: DepopulatedVillageOverride | undefined
): DepopulatedVillage {
  if (!override) return base
  const merged: DepopulatedVillage = {
    id: base.id,
    arabicName: pick(override.arabicName, base.arabicName),
    englishName: pick(override.englishName, base.englishName),
    district: pick(override.district, base.district),
    population: {
      year1945: pick(override.population?.year1945, base.population.year1945),
      estimatedRefugees: pick(
        override.population?.estimatedRefugees,
        base.population.estimatedRefugees
      ),
      notes: pick(override.population?.notes, base.population.notes),
    },
    depopulatedDate: pick(override.depopulatedDate, base.depopulatedDate),
    depopulatedYear: pick(override.depopulatedYear, base.depopulatedYear),
    depopulationNotes: pick(override.depopulationNotes, base.depopulationNotes),
    location: {
      latitude: pick(override.location?.latitude, base.location.latitude),
      longitude: pick(override.location?.longitude, base.location.longitude),
      mapUrl: pick(override.location?.mapUrl, base.location.mapUrl),
    },
    imageUrl: pick(override.imageUrl, base.imageUrl),
    familyNames:
      override.familyNames && override.familyNames.length > 0
        ? override.familyNames
        : base.familyNames,
    sources: {
      ...base.sources,
      ...(override.sources || {}),
    },
  }
  return merged
}

export function mergeVillages(
  publicVillages: DepopulatedVillage[],
  overrides: { [id: string]: DepopulatedVillageOverride },
  manual: { [id: string]: DepopulatedVillage }
): DepopulatedVillage[] {
  const merged = publicVillages.map(v => mergeOne(v, overrides[v.id]))
  const manualList = Object.values(manual)
  return [...merged, ...manualList]
}

export { mergeOne }
