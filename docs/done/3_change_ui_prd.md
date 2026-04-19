# PRD: Profile UI v2 — UI 조정 (명언 위치 + Projects 스타일)

## 개요
Profile UI v2 초기 배포(#25 / PR #26 머지) 이후 피드백을 반영한 소폭 UI 조정.
두 가지 변경을 한 PR로 묶는다.

1. **명언(QuoteBlock) 위치 이동** — 현재 `#writing-investment` 섹션 하단 → Hero 다음, `#projects` 섹션 위
2. **Projects 포맷을 Profile v2.html 원본 스타일로 재정렬** — 6-col grid, featured variant, IDE 파일 리스트 감성(`▸` / `★` prefix, 포커스 시 `↵ open` 뱃지 등)

기준 디자인: `docs/start/Profile/Profile v2.html` (Projects 섹션: CSS L220–257, 마크업 L626–686)

## 배경
- 초기 구현에서 `ProjectGrid`를 2-col grid + shadcn 스타일 카드로 **단순화**했다. 기능은 모두 있지만 원본 디자인의 **파일-매니저 감성**(6-col grid, featured 풀-너비 레이아웃, `▸` / `★` prefix, 포커스 시 `↵ open` 뱃지)이 반영되지 않았다.
- QuoteBlock(명언)이 Investment writing 섹션 뒤(페이지 하단)에 있어, 스크롤 흐름상 "조용한 한 문장"이 상단 히어로 근처에 있는 편이 사이트 톤에 더 맞다.

## 목표
- Projects 섹션의 시각 밀도/위계를 `Profile v2.html` 원본과 일치시킨다.
- Quote를 히어로 직후로 이동해 "한 문장 컨텍스트"를 상단에서 먼저 제공한다.

## 비목표
- QuoteBlock 자체 동작(12s 자동 순환 · 수동 `↻ rotate`) 변경 — 유지
- 외부 데이터 연동 / 캐시 정책 / 키보드 단축키 정책 변경 — 유지
- Writing 섹션 / Sidebar / RightRail / Hero 스타일 변경 — 유지
- 콘텐츠 frontmatter 필드 추가 — 유지 (`status` / `year` / `role` / `stack` / `dek` / `overview` / `featured` / `ext` 등 현재 필드 그대로 사용)

---

## 변경 상세

### 1. QuoteBlock 위치 이동

**현재** (`components/profile/ProfileShell.tsx`):
```
<Hero />
<ProjectGrid />
<WritingList id="writing" />
<section id="writing-investment">
  <WritingList id="writing-investment-list" />
  <QuoteBlock quotes={quotes} />   ← 여기
</section>
```

**변경 후**:
```
<Hero />
<QuoteBlock quotes={quotes} />     ← 이동
<ProjectGrid />
<WritingList id="writing" />
<section id="writing-investment">
  <WritingList id="writing-investment-list" />
</section>
```

- `#writing-investment` 섹션은 `WritingList`만 남긴다 (래핑 `<section>` 제거 가능, `WritingList` 자체 id로 충분).
- QuoteBlock의 props / 내부 구현은 그대로.

### 2. Projects 섹션 — 6-col grid + 원본 스타일

#### 2.1 섹션 헤더 (`sec-head` 구조)

원본:
```html
<div class="sec-head">
  <h2>projects</h2>
  <span class="hash">#02</span>
  <div class="bar"></div>
  <span class="cnt">ls ./projects · N items · [j] [k] to navigate</span>
</div>
```

반영:
- `<h2>` — 섹션 제목 (mono 스타일 유지하되 원본 `h2` 크기감에 맞춤)
- `<span class="hash">#02</span>` — muted-2 컬러, 섹션 번호
- `<div class="bar">` — 1px border-top, `flex: 1`로 남은 공간 채움
- `<span class="cnt">` — 터미널 명령 힌트 `ls ./projects · N items · ⌨ j k to navigate` (kbd 태그 포함)

#### 2.2 Grid — 6-col

- `.files { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px }`
- 일반 카드: `grid-column: span 3` (한 행에 2카드)
- Featured 카드: `grid-column: 1 / -1` (풀 너비)
- 반응형:
  - `≤780px` (모바일): 단일 컬럼(`grid-template-columns: 1fr`), featured도 단일 컬럼으로 축소 + preview 상단 배치

#### 2.3 ProjectCardV2 — 일반 카드

| 요소 | 원본 스타일 |
|---|---|
| 카드 배경 | `var(--profile-bg-2)`, `border: 1px solid var(--profile-line)`, `radius: 10px` |
| 카드 padding | `16px 18px 18px` |
| 카드 레이아웃 | `display: flex; flex-direction: column; gap: 10px` |
| hover | `border-color: var(--profile-accent); background: linear-gradient(180deg, accent-soft, bg-2)` |
| focused (키보드) | `outline: 1px solid accent; outline-offset: -2px` |
| `.row` | name + status, baseline, space-between |
| `.name` | `font-size: 14px; color: fg; font-weight: 500`, **`::before` content: "▸ " muted** |
| `.name .ext` | accent 색 |
| `.status` | 10px uppercase, letter-spacing 0.08em, 6×6 원형 indicator + glow box-shadow |
| `.preview` | 고정 높이 **120px**, `border-radius: 6px`, `background center/cover` |
| `.preview` hover | `transform: scale(1.02)` |
| `.desc` | sans 13px, line-height 1.55, color fg-2 |
| `.stack span` | `2px 7px` padding, `border-radius: 3px`, border `line-2`, 10px |
| `.meta-bot` | 하단, `border-top: 1px dashed line`, justify-between, 10px muted |
| `.kbd` "↵ open" | **절대 배치** 우상단 `top:14px; right:14px`, 포커스 시에만 `opacity: 1` transition |

#### 2.4 ProjectCardV2 — Featured variant

| 요소 | 원본 스타일 |
|---|---|
| 레이아웃 | `grid-column: 1/-1; display: grid; grid-template-columns: 1.2fr 1fr; gap: 22px; padding: 22px; align-items: stretch` |
| preview | 우측 컬럼 (`grid-column: 2`), `grid-row: 1 / span 4`, `min-height: 240px`, 풀 높이 |
| row / desc / stack / meta-bot | 모두 좌측 컬럼 (`grid-column: 1`) |
| `.name` | **32px, display 폰트, weight 500, letter-spacing -0.02em**, `::before` content: **"★ "** accent |
| `.desc` | 15px, line-height 1.6, `max-width: 48ch` |
| 우상단 `.featured-tag` | 절대 배치 `top:14px; right:14px`, `padding: 4px 10px`, `font-size: 10px`, `letter-spacing: 0.14em`, uppercase, `background: accent; color: accent-ink`, `radius: 4px`, 텍스트 `featured` |

### 3. Featured 선정 (확정)

원본 `Profile v2.html` (L637)이 `inspire-me`를 featured로 지정한 내러티브를 따른다.
초기 구현에서 임의로 `ai-chatbot`을 featured로 잡았던 부분을 정정한다.

| 프로젝트 | 역할 | `order` |
|---|---|---|
| `inspire-me` | **featured** (★, 풀 너비, 32px display) | 1 |
| `ai-chatbot` | 일반 카드 | 2 |
| `it-blog` | 일반 카드 | 3 |
| `investment-blog` | 일반 카드 | 4 |
| `status` | 일반 카드 | 5 |

콘텐츠 변경:
- `contents/website/ai-chatbot/index.md` — `featured: true` 제거, `order: 2`
- `contents/website/inspire-me/index.md` — `featured: true` 추가, `order: 1`
- `contents/website/it-blog/index.md` — `order: 3`
- `contents/website/investment-blog/index.md` — `order: 4`
- `contents/website/status/index.md` — `order: 5`

`lib/portfolio.ts`의 `order → slug` 정렬은 그대로 재사용 (로직 변경 없음).

### 4. Sidebar Links 개편

현재 Sidebar의 Links 블록은 `github` + `status/blog/investment`로 섞여 있다. 원본 `Profile v2.html` (L565–569)은 **SNS 3개**만 둔다. 원본 포맷과 철학을 따라 재구성한다.

#### 4.1 구성

| 표시 이름 | 대상 URL | 원본 스타일 근거 |
|---|---|---|
| `github/kenshin579` | `siteConfig.author.social.github` | L567 `↗ github/kenshin579` |
| `linkedin/frank-oh` | `siteConfig.author.social.linkedin` | L568 `↗ linkedin/frank-oh` |
| `instagram/frank.photosnap` | `siteConfig.author.social.instagram` | L569 `↗ instagram/frank.photosnap` |

- `status/blog/investment`는 Sidebar Links에서 **제거**한다 (다른 경로로 이미 접근 가능: Command Palette의 Links 그룹, RightRail의 Latest posts / System, ProjectGrid 카드).

#### 4.2 스타일

- 라벨은 **mono 폰트**(`font-family: var(--mono)`), 소문자 그대로.
- prefix는 **`↗ `** (원본 그대로).
- 컬러: 기본 `var(--profile-fg-2)`, hover 시 `var(--profile-accent)`.
- 링크 간격: 세로 0.125–0.25rem 정도로 타이트하게.
- `aria-label`로 스크린리더 안내 보강 ("GitHub profile: kenshin579" 등).

### 5. Hero headline 추가

원본 `Profile v2.html` (L588)은 `<h1>// frank oh;</h1>` 타이틀 아래 `hero-sub` 문단의 **굵은 직함** + `—` + 본문 순서로 구성한다.

```
// frank oh;
Software Engineer — backend·AI 시스템을 설계하고 운영한다. …
```

현재 `Hero.tsx`는 `readme.body` 한 덩어리만 렌더하므로, **직함을 별도 필드로 분리**한다.

#### 변경

- `contents/profile/readme.md` frontmatter에 `headline` 추가 (초기값: `Software Engineer`)
- `lib/profile-readme.ts`의 `ReadmeData` 타입에 `headline?: string` 추가, `loadReadme()`에서 파싱
- `components/profile/Hero.tsx` — body 문단 앞에 헤드라인 렌더:
  - `headline`이 없으면 `siteConfig.author.jobTitle`로 fallback
  - 렌더 형식: `<strong className="text-profile-fg">{headline}</strong> <span className="text-profile-muted-2"> — </span>{body}`
  - 본문 전체는 기존 `text-profile-fg-2` 톤 유지

### 6. Hero KV list 확장 / 업데이트

기존 KV list(`role / focus / stack / based / xp`)를 **기술 스택 세분화** + 본문 일부 문구 수정으로 재구성.

#### 6.1 필드 업데이트 (문구 변경)

| 필드 | 현재 | 변경 |
|---|---|---|
| `focus` | `Distributed systems · RAG pipelines · DevEx` | **`Distributed systems, Backend, DevOps`** |
| `based` | `Seoul, South Korea` | **`Seoul, South Korea · open to remote`** |

#### 6.2 기술 스택 4개 카테고리로 분리

기존 `stack` 한 줄 → 4개 필드:

| 필드 | 값 |
|---|---|
| `stack` | (기존 Languages/Frameworks) + **`Claude`** 추가 |
| `db` | `MySQL · Redis · Kafka · Memcached` |
| `cloud` | `Kubernetes · Docker · Helm` |
| `cicd` | `GitHub Actions · ArgoCD · Jenkins` |

KV list 렌더 순서 (Hero.tsx):
```
role
focus
stack        ← (+ Claude)
db           ← 신규
cloud        ← 신규
ci/cd        ← 신규 (key 표시는 'ci/cd', frontmatter 필드명은 'cicd')
based        ← "· open to remote" 추가
xp
```

#### 6.3 데이터 소스 — readme.md 단일 소스 (확정)

- Skills 4종(`stack` / `db` / `cloud` / `cicd`)의 **유일한 소스는 `contents/profile/readme.md` frontmatter**
- 기존 GitHub profile README(`kenshin579/kenshin579/README.md`) 자동 추출 경로는 **사용 중단**:
  - `lib/skills.ts` / `getSkills()` / `pickHeroStack()` 호출 제거
  - `.cache/skills.json` 시드 삭제
  - Phase 0 선행의 `skills` 카테고리는 Out-of-scope로 이동
  - 단일 파일 관리 + 빌드 시 외부 fetch 1건 감소
- frontmatter에 값이 없는 필드(예: `db` 미정)는 해당 KV row 미출력

#### 6.4 타입 / 파싱 변경

- `lib/profile-readme.ts`의 `ReadmeData`에 필드 추가:
  ```ts
  stack?: string[]
  db?: string[]
  cloud?: string[]
  cicd?: string[]
  ```
- `loadReadme()`에서 각 필드가 문자열·배열 모두 허용되도록 파싱 (yaml 배열 권장, 쉼표 구분 문자열도 허용)

#### 6.5 Hero.tsx 렌더

```tsx
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

- `Hero`의 `stack: string[]` prop 제거 (readme에서 직접 읽음)
- `ProfileShell` props에서 `stack` 제거 → Hero가 `readme` 하나만 받아 모든 KV 구성

#### 6.6 Skills 연동 정리 (cleanup)

기존 Skills loader를 사용하지 않으므로 다음 파일/상태를 정리:

| 대상 | 조치 |
|---|---|
| `lib/skills.ts` | **삭제** — getSkills/parseSkills/pickHeroStack 모두 미사용 |
| `.cache/skills.json` | 삭제 (git rm) |
| `app/page.tsx` | `getSkills()` / `pickHeroStack()` 호출 제거, `skills` 변수 제거 |
| `components/profile/ProfileShell.tsx` | `stack` prop 제거 |
| `components/profile/Hero.tsx` | `stack` prop 제거, readme에서 직접 |
| `scripts/warm-cache.ts` | skills 관련 loader 제거 |
| `lib/cache.ts` 하드코딩 폴백 테이블 (`docs/done/2_profile_ui_v2_prd.md` 기록) | Skills 행 제거 (문서성 변경은 새 PR에서 생략 가능) |

**주의**: 이후 필요 시 Skills loader를 재도입하려면 git history에서 복원 가능하므로 삭제해도 안전.

### 7. 키보드 / 접근성 (유지)

- `j` / `k` 카드 포커스 이동 — 기존 `useKeyboardNav` 그대로
- `Enter` / `Space` 모달 열기 — 기존 그대로
- `aria-keyshortcuts="Enter j k"` 유지
- `role="button" tabIndex={0}` 유지
- 포커스 시 `↵ open` 뱃지 가시화 (새 스타일)

---

## 파일 변경 목록

### 수정
- `components/profile/ProfileShell.tsx` — QuoteBlock 위치 재배치
- `components/profile/ProjectGrid.tsx` — 6-col grid, 섹션 헤더(`sec-head` 구조) 재작성
- `components/profile/ProjectCardV2.tsx` — prefix(`▸` / `★`), preview 고정 높이, `.kbd` 포커스 뱃지, featured 내부 2-col grid 재작성
- `components/profile/Sidebar.tsx` — Links 블록 SNS 3개(github/linkedin/instagram)로 재구성, 라벨을 `↗ path/handle` mono 포맷으로 변경, status/blog/investment 제거
- `components/profile/Hero.tsx` — body 문단 앞에 `headline` 굵게 + `—` + 본문 렌더, KV list 8행 구성 (`stack` prop 제거)
- `lib/profile-readme.ts` — `ReadmeData`에 `headline?: string`, `stack?: string[]`, `db?: string[]`, `cloud?: string[]`, `cicd?: string[]` 추가 + 파싱
- `contents/profile/readme.md` — frontmatter에 `headline` · `focus` 수정 · `based` 수정 · `stack/db/cloud/cicd` 배열 추가
- `components/profile/ProfileShell.tsx` — `stack` prop 제거, Hero로 readme만 전달
- `app/page.tsx` — `getSkills()` / `pickHeroStack()` 호출 및 `skills`·`stack` 변수 제거

### 삭제
- `lib/skills.ts` — GitHub README fetch 경로 더 이상 사용 안 함
- `.cache/skills.json` — 시드 삭제
- `scripts/warm-cache.ts` — skills 관련 엔트리 제거
- `app/globals.css` — 필요 시 `::before` prefix 전용 유틸 클래스 (또는 Tailwind `before:` arbitrary value) 판단
- `contents/website/ai-chatbot/index.md` — `featured: true` 제거, `order: 2`
- `contents/website/inspire-me/index.md` — `featured: true` 추가, `order: 1`
- `contents/website/it-blog/index.md` — `order: 3`
- `contents/website/investment-blog/index.md` — `order: 4`
- `contents/website/status/index.md` — `order: 5`

### 신규 / 삭제
- 없음 (모두 기존 파일 수정)

---

## 마이그레이션 / 주의사항

- `ProjectCardV2`는 이미 Client 컴포넌트(`'use client'`). 모달 연결(`profile:open-project` CustomEvent), `data-project-card={slug}` 속성은 유지.
- `ProjectGrid`도 이미 Client. 레이아웃 변경만.
- 6-col grid로 변경 시 md(768) 이상에서 기본 2-col(한 행 3+3), sm/모바일은 1-col. Tailwind 기본 breakpoint로 구현:
  - 기본: `grid-cols-1`
  - md: `md:grid-cols-6` (모두 6분할, 일반 카드 `md:col-span-3`, featured `md:col-span-6`)
- hover gradient는 `hover:bg-[linear-gradient(...)]` arbitrary 또는 CSS class로 구현 가능. 간결함 기준 판단.

## 테스트 계획

- **빌드**: `npm run check` + `npm run build` 통과
- **반응형 QA** (1440 / 1100 / 768 / 375):
  - 1440/1100: featured 풀 너비 + 2컬럼 내부 분할, 나머지 4개 카드는 2×2
  - 768: 단일 컬럼, featured preview 상단 배치
  - 375: 모든 카드 단일 컬럼
- **키보드 QA**: `j`/`k` 포커스 이동 → 포커스된 카드 우상단에 `↵ open` 뱃지 노출 확인
- **시각 QA**: hover 시 accent-soft 그라데이션 + preview scale(1.02)
- **QuoteBlock**: Hero 직후에 렌더, 기존 12초 자동 순환·수동 rotate 동작 유지
- **MCP Playwright** (선택): 카드 포커스 후 모달 열기까지 시나리오 통과

## Out-of-scope

- `Profile v2.html`의 다른 섹션(skills 상세 바 차트, gitlog 스타일 등)을 v2 구현에 도입하는 작업 — 별도 티켓
- Featured 선정 로직 변경 — 현재 `featured: true` frontmatter 그대로
- `contents/website/*/index.md`의 `dek` / `stack` 값 리라이팅 — 콘텐츠 편집은 별도

## 관련 문서

- 디자인 원본: `docs/start/Profile/Profile v2.html` (CSS L220–257, 마크업 L626–686)
- 상위 PRD: `docs/done/2_profile_ui_v2_prd.md`
- 관련 구현: `docs/done/2_profile_ui_v2_implementation.md`
- 구현 상세(예정): `docs/done/3_change_ui_implementation.md`
- 작업 체크리스트(예정): `docs/done/3_change_ui_todo.md`
