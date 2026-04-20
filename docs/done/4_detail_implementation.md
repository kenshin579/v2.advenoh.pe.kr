# 프로젝트 상세 디자인 정합성 — 구현 문서

> PRD: `4_detail_prd.md`
> 범위: Profile v2.html 레퍼런스와 일치하도록 `ProjectCardV2`, `ProjectGrid`, `ProjectModal` 및 포트폴리오 스키마를 조정한다.

---

## 1. 대상 파일

| 파일 | 변경 수준 |
|---|---|
| `components/profile/ProjectModal.tsx` | **대폭 리팩토링** (레이아웃 재설계) |
| `components/profile/ProjectGrid.tsx` | 중간 (키보드 포커스 상태 추가) |
| `components/profile/ProjectCardV2.tsx` | 소폭 (featured h3 고정, `.focused` 상태 연결) |
| `lib/portfolio.ts` | 소폭 (overview 렌더 정책 반영) |
| `contents/website/*/index.md` | overview 필드를 Markdown/HTML 조각으로 확장 |
| `app/globals.css` | `.readme` 스코프 prose 스타일 (필요 시) |

---

## 2. ProjectModal 재설계

### 2.1 DOM 구조 (레퍼런스와 1:1 매핑)

```
<Dialog.Root>
  <Dialog.Overlay />      // bg-black/70, backdrop-blur
  <Dialog.Content>        // w-[min(960px,100%)], max-h-[calc(100vh-80px)], rounded-xl, bg-profile-bg-2
    <header class="mh">   // 트래픽 라이트 dots + ~/projects/<b>{slug}</b> + close·ESC
      <div class="dots">● ● ●</div>
      <div class="path">~/projects/<b>{slug}</b></div>
      <Dialog.Close>close · ESC</Dialog.Close>
    </header>

    <div class="mbody">
      <div class="hero-img" />   // flush full-width, aspect-16/9, border-bottom only, NO border-radius
      <div class="mcontent">     // padding 26px 32px
        <Dialog.Title as h3>{title}</h3>        // display 32px, -0.02em, mb-1.5
        <p class="dek">{dek}</p>                // sans 15px, max-w-[60ch], mb-[22px]

        <dl class="meta-grid">                  // 4-col box with dividers
          <div class="m"><div class="l">status</div><div class="v">{status}</div></div>
          <div class="m"><div class="l">year</div>  <div class="v">{year}</div></div>
          <div class="m"><div class="l">role</div>  <div class="v">{role}</div></div>
          <div class="m"><div class="l">url</div>   <div class="v">{host}</div></div>
        </dl>

        <h4>Overview</h4>                       // 11px accent uppercase 0.14em, NO `// ` prefix
        <div class="readme" dangerouslySetInnerHTML={overviewHtml} />

        <h4>Stack</h4>
        <div class="readme"><ul class="flex flex-wrap gap-1.5">{stack.map(...)}</ul></div>
      </div>
    </div>

    <footer class="mf">    // bg-profile-bg-3, border-t, padding 12px 16px
      <span>press ← → to navigate projects</span>
      <div class="actions">
        <button>← prev</button>
        <button>next →</button>
        <a class="primary" href={site}>Open live ↗</a>
      </div>
    </footer>
  </Dialog.Content>
</Dialog.Root>
```

### 2.2 스타일 스펙

- **Dialog.Content**: `w-[min(960px,100%)] max-h-[calc(100vh-80px)] rounded-xl border border-profile-line-2 bg-profile-bg-2 overflow-hidden grid grid-rows-[auto_1fr_auto]`.
- **`.mh` 헤더**: `flex items-center gap-[14px] px-4 py-3 bg-profile-bg-3 border-b border-profile-line text-xs text-profile-muted`.
  - dots: 11x11 원 3개 (#ff5f57 / #febc2e / #28c840).
  - path: `flex-1 text-profile-fg-2` + `<b class="text-profile-accent">{slug}</b>`.
  - close 버튼: `text-profile-muted hover:text-profile-fg hover:bg-profile-line px-1.5 py-0.5 rounded`.
- **`.hero-img`**: `aspect-[16/9] w-full border-b border-profile-line bg-profile-bg-3`, `next/image` `fill unoptimized object-cover`. **border-radius 없음**.
- **`.mcontent`**: `px-8 py-6` (≈26/32). 내부 공간 자동 간격.
- **`h3` (title)**: `font-display text-[32px] font-medium leading-tight tracking-[-0.02em] text-profile-fg mb-1.5`.
- **`p.dek`**: `font-sans text-[15px] leading-[1.6] text-profile-fg-2 max-w-[60ch] mb-[22px]`.
- **`.meta-grid`**: `grid grid-cols-4 border border-profile-line rounded-lg py-4 my-[18px]`.
  - cell `.m`: `px-4 border-r border-profile-line last:border-r-0`.
  - `.l`: `text-[10px] uppercase tracking-[0.1em] text-profile-muted mb-1`.
  - `.v`: `text-[13.5px] text-profile-fg`.
- **`h4`**: `text-[11px] font-medium uppercase tracking-[0.14em] text-profile-accent mt-5 mb-2`. **프리픽스 `// ` 없음**.
- **`.readme`**: `font-sans text-[14px] leading-[1.7] text-profile-fg-2 max-w-[72ch]`.
  - 자식 요소 스타일(prose 유사):
    - `p { margin: 0 0 8px }`
    - `ul { padding-left: 20px; margin: 8px 0; list-style: disc }`
    - `li { margin-bottom: 4px }`
    - `b, strong { color: var(--profile-fg); font-weight: 500 }`
    - `code { font-family: mono; font-size: 12.5px; background: var(--profile-bg-3); padding: 1px 5px; border-radius: 3px; color: var(--profile-accent) }`
