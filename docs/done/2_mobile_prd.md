# PRD: Mobile Optimization — Profile UI v2 모바일 최적화

## 개요
`v2.advenoh.pe.kr`의 Profile UI v2(IDE/터미널 스타일 3-column 레이아웃)는 데스크톱에 최적화되어 있으며, 모바일(≤ 768px)에서는 **좌측 Sidebar와 우측 RightRail이 완전히 숨겨져** 그 안의 핵심 콘텐츠(섹션 네비게이션, Status 서비스 상태, Social Links, GitHub 커밋 히트맵, Latest posts, System 지표)에 **접근할 수 있는 방법이 없다**.

본 PRD는 모바일에서 숨겨진 패널 콘텐츠를 접근 가능하게 만드는 UX/구현 방안과, 모바일 뷰포트에서 부가적으로 개선이 필요한 요소들을 정의한다.

- 대상 레포: `/Users/user/src/workspace_blogv2/v2.advenoh.pe.kr/`
- 대상 라우트: `/` 단일 라우트 (홈)
- 기반 스택: Next.js 16 App Router + React 19 + TypeScript 5.6 + Tailwind v3 (정적 export)
- 기반 PRD: `docs/done/2_profile_ui_v2_prd.md`

---

## 배경 · 문제 정의

### 현재 반응형 동작 (Tailwind 기본 breakpoint)
| Breakpoint | Sidebar | LineGutter | RightRail | TitleBar ⌘K | StatusBar 단축키 |
|---|---|---|---|---|---|
| `< sm` (< 640px) | 숨김 | 숨김 | 숨김 | 숨김 | 숨김 |
| `sm` (≥ 640px) | 숨김 | 숨김 | 숨김 | 숨김 | 숨김 |
| `md` (≥ 768px) | **표시** | 표시 | 숨김 | 표시 | 표시 |
| `xl` (≥ 1280px) | 표시 | 표시 | **표시** | 표시 | 표시 |

### 모바일에서 접근 불가능한 기능 (≤ 767px)

**Sidebar (`components/profile/Sidebar.tsx:23`)** — `hidden md:flex`
- Workspace 섹션 네비게이션 (`#readme` / `#projects` / `#writing` / `#writing-investment`) — 스크롤 대신 점프 수단 없음
- Status 서비스 리스트 (6개 서비스 실시간 상태 dot)
- Social Links (GitHub, LinkedIn, Instagram)

**RightRail (`components/profile/RightRail.tsx:16`)** — `hidden xl:flex`
- `Commits · 26w` GitHub 커밋 히트맵 (26주 × 7일)
- `Latest posts` — 두 블로그 최신 10개 병합 리스트
- `System` — services / uptime·90d / region 요약

**TitleBar (`components/profile/TitleBar.tsx:34`)** — `hidden md:inline-flex`
- 커맨드 팔레트 진입 버튼 (`⌘K`) — 모바일에는 버튼도 없고 키보드 단축키(`/`, `⌘K`)도 사용 불가 → **모바일에서 CommandPalette 접근 경로가 완전히 차단됨**

### 부가 이슈

1. **`app/layout.tsx`에 `viewport` export 누락** — Next.js 13+ App Router는 `export const viewport` 로 명시적 선언 권장. 현재 메타태그가 없으므로 브라우저 기본값에 의존 (`width=device-width`는 기본 적용되지만 `themeColor`, `colorScheme` 누락으로 상태바 색이 흰색으로 표시됨)

2. **TweaksPanel (`components/profile/TweaksPanel.tsx:20`)** — `fixed bottom-16 right-4` + `w-64` 고정. 모바일 세로 화면(375px)에서도 잘리지는 않지만 우하단 버튼이 **StatusBar(`h-7`, 28px) 위에 bottom-16(64px)으로 떠있음** → 시각적 충돌 없음 확인 필요

3. **ProjectModal (`components/profile/ProjectModal.tsx:83`)** — `w-[min(960px,100%)]` + `max-h-[calc(100vh-80px)]` + 본문 `px-8 py-6` → 모바일에선 좌우 패딩 32px이 과도. 모바일 readability 관점에서 `px-4 sm:px-8` 권장

