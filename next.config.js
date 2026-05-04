/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'commons.wikimedia.org', 'upload.wikimedia.org'],
  },
  experimental: {
    serverComponentsExternalPackages: ['better-sqlite3'],
  },

  // Cache headers — make regular refresh always show new content
  async headers() {
    return [
      {
        // Hashed JS/CSS bundles — cache forever (filename changes on every deploy)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // User-uploaded images — cache 1 day
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, must-revalidate' },
        ],
      },
      {
        // Everything else (HTML pages, API responses) — never cache
        // This ensures a regular refresh always fetches the latest content after a deploy
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