- **Stack tag**: `px-2 py-[3px] border border-profile-line-2 rounded-[3px] font-mono text-[11px] text-profile-fg-2`.
- **`.mf` 푸터**: `flex justify-between items-center px-4 py-3 bg-profile-bg-3 border-t border-profile-line text-[11px] text-profile-muted`.
  - 좌측 안내: `press <kbd>←</kbd> <kbd>→</kbd> to navigate projects` (mono 11px).
  - 우측 actions: `flex gap-2`.
  - 일반 버튼: `px-3 py-[7px] rounded-md border border-profile-line-2 font-mono text-[12px] text-profile-fg hover:bg-profile-accent-soft hover:border-profile-accent hover:text-profile-accent`.
  - primary 버튼: `bg-profile-accent border-profile-accent text-profile-accent-ink hover:brightness-110`.

### 2.3 키보드

- `Esc` → close (Radix Dialog 기본).
- `ArrowLeft` → prev.
- `ArrowRight` → next.
- **`j`, `k` 핸들러 제거** (카드 그리드 전용).

### 2.4 접근성

- `aria-describedby`: dek가 있으면 dek id, 없으면 생략.
- `Dialog.Title`는 h3로 래핑.
- 버튼에 `aria-label`, `aria-keyshortcuts` 유지.

---

## 3. ProjectGrid — 키보드 네비게이션

### 3.1 상태

```tsx
const [focusIdx, setFocusIdx] = useState(0)
```

### 3.2 동작

- 전역 `keydown` 리스너 부착(모달 열려있지 않을 때만).
  - `j` / `ArrowDown` → `setFocusIdx((i) => Math.min(items.length - 1, i + 1))`.
  - `k` / `ArrowUp` → `setFocusIdx((i) => Math.max(0, i - 1))`.
  - `Enter` → `window.dispatchEvent(new CustomEvent('profile:open-project', { detail: items[focusIdx].slug }))`.
- 포커스된 카드는 `scrollIntoView({ block: 'nearest', behavior: 'smooth' })`.
- 카드에 `focused` prop 전달 → `ProjectCardV2`에서 `.focused` 스타일 토글.
- 마우스 hover 시 `onMouseEnter`로 `setFocusIdx` 업데이트.

### 3.3 Props 확장

```tsx
<ProjectCardV2
  item={item}
  variant={...}
  focused={idx === focusIdx}
  onFocus={() => setFocusIdx(idx)}
/>
```

---

## 4. ProjectCardV2 — 소폭 조정

- 새 props: `focused?: boolean`, `onFocus?: () => void`.
- `.focused` 상태에서 `outline: 1px solid var(--profile-accent); outline-offset: -2px`.
- `.kbd (↵ open)`: 기본 `opacity-0`, **`focused` 일 때 `opacity-100`**.
- Featured `h3`: `text-[32px]` 고정 (반응형 다운그레이드 제거).
- `onMouseEnter={onFocus}` 추가.

---

## 5. 데이터 / 스키마

### 5.1 overview 렌더 정책

- **방식**: `overview` 필드를 **Markdown**으로 취급하고 빌드 타임에 HTML로 렌더한 뒤 `PortfolioItem.overviewHtml`에 저장.
- 파서: 이미 설치된 `gray-matter` + **`marked`**(경량) 또는 `remark` + `remark-html` 추가 (미설치 시 `marked` 선택).
- `lib/portfolio.ts`에서 `parse` 후 `overviewHtml: string | undefined` 필드 추가.

### 5.2 Zod 스키마

```ts
overview: z.string().optional(),  // 원문 Markdown/HTML (그대로 유지)
```

