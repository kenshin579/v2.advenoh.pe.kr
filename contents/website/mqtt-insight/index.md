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
