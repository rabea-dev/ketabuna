import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { Article } from '@/types/article'

type DB = Database.Database

const DB_DIR = path.join(process.cwd(), 'data')
const DB_PATH = path.join(DB_DIR, 'ketabuna.db')

const SCHEMA = `
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author TEXT NOT NULL DEFAULT '',
  author_bio TEXT,
  published_at TEXT NOT NULL DEFAULT '',
  reading_time INTEGER NOT NULL DEFAULT 5,
  category TEXT NOT NULL DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  image_caption TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  sources TEXT NOT NULL DEFAULT '[]',
  key_points TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  featured INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000),
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now')*1000)
);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
`

const globalForDb = globalThis as unknown as { __ketabunaDb?: DB }

function safeJsonArray(text: string | null | undefined): string[] {
  if (!text) return []
  try {
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export interface ArticleRow {
  id: number
  slug: string
  title: string
  summary: string
  content: string
  author: string
  author_bio: string | null
  published_at: string
  reading_time: number
  category: string
  image: string
  image_caption: string | null
  tags: string
  sources: string
  key_points: string
  status: string
  featured: number
  created_at: number
  updated_at: number
}

export function rowToArticle(row: ArticleRow): Article {
  return {
    id: String(row.id),
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    content: row.content,
    author: row.author,
    authorBio: row.author_bio || undefined,
    publishedAt: row.published_at,
    readingTime: row.reading_time,
    category: row.category,
    image: row.image,
    imageCaption: row.image_caption || undefined,
    tags: safeJsonArray(row.tags),
    sources: safeJsonArray(row.sources),
    keyPoints: safeJsonArray(row.key_points),
    status: row.status === 'published' ? 'published' : 'draft',
    featured: row.featured === 1,
  }
}

export function articleToRow(article: Article): Omit<ArticleRow, 'created_at' | 'updated_at'> {
  return {
    id: Number(article.id),
    slug: article.slug,
    title: article.title,
    summary: article.summary || '',
    content: article.content || '',
    author: article.author || '',
    author_bio: article.authorBio ?? null,
    published_at: article.publishedAt || '',
    reading_time: article.readingTime || 5,
    category: article.category || '',
    image: article.image || '',
    image_caption: article.imageCaption ?? null,
    tags: JSON.stringify(article.tags || []),
    sources: JSON.stringify(article.sources || []),
    key_points: JSON.stringify(article.keyPoints || []),
    status: article.status === 'published' ? 'published' : 'draft',
    featured: article.featured ? 1 : 0,
  }
}

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
}

export function getDb(): DB {
  if (globalForDb.__ketabunaDb) return globalForDb.__ketabunaDb

  ensureDir()
  const db = new Database(DB_PATH)
  db.pragma('journal_mode = WAL')
  db.exec(SCHEMA)

  // Lazy seed if empty — import inside fn to avoid circular dep at module load
  const count = db.prepare('SELECT COUNT(*) as c FROM articles').get() as { c: number }
  if (count.c === 0) {
    // Defer require to runtime to avoid TS circular import surprises
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { seedDb } = require('./seedDb') as typeof import('./seedDb')
    seedDb(db)
  }

  globalForDb.__ketabunaDb = db
  return db
}
