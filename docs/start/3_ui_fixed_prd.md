# PRD: Profile UI v2 — 스타일 미세 정정 (색상·prefix·KV 포맷)

## 개요
PR #28 머지 후 `Profile v2.html` 원본과 **현재 렌더링 간의 4가지 스타일 불일치**를 정정한다. 기능 변경은 없고 순수 스타일 보정.

기준 디자인: `docs/start/Profile/Profile v2.html` (CSS L168–202, `.prompt` / `.hero-title` / `.kvs` / `.sec-head`)

## 배경
- PR #28에서 Projects 카드 / Sidebar Links / Hero KV 8행 확장 등을 반영했지만, 원본 Profile v2.html의 세부 **색상 매핑·prefix·레이아웃 비율**을 그대로 따르지 못한 지점이 남아 있다.
- 네 군데 모두 원본 CSS 라인이 명확하므로 **class 매핑만 다시 맞추면** 되는 소폭 수정.

## 목표
- `Profile v2.html`의 prompt / hero-title / kvs / sec-head 4개 스타일 규칙을 픽셀 수준으로 반영.
- 모든 중간 섹션 헤더에 `// ` accent prefix 일관 적용 (projects / writing / writing-investment).

## 비목표
- 컴포넌트 구조·props 변경
- 신규 필드·콘텐츠 추가
- 애니메이션/인터랙션 수정

---

## 변경 상세

### 1. Prompt 색상 — `frank@seoul:~/profile (main)$` 재배치

**원본 CSS (L176–177)**:
```css
.prompt { color: var(--accent); font-size: 12.5px; letter-spacing: 0.02em }
.prompt b { color: var(--fg); font-weight: 500 }
```

**원본 마크업 (L581)**:
```html
<div class="prompt"><b>frank@seoul</b>:~/profile (main)$ <span>typed</span><span class="caret"/></div>
```

**해석**
- prompt 문단 전체 색은 **`var(--profile-accent)`** (violet)
- `<b>frank@seoul</b>` 부분만 **`var(--profile-fg)`** (밝은 fg) + `font-weight: 500`
- typed 명령어는 별도 색 지정 없이 accent 상속
- font-size **12.5px**, letter-spacing **0.02em**

**현재 (`TypewriterPrompt.tsx`)**
```tsx
<div className="font-mono text-sm text-profile-muted">
  <span>{prompt}</span>
  <span className="text-profile-fg">{current.slice(0, charIdx)}</span>
  ...
</div>
```
- 전체 muted, typed만 fg → **원본과 반대**

**변경**
```tsx
<div className="font-mono text-[12.5px] tracking-[0.02em] text-profile-accent">
  <span>frank@seoul</span> 부분을 <strong className="font-medium text-profile-fg"> 로 감싸고,
  나머지 `:~/profile (main)$ `와 typed는 accent 색 유지
  <span className="text-profile-accent">{current.slice(0, charIdx)}</span>
</div>
```

- 기존 `prompt` prop을 받는 문자열 방식 대신, `username@host` / `path` 부분을 props로 분리하거나 컴포넌트 내부에서 하드코딩 (현재 기본값 `frank@seoul:~/profile (main)$`에 변경 없음)
- caret bar는 그대로 accent 유지

### 2. Hero title `// frank oh;` 색상 + weight

**원본 CSS (L181–187)**:
```css
.hero-title { font-family: var(--display); font-weight: 500; color: var(--fg); ... }
.hero-title .c { color: var(--accent) }
.hero-title .g { color: var(--muted) }
.hero-title .semi { color: var(--muted-2) }
```

**원본 마크업 (L583–585)**:
```html
<h1 class="hero-title">
  <span class="g">//</span> frank <span class="c">oh</span><span class="semi">;</span>
</h1>
```

**해석**
- 기본 color: **`--profile-fg`** (`frank ` 부분)
- `//` → **`--profile-muted`**
- `oh` → **`--profile-accent`**
- `;` → **`--profile-muted-2`**
- font-weight **500 (medium)** — 현재 구현은 `font-bold` (700)

**현재 (`Hero.tsx`)**
```tsx
<h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-profile-fg sm:text-7xl md:text-8xl">
  <span className="text-profile-accent">//</span> frank oh<span className="text-profile-muted-2">;</span>
</h1>
```
- `//` accent (원본은 muted) ❌
- `oh` fg (원본은 accent) ❌
- font-bold (원본은 medium) ❌

