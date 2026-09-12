# 영어 모드 IT 블로그 영어 피드 전환 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포트폴리오 영어 페이지(`/`)에서 IT 블로그 글 목록과 IT Blog 카드 링크가 영어 블로그(`blog.advenoh.pe.kr/en/`)를 가리키게 한다.

**Architecture:** IT 블로그 RSS URL을 locale별로 나누고(`lib/site-config.ts`), fs 의존성이 없는 `lib/writing-feeds.ts`가 locale → 피드 목록(URL + 캐시 파일)의 단일 소스가 된다. 서버 로더(`lib/writing.ts`)와 클라이언트 재조회 hook(`hooks/useLiveWriting.ts`)이 같은 함수를 쓰므로 URL이 두 곳에 흩어지지 않는다. 카드 링크는 포트폴리오 frontmatter에 `site_en`/`site_ko`를 허용해 해결한다. 투자 블로그는 영어판이 없어 locale과 무관하게 한국어 피드를 유지한다.

**Tech Stack:** Next.js 16 static export, TypeScript, zod, fast-xml-parser, Playwright.

**Spec:** `docs/superpowers/specs/2026-09-12-blog-en-feed-design.md`

**Branch:** `feature/blog-en-feed` (이미 생성됨, 설계 문서 커밋 완료). 단 Task 7의 blog-v2 변경은 **다른 저장소**의 별도 브랜치에서 한다.

**작업 디렉토리:** 별도 표기가 없으면 모든 명령은 `/Users/user/src/workspace_blogv2/v2.advenoh.pe.kr`에서 실행한다.

**사전 확인:** Playwright 브라우저가 없으면 테스트가 "Executable doesn't exist"로 실패한다. 최초 1회 `npx playwright install chromium`을 실행한다. 테스트 실행 시에는 `CI=1 npx playwright test --reporter=list` 형태를 쓴다(기본 html 리포터가 실패 후 브라우저를 열려다 멈추는 것을 피한다).

---

### Task 1: 실패하는 e2e 테스트 추가 (TDD)

**Files:**
- Create: `tests/blog-locale.spec.ts`

기존 테스트 스타일은 `tests/i18n.spec.ts`, `tests/status-link.spec.ts`와 같다(테스트 이름은 한국어, `@playwright/test` 사용, `playwright.config.ts`의 `baseURL`이 `http://localhost:3000`, webServer가 `npm run dev`를 띄움).

- [ ] **Step 1: 테스트 파일 작성**

`tests/blog-locale.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

const EN_BLOG = 'https://blog.advenoh.pe.kr/en/'

test('영어 페이지의 IT 블로그 글 링크는 모두 /en/ 을 가리킨다', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('#writing a[href*="blog.advenoh.pe.kr"]')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    expect(await links.nth(i).getAttribute('href')).toContain(EN_BLOG)
  }
})

test('한국어 페이지의 IT 블로그 글 링크는 /en/ 을 가리키지 않는다', async ({ page }) => {
  await page.goto('/ko/')
  const links = page.locator('#writing a[href*="blog.advenoh.pe.kr"]')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    expect(await links.nth(i).getAttribute('href')).not.toContain(EN_BLOG)
  }
})

test('영어 페이지의 IT Blog 카드는 영어 블로그로 연결된다', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-project-card="it-blog"]').click()
  const link = page.getByRole('dialog').getByRole('link', { name: /Open live/ })
  await expect(link).toHaveAttribute('href', EN_BLOG)
})

test('한국어 페이지의 IT Blog 카드는 한국어 블로그로 연결된다', async ({ page }) => {
  await page.goto('/ko/')
  await page.locator('[data-project-card="it-blog"]').click()
  const link = page.getByRole('dialog').getByRole('link', { name: /사이트 열기/ })
  await expect(link).toHaveAttribute('href', 'https://blog.advenoh.pe.kr/')
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

Run: `CI=1 npx playwright test tests/blog-locale.spec.ts --reporter=list`
Expected: 4개 중 2개 FAIL — "영어 페이지의 IT 블로그 글 링크는 모두 /en/ 을 가리킨다"(현재 한국어 피드라 href에 `/en/`이 없음), "영어 페이지의 IT Blog 카드는 영어 블로그로 연결된다"(현재 `https://blog.advenoh.pe.kr/`). 나머지 2개(한국어 페이지)는 PASS.

