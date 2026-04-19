'use client'

import type { ContributionLevel, GithubContrib } from '@/lib/github'

type CommitGraphProps = {
  data: GithubContrib
  size?: 'sm' | 'md'
}

const LEVEL_TO_DATA_L: Record<ContributionLevel, '0' | '1' | '2' | '3' | '4'> = {
  NONE: '0',
  FIRST_QUARTILE: '1',
  SECOND_QUARTILE: '2',
  THIRD_QUARTILE: '3',
  FOURTH_QUARTILE: '4',
}

const LEVEL_COLOR: Record<ContributionLevel, string> = {
  NONE: 'var(--profile-line-2)',
  FIRST_QUARTILE: 'color-mix(in oklch, var(--profile-accent) 30%, transparent)',
  SECOND_QUARTILE: 'color-mix(in oklch, var(--profile-accent) 55%, transparent)',
  THIRD_QUARTILE: 'color-mix(in oklch, var(--profile-accent) 80%, transparent)',
  FOURTH_QUARTILE: 'var(--profile-accent)',
}

export function CommitGraph({ data, size = 'sm' }: CommitGraphProps) {
  const cellSize = size === 'sm' ? 10 : 14
  const gap = 2

  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`GitHub contributions heatmap, 26 weeks, ${data.totalContributions} total`}
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${data.weeks.length}, ${cellSize}px)`,
          gap: `${gap}px`,
          gridAutoFlow: 'column',
          gridTemplateRows: `repeat(7, ${cellSize}px)`,
        }}
      >
        {data.weeks.map((week, wi) =>
          Array.from({ length: 7 }).map((_, di) => {
            const day = week.contributionDays[di]
            const level: ContributionLevel = day?.contributionLevel ?? 'NONE'
            const title = day
              ? `${day.date}: ${day.contributionCount} contributions`
              : ''
            return (
              <span
                key={`${wi}-${di}`}
                data-l={LEVEL_TO_DATA_L[level]}
                title={title}
                className="rounded-[2px]"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: LEVEL_COLOR[level],
                }}
              />
            )
          })
        )}
      </div>

      <div className="flex items-center justify-end gap-1 font-mono text-[10px] text-profile-muted-2">
        <span>Less</span>
        {(['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'] as ContributionLevel[]).map(l => (
          <span
            key={l}
            className="rounded-[2px]"
            style={{ width: 10, height: 10, backgroundColor: LEVEL_COLOR[l] }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
