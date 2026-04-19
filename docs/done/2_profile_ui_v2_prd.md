# PRD: Profile UI v2 — IDE/터미널 스타일 포트폴리오 리디자인

## 개요
홈 페이지 전체를 IDE/터미널 스타일(README.md-as-site)로 재구성한다.
좌측 파일 탐색기 · 중앙 코드 뷰어 · 우측 위젯 패널을 갖춘 3-column 레이아웃과,
커맨드 팔레트 · 프로젝트 모달 · 비모달 키보드 내비게이션 등 IDE 인터랙션을 도입한다.

기준 디자인: `docs/start/Profile/Profile v2.html` + `docs/start/Profile/assets/`
기반 스택: Next.js 16 App Router + React 19 + TypeScript 5.6 + Tailwind v3 (정적 export, `output: 'export'`).

## 배경
- 현재 홈은 단순 히어로 + 3-col 프로젝트 그리드 구조로, "Backend/AI 엔지니어" 정체성을 시각적으로 드러내지 못한다.
- 글쓰기(IT 블로그, 투자 블로그), 운영 상태, 커밋 활동 등 운영 중인 개인 자산이 노출되지 않는다.
- 프로젝트 상세 정보(스택, 연도, 역할, 개요)가 외부 링크 클릭 전까지 노출되지 않는다.

## 목표
- IDE 메타포를 통해 "개발자 포트폴리오"라는 정체성을 전면화.
- 프로젝트, 글쓰기, 운영 상태를 한 화면에서 한눈에 조망.
- 키보드 중심 사용자(⌘K, j/k, ←→, Enter, /)에게 최적화된 인터랙션 제공.
- 모든 UI 토큰(컬러·밀도·노이즈)을 CSS 변수로 관리해 향후 테마 확장이 쉬운 구조.

## 비목표
- **라이트 모드 재도입** — 다크 단일 테마 유지 (확정, 논의 종료)
- **다국어화(i18n)** — 한국어 단일 유지 (확정, 논의 종료)
- 블로그 포스트/투자 포스트의 원문을 사이트 내에 렌더링 (목록만 노출, 클릭 시 외부 이동)
- 로그인·댓글 등 동적 기능 (정적 사이트 유지)

---

## 레퍼런스 디자인 요약

### 전체 레이아웃
```
┌───────── Title Bar (macOS dots · breadcrumbs · ⌘K · 5/5 up) ─────────┐
│ Sidebar     │            Main (README.md scroll)           │ R-Rail │
│ (236px)     │  ┌ line │ content                         ┐  │ (300px)│
│  ─ Search   │  │  gut │ · readme (hero/stats)          │  │  Graph │
│  ─ Nav      │  │  ter │ · projects (featured + grid)   │  │  Posts │
│  ─ Status   │  │      │ · writing IT                    │  │  Sys   │
│  ─ Links    │  │      │ · writing investment + quote   │  │        │
└───────── Status Bar (section · 10+ yrs · hotkeys) ───────────────────┘
```

### 섹션 구성 (중앙 메인)
1. **`#readme`** — 히어로
   - 프롬프트: `frank@seoul:~/profile (main)$ ` + typewriter 시퀀스 (`cat README.md`, `ls ./projects`, `git log --since="2015"`, `echo "hire me?"`) + 깜박이는 caret
   - Hero title: `// frank oh;` (Space Grotesk, 56–128px clamp)
   - 소개 문단 (본인 소개 · 버전 뱃지는 사용하지 않음)
   - KV list: `role`, `focus`, `stack`, `based`, `xp`
   - Stats 4-cell: `services up`, `commits · '25`, `uptime · 90d`, `blog posts` (스파크라인/바/pulse dot 포함)
2. **`#projects`** — 6-col 파일 그리드
   - featured 카드 (풀 너비, 1.2fr/1fr, 240px preview)
   - 일반 카드 4개 (span 3): `name.ext` + live dot + preview image + desc + stack 태그 + meta-bot
   - Hover/focused 상태, `↵ open` 단축키 배지
3. **`#writing`** — Recent IT writing (activity list, 5개). 각 항목 앞에 **`IT`** 타입 뱃지 (블로그 소스 기반)
4. **`#writing-investment`** — Recent investment writing (activity list, 5개). 각 항목 앞에 **`INV`** 타입 뱃지 (블로그 소스 기반) + 하단 quote block (rotate 버튼, 12초 자동 순환)

### 우측 레일 (≥1200px에서만 표시)
- `Commits · YYYY` — 26주 × 7일 히트맵 + 레전드 + 호버 툴팁
- `Latest posts` — 최신 글 6개 (IT/INV 태그 뱃지)
- `System` — services, last deploy, region, build

### 오버레이 UI
- **Command palette** (⌘K 또는 `/`): 섹션/프로젝트/커맨드/링크 통합 검색, ↑↓ Enter ESC
- **Project modal**: 프로젝트 클릭 시 열림. hero 이미지 · dek · meta grid(status/year/role/url) · overview HTML · stack chips · ←→ 이동, Open live ↗
- **Tweaks panel** (우하단 토글): accent 5색(violet/red/green/orange/amber), density(comfortable/compact), noise slider 0–100
- **Noise overlay**: SVG fractalNoise, mix-blend-mode overlay, opacity는 noise 변수에 바인딩

