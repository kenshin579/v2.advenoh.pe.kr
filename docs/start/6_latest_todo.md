# RightRail Latest Posts 노출 개수 확대 TODO

## 1. 사전 준비

- [x] `main` 최신화: `git checkout main && git pull origin main`
- [x] 이슈 생성 (`gh issue create` + HEREDOC) — #42
- [x] 브랜치 생성: `git checkout -b feat/42-latest-posts-10`

## 2. 코드 수정

### 2.1 `v2.advenoh.pe.kr/app/page.tsx`

- [ ] 16번 라인 `getLatestPosts(6)` → `getLatestPosts(10)`

### 2.2 `v2.advenoh.pe.kr/lib/writing.ts`

- [ ] 102번 라인 JSDoc 주석 `"상위 6개"` → `"상위 10개"`
- [ ] 104번 라인 default param `limit = 6` → `limit = 10`

### 2.3 `v2.advenoh.pe.kr/hooks/useLiveWriting.ts`

- [ ] 64번 라인 `.slice(0, 6)` → `.slice(0, 10)`
- [ ] 주변 `it.slice(0, 5)`, `inv.slice(0, 5)`는 건드리지 않았는지 `git diff`로 확인

### 2.4 변경 없음 재확인

- [ ] `components/profile/RightRail.tsx` diff 비어 있음
- [ ] `components/profile/CommandPalette.tsx` diff 비어 있음
- [ ] `components/profile/ProfileShell.tsx` diff 비어 있음
- [ ] `lib/writing.ts`의 `getWritingSections()` (IT/INV 각 5개) 변경 없음

## 3. 인코딩 확인

- [ ] `file -I v2.advenoh.pe.kr/app/page.tsx` → `charset=utf-8`
- [ ] `file -I v2.advenoh.pe.kr/lib/writing.ts` → `charset=utf-8`
- [ ] `file -I v2.advenoh.pe.kr/hooks/useLiveWriting.ts` → `charset=utf-8`

## 4. 정적 검증

- [ ] `cd v2.advenoh.pe.kr && npm run check` 통과
- [ ] `cd v2.advenoh.pe.kr && npm run lint` 통과 (Next.js 16에서 제거된 경우 skip)
- [ ] `cd v2.advenoh.pe.kr && npm run build` 통과 (정적 export 성공)

## 5. 로컬 시각 검증

- [ ] `cd v2.advenoh.pe.kr && npm run dev`로 개발 서버 기동
- [ ] 브라우저에서 `http://localhost:3000` 접속
- [ ] xl 뷰포트(≥1280px)에서 RightRail "Latest posts" 섹션 확인
- [ ] 아이템 개수 **정확히 10개** 노출 확인
- [ ] `IT`/`INV` 배지가 아이템별로 정상 표시
- [ ] `pubDate` 내림차순으로 정렬되어 있음 (소스 섞임)
- [ ] System 블록이 화면에서 잘리지 않고 표시됨
- [ ] 중앙 `writing.it` / `writing.inv` 섹션은 여전히 각 5개 유지
- [ ] `Cmd+K` (CommandPalette) 열어 "Latest posts" 그룹에도 10개 노출

## 6. MCP Playwright 자동 검증

- [ ] `playwright_navigate` — `http://localhost:3000` 접속
- [ ] 뷰포트 1440×900으로 설정 (xl 브레이크포인트 이상)
- [ ] `playwright_evaluate`로 RightRail Latest posts `<li>` 개수가 **10** 확인
- [ ] `playwright_get_visible_text` — Latest posts 영역에 `IT` / `INV` 배지 텍스트 포함 확인
- [ ] `playwright_screenshot` — RightRail 전체 영역 스크린샷 저장
- [ ] (선택) CommandPalette 열어 "Latest posts" 그룹 10개 노출 스크린샷
- [ ] `playwright_console_logs` — 에러/경고 없음 확인

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