- [ ] **Step 3: 커밋**

```bash
git add tests/blog-locale.spec.ts
git commit -F - <<'EOF'
test: 영어 모드 IT 블로그 링크 e2e 테스트 추가

영어 페이지의 writing 목록과 IT Blog 카드가 /en/ 을 가리키는지 검증.
구현 전이라 영어 케이스 2건은 실패한다.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 2: 피드 설정 분리 (`site-config` + `writing-feeds`)

**Files:**
- Modify: `lib/site-config.ts` (external.rss 블록)
- Create: `lib/writing-feeds.ts`

- [ ] **Step 1: `lib/site-config.ts`의 rss 블록 교체**

기존:

```ts
    rss: {
      blog: "https://blog.advenoh.pe.kr/rss.xml",
      investment: "https://investment.advenoh.pe.kr/rss.xml",
    },
```

변경 후:

```ts
    rss: {
      // IT 블로그는 locale 별 피드가 있다. 투자 블로그는 영어판이 없어 단일 URL.
      blog: {
        ko: "https://blog.advenoh.pe.kr/rss.xml",
        en: "https://blog.advenoh.pe.kr/en/rss.xml",
      },
      investment: "https://investment.advenoh.pe.kr/rss.xml",
    },
```

- [ ] **Step 2: `lib/writing-feeds.ts` 생성**

```ts
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
```

- [ ] **Step 3: 타입 검사**

Run: `npm run check`
Expected: **아직 통과하지 않는다.** Task 2~4는 커밋 하나로 묶이며, 타입 검사는 Task 4 끝에서야 깨끗해진다.
이 시점에는 `lib/writing.ts` 에서 `siteConfig.external.rss.blog` 가 객체가 되어 `string` 자리에 못 들어간다는 에러가 난다.
(`tsconfig.json` 의 include 가 `scripts/` 까지 덮으므로 `scripts/warm-cache.ts` 에러도 Task 4 Step 4에서 함께 해소한다.)

---

### Task 3: 서버 로더 locale 대응 (`lib/writing.ts` + `lib/home-data.ts`)

**Files:**
- Modify: `lib/writing.ts`
- Modify: `lib/home-data.ts:9-16`

- [ ] **Step 1: `lib/writing.ts`를 아래 내용으로 교체**

`parseRss`/`fetchFeed`/`fetchWritingBundle`/스키마는 그대로 두고, 진입점만 locale을 받게 바꾼다.

```ts
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
```

- [ ] **Step 2: `lib/home-data.ts`에서 locale 전달**

기존 9-16행:

```ts
  const [portfolioItems, status, github, writingSections, latestPosts] =
    await Promise.all([
      Promise.resolve(getPortfolioItems(locale)),
      getStatusSnapshot(),
      getGithubContrib(),
      getWritingSections(),
      getLatestPosts(10),
    ])
```

변경 후:

```ts
  const [portfolioItems, status, github, writingSections, latestPosts] =
    await Promise.all([
      Promise.resolve(getPortfolioItems(locale)),
      getStatusSnapshot(),
      getGithubContrib(),
      getWritingSections(locale),
      getLatestPosts(locale, 10),
    ])
```

- [ ] **Step 3: 타입 검사**

Run: `npm run check`
Expected: 아직 통과하지 않는다. `hooks/useLiveWriting.ts` 의 `siteConfig.external.rss.blog` 문자열 사용 에러와,
`scripts/warm-cache.ts` 의 `getWritingBlog`/`getWritingInvestment` import 에러(TS2305)가 남는다. 둘 다 Task 4에서 해소한다.

---

### Task 4: 클라이언트 재조회 locale 대응

**Files:**
- Modify: `hooks/useLiveWriting.ts:1-12`, `:40-75`
- Modify: `components/profile/ProfileShell.tsx:57`

- [ ] **Step 1: `hooks/useLiveWriting.ts` 상단 교체**

기존 1-12행(import + `SOURCES` 상수):

```ts
'use client'

import { useEffect, useState } from 'react'
import type { WritingItem, WritingSource } from '@/lib/writing'
import { siteConfig } from '@/lib/site-config'

