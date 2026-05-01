import type {
  DepopulatedVillage,
  DepopulatedVillageOverride,
} from '@/types/depopulated-village'

const STORAGE_KEY = 'village-overrides'

type Storage = {
  overrides: { [id: string]: DepopulatedVillageOverride }
  manual: { [id: string]: DepopulatedVillage }
}

function emptyStorage(): Storage {
  return { overrides: {}, manual: {} }
}

function read(): Storage {
  if (typeof window === 'undefined') return emptyStorage()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyStorage()
    const parsed = JSON.parse(raw) as Partial<Storage>
    return {
      overrides: parsed.overrides || {},
      manual: parsed.manual || {},
    }
  } catch {
    return emptyStorage()
  }
}

function write(data: Storage): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota errors
  }
}

function deleteAtPath(obj: any, path: string[]): void {
  if (path.length === 0) return
  if (path.length === 1) {
    delete obj[path[0]]
    return
  }
  const [head, ...rest] = path
  if (obj[head] && typeof obj[head] === 'object') {
    deleteAtPath(obj[head], rest)
    if (Object.keys(obj[head]).length === 0) delete obj[head]
  }
}

export const villageOverridesService = {
  getAll(): Storage {
    return read()
  },

  getOverride(id: string): DepopulatedVillageOverride | null {
    const data = read()
    return data.overrides[id] || null
  },

  setOverride(id: string, override: DepopulatedVillageOverride): void {
    const data = read()
    data.overrides[id] = { ...override, id }
    write(data)
  },

  clearOverride(id: string): void {
    const data = read()
    delete data.overrides[id]
    write(data)
  },

  clearOverrideField(id: string, fieldPath: string): void {
    const data = read()
    const override = data.overrides[id]
    if (!override) return
    const path = fieldPath.split('.')
    deleteAtPath(override as any, path)
    // If only `id` remains, drop the override entirely
    const keys = Object.keys(override).filter(k => k !== 'id')
    if (keys.length === 0) {
      delete data.overrides[id]
    } else {
      data.overrides[id] = override
    }
    write(data)
  },

  getManual(): DepopulatedVillage[] {
    const data = read()
    return Object.values(data.manual)
  },

  addManual(village: DepopulatedVillage): void {
    const data = read()
    const id = village.id || `manual-${Date.now()}`
    data.manual[id] = { ...village, id }
    write(data)
  },

  updateManual(id: string, village: DepopulatedVillage): void {
    const data = read()
    data.manual[id] = { ...village, id }
    write(data)
  },

  deleteManual(id: string): void {
    const data = read()
    delete data.manual[id]
    write(data)
  },
}
