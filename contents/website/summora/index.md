---
site: https://summora.advenoh.pe.kr/
title: Summora
cover: cover.png
stack:
  - Next.js
  - React
  - Go
  - Echo
  - GORM
  - MySQL
  - OpenAI
  - Kubernetes
  - Helm
ext: .go
order: 4
status_en: live
status_ko: 운영 중
year_en: 2026 — now
year_ko: 2026 — 현재
role_en: Solo
role_ko: 단독
description_en: A read-later service that automatically summarizes saved links and YouTube videos with AI, then organizes them by topic and tags.
description_ko: 저장한 링크와 유튜브 영상을 AI로 자동 요약하고, 주제·태그별로 정리해 주는 나중에 읽기 서비스.
dek_en: Save it now, let AI summarize and organize it for later.
dek_ko: 일단 저장하면, AI가 요약하고 정리해 주는 나중에 읽기.
overview_ko: |
  **왜 만들었나.** 읽으려고 저장해 둔 링크와 유튜브 영상이 쌓이기만 하고 다시 보지 않는 문제를 풀고 싶었다. 저장하는 순간 AI가 핵심을 요약하고 태그·주제로 분류해, '나중에'를 실제로 다시 찾아볼 수 있게 만들었다.

  - URL·유튜브 저장 시 본문/자막을 추출해 AI가 자동 요약
  - 글마다 5~7개 태그 + 주제 1개 + 마인드맵 자동 부여
  - 카테고리·태그 기반 피드 브라우징 및 필터링
  - Go(Echo/GORM) 백엔드 + Next.js 프런트엔드, Kubernetes(Helm)로 배포

  **배운 것.** 콘텐츠 추출은 소스(유튜브 자막 vs 웹 본문)마다 파이프라인을 다르게 가져가야 품질이 안정된다.
overview_en: |
  **Why I built it.** I wanted to solve the problem of links and YouTube videos piling up in a read-later pile that never gets revisited. The moment you save something, AI summarizes the essence and classifies it by tag and topic — so "later" actually becomes findable again.

  - Extracts article text/subtitles on save and auto-summarizes with AI
  - Auto-assigns 5–7 tags, one topic, and a mind map per item
  - Category- and tag-based feed browsing and filtering
  - Go (Echo/GORM) backend + Next.js frontend, deployed on Kubernetes (Helm)

  **What I learned.** Content extraction needs a different pipeline per source (YouTube subtitles vs. web article body) to keep summary quality consistent.
---
