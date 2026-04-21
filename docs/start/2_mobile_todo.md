# Mobile Optimization — Todo 체크리스트

> 요구사항: `2_mobile_prd.md`
> 구현 가이드: `2_mobile_implementation.md`

## Phase 1. 기반 정비

### Viewport 메타데이터

- [x] `app/layout.tsx` 에 `viewport: Viewport` export 추가 (`width`, `initialScale: 1`, `maximumScale: 5`, `viewportFit: 'cover'`, `themeColor: '#0a0a0c'`, `colorScheme: 'dark'`)
- [x] `npm run check` 타입 검사 통과
- [ ] 모바일 크롬 DevTools 에뮬레이션으로 `<meta name="viewport">` 및 `<meta name="theme-color">` 렌더 확인

### 컴포넌트 본문 추출

- [x] `components/profile/SidebarContent.tsx` 신규 — `Sidebar.tsx` 의 `<aside>` 내부 JSX 이동
- [x] `SidebarContent` 에 `onNavigate?: () => void` prop 추가하여 Workspace nav 링크 `onClick` 에 호출
- [x] `SidebarContent` 최상단에 **Search & jump** 버튼 추가 → 클릭 시 `onNavigate?.()` + `profile:open-palette` dispatch
- [x] Status 서비스 리스트 `.slice(0, 6)` 유지 (Q4 결정 사항)
- [x] `SOCIAL_LINKS` 상수를 `SidebarContent.tsx` 로 함께 이동
- [x] `components/profile/Sidebar.tsx` 를 `<aside className="hidden md:flex ..."><SidebarContent /></aside>` 래퍼로 축소
- [x] `components/profile/RightRailContent.tsx` 신규 — `RightRail.tsx` 의 `<aside>` 내부 JSX 이동 (CommitGraph `size="sm"` 유지)
- [x] `components/profile/RightRail.tsx` 를 `<aside className="hidden xl:flex ..."><RightRailContent /></aside>` 래퍼로 축소
- [x] `npm run check` 통과 확인
- [ ] 데스크톱 `md` / `xl` 뷰포트에서 기존 Sidebar / RightRail 렌더 회귀 없음 확인

## Phase 2. 모바일 Drawer 2종 구현

### 좌측 Drawer (MobileSidebarDrawer)

- [ ] `components/profile/MobileSidebarDrawer.tsx` 신규 (`'use client'`)
- [ ] `useState<boolean>` + `profile:open-sidebar` 이벤트 구독 훅 작성
- [ ] Radix `Dialog.Root` / `Portal` / `Overlay` / `Content` 구조
- [ ] `Dialog.Content` 스타일: `fixed inset-y-0 left-0 z-[55] w-[280px] bg-profile-bg-2 border-r border-profile-line shadow-2xl md:hidden overflow-y-auto`
- [ ] `tailwindcss-animate` 슬라이드 유틸 적용 (`data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left`)
- [ ] Safe-area inset: `pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)]`
- [ ] `Dialog.Close` 버튼 우상단 배치 (`h-[44px] w-[44px]`, `X` 아이콘)
- [ ] `Dialog.Title` 은 `sr-only` 로 "Navigation" 라벨
- [ ] `SidebarContent` 에 `onNavigate={() => setOpen(false)}` 연결하여 섹션 점프 시 자동 close

### 우측 Drawer (MobileRightRailDrawer)

- [ ] `components/profile/MobileRightRailDrawer.tsx` 신규 — 좌측 drawer 미러 구조
- [ ] `profile:open-rightrail` 이벤트 구독
- [ ] `Dialog.Content` 스타일: `fixed inset-y-0 right-0 z-[55] w-[85vw] max-w-[340px] border-l md:hidden`
- [ ] `slide-in-from-right` / `slide-out-to-right` 애니메이션
- [ ] `RightRailContent` 삽입 (`github`, `latestPosts`, `status` props)
- [ ] Safe-area inset 좌측 drawer와 동일 적용
- [ ] `Dialog.Close` 좌상단 배치 (`X` 아이콘, 44×44px)

