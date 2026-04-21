# Mobile Optimization — 구현 문서

> 요구사항: `docs/start/2_mobile_prd.md`
> 체크리스트: `docs/start/2_mobile_todo.md`

## 1. 기반 스택

- Next.js 16 App Router + React 19 + TypeScript 5.6 (기존)
- Radix UI `@radix-ui/react-dialog` (이미 `ProjectModal`이 사용 중 → 번들 중복 없음)
- `lucide-react` 아이콘 (이미 사용 중) — `Menu`, `PanelRight`, `Search` 신규 사용
- 신규 의존성 없음

## 2. 전체 아키텍처

### 현재 → 목표

```
데스크톱 (≥ md)               모바일 (< md)
┌─────────────────────┐      ┌─────────────────────┐
│TitleBar [⌘K]        │      │TitleBar [☰][⋯]      │  ← 모바일 트리거 2개 추가
├─────┬──────┬────────┤      ├─────────────────────┤
│Side │ Main │RightRail│      │                     │
│bar  │      │ (≥xl)  │      │       Main          │  ← Sidebar/RightRail 숨김 유지
│     │      │        │      │                     │
├─────┴──────┴────────┤      ├─────────────────────┤
│StatusBar            │      │StatusBar            │
└─────────────────────┘      └─────────────────────┘
                             [☰] → Sidebar 좌측 Drawer
                             [⋯] → RightRail 우측 Drawer
```

### 컴포넌트 재사용 구조

`SidebarContent.tsx` / `RightRailContent.tsx` 로 본문만 추출해 **데스크톱 `<aside>` + 모바일 Drawer** 양쪽에서 공유. 중복 코드 없음.

```
Sidebar.tsx (hidden md:flex <aside>)
  └ SidebarContent.tsx  ◄──┐
                            ├── 공유
MobileSidebarDrawer.tsx    │
  └ SidebarContent.tsx  ◄──┘
```

### 이벤트 브리지 (기존 패턴 재사용)

`CommandPalette`가 사용 중인 `window.dispatchEvent(new Event('profile:open-palette'))` 패턴을 그대로 확장:

| 이벤트명 | 발신 | 수신 |
|---|---|---|
| `profile:open-palette` | TitleBar ⌘K · Sidebar Search | CommandPalette (기존) |
| `profile:open-sidebar` | TitleBar ☰ | MobileSidebarDrawer (신규) |
| `profile:open-rightrail` | TitleBar ⋯ | MobileRightRailDrawer (신규) |
| `profile:open-project` | ProjectCardV2 | ProjectModal (기존) |

장점: TitleBar가 drawer 상태를 직접 들지 않아 prop drilling 불필요, 각 drawer는 독립적으로 이벤트 구독.

## 3. 구현 순서 (4 phase)

### Phase 1: 기반 정비
- `app/layout.tsx` `viewport` export 추가
- `SidebarContent.tsx` / `RightRailContent.tsx` 본문 추출
- `Sidebar.tsx` / `RightRail.tsx` 를 content 래퍼로 축소

### Phase 2: Drawer 2종 구현
- `MobileSidebarDrawer.tsx` — 좌측 slide-in, `w-[280px]`
- `MobileRightRailDrawer.tsx` — 우측 slide-in, `w-[85vw] max-w-[340px]`

### Phase 3: 트리거 & 마운트
- `TitleBar.tsx` 에 `Menu` / `PanelRight` 아이콘 버튼 2개 추가 (모바일 전용)
- `ProfileShell.tsx` 에 drawer 2개 mount
- CommandPalette 진입 경로 (Sidebar 상단 Search 버튼)

### Phase 4: 부가 작업
- `ProjectModal` 모바일 padding (R9)
- `Hero` 모바일 폭 조정 (R10)
- `ProjectGrid` 단축키 힌트 모바일 숨김 (R12)
- Safe-area inset, 터치 타겟 44×44px

---

## 4. 주요 구현 상세

### 4.1. `app/layout.tsx` — viewport export