**변경**
```tsx
<h1 className="font-display font-medium text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-[-0.035em] text-profile-fg">
  <span className="text-profile-muted">//</span> frank{' '}
  <span className="text-profile-accent">oh</span>
  <span className="text-profile-muted-2">;</span>
</h1>
```

- `leading-[0.9]` + `tracking-[-0.035em]` (원본 정확)
- font-weight 500 medium

### 3. KV list 포맷 — 원본 `.kvs` 그리드 비율 + `· ` prefix

**원본 CSS (L197–201)**:
```css
.kvs { margin: 28px 0 12px; display: grid; grid-template-columns: 120px 1fr; gap: 7px 20px; font-size: 13px }
.kvs .k { color: var(--muted); text-transform: lowercase; letter-spacing: 0.02em }
.kvs .k::before { content: "· " }
.kvs .v { color: var(--fg) }
```

**해석**
- **grid `120px 1fr`** (첫 컬럼 고정 120px, 두 번째는 나머지)
- **gap `7px 20px`** (row 7px / col 20px)
- font-size **13px**
- key: **`--profile-muted`**, lowercase, letter-spacing 0.02em, **`::before content "· "`** prefix
- value: **`--profile-fg`** (기본)

**현재 (`Hero.tsx`)**
```tsx
<dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 font-mono text-xs sm:text-sm">
  <dt className="text-profile-muted-2">{k}</dt>
  <dd className="text-profile-fg-2">{v}</dd>
</dl>
```
- `max-content` 컬럼 (원본 120px 고정) ❌
- `gap-x-4 gap-y-1` (16 / 4) vs 원본 20 / 7 ❌
- `text-xs~sm` vs 원본 **13px** ❌
- `dt`에 `· ` prefix 없음 ❌
- key color `muted-2` (원본은 `muted`) ❌
- value color `fg-2` (원본은 `fg`) ❌

**변경**
```tsx
<dl className="my-7 mb-3 grid grid-cols-[120px_1fr] gap-x-5 gap-y-[7px] font-mono text-[13px]">
  {kvs.map(([k, v]) => (
    v ? (
      <div key={k} className="contents">
        <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">{k}</dt>
        <dd className="text-profile-fg">{v}</dd>
      </div>
    ) : null
  ))}
</dl>
```

- key color muted (bumped 대비)
- value color fg
- prefix `· `
- 120px fixed / 1fr
- gap 7px row / 20px col (`gap-y-[7px]` + `gap-x-5`)

### 4. inspire-me 프로젝트 ext 정정

**원본 `Profile v2.html` L640**:
```html
<div class="name">inspire-me<span class="ext">.go</span></div>
```

**현재**: `contents/website/inspire-me/index.md` → `ext: .ts`

**변경**: `ext: .go`로 정정 (원본 내러티브 따름)

### 5. 섹션 헤더에 `// ` accent prefix

**원본 CSS (L168–173)**:
```css
.sec-head { display: flex; align-items: baseline; gap: 12px; margin: 0 0 18px }
.sec-head h2 { font-family: var(--mono); font-size: 12px; color: var(--muted); margin: 0; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 500 }
.sec-head h2::before { content: "// "; color: var(--accent) }
.sec-head .hash { font-family: var(--mono); font-size: 11px; color: var(--muted-2) }
.sec-head .bar { flex: 1; height: 1px; background: var(--line) }
.sec-head .cnt { font-family: var(--mono); font-size: 11px; color: var(--muted) }
```

**해석**
- h2 `::before content "// "` + color **accent**
- h2 본문: **muted**, uppercase, 12px, letter-spacing **0.14em**, weight 500
- hash: muted-2 (11px)
- bar: `flex: 1; height: 1px; background: var(--line)` — line (not line-2)
- cnt: muted (11px)
- 컨테이너 `align-items: baseline` + gap 12px, margin-bottom 18px

**현재**
- `ProjectGrid.tsx` 헤더: `text-profile-fg tracking-widest text-[13px]` — prefix 없음, color fg ❌
- `WritingList.tsx` 헤더: `text-profile-muted text-[11px] tracking-widest` — prefix 없음 ❌

**변경**
공통 `.sec-head` Tailwind 조합을 두 컴포넌트에 일관 적용:

