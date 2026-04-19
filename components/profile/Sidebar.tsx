'use client'

import Link from 'next/link'
import type { StatusSnapshot } from '@/lib/status'
import { siteConfig } from '@/lib/site-config'

const NAV_SECTIONS = [
  { id: 'readme', href: '#readme', label: 'readme.md' },
  { id: 'projects', href: '#projects', label: 'projects/' },
  { id: 'writing', href: '#writing', label: 'writing.it' },
  { id: 'writing-investment', href: '#writing-investment', label: 'writing.inv' },
]

type SidebarProps = {
  status: StatusSnapshot
  activeSection?: string | null
}

export function Sidebar({ status, activeSection }: SidebarProps) {
  return (
    <aside
      aria-label="Profile sidebar"
      className="hidden md:flex w-[236px] shrink-0 flex-col gap-6 border-r border-profile-line bg-profile-bg-2 p-4 font-mono text-xs"
    >
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          Workspace
        </div>
        <nav aria-label="Sections" className="flex flex-col gap-0.5">
          {NAV_SECTIONS.map(item => {
            const active = activeSection === item.id
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'location' : undefined}
                className={`rounded px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent ${
                  active
                    ? 'bg-profile-accent-soft text-profile-accent'
                    : 'text-profile-fg-2 hover:bg-profile-bg-3 hover:text-profile-fg'
                }`}
              >
                {item.label}
              </a>
            )
          })}
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
          {SOCIAL_LINKS.map(({ label, href, aria }) => (
            <li key={href}>
              <Link
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={aria}
                className="block rounded px-2 py-1 font-mono text-profile-fg-2 hover:text-profile-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
              >
                ↗ {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

const SOCIAL_LINKS = [
  {
    label: 'github/kenshin579',
    href: siteConfig.author.social.github,
    aria: 'GitHub profile: kenshin579',
  },
  {
    label: 'linkedin/frank-oh',
    href: siteConfig.author.social.linkedin,
    aria: 'LinkedIn profile: Frank Oh',
  },
  {
    label: 'instagram/frank.photosnap',
    href: siteConfig.author.social.instagram,
    aria: 'Instagram: frank.photosnap',
  },
] as const
