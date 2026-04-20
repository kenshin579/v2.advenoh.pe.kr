# 포트폴리오 "오늘의 명언" 연동 — 구현 문서

## 1. 개요

`v2.advenoh.pe.kr`의 `QuoteBlock` 을 로컬 markdown 회전에서 **inspire-me widget API 기반 오늘의 명언**으로 전환하고, 명언 클릭 시 inspire-me 상세 페이지로 이동시킨다.

- **API**: `GET https://inspire-me.advenoh.pe.kr/api/widget/quote-of-the-day?lang=ko` (API Key 불필요, CORS `*`)
- **상세 URL**: `https://inspire-me.advenoh.pe.kr/quotes/{id}`
- **백엔드 변경 없음** — 기존 widget 엔드포인트 그대로 사용.

## 2. 아키텍처

```
┌──────────────────────────┐
│  v2 HomePage (SSG)       │
│  app/page.tsx            │
│   └─ ProfileShell        │
│       └─ QuoteBlock ───┐ │
└────────────────────────┼─┘
                         │  useEffect + fetch
                         ▼
         ┌─────────────────────────────────────┐
         │ inspire-me API                      │
         │ GET /api/widget/quote-of-the-day    │
         │ → widgetCORS: *                     │
         │ → widgetRateLimiter: 60/min/IP      │
         │ → Redis 캐시: widget:qotd:{lang} 24h│
         │ → QuoteOfTheDayUsecase.GetToday     │
         └─────────────────────────────────────┘
```

- 정적 export 유지. fetch는 전적으로 클라이언트에서 수행.
- 빌드 타임에 `getQuotes()` 호출·전달 제거, 서버 렌더에는 스켈레톤만 포함.

## 3. 파일 변경 목록

| 파일 | 작업 | 설명 |
|---|---|---|
| `lib/quotes-client.ts` | 신규 | widget API fetch + zod 파싱 + 타입 |
| `components/profile/QuoteBlock.tsx` | 리팩터링 | 회전 제거, fetch + 3상태 + 링크화 |
| `components/profile/ProfileShell.tsx` | 수정 | `quotes` prop 삭제 |
| `app/page.tsx` | 수정 | `getQuotes()` 호출·전달 제거 |
| `lib/quotes.ts` | 삭제 | 빌드 타임 로더 불필요 |
| `contents/quote/*.md` | 삭제 | 로컬 명언 7건 제거 |

## 4. 모듈 상세

### 4.1 `lib/quotes-client.ts` (신규)

```typescript
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
  lang: 'ko' | 'en' = 'ko'
): Promise<TodayQuote | null> {
  try {
    const res = await fetch(
      `${INSPIRE_ME_URL}/api/widget/quote-of-the-day?lang=${lang}`,
      { headers: { Accept: 'application/json' } }
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
```

- zod 런타임 검증으로 스키마 drift 방어.
- `FALLBACK_QUOTE`의 `id`가 빈 문자열이면 `QuoteBlock`이 링크를 비활성화.

### 4.2 `components/profile/QuoteBlock.tsx` (리팩터링)

```typescript
'use client'

import { useEffect, useState } from 'react'
import {
  fetchTodayQuote,
  quoteDetailUrl,
  FALLBACK_QUOTE,
  type TodayQuote,
} from '@/lib/quotes-client'

type State =
  | { kind: 'loading' }
  | { kind: 'ready'; quote: TodayQuote }
  | { kind: 'error'; quote: TodayQuote }

const LS_KEY = (d: string, lang: string) => `quote:today:${d}:${lang}`
const kstDate = () =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date())

export function QuoteBlock() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    let cancelled = false
    const lang = 'ko'
    const dateKey = kstDate()

    const cached = typeof window !== 'undefined'
      ? window.localStorage.getItem(LS_KEY(dateKey, lang))
      : null
    if (cached) {
      try {
        setState({ kind: 'ready', quote: JSON.parse(cached) as TodayQuote })
        return
      } catch {/* fall through */}
    }

    fetchTodayQuote(lang).then(quote => {
      if (cancelled) return
      if (quote) {
        setState({ kind: 'ready', quote })
        try {
          window.localStorage.setItem(LS_KEY(dateKey, lang), JSON.stringify(quote))
        } catch {/* ignore quota errors */}
      } else {
        setState({ kind: 'error', quote: FALLBACK_QUOTE })
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-lg border border-profile-line bg-profile-bg-3 p-4 font-mono text-xs min-h-[104px]">
      <div className="flex items-center justify-between">
        <span className="text-profile-muted-2">$ quote-of-the-day</span>
      </div>
      {state.kind === 'loading' ? (
        <div className="mt-3 space-y-2" aria-hidden>
          <div className="h-4 w-5/6 rounded bg-profile-line-2/40 animate-pulse" />
          <div className="h-3 w-1/3 rounded bg-profile-line-2/40 animate-pulse" />
        </div>
      ) : (
        <QuoteBody quote={state.quote} disabled={state.kind === 'error'} />
      )}
    </div>
  )
}

function QuoteBody({ quote, disabled }: { quote: TodayQuote; disabled: boolean }) {
  const body = (
    <blockquote className="mt-3 space-y-2">
      <p className="text-sm text-profile-fg-2 leading-relaxed">“{quote.content}”</p>
      <footer className="text-[11px] text-profile-muted">— {quote.author}</footer>
    </blockquote>
  )

  if (disabled || !quote.id) return body

  return (
    <a
      href={quoteDetailUrl(quote.id)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="inspire-me에서 이 명언 자세히 보기"
      className="block transition-colors hover:text-profile-accent focus-visible:text-profile-accent"
    >
      {body}
    </a>
  )
}
```

