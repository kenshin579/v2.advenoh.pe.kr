# MoneyFlow 포트폴리오 항목 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `v2.advenoh.pe.kr` 포트폴리오 그리드에 MoneyFlow 항목을 추가한다 (InspireMe 다음, order 2).

**Architecture:** 코드 변경 없음. `lib/portfolio.ts`가 빌드 시점에 `contents/website/*/index.md`를 자동 로드하므로, 신규 콘텐츠 폴더 추가 + 기존 항목 9개의 `order` +1 재배치만으로 구현한다. 커버 이미지는 prebuild(`scripts/copy-portfolio-images.js`)가 `public/portfolio/`로 복사한다. 검증은 zod 스키마 + 정적 빌드 + 기존 Playwright 테스트 + 로컬 렌더 확인.

**Tech Stack:** Next.js 16 static export, gray-matter frontmatter, zod 검증, Playwright. 콘텐츠는 마크다운.

**Spec:** `docs/superpowers/specs/2026-09-12-moneyflow-portfolio-item-design.md`

**Branch:** `feature/moneyflow-portfolio-item` (이미 생성됨, 설계 문서 커밋 완료)

**작업 디렉토리:** 모든 명령은 `v2.advenoh.pe.kr/` 루트에서 실행한다.

---

### Task 1: 신규 콘텐츠 폴더 생성 (index.md + cover.png)

**Files:**
- Create: `contents/website/moneyflow/index.md`
- Create: `contents/website/moneyflow/cover.png` (복사)

- [ ] **Step 1: 폴더 생성 및 커버 이미지 복사**

파일명에 한글·공백이 있으므로 glob으로 지정한다.

Run:
```bash
mkdir -p contents/website/moneyflow
cp ~/Desktop/Screenshots/*2026-09-11*9.47.42.png contents/website/moneyflow/cover.png
sips -g pixelWidth -g pixelHeight contents/website/moneyflow/cover.png
```
Expected: `pixelWidth: 3824`, `pixelHeight: 2484` (~1.25MB)

- [ ] **Step 2: index.md 작성**

`contents/website/moneyflow/index.md` 를 아래 내용으로 생성 (스펙과 동일, 긴 문자열은 한 줄로):

```markdown
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
```

- [ ] **Step 3: UTF-8 인코딩 확인**

Run: `file -I contents/website/moneyflow/index.md`
Expected: `text/plain; charset=utf-8`

---

### Task 2: 기존 항목 order 재배치 (9개 → 한 칸씩 뒤로)

**Files:**
- Modify: `contents/website/ai-chatbot/index.md` (order 10 → 11)
- Modify: `contents/website/investment-blog/index.md` (Investment Insights, order 9 → 10)
- Modify: `contents/website/it-blog/index.md` (order 8 → 9)
- Modify: `contents/website/status/index.md` (Advenoh Status, order 7 → 8)
- Modify: `contents/website/chronos-go/index.md` (order 6 → 7)
- Modify: `contents/website/summora/index.md` (order 5 → 6)
- Modify: `contents/website/snapscreen/index.md` (order 4 → 5)
- Modify: `contents/website/mqtt-insight/index.md` (order 3 → 4)
- Modify: `contents/website/markora/index.md` (order 2 → 3)

> 주의: `order:` 라인은 각 `index.md` frontmatter에 1개씩 존재한다. 파일마다 현재 값을 확인한 뒤 해당 라인만 교체한다. `inspire-me`(order 1)는 건드리지 않는다.

- [ ] **Step 1: 각 파일의 현재 order 확인**

Run: `grep -n '^order:' contents/website/{markora,mqtt-insight,snapscreen,summora,chronos-go,status,it-blog,investment-blog,ai-chatbot}/index.md`
Expected: 순서대로 order: 2, 3, 4, 5, 6, 7, 8, 9, 10

- [ ] **Step 2: order 값을 +1로 수정**

각 파일의 `order:` 라인을 교체:
- `contents/website/ai-chatbot/index.md`: `order: 10` → `order: 11`
- `contents/website/investment-blog/index.md`: `order: 9` → `order: 10`
- `contents/website/it-blog/index.md`: `order: 8` → `order: 9`
- `contents/website/status/index.md`: `order: 7` → `order: 8`
- `contents/website/chronos-go/index.md`: `order: 6` → `order: 7`
- `contents/website/summora/index.md`: `order: 5` → `order: 6`
- `contents/website/snapscreen/index.md`: `order: 4` → `order: 5`
- `contents/website/mqtt-insight/index.md`: `order: 3` → `order: 4`
- `contents/website/markora/index.md`: `order: 2` → `order: 3`

- [ ] **Step 3: 재배치 결과 검증**

