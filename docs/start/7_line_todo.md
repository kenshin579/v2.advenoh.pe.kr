# Center LineGutter 잘림 수정 — TODO

PRD: `7_line_prd.md` · Implementation: `7_line_implementation.md`

## 1. 분석 & 준비

- [x] `components/profile/LineGutter.tsx` 현재 구현 확인 (`lines = 48` 하드코딩)
- [x] `components/profile/ProfileShell.tsx`의 `main` 레이아웃 및 `<LineGutter />` 호출부 확인
- [x] `leading-6` → 24px 라인 높이 전제 확인 (Tailwind 설정 변경 여부 체크)

## 2. LineGutter 리팩터링

- [ ] `'use client'` 지시자 추가
- [ ] `useEffect`, `useState`, `RefObject` import
- [ ] 상수 선언: `LINE_HEIGHT_PX = 24`, `INITIAL_LINES = 80`
- [ ] `LineGutterProps` 타입 수정: `lines?` 제거, `targetRef: RefObject<HTMLElement | null>` 추가
- [ ] state: `useState<number>(INITIAL_LINES)`
- [ ] `useEffect` 내 로직 구현
  - [ ] `targetRef.current` null 가드
  - [ ] `update()` — `getBoundingClientRect().height` → `Math.ceil(h / LINE_HEIGHT_PX) + 2`
  - [ ] `Math.max(INITIAL_LINES, needed)` 적용
  - [ ] 동일값 갱신 방지(`prev === needed` 짧은 회로)
  - [ ] `ResizeObserver` 생성·관찰·cleanup
- [ ] JSDoc 주석 갱신 (동적 라인 수 설명)
- [ ] 기존 `aria-hidden`, className 유지

## 3. ProfileShell 수정

- [ ] `useRef` import 추가
- [ ] `contentRef = useRef<HTMLDivElement>(null)` 선언
- [ ] `<LineGutter targetRef={contentRef} />`로 변경
- [ ] 콘텐츠 `<div>`에 `ref={contentRef}` 부착 (className 변경 없음)
- [ ] 기존 Sidebar/RightRail/StatusBar 영향 없음 확인

## 4. 타입·빌드 검증

- [ ] `npm run check` — 타입 오류 없음 확인
- [ ] `npm run lint` — 린트 통과 확인
- [ ] `npm run build` — 정적 export 정상 생성 확인

## 5. 수동 시각 검증 (`npm run dev`)

- [ ] 데스크톱(1440×900)에서 gutter가 Hero부터 `WRITING.INV` 하단까지 연속 표시
- [ ] `ProjectGrid`의 모든 카드(6개) 옆에 라인 번호 표시
- [ ] `// WRITING.IT`, `// WRITING.INV` 섹션 옆 라인 번호 표시
- [ ] 브라우저 창을 세로로 줄였다 늘려도 gutter가 끊기지 않음
- [ ] `md` 미만(375px)에서 gutter 미표시
- [ ] 모달(`ProjectModal`) 열림/닫힘에서 레이아웃 깨짐 없음

## 6. E2E 테스트 (MCP Playwright)

- [ ] `npm run dev` 실행 상태에서 Playwright로 `http://localhost:3000` 접속
- [ ] 데스크톱 뷰포트(1440×900) 기준 페이지 전체 스크린샷 촬영
- [ ] gutter 마지막 `<span>`의 `textContent`가 콘텐츠 높이 대비 충분한지 DOM 평가
  - 예: `document.querySelector('[aria-hidden="true"].font-mono span:last-child')` 값 vs `contentRef`의 `offsetHeight / 24`
- [ ] 모바일 뷰포트(375×812)에서 gutter가 보이지 않는지 확인
- [ ] 창 리사이즈(`page.setViewportSize`) 후 라인 수 재조정 확인
- [ ] 스크린샷을 `docs/start/` 또는 `tests/__snapshots__/`에 저장 (회귀 방지)

## 7. 회귀 확인

- [ ] Sidebar 키보드 내비게이션(`j/k`) 정상
- [ ] 커맨드 팔레트(`⌘K`) 열림/닫힘 정상
- [ ] 프로젝트 카드 hover·클릭 동작 정상
- [ ] Writing live fetch 후에도 gutter 연속 유지

## 8. 마무리

- [ ] 변경 diff 최종 리뷰 (`LineGutter.tsx`, `ProfileShell.tsx` 외 변경 없음 확인)
- [ ] feature 브랜치(`fix/{issue}-line-gutter-cutoff`) 생성 및 커밋
- [ ] PR 생성 (`gh pr create` + HEREDOC, reviewer: kenshin579)
- [ ] 완료 후 문서 `docs/start/` → `docs/done/` 이동