4. **Hero 섹션 (`components/profile/Hero.tsx:40`)** — `text-5xl sm:text-7xl md:text-8xl` (48 / 72 / 96px). 48px는 모바일에서 수용 가능하나, 320px 이하(iPhone SE 세로 미니)에선 `// frank oh;` 한 줄이 **2줄로 감길 수 있음** (`//` + `frank` + `oh;` 3 토큰)

5. **ProjectGrid/ProjectCardV2 (`components/profile/ProjectGrid.tsx:73`)** — `grid-cols-1 md:grid-cols-6`로 이미 모바일 1-column. **개별 카드 내부 레이아웃은 문제 없음** ✅

6. **StatsRow (`components/profile/StatsRow.tsx:23`)** — `grid-cols-2 sm:grid-cols-4`. 모바일 2×2 그리드 OK ✅

7. **LineGutter (`components/profile/LineGutter.tsx:42`)** — `hidden md:flex`로 모바일 숨김. 장식 요소이므로 **숨김 유지 OK** ✅

---

## 목표

1. 모바일(≤ 767px)에서 Sidebar/RightRail의 **모든 콘텐츠에 접근 가능**하게 한다.
2. 기존 데스크톱 레이아웃 · 키보드 내비게이션 · 커맨드 팔레트 동작은 **회귀 없이 유지**한다.
3. IDE/터미널 메타포를 **모바일에서도 일관되게 유지** — drawer 내부도 동일 토큰/타이포그래피 재사용.
4. 뷰포트 메타데이터 · 터치 타겟 최소 44px · safe-area-inset 대응 등 **모바일 기본기** 보강.
5. Lighthouse Mobile 점수 · Core Web Vitals(LCP/CLS/INP) **회귀 없음**.

## 비목표

- 모바일 전용 별도 라우트(`/m`) — 단일 URL 유지 (반응형 단일 코드베이스)
- 모바일 앱 PWA 변환 · 설치 프롬프트 — 별도 티켓
- 모바일 제스처(스와이프로 drawer 열기) — 초기 스코프에서는 버튼 기반 토글만. 제스처는 후속 개선
- `j/k/Enter` 등 키보드 네비게이션을 모바일 터치로 대체 — 모바일에선 직접 탭으로 충분

---

## UX 제안

### 전체 방향: 좌측 Drawer + 우측 Drawer 2개 (햄버거 + 더보기 버튼)

데스크톱 3-column의 좌/우 패널을 모바일에서는 **각각 drawer**로 토글한다. TitleBar에 두 개의 iconButton을 추가하여 진입점을 제공한다.

```
┌─────────────────────────────────────────┐
│ ● ● ●  frank@seoul:~/profile   [☰][⋯]   │ ← TitleBar
├─────────────────────────────────────────┤
│                                         │
│           Main content                  │ ← 기존 중앙 main 유지
│           (Hero → Quote →               │
│            Projects → Writing)          │
│                                         │
├─────────────────────────────────────────┤
│  #section · 10+ yrs                     │ ← StatusBar (단축키 영역 제거)
└─────────────────────────────────────────┘

[☰] → 좌측 drawer (Sidebar 콘텐츠)
[⋯] → 우측 drawer (RightRail 콘텐츠)
```

### 좌측 Drawer (모바일 햄버거 메뉴)
- **진입점**: TitleBar 좌측, macOS dots와 breadcrumb 사이에 햄버거(`Menu` lucide 아이콘) 버튼. `md:hidden`으로 모바일에서만 노출.
- **내용**: 기존 `Sidebar.tsx`의 3개 블록을 그대로 재사용
  - Workspace 네비게이션 (섹션 점프 — 탭 시 drawer 닫히며 해당 섹션으로 스크롤)
  - Status 요약 + 서비스 dot 리스트
  - Links (Social)
