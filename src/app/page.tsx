import HeroSection from '@/components/home/HeroSection'
import LatestArticles from '@/components/home/LatestArticles'
import FeaturedBooks from '@/components/home/FeaturedBooks'
import MostRead from '@/components/home/MostRead'
import { getFeaturedArticle, getPublishedArticles } from '@/data/articles'
import { getFeaturedBooks } from '@/data/books'

export default function HomePage() {
  const featuredArticle = getFeaturedArticle()
  const publishedArticles = getPublishedArticles()
  const latestArticles = publishedArticles.filter(a => !a.featured).slice(0, 6)
  const mostRead = publishedArticles.slice(0, 5)
  const featuredBooks = getFeaturedBooks()

  return (
    <>
      {/* Hero */}
      {featuredArticle && <HeroSection article={featuredArticle} />}

      <div className="max-w-content mx-auto px-4 py-10">
        {/* Main content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          {/* Latest Articles - takes 2 cols */}
          <div className="lg:col-span-2">
            <LatestArticles articles={latestArticles} />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <MostRead articles={mostRead} />
            </div>
          </aside>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-stone" />
          <span className="text-gold text-lg">◆</span>
          <div className="flex-1 h-px bg-stone" />
        </div>

        {/* Featured Books */}
        <FeaturedBooks books={featuredBooks} />
      </div>
    </>
  )
}
