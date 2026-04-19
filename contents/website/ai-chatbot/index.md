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
  블로그 콘텐츠를 임베딩해 자연어 질문에 답하는 RAG(Retrieval-Augmented Generation) 파이프라인.
  Markdown loader → chunker → OpenAI embedder → ChromaDB → LangChain chain 구조이며, 
  blog-v2와 investment 두 블로그를 각각의 collection으로 분리해 다중 블로그를 지원한다.
  Frontend/Backend 모노레포, Docker 멀티플랫폼 빌드, GitHub Actions 자동 배포.
ext: .py
order: 2
---