### 인터랙션 및 키보드
| 키 | 동작 |
|---|---|
| `⌘K` / `/` | 커맨드 팔레트 토글 |
| `j` / `k` | 프로젝트 카드 포커스 이동 |
| `Enter` | 포커스된 프로젝트 모달 열기 |
| `← →` | 모달 내 이전/다음 프로젝트 |
| `ESC` | 모달/팔레트 닫기 |
| `⌘K` 힌트 | 타이틀바 우측, 상태바 우측에 표시 |

### 키보드 단축키 정책 (충돌 방지)

- **입력 요소 포커스 시 단일키 비활성**: `e.target`이 `<input>`, `<textarea>`, `[contenteditable="true"]`일 때 `j` / `k` / `/` 핸들러는 early return. 사용자가 `Esc`로 입력 포커스를 해제하면 전역 단축키가 자동 재활성.
- **`/` 핸들러는 preventDefault**: Firefox의 "Find as You Type" 등 브라우저 기본 동작을 차단하기 위해 handler 첫 줄에 `e.preventDefault()`.
- **단축키 계층 우선순위** (위에서 아래로, 상위 UI가 열려 있으면 하위 단축키 비활성):
  1. **프로젝트 모달 열림** → `←` / `→`(prev/next), `Esc`(close), `Enter`(Open live) 만 유효
  2. **커맨드 팔레트 열림** → `↑` / `↓`(포커스 이동), `Esc`(close), `Enter`(실행) 만 유효
  3. **평상시(전역)** → `⌘K` / `/`(팔레트 열기), `j` / `k`(카드 포커스), `Enter`(포커스 카드 모달 열기)
- **`aria-keyshortcuts` 안내**: 프로젝트 카드에 `aria-keyshortcuts="j k Enter"`, 팔레트 트리거에 `aria-keyshortcuts="Meta+K /"` 등 명시해 스크린리더 안내.
- **포커스 인디케이터**: 키보드 네비게이션 중엔 `:focus-visible` 선택자로 accent 컬러 `outline` 명확히 표시. 마우스 클릭 포커스에선 `outline` 숨김.

### 디자인 토큰 (CSS 변수)
- **배경**: `--bg #0a0a0c`, `--bg-2 #0d0d10`, `--bg-3 #111115`
- **전경**: `--fg #ededec`, `--fg-2 #c7c7c5`, `--muted #797978`, `--muted-2 #5a5a59`
- **라인**: `--line` `rgba(255,255,255,0.07)`, `--line-2` `0.12`, `--line-3` `0.22`
- **악센트**: `--accent oklch(0.68 0.19 295)` (violet 기본) + `--accent-soft` (16% alpha) + `--accent-ink`
- **상태컬러**: `--green #4ade80`, `--yellow #facc15`, `--red #f87171`
- **폰트**: `--mono "IBM Plex Mono"`, `--sans "IBM Plex Sans KR"`, `--display "Space Grotesk"`
- `[data-accent="..."]`로 5가지 악센트 스킨 전환
- `[data-density="compact"]`로 stats/cards/section padding 축소

### 반응형
- **≤1200px**: `.rside` 숨김, `.sidebar` 220px, 프로젝트 카드 span 6 (풀 너비), featured 이미지 상단 배치
- **≤780px**: `.sidebar` 숨김, stats 2-col, skills/contact 1-col, 라인넘버 숨김, 페이지 1-col

---

## 현재 상태 vs 목표 상태 Gap

### 현재 (main 브랜치)
- `app/page.tsx` — 단순 1컬럼 히어로(`HI THERE I'M FRANK OH…`) + 3-col 프로젝트 그리드
- `components/Header.tsx` — 고정 헤더 (로고 + SNS 아이콘 3개, `mix-blend-difference`)
- `components/Footer.tsx` — 푸터
- `components/ProjectCard.tsx` — 원형 아바타 + 우측 설명 + index 번호, aspect-[16/9]
- `components/QuoteRotator.tsx` — 텍스트 로테이터 존재
- `lib/portfolio.ts` — `site · title · description · cover · slug`만 지원
- 폰트: Inter + Space Grotesk
- 라우트: `/` (`not-found` 제외 단일 페이지)
- 콘텐츠: `contents/website/{5개 프로젝트}/index.md`, `contents/quote/*.md`

### Gap (추가/변경 필요)

**레이아웃 / 페이지 구조**
- 3-column 그리드 + Title Bar + Status Bar 신설 — `app/page.tsx` 전면 재작성
- `components/Header.tsx` → Title Bar 역할로 교체(또는 Header 제거 후 ProfileTitleBar 신설)
- `components/Footer.tsx` → Status Bar로 대체(또는 유지+숨김)
- 메인 영역에 `.page` (라인넘버 gutter + content) 구조

