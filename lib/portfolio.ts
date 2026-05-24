import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { z } from 'zod'
import type { Locale } from './i18n/types'

export const portfolioItemSchema = z.object({
  site: z.string().url(),
  title: z.string().optional(),
  cover: z.string().optional(),
  stack: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  ext: z.string().optional(),
  order: z.number().optional(),

  description: z.string().optional(),
  description_en: z.string().optional(),
  description_ko: z.string().optional(),
  dek: z.string().optional(),
  dek_en: z.string().optional(),
  dek_ko: z.string().optional(),
  overview: z.string().optional(),
  overview_en: z.string().optional(),
  overview_ko: z.string().optional(),
  status: z.string().optional(),
  status_en: z.string().optional(),
  status_ko: z.string().optional(),
  year: z.string().optional(),
  year_en: z.string().optional(),
  year_ko: z.string().optional(),
  role: z.string().optional(),
  role_en: z.string().optional(),
  role_ko: z.string().optional(),
})

export type PortfolioItem = {
  site: string
  title: string
  description: string
  cover?: string
  slug: string

  status?: string
  year?: string
  role?: string
  stack?: string[]
  dek?: string
  overview?: string
  overviewHtml?: string
  featured?: boolean
  ext?: string
  order?: number
}

function renderOverviewHtml(source: string | undefined, slug: string): string | undefined {
  if (!source) return undefined
  try {
    return marked.parse(source, { async: false, gfm: true, breaks: false }) as string
  } catch (err) {
    console.warn(`Failed to render overview Markdown for ${slug}:`, err)
    return source
  }
}

function pick(
  data: Record<string, unknown>,
  base: string,
  locale: Locale,
): string | undefined {
  const localed = data[`${base}_${locale}`]
  if (typeof localed === 'string' && localed.trim()) return localed
  const fallback = data[base]
  if (typeof fallback === 'string' && fallback.trim()) return fallback
  const other = data[`${base}_${locale === 'en' ? 'ko' : 'en'}`]
  return typeof other === 'string' ? other : undefined
}

export function getPortfolioItems(locale: Locale): PortfolioItem[] {
  const contentsDir = path.join(process.cwd(), 'contents/website')
  if (!fs.existsSync(contentsDir)) {
    console.warn('Portfolio contents directory not found:', contentsDir)
    return []
  }

  const entries = fs.readdirSync(contentsDir, { withFileTypes: true })
  const folders = entries.filter(entry => entry.isDirectory())

  const items = folders
    .map(folder => {
      const indexPath = path.join(contentsDir, folder.name, 'index.md')
      if (!fs.existsSync(indexPath)) {
        console.warn(`No index.md found in ${folder.name}`)
        return null
      }

      const fileContents = fs.readFileSync(indexPath, 'utf8')
      const { data } = matter(fileContents)
      const validated = portfolioItemSchema.parse(data)

      const description = pick(data, 'description', locale) ?? ''
      const dek = pick(data, 'dek', locale)
      const overview = pick(data, 'overview', locale)
      const title = validated.title || extractTitleFromUrl(validated.site)
      const overviewHtml = renderOverviewHtml(overview, folder.name)

      const item: PortfolioItem = {
        site: validated.site,
        title,
        description,
        cover: validated.cover,
        slug: folder.name,
        status: pick(data, 'status', locale),
        year: pick(data, 'year', locale),
        role: pick(data, 'role', locale),
        stack: validated.stack,
        dek,
        overview,
        featured: validated.featured,
        ext: validated.ext,
        order: validated.order,
        ...(overviewHtml ? { overviewHtml } : {}),
      }
      return item
    })
    .filter((item): item is PortfolioItem => item !== null)

  return items.sort((a, b) => {
    const aOrder = a.order ?? Number.POSITIVE_INFINITY
    const bOrder = b.order ?? Number.POSITIVE_INFINITY
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.slug.localeCompare(b.slug)
  })
}

function extractTitleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '').split('.')[0]
  } catch {
    return 'Untitled'
  }
}
