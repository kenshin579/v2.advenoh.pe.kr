# Profile UI v2 — 구현 문서

> 요구사항: `docs/start/2_profile_ui_v2_prd.md`
> 체크리스트: `docs/start/2_profile_ui_v2_todo.md`

## 1. 기반 스택

- Next.js 16 App Router + React 19 + TypeScript 5.6
- Tailwind v3 + shadcn/ui (기존) + Radix UI (기존)
- `output: 'export'` 정적 export → Netlify 호스팅
- 폰트: IBM Plex Mono / IBM Plex Sans KR / Space Grotesk (`next/font/google`)
- 단일 다크 테마, 한국어 단일 언어 (다국어·라이트모드 비목표)

## 2. 전체 아키텍처

### 레이아웃

```
┌─────── TitleBar (macOS dots · breadcrumb · ⌘K · N/N up) ────────┐
│ Sidebar(236)│    Main(LineGutter + Content)     │ RightRail(300) │
│             │  ├ #readme (Hero)                 │  Commits·26w    │
│             │  ├ #projects (ProjectGrid)        │  Latest posts   │
│             │  ├ #writing (IT)                  │  System         │
│             │  └ #writing-investment (+Quote)   │                 │
└─────── StatusBar (section · 10+ yrs · hotkeys) ──────────────────┘
```

- `app/page.tsx`가 빌드 타임 데이터 로딩 + 최상위 구성
- 반응형: `≤1200px` → RightRail 숨김 / `≤780px` → Sidebar 숨김

### 외부 데이터 실행 시점 매트릭스

| 소스 | 빌드 타임 | 클라이언트 refresh | 선결 조건 |
|---|---|---|---|
| **Status** (Supabase) | ✓ (initialData) | ✓ (마운트 시) | RLS anon read 허용 |
| **RSS** (블로그 2곳) | ✓ (initialData) | ✓ (마운트 시, DOMParser) | 블로그 2곳 CORS 헤더 |
| **GitHub 기여** | ✓ | ✗ | `GITHUB_TOKEN` (Production only) |
| **Skills** (README) | ✓ | ✗ | 없음 |

### 공통 캐시 정책 (옵션 A 하이브리드)

모든 외부 fetch는 다음 4단계를 통과 — 어떤 실패도 빌드 중단을 유발하지 않음.

```
1. 외부 fetch 시도
2. 성공 → .cache/*.json 덮어쓰기 + fresh 반환
3. 실패 → 기존 .cache/*.json 읽기 → stale 반환 (WARN 로그)
4. 파일 부재 → 하드코딩 폴백 반환
```

- `.cache/`는 **레포 루트에 위치 + git 커밋** (오프라인 시드 역할)
- Netlify 런타임에서 덮어쓰이지만 commit되지 않음
- 시드 갱신은 수동 (로컬 빌드 후 개발자가 커밋)

## 3. 구현 순서 (5 phase)

### Phase 0: 선결 조건
1. `supabase/migrations/*.sql` 확인 → anon role이 `services`, `service_status_logs`, `daily_status_summary`에 read 가능한지 검증
   - 미허용 시: (a) advenoh-status에 RLS 완화 PR, 또는 (b) `SUPABASE_SERVICE_KEY`를 Netlify 비공개 env로 주입
2. blog-v2 / investment 두 레포의 `netlify.toml`에 `/rss.xml` CORS 헤더 추가 PR 선행
   - `Access-Control-Allow-Origin: https://advenoh.pe.kr` (또는 `*`)
3. GitHub PAT 발급: `kenshin579` 계정 fine-grained PAT, scope `read:user` → Netlify **Production 컨텍스트에만** `GITHUB_TOKEN` 주입

