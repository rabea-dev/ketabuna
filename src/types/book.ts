export interface Book {
  id: string
  slug: string
  title: string
  author: string
  summary: string
  coverImage: string
  publishYear: number
  pageCount: number
  language: string
  category: string
  downloadAllowed: boolean
  pdfUrl?: string
  onlineReadUrl?: string
  status: 'draft' | 'published'
  featured?: boolean
  relatedBooks?: string[]
}
