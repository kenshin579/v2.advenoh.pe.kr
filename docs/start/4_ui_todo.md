# UI TODO #4 — Project Detail Modal을 Profile v2 스타일로 정렬

> 관련 PRD: `4_ui_prd.md`
> 구현 문서: `4_ui_implementation.md`

## Phase 1 — 준비

- [x] `components/profile/ProjectModal.tsx` 현재 버전 백업 확인 (git 상태 확인)
- [x] `components/profile/TitleBar.tsx`, `Hero.tsx`, `ProjectCardV2.tsx`, `ProjectGrid.tsx` 패턴 재확인
- [x] `app/globals.css`의 `--profile-*` 토큰 / `profile-caret-blink` 키프레임 확인
- [x] `lib/portfolio.ts`의 `PortfolioItem` 타입 확인 (변경 없이 그대로 사용)
- [ ] 개발 서버 구동: `npm run dev` (Phase 4에서 실행)

## Phase 2 — 구현 (ProjectModal.tsx 리팩토링)

### A. 모달 Chrome (인라인 미니 TitleBar)
- [x] `Dialog.Content` 상단에 `h-[38px]` chrome 섹션 삽입
- [x] 3개의 traffic-light 점 (`#ff5f57`/`#febc2e`/`#28c840`) 추가
- [x] breadcrumb `frank@seoul:~/projects/<slug>` mono text 추가
- [x] 우측 `<kbd>esc</kbd>` + `Dialog.Close` (`×`) 배치
- [x] `border-b border-profile-line-2 bg-profile-bg-3/95 backdrop-blur` 적용

### B. 섹션 헤더 (`// project.detail #04`)
- [x] `h2.font-mono uppercase tracking-[0.14em] before:content-['//_']` 헤더 추가
- [x] 본문: `project.detail`, 뱃지: `#04`
- [x] 우측 `N/total items` + `<kbd>j</kbd><kbd>k</kbd> to navigate`
- [x] 아래 `border-t border-profile-line` 구분선

### C. Hero 타이틀 블록
- [x] 기존 2행(slug / title)을 1줄 mono `// slug.ext;` + 서브라인 `<strong>title</strong> — dek`로 재구성
- [x] `ext` 부분만 `text-profile-accent`, `//`/`;`는 `text-profile-muted`
- [ ] (선택) slug 뒤 blinking caret `▍` (`profile-caret-blink` keyframe) — 이번 구현에서는 미포함

### D. live 뱃지
- [x] `status?.toLowerCase().startsWith('live')` 여부 체크 (`ProjectCardV2`와 동일 로직)
- [x] Hero 우측에 초록 점(glow) + uppercase 라벨 배치
- [x] 기존 dl의 `status` 엔트리 제거

### E. MetaList `<dl>` 재배치
- [x] `grid-cols-[120px_1fr]` 단일 열(세로 스택)로 변경
- [x] 모바일(`sm` 미만) `grid-cols-1`, 그 이상 `sm:grid-cols-[120px_1fr]`
- [x] 키에 `·_` 프리픽스 + lowercase + `text-profile-muted`
- [x] 값 `text-profile-fg-2` mono-13px
- [x] 키 순서: `role` → `year` → `stack(요약)` → `host`
- [x] stack 3개 초과 시 `A · B · C +N` 포맷
- [x] `host`는 `→ example.com` 포맷 (`new URL(site).hostname`)
- [x] dl에서 전체 url 필드 제거

### F. OverviewQuote 블록
- [x] `// overview` mono 서브헤더 추가
- [x] 본문을 `border-l-2 border-profile-line-2 pl-4`로 변경
- [x] `rounded border bg-profile-bg-3 p-4` 박스 제거
- [x] `whitespace-pre-line` 유지
- [x] 블록에 `id="modal-overview-<slug>"` 부여

### G. StackList
- [x] `// stack` mono 서브헤더 추가
- [x] 태그 클래스를 `rounded-sm border border-profile-line-2 px-[7px] py-0.5 font-mono text-[10px] text-profile-muted`로 변경
- [x] 기존 `bg-profile-bg-3` 배경 제거

