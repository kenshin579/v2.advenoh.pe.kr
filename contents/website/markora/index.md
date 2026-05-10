---
site: https://markora.advenoh.pe.kr/
title: Markora
description: A Typora-style WYSIWYG markdown editor plugin for JetBrains IDEs, providing real-time rendering without a separate preview pane.
cover: cover.png
status: live
year: 2026 — now
role: Solo
stack:
  - Kotlin
  - JetBrains Plugin SDK
  - JCEF
  - BlockNote
  - KaTeX
  - Mermaid
dek: JetBrains IDE를 위한 Typora 스타일 WYSIWYG 마크다운 에디터 플러그인.
overview: |
  **왜 만들었나.** JetBrains IDE에서 마크다운을 편집할 때 프리뷰 패널을 오가는 흐름을 없애고, Typora처럼 입력 즉시 렌더링되는 WYSIWYG 경험을 IDE 안으로 가져오고 싶었다.

  - JCEF + BlockNote 기반의 in-place WYSIWYG 에디터
  - `/` 슬래시 명령으로 제목·목록·코드·표·이미지 빠르게 삽입
  - KaTeX 수학 수식 / Mermaid 다이어그램 렌더링
  - IDE 다크/라이트 테마 자동 동기화, 1초 debounced 자동 저장
  - JetBrains IDE 2024.2+ 호환, MIT 오픈소스

  **배운 것.** WYSIWYG 편집기는 키맵보다 'undo가 직관적인가'가 사용자 경험을 좌우한다.
ext: .kt
order: 6
---
