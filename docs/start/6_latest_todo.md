# RightRail Latest Posts 노출 개수 확대 TODO

## 1. 사전 준비

- [x] `main` 최신화: `git checkout main && git pull origin main`
- [x] 이슈 생성 (`gh issue create` + HEREDOC) — #42
- [x] 브랜치 생성: `git checkout -b feat/42-latest-posts-10`

## 2. 코드 수정

### 2.1 `v2.advenoh.pe.kr/app/page.tsx`

- [x] 16번 라인 `getLatestPosts(6)` → `getLatestPosts(10)`

### 2.2 `v2.advenoh.pe.kr/lib/writing.ts`

- [x] 102번 라인 JSDoc 주석 `"상위 6개"` → `"상위 10개"`
- [x] 104번 라인 default param `limit = 6` → `limit = 10`

### 2.3 `v2.advenoh.pe.kr/hooks/useLiveWriting.ts`

- [x] 64번 라인 `.slice(0, 6)` → `.slice(0, 10)`
- [x] 주변 `it.slice(0, 5)`, `inv.slice(0, 5)`는 건드리지 않았는지 `git diff`로 확인

### 2.4 변경 없음 재확인

- [x] `components/profile/RightRail.tsx` diff 비어 있음
- [x] `components/profile/CommandPalette.tsx` diff 비어 있음
- [x] `components/profile/ProfileShell.tsx` diff 비어 있음
- [x] `lib/writing.ts`의 `getWritingSections()` (IT/INV 각 5개) 변경 없음

## 3. 인코딩 확인

- [x] `file -I v2.advenoh.pe.kr/app/page.tsx` → `charset=us-ascii` (non-ASCII 없음, UTF-8 호환)
- [x] `file -I v2.advenoh.pe.kr/lib/writing.ts` → `charset=utf-8`
- [x] `file -I v2.advenoh.pe.kr/hooks/useLiveWriting.ts` → `charset=utf-8`

## 4. 정적 검증

- [x] `cd v2.advenoh.pe.kr && npm run check` 통과
- [ ] ~~`cd v2.advenoh.pe.kr && npm run lint`~~ (Next.js 16에서 `next lint` 제거 — 선행 이슈, 본 변경과 무관)
- [x] `cd v2.advenoh.pe.kr && npm run build` 통과 (정적 export 성공)

## 5. 로컬 시각 검증

(Section 6 Playwright 자동 검증으로 대체 — headless 1440×900에서 DOM 카운트/텍스트 확인 완료)

- [x] `cd v2.advenoh.pe.kr && npm run dev`로 개발 서버 기동
- [x] `http://localhost:3000` 접속 (headless)
- [x] xl 뷰포트(1440×900)에서 RightRail "Latest posts" 섹션 확인
- [x] 아이템 개수 **정확히 10개** 노출 확인
- [x] `IT`/`INV` 배지가 아이템별로 정상 표시 (dev 환경 cache 기준 10개 모두 IT — 운영 환경 INV 피드 포함 자동 병합)
- [x] `pubDate` 내림차순으로 정렬되어 있음
- [x] System 블록은 RightRail 구조상 Latest posts 뒤에 렌더 (xl 뷰포트 스크롤 없이 노출)
- [x] 중앙 `writing.it` / `writing.inv` 섹션은 여전히 각 5개 유지 (getWritingSections 미변경)
- [ ] `Cmd+K` (CommandPalette) 열어 "Latest posts" 그룹 수동 확인 (옵션, 배포 후 확인)

## 6. MCP Playwright 자동 검증

- [x] `playwright_navigate` — `http://localhost:3000` 접속
- [x] 뷰포트 1440×900으로 설정 (xl 브레이크포인트 이상)
- [x] `playwright_evaluate`로 RightRail Latest posts `<li>` 개수 **10** 확인
- [x] RightRail innerText에서 `LATEST POSTS`, `IT` 배지 텍스트 포함 확인
- [x] `playwright_screenshot` — RightRail 전체 영역 스크린샷 저장 (`docs/start/right-rail-latest-10-*.png`)
- [ ] ~~(선택) CommandPalette 스크린샷~~ (skip, 운영 배포 후 수동 확인)
- [x] `playwright_console_logs` — 에러 0건 확인

## 7. 커밋 & PR

- [ ] 한국어 커밋 메시지로 커밋 (예: `feat: RightRail Latest posts 노출 개수 6 → 10`)
- [ ] 원격 push: `git push -u origin feat/{issue-number}-latest-posts-10`
- [ ] `gh pr create` + HEREDOC으로 PR 생성
- [ ] reviewer `kenshin579` 지정
- [ ] PR 본문 Summary에 변경 파일 3종 및 Before/After 요약 포함
- [ ] PR 본문 Test plan에 로컬 시각 검증 + Playwright 검증 체크리스트 포함

## 8. 배포 & 최종 확인

- [ ] PR 머지
- [ ] Netlify 자동 배포 완료 확인
- [ ] 운영 도메인 `https://v2.advenoh.pe.kr` 접속
- [ ] xl 뷰포트에서 RightRail "Latest posts" 10개 노출 확인
- [ ] CommandPalette에서도 10개 노출 확인
- [ ] Lighthouse 또는 DevTools로 렌더 성능 저하 없음 확인 (선택)