**신규 컴포넌트**
- `components/profile/TitleBar.tsx`
- `components/profile/StatusBar.tsx`
- `components/profile/Sidebar.tsx` (Workspace nav · Status · Links · hop-search)
- `components/profile/RightRail.tsx` (Graph · Posts · System)
- `components/profile/Hero.tsx` (prompt typewriter · hero title · kvs · stats)
- `components/profile/StatsRow.tsx` + `Sparkline.tsx` (**순수 SVG 자체 구현**, 차트 라이브러리 미사용)
- `components/profile/ProjectGrid.tsx` + `ProjectCardV2.tsx` (featured variant 포함)
- `components/profile/ProjectModal.tsx`
- `components/profile/CommandPalette.tsx`
- `components/profile/WritingList.tsx` (IT / Investment 공용)
- `components/profile/QuoteBlock.tsx` (기존 `QuoteRotator`를 터미널 풍으로 리디자인)
- `components/profile/CommitGraph.tsx` (히트맵 + 툴팁, CSS Grid + `data-l`로 구현, 차트 라이브러리 미사용)
- `components/profile/TweaksPanel.tsx` (accent · density · noise)
- `components/profile/LineGutter.tsx`
- `components/profile/NoiseOverlay.tsx`
- `components/profile/TypewriterPrompt.tsx`

**콘텐츠/데이터 확장**
- `contents/website/{slug}/index.md` frontmatter 확장 필요:
  - `status` (`live`, `live · v1.3` 등), `year` (`2024 — now`), `role` (`Solo`, `Author`), `stack` (string[]), `dek` (modal 요약), `overview` (Markdown/HTML), `featured` (boolean), `ext` (`.go`, `.py`, `.md`, `.ts` 등), `order`
  - Zod schema(`portfolioItemSchema`) 확장 + `PortfolioItem` 타입 반영
- 새 데이터 소스:
  - **IT 글쓰기**: `https://blog.advenoh.pe.kr/rss.xml` RSS 피드를 파싱 (`title`, `link`, `pubDate`, `category`, `description`). **하이브리드 (SSG + 클라이언트 refresh)** — 빌드 타임에 initialData 생성, 페이지 마운트 시 클라이언트에서 재fetch해 fresh로 교체.
  - **투자 글쓰기**: `https://investment.advenoh.pe.kr/rss.xml` 동일 방식으로 하이브리드 처리.
  - `contents/profile/readme.md` — 히어로 KV(role/focus/based/xp) — 버전 뱃지 필드 없음
    - **`stack` 라인은 제외** — GitHub 프로필 README(`github.com/kenshin579/kenshin579`)에서 빌드 타임에 자동 추출 (아래 "외부 데이터 연동 · Skills" 참조)
  - `lib/writing.ts` — **서버/SSG용**. Node 환경에서 두 RSS 피드 fetch·파싱 (`fast-xml-parser` 권장 — Node 호환, 번들 경량). 공통 캐시 정책 적용. `app/page.tsx`가 빌드 타임에 호출해 initialData 생성
    - 중앙 메인 `#writing`·`#writing-investment` 섹션에 각 5개
    - 우측 레일 `Latest posts`에 두 피드 병합 후 날짜순 상위 6개 (IT/INV 태그 포함)
  - `hooks/useLiveWriting.ts` — **클라이언트 refresh 훅**. 브라우저 `fetch(rssUrl)` + `DOMParser`로 XML 파싱 (의존성 0, 번들 영향 없음). fetch 실패 시 initialData 유지
  - **선결 조건 (블로그 2곳 CORS)**: `blog-v2.advenoh.pe.kr` / `investment.advenoh.pe.kr`의 `netlify.toml`에 `/rss.xml`에 대한 `Access-Control-Allow-Origin: https://advenoh.pe.kr` (또는 `*`) 헤더 추가 필요. 두 레포에 별도 PR 선행.
  - `lib/stats.ts` — stats(services up, commits, uptime, posts) 값 소스. 각 지표는 다음 외부 소스에서 빌드 타임에 수집:
    - `services up`, `uptime · 90d` → **Advenoh Status 연동** (아래 "외부 데이터 연동 · Status" 섹션 참조)
    - `commits · 'YY` → **GitHub API 연동** (아래 "외부 데이터 연동 · GitHub" 섹션 참조)
    - `blog posts` → IT RSS 피드 아이템 수로 자동 계산

---

## 외부 데이터 연동

### 공통 캐시 정책 (옵션 A 하이브리드 · 확정)

외부 fetch 4종(RSS×2, GitHub GraphQL, Supabase, Skills README)은 다음 공통 폴백 정책을 따른다. 어떤 외부 의존성도 빌드 실패의 원인이 되지 않는다.

**저장 구조 (레포 루트)**:
```
.cache/
├── github-contrib.json
├── status-snapshot.json
├── writing-blog.json
├── writing-investment.json
└── skills.json
```

**각 loader 동작 순서**:
1. 외부 fetch 시도
2. 성공 → 해당 `.cache/*.json` 덮어쓰기 + fresh data 반환
3. 실패 → 기존 `.cache/*.json` 읽기 → stale data 반환 (빌드 로그에 `WARN`)
4. 파일 부재 → 하드코딩 폴백 반환 (빌드는 항상 성공)

**git 관리 규칙**:
- `.cache/*.json`은 **git에 커밋**한다 (`.gitignore` 제외 아님). 초기 PR에 시드 포함으로 첫 빌드·오프라인 환경에서도 동작 보장
- Netlify 빌드에선 `.cache/*.json`이 런타임에 덮어쓰이지만 commit되지 않으므로 git 히스토리 노이즈 없음
- 시드 갱신은 **수동** — 필요 시 개발자가 로컬 빌드 후 커밋. scheduled workflow 자동 갱신은 Out-of-Scope

