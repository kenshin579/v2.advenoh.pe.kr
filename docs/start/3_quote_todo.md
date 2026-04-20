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

- [x] `components/profile/ProfileShell.tsx`
  - [x] `quotes: Quote[]` prop 제거
  - [x] `import type { Quote }` 제거
  - [x] `<QuoteBlock />` 호출에서 props 제거
- [x] `app/page.tsx`
  - [x] `getQuotes` import 제거
  - [x] `Promise.all`에서 `getQuotes()` 제거
  - [x] `ProfileShell`의 `quotes` prop 전달 제거

## 4. 로컬 데이터 제거

- [x] `lib/quotes.ts` 삭제
- [x] `contents/quote/*.md` (7개 파일) 삭제
- [x] `grep -R "lib/quotes" v2.advenoh.pe.kr/` 로 잔여 참조 없는지 확인 (소스 코드 참조 0건)

## 5. 빌드 & 타입 검증

- [x] `cd v2.advenoh.pe.kr && npm run check` — 타입 통과
- [ ] `npm run lint` — Next.js 16 `next lint` 스크립트 이슈로 skip (본 변경과 무관)
- [x] `npm run build` — 정적 export `out/` 생성 성공
- [x] `npm run start` — 로컬 preview 정상 동작 (HTTP 200, `$ quote-of-the-day` 라벨 렌더 확인)

## 6. E2E 검증 (MCP Playwright)

- [x] preview 서버 기동: `npm run build && npm run start`
- [x] MCP Playwright로 `http://localhost:3000` 네비게이트
- [x] `$ quote-of-the-day` 라벨 노출 확인
- [x] 명언 영역이 `<a target="_blank" rel="noopener noreferrer">` 로 감싸져 있는지 확인
- [x] `href`가 `https://inspire-me.advenoh.pe.kr/quotes/{uuid}` 패턴 검증 (실제 UUID 확인됨)
- [x] `aria-label="inspire-me에서 이 명언 자세히 보기"` 확인
- [x] `localStorage` 키 `quote:today:2026-04-20:ko` 저장 확인
- [x] 재로드 시 같은 명언 유지(캐시 동작) 확인
- [ ] 오프라인/API 다운 시 FALLBACK 렌더 확인 — 수동 DevTools(offline 토글) 권장. 코드 리뷰로 try/catch → null → FALLBACK 경로 확인 완료.

## 7. 성능/접근성

- [x] 키보드 포커스가 명언 링크 `<a>`에 도달 가능 (activeElement 확인)
- [x] `aria-label` 설정 확인
- [ ] Lighthouse CLS 측정은 Netlify 배포 후 수행 권장

## 8. PR & 배포

- [x] feature 브랜치 push: `feat/40-inspire-me-qotd`
- [x] PR 생성: [#41](https://github.com/kenshin579/v2.advenoh.pe.kr/pull/41)
- [x] 리뷰어 지정: `kenshin579`
- [ ] PR 머지 → Netlify 자동 배포 (리뷰 대기)
- [ ] 운영 도메인 `https://v2.advenoh.pe.kr` 에서 최종 확인
  - [ ] QOTD 렌더 정상
  - [ ] 링크 클릭 → inspire-me 상세 열림
  - [ ] 콘솔 에러/경고 없음

## 9. 후처리

- [ ] (머지 후) feature 브랜치 삭제
- [ ] (머지 후) 이슈 #40 자동 close (PR `Closes #40`)
- [ ] (옵션) `POST /api/widget/impression` 전송 도입 여부 별도 티켓화
