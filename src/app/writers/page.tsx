import { Metadata } from 'next'
import Link from 'next/link'
import { listArticles } from '@/lib/articleRepo'

export const metadata: Metadata = {
  title: 'الكتّاب',
  description: 'تعرّف على كتّاب كتابنا — أقلام عربية مميزة في الثقافة والأدب والفكر والشأن الإنساني',
}

export const dynamic = 'force-dynamic'

interface AuthorInfo {
  name: string
  bio: string
  specialty: string
  articleCount: number
  articles: { slug: string; title: string; publishedAt: string; category: string }[]
  image?: string
}

const authorsData: Record<string, { bio: string; specialty: string; image?: string }> = {
  'صلاح دباجة': {
    bio: 'كاتب وصحفي فلسطيني مخضرم، يكتب في صحيفة الاتحاد. تتنوع مقالاته بين الشأن الاجتماعي والسياسي والإنساني، ويرسم بقلمه لوحات من ذاكرة الأرض الفلسطينية وإشكاليات العدالة الاقتصادية في العالم.',
    specialty: 'الشأن الفلسطيني والعدالة الاجتماعية',
  },
  'أ. سارة المنصوري': {
    bio: 'ناقدة أدبية ومتخصصة في الدراسات الثقافية، تكتب بانتظام في المجلات الأدبية العربية. اهتمامها الأول هو مستقبل الأدب العربي في ظل التحولات الرقمية.',
    specialty: 'النقد الأدبي والدراسات الثقافية',
  },
  'د. خالد الشمري': {
    bio: 'مؤرخ وباحث في التراث المعماري الإسلامي، يحاضر في عدد من الجامعات العربية. يسعى إلى توثيق الحضارة الإسلامية وتقديمها للقارئ المعاصر بأسلوب علمي شيّق.',
    specialty: 'التراث المعماري والتاريخ الإسلامي',
  },
  'أ. منى الحسيني': {
    bio: 'شاعرة وأديبة، ولجت عالم الشعر العربي من بوابة التجديد دون أن تقطع صلتها بالموروث الشعري العريق. نشرت ديوانين وتكتب النقد الشعري.',
    specialty: 'الشعر العربي المعاصر',
  },
  'د. لين العبيدي': {
    bio: 'باحثة متخصصة في علم اللغويات والترجمة، تعمل على مشاريع الحفاظ على اللغة العربية في مواجهة هيمنة الإنجليزية. تدرس في إحدى الجامعات المغربية.',
    specialty: 'اللغويات والترجمة',
  },
  'أ.د. ياسر الزيات': {
    bio: 'أستاذ في الفلسفة وعلم الاجتماع، اهتمامه الأكاديمي يتمحور حول إشكاليات الهوية الثقافية والحداثة في العالم العربي. كاتب وباحث منشور دولياً.',
    specialty: 'الفلسفة والهوية الثقافية',
  },
  'د. رانيا مصطفى': {
    bio: 'كاتبة متخصصة في الأنثروبولوجيا الثقافية، تهتم برصد الظواهر الاجتماعية للمجتمعات العربية وتحليلها. تعمل على مشاريع توثيق التراث الشفهي.',
    specialty: 'الأنثروبولوجيا الثقافية',
  },
  'أ. طارق العلوي': {
    bio: 'صحفي ثقافي وكاتب في الشؤون المجتمعية، يرصد التحولات التي تعيشها المجتمعات العربية في ظل العولمة ومتغيرات العصر. يكتب بأسلوب سردي جذاب.',
    specialty: 'الصحافة الثقافية والشؤون المجتمعية',
  },
  'أ. حسام الدين الزين': {
    bio: 'ناقد أدبي ومترجم، ساهم في ترجمة عدد من الروايات العالمية إلى العربية. يكتب في النقد الأدبي المقارن ومسائل التلقي الأدبي في الثقافة العربية.',
    specialty: 'النقد الأدبي المقارن والترجمة',
  },
}