**하드코딩 폴백 정의** (파일 부재 최후 방어):
| loader | 폴백 값 |
|---|---|
| `lib/github.ts` | 빈 26주×7일 grid + `totalContributions: 0` + "offline" 뱃지 |
| `lib/status.ts` | 빈 services + `summary: {up:0, total:0, uptime90d:0, lastIncidentAt:null}` |
| `lib/writing.ts` | 빈 posts 배열, writing 섹션에 "no recent posts" placeholder |
| `lib/skills.ts` | 하드코딩된 대표 스킬 리스트 (Languages 그룹 기준 예시값) |

### Status (`https://status.advenoh.pe.kr/`)
소스 레포: `/Users/user/WebstormProjects/advenoh-status` (Next.js + Supabase + GitHub Actions 헬스체크)

**현재 아키텍처**:
```
GitHub Actions (cron) → Python health_check.py → Supabase Postgres
                                                      ↓
                                 services · service_status_logs · daily_status_summary (table)
                                                      ↓
                                        advenoh-status 프론트엔드 (anon key + RLS read)
```

**연동 후보 3안**:

| 안 | 방식 | 장점 | 단점 |
|---|---|---|---|
| **A. Supabase 직접 조회** | v2에 `@supabase/supabase-js` 추가, `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` 사용해 빌드 타임에 `services`·`daily_status_summary` 조회 | 재사용 용이, 실제 90일 데이터 그대로 사용 | v2가 status의 DB 스키마에 종속됨, 두 프로젝트 RLS 정책을 함께 관리 |
| **B. Status 사이트에 JSON endpoint 추가** | advenoh-status에 `public/api/snapshot.json` (빌드 시 생성) 또는 `/api/snapshot`(ISR) 노출 → v2가 fetch | 스키마 변경에 유연, v2는 Supabase 몰라도 됨 | status 쪽에 작업 필요, CORS·캐시 정책 고려 |
| **C. health_check.py가 JSON 발행** | Python 스크립트에 snapshot export 추가 → GitHub Pages/S3/gist에 업로드 → v2가 fetch | v2는 단일 JSON URL만 바라봄, 캐시 친화 | 발행 경로 신설 필요, 배포 지연(5분 cron 사이클) |

**확정 · 안 A + 하이브리드 refresh (SSG + 클라이언트 재조회)**:
- 이유: advenoh-status가 별도 백엔드를 운영하지 않고, 추가 인프라(Netlify Functions, 외부 JSON 호스트) 없이 기존 Supabase를 그대로 데이터 소스로 사용. 빌드 타임 쿼리 결과를 HTML에 embed하되, **클라이언트 마운트 시 동일 쿼리를 재실행해 최신값으로 덮어씀** — 페이지 새로고침만으로 fresh 데이터를 확보해 Netlify scheduled build나 webhook 재빌드 없이도 실시간성을 얻는다.
- **v2 쪽 작업**:
  - `@supabase/supabase-js` 의존성 추가 (서버·클라이언트 양쪽에서 사용)
  - `lib/status.ts` — **서버 컴포넌트/SSG**용 모듈. `services` + `daily_status_summary` 테이블 조회, Zod 검증, 실패 시 공통 캐시 정책 폴백. `app/page.tsx`가 빌드 타임에 호출해 initialData 생성
  - `hooks/useLiveStatus.ts` (또는 `lib/status.client.ts`) — `'use client'` 훅. 동일 Supabase 조회를 브라우저에서 재실행해 initialData를 fresh로 교체. fetch 실패 시 initialData 유지(에러 숨김)
  - Sidebar `Status` 블록 · Hero stats (`services up`, `uptime · 90d`) · Title Bar `N/N up` · 우측 레일 `System`은 모두 동일한 hook에서 읽어 **단일 데이터 소스**로 유지 (Context 또는 props drilling)
- **다른 외부 fetch와의 역할 분리**:
  - **빌드 타임 only**: GitHub(토큰 클라이언트 노출 불가), Skills(변경 빈도 월 이하, 실시간성 가치 없음) — 기존 공통 캐시 정책 그대로
  - **빌드 타임 + 클라이언트 refresh**: Status, RSS. 페이지 새로고침 시 fresh data 반영.
- **예상 데이터 스키마** (v2가 기대하는 형태, advenoh-status 테이블에서 파생):
  ```ts
  type StatusSnapshot = {
    fetchedAt: string
    services: { id: string; name: string; url: string; currentStatus: 'OK'|'WARN'|'ERROR'; lastChecked: string }[]
    summary: { up: number; total: number; uptime90d: number; lastIncidentAt: string | null }
  }
  ```
- **환경변수 (Netlify 모든 컨텍스트)**:
  - `NEXT_PUBLIC_SUPABASE_URL` — advenoh-status와 동일한 값
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon read 전용 (RLS로 권한 제어)
- **RLS 확인 결과 (완료)**:
  - `services`: "Public read access for services" `TO anon, authenticated` ✅ (`001_initial_schema.sql:36-38`)
  - `service_status_logs`: "Public read access for logs" `TO anon, authenticated` ✅ (`001_initial_schema.sql:44-46`)
  - `daily_status_summary`: "Anyone can read daily_status_summary" `FOR SELECT USING (true)` ✅ (`006_create_daily_status_summary.sql:25-26`)
  - → **anon key 단독으로 모든 필요 데이터 조회 가능. service_key 불필요.**
