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

- [x] `// project.detail #04` 섹션 헤더 블록 제거
- [x] `frank@seoul:~/projects/{slug}` → `~/projects/{slug}` 로 교체
- [x] `// {slug}.ext;` 코드 라인 제거
- [x] `// overview`, `// stack` 의 `// ` 프리픽스 제거 (h4 로 교체)
- [x] Overview `border-l-2 pl-4 whitespace-pre-line` 인용 블록 제거
- [x] 모달 내부 `j` / `k` 키보드 핸들러 제거

### 2.2 레이아웃 재배치

- [x] `Dialog.Content` 너비를 `w-[min(960px,100%)]` 로 확대
- [x] `grid-rows-[auto_1fr_auto]` 로 header / body / footer 분리
- [x] Header(`.mh`) 한 줄로 재구성: dots + `~/projects/<b>{slug}</b>` + `close · ESC`
- [x] Hero 이미지를 `.mcontent` 바깥으로 이동 → flush full-width, `aspect-[16/9]`, `border-b border-profile-line`, **border-radius 없음**
- [x] `.mcontent` 패딩 `px-8 py-6` (≈26/32)

### 2.3 Title / Dek

- [x] `Dialog.Title` 을 `h3` 로 (display 32px, weight 500, `tracking-[-0.02em]`, `mb-1.5`)
- [x] `p.dek` 분리: sans 15px, `leading-[1.6]`, `max-w-[60ch]`, `mb-[22px]`
- [x] 기존 inline `{title} — {dek}` 구조 제거

### 2.4 Meta Grid (4-cell 박스)

- [x] `.meta-grid` 컨테이너: `grid grid-cols-4 border border-profile-line rounded-lg py-4 my-[18px]`
- [x] 4 cell 고정: **status / year / role / url**
- [x] cell: `px-4 border-r border-profile-line last:border-r-0`
- [x] `.l`: `text-[10px] uppercase tracking-[0.1em] text-profile-muted mb-1`
- [x] `.v`: `text-[13.5px] text-profile-fg`
- [x] 기존 `<dl grid-cols-[120px_1fr]>` 제거

### 2.5 Overview

- [x] `h4 "Overview"`: `text-[11px] font-medium uppercase tracking-[0.14em] text-profile-accent`
- [x] `.readme` 컨테이너: `font-sans text-[14px] leading-[1.7] text-profile-fg-2 max-w-[72ch]`
- [x] `dangerouslySetInnerHTML={{ __html: item.overviewHtml }}` 적용
- [x] `app/globals.css` 에 `.readme p`, `.readme ul`, `.readme li`, `.readme strong`, `.readme code` 스타일 추가

### 2.6 Stack

- [x] `h4 "Stack"` (동일 스타일)
- [x] tag 스타일: `px-2 py-[3px] border border-profile-line-2 rounded-[3px] font-mono text-[11px] text-profile-fg-2`

### 2.7 Footer

- [x] `.mf`: `flex justify-between items-center px-4 py-3 bg-profile-bg-3 border-t border-profile-line`
- [x] 좌측: `press <kbd>←</kbd> <kbd>→</kbd> to navigate projects`
- [x] prev / next 버튼: outline 스타일 + 화살표 아이콘 `←`/`→`
- [x] **Open live ↗ primary 버튼**: `bg-profile-accent border-profile-accent text-profile-accent-ink hover:brightness-110`

### 2.8 키보드 / 접근성

- [x] `ArrowLeft` → prev, `ArrowRight` → next, `Esc` → close
- [x] `aria-describedby` 는 dek id (overview 는 HTML 이므로 dek 기준)
- [x] 버튼 `aria-label`, `aria-keyshortcuts` 유지

---

## Phase 3. ProjectGrid + ProjectCardV2

### 3.1 ProjectGrid

- [x] `focusIdx` 상태 도입
- [x] 전역 `keydown` 리스너: `j` / `ArrowDown` → 다음, `k` / `ArrowUp` → 이전, `Enter` → 모달 open 이벤트 발행
- [x] 모달이 열려있을 때는 리스너 skip
- [x] 포커스된 카드 `scrollIntoView({ block: 'nearest', behavior: 'smooth' })`
- [x] 각 카드에 `focused` prop + `onFocus` 핸들러 전달

