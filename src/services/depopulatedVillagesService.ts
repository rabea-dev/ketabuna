import type { DepopulatedVillage } from '@/types/depopulated-village'
import { villageOverridesService } from './villageOverridesService'
import { mergeVillages } from '@/lib/villageMerge'

const CACHE_KEY = 'villages-cache'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql'

const SPARQL_QUERY = `SELECT ?village ?villageLabel ?villageLabelEn ?coord ?image ?districtLabel ?districtLabelEn WHERE {
  ?village wdt:P31/wdt:P279* wd:Q12232785 .
  OPTIONAL { ?village wdt:P625 ?coord. }
  OPTIONAL { ?village wdt:P18 ?image. }
  OPTIONAL { ?village wdt:P131 ?district.
            ?district rdfs:label ?districtLabel . FILTER(LANG(?districtLabel) = "ar") .
            ?district rdfs:label ?districtLabelEn . FILTER(LANG(?districtLabelEn) = "en") . }
  ?village rdfs:label ?villageLabel . FILTER(LANG(?villageLabel) = "ar") .
  OPTIONAL { ?village rdfs:label ?villageLabelEn . FILTER(LANG(?villageLabelEn) = "en") . }
}
LIMIT 500`

type CacheShape = {
  fetchedAt: number
  villages: DepopulatedVillage[]
}

function readCache(): CacheShape | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheShape
    if (
      !parsed ||
      typeof parsed.fetchedAt !== 'number' ||
      !Array.isArray(parsed.villages)
    ) {
      return null
    }
    if (Date.now() - parsed.fetchedAt > CACHE_TTL_MS) return null
    return parsed
  } catch {
    return null
  }
}

function writeCache(villages: DepopulatedVillage[]): void {
  if (typeof window === 'undefined') return
  try {
    const cache: CacheShape = { fetchedAt: Date.now(), villages }
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // ignore quota errors
  }
}

function parseCoord(wkt: string | undefined): { lat: number | null; lng: number | null } {
  if (!wkt) return { lat: null, lng: null }
  const m = wkt.match(/Point\(([\-\d.]+)\s+([\-\d.]+)\)/)
  if (!m) return { lat: null, lng: null }
  const lng = parseFloat(m[1])
  const lat = parseFloat(m[2])
  if (Number.isNaN(lat) || Number.isNaN(lng)) return { lat: null, lng: null }
  return { lat, lng }
}

function buildMapUrl(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=13/${lat}/${lng}`
}

function extractId(uri: string): string {
  const parts = uri.split('/')
  return parts[parts.length - 1]
}

function dedupeById(villages: DepopulatedVillage[]): DepopulatedVillage[] {
  const map = new Map<string, DepopulatedVillage>()
  for (const v of villages) {
    const existing = map.get(v.id)
    if (!existing) {
      map.set(v.id, v)
      continue
    }
    // Merge non-null fields preferring existing
    map.set(v.id, {
      ...existing,
      englishName: existing.englishName || v.englishName,
      district: existing.district || v.district,
      imageUrl: existing.imageUrl || v.imageUrl,
      location: {
        latitude: existing.location.latitude ?? v.location.latitude,
        longitude: existing.location.longitude ?? v.location.longitude,
        mapUrl: existing.location.mapUrl || v.location.mapUrl,
      },
    })
  }
  return Array.from(map.values())
}

function sortByArabic(villages: DepopulatedVillage[]): DepopulatedVillage[] {
  const collator = new Intl.Collator('ar')
  return [...villages].sort((a, b) => {
    const an = a.arabicName || ''
    const bn = b.arabicName || ''
    return collator.compare(an, bn)
  })
}

async function fetchFromWikidata(): Promise<DepopulatedVillage[]> {
  const cached = readCache()
  if (cached) return cached.villages

  const url = `${SPARQL_ENDPOINT}?format=json&query=${encodeURIComponent(SPARQL_QUERY)}`
  const res = await fetch(url, {
    headers: {
      Accept: 'application/sparql-results+json',
    },
  })
  if (!res.ok) {
    throw new Error(`Wikidata request failed: ${res.status}`)
  }
  const data = await res.json()
  const bindings: any[] = data?.results?.bindings || []

  const villages: DepopulatedVillage[] = bindings.map(b => {
    const uri: string = b.village?.value || ''
    const id = extractId(uri)
    const arabicName: string | null = b.villageLabel?.value || null
    const englishName: string | null = b.villageLabelEn?.value || null
    const district: string | null = b.districtLabel?.value || null
    const image: string | null = b.image?.value || null
    const { lat, lng } = parseCoord(b.coord?.value)
    const mapUrl = lat !== null && lng !== null ? buildMapUrl(lat, lng) : null

    return {
      id,
      arabicName,
      englishName,
      district,
      population: {
        year1945: null,
        estimatedRefugees: null,
        notes: null,
      },
      depopulatedDate: null,
      depopulatedYear: null,
      depopulationNotes: null,
      location: {
        latitude: lat,
        longitude: lng,
        mapUrl,
      },
      imageUrl: image,
      familyNames: [],
      sources: {
        wikidata: uri ? `https://www.wikidata.org/wiki/${id}` : undefined,
      },
    }
  })

  const deduped = dedupeById(villages)
  writeCache(deduped)
  return deduped
}

async function getAll(): Promise<DepopulatedVillage[]> {
  const publicVillages = await fetchFromWikidata()
  const { overrides, manual } = villageOverridesService.getAll()
  const merged = mergeVillages(publicVillages, overrides, manual)
  return sortByArabic(merged)
}

async function getById(id: string): Promise<DepopulatedVillage | null> {
  const all = await getAll()
  return all.find(v => v.id === id) || null
}

function clearCache(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(CACHE_KEY)
  } catch {
    // ignore
  }
}

export const depopulatedVillagesService = {
  fetchFromWikidata,
  getAll,
  getById,
  clearCache,
}