`PortfolioItem` 타입에 `overviewHtml?: string` 추가, `getPortfolioItems`에서 build 시 변환.

### 5.3 frontmatter 예시

```yaml
overview: |
  **왜 만들었나.** 글이 쌓일수록 검색이 안 되는 블로그를 고치고 싶었습니다.

  - 문서 청킹 + 임베딩 + 메타데이터 필터링
  - 하이브리드 검색(BM25 + KNN) → cross-encoder 리랭커
  - 스트리밍 응답, 토큰 제한 가드

  **배운 것.** 좋은 청킹이 절반. RAG는 튜닝의 반복이고, 평가가 곧 제품입니다.
```

### 5.4 meta-grid 필드 보강

- 기존 누락 가능 필드 채움: `status`, `year`, `role`, `site`는 모두 보여지므로 모든 `index.md`에서 채워져 있는지 확인.
- 5개 포트폴리오(`ai-chatbot`, `inspire-me`, `investment-blog`, `it-blog`, `status`) 전수 검사.

---

## 6. 제거 대상 (현재 구현에서 삭제)

- `// project.detail #04` 섹션 헤더 전체 블록.
- `frank@seoul:~/projects/{slug}` 경로 문자열 → `~/projects/{slug}` 로 단순화.
- `// {slug}.ext;` 코드 라인 한 줄.
- `// overview`, `// stack` h3 서브 헤더의 `// ` 프리픽스.
- Overview의 `border-l-2 pl-4 whitespace-pre-line` 인용 블록 장식.
- Modal 내부 `j` / `k` 키보드 핸들러.

---

## 7. 수용 기준 매핑

| 수용 기준 | 관련 작업 |
|---|---|
| 모달 960px, 헤더 한 줄 | §2.1, §2.2 |
| Hero flush + border-b only | §2.2 `.hero-img` |
| Meta 4-cell 박스 | §2.2 `.meta-grid` |
| Overview HTML 렌더 | §5.1, §5.2 |
| Primary `Open live ↗` | §2.2 `.mf .primary` |
| 모달 ←/→/Esc 만 동작 | §2.3 |
| 카드 j/k/Enter 동작 + ↵ open 표시 | §3, §4 |
| `// project.detail` / `frank@seoul:` 등 제거 | §6 |

---

## 8. 테스트 전략

### 8.1 단위/정적 검증

- `npm run check` — 타입 검사 통과.
- `npm run lint` — ESLint 통과.
- `npm run build` — 정적 export 성공 + overview HTML이 `out/` 에 반영됨.

### 8.2 E2E — MCP Playwright

홈(`localhost:3000`)에서 실행:

1. **카드 키보드 네비**
   - 페이지 로드 후 `j` 연타 → 각 카드에 순차적으로 `.focused`가 붙고 `↵ open` kbd가 노출.
   - `k` → 역방향.
   - `Enter` → 모달이 열림(Radix `role="dialog"` 감지).
2. **모달 레이아웃**
   - Dialog 너비가 뷰포트 기준 960px 이하(min 적용됨)인지 확인.
   - `img[alt={title}]`이 모달 최상단에 flush로 렌더(modal content padding 바깥).
   - 4-cell meta-grid(`dl > div.m`)가 정확히 4개.
   - Overview `<ul>` / `<strong>` 등 HTML 요소가 실제로 렌더.
   - `button: has-text('Open live ↗')`의 배경색이 accent 값.
3. **모달 키보드**
   - `ArrowRight` → 다음 항목 데이터 반영(타이틀 바뀜).
   - `ArrowLeft` → 이전 항목.
   - `Escape` → 닫힘.
   - `j`/`k`를 눌러도 프로젝트 전환이 **일어나지 않아야** 함.
4. **제거 대상 회귀 방지**
   - `text=// project.detail` 존재하지 않음.
   - `text=frank@seoul` 존재하지 않음.
   - `text=// overview`, `text=// stack` 존재하지 않음.

### 8.3 시각 검증

MCP Playwright `take_screenshot` 으로 모달 스크린샷 2장(일반/Featured 각각) 캡처해 `Profile v2.html` 과 육안 비교.

---

## 9. 구현 순서(권장)

1. **스키마/데이터** 먼저: `lib/portfolio.ts`에 Markdown → HTML 변환, 기존 5개 `index.md` 검증.
2. **ProjectModal** 리팩토링 (가장 큰 작업).
3. **ProjectGrid** 키보드 상태 추가 + **ProjectCardV2** props 연결.
4. 타입/빌드/린트 회귀 확인.
5. MCP Playwright E2E 시나리오 작성 및 실행.
6. 스크린샷 대조.
