# Profile UI v2 — UI 조정 구현 문서

> 요구사항: `docs/start/3_change_ui_prd.md`
> 체크리스트: `docs/start/3_change_ui_todo.md`

## 1. 개요

PR #26 Profile UI v2 첫 구현 이후 3가지 UI 조정 + 1가지 콘텐츠 정정.

1. `QuoteBlock` 위치: `#writing-investment` 하단 → `#readme` 다음(`#projects` 위)
2. Projects 섹션: `Profile v2.html` 원본 스타일 (6-col, featured variant, `▸`/`★` prefix, 포커스 `↵ open` 뱃지)
3. Featured 프로젝트: `ai-chatbot` → **`inspire-me`** (원본 내러티브 따름)
4. Sidebar Links: `status/blog/investment` 제거, SNS 3개(`github/kenshin579`, `linkedin/frank-oh`, `instagram/frank.photosnap`) 원본 포맷

## 2. 파일 변경

### 수정
- `components/profile/ProfileShell.tsx`
- `components/profile/ProjectGrid.tsx`
- `components/profile/ProjectCardV2.tsx`
- `components/profile/Sidebar.tsx`
- `contents/website/*/index.md` (5개 프로젝트 frontmatter)
- `app/globals.css` (필요 시 prefix/kbd opacity transition 유틸)

### 신규 / 삭제
- 없음

## 3. 구현 상세

### 3.1 ProfileShell — QuoteBlock 재배치

변경 전:
```tsx
<Hero />
<ProjectGrid />
<WritingList id="writing" />
<section id="writing-investment">
  <WritingList id="writing-investment-list" />
  <QuoteBlock quotes={quotes} />
</section>
```

변경 후:
```tsx
<Hero />
<QuoteBlock quotes={quotes} />
<ProjectGrid />
<WritingList id="writing" />
<WritingList id="writing-investment" title="writing.inv" items={writing.investment} />
```

- `#writing-investment` 래핑 `<section>` 제거 — `WritingList` 자체 `id`로 scrollSpy 연동 유지
- `QuoteBlock` props/훅 내부 구현은 그대로 (12s auto rotate + 수동 `↻ rotate`)

### 3.2 콘텐츠 frontmatter 재정비

| 파일 | 변경 |
|---|---|
| `contents/website/inspire-me/index.md` | `featured: true` 추가, `order: 1` |
| `contents/website/ai-chatbot/index.md` | `featured: true` **제거** (필드 삭제), `order: 2` |
| `contents/website/it-blog/index.md` | `order: 3` |
| `contents/website/investment-blog/index.md` | `order: 4` |
| `contents/website/status/index.md` | `order: 5` |

`lib/portfolio.ts` 정렬 로직(`order → slug`)과 schema는 그대로 재사용.

### 3.3 ProjectGrid — 6-col grid + 섹션 헤더

#### 섹션 헤더 (`sec-head` 구조)

```tsx
<header className="sec-head">
  <h2 className="font-mono ...">projects</h2>
  <span className="hash">#02</span>
  <div className="bar flex-1 border-t border-profile-line-2" />
  <span className="cnt font-mono text-[11px] text-profile-muted-2">
    ls ./projects · {n} items · <kbd>j</kbd> <kbd>k</kbd> to navigate
  </span>
</header>
```

- `.hash`: `var(--profile-muted-2)`, 작게
- `.bar`: `flex: 1` + 1px border-top (`--profile-line-2`)
- `.cnt`: 터미널 명령 힌트 + kbd 태그

#### Grid

```tsx
<div className="grid grid-cols-1 md:grid-cols-6 gap-[10px]">
  {items.map(item =>
    item.featured
      ? <div key={item.slug} className="md:col-span-6"><ProjectCardV2 item={item} variant="featured" /></div>
      : <div key={item.slug} className="md:col-span-3"><ProjectCardV2 item={item} /></div>
  )}
</div>
```

- `sm 이하`: `grid-cols-1` (모든 카드 풀 너비 세로 스택)
- `md 이상`: `grid-cols-6` — 일반 카드 `col-span-3`, featured `col-span-6`

### 3.4 ProjectCardV2 — 원본 스타일 재작성

#### 공통 (일반/featured)

- `cursor-pointer`, `role="button"`, `tabIndex={0}`, `data-project-card={slug}` (기존 유지)
- `onClick` / `onKeyDown(Enter|Space)` → `profile:open-project` CustomEvent (기존 유지)
- `aria-keyshortcuts="Enter j k"` (기존 유지)
- **Hover 배경**: `bg-[linear-gradient(180deg,var(--profile-accent-soft),var(--profile-bg-2))]` (Tailwind arbitrary value 사용)
- **Focus outline**: `:focus-visible` → `outline: 1px solid var(--profile-accent); outline-offset: -2px`
- **Relative 컨테이너**로 `.kbd` 절대 배치 받음

