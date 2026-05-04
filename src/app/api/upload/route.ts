import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'])
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}
const MAX_BYTES = 8 * 1024 * 1024 // 8 MB

function randomChars(n: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let out = ''
  for (let i = 0; i < n; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
    }

    const mime = file.type
    if (!ALLOWED_MIME.has(mime)) {
      return NextResponse.json({ error: 'نوع الملف غير مدعوم' }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'حجم الملف يتجاوز 8 ميغابايت' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = EXT_BY_MIME[mime] || 'bin'
    const filename = `${Date.now()}-${randomChars(6)}.${ext}`
    const targetDir = path.join(process.cwd(), 'public', 'images', 'articles')
    await fs.mkdir(targetDir, { recursive: true })
    await fs.writeFile(path.join(targetDir, filename), buffer)

    const url = `/images/articles/${filename}`
    return NextResponse.json({ url })
  } catch (e) {
    console.error('POST /api/upload failed', e)
    return NextResponse.json({ error: 'فشل رفع الملف' }, { status: 500 })
  }
}