- **운영 규약**:
  - advenoh-status의 테이블 스키마 변경 시 이 PRD와 `lib/status.ts`도 함께 업데이트 (두 프로젝트 공동 관리)
  - Supabase 접속 실패 시 공통 캐시 정책(stale → 하드코딩 폴백)으로 빌드 성공 보장

### GitHub (`Commits · 'YY`)
- **현재**: 디자인 원본은 랜덤 히트맵. 실제 GitHub 기여(contribution) 데이터로 교체
- **데이터 소스**: GitHub GraphQL API `user.contributionsCollection.contributionCalendar`
  - 엔드포인트: `https://api.github.com/graphql`
  - 인증: `GITHUB_TOKEN` (fine-grained PAT, `read:user` scope만 필요, 공개 기여만 읽음)
  - 반환: 주(week) × 일(day) 행렬, 각 셀에 `contributionCount` + `color` + `date`
- **쿼리 예시**:
  ```graphql
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }
  ```
- **기간 범위 (확정)**: **26주 윈도우** (디자인 원본의 26주 × 7일 히트맵에 맞춤). `$to = today`, `$from = today - 26*7일`. 연도 경계를 넘어도 26주 창이 연속으로 슬라이드됨 (예: 2025-10~2026-04).
- **구현**:
  - `lib/github.ts` — GraphQL fetch + Zod 검증 + 공통 캐시 정책(`.cache/github-contrib.json`) 적용
  - 빌드 시 한 번 fetch → SSG에 snapshot (클라이언트 refresh 없음 — 토큰 클라이언트 노출 불가)
  - `contributionLevel` (NONE/FIRST_QUARTILE/.../FOURTH_QUARTILE)을 CSS `data-l="1..4"`로 매핑
  - `totalContributions`(26주 합계)를 우측 레일 "Commits · 26w {total}" + Hero stats "commits · 26w" 둘 다에서 사용
  - 폴백: 공통 캐시 정책(옵션 A 하이브리드) 적용 — stale `.cache/*.json` → 하드코딩 빈 grid + "offline" 뱃지
- **환경변수**: `.env.local` + **Netlify Production 컨텍스트에만 `GITHUB_TOKEN` 주입** (Deploy Preview / Branch Deploy 컨텍스트에는 주입하지 않음). PR preview 빌드에선 `lib/github.ts`가 토큰 부재를 감지하고 빈 grid + "offline" 뱃지 폴백으로 렌더.
- **PAT 계정**: `kenshin579` 계정의 fine-grained PAT, scope는 `read:user`만 부여 (public 기여 데이터 read-only)
- **Rate limit**: GraphQL 5000 pt/h — 이 쿼리는 1회당 < 1pt 수준, 빌드당 1회로 여유 충분

### Skills (Hero `stack` 라인)
- **목적**: Hero `kvs` 섹션의 `stack` 라인을 하드코딩하지 않고 GitHub 프로필 README에서 자동 추출
- **소스**: `https://github.com/kenshin579/kenshin579/blob/master/README.md`
  - README에 `shields.io/badge/-<NAME>-...&logo=<LOGO>` 배지로 카테고리별 스킬이 명시되어 있음
  - 카테고리 그룹(이모지로 구분): `💻 Languages/Framework`, `🛢 Database`, `☁️ Cloud`, `🤖 AI`, `🔧 Tools`
- **데이터 소스 옵션**:
  - (1) GitHub Contents API: `GET /repos/kenshin579/kenshin579/contents/README.md` → base64 decode
  - (2) Raw URL: `https://raw.githubusercontent.com/kenshin579/kenshin579/master/README.md`
  - **권장: (2) raw URL** — 단순 fetch, 인증 불필요, 캐시 친화
- **구현**:
  - `lib/skills.ts` — 파싱 파이프라인:
    1. raw markdown fetch → 그룹 헤더(`- 💻 &nbsp;` 등) 단위로 split
    2. 각 그룹에서 `!\[[^\]]*\]\(https:\/\/img\.shields\.io\/badge\/([^?)]+)` 정규식으로 **URL path segment만 캡처** (alt 텍스트는 사용하지 않음 — alt는 저자 임의 값이라 실제 배지 label과 다를 수 있음)
    3. 캡처된 path에서 정식 스킬명 추출 (순서 중요):
       - `decodeURIComponent()` 적용 (`%20` → 공백)
       - 말미 color hex 제거 (`-[0-9A-Fa-f]{3,8}$`)
       - 선행 `-` (no-label 패턴) 제거
       - shields.io 이스케이프 역치환: **`--` → `-`, `__` → `_` 먼저**, 그 다음 남은 `_` → 공백
       - `trim()`
    4. 구조화된 `Skills` 객체로 반환
  - **정규화 규칙**:
    | shields 소스 표기 | URL 표기 | 최종 결과 |
    |---|---|---|
    | 공백 | `%20` 또는 `_` | 공백 |
    | `_` (언더스코어 유지) | `__` | `_` |
    | `-` (대시 유지) | `--` | `-` |
  - 반환 타입:
    ```ts
    type SkillGroup = { emoji: string; label: string; items: string[] }
    type Skills = { groups: SkillGroup[]; flat: string[] }
    ```
  - Hero `stack` 라인: 대표 스킬만 추려서 표시 (예: Languages 그룹 전체 + Cloud의 K8s/AWS 등). 추림 규칙은 구현 시 결정 — 기본은 `groups[0].items` + `groups[2].items` 병합
  - 폴백: fetch 실패 시 `.cache/skills.json` 또는 하드코딩 기본값