```typescript
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,          // WCAG 2.5.3 — 사용자 확대 허용
  viewportFit: 'cover',     // iOS safe-area-inset 활성화
  themeColor: '#0a0a0c',    // --profile-bg
  colorScheme: 'dark',
}
```

### 4.2. `components/profile/SidebarContent.tsx` (신규)

기존 `Sidebar.tsx` 의 `<aside>` 내부 JSX를 그대로 옮긴다. `SOCIAL_LINKS` 상수도 함께 이동. 상단에 **CommandPalette 진입 버튼** 추가:

```tsx
type SidebarContentProps = {
  status: StatusSnapshot
  activeSection?: string | null
  onNavigate?: () => void   // 모바일 drawer에서 탭 후 자동 close 용
}

export function SidebarContent({ status, activeSection, onNavigate }: SidebarContentProps) {
  return (
    <div className="flex flex-col gap-6 font-mono text-xs">
      {/* Search & jump (CommandPalette 진입) */}
      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          window.dispatchEvent(new Event('profile:open-palette'))
        }}
        className="flex items-center gap-2 rounded border border-profile-line-2 ..."
      >
        <Search size={14} />
        <span className="flex-1 text-left">Search & jump</span>
        <kbd className="hidden md:inline ...">/</kbd>
      </button>

      {/* 기존 Workspace / Status / Links 블록 — onNavigate?.() 추가 */}
      {/* ... Nav 링크 onClick 에 onNavigate?.() 호출 ... */}
      {/* Status 서비스 리스트 .slice(0, 6) 유지 (Q4 결정) */}
    </div>
  )
}
```

### 4.3. `components/profile/RightRailContent.tsx` (신규)

기존 `RightRail.tsx` 의 `<aside>` 내부 JSX 이전. 변경 없이 그대로 옮긴다. CommitGraph `size="sm"` 유지 (Q3 결정).

### 4.4. `components/profile/Sidebar.tsx` (기존 축소)

```tsx
export function Sidebar({ status, activeSection }: SidebarProps) {
  return (
    <aside
      aria-label="Profile sidebar"
      className="hidden md:flex w-[236px] shrink-0 flex-col border-r border-profile-line bg-profile-bg-2 p-4"
    >
      <SidebarContent status={status} activeSection={activeSection} />
    </aside>
  )
}
```

`RightRail.tsx` 도 동일 패턴(`hidden xl:flex` 유지 + `<RightRailContent />` 위임).

### 4.5. `components/profile/MobileSidebarDrawer.tsx` (신규)

Radix Dialog 기반. `ProjectModal` 의 구조를 slide-in 으로 각색.

```tsx
'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { SidebarContent } from './SidebarContent'
import type { StatusSnapshot } from '@/lib/status'

type Props = {
  status: StatusSnapshot
  activeSection?: string | null
}

export function MobileSidebarDrawer({ status, activeSection }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener('profile:open-sidebar', openHandler)
    return () => window.removeEventListener('profile:open-sidebar', openHandler)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[54] bg-black/60 backdrop-blur md:hidden" />
        <Dialog.Content
          aria-label="Navigation"
          className="fixed inset-y-0 left-0 z-[55] flex w-[280px] flex-col border-r border-profile-line bg-profile-bg-2 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl md:hidden data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left overflow-y-auto"
        >
          <Dialog.Title className="sr-only">Navigation</Dialog.Title>
          <Dialog.Close
            aria-label="Close navigation"
            className="absolute top-3 right-3 flex h-[44px] w-[44px] items-center justify-center rounded text-profile-muted hover:text-profile-fg"
          >
            <X size={16} />
          </Dialog.Close>
          <SidebarContent
            status={status}
            activeSection={activeSection}
            onNavigate={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

**주의**: Radix Dialog 기본 애니메이션 활용 (`data-[state=open]:animate-in` 등). `tailwindcss-animate` 플러그인이 이미 설치되어 있어 `slide-in-from-left` 유틸 사용 가능.

### 4.6. `components/profile/MobileRightRailDrawer.tsx` (신규)

4.5와 대칭. 차이점만 표기:

```tsx
<Dialog.Content
  className="fixed inset-y-0 right-0 z-[55] flex w-[85vw] max-w-[340px] flex-col border-l border-profile-line bg-profile-bg-2 p-4 ... md:hidden data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right overflow-y-auto"
