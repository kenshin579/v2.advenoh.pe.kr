# mqtt-insight 포트폴리오 항목 추가 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포트폴리오 그리드에 mqtt-insight 항목을 Markora 다음(order 3) 위치로 추가한다.

**Architecture:** `lib/portfolio.ts`가 `contents/website/*/index.md`를 빌드 시점에 자동 로드하므로 코드 변경 없이 콘텐츠 폴더 추가 + 기존 5개 항목의 `order` 값 조정만으로 구현한다. frontmatter는 zod 스키마(`portfolioItemSchema`)가 빌드 시 검증하므로, `npm run build` 성공이 곧 데이터 검증 통과다.

**Tech Stack:** Next.js 16 정적 export, gray-matter frontmatter, zod

**Spec:** `docs/superpowers/specs/2026-07-04-mqtt-insight-portfolio-item-design.md`

**작업 디렉토리:** `/Users/user/src/workspace_blogv2/v2.advenoh.pe.kr` (브랜치: `feature/mqtt-insight-portfolio`)

---

### Task 1: mqtt-insight 콘텐츠 폴더 생성

**Files:**
- Create: `contents/website/mqtt-insight/cover.png` (복사)
- Create: `contents/website/mqtt-insight/index.md`

- [ ] **Step 1: 폴더 생성 및 커버 이미지 복사**

랜딩 사이트의 og.png를 그대로 복사한다 (크롭 불필요 — 기존 커버들도 비율 제각각):

```bash
mkdir -p contents/website/mqtt-insight
cp ../mqtt-insight.advenoh.pe.kr/public/og.png contents/website/mqtt-insight/cover.png
```

- [ ] **Step 2: 복사 결과 확인**

Run: `file contents/website/mqtt-insight/cover.png`
Expected: `PNG image data, 2272 x 1824, 8-bit/color RGBA, non-interlaced`

- [ ] **Step 3: index.md 작성**

`contents/website/mqtt-insight/index.md`를 아래 내용 그대로 생성한다 (Write 도구 사용, 전체 내용이 frontmatter이며 본문은 없음):

```markdown
---
site: https://mqtt-insight.advenoh.pe.kr/
title: MQTT Insight
cover: cover.png
stack:
  - Wails
  - Go
  - React
  - TypeScript
  - Vite
  - SQLite
  - MQTT
ext: .go
order: 3
status_en: released
status_ko: 출시됨
year_en: 2026 — now
year_ko: 2026 — 현재
role_en: Solo
role_ko: 단독
description_en: An open-source MQTT desktop client for IoT and embedded debugging — real-time topic tree, live charts, MQTT 5.0, and per-topic recording on macOS and Windows.
description_ko: IoT·임베디드 디버깅을 위한 오픈소스 MQTT 데스크톱 클라이언트. 실시간 토픽 트리, 라이브 차트, MQTT 5.0, 토픽별 기록을 macOS·Windows에서 제공.
dek_en: See what your devices are actually saying.
dek_ko: 당신의 MQTT 트래픽을, 한눈에 보이게.
overview_ko: |
  **왜 만들었나.** IoT·임베디드 개발에서 디바이스가 실제로 무슨 메시지를 주고받는지 확인하는 일이 늘 번거로웠다. 브로커에 연결하면 토픽 구조가 자동으로 그려지고, 숫자 payload는 바로 차트가 되는 데스크톱 클라이언트를 만들었다.

  - `#`/`+` 와일드카드 구독으로 토픽 트리 자동 집계, 노드마다 최신 값 표시
  - 숫자 payload 실시간 차트(now/min/max/avg), JSON/Hex/Base64 포맷 뷰 + 변경값 diff 하이라이트
  - MQTT 3.1.1/5.0, TCP·TLS·WebSocket 연결 프로필, MQTT 5.0 properties 지원 발행 패널
  - 원하는 토픽만 골라 SQLite로 기록하고 히스토리 조회
  - Wails v2: Go 백엔드 + React 프런트엔드 단일 데스크톱 앱 (macOS·Windows)

  **배운 것.** 고빈도 MQTT 수신은 UI에 그대로 흘리면 안 된다 — 50ms 배칭과 링 버퍼로 백프레셔를 잡아야 메시지가 몰려도 UI가 버틴다.
overview_en: |
  **Why I built it.** In IoT and embedded development, figuring out what devices are actually sending has always been a hassle. I built a desktop client where connecting to a broker automatically draws the topic structure, and numeric payloads turn into live charts instantly.

  - Auto-aggregated topic tree from `#`/`+` wildcard subscriptions, latest value on every node
  - Real-time charts for numeric payloads (now/min/max/avg), JSON/Hex/Base64 format views with diff highlighting
  - MQTT 3.1.1/5.0, TCP/TLS/WebSocket connection profiles, publish panel with MQTT 5.0 properties
  - Per-topic recording to a local SQLite file with history browsing
  - Wails v2: Go backend + React frontend in a single desktop app (macOS & Windows)

  **What I learned.** High-frequency MQTT traffic must never flow straight into the UI — 50ms batching and a ring buffer are what keep the UI responsive under message bursts.
