import { siteConfig } from './site-config'
import type { Locale } from './i18n/types'

export type WritingSource = 'IT' | 'INV'

export type WritingFeed = {
  source: WritingSource
  url: string
  cacheFile: string
}

/**
 * locale → 수집 대상 피드 목록. 서버 로더(lib/writing.ts)와 클라이언트 재조회
 * hook(hooks/useLiveWriting.ts)이 공유하는 단일 소스다.
 * fs 의존성이 없어야 클라이언트 번들에 들어갈 수 있으므로 lib/cache.ts 를 import 하지 않는다.
 *
 * 투자 블로그는 영어판이 없어 locale 과 무관하게 한국어 피드를 쓴다.
 */
export function writingFeeds(locale: Locale): WritingFeed[] {
  return [
    {
      source: 'IT',
      url: siteConfig.external.rss.blog[locale],
      cacheFile: locale === 'en' ? 'writing-blog-en.json' : 'writing-blog.json',
    },
    {
      source: 'INV',
      url: siteConfig.external.rss.investment,
      cacheFile: 'writing-investment.json',
    },
  ]
}
