# Center LineGutter 잘림 수정 PRD

## 1. 배경 & 현상

`v2.advenoh.pe.kr` 메인 페이지(`ProfileShell`)의 중앙 영역 좌측에는 IDE 스타일 라인 번호 gutter(`LineGutter`)가 있다. 현재 라인 번호가 **1~48**까지만 렌더되고, 48번 아래부터는 gutter가 비어 있어 `ProjectGrid` 후반부와 두 개의 `WritingList`(IT/INV) 영역에는 라인 번호가 표시되지 않는다.

스크린샷에서도 `40~48` 숫자 이후 gutter 영역이 공백이며, `ai-chatbot.py` / `it-blog.md` / `investment-blog.md` / `status.ts` 카드, `// WRITING.IT`, `// WRITING.INV` 섹션 옆 gutter가 비어 있는 것을 확인할 수 있다.

### 목표

1. 중앙 콘텐츠 전 구간에서 라인 번호가 끊기지 않고 상단부터 하단까지 연속적으로 표시되도록 한다.
2. 브라우저 너비·폰트·콘텐츠 수(Writing 항목 추가/삭제, 프로젝트 증감 등)에 따라 동적으로 라인 수가 맞춰져야 한다.
3. 기존 시각 스타일(`font-mono`, `text-[10px]`, `leading-6`, 우측 정렬, `md` 이상에서만 노출)은 유지한다.

### 비목표

- 라인 번호와 실제 텍스트 라인의 정렬 일치(정확한 행 매칭)는 목표가 아님 — 장식 요소로 유지한다.
- 라인 번호 클릭·호버 인터랙션 추가는 범위에 포함하지 않는다.
- 색상·폰트 등 디자인 토큰 변경은 하지 않는다.

## 2. 현재 구현

### 2.1 파일 위치

- `components/profile/LineGutter.tsx` — 라인 번호 gutter 컴포넌트
- `components/profile/ProfileShell.tsx:62-77` — `main` 영역 안에 `LineGutter`와 콘텐츠 컨테이너를 가로로 배치

### 2.2 문제 코드

```tsx
// components/profile/LineGutter.tsx
export function LineGutter({ lines = 48 }: LineGutterProps) {
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

- `lines = 48` 고정
- `leading-6` (24px) × 48 = **1152px** 높이에서 라인 번호가 종료됨
- 실제 콘텐츠(`Hero` + `QuoteBlock` + `ProjectGrid` + 두 `WritingList`)는 데스크톱 기준 대략 **3000~4000px** 이상 → gutter가 콘텐츠 높이를 커버하지 못함

### 2.3 ProfileShell 레이아웃 구조

```tsx
<main className="relative flex-1 overflow-x-hidden">
  <div className="mx-auto flex max-w-[1100px] gap-0">
    <LineGutter />
    <div className="flex-1 px-4 sm:px-6 pt-6 pb-16 space-y-[var(--profile-space-section)]">
      {/* Hero, QuoteBlock, ProjectGrid, WritingList x2 */}
    </div>
  </div>
</main>
```

- `flex` 컨테이너이므로 gutter를 자식 요소의 높이에 맞춰 stretch 시킬 수 있는 구조.
- 다만 현재 gutter는 `flex-col` + 고정 48개 span만 렌더하여 stretch가 의미 없음.

## 3. 원인 분석

1. **하드코딩**: `lines` 기본값 48이 콘텐츠 분량과 무관하게 설정되어 있음.
2. **높이 측정 없음**: 콘텐츠 영역의 실제 높이에 반응하지 않음 (ResizeObserver 등 미사용).
3. **정적 렌더 한계**: 서버 렌더 시에는 브라우저 높이를 알 수 없어 초기값이 필요 — 현재는 그 "초기값 = 최종값"으로 고정된 상태.

## 4. 해결 방안

### 4.1 옵션 비교

| 옵션 | 설명 | 장점 | 단점 |
|---|---|---|---|
| **A. 동적 측정 (권장)** | 옆 콘텐츠 `div`의 실제 높이를 `ResizeObserver`로 감지 → `Math.ceil(height / lineHeight)`만큼 라인 렌더 | 정확, 반응형, 콘텐츠 변화 자동 대응 | 클라이언트 코드 추가(훅) |
| **B. 반복 배경** | gutter를 `h-full`로 stretch 후 `background-image: linear-gradient + counter` 대신 CSS로 라인 번호를 반복 렌더 | DOM 노드 적음, 구현 단순 | CSS `counter`로는 배경에 숫자 렌더 불가 → 결국 큰 고정 라인을 `overflow-hidden`으로 자르는 편법 필요 |
| **C. 충분히 큰 고정값** | `lines`를 200 등 큰 값으로 올리고 부모에 `overflow-hidden`으로 하단 초과분 자르기 | 구현 최단, 훅 불필요 | 콘텐츠가 더 길어지면 또 잘림, 짧을 때는 빈 라인이 남아 `pb-16` 영역까지 숫자 노출 |

**권장: 옵션 A** — 콘텐츠 증감에 자동 대응하며, SSG 초기 렌더에서도 큰 값(예: 80)을 초기값으로 두면 hydration 직전까지 시각적 결손 최소화 가능.

### 4.2 상세 설계 (옵션 A)

#### 4.2.1 LineGutter 리팩토링

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

const LINE_HEIGHT_PX = 24 // leading-6 = 1.5rem = 24px
const INITIAL_LINES = 80  // SSG fallback (Hero + Quote + Projects 기준 상단 영역 커버)

type LineGutterProps = {
  targetRef: React.RefObject<HTMLElement>
}

export function LineGutter({ targetRef }: LineGutterProps) {
  const [lines, setLines] = useState(INITIAL_LINES)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return

    const update = () => {
      const height = el.getBoundingClientRect().height
      setLines(Math.max(INITIAL_LINES, Math.ceil(height / LINE_HEIGHT_PX) + 2))
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

#### 4.2.2 ProfileShell 수정

콘텐츠 컨테이너에 `ref`를 연결하고 `LineGutter`에 전달.

```tsx
const contentRef = useRef<HTMLDivElement>(null)
...
<div className="mx-auto flex max-w-[1100px] gap-0">
  <LineGutter targetRef={contentRef} />
  <div ref={contentRef} className="flex-1 px-4 sm:px-6 pt-6 pb-16 space-y-[var(--profile-space-section)]">
    ...
  </div>
