---
site: https://markora.advenoh.pe.kr/
title: Markora
cover: cover.png
stack:
  - Kotlin
  - JetBrains Plugin SDK
  - JCEF
  - BlockNote
  - KaTeX
  - Mermaid
ext: .kt
order: 6
status_en: live
status_ko: 운영 중
year_en: 2026 — now
year_ko: 2026 — 현재
role_en: Solo
role_ko: 단독
description_en: A Typora-style WYSIWYG markdown editor plugin for JetBrains IDEs, providing real-time rendering without a separate preview pane.
description_ko: 별도 프리뷰 패널 없이 실시간 렌더링을 제공하는 JetBrains IDE용 Typora 스타일 WYSIWYG 마크다운 에디터 플러그인.
dek_en: A Typora-style WYSIWYG markdown editor plugin for JetBrains IDEs.
dek_ko: JetBrains IDE를 위한 Typora 스타일 WYSIWYG 마크다운 에디터 플러그인.
overview_ko: |
  **왜 만들었나.** JetBrains IDE에서 마크다운을 편집할 때 프리뷰 패널을 오가는 흐름을 없애고, Typora처럼 입력 즉시 렌더링되는 WYSIWYG 경험을 IDE 안으로 가져오고 싶었다.

  - JCEF + BlockNote 기반의 in-place WYSIWYG 에디터
  - `/` 슬래시 명령으로 제목·목록·코드·표·이미지 빠르게 삽입
  - KaTeX 수학 수식 / Mermaid 다이어그램 렌더링
  - IDE 다크/라이트 테마 자동 동기화, 1초 debounced 자동 저장
  - JetBrains IDE 2024.2+ 호환, MIT 오픈소스

  **배운 것.** WYSIWYG 편집기는 키맵보다 'undo가 직관적인가'가 사용자 경험을 좌우한다.
overview_en: |
  **Why I built it.** When editing markdown in JetBrains IDEs, I wanted to eliminate the constant back-and-forth with the preview pane and bring a Typora-like WYSIWYG experience — where content renders as you type — directly into the IDE.

  - In-place WYSIWYG editor built on JCEF + BlockNote
  - Slash `/` commands for quick insertion of headings, lists, code blocks, tables, and images
  - KaTeX math equations and Mermaid diagram rendering
  - Automatic dark/light theme sync with the IDE, 1-second debounced auto-save
  - Compatible with JetBrains IDEs 2024.2+, MIT open source

  **What I learned.** In a WYSIWYG editor, whether undo feels intuitive matters far more than the keymap.
---
