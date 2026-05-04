import type Database from 'better-sqlite3'
import { articles as seedArticles } from '@/data/articles'
import { articleToRow } from './db'

export function seedDb(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO articles (
      id, slug, title, summary, content, author, author_bio,
      published_at, reading_time, category, image, image_caption,
      tags, sources, key_points, status, featured
    ) VALUES (
      @id, @slug, @title, @summary, @content, @author, @author_bio,
      @published_at, @reading_time, @category, @image, @image_caption,
      @tags, @sources, @key_points, @status, @featured
    )
  `)

  const tx = db.transaction((rows: ReturnType<typeof articleToRow>[]) => {
    for (const row of rows) insert.run(row)
  })

  const rows = seedArticles.map(a => articleToRow(a))
  tx(rows)
}