```tsx
<header className="mb-[18px] flex items-baseline gap-3">
  <h2 className="font-mono text-[12px] uppercase tracking-[0.14em] text-profile-muted font-medium before:content-['//_'] before:text-profile-accent m-0">
    projects
  </h2>
  <span className="font-mono text-[11px] text-profile-muted-2">#02</span>
  <div className="flex-1 border-t border-profile-line" aria-hidden="true" />
  <span className="font-mono text-[11px] text-profile-muted">
    ls ./projects · {N} items · <kbd ...>j</kbd> <kbd ...>k</kbd> to navigate
  </span>
</header>
```

- `ProjectGrid.tsx`: `// projects` + `#02`
- `WritingList.tsx` (IT): `// writing.it` + `#03`
- `WritingList.tsx` (INV): `// writing.inv` + `#04`
- hash는 `WritingList` props로 전달 or 내부 매핑 테이블

**WritingList 확장**: 현재 `title`만 받음. `hash?` prop 추가 가능. 또는 id(`writing` / `writing-investment`)를 기준으로 내부 매핑.

가장 단순: `WritingList` props에 `hash?: string` 추가, `ProfileShell`에서 `#03` / `#04` 전달.

---

## 파일 변경 목록

### 수정
- `components/profile/TypewriterPrompt.tsx` — prompt 색 재매핑(accent 기본 + frank@seoul만 fg bold), font-size 12.5px, letter-spacing 0.02em
- `components/profile/Hero.tsx` — hero-title 재매핑(// muted / oh accent / ; muted-2), font-medium + leading 0.9 + tracking -0.035em. KV list grid 120px/1fr + gap 7/20 + 13px + `· ` prefix + muted key / fg value
- `components/profile/ProjectGrid.tsx` — 섹션 헤더에 `// ` accent prefix, h2 color muted + letter-spacing 0.14em, bar는 `border-profile-line`
- `components/profile/WritingList.tsx` — 섹션 헤더에 `// ` accent prefix, `hash` prop 추가, sec-head CSS 맞춤 정렬
- `components/profile/ProfileShell.tsx` — `WritingList`에 `hash="#03"` / `#04` 전달
- `contents/website/inspire-me/index.md` — `ext: .ts` → `ext: .go`

### 신규 / 삭제
- 없음

### globals.css
- 현재 변수 그대로 재사용 — 추가 유틸 불필요 (모두 Tailwind arbitrary values로 처리)

---

## 테스트 계획

### 빌드
- `npm run check` + `npm run build` 통과

### 수동 QA (Netlify Deploy Preview)
- Hero prompt: `frank@seoul`이 **흰색(fg) 굵게**, 나머지 `:~/profile (main)$`와 typed는 **violet(accent)** 인지
- Hero title: `//` muted + `frank ` fg + `oh` accent + `;` muted-2 + medium weight
- Hero KV list: 8행 모두 `· role`, `· focus` 처럼 `· ` prefix, key 컬럼 120px 고정, row gap 7px
- Projects 섹션 헤더에 `// PROJECTS` accent prefix
- Writing 섹션 2개 헤더에 `// WRITING.IT` / `// WRITING.INV` accent prefix
- 반응형 1440/1100/768에서 KV 120px 컬럼 유지(매우 좁은 뷰포트 375는 줄바꿈 허용)

### MCP Playwright
- Hero prompt 요소의 computed color가 `rgb(...)` 기준 accent variable 값과 일치 확인
- `#projects` h2의 `::before` pseudo 존재 확인 (내용 "// ")
- KV list `<dt>` 요소 개수 + 첫 문자열 `· role` 시작 확인

## Out-of-scope

- 섹션 번호(`#02`, `#03`, `#04`) 자동 계산 로직 — 지금은 props로 수동 전달
- 다른 원본 스타일(skills 바 차트, gitlog 등) — 별도 티켓

## 관련 문서

- 디자인 원본: `docs/start/Profile/Profile v2.html` (CSS L168–202, 마크업 L580–599)
- 직전 PR: `docs/done/3_change_ui_prd.md` / `docs/done/3_change_ui_implementation.md`
- 구현 상세(예정): `docs/start/3_ui_fixed_implementation.md`
- 작업 체크리스트(예정): `docs/start/3_ui_fixed_todo.md`
