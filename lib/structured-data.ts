import { siteConfig } from './site-config'

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
