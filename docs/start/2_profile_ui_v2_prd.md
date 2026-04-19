# PRD: Profile UI v2 — IDE/터미널 스타일 포트폴리오 리디자인

## 개요
홈 페이지 전체를 IDE/터미널 스타일(README.md-as-site)로 재구성한다.
좌측 파일 탐색기 · 중앙 코드 뷰어 · 우측 위젯 패널을 갖춘 3-column 레이아웃과,
커맨드 팔레트 · 프로젝트 모달 · 비모달 키보드 내비게이션 등 IDE 인터랙션을 도입한다.

기준 디자인: `docs/start/Profile/Profile v2.html` + `docs/start/Profile/assets/`

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
   - Badge + 소개 문단 (`v2.26 · build 2104` 뱃지 + 본인 소개)
   - KV list: `role`, `focus`, `stack`, `based`, `xp`, `open for`
   - Stats 4-cell: `services up`, `commits · '25`, `uptime · 90d`, `blog posts` (스파크라인/바/pulse dot 포함)
2. **`#projects`** — 6-col 파일 그리드
   - featured 카드 (풀 너비, 1.2fr/1fr, 240px preview)
   - 일반 카드 4개 (span 3): `name.ext` + live dot + preview image + desc + stack 태그 + meta-bot
   - Hover/focused 상태, `↵ open` 단축키 배지
3. **`#writing`** — Recent IT writing (activity list, 5개)
4. **`#writing-investment`** — Recent investment writing (activity list, 5개) + 하단 quote block (rotate 버튼, 12초 자동 순환)

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
- `components/profile/StatsRow.tsx` + `Sparkline.tsx`
- `components/profile/ProjectGrid.tsx` + `ProjectCardV2.tsx` (featured variant 포함)
- `components/profile/ProjectModal.tsx`
- `components/profile/CommandPalette.tsx`
- `components/profile/WritingList.tsx` (IT / Investment 공용)
- `components/profile/QuoteBlock.tsx` (기존 `QuoteRotator`를 터미널 풍으로 리디자인)
- `components/profile/CommitGraph.tsx` (히트맵 + 툴팁)
- `components/profile/TweaksPanel.tsx` (accent · density · noise)
- `components/profile/LineGutter.tsx`
- `components/profile/NoiseOverlay.tsx`
- `components/profile/TypewriterPrompt.tsx`

**콘텐츠/데이터 확장**
- `contents/website/{slug}/index.md` frontmatter 확장 필요:
  - `status` (`live`, `live · v1.3` 등), `year` (`2024 — now`), `role` (`Solo`, `Author`), `stack` (string[]), `dek` (modal 요약), `overview` (Markdown/HTML), `featured` (boolean), `ext` (`.go`, `.py`, `.md`, `.ts` 등), `order`
  - Zod schema(`portfolioItemSchema`) 확장 + `PortfolioItem` 타입 반영
- 새 데이터 소스:
  - **IT 글쓰기**: `https://blog.advenoh.pe.kr/rss.xml` RSS 피드를 **빌드 타임에 fetch**해 최신 N개 파싱 (`title`, `link`, `pubDate`, `category`, `description`)
  - **투자 글쓰기**: `https://investment.advenoh.pe.kr/rss.xml` RSS 피드를 **빌드 타임에 fetch**해 최신 N개 파싱
  - `contents/profile/readme.md` — 히어로 KV(role/focus/based/xp/open-for) + badge(`v2.26 · build 2104`)
    - **`stack` 라인은 제외** — GitHub 프로필 README(`github.com/kenshin579/kenshin579`)에서 빌드 타임에 자동 추출 (아래 "외부 데이터 연동 · Skills" 참조)
  - `lib/writing.ts` — 두 RSS 피드를 fetch·파싱하는 로더(Next.js SSG `fetch` + `fast-xml-parser` 또는 `rss-parser` 의존성 추가)
    - 중앙 메인 `#writing`·`#writing-investment` 섹션에 각 5개
    - 우측 레일 `Latest posts`에 두 피드 병합 후 날짜순 상위 6개(IT/INV 태그 포함)
    - 빌드 실패 대응: fetch 실패 시 캐시 또는 빈 배열로 폴백(사이트 빌드가 깨지지 않도록)
  - `lib/stats.ts` — stats(services up, commits, uptime, posts) 값 소스. 각 지표는 다음 외부 소스에서 빌드 타임에 수집:
    - `services up`, `uptime · 90d` → **Advenoh Status 연동** (아래 "외부 데이터 연동 · Status" 섹션 참조)
    - `commits · 'YY` → **GitHub API 연동** (아래 "외부 데이터 연동 · GitHub" 섹션 참조)
    - `blog posts` → IT RSS 피드 아이템 수로 자동 계산

---

## 외부 데이터 연동

### Status (`https://status.advenoh.pe.kr/`)
소스 레포: `/Users/user/WebstormProjects/advenoh-status` (Next.js + Supabase + GitHub Actions 헬스체크)

