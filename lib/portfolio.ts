import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

// Zod schema for portfolio items
export const portfolioItemSchema = z.object({
  site: z.string().url(),
  title: z.string().optional(),
  description: z.string(),
})

export type PortfolioItem = {
  site: string
  title: string  // Always present after processing
  description: string
  slug: string
}

/**
 * contents/website/ 디렉토리에서 모든 포트폴리오 항목 로드
 */
export function getPortfolioItems(): PortfolioItem[] {
  const contentsDir = path.join(process.cwd(), 'contents/website')

  // 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(contentsDir)) {
    console.warn('Portfolio contents directory not found:', contentsDir)
    return []
  }

  const files = fs.readdirSync(contentsDir)
  const mdFiles = files.filter(file => file.endsWith('.md'))

  const items = mdFiles.map(filename => {
    const filePath = path.join(contentsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    // Zod로 검증
    const validated = portfolioItemSchema.parse(data)

    // title이 없으면 URL에서 추출
    const title = validated.title || extractTitleFromUrl(validated.site)

    return {
      ...validated,
      title,
      slug: filename.replace('.md', ''),
    }
  })

  // 파일명 기준 정렬 (기존 로직 유지)
  return items.sort((a, b) => a.slug.localeCompare(b.slug))
}

/**
 * URL에서 타이틀 추출 (기존 로직)
 */
function extractTitleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '').split('.')[0]
  } catch {
    return 'Untitled'
  }
}