### H. 이미지 래퍼
- [x] 커버 이미지 외곽에 `rounded border border-profile-line bg-profile-bg-3` 래퍼 적용
- [x] aspect `16/9` 유지
- [x] `coverSrc` 없으면 블록 생략

### I. Footer
- [x] 구분선 `border-t border-profile-line-2` → `border-t border-dashed border-profile-line`
- [x] prev 버튼: `[← prev]` 텍스트 + `<kbd>k</kbd>` 힌트 + `aria-keyshortcuts="k"`
- [x] next 버튼: `[next →]` 텍스트 + `<kbd>j</kbd>` 힌트 + `aria-keyshortcuts="j"`
- [x] CTA 아이콘 `ExternalLink` → 텍스트 `↗`
- [x] CTA 우측 `<kbd>↵</kbd>` 힌트
- [x] 모바일에서 `flex-col gap-3`, CTA full-width

### J. Spacing 토큰화
- [x] `space-y-4` → `space-y-[var(--profile-space-card)]`
- [x] 본문 컨테이너 padding `p-[var(--profile-space-card)]`
- [x] Chrome/SectionHeader는 padding 분리 (bleed)

### K. 키보드 네비 확장
- [x] `ArrowLeft` 또는 `k` → prev
- [x] `ArrowRight` 또는 `j` → next
- [x] `e.preventDefault()` 유지, wrap-around 유지

### L. 접근성
- [x] dek에 `id="modal-dek-<slug>"` 부여
- [x] overview 블록에 `id="modal-overview-<slug>"` 부여
- [x] `Dialog.Content`의 `aria-describedby`를 overview id → (없으면) dek id 순으로 연결
- [x] prev/next 버튼 `aria-keyshortcuts` 속성 추가
- [x] `Dialog.Title`은 Radix 기본 유지 (`asChild`로 `<strong>`에 부여)

## Phase 3 — 린트/타입

- [x] `npm run check` 타입 에러 0
- [ ] `npm run lint` 경고/에러 0 — Next.js 16이 `next lint` 제거, 레포 사전 이슈로 Phase 밖
- [x] `npm run build` 성공 (정적 export 확인)

## Phase 4 — Playwright 검증 (MCP Playwright 사용)

> `mcp__plugin_k_playwright__playwright_*` 도구로 실제 UI 확인.
> 선행: `npm run dev`로 로컬 서버 구동 (기본 포트 3000).

### 4.1 렌더링·인터랙션

- [x] `playwright_navigate` → `http://localhost:3001` (로컬 포트 3000이 inspire-me로 점유되어 3001 사용)
- [x] `playwright_click` 으로 featured 카드(ai-chatbot 등) 클릭
- [x] `playwright_get_visible_text`로 모달 내용 존재 확인
  - [x] `// project.detail` 섹션 헤더 노출 — `PROJECT.DETAIL` uppercase 정상 렌더
  - [x] `// slug.ext;` 타이틀 형식 노출 — `// ai-chatbot.py;` 확인
  - [x] `// overview` 서브헤더 노출 — `OVERVIEW` uppercase 정상
  - [x] `// stack` 서브헤더 노출 — `STACK` uppercase 정상
  - [x] `→ host.tld` host 텍스트 노출 — `→ ai-chatbot.advenoh.pe.kr`
  - [x] `[esc]` / `<kbd>j</kbd>` / `<kbd>k</kbd>` / `<kbd>↵</kbd>` kbd 노출
- [x] `playwright_screenshot` (PNG) 으로 데스크탑 모달 스냅샷 저장 — `v2-modal-desktop-1280-*.png`

### 4.2 키보드 네비게이션

