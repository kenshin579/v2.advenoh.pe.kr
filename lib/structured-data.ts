import { siteConfig } from './site-config'
import type { PortfolioItem } from './portfolio'

export function getPersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    sameAs: [
      siteConfig.author.social.linkedin,
      siteConfig.author.social.github,
      siteConfig.author.social.instagram,
    ],
    jobTitle: 'Software Engineer',
    description: siteConfig.description,
  }
}

export function getWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  }
}

export function getProjectsItemListStructuredData(items: PortfolioItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Frank Oh — Projects',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: item.site,
      name: item.title,
      description: item.dek ?? item.description,
    })),
  }
}