---
```

- [ ] **Step 4: UTF-8 인코딩 확인**

Run: `file -I contents/website/mqtt-insight/index.md`
Expected: `text/plain; charset=utf-8` (`charset=binary`이면 Bash heredoc으로 재생성)

- [ ] **Step 5: 커밋**

```bash
git add contents/website/mqtt-insight/
git commit -m "feat: mqtt-insight 포트폴리오 항목 추가

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 2: 기존 항목 order 조정

mqtt-insight가 order 3에 들어가므로 Summora부터 뒤 항목을 한 칸씩 민다.

**Files:**
- Modify: `contents/website/summora/index.md` (order: 3 → 4)
- Modify: `contents/website/status/index.md` (order: 4 → 5)
- Modify: `contents/website/it-blog/index.md` (order: 5 → 6)
- Modify: `contents/website/investment-blog/index.md` (order: 6 → 7)
- Modify: `contents/website/ai-chatbot/index.md` (order: 7 → 8)

- [ ] **Step 1: 5개 파일의 order 값 수정**

각 파일의 frontmatter에서 `order:` 라인만 수정한다 (Edit 도구 사용):

| 파일 | old_string | new_string |
|---|---|---|
| `contents/website/summora/index.md` | `order: 3` | `order: 4` |
| `contents/website/status/index.md` | `order: 4` | `order: 5` |
| `contents/website/it-blog/index.md` | `order: 5` | `order: 6` |
| `contents/website/investment-blog/index.md` | `order: 6` | `order: 7` |
| `contents/website/ai-chatbot/index.md` | `order: 7` | `order: 8` |

- [ ] **Step 2: 전체 order 최종 확인**

Run: `grep -H '^order:' contents/website/*/index.md | sort -t: -k3 -n`
Expected (order 순):

```
contents/website/inspire-me/index.md:order: 1
contents/website/markora/index.md:order: 2
contents/website/mqtt-insight/index.md:order: 3
contents/website/summora/index.md:order: 4
contents/website/status/index.md:order: 5
contents/website/it-blog/index.md:order: 6
contents/website/investment-blog/index.md:order: 7
contents/website/ai-chatbot/index.md:order: 8
```

- [ ] **Step 3: 커밋**

```bash
git add contents/website/summora/index.md contents/website/status/index.md contents/website/it-blog/index.md contents/website/investment-blog/index.md contents/website/ai-chatbot/index.md
git commit -m "chore: mqtt-insight 삽입에 따른 포트폴리오 order 재정렬

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: 빌드 검증

**Files:** 없음 (검증만)

- [ ] **Step 1: 타입 검사**

Run: `npm run check`
Expected: 에러 없이 종료 (exit 0)

- [ ] **Step 2: 프로덕션 빌드**

Run: `npm run build`
Expected: 빌드 성공. zod 검증 실패 시 여기서 에러가 나므로, 성공하면 frontmatter 스키마 통과 확인 완료.

- [ ] **Step 3: 정적 output에 mqtt-insight 포함 확인**

Run: `grep -rl "mqtt-insight" out/index.html out/ko/index.html 2>/dev/null || grep -rl "MQTT Insight" out/ | head -5`
Expected: 홈 페이지 HTML(en/ko)에 mqtt-insight 카드가 포함됨

---

### Task 4: dev 서버 육안 확인

**Files:** 없음 (검증만)

- [ ] **Step 1: dev 서버 실행**

Run: `npm run dev` (백그라운드)
Expected: `http://localhost:3000` 기동

- [ ] **Step 2: 그리드 확인 (en/ko)**

브라우저(Playwright/chrome-devtools MCP 또는 사용자 직접)로 확인:
- `http://localhost:3000` — mqtt-insight 카드가 Markora 다음 3번째 위치에 표시
- 커버 이미지, 제목 "MQTT Insight", description, stack 뱃지 정상 렌더링
- 한국어 로케일에서 `출시됨`, `2026 — 현재`, `단독` 표시
- 카드의 site 링크가 `https://mqtt-insight.advenoh.pe.kr/`로 연결
- 상세(overview) 영역에 ko/en overview가 마크다운 렌더링됨

- [ ] **Step 3: dev 서버 종료**

백그라운드 프로세스 종료.

---

## 완료 후

superpowers:finishing-a-development-branch 스킬로 마무리 (PR 생성 시 `gh pr create` + HEREDOC, 리뷰어 지정 금지).