### 3.2 ProjectCardV2

- [x] props 추가: `focused?: boolean`, `onFocus?: () => void`
- [x] 루트에 `onMouseEnter={onFocus}` 추가
- [x] `focused` 일 때 `outline-1 outline-profile-accent -outline-offset-2` 적용
- [x] `.kbd (↵ open)` 을 `focused ? 'opacity-100' : 'opacity-0'` 로 전환
- [x] Featured `h3` 를 `text-[32px]` 고정 (반응형 축소 제거)

---

## Phase 4. 품질 게이트

- [x] `npm run check` (타입) 통과
- [~] `npm run lint` — Next.js 16 에서 `next lint` 가 제거된 기존 이슈로 스킵 (내 작업 범위 밖)
- [x] `npm run build` 정적 export 성공
- [x] `components/profile/ProjectModal.tsx` 에 `// project.detail`, `frank@seoul:~/projects`, `// overview`, `// stack` 문자열이 **존재하지 않음** 확인 (사이트 헤더의 `frank@seoul:~/profile` 은 의도된 브랜딩으로 유지)
- [ ] `npm run dev` 로 로컬 확인 (Phase 5에서 MCP Playwright로 대체 검증)

---

## Phase 5. 테스트 (MCP Playwright)

> 포트폴리오 dev 서버를 포트 3333으로 띄워 검증 (`PORT=3333 npm run dev`).

### 5.1 카드 그리드 키보드

- [x] `playwright_navigate` → `http://localhost:3333`
- [x] `j` 키 입력 후 `.focused` 카드가 `inspire-me` → `ai-chatbot` 으로 이동
- [x] `k` 키 → 역방향 확인 (`ai-chatbot` → `inspire-me`)
- [x] 포커스 카드의 `↵ open` kbd가 `opacity: 1` 로 표시
- [x] `Enter` → `role="dialog"` 가 나타남

### 5.2 모달 레이아웃

- [x] Dialog 너비 정확히 **960px** 확인
- [x] Hero 이미지가 `.mcontent` 바깥(모달 상단 flush)에 위치, left offset 1px (border만)
- [x] `dl > div` (meta cell) 의 개수가 정확히 **4** (status/year/role/url)
- [x] `.readme` 내부에 `<ul>`, `<li>` ×4, `<strong>`, `<code>` 파싱된 요소 존재 (ai-chatbot)
- [x] `Open live ↗` 버튼 배경색이 violet accent `lab(60 37 -61)` 로 렌더

### 5.3 모달 키보드

- [x] `ArrowRight` 입력 → `InspireMe` → `AI Chatbot` 으로 타이틀 변경
- [x] `Escape` → `[role="dialog"]` 사라짐
- [x] `j` 입력해도 타이틀이 바뀌지 **않음** 확인 (AI Chatbot 유지)

### 5.4 제거 대상 회귀

- [x] 모달 `innerHTML` 에 `// project.detail` 미존재
- [x] 모달 `innerHTML` 에 `frank@seoul` 미존재
- [x] 모달 `innerHTML` 에 `// overview`, `// stack` 미존재
- [x] 모달 `innerHTML` 에 `.go;` / `.py;` / `.md;` / `.ts;` 형태의 코드 라인 미존재

### 5.5 시각 대조

- [x] `playwright_screenshot` — AI Chatbot 모달 (Header + Hero + Title + Dek)
- [x] `playwright_screenshot` — AI Chatbot 모달 스크롤 (Meta 4-cell + OVERVIEW + STACK + Footer)
- [x] `playwright_screenshot` — inspire-me Featured 모달 (Hero 전체 + Meta 4-cell)
- [x] Profile v2.html 레퍼런스와 육안 대조 — 헤더 한 줄, flush hero, 4-cell meta, primary CTA 모두 일치

---

## Phase 6. 마무리

- [ ] `git status` 로 변경 범위 재확인
- [ ] 의도치 않게 수정된 파일 되돌리기
- [ ] 커밋: `[#N] feat: 프로젝트 상세 모달을 Profile v2 레퍼런스 포맷으로 재정렬`
- [ ] PR 생성 (`gh pr create` + HEREDOC, 리뷰어 `kenshin579`)
- [ ] PR 본문에 Before/After 스크린샷 첨부
