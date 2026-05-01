export interface Article {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  author: string
  authorBio?: string
  publishedAt: string
  readingTime: number
  category: string
  image: string
  imageCaption?: string
  tags: string[]
  sources?: string[]
  keyPoints?: string[]
  status: 'draft' | 'published'
  featured?: boolean
}
