'use client'

import Link from 'next/link'
import { Search } from 'lucide-react'
import type { StatusSnapshot } from '@/lib/status'
import type { Dict } from '@/lib/i18n/types'
import { siteConfig } from '@/lib/site-config'

const NAV_SECTIONS = [
  { id: 'readme', href: '#readme', label: 'readme.md' },
  { id: 'projects', href: '#projects', label: 'projects/' },
  { id: 'writing', href: '#writing', label: 'writing.it' },
  { id: 'writing-investment', href: '#writing-investment', label: 'writing.inv' },
]

const SOCIAL_LINKS = [
  {
    label: 'github/kenshin579',
    href: siteConfig.author.social.github,
    ariaKey: 'githubProfile' as const,
  },
  {
    label: 'linkedin/frank-oh',
    href: siteConfig.author.social.linkedin,
    ariaKey: 'linkedinProfile' as const,
  },
  {
    label: 'instagram/frank.photosnap',
    href: siteConfig.author.social.instagram,
    ariaKey: 'instagramProfile' as const,
  },
] as const

type SidebarContentProps = {
  status: StatusSnapshot
  activeSection?: string | null
  onNavigate?: () => void
  t: Dict
}

export function SidebarContent({ status, activeSection, onNavigate, t }: SidebarContentProps) {
  return (
    <div className="flex flex-col gap-6 font-mono text-xs">
      <button
        type="button"
        onClick={() => {
          onNavigate?.()
          window.dispatchEvent(new Event('profile:open-palette'))
        }}
        className="flex items-center gap-2 rounded border border-profile-line-2 bg-profile-bg-3 px-2 py-2.5 md:py-1.5 text-profile-muted hover:border-profile-accent hover:text-profile-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
      >
        <Search size={14} />
        <span className="flex-1 text-left">{t.sidebar.searchJump}</span>
        <kbd className="hidden md:inline text-[10px] text-profile-muted-2">/</kbd>
      </button>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          {t.sidebar.workspace}
        </div>
        <nav aria-label={t.a11y.navSections} className="flex flex-col gap-0.5">
          {NAV_SECTIONS.map(item => {
            const active = activeSection === item.id
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'location' : undefined}
                onClick={() => onNavigate?.()}
                className={`rounded px-2 py-2.5 md:py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent ${
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

      <a
        href={siteConfig.external.status}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={t.a11y.statusPage}
        onClick={() => onNavigate?.()}
        className="group -mx-2 block rounded px-2 py-1 transition-colors hover:bg-profile-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-profile-muted-2 group-hover:text-profile-accent">
            {t.sidebar.status} · {status.summary.up}/{status.summary.total}
          </span>
          <span className="text-[10px] text-profile-muted-2 group-hover:text-profile-accent">↗</span>
        </div>
        <ul className="flex flex-col gap-1">
          {status.services.slice(0, 3).map(svc => (
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
            <li className="px-2 py-0.5 text-profile-muted-2">{t.sidebar.offline}</li>
          )}
          {status.services.length > 3 && (
            <li className="px-2 py-0.5 tracking-[0.15em] text-profile-muted-2 group-hover:text-profile-accent">
              ···
            </li>
          )}
        </ul>
      </a>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-profile-muted-2">
          {t.sidebar.links}
        </div>
        <ul className="flex flex-col gap-0.5">
          {SOCIAL_LINKS.map(({ label, href, ariaKey }) => (
            <li key={href}>
              <Link
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={t.a11y[ariaKey]}
                onClick={() => onNavigate?.()}
                className="block rounded px-2 py-2.5 md:py-1 font-mono text-profile-fg-2 hover:text-profile-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
              >
                ↗ {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
