# 포트폴리오 "오늘의 명언" 연동 — TODO

> 관련 문서: [3_quote_prd.md](./3_quote_prd.md), [3_quote_implementation.md](./3_quote_implementation.md)

## 0. 사전 준비

- [x] feature 브랜치 생성: `feat/40-inspire-me-qotd`
- [x] `curl https://inspire-me.advenoh.pe.kr/api/widget/quote-of-the-day?lang=ko` 로 API 응답 최종 확인
- [x] 이슈 번호 확보: [#40](https://github.com/kenshin579/v2.advenoh.pe.kr/issues/40)

## 1. 클라이언트 모듈 신규

- [x] `v2.advenoh.pe.kr/lib/quotes-client.ts` 작성
  - [x] `INSPIRE_ME_URL` 상수 하드코딩 (`https://inspire-me.advenoh.pe.kr`)
  - [x] zod `todayQuoteSchema` + `widgetRespSchema` 정의
  - [x] `fetchTodayQuote(lang)` 함수 (2xx + 파싱 실패 시 `null`)
  - [x] `quoteDetailUrl(id)` 헬퍼
  - [x] `FALLBACK_QUOTE` 상수

## 2. `QuoteBlock` 리팩터링

- [x] `components/profile/QuoteBlock.tsx` 재작성
  - [x] props 제거 (외부 주입 없음)
  - [x] 상태: `loading | ready | error`
  - [x] `useEffect`로 마운트 시 fetch
  - [x] KST(`Asia/Seoul`) 기준 `YYYY-MM-DD` 키로 `localStorage` 일일 캐시
  - [x] 로딩 시 `min-h-[104px]` 스켈레톤 (CLS 방지)
  - [x] ready 시 `<a target="_blank" rel="noopener noreferrer" aria-label>` 로 감싸기
  - [x] hover/focus 시 `text-profile-accent`
  - [x] 에러 시 FALLBACK 렌더(링크 비활성)
  - [x] 상단 라벨 `$ quote-of-the-day`
  - [x] `↻ rotate` 버튼 제거

## 3. 호출부 정리

- [ ] `components/profile/ProfileShell.tsx`
  - [ ] `quotes: Quote[]` prop 제거
  - [ ] `import type { Quote }` 제거
  - [ ] `<QuoteBlock />` 호출에서 props 제거
- [ ] `app/page.tsx`
  - [ ] `getQuotes` import 제거
  - [ ] `Promise.all`에서 `getQuotes()` 제거
  - [ ] `ProfileShell`의 `quotes` prop 전달 제거

## 4. 로컬 데이터 제거

- [ ] `lib/quotes.ts` 삭제
- [ ] `contents/quote/*.md` (7개 파일) 삭제
- [ ] `grep -R "lib/quotes" v2.advenoh.pe.kr/` 로 잔여 참조 없는지 확인

## 5. 빌드 & 타입 검증

- [ ] `cd v2.advenoh.pe.kr && npm run check` — 타입 통과
- [ ] `npm run lint` — 린트 통과
- [ ] `npm run build` — 정적 export `out/` 생성 성공
- [ ] `npm run start` — 로컬 preview 정상 동작

## 6. E2E 검증 (MCP Playwright)

- [ ] Dev 서버 기동: `cd v2.advenoh.pe.kr && npm run dev`
- [ ] MCP Playwright로 `http://localhost:3000` 네비게이트
- [ ] 화면 스냅샷으로 `$ quote-of-the-day` 라벨 노출 확인
- [ ] 명언 영역이 `<a>` 태그로 감싸져 있는지, `target="_blank"`/`rel="noopener noreferrer"` 속성 확인
- [ ] `href`가 `https://inspire-me.advenoh.pe.kr/quotes/{uuid}` 패턴인지 검증
- [ ] 명언 클릭 → 새 탭에서 상세 페이지 열림 확인
- [ ] Network 탭에서 `/api/widget/quote-of-the-day?lang=ko` 호출 및 200 응답 확인
- [ ] DevTools 오프라인 모드 재현 후 새로고침 → FALLBACK 렌더 확인
- [ ] `localStorage` 키 `quote:today:{오늘날짜}:ko` 저장 확인
- [ ] 재로드 시 같은 명언 유지(캐시 동작) 확인

## 7. 성능/접근성

- [ ] Lighthouse: CLS ≤ 0.1
- [ ] 키보드 Tab 포커스가 명언 링크에 도달하는지 확인
- [ ] `aria-label="inspire-me에서 이 명언 자세히 보기"` 스크린리더로 읽힘 확인

## 8. PR & 배포

- [ ] 커밋 메시지: `[#이슈번호] feat: 오늘의 명언 inspire-me widget API 연동`
- [ ] `gh pr create --title "..." --body "$(cat <<'EOF' ... EOF)"` (HEREDOC)
- [ ] 리뷰어 지정: `kenshin579`
- [ ] PR 머지 → Netlify 자동 배포
- [ ] 운영 도메인 `https://v2.advenoh.pe.kr` 에서 최종 확인
  - [ ] QOTD 렌더 정상
  - [ ] 링크 클릭 → inspire-me 상세 열림
  - [ ] 콘솔 에러/경고 없음

## 9. 후처리

- [ ] feature 브랜치 삭제
- [ ] 관련 이슈 close 코멘트 작성
- [ ] (옵션) `POST /api/widget/impression` 전송 도입 여부 별도 티켓화
