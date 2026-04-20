# Profile UI v2 — 스타일 미세 정정 Todo 체크리스트

> 요구사항: `3_ui_fixed_prd.md`
> 구현 가이드: `3_ui_fixed_implementation.md`

## Phase 1. TypewriterPrompt — prompt 색 반전

- [x] 컨테이너 class 교체: `text-[12.5px] tracking-[0.02em] text-profile-accent`
- [x] `frank@seoul` 부분을 `<strong className="font-medium text-profile-fg">` 로 감싸기
- [x] typed `text-profile-fg` 클래스 제거 (부모 accent 상속)
- [x] `prompt` prop 제거, `USERNAME` / `PATH_SUFFIX` 내부 상수화
- [x] caret bar accent 그대로 유지

## Phase 2. Hero title `// frank oh;`

- [x] h1 class: `font-medium` + `leading-[0.9]` + `tracking-[-0.035em]`
- [x] `//` → `text-profile-muted`, `oh`는 `<span className="text-profile-accent">`, `;`은 muted-2 유지

## Phase 3. Hero KV list 포맷

- [x] `<dl>` — `grid-cols-[120px_1fr]` + `gap-x-5 gap-y-[7px]` + `text-[13px]` + `mt-7 mb-3`
- [x] `<dt>` — `text-profile-muted lowercase tracking-[0.02em] before:content-['·_']`
- [x] `<dd>` — `text-profile-fg`

## Phase 4. inspire-me ext 정정

- [x] `contents/website/inspire-me/index.md` — `ext: .go`

## Phase 5. 섹션 헤더 `// ` accent prefix

### 5.1 ProjectGrid
- [x] header class: `mb-[18px] flex items-baseline gap-3`
- [x] h2: `font-mono font-medium text-[12px] uppercase tracking-[0.14em] text-profile-muted` + `before:content-['//_'] before:text-profile-accent`
- [x] hash `text-profile-muted-2`, bar `border-profile-line` (line-2 아님), cnt muted

### 5.2 WritingList
- [x] `WritingListProps`에 `hash?: string` 추가
- [x] 섹션 `<header>` 구조 재작성 (ProjectGrid와 동일 패턴)

### 5.3 ProfileShell
- [x] writing.it `hash="#03"`, writing.inv `hash="#04"`

## Phase 6. 빌드 검증

- [x] `npm run check` 타입 통과
- [x] `npm run build` 정적 export 성공
- [x] 콘솔 렌더 에러·경고 없음

## Phase 7. 수동 QA (Deploy Preview)

- [ ] Hero prompt 전체가 accent 색, `frank@seoul` 부분만 fg 굵게 렌더
- [ ] Hero title 폰트 굵기 medium, `//` muted + `oh` accent + `;` muted-2
- [ ] Hero KV 8행 모두 `· ` prefix + key 컬럼 120px 고정
- [ ] Projects 헤더에 `// PROJECTS` accent prefix + `#02`
- [ ] Projects의 `inspire-me` 카드 name이 `inspire-me.go`로 렌더
- [ ] Writing IT 헤더에 `// WRITING.IT` + `#03`
- [ ] Writing INV 헤더에 `// WRITING.INV` + `#04`
- [ ] 1440 / 1100 / 768 / 375 반응형 확인 (KV 120px 컬럼은 좁은 뷰포트에서 줄바꿈 허용)

## Phase 8. MCP Playwright

- [ ] Hero `TypewriterPrompt` 내 `<strong>` 요소의 텍스트가 `frank@seoul`
- [ ] Hero h1에서 `oh` span의 computed color가 `--profile-accent` 값과 일치
- [ ] Hero `<dt>` 첫 요소의 `::before` content = `· ` (spaced)
- [ ] 3개 섹션 h2의 `::before` content = `// `
- [ ] Projects 섹션 hash 텍스트 `#02`, Writing IT `#03`, Writing INV `#04`

## Phase 9. 배포

- [ ] 커밋 단위 분할 (Phase 1~4)
- [ ] feature 브랜치 push
- [ ] PR 생성 (base: main, assignee: kenshin579, HEREDOC body)
- [ ] Netlify Deploy Preview에서 수동 QA 재확인
- [ ] 머지 후 production 배포 자동