- **UI 패턴**: Radix `Dialog` 기반 slide-in-left drawer, `w-[280px]` (화면 좌측부터 차오름), 배경 오버레이 클릭 시 닫힘, ESC·스와이프(후순위)로 닫힘
- **접근성**: `role="dialog"`, `aria-modal="true"`, 포커스 트랩, 오픈 시 body scroll lock

### 우측 Drawer (RightRail 모바일 노출)
- **진입점**: TitleBar 우측, `⌘K` 힌트 버튼 자리에 "더보기"(`PanelRight` 또는 `Activity` 아이콘) 버튼. `md:hidden`으로 모바일에서만 노출.
  - 데스크톱은 기존 `⌘K` 힌트 버튼 유지 (`hidden md:inline-flex`)
- **내용**: 기존 `RightRail.tsx`의 3개 블록을 그대로 재사용
  - Commits · 26w (CommitGraph — 모바일 cell size 조정 필요, 현재 `sm` = 10px 고정)
  - Latest posts (10개 병합 피드)
  - System 요약
- **UI 패턴**: Radix `Dialog` 기반 slide-in-right drawer, `w-[340px]` (또는 `w-[85vw] max-w-[340px]`)

### CommandPalette 모바일 진입점 (선택 사항 · 권장)
현재 모바일에서는 팔레트를 열 수단이 전혀 없으므로 다음 중 하나를 도입:
- **안 1 (권장)**: 좌측 drawer 상단에 "🔍 Search & jump" 버튼 추가 → 탭 시 drawer 닫고 팔레트 오픈
- **안 2**: TitleBar에 세 번째 `Search` 아이콘 추가 (아이콘이 3개가 되면 혼잡)
- **안 3**: 우측 drawer 상단에 검색바 내장 (데스크톱과 정보 구조 어긋남)

→ **안 1 채택.** drawer 헤더(또는 Workspace 블록 위)에 검색 진입 항목 추가.

### 대안 검토 (기각)
| 대안 | 장점 | 단점 | 결정 |
|---|---|---|---|
| **A. 콘텐츠를 세로로 모두 쌓기** (Sidebar 위 → 메인 → RightRail 아래) | 구현 단순, 숨김 없음 | 스크롤 길이 과다, IDE 메타포 훼손, 광고성 Social Links가 최상단 | 기각 |
| **B. Bottom sheet** | iOS 네이티브 느낌 | Sidebar의 scroll-spy 네비게이션과 충돌 (점프 후 sheet 닫기 이질감) | 기각 |
| **C. 모바일 전용 Tab bar** (하단 고정, 섹션 4개) | 섹션 점프 매우 빠름 | RightRail의 3개 블록을 담을 수 없음, StatusBar와 중복 | 기각 |
| **D. 좌우 Drawer 2개 (채택)** | 데스크톱 정보 구조 보존, 컴포넌트 재사용 | 진입 버튼 2개 필요 | **채택** |

---

## 상세 요구사항

### R1. `app/layout.tsx` — viewport metadata 추가

```typescript
// app/layout.tsx
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,          // 접근성 — 사용자 확대 허용 (no user-scalable=no)
  viewportFit: 'cover',     // iOS safe area 지원
  themeColor: '#0a0a0c',    // --profile-bg
  colorScheme: 'dark',
}
```

**근거**:
- `viewportFit: 'cover'` — iOS notch/Dynamic Island 대응을 위한 `safe-area-inset-*` env() 활성화
- `themeColor` — 모바일 주소창/상태바 색을 `--profile-bg`(`#0a0a0c`)로 맞춰 immersive 느낌
- `maximumScale: 5` — 확대 허용 (WCAG 2.5.3 / `user-scalable=no`는 접근성 위반)

### R2. 좌측 Drawer — `components/profile/MobileSidebarDrawer.tsx` 신설

- **기술 스택**: Radix `@radix-ui/react-dialog` (이미 `ProjectModal`에서 사용 중, 번들 중복 없음)
- **로직**:
  - `useState<boolean>`으로 열림/닫힘 관리 (또는 `window` 이벤트 bus `profile:open-sidebar`로 통일)
  - `onOpenChange(false)` 시 body scroll lock 해제
  - Workspace 링크 탭 시 `close() → scrollIntoView()` (CommandPalette의 `jumpSection` 패턴 재사용)
