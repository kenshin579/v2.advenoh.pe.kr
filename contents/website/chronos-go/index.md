---
site: https://chronos-go.advenoh.pe.kr/
title: chronos-go
cover: cover.png
stack:
  - Go
  - Redis
  - Lua
ext: .go
order: 6
status_en: open source
status_ko: 오픈소스
year_en: 2026 — now
year_ko: 2026 — 현재
role_en: Solo
role_ko: 단독
description_en: A Redis-backed distributed task queue and scheduler for Go — a modern alternative to asynq that runs each scheduled job exactly once across all your instances.
description_ko: Go용 Redis 기반 분산 태스크 큐·스케줄러. asynq의 현대적 대안으로, 여러 인스턴스에서 각 스케줄 잡을 정확히 한 번만 실행한다.
dek_en: A Redis-backed distributed task queue & scheduler for Go — type-safe generics, a single-leader scheduler, and Chains & Groups.
dek_ko: Go용 Redis 기반 분산 태스크 큐·스케줄러 — 타입 안전 제네릭, 단일 리더 스케줄러, Chains & Groups.
overview_ko: |
  **왜 만들었나.** 오래 쓰던 asynq가 유지보수 모드로 들어갔다. 간단한 enqueue → handle 모델과 at-least-once 전달, 크래시 복구는 그대로 지키되, asynq의 약점 — 여러 인스턴스에서 스케줄 잡이 중복 실행되는 문제, 무한히 커지는 스트림/데드레터, 긴 처리 중 만료되는 유니크 락 — 을 고친 라이브러리를 원했다.

  - 타입 안전 제네릭 API — `interface{}` 페이로드도 수동 `json.Unmarshal`도 없이, 태스크 타입을 정의하고 `Handler[T]`를 등록
  - Redis Streams + ZSET — 즉시 실행은 Streams 컨슈머 그룹, 지연/재시도/보관 태스크는 sorted set. 해시 태그 키로 Cluster-safe
  - 분산 스케줄러 — 리더 선출로 트리거당 한 인스턴스만 enqueue, 결정론적 task ID로 리더 교체 중 중복 방지
  - 신뢰성 — 지수 백오프 + 지터 재시도, `XAUTOCLAIM` 크래시 복구, `OnDeadLetter` 훅
  - Chains & Groups — 순차 체인과 병렬 팬아웃, 데드레터 재실행으로 흐름 재개
  - 관측성 — Inspector API + `chronos` CLI + Prometheus·Grafana 스택

  **배운 것.** 분산 환경의 "정확히 한 번"은 결국 리더 선출과 결정론적 ID fencing의 조합이다. 그리고 Redis 메모리를 유한하게 유지하는 재니터가 있어야 오래 굴릴 수 있다.
overview_en: |
  **Why I built it.** asynq, which I'd relied on for years, went into maintenance mode. I wanted a library that keeps what made it good — the simple enqueue → handle model, at-least-once delivery, crash recovery — while fixing its biggest gaps: schedule jobs firing on every instance, unbounded stream/dead-letter growth, and unique locks expiring mid-processing.

  - Type-safe generic API — define a task type and register a `Handler[T]`; no `interface{}` payloads, no manual `json.Unmarshal`
  - Redis Streams + ZSETs — immediate work rides a Streams consumer group; delayed/retry/archived tasks live in sorted sets. Cluster-safe via hash-tagged keys
  - Distributed scheduler — a Redis leader election ensures only one instance enqueues each trigger; a deterministic task ID fences duplicates during hand-off
  - Reliable — retries with exponential backoff + jitter, `XAUTOCLAIM` crash recovery, an `OnDeadLetter` hook
  - Chains & Groups — sequential chains and parallel fan-out; re-running a dead-letter resumes the flow
  - Observability — an Inspector API, a `chronos` CLI, and a Prometheus + Grafana stack

  **What I learned.** "Exactly once" in a distributed system comes down to leader election plus deterministic-ID fencing. And you need a janitor keeping Redis bounded before you can run it for the long haul.
---