#### 일반 카드 구조

```tsx
<article className="relative flex flex-col gap-[10px] rounded-[10px] border border-profile-line bg-profile-bg-2 px-[18px] pt-4 pb-[18px] transition hover:border-profile-accent hover:bg-gradient-... focus-visible:outline ...">
  <div className="row flex items-baseline justify-between gap-3">
    <div className="font-mono text-sm text-profile-fg font-medium before:content-['▸_'] before:text-profile-muted before:text-[10px] before:align-top">
      {slug}
      <span className="text-profile-accent">{ext}</span>
    </div>
    <div className="status font-mono text-[10px] uppercase tracking-[0.08em] text-profile-muted flex items-center gap-1.5">
      <i className="h-1.5 w-1.5 rounded-full bg-profile-green shadow-[0_0_4px_var(--profile-green)]" />
      {status}
    </div>
  </div>

  {coverSrc && (
    <div className="preview relative h-[120px] overflow-hidden rounded-md border border-profile-line">
      <Image src={coverSrc} fill alt={title} unoptimized
        className="object-cover transition duration-[400ms] group-hover:scale-[1.02]" />
    </div>
  )}

  <p className="desc font-sans text-[13px] leading-[1.55] text-profile-fg-2">{dek}</p>

  {stack && (
    <ul className="stack flex flex-wrap gap-1.5 font-mono text-[10px] text-profile-muted">
      {stack.map(t => (
        <li key={t} className="rounded-sm border border-profile-line-2 px-[7px] py-0.5">{t}</li>
      ))}
    </ul>
  )}

  <footer className="meta-bot mt-auto flex justify-between pt-2 border-t border-dashed border-profile-line font-mono text-[10px] text-profile-muted">
    <span>→ {displayHost(site)}</span>
    <span>{year} · {role}</span>
  </footer>

  <span className="kbd absolute top-[14px] right-[14px] opacity-0 transition-opacity font-mono text-[10px] text-profile-accent peer-focus:opacity-100 group-focus:opacity-100 focus-within:opacity-100">
    ↵ open
  </span>
</article>
```

- `.name::before`는 Tailwind `before:content-['▸_']` arbitrary로 구현
- `.kbd`의 포커스 시 opacity 1: Tailwind `group` 또는 `focus-within`/`has-[:focus]` 활용
  - 구체적으로: `<article>`에 `group/card` + `focus-within:[&_.kbd]:opacity-100` 같은 조합 또는 CSS 모듈. 실용 선택은 `globals.css`에 커스텀 selector:
    ```css
    .file:focus-visible .kbd, .file:focus-within .kbd, .file:hover .kbd { opacity: 1 }
    ```
  - 또는 Tailwind 방식으로 그대로: `[&:hover_.kbd]:opacity-100 [&:focus-within_.kbd]:opacity-100`

#### Featured variant 구조

```tsx
<article className="relative md:grid md:grid-cols-[1.2fr_1fr] md:gap-[22px] md:p-[22px] md:items-stretch ...">
  {/* 좌측: row + desc + stack + meta-bot */}
  <div className="flex flex-col gap-[10px] md:col-start-1">
    <div className="row flex items-baseline justify-between gap-3">
      <h3 className="font-display text-[32px] font-medium leading-tight tracking-[-0.02em] text-profile-fg before:content-['★_'] before:text-profile-accent">
        {slug}<span className="text-profile-accent">{ext}</span>
      </h3>
      <div className="status ...">● live</div>
    </div>

    <p className="desc text-[15px] leading-[1.6] text-profile-fg-2 max-w-[48ch]">{dek}</p>

    <ul className="stack ...">{stack.map(...)}</ul>

    <footer className="meta-bot ...">...</footer>
  </div>

  {/* 우측: 풀 높이 preview */}
  <div className="md:col-start-2 md:row-start-1 md:row-end-[span_4] relative min-h-[240px] overflow-hidden rounded-lg border border-profile-line">
    <Image src={coverSrc} fill alt={title} unoptimized className="object-cover" />
  </div>

  <span className="featured-tag absolute top-[14px] right-[14px] rounded px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] bg-profile-accent text-profile-accent-ink">
    featured
  </span>

  <span className="kbd ...">↵ open</span>
</article>
```