>
  <RightRailContent github={github} latestPosts={latestPosts} status={status} />
</Dialog.Content>
```

이벤트명: `profile:open-rightrail`.

### 4.7. `components/profile/TitleBar.tsx` 수정

기존 JSX 순서 유지하되 **좌측 dots 뒤 / 우측 ⌘K 버튼 좌측**에 모바일 트리거 삽입:

```tsx
import { Menu, PanelRight } from 'lucide-react'

// ... 기존 dots 3개 다음 ...
<button
  type="button"
  aria-label="Open navigation"
  onClick={() => window.dispatchEvent(new Event('profile:open-sidebar'))}
  className="md:hidden flex h-[44px] w-[44px] items-center justify-center -ml-2 text-profile-muted hover:text-profile-fg"
>
  <Menu size={16} />
</button>

<span className="hidden sm:inline truncate text-profile-muted">{path}</span>

<div className="ml-auto flex items-center gap-2 md:gap-4">
  {/* 모바일 우측 drawer 트리거 */}
  <button
    type="button"
    aria-label="Open activity panel"
    onClick={() => window.dispatchEvent(new Event('profile:open-rightrail'))}
    className="md:hidden flex h-[44px] w-[44px] items-center justify-center text-profile-muted hover:text-profile-fg"
  >
    <PanelRight size={16} />
  </button>

  {/* 기존 ⌘K 힌트 — 데스크톱 전용 유지 */}
  <button className="hidden md:inline-flex ...">⌘K</button>

  {/* 기존 N/N up 인디케이터 */}
</div>
```

- 아이콘 확정: 좌측 `Menu`, 우측 `PanelRight` (Q1 결정)
- 44×44px 터치 타겟 준수 (R7)

### 4.8. `components/profile/ProfileShell.tsx` 수정

기존 overlay mount 섹션에 drawer 2개 추가:

```tsx
<NoiseOverlay />
<TweaksPanel />
<CommandPalette projects={portfolioItems} latestPosts={writing.latest} />
<ProjectModal items={portfolioItems} />
<MobileSidebarDrawer status={status} activeSection={activeSection} />
<MobileRightRailDrawer
  github={github}
  latestPosts={writing.latest}
  status={status}
/>
```

### 4.9. Safe-area inset 대응

`TitleBar.tsx` / `StatusBar.tsx` 의 sticky 요소에 safe-area 패딩 추가.

```tsx
// TitleBar — top inset
<header className="sticky top-0 z-30 ... pt-[env(safe-area-inset-top)] h-[calc(40px+env(safe-area-inset-top))]">

// StatusBar — bottom inset
<footer className="sticky bottom-0 z-20 ... pb-[env(safe-area-inset-bottom)] h-[calc(28px+env(safe-area-inset-bottom))]">
```

Drawer 내부 scroll 컨테이너에도 `pt-[...top] pb-[...bottom]` 적용 (4.5 참조).

### 4.10. ProjectModal 모바일 padding (R9)

```diff
- <div className="px-8 py-6">
+ <div className="px-4 py-5 sm:px-8 sm:py-6">
```

`components/profile/ProjectModal.tsx:122` 한 줄 수정.

### 4.11. Hero 모바일 미세 조정 (R10)

```diff
- className="... text-5xl sm:text-7xl md:text-8xl"
+ className="... text-[40px] sm:text-7xl md:text-8xl"

- <dl className="... grid-cols-[120px_1fr] ...">
+ <dl className="... grid-cols-[90px_1fr] sm:grid-cols-[120px_1fr] ...">
```

`components/profile/Hero.tsx:40, 56` 수정. 320px 뷰포트 기준 `// frank oh;` 1줄 유지 확인.

