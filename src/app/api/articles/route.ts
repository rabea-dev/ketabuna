import { NextResponse } from 'next/server'
import { listArticles, createArticle } from '@/lib/articleRepo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const filter: { status?: 'draft' | 'published' } | undefined =
      status === 'published' || status === 'draft' ? { status } : undefined
    const articles = listArticles(filter)
    return NextResponse.json(articles)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const created = createArticle({
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
    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error('POST /api/articles failed', e)
    return NextResponse.json({ error: 'Failed to save article' }, { status: 500 })
  }
}