- **콘텐츠**: 기존 `Sidebar.tsx`의 JSX를 공용 컴포넌트로 분리 (`SidebarContent.tsx`) 후 데스크톱 Sidebar와 모바일 drawer 양쪽에서 재사용
  - **Status 서비스 리스트는 `.slice(0, 6)` 현재 규칙 그대로 유지** — 데스크톱/모바일 동일 규칙 적용해 일관성 확보. 전체 목록이 필요한 사용자는 Links 블록의 `status` 링크로 유도
- **스타일**: `fixed inset-y-0 left-0 z-[55] w-[280px] bg-profile-bg-2 border-r border-profile-line shadow-2xl` + Radix `data-state="open"` 기반 slide-in 애니메이션

### R3. 우측 Drawer — `components/profile/MobileRightRailDrawer.tsx` 신설

- 동일 패턴으로 `RightRailContent.tsx` 분리 후 공용화
- **CommitGraph cell size는 `sm`(10px) 유지** (신규 `'xs'` size 도입 안 함) — drawer 너비 `max-w-[340px]` 고정으로 26주 × (10+2) = 312px 히트맵이 항상 수용됨. 320px 미만 극단 뷰포트는 `overflow-x-auto` 폴백으로 대응.
- 스크롤 overflow 대비: drawer 내부 `overflow-y-auto`
- `fixed inset-y-0 right-0 z-[55] w-[85vw] max-w-[340px]` + slide-in-right

### R4. `components/profile/TitleBar.tsx` — 모바일 트리거 버튼 추가

- **아이콘 확정**: 좌측 햄버거는 `Menu`(lucide), 우측 drawer 트리거는 **`PanelRight`(lucide)** 사용. 좌/우 대칭 구조를 시각적으로 표현해 "양쪽에 접을 수 있는 패널이 있다"는 공간 메타포를 직관적으로 전달.

```tsx
// md 미만에서만 노출되는 햄버거 + 더보기 버튼
<button
  type="button"
  aria-label="Open navigation"
  onClick={() => window.dispatchEvent(new Event('profile:open-sidebar'))}
  className="md:hidden ..."
>
  <Menu size={16} />
</button>

// 기존 ⌘K 버튼 (데스크톱 전용) — 변경 없음
<button className="hidden md:inline-flex ...">⌘K</button>

// 우측 drawer 트리거 (모바일 전용)
<button
  type="button"
  aria-label="Open activity"
  onClick={() => window.dispatchEvent(new Event('profile:open-rightrail'))}
  className="md:hidden ..."
>
  <PanelRight size={16} />
</button>
```

- 이벤트 기반 통신은 `CommandPalette`의 `profile:open-palette` 패턴 일관 재사용 (하단 ProfileShell에서 새 drawer 컴포넌트를 mount하고 이벤트 구독)

### R5. `components/profile/ProfileShell.tsx` — drawer 마운트

```tsx
// 현재 구조 유지 + 하단에 drawer 2개 mount
<NoiseOverlay />
<TweaksPanel />
<CommandPalette projects={...} latestPosts={...} />
<ProjectModal items={...} />
<MobileSidebarDrawer status={status} activeSection={activeSection} />   {/* 신규 */}
<MobileRightRailDrawer github={github} latestPosts={writing.latest} status={status} />  {/* 신규 */}
```

- drawer 내부에서 기존 `SidebarContent` / `RightRailContent` 재사용 → 중복 코드 없음

### R6. CommandPalette 모바일 진입 경로

- `MobileSidebarDrawer` 최상단(Workspace 헤더 위)에 검색 진입 버튼:
  ```tsx
  <button
    onClick={() => {
      closeSidebar()
      window.dispatchEvent(new Event('profile:open-palette'))
    }}
  >
    <Search size={14} /> Search & jump
    <kbd>/</kbd>
  </button>
  ```
