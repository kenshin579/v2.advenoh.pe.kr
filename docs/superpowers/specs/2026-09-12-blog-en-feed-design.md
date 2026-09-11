# 영어 모드에서 IT 블로그를 영어로 보여주기 — 디자인 문서

- 날짜: 2026-09-12
- 대상: `v2.advenoh.pe.kr` (포트폴리오), `blog-v2.advenoh.pe.kr` (IT 블로그, CORS 헤더만)
- 결정 방식: 브레인스토밍 Q&A로 항목별 확정

## 목표

포트폴리오 영어 페이지(`/`)에서 IT 블로그 관련 콘텐츠를 영어 버전으로 보여준다.

- 중앙 `writing.it` 섹션, 우측 레일 Latest posts, 커맨드 팔레트의 IT 블로그 글 → 영어 RSS(`https://blog.advenoh.pe.kr/en/rss.xml`)의 글
- 포트폴리오 IT Blog 카드 링크 → `https://blog.advenoh.pe.kr/en/`

한국어 페이지(`/ko/`)는 지금과 동일하다.

## 현황

- 포트폴리오는 locale과 무관하게 한국어 RSS(`https://blog.advenoh.pe.kr/rss.xml`)만 사용한다.
  빌드 시 `lib/writing.ts`가 fetch(+ `.cache/` 폴백)하고, 브라우저에서 `hooks/useLiveWriting.ts`가 재조회한다.
- blog-v2는 이미 `public/en/rss.xml`(영어 글 최신 20편, 링크 `/en/{slug}`)을 생성·배포한다. 영어 글 176편 / 한국어 190편.
- blog-v2 `netlify.toml`의 CORS 헤더는 `/rss.xml`에만 있다. `/en/rss.xml` 응답에는 `Access-Control-Allow-Origin`이 없어 브라우저 재조회가 막힌다.
- 투자 블로그는 영어 버전이 없다 (`https://investment.advenoh.pe.kr/en/rss.xml` → 404).
- 블로그 루트(`/`)는 Netlify `Language = ["en"]` 조건으로만 `/en/`에 302 redirect한다.
  한국어 브라우저에서 토글로 영어를 고른 방문자는 한국어 블로그로 간다.

## 결정 사항 (Q&A 요약)

1. **투자 블로그**: 영어 모드에서도 한국어 그대로 노출한다 (섹션·Latest posts 모두). 영어 버전이 없기 때문.
2. **IT Blog 카드 링크**: 포트폴리오 스키마에 locale별 `site_en`/`site_ko`를 추가하고 it-blog에 `site_en`을 지정한다.
3. **피드 사용 시점**: 빌드 타임과 브라우저 재조회 모두 locale에 맞는 피드를 쓴다 (정적 HTML부터 영어, SEO·깜빡임 문제 없음).
   브라우저에서만 교체하는 안과 빌드 타임에만 쓰는 안은 기각.

## 변경 사항

### 1. blog-v2: `/en/rss.xml` CORS 헤더 (별도 PR)

`blog-v2.advenoh.pe.kr/netlify.toml`에 기존 `/rss.xml` 블록과 같은 형태로 추가:

```toml
[[headers]]
  for = "/en/rss.xml"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

브랜치 `chore/en-rss-cors`. 포트폴리오 PR과 독립적이며, 배포 순서와 무관하게 깨지는 부분이 없다
(CORS 배포 전에는 브라우저 재조회만 실패하고 빌드 타임 영어 데이터가 유지된다).

### 2. 포트폴리오: 피드 설정

**`lib/site-config.ts`** — IT 블로그 RSS를 locale별로 분리:

```ts
rss: {
  blog: {
    ko: "https://blog.advenoh.pe.kr/rss.xml",
    en: "https://blog.advenoh.pe.kr/en/rss.xml",
  },
  investment: "https://investment.advenoh.pe.kr/rss.xml",
},
```

**`lib/writing-feeds.ts` (신규)** — fs 의존성이 없는 순수 모듈. 서버 로더와 클라이언트 hook이 공유하는
피드 목록의 단일 소스다. (`lib/writing.ts`는 fs 기반 `lib/cache.ts`를 import하므로 클라이언트에서 쓸 수 없다.)

```ts
import type { Locale } from '@/lib/i18n/types'
import { siteConfig } from '@/lib/site-config'

export type WritingSource = 'IT' | 'INV'

