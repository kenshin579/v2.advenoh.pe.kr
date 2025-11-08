import { MetadataRoute } from 'next'
import { getPortfolioItems } from '@/lib/portfolio'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const portfolioItems = getPortfolioItems()

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: 'https://advenoh.pe.kr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  // Portfolio items (external links - 참고용으로만 포함)
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `https://advenoh.pe.kr/#${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...portfolioRoutes]
}
