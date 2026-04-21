# 포트폴리오(v2.advenoh.pe.kr) 기재 스택 vs 실제 저장소 스택 비교 PRD

## 문서 목적

`v2.advenoh.pe.kr/contents/website/*/index.md`의 frontmatter `stack` 배열과,
같은 모노레포 내 실제 저장소(`package.json`, `go.mod`, `pyproject.toml`, `CLAUDE.md`)에서
확인한 실제 사용 기술 간의 **차이(gap)** 를 정리한다. 포트폴리오 사이트 업데이트 시
참고할 수 있는 한 장짜리 근거 문서를 목표로 한다.

- 기준일: 2026-04-21
- 비교 대상: 포트폴리오에 노출되는 5개 프로젝트
  - `ai-chatbot` / `inspire-me` / `investment-blog` / `it-blog` / `status`
- 확인 근거: 각 저장소의 매니페스트 파일 실측치 (버전 숫자는 package.json/go.mod/pyproject.toml 그대로)

---

## 요약 (한눈에 보기)

| 프로젝트 | 포트폴리오 기재 | 실제 저장소 | 차이 수준 |
|---|---|---|---|
| ai-chatbot | Next.js 16, FastAPI, LangChain, ChromaDB, OpenAI | 좌측 + Tailwind CSS 4, shadcn/ui, TypeScript, Pydantic v2, SQLAlchemy(async) + aiomysql, rank-bm25(BM25 하이브리드), uv, Docker multi-platform | 중 (보조 스택 누락) |
| inspire-me | Next.js, Tailwind, Markdown | **Next.js 16 + React 19 + TS + shadcn/ui + Tailwind 4 + TanStack Query + i18next** / **Go 1.24 + Echo v4 + GORM + uber-fx + MySQL + Liquibase + Redis + OpenAI + Unsplash** | **상 (백엔드 전체 누락)** |
| investment-blog | Next.js 15, React 19, Tailwind | Next.js **16**, React 19, Tailwind 3, shadcn/ui, TanStack Query, Mermaid, Prism, Netlify (Static Export) | 중 (버전 오표기 + 스택 누락) |
| it-blog | Next.js, React **18**, Markdown, shadcn/ui | Next.js 16, React **19**, shadcn/ui, Tailwind 3, TanStack Query, MiniSearch, Prism, Mermaid, remark/rehype | 중 (버전 오표기 + 스택 누락) |
| status | Next.js 16, Supabase, GitHub Actions, Python, Telegram Bot | 좌측 + React 19, Tailwind 4, TypeScript, Playwright, Netlify, (Python) httpx + supabase-py + uv | 하 (핵심은 맞으나 주변 스택 누락) |

---

## 1. AI Chatbot (`contents/website/ai-chatbot/index.md`)

**포트폴리오 `stack`**
- Next.js 16 · FastAPI · LangChain · ChromaDB · OpenAI

**실제 저장소 (`ai-chatbot.advenoh.pe.kr/`)**

| 영역 | 실제 스택 |
|---|---|
| Frontend | Next.js **16.1.6**, React **19.2.3**, TypeScript 5, shadcn/ui (radix-ui), Tailwind CSS **4**, lucide-react, recharts, ESLint 9 |
| Backend | Python **>=3.12**, FastAPI **>=0.115**, uvicorn, LangChain **>=0.3** (+ `langchain-openai`, `langchain-chroma`, `langchain-community`), ChromaDB **>=0.5**, OpenAI SDK **>=1.0**, Pydantic **>=2.0** + pydantic-settings |
| 데이터/검색 | **rank-bm25** (BM25 하이브리드 검색), SQLAlchemy **asyncio** + **aiomysql** (MySQL 연동) |
| 패키지 매니저 | **uv** (backend), npm (frontend) |
| 배포/CI | Docker multi-platform (arm64/amd64), GitHub Actions, `output: "standalone"` |

**차이 (포트폴리오 누락 항목)**
- Frontend 계열: **React 19 / TypeScript / shadcn/ui / Tailwind CSS 4**
- Backend 계열: **Pydantic v2 / SQLAlchemy async + aiomysql**
- 검색 품질: **BM25 + Semantic 하이브리드** — 제품 특성을 드러내는 중요한 키워드인데 빠져 있음
- 운영: **uv / Docker multi-platform / GitHub Actions**

---

## 2. InspireMe (`contents/website/inspire-me/index.md`) — **차이 가장 큼**

**포트폴리오 `stack`**
- Next.js · Tailwind · Markdown

**실제 저장소 (`inspireme.advenoh.pe.kr/`)**

| 영역 | 실제 스택 |
|---|---|
| Frontend | Next.js **16.1.1**, React **19.2.3**, TypeScript, shadcn/ui (radix-ui 다수), Tailwind CSS **4**, TanStack Query, react-hook-form + zod, framer-motion, **i18next (ko/en)**, d3, recharts, gray-matter |
| Backend | **Go 1.24**, **Echo v4.14**, **GORM v1.31** (MySQL), **uber-fx** (DI), google/uuid, oauth2 (SNS 로그인) |
| DB / 마이그레이션 | **MySQL 8.0**, **Liquibase** (changeset + rollback), **Redis** (go-redis v9) |
| 외부 연동 | **OpenAI API** (명언 분석, `sashabaranov/go-openai`), **Unsplash API** (이미지) |
| 배포 | Docker multi-image (fe/be), `standalone` 출력 |