### 공통 확인

- [ ] 두 drawer 모두 `md:hidden` 으로 데스크톱에서 완전히 렌더되지 않음 확인
- [ ] ESC · overlay 클릭 · close 버튼으로 닫기 동작
- [ ] 포커스 트랩 · body scroll lock 확인 (Radix 기본 동작)

## Phase 3. TitleBar 트리거 & ProfileShell 마운트

### TitleBar 수정

- [ ] `components/profile/TitleBar.tsx` 에 `Menu`, `PanelRight` lucide 아이콘 import
- [ ] 좌측 dots 3개 직후에 햄버거 버튼 추가 (`md:hidden`, `h-[44px] w-[44px]`, `aria-label="Open navigation"`)
  - onClick: `window.dispatchEvent(new Event('profile:open-sidebar'))`
- [ ] 우측 `ml-auto` 컨테이너 내부, 기존 `⌘K` 버튼 좌측에 `PanelRight` 버튼 추가 (`md:hidden`, `h-[44px] w-[44px]`, `aria-label="Open activity panel"`)
  - onClick: `window.dispatchEvent(new Event('profile:open-rightrail'))`
- [ ] 기존 `⌘K` 버튼은 `hidden md:inline-flex` 유지 (변경 없음)
- [ ] breadcrumb `<span>` 은 `hidden sm:inline` 유지 (변경 없음)
- [ ] TitleBar 자체에 `pt-[env(safe-area-inset-top)]` + `h-[calc(40px+env(safe-area-inset-top))]` 적용

### StatusBar 수정

- [ ] `components/profile/StatusBar.tsx` 에 `pb-[env(safe-area-inset-bottom)]` + `h-[calc(28px+env(safe-area-inset-bottom))]` 적용
- [ ] iOS Safari 시뮬레이터에서 홈 인디케이터 영역과 겹침 없음 확인

### ProfileShell 마운트

- [ ] `components/profile/ProfileShell.tsx` 하단 overlay 마운트 섹션에 `<MobileSidebarDrawer ... />`, `<MobileRightRailDrawer ... />` 2줄 추가
- [ ] 필요한 props 전달: `status`, `activeSection`, `github`, `latestPosts` (기존 변수 재사용)

## Phase 4. 부가 개선

### ProjectModal 모바일 padding (R9)

- [ ] `components/profile/ProjectModal.tsx:122` — `px-8 py-6` → `px-4 py-5 sm:px-8 sm:py-6`
- [ ] 데스크톱 모달 레이아웃 회귀 없음 확인

### Hero 모바일 조정 (R10)

- [ ] `components/profile/Hero.tsx:40` — hero title 폰트 `text-5xl` → `text-[40px]` (320px 에서 wrap 여부 확인 후 필요 시 조정)
- [ ] `components/profile/Hero.tsx:56` — `grid-cols-[120px_1fr]` → `grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr]`
- [ ] 375px / 320px 뷰포트에서 `// frank oh;` 1줄 유지 확인
- [ ] KV dl 각 value 텍스트 잘림 없음 확인

### 키보드 단축키 힌트 모바일 숨김 (R12)

- [ ] `components/profile/ProjectGrid.tsx:61-70` — "j k to navigate" 부분(` · <kbd>j</kbd> <kbd>k</kbd> to navigate`)을 `<span className="hidden sm:inline">...</span>` 으로 감싸기
- [ ] 모바일에서 `ls ./projects · N items` 만 표시되는지 확인
- [ ] 데스크톱에서 기존 힌트 그대로 노출되는지 확인

### 터치 타겟 확장 (R7)