- 모바일(`< md`): `grid-cols-1` → preview 상단, 본문 하단
- md 이상: 1.2fr/1fr 좌/우 분할, preview 우측 풀 높이
- name 크기 32px, `display` 폰트(Space Grotesk), `★ ` prefix

### 3.5 Hero — headline + KV 확장

원본 `Profile v2.html` L588 구조 따름: `<h1>` 다음 문단에 **굵은 직함** + `—` + 본문. 추가로 KV list를 기술 스택 4 카테고리로 세분화.

#### 콘텐츠 변경 (`contents/profile/readme.md`)

```yaml
---
role: Backend / AI Engineer
focus: Distributed systems, Backend, DevOps
based: Seoul, South Korea · open to remote
xp: 10+ years
headline: Software Engineer
stack:
  - Claude
  - Python
  - Go
  - TypeScript
  - Java
  - Spring Boot
db:
  - MySQL
  - Redis
  - Kafka
  - Memcached
cloud:
  - Kubernetes
  - Docker
  - Helm
cicd:
  - GitHub Actions
  - ArgoCD
  - Jenkins
---

backend·AI 시스템을 설계하고 운영한다. …
```

- `stack`의 언어/프레임워크는 현재 GitHub README shields.io 배지 기반이라, 초안 값을 위에 명시 후 필요에 따라 조정
- 모든 배열 필드는 **없으면 해당 KV row 미표시** (fallback: stack만 `pickHeroStack(skills)`)

#### 타입 (`lib/profile-readme.ts`)

```ts
export type ReadmeData = {
  role?: string
  focus?: string
  based?: string
  xp?: string
  headline?: string
  stack?: string[]
  db?: string[]
  cloud?: string[]
  cicd?: string[]
  body: string
}

function parseArray(v: unknown): string[] | undefined {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string') return v.split(',').map(s => s.trim()).filter(Boolean)
  return undefined
}

export function loadReadme(): ReadmeData {
  // ...
  return {
    role: typeof data.role === 'string' ? data.role : undefined,
    focus: typeof data.focus === 'string' ? data.focus : undefined,
    based: typeof data.based === 'string' ? data.based : undefined,
    xp: typeof data.xp === 'string' ? data.xp : undefined,
    headline: typeof data.headline === 'string' ? data.headline : undefined,
    stack: parseArray(data.stack),
    db: parseArray(data.db),
    cloud: parseArray(data.cloud),
    cicd: parseArray(data.cicd),
    body: content.trim(),
  }
}
```

#### 페이지/쉘 props 조정 (Skills loader 제거)

readme.md가 유일한 소스가 되므로 GitHub README 기반 Skills 파이프라인을 전부 제거한다.

```tsx
// app/page.tsx — before
import { getSkills, pickHeroStack } from '@/lib/skills'
const skills = await getSkills()
const stack = pickHeroStack(skills)
<ProfileShell ... stack={stack} />

// app/page.tsx — after
// import 제거
// readme만 로드해서 ProfileShell에 전달
<ProfileShell ... readme={readme} />
```

- `ProfileShell` props에서 `stack: string[]` 제거
- `Hero` props에서 `stack: string[]` 제거
- `lib/skills.ts` 파일 삭제 (git rm)
- `.cache/skills.json` 삭제
- `scripts/warm-cache.ts`에서 skills 관련 entry 제거

#### 렌더 (`components/profile/Hero.tsx`)

```tsx
import { siteConfig } from '@/lib/site-config'

const headline = readme.headline ?? siteConfig.author.jobTitle

// body 앞 굵은 headline
<p className="max-w-2xl text-sm leading-relaxed text-profile-fg-2 whitespace-pre-line">
  <strong className="font-semibold text-profile-fg">{headline}</strong>
  <span className="text-profile-muted-2"> — </span>
  {readme.body}
</p>

// KV list 8-row — 모두 readme에서 읽음 (값 없는 row는 렌더 skip)
const kvs: Array<[string, string | undefined]> = [
  ['role', readme.role],
  ['focus', readme.focus],
  ['stack', readme.stack?.length ? readme.stack.join(' · ') : undefined],
  ['db', readme.db?.length ? readme.db.join(' · ') : undefined],
  ['cloud', readme.cloud?.length ? readme.cloud.join(' · ') : undefined],
  ['ci/cd', readme.cicd?.length ? readme.cicd.join(' · ') : undefined],
  ['based', readme.based],
  ['xp', readme.xp],
]
```

- Hero에서 `stack: string[]` prop 제거 — readme 하나만 받아 처리
- skills loader에 의존하지 않으므로 빌드 타임 외부 fetch 1건 감소