</div>
```

#### 4.2.3 상수화

- `LINE_HEIGHT_PX = 24`를 상수로 관리 (`leading-6`과 동기화).
- 추후 Tailwind 토큰 변경 시 이 상수도 함께 변경하도록 코드 주석 추가.

### 4.3 고려 사항

- **Hydration mismatch**: SSR에서 렌더된 초기 라인 수(`INITIAL_LINES`)와 클라이언트 측 첫 렌더값이 다를 수 있으나, `aria-hidden` 장식 요소이므로 시각적 flicker만 발생. `useEffect` 내에서만 update하므로 React 경고는 없음.
- **성능**: `ResizeObserver`는 콘텐츠 영역 1개만 관찰. 이미지 로드/폰트 로드/모달 열림 등으로 높이 변화 시 재계산되나 비용은 미미.
- **모바일**: `md:flex`로 gutter가 숨겨지므로 ResizeObserver는 여전히 동작하나 렌더 비용 무시 가능. 필요 시 `window.matchMedia('(min-width: 768px)')` 가드 추가.

## 5. 작업 항목

- [ ] `components/profile/LineGutter.tsx` 수정
  - [ ] `'use client'` 지시자 추가 (클라이언트 훅 사용)
  - [ ] `targetRef` prop 추가, `lines` prop 제거
  - [ ] `useEffect` + `ResizeObserver`로 동적 라인 수 계산
  - [ ] `INITIAL_LINES`, `LINE_HEIGHT_PX` 상수 정의
- [ ] `components/profile/ProfileShell.tsx` 수정
  - [ ] `useRef`로 콘텐츠 컨테이너 ref 생성
  - [ ] `<LineGutter targetRef={contentRef} />` 로 전달
  - [ ] 콘텐츠 `div`에 `ref={contentRef}` 부착
- [ ] 시각 검증
  - [ ] 데스크톱(`md` 이상)에서 Hero부터 Writing.INV 하단까지 라인 번호가 연속으로 표시되는지 확인
  - [ ] 브라우저 창 리사이즈 시 라인 수가 자동 재조정되는지 확인
  - [ ] Writing 항목이 0개인 엣지 케이스에서 gutter가 Hero 영역만큼만 표시되는지 확인
- [ ] 회귀 테스트 (선택)
  - [ ] Playwright: 페이지 전체 스크린샷에서 좌측 gutter가 마지막 콘텐츠 섹션까지 렌더되는지 스냅샷 비교

## 6. 영향 범위

| 파일 | 변경 내용 |
|---|---|
| `components/profile/LineGutter.tsx` | 동적 라인 계산으로 리팩토링 |
| `components/profile/ProfileShell.tsx` | `ref` 연결 및 prop 전달 |

외 다른 컴포넌트/스타일/콘텐츠 변경 없음.

## 7. 리스크 및 대응

| 리스크 | 대응 |
|---|---|
| SSG 초기 렌더에서 `INITIAL_LINES`(80)가 실제 콘텐츠보다 작을 수 있음 (hydration 전 깜빡임) | `INITIAL_LINES`를 실제 평균 높이 기반으로 조정(120~160), 첫 측정 후 바로 재계산되므로 1프레임 내 해소 |
| 폰트 로딩으로 콘텐츠 높이 변화 | `ResizeObserver`가 자동 감지·재계산 |
| Tailwind의 `leading-6` 값이 바뀌면 계산 틀어짐 | `LINE_HEIGHT_PX` 상수와 `leading-6`을 같은 파일 내 주석으로 묶어 동기화 가이드 제공 |
