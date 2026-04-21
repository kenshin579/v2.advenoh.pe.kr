'use client'

import { Menu, PanelRight } from 'lucide-react'
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
    <header className="sticky top-0 z-30 flex h-[calc(40px+env(safe-area-inset-top))] items-center gap-2 md:gap-4 border-b border-profile-line-2 bg-profile-bg-2/95 px-2 md:px-4 pt-[env(safe-area-inset-top)] font-mono text-xs text-profile-fg-2 backdrop-blur">
      <div className="flex items-center gap-1.5 pl-2 md:pl-0">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
      </div>

      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => window.dispatchEvent(new Event('profile:open-sidebar'))}
        className="md:hidden flex h-[44px] w-[44px] items-center justify-center text-profile-muted hover:text-profile-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
      >
        <Menu size={16} />
      </button>

      <span className="hidden sm:inline truncate text-profile-muted">{path}</span>

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        <button
          type="button"
          aria-label="Open activity panel"
          onClick={() => window.dispatchEvent(new Event('profile:open-rightrail'))}
          className="md:hidden flex h-[44px] w-[44px] items-center justify-center text-profile-muted hover:text-profile-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
        >
          <PanelRight size={16} />
        </button>

        <button
          type="button"
          aria-label="Open command palette"
          aria-keyshortcuts="Meta+K Control+K /"
          onClick={() => window.dispatchEvent(new Event('profile:open-palette'))}
          className="hidden md:inline-flex items-center gap-1 rounded border border-profile-line-2 bg-profile-bg-3 px-1.5 py-0.5 text-[10px] text-profile-muted hover:border-profile-accent hover:text-profile-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
        >
          <kbd className="font-mono">⌘K</kbd>
        </button>
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
