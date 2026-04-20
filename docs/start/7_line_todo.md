# Center LineGutter 잘림 수정 — TODO

PRD: `7_line_prd.md` · Implementation: `7_line_implementation.md`

## 1. 분석 & 준비

- [x] `components/profile/LineGutter.tsx` 현재 구현 확인 (`lines = 48` 하드코딩)
- [x] `components/profile/ProfileShell.tsx`의 `main` 레이아웃 및 `<LineGutter />` 호출부 확인
- [x] `leading-6` → 24px 라인 높이 전제 확인 (Tailwind 설정 변경 여부 체크)

## 2. LineGutter 리팩터링

- [x] `'use client'` 지시자 추가
- [x] `useEffect`, `useState`, `RefObject` import
- [x] 상수 선언: `LINE_HEIGHT_PX = 24`, `INITIAL_LINES = 80`
- [x] `LineGutterProps` 타입 수정: `lines?` 제거, `targetRef: RefObject<HTMLElement | null>` 추가
- [x] state: `useState<number>(INITIAL_LINES)`
- [x] `useEffect` 내 로직 구현
  - [x] `targetRef.current` null 가드
  - [x] `update()` — `getBoundingClientRect().height` → `Math.ceil(h / LINE_HEIGHT_PX) + 2`
  - [x] `Math.max(INITIAL_LINES, needed)` 적용
  - [x] 동일값 갱신 방지(`prev === needed` 짧은 회로)
  - [x] `ResizeObserver` 생성·관찰·cleanup
- [x] JSDoc 주석 갱신 (동적 라인 수 설명)
- [x] 기존 `aria-hidden`, className 유지

## 3. ProfileShell 수정

- [x] `useRef` import 추가
- [x] `contentRef = useRef<HTMLDivElement>(null)` 선언
- [x] `<LineGutter targetRef={contentRef} />`로 변경
- [x] 콘텐츠 `<div>`에 `ref={contentRef}` 부착 (className 변경 없음)
- [x] 기존 Sidebar/RightRail/StatusBar 영향 없음 확인

## 4. 타입·빌드 검증

- [x] `npm run check` — 타입 오류 없음 확인
- [~] `npm run lint` — 기존 환경에서 CLI 파싱 오류(`next lint`)로 실행 불가, 빌드 과정의 TypeScript 단계로 갈음
- [x] `npm run build` — 정적 export 정상 생성 확인

## 5. 수동 시각 검증 (`npm run dev`)

- [x] 데스크톱(1440×900)에서 gutter가 Hero부터 `WRITING.INV` 하단까지 연속 표시 (101 라인, 2488px ≥ writingInvBottom 2332px)
- [x] `ProjectGrid`의 모든 카드 옆에 라인 번호 표시 (fullPage 스크린샷 확인)
- [x] `// WRITING.IT`, `// WRITING.INV` 섹션 옆 라인 번호 표시 (fullPage 스크린샷 확인)
- [x] 브라우저 창 높이 변화 시 gutter가 ResizeObserver로 자동 재조정 (피드백 루프 수정 후 확인)
- [~] `md` 미만(375px)에서 gutter 미표시 (CSS `hidden md:flex`로 확정, MCP Playwright viewport 재설정 제약으로 E2E 확인 보류)
- [ ] 모달(`ProjectModal`) 열림/닫힘에서 레이아웃 깨짐 없음 (회귀 검증)

## 6. E2E 테스트 (MCP Playwright)

- [x] `npm run dev` 실행 상태에서 Playwright로 `http://localhost:3000` 접속
- [x] 데스크톱 뷰포트(1440×900) 기준 페이지 전체 스크린샷 촬영 (`line-gutter-fullpage-fixed-*.png`)
- [x] gutter 마지막 `<span>`의 `textContent`가 콘텐츠 높이 대비 충분한지 DOM 평가
  - totalLines=101, expectedLines=99, gutterLastSpanBottom=2488 > writingInvBottom=2332 → **커버 완료**
- [x] **피드백 루프 발견 및 수정**: flex 기본 `align-items:stretch`가 gutter 자연 높이를 content로 전파 → `items-start` 추가로 해결
- [~] 모바일 뷰포트(375×812) gutter 미표시 — MCP Playwright는 재navigate 시 viewport 재설정이 적용되지 않음. CSS 클래스(`hidden md:flex`)로 확정되므로 수동 확인 권장
- [x] 스크린샷을 `docs/start/`에 저장 (`line-gutter-fullpage-fixed-2026-04-20T15-13-16-720Z.png`)

## 7. 회귀 확인

- [ ] Sidebar 키보드 내비게이션(`j/k`) 정상
- [ ] 커맨드 팔레트(`⌘K`) 열림/닫힘 정상
- [ ] 프로젝트 카드 hover·클릭 동작 정상
- [ ] Writing live fetch 후에도 gutter 연속 유지

## 8. 마무리

- [x] 변경 diff 최종 리뷰 (`LineGutter.tsx`, `ProfileShell.tsx` 외 변경 없음 확인)
- [x] feature 브랜치(`fix/45-line-gutter-cutoff`) 생성 및 커밋
- [x] PR 생성 (`gh pr create` + HEREDOC, reviewer: kenshin579) — https://github.com/kenshin579/v2.advenoh.pe.kr/pull/46
- [ ] 머지 후 문서 `docs/start/` → `docs/done/` 이동
