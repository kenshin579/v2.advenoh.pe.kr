# Center LineGutter 잘림 수정 — 구현 문서

## 1. 개요

`v2.advenoh.pe.kr` 메인 페이지 중앙 영역의 `LineGutter`가 **48줄 하드코딩**으로 인해 콘텐츠 중간에서 끊기는 문제를 해결한다. `ResizeObserver`로 콘텐츠 실제 높이를 측정하여 라인 수를 동적으로 계산한다.

- **변경 범위**: `LineGutter.tsx`, `ProfileShell.tsx` 2개 파일
- **장식 요소 유지**: 라인 번호는 실제 텍스트 라인과 무관한 IDE 스타일 장식
- **SSG 호환**: 초기값으로 안전한 fallback 라인 수를 두고, 클라이언트 hydration 후 실제 높이에 맞춰 재계산

## 2. 아키텍처

```
┌──────────────────────────────────────────────┐
│ ProfileShell (main > div.flex max-w-[1100px])│
│  ┌──────────────┬──────────────────────────┐ │
│  │ LineGutter   │ contentRef (div)         │ │
│  │ (dynamic)    │  ├─ Hero                 │ │
│  │  ↑           │  ├─ QuoteBlock           │ │
│  │  │ lines     │  ├─ ProjectGrid          │ │
│  │  │ ← height  │  ├─ WritingList(it)      │ │
│  │  │           │  └─ WritingList(inv)     │ │
│  │  └──────── ResizeObserver ───────────── │ │
│  └──────────────┴──────────────────────────┘ │
└──────────────────────────────────────────────┘
```

- `LineGutter`는 `targetRef` prop으로 콘텐츠 컨테이너 ref를 받는다.
- `ResizeObserver`가 콘텐츠 높이 변화를 감지하여 `Math.ceil(height / LINE_HEIGHT_PX)` 만큼 라인을 렌더한다.
- 초기 SSR 렌더에서는 `INITIAL_LINES` fallback을 사용한다.

## 3. 파일 변경 목록

| 파일 | 작업 | 설명 |
|---|---|---|
| `components/profile/LineGutter.tsx` | 리팩터링 | `'use client'` 전환 + `targetRef` prop + `ResizeObserver` 기반 동적 라인 수 |
| `components/profile/ProfileShell.tsx` | 수정 | `useRef` 생성, `LineGutter`에 `targetRef` 전달, 콘텐츠 `div`에 `ref` 부착 |

## 4. 모듈 상세

### 4.1 `components/profile/LineGutter.tsx` (리팩터링)

```tsx
'use client'

import { useEffect, useState, type RefObject } from 'react'

// leading-6 = 1.5rem = 24px. Tailwind 클래스 변경 시 함께 수정.
const LINE_HEIGHT_PX = 24
// SSR fallback. Hero + QuoteBlock 영역을 덮을 수 있는 값.
const INITIAL_LINES = 80

type LineGutterProps = {
  targetRef: RefObject<HTMLElement | null>
}

/**
 * IDE 스타일 라인 번호 gutter. 메인 콘텐츠 좌측에 배치된다.
 * 실제 텍스트 라인과 일치하지 않는 장식 요소이나, 콘텐츠 높이에
 * 맞춰 라인 수를 동적으로 계산해 콘텐츠 끝까지 연속 표시한다.
 */
export function LineGutter({ targetRef }: LineGutterProps) {
  const [lines, setLines] = useState(INITIAL_LINES)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const update = () => {
      const height = el.getBoundingClientRect().height
      const needed = Math.ceil(height / LINE_HEIGHT_PX) + 2
      setLines(prev => (prev === needed ? prev : Math.max(INITIAL_LINES, needed)))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [targetRef])

  return (
    <div
      aria-hidden="true"
      className="hidden md:flex w-10 shrink-0 select-none flex-col items-end pr-2 pt-6 font-mono text-[10px] leading-6 text-profile-muted-2"
    >
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i}>{i + 1}</span>
      ))}
    </div>
  )
}
```

포인트:

- `'use client'` 선언 (훅 사용)
- `lines` state의 초기값 = `INITIAL_LINES`로 SSR/CSR 1차 렌더 일치
- `ResizeObserver`로 폰트 로드·모달 열림·이미지 로딩 등 모든 높이 변화 자동 반영
- `+2`는 소수점 올림 이후에도 여유분을 둬 경계에서 끊김 방지
- `Math.max(INITIAL_LINES, needed)`로 콘텐츠가 너무 짧을 때도 최소 라인 유지