주요 포인트:
- props 없음 → 호출부 단순화.
- `min-h-[104px]`로 CLS 방지.
- KST 날짜 + lang으로 일일 `localStorage` 캐시.
- 네트워크/파싱 실패 시 `FALLBACK_QUOTE` 를 `error` 상태로 렌더.

### 4.3 `components/profile/ProfileShell.tsx`

- `quotes: Quote[]` prop 제거.
- `import { QuoteBlock } from './QuoteBlock'` 유지.
- `<QuoteBlock />` 로 호출 (props 없음).
- 상단의 `import type { Quote } from '@/lib/quotes'` 제거.

### 4.4 `app/page.tsx`

- `getQuotes()` import·호출 제거.
- `Promise.all`에서 해당 항목 삭제.
- `ProfileShell`에 `quotes` prop 전달 제거.

### 4.5 정리 대상

- `lib/quotes.ts` 삭제.
- `contents/quote/*.md` 전부 삭제.
- (혹시 있다면) `lib/quotes.ts`를 참조하는 기타 코드 grep 확인 후 제거.

## 5. 데이터 흐름

1. 사용자가 `v2.advenoh.pe.kr` 접속 → 정적 HTML 전달 (스켈레톤만 포함).
2. `QuoteBlock` 마운트 → `localStorage`에 `quote:today:YYYY-MM-DD:ko` 존재하면 그대로 사용.
3. 캐시 미스면 `GET /api/widget/quote-of-the-day?lang=ko` 호출.
4. 서버는 Redis 캐시 히트 또는 `QuoteOfTheDayUsecase.GetToday` 로 오늘자 명언 결정 (해시 시드, DB 저장으로 날짜 내 고정).
5. 응답 `{ data: {...} }` → zod 파싱 → `ready` 상태 렌더 + `localStorage` 저장.
6. 클릭 시 `https://inspire-me.advenoh.pe.kr/quotes/{id}` 새 탭 오픈.

## 6. 에러 처리

| 상황 | 동작 |
|---|---|
| fetch throw (네트워크/CORS) | `error` 상태 + FALLBACK 렌더, 링크 비활성화 |
| 응답 non-2xx | 동상 |
| 응답 파싱 실패 (스키마 drift) | 동상 |
| `localStorage` 쓰기 실패 | 무시하고 메모리 상태만 유지 |

## 7. 테스트 전략

- **단위**: `fetchTodayQuote` — 200/404/네트워크 오류/스키마 mismatch 4케이스.
- **컴포넌트**: `QuoteBlock` — loading → ready/error 전이, 링크 속성.
- **E2E (MCP Playwright)**:
  - `npm run dev` 띄우고 `http://localhost:3000` 접속.
  - `$ quote-of-the-day` 라벨 노출 확인.
  - 명언 영역이 `<a target="_blank">` 로 감싸져 있고 `href`가 `/quotes/{uuid}` 패턴인지 검증.
  - 오프라인 에뮬레이션으로 FALLBACK 렌더 확인.
  - 재로드해도 같은 명언 유지(`localStorage`) 확인.

## 8. 참고

- PRD: `3_quote_prd.md`
- 서버 사용 엔드포인트: `inspireme.advenoh.pe.kr/backend/pkg/widget/handler.go:59-105`
- 서버 QOTD 로직: `inspireme.advenoh.pe.kr/backend/pkg/quote-of-the-day/usecase.go`