**차이 (포트폴리오 누락 항목)**
- **백엔드 스택이 통째로 누락**: Go/Echo/GORM/uber-fx/MySQL/Liquibase/Redis — 실제 저장소에는 풀스택 앱인데 포트폴리오는 정적 사이트처럼 보임
- **SNS 로그인 / OpenAI 명언 분석 / Unsplash 이미지 연동** 같은 차별화 요소가 빠져 있음
- Frontend도 `Tailwind`만 남기고 **React 19 / TypeScript / shadcn/ui / TanStack Query / i18next(다국어)** 누락
- `Markdown` 기재는 사실과 거리가 있음 — 콘텐츠 원천은 Markdown이 아니라 **MySQL DB**
- 참고: frontmatter의 `ext: .go`가 Go 백엔드를 암시하긴 하지만 `stack` 배열 자체는 프론트 일부만 노출

---

## 3. Investment Insights (`contents/website/investment-blog/index.md`)

**포트폴리오 `stack`**
- Next.js **15** · React 19 · Tailwind

**실제 저장소 (`investment.advenoh.pe.kr/`)**

| 영역 | 실제 스택 |
|---|---|
| Framework | Next.js **^16.0.8** (포트폴리오의 15와 불일치), React **19.2.1** |
| UI | shadcn/ui (radix-ui 다수), Tailwind CSS **3.4.17**, tailwindcss-animate, framer-motion |
| 상태/폼 | TanStack Query, react-hook-form + zod |
| 콘텐츠 렌더링 | react-markdown, remark/remark-gfm/remark-html, rehype-highlight, **Mermaid**, react-syntax-highlighter |
| 빌드 파이프라인 | tsx 기반 `generateStaticData.ts` / `generateSitemap.ts` / `generateRssFeed.ts` / `generateRobots.ts` |
| 배포 | Next.js Static Export (`out/`) → Netlify, Lighthouse CI |

**차이 (포트폴리오 오/누락 항목)**
- **버전 오표기**: 포트폴리오 "Next.js 15" → 실제 **Next.js 16**
- 스택 배열에 **shadcn/ui / Markdown(+Mermaid) / Netlify** 누락 (overview 본문에는 언급되나 `stack` 필드에는 없음)
- 정적 데이터 생성 파이프라인(RSS/Sitemap/robots 빌드 시점 자동 생성)은 제품 성격을 드러내는데 `stack`엔 안 보임

---

## 4. IT Blog (`contents/website/it-blog/index.md`)

**포트폴리오 `stack`**
- Next.js · React **18** · Markdown · shadcn/ui

**실제 저장소 (`blog-v2.advenoh.pe.kr/`)**

| 영역 | 실제 스택 |
|---|---|
| Framework | Next.js **^16.0.7**, React **^19.2.0** |
| UI | shadcn/ui (radix-ui 다수), Tailwind CSS **3.4.17**, tailwindcss-animate, framer-motion |
| 검색 | **MiniSearch** (클라이언트 full-text, 퍼지 매칭) |
| 콘텐츠/하이라이팅 | remark/remark-gfm/remark-html/remark-rehype, **rehype-prism-plus** (Prism.js), rehype-autolink-headings, rehype-slug, **Mermaid** |
| 상태/폼/기타 | TanStack Query, react-hook-form + zod, d3, recharts |
| 빌드 파이프라인 | tsx 스크립트: `generate-content-manifest.ts`, `generate-search-index.ts`, `generate-feeds.ts`, `copy-images.ts` |
| 레거시 (잔존) | `shared/schema.ts` (Drizzle ORM 스키마) — CLAUDE.md에 "현재 미사용, 정적 파일 시스템 사용"으로 명시 |

**차이 (포트폴리오 오/누락 항목)**
- **버전 오표기**: 포트폴리오 "React 18" → 실제 **React 19** (package.json `react ^19.2.0`)
- 스택 배열에 **Tailwind CSS / MiniSearch / Prism / Mermaid / TanStack Query** 누락
- overview 본문은 "MiniSearch", "Prism.js", "TOC 자동 생성"을 언급하지만 `stack` 필드에는 반영되어 있지 않아 포트폴리오 카드 표시가 빈약함

---

## 5. Advenoh Status (`contents/website/status/index.md`)

**포트폴리오 `stack`**
- Next.js 16 · Supabase · GitHub Actions · Python · Telegram Bot

**실제 저장소 (`advenoh-status/`)**