Run: `for d in contents/website/*/; do o=$(grep -m1 '^order:' "$d/index.md" | sed 's/order: *//'); echo "$o $d"; done | sort -n`
Expected (중복/누락 없이 1~11):
```
1 contents/website/inspire-me/
2 contents/website/moneyflow/
3 contents/website/markora/
4 contents/website/mqtt-insight/
5 contents/website/snapscreen/
6 contents/website/summora/
7 contents/website/chronos-go/
8 contents/website/status/
9 contents/website/it-blog/
10 contents/website/investment-blog/
11 contents/website/ai-chatbot/
```

- [ ] **Step 4: diff가 order 라인만 바꿨는지 확인**

Run: `git diff --stat contents/website && git diff contents/website | grep -E '^[+-][^+-]'`
Expected: 9개 파일 각 1줄 변경, 출력은 `-order: N` / `+order: N+1` 쌍만 존재

---

### Task 3: 빌드 검증 및 렌더 확인

- [ ] **Step 1: 타입 검사**

Run: `npm run check`
Expected: 에러 없이 통과

- [ ] **Step 2: 정적 빌드 (prebuild 이미지 복사 + zod frontmatter 검증 포함)**

Run: `npm run build`
Expected: 빌드 성공, `out/` 생성. frontmatter 오류 시 zod가 빌드를 실패시킨다.

Run: `ls public/portfolio/moneyflow/ && grep -o 'MoneyFlow' out/index.html | head -1 && grep -o 'MoneyFlow' out/ko/index.html | head -1`
Expected: `cover.png`, `MoneyFlow`, `MoneyFlow`

- [ ] **Step 3: 기존 Playwright 테스트**

Run: `npm test`
Expected: 전체 통과 (카드 개수·순서에 의존하는 테스트는 없음. `seo.spec.ts`의 alt/lazy-loading 검사가 신규 카드에도 적용됨)

- [ ] **Step 4: 빌드 결과 렌더 확인**

Run: `npm run start` 후 http://localhost:3000/ (en), http://localhost:3000/ko/ 확인 (Playwright 또는 브라우저)
Expected:
- MoneyFlow 카드가 InspireMe 다음(2번째)에 표시, 이후 Markora → … → AI Chatbot 순서
- 커버 이미지, 제목(MoneyFlow), description, stack 뱃지 정상 렌더
- en/ko 각 로케일에서 해당 언어 필드 표시
- 카드 클릭 시 모달 overview(왜 만들었나/목록/배운 것) 렌더, 사이트 링크 `https://moneyflow.advenoh.pe.kr/`

확인 후 서버 종료.

---

### Task 4: 커밋 및 PR

- [ ] **Step 1: 콘텐츠 변경 커밋**

Run:
```bash
git add contents/website
git commit -F - <<'EOF'
feat: MoneyFlow 포트폴리오 항목 추가 (order 2)

InspireMe 다음에 MoneyFlow(개인 투자 대시보드) 카드 추가.
기존 Markora~AI Chatbot order를 3~11로 한 칸씩 재배치.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

- [ ] **Step 2: 구현 계획 문서 커밋**

Run:
```bash
git add docs/superpowers/plans/2026-09-12-moneyflow-portfolio-item.md
git commit -F - <<'EOF'
docs: MoneyFlow 포트폴리오 항목 추가 구현 계획

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
```

- [ ] **Step 3: 푸시 및 PR 생성**

Run:
```bash
git push -u origin feature/moneyflow-portfolio-item
gh pr create --title "feat: MoneyFlow 포트폴리오 항목 추가" --body "$(cat <<'EOF'
## Summary
- 포트폴리오 그리드에 MoneyFlow(국내·미국 시장 지표·수급·공시를 한 화면에 모은 개인 투자 대시보드) 항목 추가
- 배치: InspireMe 다음(order 2), 기존 Markora~AI Chatbot은 3~11로 재배치
- 커버는 moneyflow.advenoh.pe.kr 시장 화면 캡처, 사이드바 Links는 변경 없음

## Test plan
- [ ] `npm run check` 통과
- [ ] `npm run build` 성공 (zod frontmatter 검증)
- [ ] `npm test` 통과
- [ ] en/ko 그리드에서 2번째 카드로 렌더, 모달 overview 및 링크 확인

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
Expected: PR URL 출력. 리뷰어 미지정, 자동 머지 금지 — PR URL을 사용자에게 보고하고 종료.

---

## Self-Review

- **Spec coverage:** 신규 폴더·커버(Task 1), order 재배치 표(Task 2), 에러 처리=zod 빌드 검증(Task 3 Step 2), 검증 방법 1~5(Task 1 Step 3, Task 3), 범위 제외(코드·site-config 무변경 — Task 2 Step 4 diff 확인으로 보장). 모든 항목 매핑됨.
- **Placeholder scan:** frontmatter 전체, order 값, 명령어·기대 출력 명시 — 플레이스홀더 없음.
- **경로 정확성:** Investment Insights = `investment-blog/`, Advenoh Status = `status/`, 현재 order 값(2~10)은 2026-09-12 main 기준 grep으로 확인.