- [ ] `SidebarContent` 내 Workspace nav 링크 padding: `px-2 py-1` → `px-2 py-2.5 md:py-1` (모바일에서 44px 이상 확보)
- [ ] Links 블록(`SOCIAL_LINKS`) 링크 padding 동일 적용
- [ ] TitleBar 의 신규 버튼들 44×44px 실측 확인 (Chrome DevTools Accessibility tab)

## Phase 5. 테스트 & QA

### 자동화

- [ ] `npm run check` 타입 검사 통과
- [ ] `npm run lint` 린트 통과
- [ ] `npm run build` 정적 export 빌드 성공 (`out/` 생성)
- [ ] 기존 Playwright 테스트 (`tests/`) 회귀 없음

### MCP Playwright — 모바일 뷰포트 자동화

- [ ] `npm run dev` 로컬 서버 기동
- [ ] MCP Playwright 로 모바일 뷰포트(375×812 iPhone 15) 시뮬레이션
- [ ] 햄버거 버튼 클릭 → 좌측 drawer 오픈 스크린샷 캡처
- [ ] Workspace 링크 탭 → drawer 자동 close + 섹션 스크롤 점프 확인
- [ ] drawer 내 "Search & jump" 버튼 → CommandPalette 오픈 확인
- [ ] `PanelRight` 버튼 클릭 → 우측 drawer 오픈 + CommitGraph / Latest posts / System 렌더 확인
- [ ] ESC 키 · overlay 클릭으로 drawer close 확인
- [ ] 데스크톱 뷰포트(1440×900) 에서 모바일 트리거 버튼 미노출 확인
- [ ] ProjectModal 모바일 패딩 개선 스크린샷 캡처 비교

### 브레이크포인트 수동 QA

- [ ] **320px** (iPhone SE 1세대 에뮬레이션) — Hero title wrap 없음, Status bar 가시
- [ ] **375px** (iPhone 15 기준) — drawer 2개 정상 동작
- [ ] **414px** (iPhone Plus)
- [ ] **640px** (`sm` 경계) — 여전히 모바일 레이아웃
- [ ] **768px** (`md` 경계) — 데스크톱 Sidebar 노출 + 모바일 트리거 숨김
- [ ] **1024px**
- [ ] **1280px** (`xl` 경계) — RightRail 노출
- [ ] **1440px** — 회귀 없음

### iOS safe-area

- [ ] Chrome DevTools 에서 `?`아이콘 → Sensors → Safe Area inset 강제 지정 또는 iOS Safari 시뮬레이터 사용
- [ ] TitleBar 가 notch 영역과 겹치지 않음
- [ ] StatusBar 가 홈 인디케이터 영역과 겹치지 않음
- [ ] Drawer 내부 상하단 여백 확보

### 접근성 & Lighthouse

- [ ] Chrome DevTools Lighthouse Mobile 실행
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 95
- [ ] Best Practices ≥ 95
- [ ] SEO 기존 점수 유지
- [ ] Keyboard Tab 순회로 drawer 접근 가능
- [ ] Drawer 내부 포커스 트랩, ESC 닫힘
- [ ] `aria-label` 모든 아이콘 버튼에 적용

### 회귀 검증

- [ ] 데스크톱 `⌘K` / `/` CommandPalette 동작 변화 없음
- [ ] `j` / `k` / Enter / ← → ESC 키보드 네비게이션 모두 정상
- [ ] 기존 TweaksPanel · NoiseOverlay · ProjectModal 정상 동작
- [ ] Hero / StatsRow / ProjectGrid / WritingList / QuoteBlock 렌더 회귀 없음

## Phase 6. 문서 마무리 & 배포

- [ ] 구현 완료 후 `docs/start/2_mobile_*` 3개 파일을 `docs/done/` 으로 이동
- [ ] Netlify Preview 배포로 실기기(가능 시) 검증
- [ ] `gh pr create` + HEREDOC 형식으로 PR 생성 (reviewer: kenshin579)
- [ ] PR 머지 후 프로덕션 배포 확인 (`https://advenoh.pe.kr` 모바일 뷰)
