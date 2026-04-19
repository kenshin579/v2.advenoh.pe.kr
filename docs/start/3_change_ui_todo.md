# Profile UI v2 — UI 조정 Todo 체크리스트

> 요구사항: `3_change_ui_prd.md`
> 구현 가이드: `3_change_ui_implementation.md`

## Phase 1. 콘텐츠 frontmatter 재정비

- [x] `contents/website/inspire-me/index.md` — `featured: true` 추가, `order: 1`
- [x] `contents/website/ai-chatbot/index.md` — `featured: true` 제거, `order: 2`
- [x] `contents/website/it-blog/index.md` — `order: 3` (기존 유지)
- [x] `contents/website/investment-blog/index.md` — `order: 4`
- [x] `contents/website/status/index.md` — `order: 5`
- [x] `npm run check` 통과
- [ ] `npm run build` 최종 검증은 Phase 8에서

## Phase 2. ProfileShell — QuoteBlock 재배치

- [x] `#writing-investment` 래핑 `<section>` 내부의 `QuoteBlock` 제거
- [x] `Hero` 렌더 직후, `ProjectGrid` 직전에 `<QuoteBlock quotes={quotes} />` 삽입
- [x] `#writing-investment` id는 `WritingList` 컴포넌트 자체에 부여 (scrollSpy 연동 유지)
- [x] `useScrollSpy(SPY_SECTIONS)` dep 그대로 (id 변경 없음)

## Phase 3. Hero — headline + KV 확장

### 3.1 headline
- [x] `contents/profile/readme.md` frontmatter에 `headline: Software Engineer` 추가
- [x] `lib/profile-readme.ts`의 `ReadmeData`에 `headline?: string` 추가 + `loadReadme()` 파싱
- [x] `Hero.tsx`에서 body 앞에 `<strong>{headline}</strong> — ` 렌더
- [x] fallback: `siteConfig.author.jobTitle`
- [x] 스타일: `font-semibold text-profile-fg` + em dash `text-profile-muted-2`

### 3.2 KV list 업데이트

- [x] `contents/profile/readme.md` — `focus: Distributed systems, Backend, DevOps`로 변경
- [x] `contents/profile/readme.md` — `based: Seoul, South Korea · open to remote`로 변경

### 3.3 기술 스택 4 카테고리 분리

- [x] `contents/profile/readme.md`에 배열 필드 추가 (stack/db/cloud/cicd)
- [x] `lib/profile-readme.ts`의 `ReadmeData`에 `stack/db/cloud/cicd: string[]` 추가 + `parseArray` 헬퍼
- [x] `Hero.tsx`의 `kvs` 배열 8행 확장 (값 없는 row는 렌더 skip)
- [x] Hero/ProfileShell에서 `stack` prop 제거 — readme를 직접 소스로 사용

### 3.4 Skills loader 제거 (cleanup)

- [x] `lib/skills.ts` 삭제 (git rm)
- [x] `.cache/skills.json` 삭제 (git rm)
- [x] `scripts/warm-cache.ts`에서 skills 엔트리 제거
- [x] `app/page.tsx`에서 `getSkills()` / `pickHeroStack()` import·호출 제거
- [x] `ProfileShell.tsx` / `Hero.tsx`에서 `stack: string[]` prop 제거
- [x] `npm run build` 통과, 빌드 로그에서 `[cache:WARN] skills ...` 사라짐

## Phase 4. Sidebar — Links 블록 재구성

- [x] `SOCIAL_LINKS` 배열 정의 (github/linkedin/instagram + label + aria)
- [x] 기존 4개 `<li>` (github / status / blog / investment) 제거
- [x] `SOCIAL_LINKS.map()`으로 li 렌더, `↗ ` prefix + mono 폰트
- [x] 각 링크에 `aria-label` 부여
- [x] hover 시 `text-profile-accent`, `focus-visible` outline 유지

## Phase 5. ProjectGrid — 6-col + sec-head