### Phase 1: 데이터 레이어
- `lib/portfolio.ts` 확장: `portfolioItemSchema`에 `status`, `year`, `role`, `stack[]`, `dek`, `overview`, `featured`, `ext`, `order` 추가. 정렬 `order → slug`
- `lib/status.ts` — 서버/SSG용 Supabase 조회 loader (`services` + `daily_status_summary`), Zod 검증, 공통 캐시 정책
- `lib/github.ts` — GraphQL `contributionsCollection` fetch, 26주 윈도우 (`$to = today`, `$from = today - 26*7`), Zod, 캐시
- `lib/writing.ts` — RSS 2종 `fast-xml-parser` 파싱, 병합, 공통 캐시 정책
- `lib/skills.ts` — raw README fetch + shields.io 배지 파서 (URL path segment + 이스케이프 역치환)
- `lib/stats.ts` — 위 네 소스 집계 (`services up`, `commits · 26w`, `uptime · 90d`, `blog posts`)
- `lib/site-config.ts` — profile 항목(role/focus/stack/based/xp) + 외부 링크 구조화
- `contents/profile/readme.md` — 히어로 KV 정적 콘텐츠 (stack 제외, skills에서 자동 주입)
- `contents/website/*/index.md` — 5개 프로젝트 frontmatter 확장
- `.cache/*.json` 시드 5개 — 로컬에서 한 번 빌드해 생성 후 git 커밋

### Phase 2: 스타일 / 토큰 시스템
- `app/globals.css`에 profile 전용 CSS 변수 추가 (bg/fg/line/accent/상태컬러/폰트)
- `:root`에 초기값 `data-accent="violet" data-density="comfortable" --noise:35`
- `[data-accent="..."]` 5종(violet/red/green/orange/amber) 스킨, `[data-density="compact"]` 축소
- OKLCH 사용 (Chromium/Safari/Firefox 모두 지원)
- `tailwind.config.ts`에 `colors.profile.*`, `fontFamily.mono` (IBM Plex Mono), `fontFamily.sans-kr` (IBM Plex Sans KR)
- `app/layout.tsx`에서 IBM Plex 폰트 추가, `Header`/`Footer` import 제거, `Inter` 제거

### Phase 3: 컴포넌트 구현
`components/profile/` 디렉터리에 집중:

**레이아웃**:
- `TitleBar.tsx` — macOS dots · breadcrumb (scrollSpy 연동) · ⌘K 힌트 · N/N up (status)
- `Sidebar.tsx` — Workspace nav · Status · Links · hop-search
- `RightRail.tsx` — CommitGraph · Latest posts · System
- `StatusBar.tsx` — 현재 섹션 · 10+ yrs · 단축키 힌트
- `LineGutter.tsx` — 라인넘버 gutter

**섹션**:
- `Hero.tsx` — `TypewriterPrompt` + 타이틀 + 소개 + KV list + StatsRow
- `TypewriterPrompt.tsx` — `cat README.md` 등 4시퀀스 + caret blink
- `StatsRow.tsx` — 4-cell stats (services up / commits · 26w / uptime · 90d / blog posts)
- `Sparkline.tsx` — 순수 SVG path, 30줄 내외, 차트 라이브러리 미사용
- `ProjectGrid.tsx` — 6-col grid, featured variant 포함
- `ProjectCardV2.tsx` — `name.ext` · live dot · preview · desc · stack chips · meta-bot · `↵ open` 뱃지
- `WritingList.tsx` — IT/INV activity list, 공용 컴포넌트
- `QuoteBlock.tsx` — 기존 `QuoteRotator`를 터미널풍으로 (12초 자동 순환 + 수동 rotate 버튼)
- `CommitGraph.tsx` — 26주×7일 CSS Grid, 각 셀에 `data-l="0..4"`, hover 툴팁

**오버레이**:
- `ProjectModal.tsx` — hero 이미지 · dek · meta grid · overview · stack chips · prev/next · Open live ↗
- `CommandPalette.tsx` — 기존 `cmdk` 재사용, 섹션/프로젝트/커맨드/링크 통합 검색
- `TweaksPanel.tsx` — 우하단 토글, accent 5색 + density 2단 + noise slider
- `NoiseOverlay.tsx` — SVG `<feTurbulence type="fractalNoise">`, `mix-blend-mode: overlay`, `opacity`를 CSS var에 바인딩