export type WritingFeed = {
  source: WritingSource
  url: string
  cacheFile: string
}

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
```

- 한국어 IT 캐시는 기존 파일명 `writing-blog.json`을 유지한다 (커밋된 시드 재사용).
- `WritingSource` 타입은 이 모듈로 옮기고 `lib/writing.ts`에서 re-export한다 (기존 import 경로 유지).

### 3. 포트폴리오: 데이터 흐름

**`lib/writing.ts`**
- `getWritingBlog()` / `getWritingInvestment()`를 `getWritingBundles(locale)`로 대체한다.
  `writingFeeds(locale)`를 순회하며 각 피드를 `withCache(feed.cacheFile, …)`로 불러와 `{ it, investment }` 번들을 반환한다.
- `getWritingSections(locale)`, `getLatestPosts(locale, limit = 10)`로 시그니처 변경. 내부 로직(IT/INV 각 5개, 병합 최신 10개, totals)은 동일.

**`lib/home-data.ts`** — 이미 받는 `locale`을 `getWritingSections(locale)`, `getLatestPosts(locale, 10)`에 전달.

**`hooks/useLiveWriting.ts`** — `useLiveWriting(initial, locale)`로 변경. 하드코딩된 `SOURCES` 대신
`writingFeeds(locale)`의 `{source, url}`로 재조회한다. `useEffect` 의존성에 `locale` 포함.

**`components/profile/ProfileShell.tsx`** — 이미 받는 `locale` prop을 `useLiveWriting(initialWriting, locale)`에 전달.

**`scripts/warm-cache.ts`** — `writing:blog`/`writing:investment` 대신 `ko`/`en` 각 locale로 `getWritingBundles`를
호출해 `writing-blog.json`, `writing-blog-en.json`, `writing-investment.json`을 생성한다.
생성된 `.cache/writing-blog-en.json` 시드를 커밋한다.

### 4. 포트폴리오: 카드 링크 (`site_en` / `site_ko`)

**`lib/portfolio.ts`**
- `portfolioItemSchema`에 `site_en: z.string().url().optional()`, `site_ko: z.string().url().optional()` 추가.
- 아이템 매핑에서 `site: pick(data, 'site', locale) ?? validated.site`.
  `pick`의 폴백 순서(해당 locale → 기본 `site` → 다른 locale)에 따라, `site_en`만 있는 항목은
  en에서 `site_en`, ko에서 기본 `site`를 쓴다.
- 이 값이 카드(`ProjectCardV2`)·모달(`ProjectModal`)·커맨드 팔레트·JSON-LD(`lib/structured-data.ts`)에 그대로 반영된다.
  제목 추출(`extractTitleFromUrl`)은 기존대로 기본 `site`를 쓴다.

**`contents/website/it-blog/index.md`** — `site_en: https://blog.advenoh.pe.kr/en/` 한 줄 추가 (`site:` 다음 줄).

## 에러 처리

기존 하이브리드 캐시 정책을 그대로 따른다.

- 빌드 타임 en 피드 fetch 실패 → `.cache/writing-blog-en.json`(stale) → 없으면 빈 목록(“no posts”).
- 브라우저 재조회 실패(네트워크/CORS) → 빌드 타임 데이터 유지.
- 영어 피드 실패 시 한국어 피드로 대체하는 폴백은 두지 않는다 (YAGNI, 시드 캐시가 커밋되어 있음).

## 테스트

**`tests/blog-locale.spec.ts` (신규, Playwright)**
- `/`: `#writing` 섹션의 글 링크(`a[href*="blog.advenoh.pe.kr"]`)가 1개 이상이고 모두 `https://blog.advenoh.pe.kr/en/`으로 시작.
  IT Blog 카드(`[data-project-card="it-blog"]`)는 링크가 아니라 클릭 시 모달을 여는 요소이므로, 카드를 클릭한 뒤
  열린 모달(`ProjectModal`)의 사이트 링크(`a[href^="https://blog.advenoh.pe.kr"]`) href가 `https://blog.advenoh.pe.kr/en/`인지 확인.
- `/ko/`: `#writing` 섹션 글 링크가 1개 이상이고 `/en/`을 포함하지 않음. 같은 방식으로 연 모달의 사이트 링크가 `https://blog.advenoh.pe.kr/`.

기존 검증: `npm run check`, `npm run lint`, `npm run build`, `npm test` 통과.

## 범위 제외

- 투자 블로그 관련 변경 (영어 버전 없음)
- BLOG POSTS 통계 계산 방식 (IT 피드가 ko/en 모두 20편이라 값 동일)
- `siteConfig.services` (현재 소비처 없음)
- blog-v2 RSS 생성 로직 (이미 `/en/rss.xml` 생성 중)
