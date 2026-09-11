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
description_en: A personal investing dashboard that brings Korean and US market indicators, investor flows, ETFs, guru portfolios, and filings into one screen for daily tracking.
description_ko: 국내·미국 시장 지표, 투자자별 수급, ETF, 대가 포트폴리오, 공시를 한 화면에 모아 매일 추적하는 개인 투자 대시보드.
dek_en: The morning rounds across a dozen market sites, on one screen.
dek_ko: 여러 사이트를 돌던 아침 시장 확인을, 한 화면에서.
overview_ko: |
  **왜 만들었나.** 매일 HTS, 네이버 증권, 인베스팅, CNN, 13F 사이트를 돌아다니며 보던 시장 지표·수급·공시를 한 화면에 모으고 싶었다. 여기에 외국인·기관이 무엇을 사고파는지 매일 흐름을 따라가며 투자 판단의 근거로 삼을 수 있게 만들었다.

  - 국내·미국 지수, 환율, 금리, 원자재, VIX·공포탐욕지수를 카드로 한눈에
  - 투자자별(외국인·기관·개인) 순매수 상위 종목과 장중 누적 수급 차트
  - ETF 랭킹·비교, 관심종목, 대가(13F) 포트폴리오 추적
  - 종목 상세에서 DART·SEC EDGAR 공시와 재무 확인, 대가 공시 등 알림을 메일·Telegram으로
  - 배치 수집기가 한국투자증권·DART·SEC·FRED 등에서 데이터를 채우는 Go(Echo/GORM) + Next.js 구조, Kubernetes(Helm) 배포

  **배운 것.** 외부 데이터 소스마다 갱신 주기와 실패 양상이 달라서, 값만 보여주면 화면이 틀린 사실을 말하게 된다. 수집 시각 배지와 '데이터 현황' 화면으로 데이터가 실제로 채워지고 있는지를 함께 보여주는 게 필수였다.
overview_en: |
  **Why I built it.** Every day I was hopping between my brokerage app, Naver Finance, Investing.com, CNN, and 13F trackers just to check market indicators, investor flows, and filings. I wanted all of it on one screen — and a way to follow what foreign and institutional investors are buying and selling, day by day, as input for my own decisions.

  - Korean and US indices, FX, rates, commodities, VIX, and Fear & Greed as at-a-glance cards
  - Top net-buy stocks by investor type (foreign / institutional / retail) and intraday cumulative flow charts
  - ETF rankings and comparison, a watchlist, and guru (13F) portfolio tracking
  - Stock detail pages with DART / SEC EDGAR filings and financials, plus email / Telegram alerts for events like new guru filings
  - Batch collectors fill data from KIS, DART, SEC, FRED, and more into a Go (Echo/GORM) + Next.js stack, deployed on Kubernetes (Helm)

  **What I learned.** Every external data source has its own refresh cadence and failure modes, so showing values alone lets the screen state things that aren't true. Collection timestamps and a "data health" view that shows whether data is actually arriving turned out to be essential.
---
