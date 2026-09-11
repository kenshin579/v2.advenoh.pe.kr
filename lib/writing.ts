import { XMLParser } from 'fast-xml-parser'
import { z } from 'zod'
import { withCache } from './cache'
import { writingFeeds, type WritingSource } from './writing-feeds'
import type { Locale } from './i18n/types'

export type { WritingSource }

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

/**
 * locale 에 해당하는 IT/투자 번들을 캐시 정책과 함께 읽는다.
 * 캐시 파일은 writing-feeds.ts 가 결정한다 (ko: writing-blog.json, en: writing-blog-en.json).
 */
export async function getWritingBundles(
  locale: Locale
): Promise<{ it: WritingBundle; investment: WritingBundle }> {
  const [itFeed, invFeed] = writingFeeds(locale)
  const [it, investment] = await Promise.all([
    withCache(
      itFeed.cacheFile,
      () => fetchWritingBundle(itFeed.source, itFeed.url),
      buildFallback(),
      `writing:${itFeed.cacheFile}`
    ),
    withCache(
      invFeed.cacheFile,
      () => fetchWritingBundle(invFeed.source, invFeed.url),
      buildFallback(),
      `writing:${invFeed.cacheFile}`
    ),
  ])
  return { it, investment }
}

/**
 * 중앙 writing 섹션용 (IT / INV 각각 5개)
 */
export async function getWritingSections(locale: Locale) {
  const { it, investment } = await getWritingBundles(locale)
  return {
    it: it.items.slice(0, 5),
    investment: investment.items.slice(0, 5),
    totals: { it: it.items.length, investment: investment.items.length },
  }
}

/**
 * 우측 레일 Latest posts용 (IT+INV 병합, 날짜순 상위 10개)
 */
export async function getLatestPosts(locale: Locale, limit = 10): Promise<WritingItem[]> {
  const { it, investment } = await getWritingBundles(locale)
  return [...it.items, ...investment.items]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit)
}