- **Rate limit**: raw URL은 GitHub raw 서빙, 인증 없이도 관대한 한도. 빌드당 1회이므로 문제 없음

---

**기타 lib 수정**
- `lib/portfolio.ts` — 정렬 기준을 `order → slug`로 변경, `featured` 플래그 지원
- `lib/site-config.ts` — profile/status/writing/commit 관련 외부 링크(5 services, github, status, blog, investment) 구성

**스타일 / 테마 토큰**
- `app/globals.css` — 기존 shadcn 변수 그대로 두되, profile 전용 네임스페이스(`--profile-bg`, `--profile-accent` 등) 또는 `:root [data-profile="v2"]`로 격리. 부팅 시 root에 `data-accent="violet" data-density="comfortable" --noise:35` 적용.
- OKLCH 색공간 사용(브라우저 지원 확인됨: 모던 Chromium/Safari/Firefox OK)
- Tailwind 확장: `theme.extend.colors` 내 profile 팔레트, `fontFamily.mono`(IBM Plex Mono), `fontFamily.sans-kr`(IBM Plex Sans KR)

**폰트**
- `app/layout.tsx`에 `IBM_Plex_Mono`, `IBM_Plex_Sans_KR` 추가(`next/font/google`).
- 기존 `Inter`는 유지 여부 결정: Profile v2는 IBM Plex 사용 → Inter 제거 권장(번들 축소).

**인터랙션 / 상태**
- 클라이언트 상태 훅 신설:
  - `useKeyboardNav()` — j/k/Enter//, 포커스 인덱스
  - `useCommandPalette()` — 오픈 상태 + 검색 쿼리 + 필터된 리스트
  - `useProjectModal()` — 오픈 idx + prev/next + ESC
  - `useTweaks()` — accent/density/noise, `localStorage` 영속화
  - `useScrollSpy()` — 섹션 활성 감지 → breadcrumb/sidebar/status bar 동기화
- typewriter, quote rotate는 `setInterval` 기반 훅으로

**애니메이션**
- caret blink (1.1s)
- pulse (1.6s) — stats의 live 인디케이터
- noise 오버레이 opacity 반응
- project hover scale(1.02), featured card gradient
- smooth scroll, scroll-margin-top

**접근성**
- 모든 키보드 핫키는 화면낭독기 안내(`aria-keyshortcuts`) 병행
- focus ring은 `outline`로 유지, 사이드바 항목 `role="tab"` 또는 `button`
- 모달: `role="dialog"`, `aria-modal="true"`, 포커스 트랩, ESC 닫힘
- 색 대비: muted 텍스트는 WCAG AA 확인 필요(특히 `--muted-2` vs `--bg-2`)

**SEO / 메타**
- `app/layout.tsx`의 metadata는 유지하되 og-image는 v2 디자인에 맞는 이미지로 교체 검토
- JSON-LD(Person/WebSite)는 그대로, 프로젝트 `ItemList` 추가 검토

**이미지 / 에셋**
- `docs/start/Profile/assets/*.png` 6장(ai-chatbot, inspire-me, investment-blog, it-blog, it-blog-2, status)은 **기존 `contents/website/{slug}/cover.png` 경로로 배치**하고, `scripts/copy-portfolio-images.js` (prebuild)가 `public/`으로 복사하는 **기존 파이프라인을 그대로 재사용**한다. 신설 경로(`public/portfolio/{slug}/cover.png`)는 도입하지 않는다.
- 아이콘: lucide-react 계속 사용 가능 (dots, search, arrows)

---

## 범위 (Scope)

### In-Scope (이 PR에서 수행)
1. 3-column 레이아웃(Title/Sidebar/Main/RightRail/Status) 골격 구현
2. Hero · Projects(grid+modal) · Writing(IT) · Writing(Investment+quote) 섹션 렌더
3. 프로젝트 모달(←→/ESC) + 커맨드 팔레트(⌘K / `/`) + j/k/Enter 내비
4. Tweaks panel(accent 5색 / density 2단 / noise slider) + `localStorage` 영속화
5. Title Bar breadcrumb scroll-spy + Status Bar 섹션 동기화
6. IBM Plex Mono / IBM Plex Sans KR 폰트 도입, CSS 변수 체계
7. Noise overlay, pulse/caret 애니메이션, 스파크라인, 커밋 히트맵(목업 데이터 OK)
8. 반응형(≤1200 rside 숨김, ≤780 sidebar 숨김)
9. `contents/website/*/index.md` frontmatter 확장 + Zod 스키마 업데이트
10. **RSS 피드 2종 연동**: `https://blog.advenoh.pe.kr/rss.xml`, `https://investment.advenoh.pe.kr/rss.xml`을 빌드 타임에 fetch·파싱해 writing 섹션 + 우측 레일 `Latest posts`에 주입 (`rss-parser` 또는 `fast-xml-parser` 의존성 추가 / 캐시·폴백 전략)

