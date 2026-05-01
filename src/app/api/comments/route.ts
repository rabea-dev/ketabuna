import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'comments.json')

function ensureDir() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function readComments() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
    }
  } catch {}
  return []
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const articleSlug = searchParams.get('article')
  const all = readComments()
  const filtered = articleSlug ? all.filter((c: any) => c.articleSlug === articleSlug) : all
  return NextResponse.json(filtered)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    if (!body.name || !body.text || !body.articleSlug) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    const comments = readComments()
    const newComment = {
      id: Date.now().toString(),
      articleSlug: body.articleSlug,
      name: body.name.trim(),
      text: body.text.trim(),
      createdAt: new Date().toISOString(),
    }
    comments.push(newComment)
    ensureDir()
    fs.writeFileSync(DATA_FILE, JSON.stringify(comments, null, 2))
    return NextResponse.json(newComment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save comment' }, { status: 500 })
  }
}
