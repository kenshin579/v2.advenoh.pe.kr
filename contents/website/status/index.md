---
site: https://status.advenoh.pe.kr/
title: Advenoh Status
cover: cover.png
stack:
  - Next.js
  - Python
  - Supabase
  - GitHub Actions
  - Netlify
ext: .ts
order: 6
status_en: live
status_ko: 운영 중
year_en: 2026 — now
year_ko: 2026 — 현재
role_en: Solo
role_ko: 단독
description_en: A system server monitoring service that displays real-time status and 90-day uptime history of all personal services.
description_ko: 모든 개인 서비스의 실시간 상태와 90일 업타임 이력을 보여주는 서버 모니터링 서비스.
dek_en: Personal service availability monitoring — GitHub Actions cron health checks + Supabase + static dashboard.
dek_ko: 개인 서비스 가용성 모니터링 — GitHub Actions cron 헬스체크 + Supabase + 정적 대시보드.
overview_ko: |
  5분 주기 GitHub Actions가 Python 헬스체크를 실행해 Supabase Postgres에 상태 변경을 기록하고,
  Next.js 정적 대시보드가 90일 uptime 그리드와 월별 캘린더를 렌더한다. 
  상태 변경 시에만 Telegram Bot으로 알림을 보내 과알림을 방지한다.
overview_en: |
  A GitHub Actions workflow runs Python health checks every 5 minutes, recording status changes to Supabase Postgres.
  A Next.js static dashboard renders a 90-day uptime grid and monthly calendar.
  Telegram Bot notifications fire only on status changes, preventing alert fatigue.
---
