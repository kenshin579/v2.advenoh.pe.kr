# 프로젝트 상세 디자인 정합성 — TODO 체크리스트

> 관련: `4_detail_prd.md`, `4_detail_implementation.md`

---

## Phase 1. 데이터 / 스키마

- [x] `marked` 또는 `remark-html` 설치 여부 확인, 미설치 시 `marked` 추가 (`npm i marked`)
- [x] `lib/portfolio.ts`
  - [x] `PortfolioItem` 타입에 `overviewHtml?: string` 필드 추가
  - [x] `getPortfolioItems()` 안에서 `validated.overview` 를 Markdown → HTML 로 변환해 `overviewHtml` 에 저장
  - [x] 변환 실패 시 원문 유지(fallback) 및 `console.warn`
- [x] frontmatter 현행화 (`contents/website/*/index.md` 5종)
  - [x] `ai-chatbot/index.md` — overview Markdown 포맷 정리, `year`/`role`/`status` 필드 존재 확인
  - [x] `inspire-me/index.md` — 동일
  - [x] `investment-blog/index.md` — 동일
  - [x] `it-blog/index.md` — 동일
  - [x] `status/index.md` — 동일
- [x] `npm run check` 통과
- [x] `npm run build` 로 정적 export 성공 + `out/` 에 overview HTML 반영 확인

---

## Phase 2. ProjectModal 재설계

### 2.1 구조 정리 (제거)

- [ ] `// project.detail #04` 섹션 헤더 블록 제거
- [ ] `frank@seoul:~/projects/{slug}` → `~/projects/{slug}` 로 교체
- [ ] `// {slug}.ext;` 코드 라인 제거
- [ ] `// overview`, `// stack` 의 `// ` 프리픽스 제거 (h4 로 교체)
- [ ] Overview `border-l-2 pl-4 whitespace-pre-line` 인용 블록 제거
- [ ] 모달 내부 `j` / `k` 키보드 핸들러 제거

### 2.2 레이아웃 재배치

- [ ] `Dialog.Content` 너비를 `w-[min(960px,100%)]` 로 확대
- [ ] `grid-rows-[auto_1fr_auto]` 로 header / body / footer 분리
- [ ] Header(`.mh`) 한 줄로 재구성: dots + `~/projects/<b>{slug}</b>` + `close · ESC`
- [ ] Hero 이미지를 `.mcontent` 바깥으로 이동 → flush full-width, `aspect-[16/9]`, `border-b border-profile-line`, **border-radius 없음**
- [ ] `.mcontent` 패딩 `px-8 py-6` (≈26/32)

### 2.3 Title / Dek

- [ ] `Dialog.Title` 을 `h3` 로 (display 32px, weight 500, `tracking-[-0.02em]`, `mb-1.5`)
- [ ] `p.dek` 분리: sans 15px, `leading-[1.6]`, `max-w-[60ch]`, `mb-[22px]`
- [ ] 기존 inline `{title} — {dek}` 구조 제거

### 2.4 Meta Grid (4-cell 박스)

- [ ] `.meta-grid` 컨테이너: `grid grid-cols-4 border border-profile-line rounded-lg py-4 my-[18px]`
- [ ] 4 cell 고정: **status / year / role / url**
- [ ] cell: `px-4 border-r border-profile-line last:border-r-0`
- [ ] `.l`: `text-[10px] uppercase tracking-[0.1em] text-profile-muted mb-1`
- [ ] `.v`: `text-[13.5px] text-profile-fg`
- [ ] 기존 `<dl grid-cols-[120px_1fr]>` 제거

### 2.5 Overview

- [ ] `h4 "Overview"`: `text-[11px] font-medium uppercase tracking-[0.14em] text-profile-accent`
- [ ] `.readme` 컨테이너: `font-sans text-[14px] leading-[1.7] text-profile-fg-2 max-w-[72ch]`
- [ ] `dangerouslySetInnerHTML={{ __html: item.overviewHtml }}` 적용
- [ ] `app/globals.css` 에 `.readme p`, `.readme ul`, `.readme li`, `.readme strong`, `.readme code` 스타일 추가

### 2.6 Stack

- [ ] `h4 "Stack"` (동일 스타일)
- [ ] tag 스타일: `px-2 py-[3px] border border-profile-line-2 rounded-[3px] font-mono text-[11px] text-profile-fg-2`

### 2.7 Footer

- [ ] `.mf`: `flex justify-between items-center px-4 py-3 bg-profile-bg-3 border-t border-profile-line`
- [ ] 좌측: `press <kbd>←</kbd> <kbd>→</kbd> to navigate projects`
- [ ] prev / next 버튼: outline 스타일 + 화살표 아이콘 `←`/`→`
- [ ] **Open live ↗ primary 버튼**: `bg-profile-accent border-profile-accent text-profile-accent-ink hover:brightness-110`

