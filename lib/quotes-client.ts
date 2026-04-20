import { z } from 'zod'

const INSPIRE_ME_URL = 'https://inspire-me.advenoh.pe.kr'

const todayQuoteSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.string(),
  authorSlug: z.string().optional().default(''),
  language: z.enum(['ko', 'en']),
  topics: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
})

const widgetRespSchema = z.object({ data: todayQuoteSchema })

export type TodayQuote = z.infer<typeof todayQuoteSchema>

export async function fetchTodayQuote(
  lang: 'ko' | 'en' = 'ko',
): Promise<TodayQuote | null> {
  try {
    const res = await fetch(
      `${INSPIRE_ME_URL}/api/widget/quote-of-the-day?lang=${lang}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!res.ok) return null
    const body = await res.json()
    const parsed = widgetRespSchema.safeParse(body)
    return parsed.success ? parsed.data.data : null
  } catch {
    return null
  }
}

export function quoteDetailUrl(id: string): string {
  return `${INSPIRE_ME_URL}/quotes/${id}`
}

export const FALLBACK_QUOTE: TodayQuote = {
  id: '',
  content: "Code is like humor. When you have to explain it, it's bad.",
  author: 'Cory House',
  authorSlug: '',
  language: 'ko',
  topics: [],
  tags: [],
}