### 4.2 `components/profile/ProfileShell.tsx` (수정)

변경 부분만 표기.

```tsx
'use client'

import { useRef } from 'react'
// ... 기존 import 유지
import { LineGutter } from './LineGutter'

export function ProfileShell({ /* ... */ }: ProfileShellProps) {
  // 기존 상태/훅
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex min-h-screen flex-col bg-profile-bg text-profile-fg font-sans">
      <TitleBar status={status} activeSection={activeSection} />

      <div className="flex flex-1">
        <Sidebar status={status} activeSection={activeSection} />

        <main className="relative flex-1 overflow-x-hidden">
          <div className="mx-auto flex max-w-[1100px] gap-0">
            <LineGutter targetRef={contentRef} />

            <div
              ref={contentRef}
              className="flex-1 px-4 sm:px-6 pt-6 pb-16 space-y-[var(--profile-space-section)]"
            >
              <Hero stats={stats} github={github} status={status} readme={readme} />
              <QuoteBlock />
              <ProjectGrid items={portfolioItems} />
              <WritingList id="writing" title="writing.it" hash="#03" items={writing.it} />
              <WritingList id="writing-investment" title="writing.inv" hash="#04" items={writing.investment} />
            </div>
          </div>
        </main>

        <RightRail github={github} latestPosts={writing.latest} status={status} />
      </div>

      {/* 기존 StatusBar, NoiseOverlay, TweaksPanel, CommandPalette, ProjectModal 유지 */}
    </div>
  )
}
```

포인트:

- `useRef<HTMLDivElement>(null)` 로 콘텐츠 컨테이너 ref 생성
- 기존 `<LineGutter />` → `<LineGutter targetRef={contentRef} />`
- 콘텐츠 `<div>` 에 `ref={contentRef}` 부착
- 레이아웃/스타일 변경 없음

## 5. 데이터/렌더 흐름

1. SSR/SSG 빌드 → `LineGutter`는 `INITIAL_LINES=80` 기준으로 정적 HTML 렌더.
2. 브라우저 hydration 직후 `useEffect` 실행.
3. `contentRef`의 `getBoundingClientRect().height` 측정 → `Math.ceil(h / 24) + 2` 계산.
4. `setLines`로 state 업데이트 → gutter가 콘텐츠 하단까지 연속 렌더.
5. 창 리사이즈·폰트 로드·writing 항목 live fetch 등 변화 시 `ResizeObserver` 콜백이 재측정 → 자동 반영.

## 6. 엣지 케이스

| 상황 | 동작 |
|---|---|
| 모바일 (`md` 미만) | `hidden md:flex`로 gutter 비표시, ResizeObserver는 동작하나 DOM에 미렌더 |
| Writing 항목 0개 | 콘텐츠 짧아짐 → `Math.max(INITIAL_LINES, needed)`로 80줄 보장 |
| 모달 열림으로 스크롤 잠금 | 콘텐츠 높이 변화 없음, 영향 없음 |
| 폰트 로드 지연 | ResizeObserver가 재측정 → 자동 보정 |
| 창 리사이즈 | ResizeObserver 콜백 → 자동 보정 |

## 7. 테스트 전략

### 7.1 수동 검증

- `npm run dev` 실행 후 `http://localhost:3000` 접속
- 데스크톱 너비(`md` 이상, 768px+)에서 좌측 gutter가 `WRITING.INV` 섹션 하단까지 연속 표시되는지 확인
- DevTools로 창 너비/높이 조절 → gutter 라인 수가 자동 증감하는지 확인

### 7.2 E2E (MCP Playwright)

- `http://localhost:3000` 접속
- 데스크톱 뷰포트(1440×900)에서 `LineGutter` 최종 라인 번호가 `floor(content_height / 24)` 이상인지 확인
- 페이지 전체 스크린샷 촬영 → 좌측 gutter가 `#writing-investment` 하단까지 끊김 없이 렌더되는지 육안 확인
- `md` 미만(예: 375px) 뷰포트에서 gutter가 숨겨지는지 확인

### 7.3 회귀 방지

- Playwright 스크린샷을 `docs/start/` 또는 `tests/` 하위에 스냅샷으로 보관해 이후 변경 시 diff 검토

## 8. 참고

- PRD: `7_line_prd.md`
- 관련 Tailwind 토큰: `leading-6` (24px), `text-[10px]`, `text-profile-muted-2`
- React 19 `useRef` 호환: `RefObject<T | null>` 시그니처 사용
