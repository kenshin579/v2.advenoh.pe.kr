---
site: https://status.advenoh.pe.kr/
title: Advenoh Status
description: A system server monitoring service that displays real-time status and 90-day uptime history of all personal services.
cover: cover.png
status: live
year: 2026 — now
role: Solo
stack:
  - Next.js
  - Python
  - Supabase
  - GitHub Actions
  - Netlify
dek: 개인 서비스 가용성 모니터링 — GitHub Actions cron 헬스체크 + Supabase + 정적 대시보드.
overview: |
  5분 주기 GitHub Actions가 Python 헬스체크를 실행해 Supabase Postgres에 상태 변경을 기록하고,
  Next.js 정적 대시보드가 90일 uptime 그리드와 월별 캘린더를 렌더한다. 
  상태 변경 시에만 Telegram Bot으로 알림을 보내 과알림을 방지한다.
ext: .ts
order: 5
---
