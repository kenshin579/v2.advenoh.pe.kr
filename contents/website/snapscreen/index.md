---
site: https://snapscreen.advenoh.pe.kr/
title: SnapScreen
cover: cover.png
stack:
  - Swift
  - AppKit
  - SwiftUI
  - SwiftPM
  - Vision
ext: .swift
order: 4
status_en: open source
status_ko: 오픈소스
year_en: 2026 — now
year_ko: 2026 — 현재
role_en: Solo
role_ko: 단독
description_en: A free, open-source screenshot capture and annotation tool for macOS — capture, mark up, blur, and extract text, all from the menu bar.
description_ko: 메뉴바에서 캡처·주석·모자이크·텍스트 추출까지 한 번에 처리하는 macOS용 무료 오픈소스 스크린샷 도구.
dek_en: Capture, annotate, and share screenshots without leaving the menu bar.
dek_ko: 메뉴바를 떠나지 않고 캡처하고, 주석 달고, 공유한다.
overview_ko: |
  **왜 만들었나.** macOS 기본 스크린샷은 캡처 후 주석·모자이크·텍스트 추출을 하려면 다른 앱을 오가야 한다. 캡처부터 편집·공유까지 메뉴바 하나에서 끝내고 싶어 직접 만들었다.

  - 영역·창·전체 화면 캡처 (전역 단축키 ⌘⇧1 / ⌘⇧2 / ⌘⇧0)
  - 화살표·사각형·원·텍스트·블러·모자이크·번호·펜 주석 도구와 크롭
  - Vision 기반 OCR로 이미지 속 텍스트를 클립보드로 추출
  - 최근 캡처 갤러리, 저장 위치 자동 동기화, 클립보드/파일 내보내기
  - Swift(AppKit + SwiftUI)·SwiftPM, Xcode 프로젝트 없이 전 과정 CLI 빌드

  **배운 것.** 화면 기록 권한(TCC)이 앱 번들의 코드 서명 해시에 귀속돼, ad-hoc 서명으로는 빌드가 바뀔 때마다 권한이 리셋된다 — 배포에는 정식 코드 서명이 필요하다.
overview_en: |
  **Why I built it.** macOS's built-in screenshot tool makes you hop between apps to annotate, blur, or extract text after capturing. I wanted the whole flow — capture, edit, share — to live in one menu-bar app.

  - Region / window / full-screen capture with global shortcuts (⌘⇧1 / ⌘⇧2 / ⌘⇧0)
  - Annotation tools (arrow, rectangle, ellipse, text, blur, mosaic, number badge, pen) plus crop
  - Vision-based OCR that extracts on-image text straight to the clipboard
  - Recent-captures gallery, automatic save-location sync, clipboard/file export
  - Swift (AppKit + SwiftUI) on SwiftPM — built entirely via CLI, no Xcode project

  **What I learned.** Screen-recording permission (TCC) is bound to the app bundle's code-signing hash, so ad-hoc signing resets the grant on every rebuild — proper code signing is required for distribution.
---
