# MoneyFlow 포트폴리오 항목 추가 — 디자인 문서

- 날짜: 2026-09-12
- 대상: `v2.advenoh.pe.kr` (Frank Oh 포트폴리오 정적 사이트)
- 결정 방식: 브레인스토밍 Q&A로 항목별 확정

## 목표

포트폴리오 그리드에 MoneyFlow(국내·미국 시장 지표·수급·공시를 한 화면에 모은 개인 투자 대시보드)
항목을 추가한다. 코드 변경 없이 콘텐츠 폴더 추가 + 기존 항목 `order` 조정만으로 구현한다.
(`lib/portfolio.ts`가 `contents/website/*/index.md`를 빌드 시점에 자동 로드하므로
스키마·컴포넌트 수정은 불필요하다.)

## 변경 사항

### 1. 신규 콘텐츠 폴더

`contents/website/moneyflow/` 생성:

- `index.md` — 아래 확정 콘텐츠로 작성
- `cover.png` — `~/Desktop/Screenshots/스크린샷 2026-09-11 오후 9.47.42.png`(3824×2484)를 그대로 복사.
  기존 커버들도 Chrome 창 전체 캡처(탭·북마크바 포함)이며 비율이 제각각이므로 크롭 불필요.
  `public/portfolio/moneyflow/`는 prebuild(`copy-portfolio-images.js`)가 생성하므로 직접 추가하지 않는다.

### 2. 기존 항목 order 조정

MoneyFlow를 InspireMe 다음(order 2)에 배치하고, 이후 항목을 한 칸씩 뒤로 민다.

| 항목 | 기존 order | 변경 order |
|---|---|---|
| InspireMe | 1 | 1 (유지, featured) |
| **MoneyFlow** | — | **2 (신규)** |
| Markora | 2 | 3 |
| MQTT Insight | 3 | 4 |
| SnapScreen | 4 | 5 |
| Summora | 5 | 6 |
| chronos-go | 6 | 7 |
| Advenoh Status | 7 | 8 |
| IT Blog | 8 | 9 |
| Investment Insights | 9 | 10 |
| AI Chatbot | 10 | 11 |

## 확정된 index.md 콘텐츠

```yaml
---
site: https://moneyflow.advenoh.pe.kr/
title: MoneyFlow
cover: cover.png
stack:
  - Next.js
  - React
  - Go
  - Echo
  - GORM
  - MySQL
  - Redis
  - Kubernetes
  - Helm
ext: .go
order: 2
status_en: live
status_ko: 운영 중
year_en: 2025 — now
year_ko: 2025 — 현재
role_en: Solo
role_ko: 단독
description_en: A personal investing dashboard that brings Korean and US market indicators,
  investor flows, ETFs, guru portfolios, and filings into one screen for daily tracking.
description_ko: 국내·미국 시장 지표, 투자자별 수급, ETF, 대가 포트폴리오, 공시를
  한 화면에 모아 매일 추적하는 개인 투자 대시보드.
dek_en: The morning rounds across a dozen market sites, on one screen.
dek_ko: 여러 사이트를 돌던 아침 시장 확인을, 한 화면에서.
overview_ko: |
  **왜 만들었나.** 매일 HTS, 네이버 증권, 인베스팅, CNN, 13F 사이트를 돌아다니며 보던
  시장 지표·수급·공시를 한 화면에 모으고 싶었다. 여기에 외국인·기관이 무엇을 사고파는지
  매일 흐름을 따라가며 투자 판단의 근거로 삼을 수 있게 만들었다.

  - 국내·미국 지수, 환율, 금리, 원자재, VIX·공포탐욕지수를 카드로 한눈에
  - 투자자별(외국인·기관·개인) 순매수 상위 종목과 장중 누적 수급 차트
  - ETF 랭킹·비교, 관심종목, 대가(13F) 포트폴리오 추적
  - 종목 상세에서 DART·SEC EDGAR 공시와 재무 확인, 대가 공시 등 알림을 메일·Telegram으로
  - 배치 수집기가 한국투자증권·DART·SEC·FRED 등에서 데이터를 채우는 Go(Echo/GORM) + Next.js 구조, Kubernetes(Helm) 배포

  **배운 것.** 외부 데이터 소스마다 갱신 주기와 실패 양상이 달라서, 값만 보여주면 화면이
  틀린 사실을 말하게 된다. 수집 시각 배지와 '데이터 현황' 화면으로 데이터가 실제로
  채워지고 있는지를 함께 보여주는 게 필수였다.
overview_en: |
  **Why I built it.** Every day I was hopping between my brokerage app, Naver Finance,
  Investing.com, CNN, and 13F trackers just to check market indicators, investor flows,
  and filings. I wanted all of it on one screen — and a way to follow what foreign and
  institutional investors are buying and selling, day by day, as input for my own decisions.

  - Korean and US indices, FX, rates, commodities, VIX, and Fear & Greed as at-a-glance cards
  - Top net-buy stocks by investor type (foreign / institutional / retail) and intraday cumulative flow charts
  - ETF rankings and comparison, a watchlist, and guru (13F) portfolio tracking
  - Stock detail pages with DART / SEC EDGAR filings and financials, plus email / Telegram alerts for events like new guru filings
  - Batch collectors fill data from KIS, DART, SEC, FRED, and more into a Go (Echo/GORM) + Next.js stack, deployed on Kubernetes (Helm)

  **What I learned.** Every external data source has its own refresh cadence and failure
  modes, so showing values alone lets the screen state things that aren't true. Collection
  timestamps and a "data health" view that shows whether data is actually arriving turned
  out to be essential.
---
```