### Phase 4: 인터랙션 / 훅
- `hooks/useKeyboardNav.ts` — j/k/Enter 포커스 인덱스. 입력 요소 포커스 시 early return
- `hooks/useCommandPalette.ts` — 오픈 상태 + 쿼리 + 필터
- `hooks/useProjectModal.ts` — 오픈 idx + prev/next + ESC
- `hooks/useTweaks.ts` — accent/density/noise, `localStorage` 영속화
- `hooks/useScrollSpy.ts` — 섹션 활성 감지 → breadcrumb/sidebar/statusbar 동기화
- `hooks/useLiveStatus.ts` — 클라이언트 마운트 시 Supabase 재조회, initialData 교체 (실패 시 유지)
- `hooks/useLiveWriting.ts` — RSS 두 소스 브라우저 fetch + `DOMParser` 파싱 (의존성 0), initialData 교체
- typewriter, quote rotate는 `setInterval` 기반

**키보드 단축키 정책 (충돌 방지)**:
- 입력 요소 포커스 시 `j`/`k`/`/` 비활성
- `/` 핸들러는 `e.preventDefault()` 첫 줄
- 계층 우선순위: Modal > Palette > Global
- `aria-keyshortcuts` 명시
- `:focus-visible` 로 키보드 네비 시에만 outline

### Phase 5: 통합 및 정리
- `app/page.tsx` 전면 재작성 — 빌드 타임 loader 호출, initialData props 전달, v2 레이아웃 구성
- `app/layout.tsx`에서 `Header`/`Footer` 제거
- `components/Header.tsx`, `Footer.tsx`, `PortfolioCard.tsx`, `PortfolioList.tsx`, `ProjectCard.tsx`, `QuoteRotator.tsx` 삭제
- `package.json`에서 `recharts` 의존성 제거
- `@supabase/supabase-js`, `fast-xml-parser` 추가
- 임시 `/profile-v2` 라우트 사용 시 최종적으로 `/`에 스왑

## 4. 핵심 외부 데이터 연동 상세

### Status (Supabase 하이브리드)

```ts
// lib/status.ts (server/SSG)
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(URL, ANON_KEY)
const { data: services } = await supabase.from('services').select('*')
const { data: summary } = await supabase.from('daily_status_summary').select('*')
// → Zod validate → .cache/status-snapshot.json 덮어쓰기 → StatusSnapshot 반환

// hooks/useLiveStatus.ts (client)
'use client'
export function useLiveStatus(initial: StatusSnapshot) {
  const [data, setData] = useState(initial)
  useEffect(() => { /* 동일 쿼리 재실행 → setData(fresh) */ }, [])
  return data
}
```

**단일 데이터 소스 유지**: Sidebar Status / Hero stats / TitleBar N/N up / RightRail System 모두 같은 훅에서 읽어 Context 또는 props drilling.

### GitHub (빌드 타임 only)

- 26주 윈도우 고정
- `GITHUB_TOKEN` 미존재 시 즉시 폴백 (PR preview 대응)
- `contributionLevel` → CSS `data-l="0..4"` 매핑
- `totalContributions` 26주 합계 → stats 표시값

### RSS (하이브리드)

- 서버: `fast-xml-parser` (Node 호환, 번들 경량)
- 클라이언트: 브라우저 `fetch` + `DOMParser.parseFromString(xml, 'application/xml')` — 의존성 추가 0
- 두 블로그 모두 병합 → 중앙 섹션용(각 5개) · RightRail용(병합 6개) 분리
- IT/INV 뱃지는 **블로그 소스 기반**으로만 판별 (category/URL 파싱 없음)

### Skills (빌드 타임 only)

