'use client'

import type { HeroStats } from '@/lib/stats'
import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import { Sparkline } from './Sparkline'

type StatsRowProps = {
  stats: HeroStats
  github: GithubContrib
  status: StatusSnapshot
}

export function StatsRow({ stats, github, status }: StatsRowProps) {
  // 주(week) 단위 contributionCount 합계 → 26개 sparkline 값
  const weekTotals = github.weeks.map(w =>
    w.contributionDays.reduce((sum, d) => sum + d.contributionCount, 0)
  )

  const allUp = status.summary.up === status.summary.total

  return (
    <div className="grid grid-cols-2 gap-[var(--profile-space-card)] sm:grid-cols-4">
      <Cell
        label="services up"
        value={`${stats.servicesUp.up}/${stats.servicesUp.total}`}
        trailing={
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: allUp ? 'var(--profile-green)' : 'var(--profile-yellow)',
              animation: 'profile-pulse 1.6s ease-in-out infinite',
            }}
          />
        }
      />

      <Cell
        label="commits · 26w"
        value={stats.commits26w.toLocaleString()}
        trailing={
          <Sparkline values={weekTotals} width={70} height={20} className="text-profile-accent" />
        }
      />

      <Cell
        label="uptime · 90d"
        value={`${stats.uptime90d.toFixed(1)}%`}
        trailing={
          <div className="flex h-5 items-end gap-[2px]">
            {/* 10-bar 시각화 — uptime90d% 기준 */}
            {Array.from({ length: 10 }).map((_, i) => {
              const filled = i < Math.round(stats.uptime90d / 10)
              return (
                <span
                  key={i}
                  className="w-[3px] rounded-sm"
                  style={{
                    height: filled ? `${6 + i * 1}px` : '4px',
                    backgroundColor: filled ? 'var(--profile-green)' : 'var(--profile-line-2)',
                  }}
                />
              )
            })}
          </div>
        }
      />

      <Cell
        label="blog posts"
        value={stats.blogPosts.toString()}
      />
    </div>
  )
}

function Cell({
  label,
  value,
  trailing,
}: {
  label: string
  value: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between rounded border border-profile-line bg-profile-bg-3 p-3">
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-profile-muted-2">
          {label}
        </span>
        {trailing && <div className="flex items-center">{trailing}</div>}
      </div>
      <div className="mt-2 font-mono text-xl font-semibold text-profile-fg">{value}</div>
    </div>
  )
}