- 키보드 단축키 `/`는 데스크톱 전용 힌트로 유지 (모바일에선 물리 키보드 없을 수 있음 — 동작은 되지만 노출 안함)

### R7. 터치 타겟 & 접근성

- 모든 새 버튼/링크의 탭 가능 영역 **≥ 44×44px** (WCAG 2.5.5)
  - 현재 TitleBar 버튼이 `text-[10px]` + 작은 padding으로 ~28px → 모바일에선 `min-h-[44px] min-w-[44px]` 적용
- Sidebar 내 nav 링크(`px-2 py-1`)도 모바일에선 `py-2.5` 이상으로 상향
- drawer 오픈 시 포커스 첫 항목으로 이동, 닫을 때 트리거 버튼으로 복원 (Radix Dialog 기본 동작 ✅)

### R8. Safe-area inset 대응 (iOS)

- TitleBar: `env(safe-area-inset-top)` padding-top 추가
- StatusBar: `env(safe-area-inset-bottom)` padding-bottom 추가 (홈 인디케이터 영역 회피)
- Drawer 내부 스크롤 컨테이너: `pb-[env(safe-area-inset-bottom)]`

### R9. ProjectModal 모바일 개선 (부가)

- `px-8 py-6` → `px-4 py-5 sm:px-8 sm:py-6` (`components/profile/ProjectModal.tsx:122`)
- Meta grid: `grid-cols-2 sm:grid-cols-4` 유지 (이미 OK ✅)
- Footer 버튼: `flex-col sm:flex-row` 이미 OK ✅, 다만 모바일에서 `Open live ↗` 단독 행으로 크게 배치 검토

### R10. Hero 모바일 미세 조정 (부가)

- `// frank oh;`의 `text-5xl`(48px)는 ~320px 뷰포트에서 wrap 우려 → `text-[40px] sm:text-5xl ...`로 낮추거나 `break-normal` 유지 확인
- KV dl grid `grid-cols-[120px_1fr]` (`components/profile/Hero.tsx:56`) — 모바일 좁은 화면에서 value가 잘릴 수 있음 → `grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr]`

### R11. TweaksPanel 모바일 유지 (변경 없음)

- 현재 `fixed bottom-16 right-4 w-64` 상태는 모바일에서도 동작 가능
- StatusBar(`h-7`) 위 bottom-16이므로 StatusBar와 겹치지 않음 ✅
- 단, drawer 오픈 시 TweaksPanel이 drawer 위에 겹쳐 보이지 않도록 drawer `z-[55]`가 TweaksPanel `z-50` 보다 상위임을 보장 ✅

### R12. 키보드 단축키 힌트 모바일 숨김

- `components/profile/ProjectGrid.tsx:62` — "j k to navigate" 텍스트 (`<span className="font-mono ...">ls ./projects · {items.length} items · <kbd>j</kbd> <kbd>k</kbd> to navigate</span>`)에서 `j` / `k` / "to navigate" 부분을 `hidden sm:inline`으로 감싸 모바일에서 숨김
- 모바일에서는 `ls ./projects · N items`까지만 표시하여 IDE 터미널 느낌은 유지하되 무의미한 단축키 안내 제거
- 다른 단축키 힌트(`StatusBar`, `TitleBar ⌘K`)는 이미 `hidden md:flex`/`hidden md:inline-flex`로 숨겨져 있음 ✅

---

## 파일 변경 목록

### 신규
- `components/profile/MobileSidebarDrawer.tsx` — 좌측 drawer
- `components/profile/MobileRightRailDrawer.tsx` — 우측 drawer
- `components/profile/SidebarContent.tsx` — Sidebar 본문 추출 (데스크톱/모바일 공유)
- `components/profile/RightRailContent.tsx` — RightRail 본문 추출 (데스크톱/모바일 공유)

