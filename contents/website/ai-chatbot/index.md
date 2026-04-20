---
site: https://ai-chatbot.advenoh.pe.kr/
title: AI Chatbot
description: A RAG-based AI chatbot for the blog, providing intelligent Q&A about blog posts and technical content.
cover: cover.png
status: live
year: 2024 — now
role: Solo
stack:
  - Next.js 16
  - FastAPI
  - LangChain
  - ChromaDB
  - OpenAI
dek: RAG 기반 블로그 Q&A 챗봇 — 기술 블로그/투자 블로그 콘텐츠를 임베딩해 자연어로 질의응답.
overview: |
  **왜 만들었나.** 글이 쌓일수록 키워드 검색이 한계에 부딪히는 블로그를, 자연어 질의로 탐색할 수 있게 만들고 싶었다.

  - Markdown loader → chunker → OpenAI embedder → ChromaDB → LangChain chain
  - `blog-v2` / `investment` 두 블로그를 별도 collection 으로 분리한 다중 블로그 지원
  - Frontend (Next.js 16) + Backend (FastAPI) 모노레포 구조
  - Docker 멀티플랫폼 빌드 (arm64/amd64) + GitHub Actions 자동 배포

  **배운 것.** 좋은 청킹이 절반. 평가 파이프라인이 곧 제품.
ext: .py
order: 2
---