| 영역 | 실제 스택 |
|---|---|
| Frontend | Next.js **16.0.7**, React **^19.2.0**, TypeScript **^5.9.3**, Tailwind CSS **4**, ESLint 9, **Playwright** (E2E 테스트) |
| 백엔드 (스크립트) | Python **>=3.12**, **httpx**, **supabase** (supabase-py), **uv** |
| 데이터/인증 | **Supabase Postgres** + **RLS**, Supabase Auth (Email 로그인), `@supabase/ssr`, `@supabase/supabase-js` |
| CI / 알림 | GitHub Actions (5분 cron), **Telegram Bot** (상태 변경 시에만) |
| 호스팅 | **Netlify** (정적 대시보드, `netlify.toml`) |

**차이 (포트폴리오 누락 항목)**
- Frontend: **React 19 / TypeScript / Tailwind CSS 4 / Playwright** 미기재
- 배포: **Netlify** 호스팅 미기재 (overview에만 "정적 대시보드"로 표현)
- Supabase 세부: 단순 "Supabase"가 아니라 **Postgres + RLS + Auth** 조합이 실제 구성

---

## 제안: 포트폴리오 `stack` 배열 업데이트 가이드라인

각 항목의 `frontmatter.stack` 업데이트는 아래 원칙을 따른다.

1. **버전은 기재하지 않는다.** `Next.js 16`, `React 19`, `Go 1.24`처럼 메이저 버전도 적지 않는다 — 기술 선택(=아키텍처)만 드러내고 숫자는 overview 본문 쪽에서 필요 시 언급한다. 버전 추적 부담을 제거한다.
2. **UI 라이브러리는 `stack` 배열에 넣지 않는다.** `shadcn/ui`, `Radix`, `Tailwind`, `radix-ui`처럼 스타일링/컴포넌트 계층은 포트폴리오 카드에서 제품 차별점이 아니다. overview 본문에서 필요하면 언급한다.
3. **Backend 언어는 반드시 기재한다.** FastAPI만 적지 말고 `Python + FastAPI`, Echo만 적지 말고 `Go + Echo v4`처럼 **언어 + 주요 프레임워크**가 한 쌍으로 노출되어야 한다. Next.js 단독 프로젝트라도 빌드 스크립트 언어(예: Python health check)가 있으면 같이 쓴다.
4. **FE/BE 풀스택 프로젝트는 양쪽을 모두 노출**한다.
   - `inspire-me`는 `stack`이 FE 3개 뿐인데, 최소한 `Go · Echo · GORM · MySQL` 정도는 추가 (풀스택임을 드러내는 최소 집합).
5. **제품 차별점이 되는 키워드는 배열에 반드시 포함**한다.
   - `ai-chatbot`: `BM25 하이브리드 검색`은 RAG 제품 성격을 보여주는 키워드.
   - `inspire-me`: `OpenAI`, `Unsplash`, `i18n` 같이 외부 연동/다국어 특성을 드러내는 키워드.
   - `it-blog`: `MiniSearch`(클라이언트 검색), `Mermaid`(다이어그램) 같이 읽기 경험을 결정하는 키워드.
6. **언어·프레임워크 이외의 배포/운영 스택**(`Netlify`, `Docker`, `GitHub Actions`)은 overview 본문에도 같이 써주되 배열에는 **핵심 1~2개만** 추린다 (배열이 길어지면 카드 UI가 깨짐).
7. **불확실/레거시 항목 제거**
   - `it-blog`의 Drizzle ORM, `inspire-me`의 "Markdown" 기재처럼 **실제 런타임에서 쓰이지 않는 항목**은 제거한다.

---

## 권장 수정안 (변경만)

**원칙**: 버전 미기재 · UI 라이브러리 제외(shadcn/ui·Tailwind) · **Backend 언어는 반드시 포함**.

### `ai-chatbot/index.md`
```yaml
stack:
  - Next.js
  - Python
  - FastAPI
  - LangChain
  - ChromaDB
  - OpenAI
  - Kubernetes
  - Helm
```

### `inspire-me/index.md`
```yaml
stack:
  - Next.js
  - Go
  - Echo
  - GORM
  - MySQL
  - Redis
  - OpenAI
  - Kubernetes
  - Helm
```

### `investment-blog/index.md`
```yaml
stack:
  - Next.js
  - Markdown
  - Netlify
```

### `it-blog/index.md`
```yaml
stack:
  - Next.js
  - Markdown
  - Netlify
```

### `status/index.md`
```yaml
stack:
  - Next.js
  - Python
  - Supabase
  - GitHub Actions
  - Netlify
```

---

## 변경 범위 / 리스크

- **변경 파일 수**: 5개 (`contents/website/*/index.md`의 frontmatter만)
- **영향 범위**: `v2.advenoh.pe.kr` 홈 포트폴리오 카드의 태그 표시만. 라우팅/빌드 스크립트/Zod 스키마(`lib/portfolio.ts` `portfolioItemSchema`) 변경 없음.
- **확인 필요**: `portfolioItemSchema`가 `stack` 길이 제한이 있을 경우 제한 안에서만 반영 (없으면 그대로 적용).
- **리스크**: 없음. 단순 메타데이터 수정. Netlify 재빌드 1회면 반영된다.
