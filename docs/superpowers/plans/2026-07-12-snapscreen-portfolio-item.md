# SnapScreen 포트폴리오 항목 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `v2.advenoh.pe.kr` 포트폴리오 그리드에 SnapScreen 항목을 추가한다 (MQTT Insight 다음, order 4).

**Architecture:** 코드 변경 없음. `lib/portfolio.ts`가 빌드 시점에 `contents/website/*/index.md`를 자동 로드하므로, 신규 콘텐츠 폴더 추가 + 기존 항목 `order` +1 재배치만으로 구현한다. 검증은 zod 스키마 + 정적 빌드 + `npm run dev` 렌더 확인.

**Tech Stack:** Next.js 16 static export, gray-matter frontmatter, zod 검증. 콘텐츠는 마크다운.

**Spec:** `docs/superpowers/specs/2026-07-12-snapscreen-portfolio-item-design.md`

**Branch:** `feature/snapscreen-portfolio` (이미 생성됨, 설계 문서 커밋 완료)

---

### Task 1: 신규 콘텐츠 폴더 생성 (index.md + cover.png)

**Files:**
- Create: `contents/website/snapscreen/index.md`
- Create: `contents/website/snapscreen/cover.png` (복사)

- [ ] **Step 1: 폴더 생성 및 커버 이미지 복사**

Run:
```bash
mkdir -p contents/website/snapscreen
cp ../snapscreen/docs/screenshots/annotation-editor.png contents/website/snapscreen/cover.png
```
Expected: `contents/website/snapscreen/cover.png` 생성 (1852×1430, ~1.3MB)

- [ ] **Step 2: index.md 작성**

`contents/website/snapscreen/index.md` 를 아래 내용으로 생성 (스펙과 동일):

```markdown
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
```

- [ ] **Step 3: UTF-8 인코딩 확인**

Run: `file -I contents/website/snapscreen/index.md`
Expected: `text/plain; charset=utf-8`

---

### Task 2: 기존 항목 order 재배치 (4개 → 한 칸씩 뒤로)

**Files:**
- Modify: `contents/website/summora/index.md` (order 4 → 5)
- Modify: `contents/website/status/index.md` (Advenoh Status, order 5 → 6)
- Modify: `contents/website/it-blog/index.md` (order 6 → 7)
- Modify: `contents/website/investment-blog/index.md` (Investment Insights, order 7 → 8)
- Modify: `contents/website/ai-chatbot/index.md` (order 8 → 9)

> 주의: 반드시 큰 order부터 낮춰 내려오며(8→9, 7→8, ...) 수정하거나, 각 파일에서 정확한 현재 값을 확인 후 교체한다. `order:` 라인은 각 `index.md` frontmatter 상단에 1개씩 존재한다.

- [ ] **Step 1: 각 파일의 현재 order 확인**

Run: `grep -n '^order:' contents/website/{summora,status,it-blog,investment-blog,ai-chatbot}/index.md`
Expected: 각각 order: 4, 5, 6, 7, 8

- [ ] **Step 2: order 값을 +1로 수정**

각 파일의 `order:` 라인을 교체:
- `contents/website/ai-chatbot/index.md`: `order: 8` → `order: 9`
- `contents/website/investment-blog/index.md`: `order: 7` → `order: 8`
- `contents/website/it-blog/index.md`: `order: 6` → `order: 7`
- `contents/website/status/index.md`: `order: 5` → `order: 6`
- `contents/website/summora/index.md`: `order: 4` → `order: 5`

- [ ] **Step 3: 재배치 결과 검증**

Run: `for d in contents/website/*/; do o=$(grep -m1 '^order:' "$d/index.md" | sed 's/order: *//'); echo "$o $d"; done | sort -n`
Expected: 1 InspireMe, 2 Markora, 3 mqtt-insight, 4 snapscreen, 5 summora, 6 status, 7 it-blog, 8 investment-blog, 9 ai-chatbot — order 중복/누락 없음

---

### Task 3: 빌드 검증 및 렌더 확인

- [ ] **Step 1: 타입 검사**

Run: `npm run check`
Expected: 에러 없이 통과

- [ ] **Step 2: 정적 빌드 (zod frontmatter 검증 포함)**

Run: `npm run build`
Expected: 빌드 성공. `out/` 생성. frontmatter 오류 시 zod가 빌드를 실패시킨다.

- [ ] **Step 3: dev 서버로 렌더 확인**

Run: `npm run dev` 후 http://localhost:3000 (en) 및 http://localhost:3000/ko/ 확인
Expected:
- SnapScreen 카드가 MQTT Insight 다음(4번째)에 표시
- 커버 이미지, 제목(SnapScreen), description, stack 뱃지 정상 렌더
- en/ko 각 로케일에서 해당 언어 필드 표시
- 카드/상세의 링크가 `https://snapscreen.advenoh.pe.kr/`로 연결

---

### Task 4: 커밋 및 PR

- [ ] **Step 1: 콘텐츠 변경 커밋**

Run:
```bash
git add contents/website/snapscreen contents/website/summora contents/website/status contents/website/it-blog contents/website/investment-blog contents/website/ai-chatbot
git commit -m "feat: SnapScreen 포트폴리오 항목 추가 (order 4)

MQTT Insight 다음에 SnapScreen(macOS 오픈소스 스크린샷 앱) 카드 추가.
기존 Summora~AI Chatbot order를 5~9로 한 칸씩 재배치.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 2: (선택) /init CLAUDE.md 갱신 별도 커밋**

이번 세션에서 `/init`으로 갱신한 `CLAUDE.md`가 워킹트리에 남아 있으면 별도 커밋:
```bash
git add CLAUDE.md && git commit -m "docs: CLAUDE.md를 실제 아키텍처(외부 데이터/캐시/i18n)에 맞게 갱신

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

- [ ] **Step 3: 푸시 및 PR 생성**

Run:
```bash
git push -u origin feature/snapscreen-portfolio
gh pr create --title "feat: SnapScreen 포트폴리오 항목 추가" --body "$(cat <<'EOF'
## Summary
- 포트폴리오 그리드에 SnapScreen(macOS 오픈소스 스크린샷 캡처·주석 앱) 항목 추가
- 배치: MQTT Insight 다음(order 4), 이후 항목 5~9로 재배치
- 커버는 SnapScreen 저장소 `annotation-editor.png` 재활용, 링크는 `snapscreen.advenoh.pe.kr`

## Test plan
- [ ] `npm run check` 통과
- [ ] `npm run build` 성공 (zod frontmatter 검증)
- [ ] `npm run dev`에서 en/ko 그리드에 카드 정상 렌더 및 링크 확인
EOF
)"
```
Expected: PR 생성 URL 출력. (리뷰어 미지정 — 사용자가 직접 지정)

---

## Self-Review

- **Spec coverage:** 신규 폴더(Task 1), order 재배치(Task 2), 검증 방법(Task 3), UTF-8 확인(Task 1 Step 3) — 스펙의 모든 항목이 태스크에 매핑됨. 범위 제외 항목(스키마/컴포넌트/랜딩 사이트 변경 없음) 준수.
- **Placeholder scan:** frontmatter 전체 내용 포함, order 값 명시, 명령어·기대 출력 명시 — 플레이스홀더 없음.
- **경로 정확성:** Investment Insights = `investment-blog/`, Advenoh Status = `status/` 로 실제 폴더명 확인 완료.
