'use client'

import { useEffect, useState, useCallback } from 'react'

export type AccentName = 'violet' | 'red' | 'green' | 'orange' | 'amber'
export type DensityName = 'comfortable' | 'compact'

export type Tweaks = {
  accent: AccentName
  density: DensityName
  noise: number // 0 ~ 100
}

const DEFAULT_TWEAKS: Tweaks = {
  accent: 'violet',
  density: 'comfortable',
  noise: 35,
}

const STORAGE_KEY = 'profile-v2-tweaks'
const ACCENTS: AccentName[] = ['violet', 'red', 'green', 'orange', 'amber']

function apply(tweaks: Tweaks) {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  html.dataset.accent = tweaks.accent
  html.dataset.density = tweaks.density
  html.style.setProperty('--profile-noise', String(tweaks.noise / 100))
}

function load(): Tweaks {
  if (typeof window === 'undefined') return DEFAULT_TWEAKS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TWEAKS
    const parsed = JSON.parse(raw)
    return {
      accent: ACCENTS.includes(parsed.accent) ? parsed.accent : DEFAULT_TWEAKS.accent,
      density: parsed.density === 'compact' ? 'compact' : 'comfortable',
      noise: typeof parsed.noise === 'number' ? Math.min(100, Math.max(0, parsed.noise)) : DEFAULT_TWEAKS.noise,
    }
  } catch {
    return DEFAULT_TWEAKS
  }
}

export function useTweaks() {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const initial = load()
    setTweaks(initial)
    apply(initial)
    setHydrated(true)
  }, [])

  const update = useCallback((patch: Partial<Tweaks>) => {
    setTweaks(prev => {
      const next = { ...prev, ...patch }
      apply(next)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore storage errors
      }
      return next
    })
  }, [])

  return { tweaks, update, hydrated, accents: ACCENTS }
}
