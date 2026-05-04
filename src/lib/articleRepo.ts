import { getDb, rowToArticle, ArticleRow } from './db'
import { Article } from '@/types/article'

function sortDabajaFirst(list: Article[]): Article[] {
  const order = (author: string) => {
    if (author === 'صلاح دباجة') return 0
    if (author === 'إبراهيم مالك') return 1
    return 2
  }
  return [...list].sort((a, b) => order(a.author) - order(b.author))
}

export interface ListFilter {
  status?: 'draft' | 'published'
  featured?: boolean
}

export function listArticles(filter?: ListFilter): Article[] {
  const db = getDb()
  const where: string[] = []
  const params: Record<string, unknown> = {}
  if (filter?.status) {
    where.push('status = @status')
    params.status = filter.status
  }
  if (typeof filter?.featured === 'boolean') {
    where.push('featured = @featured')
    params.featured = filter.featured ? 1 : 0
  }
  const sql = `SELECT * FROM articles ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id ASC`
  const rows = db.prepare(sql).all(params) as ArticleRow[]
  return rows.map(rowToArticle)
}

export function getArticleBySlug(slug: string): Article | undefined {
  const db = getDb()
  const row = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug) as ArticleRow | undefined
  return row ? rowToArticle(row) : undefined
}

export function getArticleById(id: string | number): Article | undefined {
  const db = getDb()
  const numId = Number(id)
  if (Number.isNaN(numId)) return undefined
  const row = db.prepare('SELECT * FROM articles WHERE id = ?').get(numId) as ArticleRow | undefined
  return row ? rowToArticle(row) : undefined
}

export function getPublishedArticles(): Article[] {
  return sortDabajaFirst(listArticles({ status: 'published' }))
}

export function getFeaturedArticle(): Article | undefined {
  const db = getDb()
  const row = db
    .prepare("SELECT * FROM articles WHERE featured = 1 AND status = 'published' LIMIT 1")
    .get() as ArticleRow | undefined
  return row ? rowToArticle(row) : undefined
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const db = getDb()
  const rows = db
    .prepare(
      "SELECT * FROM articles WHERE id != ? AND status = 'published' AND category = ? LIMIT ?"
    )
    .all(Number(article.id), article.category, limit) as ArticleRow[]
  return rows.map(rowToArticle)
}

function arabicSlugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^؀-ۿa-zA-Z0-9\-]/g, '')
    .slice(0, 80)
}

