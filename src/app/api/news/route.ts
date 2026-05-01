import { NextResponse } from 'next/server'

const FEEDS = [
  {
    name: 'BBC عربي',
    url: 'https://feeds.bbci.co.uk/arabic/rss.xml',
  },
  {
    name: 'الجزيرة',
    url: 'https://www.aljazeera.net/rss',
  },
]

function extractTitles(xml: string): string[] {
  const titles: string[] = []

  // Match CDATA titles
  const cdataRe = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/g
  let m
  while ((m = cdataRe.exec(xml)) !== null) {
    const t = m[1].trim()
    if (t.length > 15 && !/^(BBC|الجزيرة|Reuters|RSS)/.test(t)) {
      titles.push(t)
    }
  }

  if (titles.length > 0) return titles.slice(0, 12)

  // Fallback: plain titles
  const plainRe = /<title>([\s\S]*?)<\/title>/g
  while ((m = plainRe.exec(xml)) !== null) {
    const t = m[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim()
    if (t.length > 15) titles.push(t)
  }

  return titles.slice(0, 12)
}

export const revalidate = 600 // cache 10 minutes

export async function GET() {
  for (const feed of FEEDS) {
    try {
      const res = await fetch(feed.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Ketabuna/1.0)' },
        next: { revalidate: 600 },
      })
      if (!res.ok) continue

      const xml = await res.text()
      const titles = extractTitles(xml)

      if (titles.length > 0) {
        return NextResponse.json({ titles, source: feed.name })
      }
    } catch {
      continue
    }
  }

  return NextResponse.json({ titles: [], source: null }, { status: 503 })
}
