# 포트폴리오 "오늘의 명언" 연동 PRD

## 1. 배경 & 목적

현재 `v2.advenoh.pe.kr`(Frank Oh Portfolio)의 메인 페이지 중앙에는 터미널풍의 명언 블록(`QuoteBlock`)이 있다. 이 블록은 `contents/quote/*.md`에 수기로 관리되는 정적 명언 목록을 12초마다 회전시켜 보여주는 방식이다.

이를 **모노레포 내에서 함께 운영되는 명언 서비스 `inspireme.advenoh.pe.kr` (운영 도메인: `inspire-me.advenoh.pe.kr`)의 "오늘의 명언"** 으로 교체하고, **명언 영역을 클릭하면 inspire-me의 해당 명언 상세 페이지로 이동** 하도록 한다.

### 목표

1. 포트폴리오의 명언 데이터 소스를 inspire-me API로 단일화한다.
2. 매일(KST 기준) 자동으로 "오늘의 명언"이 갱신된다.
3. 방문자가 명언을 클릭하면 inspire-me의 상세 페이지로 유입되게 하여 두 사이트 간 연결을 강화한다.
4. **API Key를 요구하지 않는 엔드포인트**만 사용한다 (정적 클라이언트에서 키 노출 불가).

### 비목표

- inspire-me의 스키마·데이터 변경 없음.
- 포트폴리오의 다른 섹션(Hero/ProjectGrid/WritingList/RightRail) 변경 없음.
- 명언 다국어 전환 UI 추가 없음 (한국어 원문 우선).

## 2. 현재 상태 분석 (코드 기반 재확인)

### 2.1 포트폴리오 측 (`v2.advenoh.pe.kr/`)

- **컴포넌트**: `components/profile/QuoteBlock.tsx` (`'use client'`)
  - `Quote[]` props 기반 `setInterval` 회전, `↻ rotate` 수동 버튼
- **로더**: `lib/quotes.ts` → 빌드 타임에 `contents/quote/*.md` 7건 로드, zod 검증
- **호출**: `app/page.tsx:11` → `getQuotes()` → `ProfileShell` → `QuoteBlock`
- **배포**: `next.config.mjs`의 `output: 'export'` 로 정적 export → Netlify

### 2.2 inspire-me 측 (`inspireme.advenoh.pe.kr/`, Go 백엔드)

모노레포에 포함된 실제 코드를 확인한 결과 QOTD가 **이미 구현되어 있음**. 새 엔드포인트를 만들 필요 없이 **CORS만 열어주면 재사용 가능**하다.

#### 2.2.1 이미 존재하는 QOTD 엔드포인트

| 엔드포인트 | 경로 | 인증 | CORS | Rate Limit | 캐시 | 비고 |
|---|---|---|---|---|---|---|
| **Widget QOTD** ⭐ | `GET /api/widget/quote-of-the-day?lang=ko` | **불필요** | `Access-Control-Allow-Origin: *` | IP 60/min | 브라우저 5m + Redis 24h | `pkg/widget/handler.go` |
| Widget Random | `GET /api/widget/random?lang=ko&count=N` | 불필요 | `*` | IP 60/min | 브라우저 5m | — |
| Widget Topics | `GET /api/widget/topics?q=&lang=ko` | 불필요 | `*` | IP 60/min | 브라우저 5m | — |
| Widget Impression | `POST /api/widget/impression` | 불필요 | `*` | IP 60/min | — | 노출 기록(옵션) |
| 내부 QOTD | `GET /api/quote-of-the-day?language=ko` | `X-Internal-Token` (env 미설정 시 통과) | 제한적 | 없음 | 없음 | `pkg/quote-of-the-day/handler.go` |
| Public v1 QOTD | `GET /api/v1/quote-of-the-day?language=ko` | **API Key 필수** | 제한적 | API Key별 | Redis 24h | `pkg/public-api/handler.go` |

- **`/api/widget/*`는 외부 임베드(위젯)를 위해 의도적으로 설계된 공개 엔드포인트**로, API Key 없이 누구나 호출 가능하고 CORS가 `*`로 열려 있다.
- 본 PRD의 **요구사항 FR-7("API Key 불필요")을 완벽히 충족**하며, v2 정적 클라이언트에 가장 적합.
- `/api/v1/*`는 API Key 필수이므로 배제. `/api/quote-of-the-day`(내부용)는 차선.
- 라이브 응답 헤더 확인됨:
  ```
  access-control-allow-origin: *
  access-control-allow-methods: GET, POST, OPTIONS
  access-control-allow-headers: Content-Type
  x-ratelimit-limit: 60
  x-ratelimit-remaining: 60
  cache-control: public, max-age=300
  ```

#### 2.2.2 QOTD 선택 로직 (서버)

`pkg/quote-of-the-day/usecase.go` 요지:

1. `GetByDateAndLanguage(today, preferredLang)` 히트 시 기존 명언 반환.
2. 없으면 해당 언어 풀에서 날짜 시드 기반 deterministic 선택.
3. DB에 저장 → 같은 날짜 재요청 시 동일 결과 보장.
4. 시드 알고리즘: `hash = ((hash << 5) - hash) + char` (YYYY-MM-DD 문자열 기반, Frontend와 동일 해시).

