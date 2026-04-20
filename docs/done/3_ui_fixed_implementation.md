# Profile UI v2 — 스타일 미세 정정 구현 문서

> 요구사항: `docs/done/3_ui_fixed_prd.md`
> 체크리스트: `docs/done/3_ui_fixed_todo.md`

## 1. 범위

원본 `Profile v2.html`의 네 가지 스타일 규칙에 맞춰 class 매핑만 재조정. 구조·props·로직 변경 없음.

## 2. 파일 변경

| 파일 | 수정 내용 |
|---|---|
| `components/profile/TypewriterPrompt.tsx` | prompt 색 재매핑(accent 기본 + `frank@seoul` fg bold), 12.5px, letter-spacing 0.02em |
| `components/profile/Hero.tsx` | hero-title 색 재매핑(// muted / oh accent / ; muted-2), medium weight, leading 0.9 + tracking -0.035em. KV list 120px/1fr + gap 7/20 + 13px + `· ` prefix + muted key / fg value |
| `components/profile/ProjectGrid.tsx` | 섹션 헤더 `// ` accent prefix + sec-head CSS 정확 매핑 |
| `components/profile/WritingList.tsx` | 섹션 헤더 `// ` accent prefix, `hash?: string` prop 추가 |
| `components/profile/ProfileShell.tsx` | WritingList에 `hash="#03"` / `#04` 전달 |

## 3. 구현 상세

### 3.1 TypewriterPrompt

원본 해석:
- 전체 `text-profile-accent`
- `<b>frank@seoul</b>`만 fg + medium
- typed 명령어는 accent 상속
- font-size 12.5px, letter-spacing 0.02em

```tsx
// 기존 prop: prompt = 'frank@seoul:~/profile (main)$ '
// 문자열로 분리해서 frank@seoul만 <strong>로 감싸기

const USERNAME = 'frank@seoul'
const PATH_SUFFIX = ':~/profile (main)$ '

<div className="font-mono text-[12.5px] tracking-[0.02em] text-profile-accent">
  <strong className="font-medium text-profile-fg">{USERNAME}</strong>
  <span>{PATH_SUFFIX}</span>
  <span>{current.slice(0, charIdx)}</span>
  <span
    aria-hidden="true"
    className="ml-px inline-block h-4 w-2 translate-y-0.5 bg-profile-accent"
    style={{ animation: 'profile-caret-blink 1.1s step-end infinite' }}
  />
</div>
```

- `prompt` prop을 `username` / `path` 두 prop으로 분리하거나 내부 상수로 하드코딩 (기본값만 사용되므로 후자 권장)
- typed 영역도 accent 유지(기본 부모 color 상속), 별도 `text-profile-fg` 클래스 제거

### 3.2 Hero title

```tsx
<h1 className="font-display font-medium leading-[0.9] tracking-[-0.035em] text-profile-fg text-5xl sm:text-7xl md:text-8xl">
  <span className="text-profile-muted">//</span>
  {' '}
  frank
  {' '}
  <span className="text-profile-accent">oh</span>
  <span className="text-profile-muted-2">;</span>
</h1>
```

- 기존 `font-bold` → `font-medium`
- `//` muted, `oh` accent, `;` muted-2

### 3.3 Hero KV list

```tsx
<dl className="my-7 mb-3 grid grid-cols-[120px_1fr] gap-x-5 gap-y-[7px] font-mono text-[13px]">
  {kvs.map(([k, v]) => (
    v ? (
      <div key={k} className="contents">
        <dt className="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">
          {k}
        </dt>
        <dd className="text-profile-fg">{v}</dd>
      </div>
    ) : null
  ))}
</dl>
```

핵심 차이:
- `grid-cols-[120px_1fr]` (fixed 120px)
- `gap-x-5 gap-y-[7px]` (20px col / 7px row)
- `text-[13px]`
- `dt`: muted, lowercase, letter-spacing 0.02em, `· ` prefix
- `dd`: fg (fg-2 아님)

### 3.4 inspire-me 프로젝트 ext 정정

`contents/website/inspire-me/index.md` frontmatter:

```yaml
# before
ext: .ts

# after
ext: .go
```

원본 `Profile v2.html` L640의 `.name`에 `.go`로 표시됨. `inspire-me`의 원본 기술 스택(Astro · i18n · Cloudflare Pages)은 현 readme 내용과 다르지만 ext만 원본 표기대로 정정.

### 3.5 섹션 헤더 `sec-head`

공통 JSX 패턴:

```tsx
<header className="mb-[18px] flex items-baseline gap-3">
  <h2 className="font-mono font-medium text-[12px] uppercase tracking-[0.14em] text-profile-muted m-0 before:content-['//_'] before:text-profile-accent">
    {title}
  </h2>
  <span className="font-mono text-[11px] text-profile-muted-2">{hash}</span>
  <div className="flex-1 border-t border-profile-line" aria-hidden="true" />
  <span className="font-mono text-[11px] text-profile-muted">{cnt}</span>
</header>
```

- `::before content "// "` color accent
- h2 color muted, letter-spacing 0.14em
- hash color **muted-2**
- bar는 `border-profile-line` (line-2 아님)
- cnt color muted

#### ProjectGrid.tsx

```tsx
<h2 ... >projects</h2>
<span>#02</span>
<div className="flex-1 border-t border-profile-line" />
<span>
  ls ./projects · {items.length} items ·
  <kbd>j</kbd> <kbd>k</kbd> to navigate
</span>
```

#### WritingList.tsx

`hash` prop 추가:
```tsx
type WritingListProps = {
  id: string
  title: string
  hash?: string  // 신규
  items: WritingItem[]
}
```

헤더에 반영:
```tsx
<header className="mb-[18px] flex items-baseline gap-3">
  <h2 className="... before:content-['//_'] before:text-profile-accent">
    {title}
  </h2>
  {hash && <span className="font-mono text-[11px] text-profile-muted-2">{hash}</span>}
  <div className="flex-1 border-t border-profile-line" />
  <span className="font-mono text-[11px] text-profile-muted">
    {items.length} / recent
  </span>
</header>
```

#### ProfileShell.tsx

```tsx
<WritingList id="writing" title="writing.it" hash="#03" items={writing.it} />
<WritingList id="writing-investment" title="writing.inv" hash="#04" items={writing.investment} />
```

## 4. 접근성 (유지)

- h2 `::before`는 의미론적 prefix가 아니라 장식이므로 별도 aria 불필요 (정적 content)
- TypewriterPrompt의 `<strong>`은 의미론적 강조 역할로 적절
- `<kbd>`, 포커스/키보드 단축키 정책 모두 PR #28의 것 유지

## 5. 테스트

### 빌드
- `npm run check`, `npm run build` 통과

### 수동 QA
- Hero prompt 색 반전 확인 (기본 accent, `frank@seoul`만 fg bold)
- Hero title `//` muted · `oh` accent · `;` muted-2, 굵기 medium
- Hero KV row 8개, 첫 문자 `· role` 시작, 120px 고정 컬럼
- Projects / Writing IT / Writing INV 3개 섹션 헤더에 `// ` accent prefix 렌더

### MCP Playwright
- `TypewriterPrompt` strong 요소의 text가 `frank@seoul`
- Hero title `span.text-profile-accent` 텍스트가 `oh`
- Hero `<dt>` 요소의 computed `::before` content가 `"· "`
- 3개 섹션의 h2에서 `::before` content가 `"// "` 확인
- Projects 섹션의 hash 텍스트가 `#02`, Writing.it은 `#03`, Writing.inv는 `#04`
