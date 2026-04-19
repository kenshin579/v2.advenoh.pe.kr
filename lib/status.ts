import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { withCache } from './cache'

const statusLevelSchema = z.enum(['OK', 'WARN', 'ERROR'])

const serviceSnapshotSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  currentStatus: statusLevelSchema,
  lastChecked: z.string(),
})

export const statusSnapshotSchema = z.object({
  fetchedAt: z.string(),
  services: z.array(serviceSnapshotSchema),
  summary: z.object({
    up: z.number(),
    total: z.number(),
    uptime90d: z.number(),
    lastIncidentAt: z.string().nullable(),
  }),
})

export type StatusLevel = z.infer<typeof statusLevelSchema>
export type ServiceSnapshot = z.infer<typeof serviceSnapshotSchema>
export type StatusSnapshot = z.infer<typeof statusSnapshotSchema>

const FALLBACK: StatusSnapshot = {
  fetchedAt: new Date(0).toISOString(),
  services: [],
  summary: { up: 0, total: 0, uptime90d: 0, lastIncidentAt: null },
}

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env 미설정 (NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY)')
  return createClient(url, key, { auth: { persistSession: false } })
}

async function fetchStatusSnapshot(): Promise<StatusSnapshot> {
  const supabase = getClient()

  const { data: services, error: servicesErr } = await supabase
    .from('services')
    .select('id, name, url')
    .order('name', { ascending: true })
  if (servicesErr) throw new Error(`services: ${servicesErr.message}`)
  if (!services) throw new Error('services 응답 비어 있음')

  // 상태 변경 시에만 기록되므로 서비스별 최신 로그 1건씩 가져오려면
  // 최근 N건 → 클라이언트에서 집계가 단순. 서비스 수의 20배 여유.
  const { data: logs, error: logsErr } = await supabase
    .from('service_status_logs')
    .select('service_id, status, timestamp')
    .order('timestamp', { ascending: false })
    .limit(Math.max(200, services.length * 20))
  if (logsErr) throw new Error(`service_status_logs: ${logsErr.message}`)

  // 서비스별 가장 최근 로그만 남김
  const latestByService = new Map<string, { status: StatusLevel; timestamp: string }>()
  for (const log of logs ?? []) {
    if (latestByService.has(log.service_id)) continue
    latestByService.set(log.service_id, {
      status: log.status as StatusLevel,
      timestamp: log.timestamp,
    })
  }

  const servicesSnapshot: ServiceSnapshot[] = services.map(s => {
    const latest = latestByService.get(s.id)
    return {
      id: s.id,
      name: s.name,
      url: s.url,
      currentStatus: latest?.status ?? 'OK',
      lastChecked: latest?.timestamp ?? new Date().toISOString(),
    }
  })

  // 90일 uptime: daily_status_summary에서 OK 비율
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setUTCDate(ninetyDaysAgo.getUTCDate() - 90)
  const { data: summary, error: summaryErr } = await supabase
    .from('daily_status_summary')
    .select('status, date')
    .gte('date', ninetyDaysAgo.toISOString().slice(0, 10))
  if (summaryErr) throw new Error(`daily_status_summary: ${summaryErr.message}`)

  const totalDays = summary?.length ?? 0
  const okDays = summary?.filter(r => r.status === 'OK').length ?? 0
  const uptime90d = totalDays > 0 ? Math.round((okDays / totalDays) * 1000) / 10 : 100

  // 최근 사고: 가장 최근 WARN/ERROR 로그 timestamp
  const lastIncident = (logs ?? []).find(l => l.status !== 'OK')
  const lastIncidentAt = lastIncident?.timestamp ?? null

  const upCount = servicesSnapshot.filter(s => s.currentStatus === 'OK').length

  const snapshot: StatusSnapshot = {
    fetchedAt: new Date().toISOString(),
    services: servicesSnapshot,
    summary: {
      up: upCount,
      total: servicesSnapshot.length,
      uptime90d,
      lastIncidentAt,
    },
  }

  return statusSnapshotSchema.parse(snapshot)
}

export function getStatusSnapshot(): Promise<StatusSnapshot> {
  return withCache('status-snapshot.json', fetchStatusSnapshot, FALLBACK, 'status')
}