Widget 응답 스펙 (`widgetQuoteResponse`, `toWidgetQuoteFromQOTD` 경유):

```jsonc
// GET /api/widget/quote-of-the-day?lang=ko
{
  "data": {
    "id": "c54bcbf0-ddb1-40a4-9e40-24960c71cfdb",
    "content": "이긴다고 생각하면 이긴다. 승리는 자신감을 가진 사람의 편이다.",
    "author": "가토 히로시",
    "authorSlug": "kato-hiroshi",
    "language": "ko",
    "topics": ["자신감", "승리"],
    "tags": ["긍정적사고", "자기믿음", "승부", "정신력"]
  }
}
```

QOTD 내부 상세(`QOTDResponse`)에는 `authorInfo`, `translations`, `backgroundImageURL` 등이 포함되지만, widget 응답은 임베드 목적으로 **축약 포맷**을 사용한다. v2에서는 축약 포맷으로 충분.

#### 2.2.3 CORS 현황

- `/api/widget/*`는 핸들러 내부의 `widgetCORS` 미들웨어가 **모든 Origin(`*`) 허용** → **추가 설정 불필요**.
- 글로벌 CORS (`pkg/middleware/middleware.go:18-25`)는 widget 경로에 적용되지 않으며 수정 불요.
- 즉 **백엔드 변경 없이 `v2.advenoh.pe.kr`에서 호출 가능**.

#### 2.2.4 상세 페이지 URL

- Frontend 라우트 존재: `frontend/app/quotes/` (ID 기반 상세).
- 실제 URL: `https://inspire-me.advenoh.pe.kr/quotes/{id}` 200 OK 확인.

## 3. 요구사항

### 3.1 기능 요구사항

| ID | 요구사항 |
|---|---|
| FR-1 | 포트폴리오 메인 페이지의 명언 블록에 inspire-me의 오늘의 명언 1건이 표시된다. |
| FR-2 | KST 기준 날짜가 바뀌면 다른 명언이 노출된다 (서버 결정적 선택). |
| FR-3 | 동일 날짜 내 동일 언어 요청에는 항상 같은 명언이 반환된다. |
| FR-4 | 명언 영역 클릭 시 `https://inspire-me.advenoh.pe.kr/quotes/{id}`가 새 탭에서 열린다. |
| FR-5 | API 호출 실패/네트워크 오류/CORS 차단 시 레이아웃 유지 + 정적 fallback 명언 1건 노출. |
| FR-6 | 로딩 중에는 고정 높이 플레이스홀더 (CLS ≤ 0.1). |
| FR-7 | **API Key를 요구하지 않는 엔드포인트만 사용**한다. |

### 3.2 비기능 요구사항

- 빌드 산출물은 정적(`out/`) 유지.
- Lighthouse: CLS ≤ 0.1, TBT 영향 미미.
- 접근성: 클릭 영역은 `<a>`, 키보드 포커스/`aria-label` 지원.
- 캐시: 서버 Redis 24h + 클라이언트 `localStorage` 일일 캐시(옵션).

### 3.3 UX

- 터미널풍 디자인 유지.
- `↻ rotate` 버튼 제거 (QOTD는 1건이므로 회전 개념 불필요).
- 상단 라벨은 `$ quote-of-the-day` 로 명확화 검토.
- 명언 전체를 링크화, hover 시 `text-profile-accent` 류의 subtle underline.

## 4. 설계

### 4.1 접근 방식 결정

| 옵션 | 설명 | 장점 | 단점 | 판정 |
|---|---|---|---|---|
| **A. `/api/widget/quote-of-the-day` 재사용** | inspire-me가 외부 임베드용으로 이미 제공 중인 공개 엔드포인트 | API Key 불필요, CORS `*`, IP rate limit, Redis 24h 캐시, **백엔드 변경 無** | 응답 포맷이 축약형(authorInfo 미포함) | **권장** |
| B. 신규 `/api/public/quote-of-the-day` 추가 | 공식 공개 엔드포인트 추가 | 포맷 자유, 정책 분리 | 백엔드·라우팅·테스트 추가 부담, widget과 중복 | 불필요 |
| C. `/api/quote-of-the-day` 재사용 | CORS에 v2 도메인 추가 | 포맷 full | `InternalTokenAuth` 의존, 의도된 public 아님 | 차선 |
| D. 빌드 타임 fetch 후 정적 내장 | next build에서 fetch | 런타임 무관 | 매일 재빌드 필요 | 부적합 |

#### 4.1.1 권장안: 옵션 A (Widget API 재사용)

- **백엔드 변경 없음** — `GET /api/widget/quote-of-the-day?lang=ko`를 그대로 호출.
- 보안/성능 속성은 기존 widget 미들웨어가 보장:
  - `widgetCORS`: `Access-Control-Allow-Origin: *`
  - `widgetRateLimiter`: IP당 분당 60회 (`X-RateLimit-*` 헤더 노출)
  - `setCacheHeaders`: `Cache-Control: public, max-age=300`
  - Redis 키 `widget:qotd:{lang}` TTL 24시간 (동일 날짜 내 결과 고정)
