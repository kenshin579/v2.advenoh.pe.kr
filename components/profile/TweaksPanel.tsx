'use client'

import { useState } from 'react'
import { Settings2, X } from 'lucide-react'
import { useTweaks } from '@/hooks/useTweaks'

const ACCENT_SWATCH: Record<string, string> = {
  violet: 'oklch(0.68 0.19 295)',
  red: 'oklch(0.65 0.22 22)',
  green: 'oklch(0.72 0.17 145)',
  orange: 'oklch(0.73 0.17 60)',
  amber: 'oklch(0.82 0.16 85)',
}

export function TweaksPanel() {
  const { tweaks, update, accents } = useTweaks()
  const [open, setOpen] = useState(false)

  return (
    <div className="fixed bottom-16 right-4 z-50 font-mono text-xs">
      {open ? (
        <div className="w-64 rounded-lg border border-profile-line-2 bg-profile-bg-2 p-4 shadow-2xl space-y-4">
          <header className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-widest text-profile-muted">
              tweaks
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tweaks"
              className="text-profile-muted hover:text-profile-fg"
            >
              <X size={14} />
            </button>
          </header>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-profile-muted-2">
              accent
            </label>
            <div className="flex gap-1.5">
              {accents.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => update({ accent: a })}
                  aria-label={`accent: ${a}`}
                  aria-pressed={tweaks.accent === a}
                  className={`h-6 w-6 rounded-full border-2 transition ${
                    tweaks.accent === a
                      ? 'border-profile-fg scale-110'
                      : 'border-profile-line-2'
                  }`}
                  style={{ backgroundColor: ACCENT_SWATCH[a] }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-profile-muted-2">
              density
            </label>
            <div className="flex gap-1">
              {(['comfortable', 'compact'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => update({ density: d })}
                  aria-pressed={tweaks.density === d}
                  className={`flex-1 rounded border px-2 py-1 text-[10px] transition ${
                    tweaks.density === d
                      ? 'border-profile-accent bg-profile-accent-soft text-profile-accent'
                      : 'border-profile-line-2 text-profile-fg-2 hover:border-profile-line-3'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] uppercase tracking-wider text-profile-muted-2">
              <span>noise</span>
              <span>{tweaks.noise}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={tweaks.noise}
              onChange={e => update({ noise: Number(e.target.value) })}
              aria-label="Noise intensity"
              className="w-full accent-[var(--profile-accent)]"
            />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open tweaks panel"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-profile-line-2 bg-profile-bg-2 text-profile-muted shadow-xl hover:border-profile-accent hover:text-profile-accent"
        >
          <Settings2 size={16} />
        </button>
      )}
    </div>
  )
}
