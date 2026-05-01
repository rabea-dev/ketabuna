import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'articles-extra.json')

function ensureDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readArticles() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    }
  } catch {}
  return []
}

function slugify(text: string) {
  return text.trim().replace(/\s+/g, '-').replace(/[^؀-ۿa-zA-Z0-9\-]/g, '').slice(0, 80)
}

export async function GET() {
  return NextResponse.json(readArticles())
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const articles = readArticles()
    const id = Date.now()
    const newArticle = {
      id,
      title: body.title,
      slug: slugify(body.title) + '-' + id,
      summary: body.summary || '',
      content: body.content || '',
      author: body.author || '',
      authorBio: '',
      category: body.category || 'ثقافة وأدب',
      tags: body.tags ? body.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      image: body.image || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80',
      imageCaption: '',
      publishedAt: new Date().toISOString().split('T')[0],
      readingTime: Math.max(1, Math.ceil(body.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200)),
      status: body.status || 'draft',
      featured: false,
      sources: body.sources || '',
    }
    articles.push(newArticle)
    ensureDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2))
    return NextResponse.json(newArticle, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 })
  }
}