11. **GitHub 기여 캘린더 연동** — GraphQL `contributionsCollection` 빌드 타임 fetch (`GITHUB_TOKEN` 필요), 우측 레일 히트맵 + Hero stats `commits · 'YY`
12. **Status 연동** — Supabase 직접 조회(안 A 확정). `@supabase/supabase-js`로 빌드 타임에 `services` + `daily_status_summary` 테이블 읽어, Hero stats(`services up` / `uptime 90d`), Sidebar `Status`, Title Bar `N/N up`, 우측 레일 `System`에 반영. 페이지 마운트 시 `useLiveStatus`가 동일 쿼리 재실행해 fresh로 교체
    - 선결 조건: **완료** — anon key 단독으로 조회 가능 확인됨 (service_key 불필요)
13. **Skills 연동** — `github.com/kenshin579/kenshin579` 프로필 README를 빌드 타임 fetch해 shields.io 배지에서 스킬 추출, Hero `kvs`의 `stack` 라인에 주입 (하드코딩 대체)

### Out-of-Scope (별도 티켓)
- 프로젝트 상세 **별도 라우트** 만들기 (현재는 모달만 제공)
- **다국어화(en/ko)** — 비목표 확정
- **라이트 모드** — 비목표 확정
- Status 데이터 갱신을 재배포 없이 반영 (ISR/Edge Function) — 초기에는 빌드 타임 스냅샷만

---

## 파일 변경 목록 (개요)

### 신규
- `app/page.tsx` — **재작성**
- `components/profile/TitleBar.tsx`
- `components/profile/Sidebar.tsx`
- `components/profile/RightRail.tsx`
- `components/profile/StatusBar.tsx`
- `components/profile/Hero.tsx`
- `components/profile/StatsRow.tsx`
- `components/profile/Sparkline.tsx`
- `components/profile/ProjectGrid.tsx`
- `components/profile/ProjectCardV2.tsx`
- `components/profile/ProjectModal.tsx`
- `components/profile/WritingList.tsx`
- `components/profile/QuoteBlock.tsx`
- `components/profile/CommitGraph.tsx`
- `components/profile/CommandPalette.tsx`
- `components/profile/TweaksPanel.tsx`
- `components/profile/LineGutter.tsx`
- `components/profile/NoiseOverlay.tsx`
- `components/profile/TypewriterPrompt.tsx`
- `hooks/useKeyboardNav.ts`
- `hooks/useCommandPalette.ts`
- `hooks/useProjectModal.ts`
- `hooks/useTweaks.ts`
- `hooks/useScrollSpy.ts`
- `lib/writing.ts` — `blog.advenoh.pe.kr/rss.xml` · `investment.advenoh.pe.kr/rss.xml` RSS fetch·파싱·병합
- `lib/stats.ts` — 외부 데이터(github/status) + RSS 카운트 집계
- `lib/github.ts` — GitHub GraphQL `contributionsCollection` fetch + 캐시 + Zod 검증
- `lib/status.ts` — 서버/SSG 빌드 타임 Supabase 조회 + Zod 검증 + 폴백 (공통 캐시 정책 적용)
- `hooks/useLiveStatus.ts` — 클라이언트 마운트 시 동일 Supabase 조회 재실행, initialData를 fresh로 교체 (실패 시 initialData 유지)
- `lib/skills.ts` — `github.com/kenshin579/kenshin579` README raw fetch + shields.io 배지 파서 + 카테고리 그룹화
- `contents/profile/readme.md`

### 수정
- `app/layout.tsx` — 폰트 교체(IBM Plex), **기존 `Header` / `Footer` import·사용 제거**. root layout은 v2 프로필에만 쓰이며, TitleBar/StatusBar는 `app/page.tsx` 또는 홈 컴포넌트에서 직접 렌더 (현재 `/` 단일 라우트). `app/not-found.tsx`는 Header/Footer 참조 없음 확인 완료 — 기본 마크업 유지
- `app/globals.css` — profile 전용 CSS 변수/셀렉터 추가
- `lib/portfolio.ts` — schema/타입/정렬 확장
- `lib/site-config.ts` — profile 항목(role/focus/stack/based/xp) 및 외부 링크 구조화
- `tailwind.config.ts` — `colors.profile.*`, `fontFamily.mono/sans-kr` 추가
- `contents/website/*/index.md` — 프로젝트 5건 frontmatter 확장
- `package.json` — 사용하지 않는 `recharts` 의존성 **제거** (Sparkline/CommitGraph 모두 자체 구현, 차트 라이브러리 미사용 원칙)

### 삭제 (확정)
- `components/Header.tsx`, `components/Footer.tsx` — v2 레이아웃의 TitleBar/StatusBar로 대체. 현재 `/` 단일 라우트이므로 다른 참조 없음 → 삭제
- `components/PortfolioCard.tsx`, `components/PortfolioList.tsx`, `components/ProjectCard.tsx`, `components/QuoteRotator.tsx` — v2 전환 후 미사용 → 삭제

---

## 마이그레이션 전략

1. **격리된 경로로 먼저 구현**: `/profile-v2` 같은 임시 라우트에 붙여 디자인 수렴.
2. 데이터 스키마(`portfolioItemSchema`) 확장 — 기존 필드는 optional로 유지해 빌드 깨짐 방지.
3. 신규 컴포넌트/훅을 `components/profile/`, `hooks/`에 집중 배치.
4. 기능 완성 후 `/`에 스왑(기존 `app/page.tsx` 교체), 사용하지 않는 구 컴포넌트 정리.
5. Netlify preview로 데스크톱/태블릿/모바일 교차 검증.

