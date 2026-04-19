import { XMLParser } from 'fast-xml-parser'
import { z } from 'zod'
import { withCache } from './cache'
import { siteConfig } from './site-config'

export type WritingSource = 'IT' | 'INV'

export const writingItemSchema = z.object({
  source: z.enum(['IT', 'INV']),
  title: z.string(),
  link: z.string().url(),
  pubDate: z.string(),
  description: z.string().optional(),
})

export const writingBundleSchema = z.object({
  fetchedAt: z.string(),
  items: z.array(writingItemSchema),
})

export type WritingItem = z.infer<typeof writingItemSchema>
export type WritingBundle = z.infer<typeof writingBundleSchema>

function buildFallback(): WritingBundle {
  return { fetchedAt: new Date(0).toISOString(), items: [] }
}

function parseRss(xml: string, source: WritingSource): WritingItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: '__cdata',
    textNodeName: '__text',
  })
  const parsed = parser.parse(xml)
  const channel = parsed?.rss?.channel
  if (!channel) return []
  const rawItems = Array.isArray(channel.item) ? channel.item : channel.item ? [channel.item] : []

  return rawItems.map((raw: Record<string, unknown>) => {
    const take = (v: unknown): string => {
      if (typeof v === 'string') return v
      if (v && typeof v === 'object') {
        const obj = v as { __cdata?: string; __text?: string }
        return obj.__cdata ?? obj.__text ?? ''
      }
      return ''
    }
    return {
      source,
      title: take(raw.title).trim(),
      link: take(raw.link).trim(),
      pubDate: take(raw.pubDate).trim(),
      description: take(raw.description).trim() || undefined,
    }
  })
}

async function fetchFeed(url: string, source: WritingSource): Promise<WritingItem[]> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${source} RSS ${res.status}`)
  const xml = await res.text()
  return parseRss(xml, source)
}

async function fetchWritingBundle(source: WritingSource, url: string): Promise<WritingBundle> {
  const items = await fetchFeed(url, source)
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  const bundle = { fetchedAt: new Date().toISOString(), items }
  return writingBundleSchema.parse(bundle)
}

export function getWritingBlog(): Promise<WritingBundle> {
  return withCache(
    'writing-blog.json',
    () => fetchWritingBundle('IT', siteConfig.external.rss.blog),
    buildFallback(),
    'writing:blog'
  )
}

export function getWritingInvestment(): Promise<WritingBundle> {
  return withCache(
    'writing-investment.json',
    () => fetchWritingBundle('INV', siteConfig.external.rss.investment),
    buildFallback(),
    'writing:investment'
  )
}

/**
 * 중앙 writing 섹션용 (IT / INV 각각 5개)
 */
export async function getWritingSections() {
  const [itBundle, invBundle] = await Promise.all([getWritingBlog(), getWritingInvestment()])
  return {
    it: itBundle.items.slice(0, 5),
    investment: invBundle.items.slice(0, 5),
  }
}

/**
 * 우측 레일 Latest posts용 (IT+INV 병합, 날짜순 상위 6개)
 */
export async function getLatestPosts(limit = 6): Promise<WritingItem[]> {
  const [itBundle, invBundle] = await Promise.all([getWritingBlog(), getWritingInvestment()])
  return [...itBundle.items, ...invBundle.items]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit)
}