## 결정 근거 (Q&A 요약)

- **배치**: 사용자 지정으로 InspireMe 다음(order 2). 커밋 1,186개·PR/이슈 번호 #334 규모로 현재 가장 활발한 프로젝트라 앞쪽 노출.
  featured는 InspireMe 유지.
- **사이드바 Links**: 추가하지 않음. Summora·Markora 등 최근 프로젝트와 동일하게 카드로만 노출.
  (`lib/site-config.ts` 변경 없음)
- **site 링크**: `https://moneyflow.advenoh.pe.kr/`. 홈(시장 화면)은 비로그인으로 열람 가능하고
  관심종목 추가 등만 로그인이 필요하므로 방문자에게 빈 화면이 보이지 않는다.
  저장소는 private이라 GitHub 링크는 넣지 않는다.
- **커버**: 2026-09-11 캡처 사용. 2026-09-10 캡처는 탭 4개가 열려 있어 제외.
- **동기(overview)**: "흩어진 정보를 한 화면으로" + "수급 추적" 두 가지를 모두 담는다.
- **배운 것**: 최근 커밋 흐름(데이터 현황 화면 #332, 수집 시각 배지 #311,
  직전 종가 없으면 카드 숨김 #317)을 근거로 데이터 신선도 표시의 필요성을 기술.
- **year**: 첫 커밋 2025-11-23 기준 `2025 — now`.

## 에러 처리

빌드 시 `portfolioItemSchema`(zod)가 frontmatter를 검증하므로, 필드 오타·형식 오류는
빌드 실패로 즉시 드러난다. 별도 런타임 에러 처리는 불필요.

## 검증 방법

1. `npm run check` — 타입 검사 통과
2. `npm run build` — 정적 빌드 성공 (zod 검증 포함)
3. `npm run start`로 빌드 결과 확인:
   - MoneyFlow 카드가 InspireMe 다음(2번째)에 표시, 이후 항목 순서 유지
   - 커버 이미지, 제목, description, stack 뱃지 정상 렌더링
   - en(`/`)·ko(`/ko/`) 로케일 모두에서 각 언어 필드 표시
   - 모달 overview 렌더링, 사이트 링크 `https://moneyflow.advenoh.pe.kr/` 연결
4. `npm test` — 기존 Playwright 테스트 통과
5. `file -I contents/website/moneyflow/index.md` — UTF-8 인코딩 확인

## 범위 제외

- moneyflow 저장소 쪽 변경 없음 (README 최신화 등 포함)
- `lib/portfolio.ts`, `lib/site-config.ts`, 컴포넌트, 스키마 변경 없음
- 새 커버 이미지 제작·크롭 없음 (캡처 원본 사용)