type Source = { source: WritingSource; url: string }

const SOURCES: Source[] = [
  { source: 'IT', url: siteConfig.external.rss.blog },
  { source: 'INV', url: siteConfig.external.rss.investment },
]
```

변경 후 (`siteConfig`·`Source` 타입 대신 `writingFeeds` 사용):

```ts
'use client'

import { useEffect, useState } from 'react'
import type { WritingItem } from '@/lib/writing'
import { writingFeeds, type WritingSource } from '@/lib/writing-feeds'
import type { Locale } from '@/lib/i18n/types'
```

- [ ] **Step 2: hook 시그니처와 fetch 대상 변경**

기존 `useLiveWriting` 선언부·`useEffect`(파일 34-78행 부근)에서 세 곳을 고친다.

1. 시그니처에 `locale` 추가:

```ts
export function useLiveWriting(
  initial: {
    it: WritingItem[]
    investment: WritingItem[]
    latest: WritingItem[]
    totals: { it: number; investment: number }
  },
  locale: Locale
) {
```

2. `useEffect` 안에서 `SOURCES` 대신 locale 피드를 쓴다:

```ts
  useEffect(() => {
    let cancelled = false
    const feeds = writingFeeds(locale)

    ;(async () => {
      try {
        const results = await Promise.all(
          feeds.map(async f => {
            const res = await fetch(f.url)
            if (!res.ok) return [] as WritingItem[]
            const xml = await res.text()
            return parseRss(xml, f.source)
          })
        )
```

3. `useEffect` 의존성 배열을 `[]` → `[locale]` 로 바꾼다 (`return () => { cancelled = true }` 다음 줄).

`parseRss` 본문과 이후 정렬·`setData` 로직은 그대로 둔다.

- [ ] **Step 3: `components/profile/ProfileShell.tsx:57` 수정**

기존: `const writing = useLiveWriting(initialWriting)`
변경: `const writing = useLiveWriting(initialWriting, locale)`

- [ ] **Step 4: `scripts/warm-cache.ts` 호출부 수정**

`tsconfig.json` 의 include 가 `scripts/` 까지 덮으므로, 이 파일을 고치지 않으면 `npm run check` 가
`getWritingBlog`/`getWritingInvestment` 미존재(TS2305)로 실패한다. 캐시 시드 생성·커밋은 Task 6이 맡고,
여기서는 호출부만 맞춘다.

기존 import: `import { getWritingBlog, getWritingInvestment } from '../lib/writing'`
변경: `import { getWritingBundles } from '../lib/writing'`

기존 tasks 배열의 writing 항목:

```ts
    ['writing:blog', getWritingBlog],
    ['writing:investment', getWritingInvestment],
```

변경 후:

```ts
    ['writing:ko', () => getWritingBundles('ko')],
    ['writing:en', () => getWritingBundles('en')],
```

`status`/`github` 항목과 나머지 스크립트는 그대로 둔다.

- [ ] **Step 5: 타입 검사**

Run: `npm run check`
Expected: 에러 없이 통과.

`npm run lint`는 이 저장소에서 **원래부터 실패**한다(`next lint`가 Next.js 16에서 제거됐고 eslint도 설치돼 있지 않다).
이번 작업 범위 밖이므로 검증 대상에서 제외한다.

- [ ] **Step 6: e2e 부분 확인**

Run: `CI=1 npx playwright test tests/blog-locale.spec.ts --reporter=list`
Expected: 3 passed / 1 failed. 유일한 실패는 '영어 페이지의 IT Blog 카드는 영어 블로그로 연결된다'(Task 5에서 해소).
'영어 페이지의 IT 블로그 글 링크는 모두 /en/ 을 가리킨다'가 아직 실패하면 배선이 잘못된 것이다.

- [ ] **Step 7: 빌드 부산물 되돌리기 후 커밋**

Run: `git checkout -- .cache next-env.d.ts && rm -f .cache/writing-blog-en.json`
(dev 서버가 캐시와 `next-env.d.ts` 를 덮어쓴다. `writing-blog-en.json` 시드는 Task 6에서 의도적으로 만든다.)

```bash
git add lib/site-config.ts lib/writing-feeds.ts lib/writing.ts lib/home-data.ts hooks/useLiveWriting.ts components/profile/ProfileShell.tsx scripts/warm-cache.ts
git commit -F - <<'EOF'
feat: IT 블로그 RSS를 locale 별 피드로 분리

영어 페이지는 blog.advenoh.pe.kr/en/rss.xml, 한국어 페이지는 기존 피드를 쓴다.
writing-feeds.ts 가 locale → (URL, 캐시 파일) 단일 소스가 되어 서버 로더와
클라이언트 재조회 hook 이 같은 정의를 공유한다. 투자 블로그는 영어판이 없어 유지.
warm-cache 는 ko/en 번들을 모두 채우도록 함께 수정한다.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 5: 포트폴리오 카드 링크 locale 대응

**Files:**
- Modify: `lib/portfolio.ts:8-34` (스키마), `:108` (site 매핑)
- Modify: `contents/website/it-blog/index.md:2` 다음 줄

- [ ] **Step 1: `lib/portfolio.ts` 스키마에 필드 추가**

기존 `portfolioItemSchema` 상단:

```ts
export const portfolioItemSchema = z.object({
  site: z.string().url(),
  title: z.string().optional(),
```

변경 후:

```ts
export const portfolioItemSchema = z.object({
  site: z.string().url(),
  site_en: z.string().url().optional(),
  site_ko: z.string().url().optional(),
  title: z.string().optional(),
```

- [ ] **Step 2: 아이템 매핑에서 locale 값 사용**

기존 108행: `        site: validated.site,`
변경 후: `        site: pick(data, 'site', locale) ?? validated.site,`

`pick`은 `site_<locale>` → `site` → 다른 locale 순으로 고르므로, `site_en`만 있는 항목은 en에서 `site_en`, ko에서 기본 `site`를 쓴다. 제목 추출(`extractTitleFromUrl(validated.site)`)은 기본 `site`를 그대로 쓰므로 수정하지 않는다.

- [ ] **Step 3: `contents/website/it-blog/index.md`에 `site_en` 추가**

기존 1-4행:

```yaml
---
site: https://blog.advenoh.pe.kr/
title: IT Blog
```

변경 후:

```yaml
---
site: https://blog.advenoh.pe.kr/
site_en: https://blog.advenoh.pe.kr/en/
title: IT Blog
```

- [ ] **Step 4: 인코딩·파싱 확인**

Run:
```bash
file -I contents/website/it-blog/index.md
node -e "const m=require('gray-matter');const d=m.read('contents/website/it-blog/index.md').data;console.log(d.site, d.site_en)"
```
Expected: `text/plain; charset=utf-8`, `https://blog.advenoh.pe.kr/ https://blog.advenoh.pe.kr/en/`

- [ ] **Step 5: 커밋**

```bash
git add lib/portfolio.ts contents/website/it-blog/index.md
git commit -F - <<'EOF'
feat: 포트폴리오 site 를 locale 별로 지정 가능하게

frontmatter 에 site_en/site_ko 를 허용하고, IT Blog 는 영어 화면에서
blog.advenoh.pe.kr/en/ 으로 연결한다. 카드·모달·커맨드 팔레트·JSON-LD 에 함께 반영된다.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 6: 캐시 시드 생성 (`warm-cache`)

**Files:**
- Create(생성물): `.cache/writing-blog-en.json`

`scripts/warm-cache.ts` 호출부 수정은 타입 검사 때문에 Task 4 Step 4로 옮겼다. 이 태스크는 시드 생성·커밋만 한다.

- [ ] **Step 1: 캐시 시드 생성**

Run: `npx tsx scripts/warm-cache.ts`
Expected: `✓ writing:ko`, `✓ writing:en` 출력. `status`/`github`는 환경변수가 없으면 실패 경고가 날 수 있고 그래도 진행한다.

Run: `ls .cache && node -e "console.log(require('./.cache/writing-blog-en.json').items.length, require('./.cache/writing-blog-en.json').items[0].link)"`
Expected: `writing-blog-en.json` 존재, 항목 20개, 첫 링크가 `https://blog.advenoh.pe.kr/en/` 로 시작.

- [ ] **Step 2: 의도치 않은 캐시 변경 확인**

Run: `git status --porcelain .cache`
Expected: `?? .cache/writing-blog-en.json` (신규). `writing-blog.json`·`writing-investment.json`·`github-contrib.json`이 수정됐다면 내용이 줄어들지 않았는지 확인하고, 라이브 조회 실패로 빈약해진 경우 `git checkout -- <파일>`로 되돌린다.

- [ ] **Step 3: 커밋**

```bash
git add .cache/writing-blog-en.json
git commit -F - <<'EOF'
chore: 영어 IT 블로그 피드 캐시 시드 추가

Netlify 빌드가 라이브 조회에 실패해도 영어 페이지가 빈 목록이 되지 않도록
.cache/writing-blog-en.json 을 커밋한다.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

---

### Task 7: 전체 검증

- [ ] **Step 1: 타입 검사**

Run: `npm run check`
Expected: 에러 없음. (`npm run lint`는 저장소 기존 문제로 항상 실패하므로 돌리지 않는다.)

- [ ] **Step 2: 정적 빌드**

Run: `npm run build`
Expected: 성공. 로그에 `[cache:WARN] writing:writing-blog-en.json` 가 보이면 라이브 조회 실패 후 시드를 쓴 것이며 빌드 자체는 정상이다.

Run: `grep -c 'blog.advenoh.pe.kr/en/' out/index.html && grep -c 'blog.advenoh.pe.kr/en/' out/ko/index.html`
Expected: `out/index.html`은 1 이상(영어 글 링크 + 카드 링크), `out/ko/index.html`은 `0`. `grep -c`가 0을 반환하면 종료 코드가 1이라 `&&` 뒤가 실행되지 않으므로, 두 명령을 따로 실행한다.

- [ ] **Step 3: e2e 테스트 (Task 1 테스트 포함 전체)**

Run: `CI=1 npx playwright test --reporter=list`
Expected: 전체 PASS (기존 14건 + 신규 4건 = 18건).

- [ ] **Step 4: 빌드 산출물 렌더 확인**

Run: `npm run start` 후 브라우저/Playwright로 `http://localhost:3000/` 과 `http://localhost:3000/ko/` 확인.
Expected:
- `/`: writing 섹션 IT 글 제목이 영어이고 링크가 `/en/`. Latest posts에는 영어 IT 글 + 한국어 투자 글이 섞여 보인다(의도된 동작).
- `/ko/`: 기존과 동일하게 한국어 IT 글.
- 두 화면 모두 콘솔 에러 없음.

확인 후 서버 종료.

- [ ] **Step 5: 워킹트리 정리 상태 확인**

Run: `git status --porcelain`
Expected: 비어 있음. `.cache/*.json`이나 `next-env.d.ts`가 빌드·테스트로 바뀌었으면 `git checkout -- <파일>`로 되돌린다(빌드 산출물이며 이번 변경과 무관).

---

### Task 8: blog-v2 `/en/rss.xml` CORS 헤더 (별도 저장소·별도 PR)

**Files:**
- Modify: `/Users/user/src/workspace_blogv2/blog-v2.advenoh.pe.kr/netlify.toml`

이 저장소의 커밋 메시지는 한국어를 쓴다.

- [ ] **Step 1: 브랜치 생성**

Run:
```bash
cd /Users/user/src/workspace_blogv2/blog-v2.advenoh.pe.kr
git checkout main && git pull --ff-only origin main
git checkout -b chore/en-rss-cors
```

- [ ] **Step 2: `netlify.toml`에 헤더 블록 추가**

기존 블록(38-41행 부근):

```toml
[[headers]]
  for = "/rss.xml"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

바로 아래에 추가:

```toml
[[headers]]
  for = "/en/rss.xml"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

- [ ] **Step 3: 변경 확인**

Run: `git diff netlify.toml`
Expected: 위 4줄 + 빈 줄만 추가됨.

- [ ] **Step 4: 커밋·푸시·PR**

Run:
```bash
git add netlify.toml
git commit -F - <<'EOF'
chore: 영어 RSS 피드에 CORS 헤더 추가

advenoh.pe.kr 영어 페이지가 브라우저에서 /en/rss.xml 을 재조회할 수 있도록
기존 /rss.xml 과 동일하게 Access-Control-Allow-Origin 을 허용한다.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
git push -u origin chore/en-rss-cors
gh pr create --base main --title "chore: 영어 RSS 피드에 CORS 헤더 추가" --body "$(cat <<'EOF'
## Summary
- `/en/rss.xml` 에 `Access-Control-Allow-Origin: *` 헤더 추가 (기존 `/rss.xml` 과 동일)
- advenoh.pe.kr 영어 페이지가 브라우저에서 영어 RSS 를 재조회하기 위해 필요

## Test plan
- [ ] 배포 후 `curl -sI -H 'Origin: https://advenoh.pe.kr' https://blog.advenoh.pe.kr/en/rss.xml | grep -i access-control` 로 헤더 확인

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR URL 출력. 리뷰어 미지정, 머지하지 않는다.

---

### Task 9: 포트폴리오 PR 생성

- [ ] **Step 1: 계획 문서 커밋**

Run:
```bash
cd /Users/user/src/workspace_blogv2/v2.advenoh.pe.kr
git add docs/superpowers/plans/2026-09-12-blog-en-feed.md
git commit -F - <<'EOF'
docs: 영어 모드 IT 블로그 영어 피드 전환 구현 계획

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

- [ ] **Step 2: 푸시·PR 생성**

Run:
```bash
git push -u origin feature/blog-en-feed
gh pr create --base main --title "feat: 영어 페이지에서 IT 블로그를 영어 피드로" --body "$(cat <<'EOF'
## Summary
- 영어 페이지(`/`)의 writing 목록·Latest posts·커맨드 팔레트가 영어 RSS(`blog.advenoh.pe.kr/en/rss.xml`)를 사용
- IT Blog 카드 링크도 영어 화면에서 `/en/` 으로 연결 (frontmatter `site_en`/`site_ko` 지원 추가)
- `lib/writing-feeds.ts` 가 locale → (피드 URL, 캐시 파일) 단일 소스, 서버 로더와 클라이언트 재조회 hook 이 공유
- 투자 블로그는 영어판이 없어 locale 과 무관하게 한국어 유지
- 관련 PR: blog-v2 `/en/rss.xml` CORS 헤더 (별도)

## Test plan
- [ ] `npm run check` 통과
- [ ] `npm run build` 성공, `out/index.html` 에 `/en/` 링크 존재·`out/ko/index.html` 에는 없음
- [ ] `npx playwright test` 전체 통과 (신규 `tests/blog-locale.spec.ts` 4건 포함)
- [ ] en/ko 화면에서 글 목록·카드 링크 육안 확인

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR URL 출력. 리뷰어 미지정, 머지하지 않는다. 두 PR URL을 사용자에게 보고한다.

---

## Self-Review

- **Spec coverage:** blog-v2 CORS(Task 8), site-config rss 분리(Task 2), writing-feeds 신규(Task 2), writing.ts locale화(Task 3), home-data(Task 3), useLiveWriting+ProfileShell(Task 4), warm-cache+en 시드(Task 6), portfolio site_en/site_ko + it-blog frontmatter(Task 5), 테스트(Task 1·7), 에러 처리는 기존 withCache 정책 유지(Task 3에서 fallback 그대로) — 스펙 항목 모두 매핑됨. 범위 제외 항목(투자 블로그·BLOG POSTS 통계·services·blog-v2 RSS 생성 로직)은 어떤 태스크에서도 건드리지 않는다.
- **Placeholder scan:** 모든 코드 블록이 실제 내용이고, 명령과 기대 출력이 명시됨. TBD/TODO 없음.
- **Type consistency:** `writingFeeds(locale)` → `WritingFeed[] { source, url, cacheFile }`를 Task 2에서 정의하고 Task 3(서버)·Task 4(클라이언트)에서 같은 이름으로 소비한다. `WritingSource`는 `lib/writing-feeds.ts`가 정의하고 `lib/writing.ts`가 `export type { WritingSource }`로 재노출하므로 `hooks/useLiveWriting.ts`·`components/profile/WritingList.tsx`의 기존 import 경로가 모두 유효하다. `getWritingBundles(locale)`는 Task 3에서 정의되고 Task 6 warm-cache에서 쓰인다. `getWritingSections(locale)`/`getLatestPosts(locale, limit)` 시그니처는 Task 3의 정의와 home-data 호출부가 일치한다.
