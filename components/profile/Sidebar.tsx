'use client'

import type { StatusSnapshot } from '@/lib/status'
import type { Dict } from '@/lib/i18n/types'
import { SidebarContent } from './SidebarContent'

type SidebarProps = {
  status: StatusSnapshot
  activeSection?: string | null
  t: Dict
}

export function Sidebar({ status, activeSection, t }: SidebarProps) {
  return (
    <aside
      aria-label={t.a11y.sidebar}
      className="hidden md:flex w-[236px] shrink-0 flex-col border-r border-profile-line bg-profile-bg-2 p-4"
    >
      <SidebarContent status={status} activeSection={activeSection} t={t} />
    </aside>
  )
}
