# SnapScreen 포트폴리오 항목 추가 — 디자인 문서

- 날짜: 2026-07-12
- 대상: `v2.advenoh.pe.kr` (Frank Oh 포트폴리오 정적 사이트)
- 결정 방식: 브레인스토밍 Q&A로 항목별 확정

## 목표

포트폴리오 그리드에 SnapScreen(오픈소스 macOS 스크린샷 캡처·주석 앱) 항목을 추가한다.
코드 변경 없이 콘텐츠 폴더 추가 + 기존 항목 `order` 조정만으로 구현한다.
(`lib/portfolio.ts`가 `contents/website/*/index.md`를 빌드 시점에 자동 로드하므로
스키마·컴포넌트 수정은 불필요하다.)

## 변경 사항

### 1. 신규 콘텐츠 폴더

`contents/website/snapscreen/` 생성:

- `index.md` — 아래 확정 콘텐츠로 작성
- `cover.png` — `snapscreen/docs/screenshots/annotation-editor.png`(1852×1430)를 그대로 복사.
  기존 커버들도 비율이 제각각(mqtt 2272×1824, summora 세로형 1600×1760)이므로 크롭 불필요.

### 2. 기존 항목 order 조정

SnapScreen을 MQTT Insight 다음(order 4)에 배치하고, 이후 항목을 한 칸씩 뒤로 민다.

| 항목 | 기존 order | 변경 order |
|---|---|---|
| InspireMe | 1 | 1 (유지) |
| Markora | 2 | 2 (유지) |
| MQTT Insight | 3 | 3 (유지) |
| **SnapScreen** | — | **4 (신규)** |
| Summora | 4 | 5 |
| Advenoh Status | 5 | 6 |
| IT Blog | 6 | 7 |
| Investment Insights | 7 | 8 |
| AI Chatbot | 8 | 9 |

## 확정된 index.md 콘텐츠

```yaml
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
description_en: A free, open-source screenshot capture and annotation tool for macOS —
  capture, mark up, blur, and extract text, all from the menu bar.
description_ko: 메뉴바에서 캡처·주석·모자이크·텍스트 추출까지 한 번에 처리하는
  macOS용 무료 오픈소스 스크린샷 도구.
dek_en: Capture, annotate, and share screenshots without leaving the menu bar.
dek_ko: 메뉴바를 떠나지 않고 캡처하고, 주석 달고, 공유한다.
overview_ko: |
  **왜 만들었나.** macOS 기본 스크린샷은 캡처 후 주석·모자이크·텍스트 추출을 하려면
  다른 앱을 오가야 한다. 캡처부터 편집·공유까지 메뉴바 하나에서 끝내고 싶어 직접 만들었다.

  - 영역·창·전체 화면 캡처 (전역 단축키 ⌘⇧1 / ⌘⇧2 / ⌘⇧0)
  - 화살표·사각형·원·텍스트·블러·모자이크·번호·펜 주석 도구와 크롭
  - Vision 기반 OCR로 이미지 속 텍스트를 클립보드로 추출
  - 최근 캡처 갤러리, 저장 위치 자동 동기화, 클립보드/파일 내보내기
  - Swift(AppKit + SwiftUI)·SwiftPM, Xcode 프로젝트 없이 전 과정 CLI 빌드

  **배운 것.** 화면 기록 권한(TCC)이 앱 번들의 코드 서명 해시에 귀속돼,
  ad-hoc 서명으로는 빌드가 바뀔 때마다 권한이 리셋된다 — 배포에는 정식 코드 서명이 필요하다.
overview_en: |
  **Why I built it.** macOS's built-in screenshot tool makes you hop between apps to
  annotate, blur, or extract text after capturing. I wanted the whole flow —
  capture, edit, share — to live in one menu-bar app.

  - Region / window / full-screen capture with global shortcuts (⌘⇧1 / ⌘⇧2 / ⌘⇧0)
  - Annotation tools (arrow, rectangle, ellipse, text, blur, mosaic, number badge, pen) plus crop
  - Vision-based OCR that extracts on-image text straight to the clipboard
  - Recent-captures gallery, automatic save-location sync, clipboard/file export
  - Swift (AppKit + SwiftUI) on SwiftPM — built entirely via CLI, no Xcode project

  **What I learned.** Screen-recording permission (TCC) is bound to the app bundle's
  code-signing hash, so ad-hoc signing resets the grant on every rebuild —
  proper code signing is required for distribution.
---
```

## 결정 근거 (Q&A 요약)

- **site 링크**: 데스크톱 앱이라 접속형 서비스가 아님 → 홍보용 랜딩 사이트
  `https://snapscreen.advenoh.pe.kr/`로 연결 (GitHub 대신). 기존 `*.advenoh.pe.kr` 패턴과 일관.
- **배치**: 사용자 지정으로 MQTT Insight 다음(order 4). 같은 "데스크톱 앱 + 랜딩" 계열끼리 인접.
- **커버**: SnapScreen 저장소의 `docs/screenshots/annotation-editor.png` 재활용
  (툴바+캔버스+인스펙터가 모두 보이는 대표 화면). 새 제작 불필요.
- **status**: 웹 서비스가 아니고 오픈소스임을 강조하기 위해 `오픈소스/open source`.
  (mqtt-insight의 `출시됨/released`와 달리 오픈소스 성격을 명시.)
- **stack**: Swift/AppKit/SwiftUI/SwiftPM에 OCR용 `Vision` 프레임워크 포함.

## 에러 처리

빌드 시 `portfolioItemSchema`(zod)가 frontmatter를 검증하므로, 필드 오타·형식 오류는
빌드 실패로 즉시 드러난다. 별도 런타임 에러 처리는 불필요.

## 검증 방법

1. `npm run check` — 타입 검사 통과
2. `npm run build` — 정적 빌드 성공 (zod 검증 포함)
3. `npm run dev`로 그리드 확인:
   - SnapScreen 카드가 MQTT Insight 다음(4번째)에 표시
   - 커버 이미지, 제목, description, stack 뱃지 정상 렌더링
   - en/ko 로케일 모두에서 각 언어 필드 표시
   - 카드 클릭(또는 상세) 시 `https://snapscreen.advenoh.pe.kr/`로 연결
4. `file -I contents/website/snapscreen/index.md` — UTF-8 인코딩 확인

## 범위 제외

- 랜딩 사이트(`snapscreen.advenoh.pe.kr`) 쪽 변경 없음
- `lib/portfolio.ts`, 컴포넌트, 스키마 변경 없음
- 새 커버 이미지 제작 없음 (기존 스크린샷 재활용)
