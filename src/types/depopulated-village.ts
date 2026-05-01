export type DepopulatedVillage = {
  id: string
  arabicName: string | null
  englishName: string | null
  district: string | null
  population: {
    year1945: number | null
    estimatedRefugees: number | null
    notes: string | null
  }
  depopulatedDate: string | null
  depopulatedYear: number | null
  depopulationNotes: string | null
  location: {
    latitude: number | null
    longitude: number | null
    mapUrl: string | null
  }
  imageUrl: string | null
  familyNames: string[]
  sources: {
    wikidata?: string
    palestineRemembered?: string
    palestineOpenMaps?: string
    manual?: string
  }
}

export type DepopulatedVillageOverride = Partial<Omit<DepopulatedVillage, 'id'>> & { id: string }
