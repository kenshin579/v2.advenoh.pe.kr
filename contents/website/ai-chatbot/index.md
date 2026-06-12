---
site: https://ai-chatbot.advenoh.pe.kr/
title: AI Chatbot
cover: cover.png
stack:
  - Next.js
  - Python
  - FastAPI
  - LangChain
  - ChromaDB
  - OpenAI
  - Kubernetes
  - Helm
ext: .py
order: 7
status_en: live
status_ko: 운영 중
year_en: 2024 — now
year_ko: 2024 — 현재
role_en: Solo
role_ko: 단독
description_en: A RAG-based AI chatbot for the blog, providing intelligent Q&A about blog posts and technical content.
description_ko: 블로그 포스트와 기술 콘텐츠에 대해 지능적인 Q&A를 제공하는 RAG 기반 AI 챗봇.
dek_en: A RAG-based blog Q&A chatbot — embeds tech blog and investment blog content for natural language queries.
dek_ko: RAG 기반 블로그 Q&A 챗봇 — 기술 블로그/투자 블로그 콘텐츠를 임베딩해 자연어로 질의응답.
overview_ko: |
  **왜 만들었나.** 글이 쌓일수록 키워드 검색이 한계에 부딪히는 블로그를, 자연어 질의로 탐색할 수 있게 만들고 싶었다.

  - Markdown loader → chunker → OpenAI embedder → ChromaDB → LangChain chain
  - `blog-v2` / `investment` 두 블로그를 별도 collection 으로 분리한 다중 블로그 지원
  - Frontend (Next.js 16) + Backend (FastAPI) 모노레포 구조
  - Docker 멀티플랫폼 빌드 (arm64/amd64) + GitHub Actions 자동 배포

  **배운 것.** 좋은 청킹이 절반. 평가 파이프라인이 곧 제품.
overview_en: |
  **Why I built it.** As blog posts accumulated, keyword search hit its limits. I wanted to make the blog explorable through natural language queries.

  - Markdown loader → chunker → OpenAI embedder → ChromaDB → LangChain chain
  - Multi-blog support with separate collections for `blog-v2` and `investment`
  - Monorepo structure: Frontend (Next.js 16) + Backend (FastAPI)
  - Docker multi-platform builds (arm64/amd64) with automated GitHub Actions deployment

  **What I learned.** Good chunking is half the battle. The evaluation pipeline is the product.
---