- [x] 기존 2-col grid → `grid grid-cols-1 md:grid-cols-6 gap-[10px]`
- [x] featured 카드 wrapper `md:col-span-6`, 일반 카드 wrapper `md:col-span-3`
- [x] 섹션 헤더 `sec-head` 구조 재작성 (h2 + #02 + bar + cnt with kbd)

## Phase 6. ProjectCardV2 — 원본 스타일 재작성

### 공통
- [ ] 루트 `<article>`에 `relative` + 기존 role/tabIndex/data 속성 유지
- [ ] hover: `border-profile-accent` + accent-soft → bg-2 그라데이션
- [ ] focus-visible: `outline: 1px solid accent; outline-offset: -2px`
- [ ] 카드 내부 레이아웃 `flex flex-col gap-[10px]`
- [ ] `.kbd` 우상단 절대 배치 + 포커스/hover 시 opacity 1

### 일반 카드
- [ ] name `font-mono text-sm font-medium`에 `before:content-['▸_']` prefix (muted)
- [ ] ext는 `<span>`으로 accent 색
- [ ] status 6×6 원형 + glow box-shadow(`var(--profile-green)`)
- [ ] preview 고정 `h-[120px]` + `rounded-md` + `border-profile-line`
- [ ] preview hover `scale-[1.02]` transition 400ms
- [ ] desc `font-sans text-[13px] leading-[1.55] text-profile-fg-2`
- [ ] stack chips `px-[7px] py-0.5 rounded-sm border-profile-line-2 text-[10px]`
- [ ] meta-bot `border-t border-dashed border-profile-line text-[10px] text-profile-muted`
- [ ] footer 좌측에 `→ {host}`, 우측에 `{year} · {role}`

### Featured variant
- [ ] 컨테이너 `md:grid md:grid-cols-[1.2fr_1fr] md:gap-[22px] md:p-[22px]`
- [ ] 좌측 영역: row + desc + stack + meta-bot (`md:col-start-1`)
- [ ] 우측 영역: preview 풀 높이 (`md:col-start-2 md:row-start-1 md:row-end-[span_4] min-h-[240px]`)
- [ ] name `font-display text-[32px] font-medium tracking-[-0.02em]` + `before:content-['★_'] before:text-profile-accent`
- [ ] desc `text-[15px] leading-[1.6] max-w-[48ch]`
- [ ] 우상단 `featured-tag` 배지: `bg-profile-accent text-profile-accent-ink uppercase tracking-[0.14em] text-[10px] px-2.5 py-1 rounded`
- [ ] 모바일(sm): 1-col + preview 상단 배치

## Phase 7. globals.css 보강 (선택)

- [ ] `.project-card .kbd` opacity transition 스타일 추가 (Tailwind arbitrary로 대체 가능 시 skip)
- [ ] `.project-card .status-dot` glow box-shadow 추가 (또는 inline style)

## Phase 8. 테스트

### 빌드 검증
- [ ] `npm run check` 타입 통과
- [ ] `npm run build` 정적 export 성공
- [ ] 콘솔에 sort 순서 또는 렌더 에러 없음 확인

### 수동 QA
- [ ] 1440 / 1100 / 768 / 375 뷰포트 확인
  - [ ] md 이상에서 featured(inspire-me) 풀 너비 + 1.2fr/1fr, 나머지 4개는 2×2
  - [ ] sm 이하 단일 컬럼, featured도 세로 배치 (preview 상단)
- [ ] Hero 직후에 QuoteBlock 렌더, `↻ rotate` 버튼 + 12초 자동 순환 동작 확인
- [ ] 포커스 상태에서 `↵ open` 뱃지 opacity 1
- [ ] hover 시 accent-soft 그라데이션 + preview scale(1.02)
- [ ] Sidebar Links 3개 클릭 → 각 SNS 새 탭 이동

### MCP Playwright
- [ ] 홈(`/`) 로드 후 섹션 순서: `#readme` → QuoteBlock → `#projects` → `#writing` → `#writing-investment`
- [ ] Hero body 문단 앞에 굵은 `Software Engineer` + `—` 구분자 렌더 확인
- [ ] KV list 8행 렌더 확인: role / focus / stack / db / cloud / ci/cd / based / xp 순서
- [ ] `focus`에 `Distributed systems, Backend, DevOps` 출력 확인
- [ ] `based`에 `· open to remote` 포함 확인
- [ ] `stack`에 `Claude` 포함 확인
- [ ] `db` 행에 `MySQL · Redis · Kafka · Memcached` 출력
- [ ] `cloud` 행에 `Kubernetes · Docker · Helm` 출력
- [ ] `ci/cd` 행에 `GitHub Actions · ArgoCD · Jenkins` 출력
- [ ] `#projects`의 첫 카드가 `inspire-me`이며 featured 레이아웃 적용 확인
- [ ] 첫 카드 name 앞에 `★` prefix 렌더링 확인
- [ ] 일반 카드 name 앞에 `▸` prefix 렌더링 확인
- [ ] `j` 3회 연속 → 포커스 카드 인덱스 이동, 각 포커스 카드 우상단 `↵ open` visible
- [ ] `Enter`로 모달 오픈 → `←/→`로 prev/next → `Esc` 닫기
- [ ] Sidebar `instagram/frank.photosnap` 링크에 `href` + `target=_blank` 확인
- [ ] Sidebar Links에 `status/blog/investment` 가 **없는지** 확인
- [ ] 1100px: RightRail 숨김, featured는 여전히 2-col 내부 유지
- [ ] 768px: Sidebar 숨김, featured 단일 컬럼(preview 상단)
- [ ] 375px: 모든 카드 단일 컬럼 스택

## Phase 9. 배포

- [ ] 커밋 분할 (Phase 1~5 단위)
- [ ] feature 브랜치 push
- [ ] PR 생성 (base: main, assignee: kenshin579, HEREDOC body)
- [ ] Netlify Deploy Preview URL에서 수동 QA 재확인
- [ ] 머지 후 production 배포 자동 수행
