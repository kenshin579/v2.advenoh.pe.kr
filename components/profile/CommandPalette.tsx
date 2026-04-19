'use client'

import { useEffect, useState, useCallback } from 'react'
import { Command } from 'cmdk'
import { Search, FileText, ArrowUpRight, Layers, ExternalLink } from 'lucide-react'
import type { PortfolioItem } from '@/lib/portfolio'
import type { WritingItem } from '@/lib/writing'
import { siteConfig } from '@/lib/site-config'

type CommandPaletteProps = {
  projects: PortfolioItem[]
  latestPosts: WritingItem[]
}

const SECTIONS = [
  { id: 'readme', label: 'readme.md' },
  { id: 'projects', label: 'projects/' },
  { id: 'writing', label: 'writing.it' },
  { id: 'writing-investment', label: 'writing.inv' },
] as const

export function CommandPalette({ projects, latestPosts }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  // ⌘K / Ctrl+K / `/`로 토글. 입력 요소 포커스 상태에선 비활성.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null
      const isEditing =
        target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable
        )

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
        return
      }
      if (!isEditing && e.key === '/') {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const jumpSection = (id: string) => {
    close()
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const openUrl = (url: string) => {
    close()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[20vh] backdrop-blur"
      onClick={close}
    >
      <Command
        onClick={e => e.stopPropagation()}
        label="Command Menu"
        className="w-full max-w-lg overflow-hidden rounded-lg border border-profile-line-2 bg-profile-bg-2 shadow-2xl font-mono"
      >
        <div className="flex items-center gap-2 border-b border-profile-line-2 px-3 py-2.5 text-profile-muted">
          <Search size={14} />
          <Command.Input
            autoFocus
            placeholder="jump, search, open…"
            className="flex-1 bg-transparent text-sm text-profile-fg outline-none placeholder:text-profile-muted-2"
          />
          <kbd className="text-[10px] text-profile-muted-2">esc</kbd>
        </div>

        <Command.List className="max-h-[50vh] overflow-auto p-2 text-xs">
          <Command.Empty className="p-4 text-center text-profile-muted-2">
            No results.
          </Command.Empty>

          <Command.Group
            heading="Sections"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-profile-muted-2"
          >
            {SECTIONS.map(s => (
              <Command.Item
                key={s.id}
                value={`section ${s.label}`}
                onSelect={() => jumpSection(s.id)}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-profile-fg-2 data-[selected=true]:bg-profile-bg-3 data-[selected=true]:text-profile-fg"
              >
                <FileText size={12} className="text-profile-muted" />
                <span>#{s.id}</span>
                <span className="text-profile-muted-2">— {s.label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Projects"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-profile-muted-2"
          >
            {projects.map(p => (
              <Command.Item
                key={p.slug}
                value={`project ${p.title} ${p.slug} ${p.stack?.join(' ') ?? ''}`}
                onSelect={() => openUrl(p.site)}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-profile-fg-2 data-[selected=true]:bg-profile-bg-3 data-[selected=true]:text-profile-fg"
              >
                <Layers size={12} className="text-profile-muted" />
                <span className="text-profile-accent">
                  {p.slug}
                  {p.ext ?? ''}
                </span>
                <span className="text-profile-muted-2">— {p.title}</span>
                <ArrowUpRight size={12} className="ml-auto text-profile-muted-2" />
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Latest posts"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-profile-muted-2"
          >
            {latestPosts.map(item => (
              <Command.Item
                key={item.link}
                value={`${item.source} post ${item.title}`}
                onSelect={() => openUrl(item.link)}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-profile-fg-2 data-[selected=true]:bg-profile-bg-3 data-[selected=true]:text-profile-fg"
              >
                <span
                  className={`inline-flex h-4 shrink-0 items-center rounded px-1 text-[9px] font-semibold ${
                    item.source === 'IT'
                      ? 'bg-profile-accent-soft text-profile-accent'
                      : 'bg-profile-line-2 text-profile-fg-2'
                  }`}
                >
                  {item.source}
                </span>
                <span className="truncate">{item.title}</span>
                <ArrowUpRight size={12} className="ml-auto shrink-0 text-profile-muted-2" />
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group
            heading="Links"
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-profile-muted-2"
          >
            <Command.Item
              value="link github"
              onSelect={() => openUrl(siteConfig.author.social.github)}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-profile-fg-2 data-[selected=true]:bg-profile-bg-3 data-[selected=true]:text-profile-fg"
            >
              <ExternalLink size={12} className="text-profile-muted" />
              <span>github</span>
            </Command.Item>
            <Command.Item
              value="link status"
              onSelect={() => openUrl(siteConfig.external.status)}
              className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-profile-fg-2 data-[selected=true]:bg-profile-bg-3 data-[selected=true]:text-profile-fg"
            >
              <ExternalLink size={12} className="text-profile-muted" />
              <span>status</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