function getAuthorInitials(name: string): string {
  const parts = name.replace(/^(أ\.|د\.|أ\.د\.)\s*/, '').trim().split(' ')
  return parts[0]?.[0] || name[0]
}

function getAuthorColor(name: string): string {
  const colors = [
    'bg-forest text-white',
    'bg-gold text-white',
    'bg-navy text-white',
    'bg-forest-light text-white',
  ]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function WritersPage() {
  // Build author list from articles
  const authorMap = new Map<string, AuthorInfo>()
  const articles = listArticles()

  for (const article of articles) {
    if (article.status !== 'published') continue
    const existing = authorMap.get(article.author)
    const extra = authorsData[article.author] ?? {
      bio: article.authorBio ?? '',
      specialty: article.category,
    }
    if (!existing) {
      authorMap.set(article.author, {
        name: article.author,
        bio: extra.bio,
        specialty: extra.specialty,
        image: extra.image,
        articleCount: 1,
        articles: [{ slug: article.slug, title: article.title, publishedAt: article.publishedAt, category: article.category }],
      })
    } else {
      existing.articleCount++
      if (existing.articles.length < 3) {
        existing.articles.push({ slug: article.slug, title: article.title, publishedAt: article.publishedAt, category: article.category })
      }
    }
  }

  // Sort: صلاح دباجة first, then by article count
  const authors = Array.from(authorMap.values()).sort((a, b) => {
    if (a.name === 'صلاح دباجة') return -1
    if (b.name === 'صلاح دباجة') return 1
    return b.articleCount - a.articleCount
  })

  return (
    <div className="max-w-content mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="font-naskh font-bold text-3xl text-ink mb-2">الكتّاب</h1>
        <div className="h-0.5 w-16 bg-gold mb-4" />
        <p className="text-ink-muted font-naskh text-lg">
          أقلام عربية مميزة تُغني الفكر وتُضيء أفق القارئ العربي.
        </p>
      </div>

      {/* Authors grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {authors.map(author => (
          <div
            key={author.name}
            className="bg-white rounded-2xl border border-stone shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            {/* Top band */}
            <div className="h-1.5 bg-gradient-to-l from-gold via-forest to-forest-dark" />

            <div className="p-6">
              {/* Author header */}
              <div className="flex items-start gap-4 mb-5">
                {/* Avatar */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-naskh font-bold shrink-0 ${getAuthorColor(author.name)}`}>
                  {getAuthorInitials(author.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-naskh font-bold text-xl text-ink mb-0.5">{author.name}</h2>
                  <p className="text-gold text-sm font-naskh">{author.specialty}</p>
                  <span className="inline-block mt-1 bg-forest/8 text-forest text-xs font-naskh px-2.5 py-0.5 rounded-full">
                    {author.articleCount} {author.articleCount === 1 ? 'مقال' : 'مقالات'}
                  </span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-ink-muted font-naskh text-sm leading-relaxed mb-5 line-clamp-3">
                {author.bio}
              </p>

              {/* Latest articles */}
              {author.articles.length > 0 && (
                <div className="border-t border-stone/60 pt-4 mb-4">
                  <p className="text-ink-light text-xs font-naskh mb-3 uppercase tracking-wide">أحدث المقالات</p>
                  <ul className="space-y-2">
                    {author.articles.slice(0, 3).map(a => (
                      <li key={a.slug}>
                        <Link
                          href={`/articles/${a.slug}`}
                          className="flex items-start gap-2 group"
                        >
                          <span className="text-gold/60 mt-1 shrink-0">◂</span>
                          <span className="font-naskh text-sm text-ink group-hover:text-forest transition-colors line-clamp-1">
                            {a.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* View all articles link */}
              <Link
                href={`/articles?author=${encodeURIComponent(author.name)}`}
                className="inline-flex items-center gap-1.5 text-forest font-naskh text-sm hover:text-forest-light transition-colors font-medium"
              >
                جميع مقالات {author.name.split(' ')[0]}
                <svg className="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
