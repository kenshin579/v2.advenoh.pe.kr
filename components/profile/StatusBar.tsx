import type { Dict } from '@/lib/i18n/types'

type StatusBarProps = {
  section?: string
  xp?: string
  t: Dict
}

export function StatusBar({ section = '#readme', xp = '10+ yrs', t }: StatusBarProps) {
  return (
    <footer
      aria-label={t.a11y.statusBar}
      className="sticky bottom-0 z-20 flex h-[calc(28px+env(safe-area-inset-bottom))] items-center gap-4 border-t border-profile-line-2 bg-profile-bg-2/95 px-4 pb-[env(safe-area-inset-bottom)] font-mono text-[11px] text-profile-muted backdrop-blur"
    >
      <span className="text-profile-fg-2" aria-live="polite">
        {section}
      </span>
      <span aria-hidden="true" className="text-profile-muted-2">·</span>
      <span>{xp}</span>

      <ul
        aria-label={t.a11y.keyboardShortcuts}
        className="ml-auto hidden md:flex items-center gap-3"
      >
        <li>
          <kbd className="font-mono">j/k</kbd> {t.statusBar.nav}
        </li>
        <li>
          <kbd className="font-mono">↵</kbd> {t.statusBar.open}
        </li>
        <li>
          <kbd className="font-mono">⌘K</kbd> {t.statusBar.search}
        </li>
        <li>
          <kbd className="font-mono">esc</kbd> {t.statusBar.close}
        </li>
      </ul>
    </footer>
  )
}
