'use client'

import type { StatusSnapshot } from '@/lib/status'

type TitleBarProps = {
  status: StatusSnapshot
  breadcrumb?: string
  activeSection?: string | null
}

export function TitleBar({
  status,
  breadcrumb = 'frank@seoul:~/profile (main)',
  activeSection,
}: TitleBarProps) {
  const path = activeSection ? `${breadcrumb} / #${activeSection}` : breadcrumb

  return (
    <header className="sticky top-0 z-30 flex h-10 items-center gap-4 border-b border-profile-line-2 bg-profile-bg-2/95 px-4 font-mono text-xs text-profile-fg-2 backdrop-blur">
      <div className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      <span className="hidden sm:inline truncate text-profile-muted">{path}</span>

      <div className="ml-auto flex items-center gap-4">
        <kbd className="hidden md:inline-flex items-center gap-1 rounded border border-profile-line-2 bg-profile-bg-3 px-1.5 py-0.5 text-[10px] text-profile-muted">
          ⌘K
        </kbd>
        <span
          className="inline-flex items-center gap-1.5"
          aria-label={`${status.summary.up} of ${status.summary.total} services up`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor:
                status.summary.up === status.summary.total
                  ? 'var(--profile-green)'
                  : 'var(--profile-yellow)',
              animation: 'profile-pulse 1.6s ease-in-out infinite',
            }}
          />
          {status.summary.up}/{status.summary.total} up
        </span>
      </div>
    </header>
  )
}
