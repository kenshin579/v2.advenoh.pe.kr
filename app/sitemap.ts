import { MetadataRoute } from 'next'
import { getPortfolioItems } from '@/lib/portfolio'
import { siteConfig } from '@/lib/site-config'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const portfolioItems = getPortfolioItems('en')

  // Homepage (en) with hreflang alternates
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${siteConfig.url}/`,
          ko: `${siteConfig.url}/ko/`,
        },
      },
    },
    // Homepage (ko)
    {
      url: `${siteConfig.url}/ko/`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ]

  // Portfolio items (external links - 참고용으로만 포함)
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `${siteConfig.url}/#${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...portfolioRoutes]
}