### 3.6 Sidebar — Links 블록 재구성

```tsx
const SOCIAL_LINKS = [
  { label: 'github/kenshin579', href: siteConfig.author.social.github, aria: 'GitHub profile: kenshin579' },
  { label: 'linkedin/frank-oh', href: siteConfig.author.social.linkedin, aria: 'LinkedIn profile: Frank Oh' },
  { label: 'instagram/frank.photosnap', href: siteConfig.author.social.instagram, aria: 'Instagram: frank.photosnap' },
]

// 기존 4개 li를 제거하고 SOCIAL_LINKS 배열 map으로 교체
<ul className="flex flex-col gap-0.5">
  {SOCIAL_LINKS.map(({ label, href, aria }) => (
    <li key={href}>
      <Link href={href} target="_blank" aria-label={aria}
        className="block rounded px-2 py-1 font-mono text-profile-fg-2 hover:text-profile-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent">
        ↗ {label}
      </Link>
    </li>
  ))}
</ul>
```

- 라벨 mono, prefix `↗ `
- hover accent 색, focus-visible outline
- `aria-label`로 스크린리더 보강

## 4. 스타일 / 토큰

신규 CSS 변수 **없음**. 기존 `--profile-*` 그대로 사용.

커스텀 CSS가 필요한 소수 포인트 (`app/globals.css`에 추가 고려):

```css
/* ProjectCardV2 — 포커스/hover 시 ↵ open 뱃지 노출 */
.project-card .kbd { opacity: 0; transition: opacity .2s }
.project-card:hover .kbd,
.project-card:focus-visible .kbd,
.project-card:focus-within .kbd { opacity: 1 }

/* Featured status indicator glow */
.project-card .status-dot {
  background: var(--profile-green);
  box-shadow: 0 0 4px var(--profile-green);
}
```

또는 위 셀렉터들을 모두 Tailwind arbitrary로 인라인 처리 가능. 가독성과 일관성을 고려해 `globals.css`에 `.project-card` 클래스 한 세트로 정리하는 방식 권장.

## 5. 접근성 (유지)

- `aria-keyshortcuts="Enter j k"` (ProjectCardV2)
- `role="button"` + `tabIndex={0}` (ProjectCardV2)
- `aria-label` (Sidebar Links)
- `:focus-visible` outline 규칙 유지
- Radix Dialog(ProjectModal) 기본 aria 유지

## 6. 마이그레이션 / 호환

- `lib/portfolio.ts`, `PortfolioItem` 타입, 정렬 로직 **변경 없음**
- `useLiveStatus` / `useLiveWriting` / `useKeyboardNav` / `useScrollSpy` **변경 없음**
- `ProjectModal`의 `profile:open-project` 브리지 **변경 없음**
- Command Palette의 Projects 그룹은 자동으로 재정렬된 order 따름 (변경 불필요)

## 7. 테스트 계획

### 빌드
- `npm run check` 타입 통과
- `npm run build` 정적 export 성공, `out/` 산출물 정상

### 수동 QA
- 브레이크포인트: 1440 / 1100 / 768 / 375
  - md 이상: inspire-me featured 풀 너비(1.2fr/1fr), 나머지 4개 2×2
  - sm 이하: 단일 컬럼 스택, featured도 세로 배치
- hover 시 accent-soft 그라데이션 + preview scale(1.02) 확인
- 키보드 j/k 순회 → 포커스된 카드 우상단 `↵ open` 뱃지 opacity 1
- QuoteBlock이 Hero 직후에 렌더되는지 확인
- Sidebar Links 3개(`github/...`, `linkedin/...`, `instagram/...`) 클릭 시 외부 이동

### MCP Playwright 시나리오
- `/` 로드 후 섹션 순서 검증: `#readme` → QuoteBlock → `#projects` → `#writing` → `#writing-investment`
- 프로젝트 카드 포커스 후 `↵ open` 뱃지 visible 확인
- `j`/`k` 키 3회 순회 후 active 카드 변경 확인
- `Enter`로 모달 오픈, `←/→`로 이전/다음 프로젝트 전환
- Sidebar `instagram/frank.photosnap` 링크 클릭 시 `target=_blank`로 새 창 열림
- featured 카드의 name 텍스트 앞에 `★` prefix 렌더링 확인
- 1100px 뷰포트에서 RightRail 숨김 + featured 2-col 유지
- 768px 뷰포트에서 Sidebar 숨김 + featured 단일 컬럼(preview 상단) 확인
