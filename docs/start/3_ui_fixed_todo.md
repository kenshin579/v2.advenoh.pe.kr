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

- [ ] `components/profile/Hero.tsx` h1 class 변경:
  - [ ] `font-bold` → `font-medium`
  - [ ] `tracking-tight` → `tracking-[-0.035em]`
  - [ ] `leading-[0.95]` → `leading-[0.9]`
- [ ] 내부 span 재매핑:
  - [ ] `//` 감싼 span class `text-profile-accent` → `text-profile-muted`
  - [ ] `oh`를 `<span className="text-profile-accent">oh</span>`로 감싸기
  - [ ] `;` span은 `text-profile-muted-2` 유지
  - [ ] `frank ` 부분은 span 없이 기본 fg 상속

## Phase 3. Hero KV list 포맷

- [ ] `Hero.tsx`의 `<dl>` class 변경:
  - [ ] `grid-cols-[max-content_1fr]` → `grid-cols-[120px_1fr]`
  - [ ] `gap-x-4 gap-y-1` → `gap-x-5 gap-y-[7px]`
  - [ ] `text-xs sm:text-sm` → `text-[13px]`
  - [ ] margin 조정: `my-7 mb-3` 추가 (원본 `margin: 28px 0 12px`)
- [ ] `<dt>` class 변경:
  - [ ] `text-profile-muted-2` → `text-profile-muted`
  - [ ] `lowercase tracking-[0.02em]` 추가
  - [ ] `before:content-['·_']` 추가
- [ ] `<dd>` class 변경:
  - [ ] `text-profile-fg-2` → `text-profile-fg`

## Phase 4. inspire-me ext 정정

- [ ] `contents/website/inspire-me/index.md` — `ext: .ts` → `ext: .go` (원본 Profile v2.html L640 따름)

## Phase 5. 섹션 헤더 `// ` accent prefix

### 5.1 ProjectGrid

- [ ] `components/profile/ProjectGrid.tsx` 섹션 `<header>` class 조정:
  - [ ] `mb-[18px] flex items-baseline gap-3`
- [ ] h2 class:
  - [ ] `font-mono font-medium text-[12px] uppercase tracking-[0.14em] text-profile-muted m-0`
  - [ ] `before:content-['//_'] before:text-profile-accent`
- [ ] `#02` span: `font-mono text-[11px] text-profile-muted-2`
- [ ] bar: `flex-1 border-t border-profile-line` (line-2 아님)
- [ ] cnt span: `font-mono text-[11px] text-profile-muted`

### 5.2 WritingList

- [ ] `WritingListProps`에 `hash?: string` 필드 추가
- [ ] 섹션 `<header>` 구조 재작성 (ProjectGrid와 동일 패턴):
  - [ ] h2에 `before:content-['//_'] before:text-profile-accent`
  - [ ] h2 color `text-profile-muted`, letter-spacing 0.14em
  - [ ] `hash && <span>{hash}</span>` 조건부 렌더
  - [ ] bar: `flex-1 border-t border-profile-line`
  - [ ] cnt는 기존 `{items.length} / recent` 유지

### 5.3 ProfileShell

- [ ] `WritingList id="writing"` 호출에 `hash="#03"` prop 추가
- [ ] `WritingList id="writing-investment"` 호출에 `hash="#04"` prop 추가

## Phase 6. 빌드 검증

- [ ] `npm run check` 타입 체크 통과
- [ ] `npm run build` 정적 export 성공
- [ ] 콘솔에 렌더 에러·경고 없음

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