파싱 파이프라인:
1. `https://raw.githubusercontent.com/kenshin579/kenshin579/master/README.md` fetch
2. 그룹 헤더(`- 💻 &nbsp;` 등) 단위로 split
3. `!\[[^\]]*\]\(https:\/\/img\.shields\.io\/badge\/([^?)]+)` 로 URL path만 캡처 (alt 무시)
4. 정식 스킬명 추출:
   - `decodeURIComponent` (%20 → 공백)
   - 말미 color hex `-[0-9A-Fa-f]{3,8}$` 제거
   - 선행 `-` 제거 (no-label 패턴)
   - 이스케이프 역치환: `--` → `-`, `__` → `_` 먼저, 그다음 나머지 `_` → 공백
   - `trim()`
5. `{ groups: [{ emoji, label, items[] }], flat: string[] }` 반환

Hero `stack` 라인은 `groups[0]` (Languages) + `groups[2]` (Cloud) 기본 병합.

## 5. 환경 변수

| 변수 | 스코프 | 용도 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 모든 컨텍스트 | Status 조회 (서버·클라이언트 공통) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 모든 컨텍스트 | Status 조회 (RLS anon read) |
| `SUPABASE_SERVICE_KEY` | 빌드 전용 (비공개) | RLS anon 미허용 시 대체 |
| `GITHUB_TOKEN` | **Production only** | GitHub GraphQL 인증 |

PR preview · Branch Deploy에선 `GITHUB_TOKEN` 부재 → 히트맵 빈 폴백 + "offline" 뱃지.

## 6. 이미지 / 에셋

- 프로젝트 커버는 기존 `contents/website/{slug}/cover.png` 경로 유지
- `scripts/copy-portfolio-images.js` (prebuild)가 `public/`으로 복사하는 **기존 파이프라인 재사용**
- 신설 경로(`public/portfolio/{slug}/cover.png`) 도입 안 함
- 아이콘: `lucide-react` 계속 사용

## 7. 접근성

- `aria-keyshortcuts` 명시 (키보드 단축키 정책 섹션 참조)
- 모달: `role="dialog"`, `aria-modal="true"`, 포커스 트랩, ESC 닫힘
- Sidebar 항목: `role="button"` 또는 `role="tab"`
- WCAG AA: `--muted-2` vs `--bg-2` 대비비 검증 필요

## 8. SEO / 메타

- `app/layout.tsx` metadata 유지, og-image v2 디자인으로 교체 검토
- JSON-LD Person/WebSite 유지, 프로젝트 `ItemList` 추가 검토

## 9. 마이그레이션

1. `/profile-v2` 임시 라우트에서 디자인 수렴
2. `portfolioItemSchema` 확장 — 신규 필드는 optional
3. 신규 컴포넌트/훅을 `components/profile/`, `hooks/`에 집중 배치
4. `/`에 스왑, 구 컴포넌트 삭제
5. Netlify preview로 데스크톱/태블릿/모바일 교차 검증

## 10. 테스트 계획

- **빌드**: `npm run check` (타입), `npm run build` (정적 export 산출물 확인)
- **정적 export**: `out/` 디렉터리 생성 및 주요 HTML 검증
- **반응형 QA**: 1440 / 1100 / 768 / 375 브레이크포인트
- **브라우저 QA**: Chrome / Safari (OKLCH + `mix-blend-mode`)
- **컨텐츠 QA**: 5개 프로젝트 · 10개 writing · 6개 quote 로딩 확인
- **MCP Playwright** 자동화:
  - `/` 로드 후 Hero 섹션에서 KV list + stats 렌더 확인
  - 프로젝트 카드 `j`/`k` 포커스 이동 후 `Enter`로 모달 열기, `←`/`→` 이동, `Esc` 닫기
  - `⌘K` 커맨드 팔레트 열기, 섹션 점프 실행, `Esc` 닫기
  - `/` 로 팔레트 재오픈 (preventDefault 검증)
  - 입력 요소 포커스 시 `j`/`k` 비활성 검증
  - Tweaks panel 열어 accent 5색 전환, density 토글, noise slider 동작 확인 + localStorage 영속화 검증
  - status: 마운트 시 클라이언트 refresh로 값 변경 확인 (`useLiveStatus`)
  - 반응형 1100px·768px 에서 RightRail/Sidebar 숨김 확인