- (옵션) `POST /api/widget/impression` 으로 노출 기록을 전송 가능. 분석이 필요하면 도입 고려, 기본은 미전송.

### 4.2 포트폴리오 측 변경

#### 4.2.1 신규: `lib/quotes-client.ts`

```typescript
const INSPIRE_ME_URL = 'https://inspire-me.advenoh.pe.kr'

export type TodayQuote = {
  id: string
  content: string
  author: string
  authorSlug: string
  language: 'ko' | 'en'
  topics: string[]
  tags: string[]
}

type WidgetResp = { data: TodayQuote }

export async function fetchTodayQuote(lang: 'ko' | 'en' = 'ko'): Promise<TodayQuote | null> {
  try {
    const res = await fetch(`${INSPIRE_ME_URL}/api/widget/quote-of-the-day?lang=${lang}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return null
    const body = (await res.json()) as WidgetResp
    return body.data ?? null
  } catch {
    return null
  }
}
```

- `lang` 파라미터명에 주의 (widget은 `lang`, 내부 API는 `language`).
- 응답은 `{ data: {...} }` 래핑이므로 `body.data` 추출 필요.

#### 4.2.2 `QuoteBlock.tsx` 리팩터링

- 회전 로직/버튼 제거.
- 상태: `loading | ready | error` 3상태.
- ready 시 `<a href="{INSPIRE_ME}/quotes/{id}" target="_blank" rel="noopener noreferrer">` 로 감싸고 `aria-label="inspire-me에서 이 명언 자세히 보기"`.
- fallback 명언 1건을 모듈 상수로 내장 (현 7건 중 1건 선택).
- `localStorage` 키 `quote:today:{YYYY-MM-DD}:{lang}` 로 일일 캐시(옵션).

#### 4.2.3 주변 수정

- `components/profile/ProfileShell.tsx` → `quotes` prop 삭제.
- `app/page.tsx` → `getQuotes()` 호출과 props 전달 제거.
- `lib/quotes.ts` / `contents/quote/` → 삭제 또는 fallback 상수용으로 축소(1건 유지).

## 5. 작업 범위 요약

- **inspire-me 백엔드**: 변경 없음. 기존 `GET /api/widget/quote-of-the-day` 재사용.
- **포트폴리오**: `QuoteBlock` 리팩터링, 신규 fetch 모듈, 로컬 명언 데이터 제거, 환경변수 도입.
- **배포**: 포트폴리오 PR 단독 배포(Netlify). 백엔드 선행 작업 불요.

> 세부 단계별 체크리스트는 [3_quote_todo.md](./3_quote_todo.md), 구현 상세는 [3_quote_implementation.md](./3_quote_implementation.md) 참조.

## 6. 리스크 & 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| Widget API 분당 60회 IP rate limit 초과 | 일부 사용자 429 | Redis 5분 브라우저 캐시 + `localStorage` 일일 캐시 + fallback |
| `widgetQuoteResponse` 스키마 변경 | 렌더 오류 | zod 런타임 파싱, 실패 시 fallback |
| inspire-me 서버 다운 | 명언 비노출 | 내장 fallback 1건 + 에러 UI |
| `Access-Control-Allow-Origin: *` 정책 변경 | CORS 차단 | 드물지만 발생 시 `/api/widget/*` 대신 내부 엔드포인트로 전환 고려 |

## 7. 오픈 이슈

- 노출 통계를 위해 `POST /api/widget/impression`에 v2 렌더 시마다 전송할지 여부.
- 명언 하단에 "via inspire-me →" 마이크로 카피를 추가해 외부 링크임을 명시할지.
- 영어 명언 지원(`lang=en`) 스위치를 추가할지 (범위 외로 두기 권장).

## 8. 참고 경로

### 포트폴리오
- `v2.advenoh.pe.kr/components/profile/QuoteBlock.tsx`
- `v2.advenoh.pe.kr/components/profile/ProfileShell.tsx:72`
- `v2.advenoh.pe.kr/lib/quotes.ts`
- `v2.advenoh.pe.kr/app/page.tsx:11`

### inspire-me 백엔드
- `inspireme.advenoh.pe.kr/backend/pkg/widget/handler.go` ⭐ (사용 대상)
- `inspireme.advenoh.pe.kr/backend/pkg/quote-of-the-day/usecase.go` (서버 선택 로직)
- `inspireme.advenoh.pe.kr/backend/pkg/middleware/middleware.go` (글로벌 CORS, widget 경로엔 미적용)
- `inspireme.advenoh.pe.kr/backend/cmd/main.go` (widget fx 주입)

### inspire-me 프론트엔드
- `inspireme.advenoh.pe.kr/frontend/app/quotes/` (상세 페이지 라우트)
- `inspireme.advenoh.pe.kr/frontend/app/quote-of-the-day/`
