'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { StatusSnapshot, StatusLevel } from '@/lib/status'

/**
 * 클라이언트 마운트 시 Supabase를 재조회해 initialData를 fresh로 교체.
 * 실패 시 initialData를 그대로 유지(에러 노출하지 않음).
 *
 * 서버측 lib/status.ts와 같은 값을 계산하므로 쿼리 구조가 일치해야 한다.
 * 테이블 스키마가 변경되면 두 곳을 함께 수정.
 */
export function useLiveStatus(initial: StatusSnapshot): StatusSnapshot {
  const [data, setData] = useState<StatusSnapshot>(initial)

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) return

    const supabase = createClient(url, key, { auth: { persistSession: false } })
    let cancelled = false

    ;(async () => {
      try {
        const { data: services, error: e1 } = await supabase
          .from('services')
          .select('id, name, url')
          .order('name', { ascending: true })
        if (e1 || !services) throw new Error(e1?.message ?? 'services empty')

        const { data: logs, error: e2 } = await supabase
          .from('service_status_logs')
          .select('service_id, status, timestamp')
          .order('timestamp', { ascending: false })
          .limit(Math.max(200, services.length * 20))
        if (e2) throw new Error(e2.message)

        const latest = new Map<string, { status: StatusLevel; timestamp: string }>()
        for (const log of logs ?? []) {
          if (latest.has(log.service_id)) continue
          latest.set(log.service_id, {
            status: log.status as StatusLevel,
            timestamp: log.timestamp,
          })
        }

        const svc = services.map(s => {
          const l = latest.get(s.id)
          return {
            id: s.id,
            name: s.name,
            url: s.url,
            currentStatus: l?.status ?? ('OK' as StatusLevel),
            lastChecked: l?.timestamp ?? new Date().toISOString(),
          }
        })

        const ninetyDaysAgo = new Date()
        ninetyDaysAgo.setUTCDate(ninetyDaysAgo.getUTCDate() - 90)
        const { data: summary } = await supabase
          .from('daily_status_summary')
          .select('status, date')
          .gte('date', ninetyDaysAgo.toISOString().slice(0, 10))

        const total = summary?.length ?? 0
        const ok = summary?.filter(r => r.status === 'OK').length ?? 0
        const uptime90d = total > 0 ? Math.round((ok / total) * 1000) / 10 : 100

        const lastIncident = (logs ?? []).find(l => l.status !== 'OK')

        if (cancelled) return
        setData({
          fetchedAt: new Date().toISOString(),
          services: svc,
          summary: {
            up: svc.filter(s => s.currentStatus === 'OK').length,
            total: svc.length,
            uptime90d,
            lastIncidentAt: lastIncident?.timestamp ?? null,
          },
        })
      } catch {
        // 실패 시 initialData 유지 — 에러 숨김
      }
    })()

    return () => { cancelled = true }
  }, [])

  return data
}