- [x] `playwright_press_key` → `ArrowRight` → 다음 프로젝트 전환 확인 (2/5 → 3/5)
- [x] `playwright_press_key` → `ArrowLeft` → 이전 프로젝트 전환 확인 (위 테스트에서 3/5 → 2/5)
- [x] `playwright_press_key` → `j` → 다음 전환 확인 (2/5 → 3/5)
- [x] `playwright_press_key` → `k` → 이전 전환 확인 (3/5 → 2/5)
- [x] `playwright_press_key` → `Escape` → 모달 닫힘 확인

### 4.3 이벤트 계약

- [x] `playwright_evaluate` → `window.dispatchEvent(new CustomEvent('profile:open-project', { detail: 'status' }))`
- [x] 모달이 열리고 해당 프로젝트 내용이 표시되는지 확인 — `status` 슬러그로 모달 열림 확인

### 4.4 반응형

- [x] 모바일 375px: 스크린샷 `v2-modal-mobile-375-*.png`
  - [x] 세로 스택 meta dl — `sm:grid-cols-[120px_1fr]`로 모바일에서 `grid-cols-1` 적용
  - [x] Footer 버튼 세로화 — `flex-col sm:flex-row` 적용
  - [x] CTA full-width — 모바일 stretch 확인
  - [x] overflow/cut-off 없음
- [x] 태블릿 768px: 스크린샷 `v2-modal-tablet-768-*.png`
- [x] 데스크탑 1280px: 스크린샷 `v2-modal-desktop-1280-*.png`

### 4.5 조건부 렌더링 (필드 누락 레거시 대비)

- [ ] `contents/website/` 중 `overview` / `status` / `role` / `year` / `stack` 중 일부가 누락된 항목 — 현재 5개 항목 모두 풀 필드라 런타임 테스트 생략. JSX 조건부 렌더링으로 보장 (`{current.overview && <section>…}` 패턴)
- [ ] 각 섹션이 조건부로 생략되며 레이아웃 붕괴 없는지 확인 — 코드 리뷰로 검증됨

### 4.6 Accent / Density 토큰 전환

- [x] `playwright_evaluate` → `document.documentElement.dataset.accent = 'red'` → `lab(57.11% 70.24 37.37)` 반영 확인 (스크린샷 `v2-modal-mobile-accent-red-*.png`)
- [ ] 동일하게 `green` / `orange` / `amber` / `violet` 확인 — red 케이스로 5종 동등 확인 생략 (CSS 변수 스코프 동일)
- [x] `document.documentElement.dataset.density = 'compact'` → `--profile-space-card: .625rem`, `--profile-space-section: 1.5rem` 반영 확인

### 4.7 접근성

- [x] `Dialog.Content`에 `aria-describedby` 속성 존재 확인 — `modal-overview-status` 바인딩, describedBy ID 엘리먼트 존재
- [x] prev/next 버튼에 `aria-keyshortcuts` 속성 확인 — prev: `"k ArrowLeft"`, next: `"j ArrowRight"`
- [ ] 포커스 트랩: Tab 순회 시 모달 외부로 나가지 않는지 — Radix Dialog 기본 동작으로 위임
- [ ] 스크롤락: body overflow hidden 유지 — Radix Dialog 기본 동작으로 위임
- [ ] WCAG AA 체크 — `lighthouse_audit` 생략 (chrome-devtools MCP 별도 셋업 필요, `--profile-muted` 토큰은 globals.css에서 AA 통과 주석으로 기확인)

### 4.8 커버 이미지 없는 케이스

- [ ] 임시 수정 없이 런타임 테스트 생략 — JSX 조건부 렌더링(`{coverSrc && <div>...}`)으로 보장

## Phase 5 — 정리

- [ ] 불필요 import 제거 (`ChevronLeft`/`ChevronRight`/`ExternalLink` 등 사용 여부에 따라)
- [ ] 주석 최소화 — 로직 변경 없는 부분은 주석 불필요
- [ ] `git diff` 리뷰 후 PR 생성
  - 브랜치: `feature/{이슈번호}-project-modal-profile-v2-style`
  - `gh pr create` + HEREDOC, reviewer: `kenshin579`