### 수정
- `app/layout.tsx` — `viewport` export 추가 (width/themeColor/colorScheme/viewportFit)
- `components/profile/TitleBar.tsx` — 모바일용 햄버거 + 더보기 버튼 2개 추가, `md:hidden`/`hidden md:inline-flex`로 분기
- `components/profile/Sidebar.tsx` — 본문을 `SidebarContent`로 교체, 외곽 `<aside>` 래퍼만 유지 (`hidden md:flex` 유지)
- `components/profile/RightRail.tsx` — 본문을 `RightRailContent`로 교체, 외곽 `<aside>` 래퍼만 유지 (`hidden xl:flex` 유지)
- `components/profile/ProfileShell.tsx` — `MobileSidebarDrawer` / `MobileRightRailDrawer` mount
- `components/profile/ProjectModal.tsx` — 모바일 padding 축소 (`px-8 py-6` → `px-4 py-5 sm:px-8 sm:py-6`)
- `components/profile/Hero.tsx` — Hero title `text-5xl` → 모바일 wrap 확인 후 필요 시 조정, KV grid 모바일 폭 조정
- `app/globals.css` — safe-area padding 유틸 또는 TitleBar/StatusBar inline 스타일

### 삭제
- 없음 (기존 자산 재사용)

### 외부 의존성
- 없음 — `@radix-ui/react-dialog`, `lucide-react`는 이미 사용 중

---

## 구현 전략

1. **컴포넌트 분리 선행**: `SidebarContent` / `RightRailContent`로 데스크톱 본문을 추출. 데스크톱 뷰 회귀 없음 확인 (`npm run check` + Playwright).
2. **Radix Dialog 기반 drawer 2개 구현**: `Dialog.Root` + `Dialog.Portal` + `Dialog.Content` 조합. `ProjectModal`의 패턴을 그대로 재사용하되 `left/right` slide 방향 커스텀.
3. **TitleBar 트리거 버튼 추가**: `window.dispatchEvent` 기반 이벤트 브리지 (`profile:open-sidebar`, `profile:open-rightrail`) 도입. drawer 컴포넌트에서 수신.
4. **CommandPalette 진입 경로**: drawer 내부에 Search 버튼 추가.
5. **Viewport · safe-area**: `app/layout.tsx` + `globals.css` 수정.
6. **부가 개선(R9, R10)**: ProjectModal padding · Hero 모바일 폭 조정.
7. **QA**: Chrome DevTools device emulation(iPhone SE / iPhone 15 / Pixel 7) + 실기기 1건(가능 시) 검증.

---

## 테스트 계획

### 자동화
- `npm run check` — TypeScript 타입 검사
- `npm run lint` — ESLint
- `npm run build` — 정적 export 산출물 확인 (`out/`)
- Playwright 기존 테스트 회귀 없음 확인 (`tests/`)

### 수동 QA
- **브레이크포인트 교차**: 320 / 375 / 414 / 640 / 768 / 1024 / 1280 / 1440px (Chrome DevTools + Safari Responsive Design Mode)
- **모바일 기기 에뮬레이션**: iPhone SE (320px · 가장 좁음), iPhone 15 Pro (393px), Pixel 7 (412px), iPad mini (744px · sm과 md 경계)
- **Drawer 동작**:
  - 좌측 drawer 열기 → Workspace 링크 탭 → drawer 닫히고 해당 섹션 스크롤 점프 확인
  - 좌측 drawer의 "Search & jump" → palette 열림 확인
  - 우측 drawer 열기 → CommitGraph / Latest posts / System 모두 표시
  - Overlay 클릭 · ESC · 우측 drawer 닫기 버튼 확인
  - Body scroll lock 확인 (drawer 오픈 중 뒤 콘텐츠 스크롤 불가)
- **데스크톱 회귀 검증**: ≥ 768px에서 모바일 트리거 버튼 숨김, 기존 Sidebar/RightRail/⌘K 정상 동작
- **키보드 접근성**: Tab 순회로 drawer 진입 가능, 내부 포커스 트랩, ESC 닫힘
- **터치 타겟**: 모든 새 버튼 44×44px 이상 (Lighthouse Accessibility tap target audit)
- **Safe-area**: iOS Safari 시뮬레이터 또는 실기기로 notch/홈바 영역 여백 확인

### Lighthouse
- Mobile Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95