### 2.8 키보드 / 접근성

- [ ] `ArrowLeft` → prev, `ArrowRight` → next, `Esc` → close
- [ ] `aria-describedby` 는 dek id (overview 는 HTML 이므로 dek 기준)
- [ ] 버튼 `aria-label`, `aria-keyshortcuts` 유지

---

## Phase 3. ProjectGrid + ProjectCardV2

### 3.1 ProjectGrid

- [ ] `focusIdx` 상태 도입
- [ ] 전역 `keydown` 리스너: `j` / `ArrowDown` → 다음, `k` / `ArrowUp` → 이전, `Enter` → 모달 open 이벤트 발행
- [ ] 모달이 열려있을 때는 리스너 skip
- [ ] 포커스된 카드 `scrollIntoView({ block: 'nearest', behavior: 'smooth' })`
- [ ] 각 카드에 `focused` prop + `onFocus` 핸들러 전달

### 3.2 ProjectCardV2

- [ ] props 추가: `focused?: boolean`, `onFocus?: () => void`
- [ ] 루트에 `onMouseEnter={onFocus}` 추가
- [ ] `focused` 일 때 `outline-1 outline-profile-accent -outline-offset-2` 적용
- [ ] `.kbd (↵ open)` 을 `focused ? 'opacity-100' : 'opacity-0'` 로 전환
- [ ] Featured `h3` 를 `text-[32px]` 고정 (반응형 축소 제거)

---

## Phase 4. 품질 게이트

- [ ] `npm run check` (타입) 통과
- [ ] `npm run lint` (ESLint) 통과
- [ ] `npm run build` 정적 export 성공
- [ ] `out/index.html` 에 `// project.detail`, `frank@seoul`, `// overview` 문자열이 **존재하지 않음** 확인
- [ ] `npm run dev` 로 로컬 확인

---

## Phase 5. 테스트 (MCP Playwright)

> `mcp__plugin_k_playwright__*` 또는 `mcp__plugin_k_chrome-devtools__*` 사용. 로컬 `npm run dev` 선행.

### 5.1 카드 그리드 키보드

- [ ] `playwright_navigate` → `http://localhost:3000`
- [ ] `j` 키 입력 후 `.focused` 카드가 다음으로 이동하는지 `playwright_get_visible_html` 로 검증
- [ ] `k` 키 → 역방향 확인
- [ ] 포커스 카드에 `↵ open` kbd 가 visible 한지 확인
- [ ] `Enter` → `role="dialog"` 가 나타남

### 5.2 모달 레이아웃

- [ ] Dialog 너비가 `min(960px, 100vw)` 이하인지 평가
- [ ] Hero 이미지가 `.mcontent` 바깥(모달 상단 flush)에 있는지 DOM 순서로 확인
- [ ] `dl.meta-grid > div.m` 의 개수가 정확히 4
- [ ] `.readme` 내부에 `ul`, `li`, `strong` 등 파싱된 요소 존재
- [ ] `Open live ↗` 버튼 배경색이 accent token 과 동일한지 computed style 로 검증

### 5.3 모달 키보드

- [ ] `ArrowRight` 입력 → 타이틀 텍스트 변경
- [ ] `ArrowLeft` → 이전 타이틀 복귀
- [ ] `Escape` → 모달 닫힘(dialog 사라짐)
- [ ] `j` 입력해도 타이틀이 바뀌지 **않음**을 확인
- [ ] `k` 입력해도 타이틀이 바뀌지 **않음**을 확인

### 5.4 제거 대상 회귀

- [ ] `// project.detail` 텍스트 미존재
- [ ] `frank@seoul` 텍스트 미존재
- [ ] `// overview`, `// stack` 텍스트 미존재
- [ ] `{slug}.ext;` 형태의 코드 라인 미존재

### 5.5 시각 대조

- [ ] `playwright_screenshot` — 일반 카드 모달 1장
- [ ] `playwright_screenshot` — Featured 모달 1장(inspire-me)
- [ ] `docs/start/Profile/Profile v2.html` 로 열어둔 브라우저 스크린샷과 육안 대조

---

## Phase 6. 마무리

- [ ] `git status` 로 변경 범위 재확인
- [ ] 의도치 않게 수정된 파일 되돌리기
- [ ] 커밋: `[#N] feat: 프로젝트 상세 모달을 Profile v2 레퍼런스 포맷으로 재정렬`
- [ ] PR 생성 (`gh pr create` + HEREDOC, 리뷰어 `kenshin579`)
- [ ] PR 본문에 Before/After 스크린샷 첨부