**현재 아키텍처**:
```
GitHub Actions (cron) → Python health_check.py → Supabase Postgres
                                                      ↓
                                 services · service_status_logs · daily_status_summary (view)
                                                      ↓
                                        advenoh-status 프론트엔드 (anon key + RLS read)
```

**연동 후보 3안**:

| 안 | 방식 | 장점 | 단점 |
|---|---|---|---|
| **A. Supabase 직접 조회** | v2에 `@supabase/supabase-js` 추가, `NEXT_PUBLIC_SUPABASE_URL`/`_ANON_KEY` 사용해 빌드 타임에 `services`·`daily_status_summary` 조회 | 재사용 용이, 실제 90일 데이터 그대로 사용 | v2가 status의 DB 스키마에 종속됨, 두 프로젝트 RLS 정책을 함께 관리 |
| **B. Status 사이트에 JSON endpoint 추가** | advenoh-status에 `public/api/snapshot.json` (빌드 시 생성) 또는 `/api/snapshot`(ISR) 노출 → v2가 fetch | 스키마 변경에 유연, v2는 Supabase 몰라도 됨 | status 쪽에 작업 필요, CORS·캐시 정책 고려 |
| **C. health_check.py가 JSON 발행** | Python 스크립트에 snapshot export 추가 → GitHub Pages/S3/gist에 업로드 → v2가 fetch | v2는 단일 JSON URL만 바라봄, 캐시 친화 | 발행 경로 신설 필요, 배포 지연(5분 cron 사이클) |

**권장 · 안 B (JSON endpoint)**:
- 이유: v2를 status DB에 직결하지 않으면서, v2 빌드가 status 사이트 장애에 폴백(빈 값·캐시)으로 견딤.
- **필요 작업(advenoh-status 쪽)**:
  1. `/api/snapshot` 또는 `/snapshot.json` 라우트 신설 (ISR `revalidate: 300`)
  2. 응답 스키마:
     ```json
     {
       "fetchedAt": "2026-04-19T04:50:00Z",
       "services": [
         { "id": "...", "name": "Blog", "url": "...", "currentStatus": "OK", "lastChecked": "..." }
       ],
       "summary": { "up": 5, "total": 5, "uptime90d": 99.9, "lastIncidentAt": "2026-02-01T..." }
     }
     ```
  3. CORS 헤더 허용(`Access-Control-Allow-Origin: *` 또는 `https://advenoh.pe.kr`)
- **v2 쪽 작업**:
  - `lib/status.ts` — `fetch('https://status.advenoh.pe.kr/api/snapshot', { next: { revalidate: 300 } })` + Zod 검증 + 실패 시 빈 폴백
  - Sidebar `Status` 블록 + Hero `stats` `services up` + 우측 레일 `System` + Title Bar `5/5 up` 에 사용
- **논의 필요 사항** (이 PRD 단계에서 결정 요청):
  1. 안 A/B/C 중 어느 것으로 갈 것인가? (권장: B)
  2. 안 B 선택 시, advenoh-status에 JSON endpoint 추가를 별도 PR로 진행 후 v2가 consume 하는 순서로 배포하는 것이 적절한가?
  3. 안 A를 택할 경우, 현재 RLS가 anon read를 허용하는지 `supabase/migrations/*.sql` 확인 필요
  4. 5분보다 긴 캐시가 허용되는가? (Netlify 정적 export는 빌드 타임 fetch가 고정됨. 재배포 없이 갱신하려면 ISR가 가능한 서버리스 함수로 분리 필요)

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
- **구현**:
  - `lib/github.ts` — GraphQL fetch + Zod 검증 + 캐시(`.cache/github-contrib.json`)
  - 빌드 시 한 번 fetch → SSG에 snapshot
  - `contributionLevel` (NONE/FIRST_QUARTILE/.../FOURTH_QUARTILE)을 CSS `data-l="1..4"`로 매핑
  - `totalContributions`를 우측 레일 "Commits · 2026 {total}" + Hero stats "commits · 'YY" 둘 다에서 사용
  - 폴백: fetch 실패 시 빈 grid(랜덤 없음) + "offline" 뱃지
- **환경변수**: `.env.local` + Netlify 빌드 환경에 `GITHUB_TOKEN` 추가
- **Rate limit**: GraphQL 5000 pt/h — 이 쿼리는 1회당 < 1pt 수준, 빌드당 1회로 여유 충분
- **논의 필요 사항**:
  1. PAT를 어느 GitHub 계정으로 만들 것인가(`kenshin579`)?
  2. Netlify secret으로 주입하되, PR preview 빌드에도 노출할지?
  3. 기간 범위는 "현재 연도 1/1 ~ today" 기본으로 하되 26주 윈도우(디자인 원본)로 맞출지?

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
  - `lib/skills.ts` — raw markdown fetch → 그룹 헤더(`- 💻 &nbsp;` 등) 단위로 split → 각 그룹에서 `!\[([^\]]+)\]\(https://img\.shields\.io/badge/[^)]+\)` 정규식으로 스킬명 추출 → 구조화
  - 반환 타입:
    ```ts
    type SkillGroup = { emoji: string; label: string; items: string[] }
    type Skills = { groups: SkillGroup[]; flat: string[] }
    ```
  - Hero `stack` 라인: 대표 스킬만 추려서 표시 (예: Languages 그룹 전체 + Cloud의 K8s/AWS 등). 추림 규칙은 구현 시 결정 — 기본은 `groups[0].items` + `groups[2].items` 병합
  - 폴백: fetch 실패 시 `.cache/skills.json` 또는 하드코딩 기본값
