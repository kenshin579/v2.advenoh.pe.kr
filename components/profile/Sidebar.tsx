'use client'

import type { StatusSnapshot } from '@/lib/status'
import { SidebarContent } from './SidebarContent'

type SidebarProps = {
  status: StatusSnapshot
  activeSection?: string | null
}

export function Sidebar({ status, activeSection }: SidebarProps) {
  return (
    <aside
      aria-label="Profile sidebar"
      className="hidden md:flex w-[236px] shrink-0 flex-col border-r border-profile-line bg-profile-bg-2 p-4"
    >
      <SidebarContent status={status} activeSection={activeSection} />
    </aside>
  )
}
