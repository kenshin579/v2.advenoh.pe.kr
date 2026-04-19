# Profile UI v2 — Todo 체크리스트

> 요구사항: `2_profile_ui_v2_prd.md`
> 구현 가이드: `2_profile_ui_v2_implementation.md`

## Phase 0. 선결 조건 (외부 레포 PR 및 확인)

- [x] `advenoh-status/supabase/migrations/*.sql`에서 `services`, `service_status_logs`, `daily_status_summary` 테이블의 RLS anon read 정책 확인 → 3개 모두 anon read 허용 확인됨, service_key 대체안 폐기
- [x] `blog-v2.advenoh.pe.kr/netlify.toml`에 `/rss.xml` CORS 헤더 추가 PR → kenshin579/blog-v2.advenoh.pe.kr#458 (머지 완료)
- [x] `investment.advenoh.pe.kr/netlify.toml`에 `/rss.xml` CORS 헤더 추가 PR → kenshin579/investment.advenoh.pe.kr#129 (머지 완료)
- [x] investment 빌드 차단 이슈 수정 PR (TOC ReactMarkdown 닫는 태그 누락 버그, PR #126 유래) → kenshin579/investment.advenoh.pe.kr#132 (머지 완료)
- [x] 두 블로그 PR 머지 + 배포 완료 후 `curl -I` 로 `Access-Control-Allow-Origin: *` 헤더 응답 확인 완료
- [x] `kenshin579` 계정에서 fine-grained PAT 발급 (scope: `read:user`) — 사용자 완료
- [x] Netlify **Production 컨텍스트**에만 `GITHUB_TOKEN` 주입 (Deploy Preview / Branch Deploy 미주입) — 사용자 완료
- [x] Netlify에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 주입 (모든 컨텍스트) — 사용자 완료

## Phase 1. 데이터 레이어 (`lib/`, `contents/`)

### 스키마 / 콘텐츠

- [x] `lib/portfolio.ts` schema 확장 (`status`, `year`, `role`, `stack[]`, `dek`, `overview`, `featured`, `ext`, `order`) — 기존 필드 optional 유지
- [x] 정렬 기준 `order → slug` 로 변경
- [x] `contents/website/*/index.md` 5건 frontmatter 확장 (신규 필드 채움, 추후 사용자가 값 조정 가능)
- [x] `contents/profile/readme.md` 신규 — 히어로 KV(role/focus/based/xp), stack 제외
- [x] `lib/site-config.ts` — 외부 링크(github/status/blog rss/investment rss) + 5개 services + `githubLogin` 구조화

### 외부 데이터 Loader

- [x] `@supabase/supabase-js`, `fast-xml-parser` npm 추가 / `recharts` 제거
- [x] `lib/cache.ts` — 공통 캐시 유틸 (`withCache`, `readCache`, `writeCache`)
- [x] `lib/status.ts` — Supabase `services` + `daily_status_summary` 조회, Zod 검증, 공통 캐시 정책 적용, 하드코딩 폴백
- [x] `lib/github.ts` — GraphQL `contributionsCollection` (26주 윈도우), Zod, 캐시, 폴백. `GITHUB_TOKEN` 부재 시 즉시 폴백
- [x] `lib/writing.ts` — 두 RSS `fast-xml-parser` 파싱, 병합, 공통 캐시 정책, `getWritingSections` / `getLatestPosts`
- [x] `lib/skills.ts` — raw README fetch + shields.io 배지 파서 (URL path segment + 이스케이프 역치환), `pickHeroStack` 유틸
- [x] `lib/stats.ts` — 4-cell stats 집계 (`services up`, `commits · 26w`, `uptime · 90d`, `blog posts`)
- [x] `scripts/warm-cache.ts` — 로컬에서 시드 생성용 스크립트

### 캐시 시드

- [ ] `.cache/` 디렉터리 생성 (최초 실행 시 자동 생성됨)
- [ ] 로컬 `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `GITHUB_TOKEN` 설정 후 `npx tsx scripts/warm-cache.ts` 실행 → `.cache/*.json` 5개 생성
- [ ] `.cache/*.json` git에 커밋 (시드)

## Phase 2. 스타일 / 토큰

- [x] `app/globals.css`에 profile CSS 변수 추가 (bg/fg/line/accent/상태/density/noise)
- [x] `<html>`에 초기값 `data-accent="violet" data-density="comfortable"` 주입 (+ `--profile-noise: 0.35`)
- [x] `[data-accent="..."]` 5종 스킨 (violet/red/green/orange/amber) — OKLCH
- [x] `[data-density="compact"|"comfortable"]` 카드/섹션 간격 변수화
- [x] `tailwind.config.ts` 확장 (`colors.profile.*`, fontFamily sans/mono/display를 var 기반으로 통일)
- [x] `app/layout.tsx`에 `IBM_Plex_Sans_KR` / `IBM_Plex_Mono` / `Space_Grotesk` 추가 (`next/font/google`, variable `--font-sans` / `--font-mono` / `--font-display`)
- [x] `Inter` 제거, `Header` / `Footer` import·사용 완전 제거
- [x] 타입 체크(`npm run check`) 통과 — OKLCH는 모던 Chromium/Safari/Firefox 지원, 브라우저 QA는 Phase 8에서 확인

## Phase 3. 컴포넌트 구현 (`components/profile/`)

### 레이아웃 컴포넌트

- [x] `TitleBar.tsx` — dots · breadcrumb · ⌘K 힌트 · N/N up (scrollSpy 연동은 Phase 4)
- [x] `Sidebar.tsx` — Workspace nav · Status · Links (hop-search는 CommandPalette에 통합 예정)
- [x] `RightRail.tsx` — Commits 헤더 + Latest posts + System (히트맵 placeholder)
- [x] `StatusBar.tsx` — 섹션 · 10+ yrs · 단축키 힌트
- [x] `LineGutter.tsx` — 라인넘버 gutter
- [x] `app/page.tsx` 3-column 프레임 재작성, 모든 loader 병렬 호출로 initialData 구성

### Hero 섹션

- [x] `Hero.tsx` — prompt + title + 소개 + KV + stats 조립, `contents/profile/readme.md` frontmatter/body 로드
- [x] `TypewriterPrompt.tsx` — 4시퀀스 순환 + caret blink (1.1s)
- [x] `StatsRow.tsx` — 4-cell (services up / commits 26w / uptime 90d / blog posts), Sparkline + 10-bar uptime 포함
- [x] `Sparkline.tsx` — 순수 SVG path (currentColor 바인딩, 차트 라이브러리 미사용)

### Projects 섹션

- [x] `ProjectGrid.tsx` — 2-col grid(md), featured는 col-span-2 풀 너비
- [x] `ProjectCardV2.tsx` — `name.ext` · live dot(pulse) · cover Image · dek · stack chips · year/role meta · `↵ open ↗` 뱃지
- [x] hover scale(1.02), border 색상 변화

### Writing 섹션

- [x] `WritingList.tsx` — IT/INV activity list 공용, 블로그 소스 기반 `IT`/`INV` 뱃지
- [x] `QuoteBlock.tsx` — 터미널풍(`$ fortune`), 12초 자동 순환 + 수동 ↻ rotate 버튼

### CommitGraph

- [x] `CommitGraph.tsx` — 26주×7일 CSS Grid + `data-l="0..4"`, title 속성 tooltip (차트 라이브러리 미사용)
- [x] `contributionLevel` enum → `data-l` 매핑 + `color-mix` 기반 accent 그라데이션
- [x] Less/More 레전드 포함

### 오버레이

- [ ] `ProjectModal.tsx` — `role="dialog"`, `aria-modal="true"`, 포커스 트랩, prev/next, Open live ↗
- [ ] `CommandPalette.tsx` — 기존 `cmdk` 재사용, 섹션/프로젝트/커맨드/링크 통합 검색
- [ ] `TweaksPanel.tsx` — 우하단 토글, accent 5색 + density 2단 + noise slider
- [ ] `NoiseOverlay.tsx` — SVG `feTurbulence`, `mix-blend-mode: overlay`

## Phase 4. 훅 (`hooks/`)

- [ ] `useKeyboardNav.ts` — j/k/Enter/포커스 인덱스. 입력 요소 포커스 시 early return
- [ ] `useCommandPalette.ts` — 오픈 상태 + 쿼리 + 필터
- [ ] `useProjectModal.ts` — 오픈 idx + prev/next + ESC
- [ ] `useTweaks.ts` — accent/density/noise, `localStorage` 영속화
- [ ] `useScrollSpy.ts` — 섹션 활성 감지 → breadcrumb 동기화
- [ ] `useLiveStatus.ts` — 클라이언트 마운트 시 Supabase 재조회, initialData 교체
- [ ] `useLiveWriting.ts` — 브라우저 `fetch` + `DOMParser` RSS 파싱, initialData 교체

### 키보드 단축키 정책 적용

- [ ] 입력 요소(`<input>`, `<textarea>`, `[contenteditable="true"]`) 포커스 시 `j`/`k`/`/` 비활성
- [ ] `/` 핸들러 첫 줄에 `e.preventDefault()`
- [ ] 계층 우선순위 구현: Modal > Palette > Global
- [ ] 프로젝트 카드에 `aria-keyshortcuts="j k Enter"` 명시
- [ ] 팔레트 트리거에 `aria-keyshortcuts="Meta+K /"` 명시
- [ ] `:focus-visible` 기반 outline 적용

## Phase 5. 통합

- [ ] `/profile-v2` 임시 라우트에서 개발 (격리)
- [ ] `app/page.tsx` 빌드 타임 loader 호출 (`lib/status.ts`, `github.ts`, `writing.ts`, `skills.ts`, `portfolio.ts`)
- [ ] initialData props를 Client component로 전달
- [ ] Sidebar Status / Hero stats / TitleBar N/N up / RightRail System → `useLiveStatus` 단일 소스 (Context 또는 props drilling)
- [ ] 애니메이션 적용: caret blink, pulse (1.6s), project hover scale, smooth scroll
- [ ] 반응형 검증: `≤1200px` RightRail 숨김, `≤780px` Sidebar 숨김
- [ ] `/profile-v2` → `/`로 스왑

## Phase 6. 정리

### 삭제

- [ ] `components/Header.tsx`
- [ ] `components/Footer.tsx`
- [ ] `components/PortfolioCard.tsx`
- [ ] `components/PortfolioList.tsx`
- [ ] `components/ProjectCard.tsx`
- [ ] `components/QuoteRotator.tsx`

### 의존성 정리

- [ ] `package.json`에서 `recharts` 제거
- [ ] `package.json`에서 `Inter` 사용 확인 후 불필요 시 제거

### 레이아웃 / 라우트

- [ ] `app/layout.tsx`에서 `Header` / `Footer` import·사용 완전 제거
- [ ] `app/not-found.tsx` 기본 마크업 확인 (참조 없음 이미 검증됨)

## Phase 7. 접근성 / SEO

- [ ] `aria-keyshortcuts` 전체 적용 확인
- [ ] ProjectModal: `role="dialog"` + `aria-modal="true"` + 포커스 트랩 + ESC 닫힘
- [ ] Sidebar 항목 `role="button"` 또는 `role="tab"`
- [ ] WCAG AA 대비비 검증 (`--muted-2` vs `--bg-2` 등)
- [ ] og-image를 v2 디자인에 맞게 교체 검토
- [ ] JSON-LD에 프로젝트 `ItemList` 추가 검토

## Phase 8. 테스트

### 빌드 검증

- [ ] `npm run check` 타입 검사 통과
- [ ] `npm run build` 정적 export 성공
- [ ] `out/` 디렉터리 산출물 확인 (HTML, CSS, JS, 이미지)
- [ ] 빌드 로그에서 외부 fetch WARN 발생 시 캐시 폴백 동작 검증

### 수동 QA

- [ ] 반응형 1440 / 1100 / 768 / 375 브레이크포인트 각각 확인
- [ ] Chrome / Safari 교차 검증 (OKLCH + `mix-blend-mode`)
- [ ] 5개 프로젝트 + 10개 writing + 6개 quote 로딩 확인
- [ ] 키보드만으로 전체 내비게이션: `⌘K`, `/`, `j/k`, `Enter`, `←→`, `ESC`
- [ ] Tweaks panel: accent 5색 전환 · density 토글 · noise slider 동작 + 새로고침 후 `localStorage` 영속화 확인
- [ ] 페이지 refresh 시 Status / RSS 클라이언트 refresh로 fresh 데이터 반영 확인

### MCP Playwright 자동화

- [ ] `/` 로드 후 Hero KV + stats 렌더 검증
- [ ] 프로젝트 카드 `j`/`k` 포커스 이동 → `Enter` 모달 열기 → `←`/`→` 이동 → `Esc` 닫기
- [ ] `⌘K` 커맨드 팔레트 열기 → 섹션 점프 실행 → `Esc` 닫기
- [ ] `/` 키로 팔레트 재오픈 (Firefox `preventDefault` 검증)
- [ ] input 포커스 상태에서 `j`/`k` 비활성 검증
- [ ] Tweaks panel 열기 → accent 5색 전환 → density 토글 → noise slider 0/50/100 → 새로고침 후 영속화 확인
- [ ] `useLiveStatus` 클라이언트 refresh 검증 (마운트 후 값 업데이트)
- [ ] 1100px 뷰포트에서 RightRail 숨김, 768px 에서 Sidebar 숨김 확인

## Phase 9. 배포

- [ ] Netlify Deploy Preview 확인 (PR preview 빌드에서 GitHub 히트맵 폴백 표시 검증)
- [ ] Netlify Production 배포 (GitHub 히트맵 실데이터 로드 검증)
- [ ] Production 배포 후 `/` 에서 페이지 refresh 시 Status/RSS 클라이언트 refresh 동작 재검증
- [ ] `status.advenoh.pe.kr` 링크 클릭 이동 확인
- [ ] 콘솔 에러 0 확인