function computeReadingTime(content: string): number {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

/**
 * Convert plain-text content (with newlines) into HTML paragraphs.
 * If the content already contains block-level HTML (<p>, <h2>, <ul>, etc.) it's
 * left untouched so existing HTML-authored articles still work.
 *
 * Rules for plain text:
 *   - Two or more newlines  → paragraph break ( </p><p> )
 *   - Single newline        → line break    ( <br /> )
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function normalizeContent(content: string): string {
  if (!content) return ''

  // If author already used FULL block HTML (paragraphs, headings, etc.), trust it as-is.
  // We only check for tags that imply the whole content is structured HTML — img/br alone
  // don't qualify because users may insert images via the toolbar between plain-text paragraphs.
  if (/<\s*(p|h[1-6]|ul|ol|blockquote|pre|figure|table|div)[\s>/]/i.test(content)) {
    return content
  }

  // Mixed mode: plain text possibly with inline <img> tags.
  // Split content while preserving the <img> tags as separate segments.
  const parts = content.split(/(<img[^>]*>)/i)

  const out: string[] = []
  for (const part of parts) {
    if (/^<img/i.test(part)) {
      // Wrap image in a figure for clean styling and centering
      out.push(`<figure class="article-inline-image">${part}</figure>`)
      continue
    }
    // Plain text segment → split into paragraphs
    const text = part.replace(/\r\n/g, '\n').trim()
    if (!text) continue
    const paragraphs = text
      .split(/\n\s*\n+/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br />')}</p>`)
    out.push(...paragraphs)
  }
  return out.join('\n')
}

function uniqueSlug(base: string, db = getDb()): string {
  let slug = base || 'article'
  let n = 0
  while (db.prepare('SELECT 1 FROM articles WHERE slug = ?').get(slug)) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

export interface CreateArticleInput {
  title: string
  summary?: string
  content?: string
  author?: string
  authorBio?: string
  publishedAt?: string
  readingTime?: number
  category?: string
  image?: string
  imageCaption?: string
  tags?: string[] | string
  sources?: string[] | string
  keyPoints?: string[] | string
  status?: 'draft' | 'published'
  featured?: boolean
  slug?: string
}

function normalizeArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean)
  if (typeof v === 'string') {
    return v
      .split(/[,\n]/)
      .map(s => s.trim())
      .filter(Boolean)
  }
  return []
}

export function createArticle(input: CreateArticleInput): Article {
  const db = getDb()
  const title = (input.title || '').trim() || 'بدون عنوان'
  const baseSlug = input.slug ? arabicSlugify(input.slug) : arabicSlugify(title)
  const slug = uniqueSlug(baseSlug || 'article', db)
  const content = normalizeContent(input.content || '')
  const readingTime = input.readingTime && input.readingTime > 0 ? input.readingTime : computeReadingTime(content)
  const publishedAt = input.publishedAt || new Date().toISOString().split('T')[0]

  const stmt = db.prepare(`
    INSERT INTO articles (
      slug, title, summary, content, author, author_bio,
      published_at, reading_time, category, image, image_caption,
      tags, sources, key_points, status, featured
    ) VALUES (
      @slug, @title, @summary, @content, @author, @author_bio,
      @published_at, @reading_time, @category, @image, @image_caption,
      @tags, @sources, @key_points, @status, @featured
    )
  `)

  const info = stmt.run({
    slug,
    title,
    summary: input.summary || '',
    content,
    author: input.author || '',
    author_bio: input.authorBio ?? null,
    published_at: publishedAt,
    reading_time: readingTime,
    category: input.category || '',
    image: input.image || '',
    image_caption: input.imageCaption ?? null,
    tags: JSON.stringify(normalizeArray(input.tags)),
    sources: JSON.stringify(normalizeArray(input.sources)),
    key_points: JSON.stringify(normalizeArray(input.keyPoints)),
    status: input.status === 'published' ? 'published' : 'draft',
    featured: input.featured ? 1 : 0,
  })

  const created = getArticleById(Number(info.lastInsertRowid))
  if (!created) throw new Error('Failed to create article')
  return created
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {}

export function updateArticle(id: string | number, input: UpdateArticleInput): Article | undefined {
  const db = getDb()
  const existing = getArticleById(id)
  if (!existing) return undefined

  const merged: Article = {
    ...existing,
    ...(input.title !== undefined ? { title: input.title } : {}),
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
    ...(input.content !== undefined ? { content: normalizeContent(input.content) } : {}),
    ...(input.author !== undefined ? { author: input.author } : {}),
    ...(input.authorBio !== undefined ? { authorBio: input.authorBio } : {}),
    ...(input.publishedAt !== undefined ? { publishedAt: input.publishedAt } : {}),
    ...(input.category !== undefined ? { category: input.category } : {}),
    ...(input.image !== undefined ? { image: input.image } : {}),
    ...(input.imageCaption !== undefined ? { imageCaption: input.imageCaption } : {}),
    ...(input.status !== undefined ? { status: input.status === 'published' ? 'published' : 'draft' } : {}),
    ...(input.featured !== undefined ? { featured: !!input.featured } : {}),
    ...(input.tags !== undefined ? { tags: normalizeArray(input.tags) } : {}),
    ...(input.sources !== undefined ? { sources: normalizeArray(input.sources) } : {}),
    ...(input.keyPoints !== undefined ? { keyPoints: normalizeArray(input.keyPoints) } : {}),
  }

  // recompute reading time if content changed and no explicit value passed
  if (input.content !== undefined && input.readingTime === undefined) {
    merged.readingTime = computeReadingTime(merged.content)
  } else if (input.readingTime !== undefined && input.readingTime > 0) {
    merged.readingTime = input.readingTime
  }

  // slug update only if explicitly provided
  if (input.slug && input.slug !== existing.slug) {
    merged.slug = uniqueSlug(arabicSlugify(input.slug), db)
  }

  db.prepare(`
    UPDATE articles SET
      slug = @slug,
      title = @title,
      summary = @summary,
      content = @content,
      author = @author,
      author_bio = @author_bio,
      published_at = @published_at,
      reading_time = @reading_time,
      category = @category,
      image = @image,
      image_caption = @image_caption,
      tags = @tags,
      sources = @sources,
      key_points = @key_points,
      status = @status,
      featured = @featured,
      updated_at = @updated_at
    WHERE id = @id
  `).run({
    id: Number(existing.id),
    slug: merged.slug,
    title: merged.title,
    summary: merged.summary || '',
    content: merged.content || '',
    author: merged.author || '',
    author_bio: merged.authorBio ?? null,
    published_at: merged.publishedAt || '',
    reading_time: merged.readingTime || 5,
    category: merged.category || '',
    image: merged.image || '',
    image_caption: merged.imageCaption ?? null,
    tags: JSON.stringify(merged.tags || []),
    sources: JSON.stringify(merged.sources || []),
    key_points: JSON.stringify(merged.keyPoints || []),
    status: merged.status,
    featured: merged.featured ? 1 : 0,
    updated_at: Date.now(),
  })

  return getArticleById(id)
}

export function deleteArticle(id: string | number): boolean {
  const db = getDb()
  const numId = Number(id)
  if (Number.isNaN(numId)) return false
  const info = db.prepare('DELETE FROM articles WHERE id = ?').run(numId)
  return info.changes > 0
}