### MCP Playwright (후속 세션)
- `playwright_navigate` → `playwright_screenshot` (iPhone SE / iPhone 15 viewport)
- drawer 오픈 자동화: `playwright_click` on `[aria-label="Open navigation"]`

---

## 범위 (Scope)

### In-Scope (이 PR)
1. `app/layout.tsx` `viewport` export 추가 + safe-area CSS
2. `SidebarContent` / `RightRailContent` 본문 추출 컴포넌트 2개
3. `MobileSidebarDrawer` / `MobileRightRailDrawer` 2개
4. `TitleBar`에 모바일 햄버거 + 더보기 버튼 추가 (이벤트 브리지)
5. `ProfileShell`에 drawer 2개 mount
6. drawer 내 CommandPalette 진입 버튼 (Search & jump)
7. ProjectModal 모바일 padding · Hero 모바일 폭 미세 조정 (R9, R10)
8. 키보드 단축키 힌트 모바일 숨김 (R12)
9. 모든 브레이크포인트 수동 QA + Lighthouse Mobile 검증

### Out-of-Scope (별도 티켓)
- 스와이프 제스처로 drawer 토글 (react-use-gesture 등 의존성 추가 필요)
- PWA 설치 프롬프트 / 오프라인 지원
- 모바일 전용 scroll-spy 개선 (현재 `useScrollSpy`는 데스크톱/모바일 공용 동작)
- TweaksPanel 모바일 재배치 (현재 그대로 수용)
- 다국어 진입점 (비목표 확정)
- 다크/라이트 토글 (비목표 확정)

---

## 열린 질문 (Open Questions)

### 결정 완료

- ~~우측 drawer 진입 아이콘 (`PanelRight` vs `Activity` vs `MoreVertical`)~~ → **`PanelRight` 확정.** 좌측 햄버거(`Menu`)와 시각적 대칭, "우측에 접을 수 있는 패널이 있다"는 공간 메타포를 가장 명확히 전달. (R4에 반영)
- ~~Drawer 스와이프 제스처 도입 (`vaul` 13kB)~~ → **초기 스코프 제외 확정.** Radix Dialog의 overlay 탭 · ESC · close 버튼만으로 기능 완결. 정적 export 사이트의 번들 예산을 고려해 후속 UX 개선 티켓에서 재검토. (Out-of-Scope에 반영)
- ~~CommitGraph 모바일 `'xs'` size 추가 여부~~ → **현재 `sm`(10px) 유지, `'xs'` 추가 안 함.** 우측 drawer 너비 `max-w-[340px]` 고정으로 26주 × 12px = 312px 히트맵이 항상 수용됨. 320px 미만 극단 뷰포트는 `overflow-x-auto` 폴백. YAGNI 원칙. (R3에 반영)
- ~~Sidebar Status 서비스 리스트 개수 (모바일 전체 노출 vs 6개 유지)~~ → **6개 유지 확정.** `SidebarContent`를 데스크톱/모바일이 공유하는 구조에서 일관된 규칙 적용. 전체 목록 필요 시 Links 블록의 `status.advenoh.pe.kr`로 유도. (R2에 반영)
- ~~ProjectGrid `j k to navigate` 힌트 모바일 숨김~~ → **숨김 처리 확정 (`hidden sm:inline`).** 터치 유저에게 물리 키보드 단축키 안내는 노이즈. 본 PR의 In-Scope에 R12로 포함. 데스크톱에서는 그대로 노출. (R12에 반영)

### 논의 필요
(현재 열린 질문 없음 — 모든 주요 결정 완료)

---

## 관련 문서 · 참고

- 기반 PRD: `docs/done/2_profile_ui_v2_prd.md`
- 관련 구현 기록: `docs/done/2_profile_ui_v2_implementation.md`, `docs/done/2_profile_ui_v2_todo.md`
- Radix Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
- Next.js Viewport: https://nextjs.org/docs/app/api-reference/functions/generate-viewport
- WCAG Target Size: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- iOS Safe Area: https://developer.apple.com/design/human-interface-guidelines/layout#Safe-areas