- **Rate limit**: raw URL은 GitHub raw 서빙, 인증 없이도 관대한 한도. 빌드당 1회이므로 문제 없음
- **논의 필요 사항**:
  1. Hero `stack` 라인에 모든 스킬을 표시할지, 그룹을 선별할지?
  2. 이름 정규화가 필요한가? (예: `Spring%20Boot` → `Spring Boot`)
  3. 스킬 로고 이미지도 함께 보여줄지(디자인 원본은 텍스트만) — 기본은 텍스트만
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
- `docs/start/Profile/assets/*.png` 6장(ai-chatbot, inspire-me, investment-blog, it-blog, it-blog-2, status)을 정식 경로(`public/portfolio/{slug}/cover.png`)로 이관하거나, 각 프로젝트 폴더의 기존 커버를 재사용
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
12. **Status 연동** — advenoh-status의 snapshot JSON (또는 Supabase 직접 조회) 빌드 타임 fetch, Hero stats `services up` / `uptime 90d`, Sidebar `Status`, Title Bar `N/N up`, 우측 레일 `System`에 반영
    - 선결 조건: 안 A/B/C 중 선택 (권장: 안 B — advenoh-status에 `/api/snapshot` 추가)
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
- `lib/status.ts` — advenoh-status snapshot fetch + Zod 검증 + 폴백
- `lib/skills.ts` — `github.com/kenshin579/kenshin579` README raw fetch + shields.io 배지 파서 + 카테고리 그룹화
- `contents/profile/readme.md`

### 수정
- `app/layout.tsx` — 폰트 교체(IBM Plex), 기존 Header/Footer를 Profile TitleBar/StatusBar로 교체할지 결정 (권장: `/` 에서만 v2 레이아웃 적용, 공용 Header/Footer는 다른 라우트에 남겨둠)
- `app/globals.css` — profile 전용 CSS 변수/셀렉터 추가
- `lib/portfolio.ts` — schema/타입/정렬 확장
- `lib/site-config.ts` — profile 항목(role/focus/stack/based/xp/open for) 및 외부 링크 구조화
- `tailwind.config.ts` — `colors.profile.*`, `fontFamily.mono/sans-kr` 추가
- `contents/website/*/index.md` — 프로젝트 5건 frontmatter 확장

### 삭제 검토
- `components/Header.tsx`, `components/Footer.tsx`, `components/PortfolioCard.tsx`, `components/PortfolioList.tsx`, `components/ProjectCard.tsx`, `components/QuoteRotator.tsx` — v2 전환 후 홈 라우트에서 미사용 시 제거. 다른 라우트에서 참조 시 유지.

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

### 논의 필요
1. **Status 연동 방식 (최우선 결정 필요)**:
   - (A) v2에서 Supabase 직접 조회 vs (B) advenoh-status에 `/api/snapshot` JSON endpoint 추가 vs (C) health_check.py가 JSON 발행
   - **권장: (B)** — 커플링 최소, status 사이트만 스키마 변화에 대응. advenoh-status 쪽 PR 선행 필요.
2. **GitHub PAT 관리**:
   - 사용할 계정(`kenshin579`)의 fine-grained PAT를 생성, Netlify 빌드 환경에 `GITHUB_TOKEN`으로 주입
   - PR preview 빌드에도 노출할지? (권장: 노출, public data만 읽음)
3. 기존 `/portfolio` 또는 다른 페이지 라우트가 존재하는가? Header/Footer를 완전히 제거해도 되는가?
4. `v2.26 · build 2104` 같은 버전 뱃지는 `package.json` 버전 + CI 빌드 번호를 반영할 것인가, 디자인 텍스트 그대로 둘 것인가?
6. RSS / GitHub / Status fetch 실패 시 stale-while-revalidate용 캐시 파일(`.cache/*.json`)을 git에 커밋할지, 매 빌드마다 네트워크 의존할지?
7. RSS의 `category` 배열 중 어느 항목을 writing 섹션의 `op` 뱃지(`post`/`note`) 판별에 사용할지 규칙 정의 필요.
8. Status 히트맵/stats는 "현재 빌드 시각 snapshot"이므로 실시간성이 부족함. 허용 가능한 지연(30분? 1시간?)을 정의하고, 그보다 빠른 갱신이 필요하면 Netlify scheduled build 또는 webhook 재빌드 구성 논의.

## 관련 문서
- 디자인 원본: `docs/start/Profile/Profile v2.html`
- 이전 단계 디자인: `docs/start/Profile/Profile.html`
- 에셋: `docs/start/Profile/assets/`
- 구현 상세(예정): `docs/start/2_profile_ui_v2_implementation.md`
- 작업 체크리스트(예정): `docs/start/2_profile_ui_v2_todo.md`
