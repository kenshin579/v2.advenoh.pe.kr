import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'
import { z } from 'zod'

export const portfolioItemSchema = z.object({
  site: z.string().url(),
  title: z.string().optional(),
  description: z.string(),
  cover: z.string().optional(),

  // Profile v2 확장 필드 — 기존 레이아웃 호환을 위해 전부 optional
  status: z.string().optional(),
  year: z.string().optional(),
  role: z.string().optional(),
  stack: z.array(z.string()).optional(),
  dek: z.string().optional(),
  overview: z.string().optional(),
  featured: z.boolean().optional(),
  ext: z.string().optional(),
  order: z.number().optional(),
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

export function getPortfolioItems(): PortfolioItem[] {
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
      const title = validated.title || extractTitleFromUrl(validated.site)
      const overviewHtml = renderOverviewHtml(validated.overview, folder.name)

      const item: PortfolioItem = {
        ...validated,
        title,
        slug: folder.name,
        ...(overviewHtml ? { overviewHtml } : {}),
      }
      return item
    })
    .filter((item): item is PortfolioItem => item !== null)

  // order가 있는 항목 우선, 그 다음 slug 알파벳 순
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