## 테스트 계획

- **빌드**: `npm run check`, `npm run build` 무결성
- **정적 export**: `out/` 디렉토리 산출물 확인
- **키보드 QA**: `⌘K`, `/`, `j/k`, `Enter`, `←→`, `ESC`
- **반응형 QA**: 1440 / 1100 / 768 / 375 브레이크포인트
- **브라우저 QA**: Chrome / Safari (OKLCH + mix-blend-mode)
- **컨텐츠 QA**: 5개 프로젝트 · 10개 writing 항목 · 6개 quote 로딩
- **MCP Playwright**: `/`에서 모달 열고 ←→ 이동, 팔레트에서 섹션 점프, tweaks 색상 전환

## 열린 질문 (Open Questions)

### 결정 완료
- ~~라이트 모드 복구 여부~~ → **제외 (다크 단일)**
- ~~다국어화(en/ko) 여부~~ → **제외 (한국어 단일)**
- ~~블로그 포스트 소스~~ → **RSS 빌드 타임 fetch (blog.advenoh.pe.kr · investment.advenoh.pe.kr)**
- ~~커밋 그래프 소스~~ → **GitHub GraphQL `contributionsCollection` 실데이터**
- ~~Hero stack 라인 관리 방식~~ → **GitHub 프로필 README(`kenshin579/kenshin579`)에서 shields.io 배지 자동 추출**
- ~~Status 연동 방식~~ → **안 A: v2가 `@supabase/supabase-js`로 Supabase를 빌드 타임에 직접 조회** (추가 인프라·Netlify Functions 불필요, 정적 export 결과에 스냅샷 embed). **RLS 확인 완료** — `services` / `service_status_logs` / `daily_status_summary` 모두 anon read 허용, service_key 불필요.
- ~~GitHub PAT 주입 범위~~ → **`kenshin579` fine-grained PAT(`read:user` scope)를 Netlify Production 컨텍스트에만 주입.** Deploy Preview / Branch Deploy에는 노출하지 않으며, PR preview에선 히트맵이 빈 폴백으로 렌더된다.
- ~~외부 fetch 캐시 정책~~ → **옵션 A 하이브리드**: `.cache/*.json` 레포 루트 + git 커밋(시드). 런타임 fresh fetch 성공 시 덮어쓰기(비커밋), 실패 시 stale 재사용, 파일 부재 시 하드코딩 폴백. 시드 갱신은 수동. (상세: "외부 데이터 연동 · 공통 캐시 정책" 섹션)
- ~~Sparkline / CommitGraph 구현 방식~~ → **순수 SVG / CSS Grid 자체 구현. 차트 라이브러리 미사용.** `recharts` 의존성은 `package.json`에서 제거한다.
- ~~히어로 버전 뱃지(`v2.26 · build 2104`)~~ → **사용하지 않음.** 장식적 가치 대비 유지 비용이 없어 제거. Hero 소개 문단만 남긴다.
- ~~RSS 타입 뱃지 판별 규칙~~ → **블로그 소스 기반으로 단순화**: IT 블로그 글은 `IT`, 투자 블로그 글은 `INV` 뱃지를 붙인다. 개별 글의 category/URL을 파싱해 세부 분류하지 않으며, 중앙 writing 섹션과 우측 레일 `Latest posts`가 동일한 규칙을 따른다.
- ~~Header/Footer 처리~~ → **완전 제거**. 현재 `/` 단일 라우트 구조에서 다른 참조가 없으므로 `components/Header.tsx` / `Footer.tsx` 파일 삭제 + `app/layout.tsx`의 import·사용 제거. 기능은 TitleBar / StatusBar가 대체. not-found는 기본 마크업 유지.
- ~~외부 fetch 실행 시점(소스별 분리)~~ → **하이브리드 (SSG + 클라이언트 refresh)**: Status, RSS(블로그 2곳). 페이지 새로고침만으로 fresh data 반영 → Netlify scheduled build / webhook 재빌드 불필요. **빌드 타임 only**: GitHub 기여(토큰 클라이언트 노출 불가), Skills(변경 빈도 월 이하, 실시간성 가치 없음).
- ~~RSS 클라이언트 refresh 선결 조건~~ → **블로그 2곳(`blog-v2` / `investment`) `netlify.toml`에 `/rss.xml` CORS 헤더 추가** (`Access-Control-Allow-Origin: https://advenoh.pe.kr` 또는 `*`). 두 레포에 별도 PR 선행.
- ~~GitHub 기여 캘린더 기간 범위~~ → **26주 윈도우** (`$to = today`, `$from = today - 26*7일`). 디자인 원본의 26주 × 7일 히트맵과 정합. 연도 경계를 넘어 연속으로 슬라이드. `totalContributions`는 이 26주 창의 합계.

### 논의 필요
(현재 열린 질문 없음 — 모든 주요 결정 완료)

## 관련 문서
- 디자인 원본: `docs/start/Profile/Profile v2.html`
- 이전 단계 디자인: `docs/start/Profile/Profile.html`
- 에셋: `docs/start/Profile/assets/`
- 구현 상세: `docs/done/2_profile_ui_v2_implementation.md`
- 작업 체크리스트: `docs/done/2_profile_ui_v2_todo.md`
