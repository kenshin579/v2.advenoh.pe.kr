'use client'

import Link from 'next/link'
import type { StatusSnapshot } from '@/lib/status'
import { siteConfig } from '@/lib/site-config'

const NAV_SECTIONS = [
  { href: '#readme', label: 'readme.md' },
  { href: '#projects', label: 'projects/' },
  { href: '#writing', label: 'writing.it' },
  { href: '#writing-investment', label: 'writing.inv' },
]

type SidebarProps = {
  status: StatusSnapshot
}

export function Sidebar({ status }: SidebarProps) {
  return (
    <aside className="hidden md:flex w-[236px] shrink-0 flex-col gap-6 border-r border-profile-line bg-profile-bg-2 p-4 font-mono text-xs">
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          Workspace
        </div>
        <nav className="flex flex-col gap-0.5">
          {NAV_SECTIONS.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="rounded px-2 py-1 text-profile-fg-2 hover:bg-profile-bg-3 hover:text-profile-fg"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          Status · {status.summary.up}/{status.summary.total}
        </div>
        <ul className="flex flex-col gap-1">
          {status.services.slice(0, 6).map(svc => (
            <li key={svc.id} className="flex items-center gap-2 px-2 py-0.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    svc.currentStatus === 'OK'
                      ? 'var(--profile-green)'
                      : svc.currentStatus === 'WARN'
                      ? 'var(--profile-yellow)'
                      : 'var(--profile-red)',
                }}
              />
              <span className="truncate text-profile-fg-2">{svc.name}</span>
            </li>
          ))}
          {status.services.length === 0 && (
            <li className="px-2 py-0.5 text-profile-muted-2">offline</li>
          )}
        </ul>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          Links
        </div>
        <ul className="flex flex-col gap-0.5">
          <li>
            <Link
              href={siteConfig.author.social.github}
              target="_blank"
              className="block rounded px-2 py-1 text-profile-fg-2 hover:bg-profile-bg-3 hover:text-profile-fg"
            >
              github ↗
            </Link>
          </li>
          <li>
            <Link
              href={siteConfig.external.status}
              target="_blank"
              className="block rounded px-2 py-1 text-profile-fg-2 hover:bg-profile-bg-3 hover:text-profile-fg"
            >
              status ↗
            </Link>
          </li>
          <li>
            <Link
              href="https://blog.advenoh.pe.kr/"
              target="_blank"
              className="block rounded px-2 py-1 text-profile-fg-2 hover:bg-profile-bg-3 hover:text-profile-fg"
            >
              blog ↗
            </Link>
          </li>
          <li>
            <Link
              href="https://investment.advenoh.pe.kr/"
              target="_blank"
              className="block rounded px-2 py-1 text-profile-fg-2 hover:bg-profile-bg-3 hover:text-profile-fg"
            >
              investment ↗
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  )
}
