type StatusBarProps = {
  section?: string
  xp?: string
}

export function StatusBar({ section = '#readme', xp = '10+ yrs' }: StatusBarProps) {
  return (
    <footer className="sticky bottom-0 z-20 flex h-7 items-center gap-4 border-t border-profile-line-2 bg-profile-bg-2/95 px-4 font-mono text-[11px] text-profile-muted backdrop-blur">
      <span className="text-profile-fg-2">{section}</span>
      <span className="text-profile-muted-2">·</span>
      <span>{xp}</span>

      <div className="ml-auto hidden md:flex items-center gap-3">
        <span>
          <kbd className="font-mono">j/k</kbd> nav
        </span>
        <span>
          <kbd className="font-mono">↵</kbd> open
        </span>
        <span>
          <kbd className="font-mono">⌘K</kbd> search
        </span>
        <span>
          <kbd className="font-mono">esc</kbd> close
        </span>
      </div>
    </footer>
  )
}
