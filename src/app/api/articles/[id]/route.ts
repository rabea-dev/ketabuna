import { NextResponse } from 'next/server'
import { getArticleById, updateArticle, deleteArticle } from '@/lib/articleRepo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface Ctx {
  params: { id: string }
}

export async function GET(_req: Request, { params }: Ctx) {
  const article = getArticleById(params.id)
  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    const body = await request.json()
    const updated = updateArticle(params.id, {
      title: body.title,
      summary: body.summary,
      content: body.content,
      author: body.author,
      authorBio: body.authorBio,
      category: body.category,
      tags: body.tags,
      sources: body.sources,
      keyPoints: body.keyPoints,
      image: body.image,
      imageCaption: body.imageCaption,
      status: body.status,
      featured: body.featured,
      publishedAt: body.publishedAt,
      slug: body.slug,
    })
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    console.error('PUT /api/articles/[id] failed', e)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const ok = deleteArticle(params.id)
  if (!ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return new NextResponse(null, { status: 204 })
}