### 4.12. ProjectGrid 단축키 힌트 모바일 숨김 (R12)

`components/profile/ProjectGrid.tsx:61-70` 의 j/k 안내 텍스트를 `hidden sm:inline` 으로 감싼다:

```tsx
<span className="font-mono text-[11px] text-profile-muted">
  ls ./projects · {items.length} items
  <span className="hidden sm:inline">
    {' · '}
    <kbd ...>j</kbd> <kbd ...>k</kbd> to navigate
  </span>
</span>
```

### 4.13. 터치 타겟 & 접근성

- **모든 신규 버튼**: `min-h-[44px] min-w-[44px]` 또는 `h-[44px] w-[44px]` 직접 지정
- **Sidebar nav 링크** (`SidebarContent` 내): 현재 `px-2 py-1` → 모바일에서 `py-2.5`로 상향
  ```tsx
  className="... px-2 py-2.5 md:py-1 ..."
  ```
- **Drawer 포커스 트랩 & ESC**: Radix Dialog 기본 제공 ✅
- **Body scroll lock**: Radix Dialog 기본 제공 ✅

## 5. z-index 정합성

| 요소 | z-index | 비고 |
|---|---|---|
| TweaksPanel | 50 | 기존 |
| NoiseOverlay | 50 | 기존 |
| TitleBar | 30 | 기존 |
| StatusBar | 20 | 기존 |
| CommandPalette | 60 | 기존 |
| ProjectModal Overlay | 55 | 기존 |
| ProjectModal Content | 56 | 기존 |
| **Mobile Drawer Overlay** | **54** | 신규 |
| **Mobile Drawer Content** | **55** | 신규 |

Drawer(55) > TweaksPanel(50) 이므로 drawer 열렸을 때 TweaksPanel이 위로 튀어나오는 문제 없음. 동시에 CommandPalette(60)가 drawer 위에 올라오므로 drawer 내부 Search 버튼으로 palette 진입 시 시각적으로 올바르게 겹침.

## 6. 파일 변경 요약

### 신규 (4)
- `components/profile/SidebarContent.tsx`
- `components/profile/RightRailContent.tsx`
- `components/profile/MobileSidebarDrawer.tsx`
- `components/profile/MobileRightRailDrawer.tsx`

### 수정 (7)
- `app/layout.tsx` — `viewport` export 추가
- `components/profile/Sidebar.tsx` — 본문을 `SidebarContent` 로 위임
- `components/profile/RightRail.tsx` — 본문을 `RightRailContent` 로 위임
- `components/profile/TitleBar.tsx` — 모바일 트리거 2개 + safe-area top
- `components/profile/StatusBar.tsx` — safe-area bottom
- `components/profile/ProfileShell.tsx` — drawer 2개 mount
- `components/profile/ProjectModal.tsx` — 모바일 padding
- `components/profile/Hero.tsx` — 모바일 폰트/그리드 조정
- `components/profile/ProjectGrid.tsx` — 단축키 힌트 모바일 숨김

### 의존성
- 추가 없음 (Radix Dialog · lucide 모두 기존)

## 7. 회귀 위험 점검

| 영역 | 위험 | 확인 방법 |
|---|---|---|
| 데스크톱 Sidebar | 본문 추출 후 렌더링 달라질 수 있음 | `md`/`xl` 뷰포트에서 기존 스크린샷과 비교 |
| 데스크톱 RightRail | 동일 | 동일 |
| CommandPalette 단축키 | `/` 핸들러 변경 없음 | `/` 입력으로 팔레트 오픈 확인 |
| ProjectModal | padding 변경만 | 데스크톱에서 여백 회귀 없음 확인 |
| Hero title wrap | 폰트 크기 축소 | 320 / 375 / 640 / 768 / 1024 뷰포트 실측 |
| StatusBar 하단 인디케이터 | safe-area 추가로 높이 증가 | iOS Safari 시뮬레이터에서 홈바 겹침 없음 |
