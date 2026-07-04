# mqtt-insight 포트폴리오 항목 추가 — 디자인 문서

- 날짜: 2026-07-04
- 대상: `v2.advenoh.pe.kr` (Frank Oh 포트폴리오 정적 사이트)
- 결정 방식: 브레인스토밍 Q&A로 항목별 확정

## 목표

포트폴리오 그리드에 mqtt-insight(오픈소스 MQTT 데스크톱 클라이언트) 항목을 추가한다.
코드 변경 없이 콘텐츠 폴더 추가 + 기존 항목 `order` 조정만으로 구현한다.
(`lib/portfolio.ts`가 `contents/website/*/index.md`를 빌드 시점에 자동 로드하므로
스키마·컴포넌트 수정은 불필요하다.)

## 변경 사항

### 1. 신규 콘텐츠 폴더

`contents/website/mqtt-insight/` 생성:

- `index.md` — 아래 확정 콘텐츠로 작성
- `cover.png` — `mqtt-insight.advenoh.pe.kr/public/og.png`(2272×1824)를 그대로 복사.
  기존 커버들도 비율이 제각각이므로 크롭 불필요.

### 2. 기존 항목 order 조정

mqtt-insight를 Markora 다음(order 3)에 배치하고, 이후 항목을 한 칸씩 뒤로 민다.

| 항목 | 기존 order | 변경 order |
|---|---|---|
| InspireMe | 1 | 1 (유지) |
| Markora | 2 | 2 (유지) |
| **mqtt-insight** | — | **3 (신규)** |
| Summora | 3 | 4 |
| Advenoh Status | 4 | 5 |
| IT Blog | 5 | 6 |
| Investment Insights | 6 | 7 |
| AI Chatbot | 7 | 8 |

## 확정된 index.md 콘텐츠

```yaml
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
description_en: An open-source MQTT desktop client for IoT and embedded debugging —
  real-time topic tree, live charts, MQTT 5.0, and per-topic recording on macOS and Windows.
description_ko: IoT·임베디드 디버깅을 위한 오픈소스 MQTT 데스크톱 클라이언트.
  실시간 토픽 트리, 라이브 차트, MQTT 5.0, 토픽별 기록을 macOS·Windows에서 제공.
dek_en: See what your devices are actually saying.
dek_ko: 당신의 MQTT 트래픽을, 한눈에 보이게.
overview_ko: |
  **왜 만들었나.** IoT·임베디드 개발에서 디바이스가 실제로 무슨 메시지를 주고받는지
  확인하는 일이 늘 번거로웠다. 브로커에 연결하면 토픽 구조가 자동으로 그려지고,
  숫자 payload는 바로 차트가 되는 데스크톱 클라이언트를 만들었다.

  - `#`/`+` 와일드카드 구독으로 토픽 트리 자동 집계, 노드마다 최신 값 표시
  - 숫자 payload 실시간 차트(now/min/max/avg), JSON/Hex/Base64 포맷 뷰 + 변경값 diff 하이라이트
  - MQTT 3.1.1/5.0, TCP·TLS·WebSocket 연결 프로필, MQTT 5.0 properties 지원 발행 패널
  - 원하는 토픽만 골라 SQLite로 기록하고 히스토리 조회
  - Wails v2: Go 백엔드 + React 프런트엔드 단일 데스크톱 앱 (macOS·Windows)

  **배운 것.** 고빈도 MQTT 수신은 UI에 그대로 흘리면 안 된다 — 50ms 배칭과 링 버퍼로
  백프레셔를 잡아야 메시지가 몰려도 UI가 버틴다.
overview_en: |
  **Why I built it.** In IoT and embedded development, figuring out what devices are
  actually sending has always been a hassle. I built a desktop client where connecting
  to a broker automatically draws the topic structure, and numeric payloads turn into
  live charts instantly.

  - Auto-aggregated topic tree from `#`/`+` wildcard subscriptions, latest value on every node
  - Real-time charts for numeric payloads (now/min/max/avg), JSON/Hex/Base64 format views with diff highlighting
  - MQTT 3.1.1/5.0, TCP/TLS/WebSocket connection profiles, publish panel with MQTT 5.0 properties
  - Per-topic recording to a local SQLite file with history browsing
  - Wails v2: Go backend + React frontend in a single desktop app (macOS & Windows)

  **What I learned.** High-frequency MQTT traffic must never flow straight into the UI —
  50ms batching and a ring buffer are what keep the UI responsive under message bursts.
---
```

## 결정 근거 (Q&A 요약)

- **site 링크**: 데스크톱 앱이라 접속형 서비스가 아님 → 홍보용 랜딩 사이트
  `https://mqtt-insight.advenoh.pe.kr/`로 연결 (GitHub 대신). 기존 `*.advenoh.pe.kr` 패턴과 일관.
- **배치**: 사용자 지정으로 Markora 다음(order 3).
- **커버**: 랜딩 사이트 `og.png` 재활용 (새 제작 불필요).
- **status**: 웹 서비스가 아니므로 `운영 중/live` 대신 `출시됨/released`.
  ("배포 중"은 deploying으로 읽혀 배제.)
- **dek**: 랜딩 히어로 카피를 그대로 사용.

## 에러 처리

빌드 시 `portfolioItemSchema`(zod)가 frontmatter를 검증하므로, 필드 오타·형식 오류는
빌드 실패로 즉시 드러난다. 별도 런타임 에러 처리는 불필요.

## 검증 방법

1. `npm run check` — 타입 검사 통과
2. `npm run build` — 정적 빌드 성공 (zod 검증 포함)
3. `npm run dev`로 그리드 확인:
   - mqtt-insight 카드가 Markora 다음(3번째)에 표시
   - 커버 이미지, 제목, description, stack 뱃지 정상 렌더링
   - en/ko 로케일 모두에서 각 언어 필드 표시
   - 카드 클릭(또는 상세) 시 `https://mqtt-insight.advenoh.pe.kr/`로 연결
4. `file -I contents/website/mqtt-insight/index.md` — UTF-8 인코딩 확인

## 범위 제외

- 랜딩 사이트(`mqtt-insight.advenoh.pe.kr`) 쪽 변경 없음
- `lib/portfolio.ts`, 컴포넌트, 스키마 변경 없음
- 새 커버 이미지 제작 없음
