type StatusBarProps = {
  section?: string
  xp?: string
}

export function StatusBar({ section = '#readme', xp = '10+ yrs' }: StatusBarProps) {
  return (
    <footer
      aria-label="Status bar"
      className="sticky bottom-0 z-20 flex h-[calc(28px+env(safe-area-inset-bottom))] items-center gap-4 border-t border-profile-line-2 bg-profile-bg-2/95 px-4 pb-[env(safe-area-inset-bottom)] font-mono text-[11px] text-profile-muted backdrop-blur"
    >
      <span className="text-profile-fg-2" aria-live="polite">
        {section}
      </span>
      <span aria-hidden="true" className="text-profile-muted-2">·</span>
      <span>{xp}</span>

      <ul
        aria-label="Keyboard shortcuts"
        className="ml-auto hidden md:flex items-center gap-3"
      >
        <li>
          <kbd className="font-mono">j/k</kbd> nav
        </li>
        <li>
          <kbd className="font-mono">↵</kbd> open
        </li>
        <li>
          <kbd className="font-mono">⌘K</kbd> search
        </li>
        <li>
          <kbd className="font-mono">esc</kbd> close
        </li>
      </ul>
    </footer>
  )
}
