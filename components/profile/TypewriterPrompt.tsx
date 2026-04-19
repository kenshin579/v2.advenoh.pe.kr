'use client'

import { useEffect, useState } from 'react'

const DEFAULT_SEQUENCE = [
  'cat README.md',
  'ls ./projects',
  'git log --since="2015"',
  'echo "hire me?"',
]

type TypewriterPromptProps = {
  prompt?: string
  sequence?: string[]
  charIntervalMs?: number
  holdMs?: number
}

export function TypewriterPrompt({
  prompt = 'frank@seoul:~/profile (main)$ ',
  sequence = DEFAULT_SEQUENCE,
  charIntervalMs = 55,
  holdMs = 1400,
}: TypewriterPromptProps) {
  const [cmdIdx, setCmdIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const current = sequence[cmdIdx]

  useEffect(() => {
    if (charIdx < current.length) {
      const id = setTimeout(() => setCharIdx(i => i + 1), charIntervalMs)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => {
      setCharIdx(0)
      setCmdIdx(i => (i + 1) % sequence.length)
    }, holdMs)
    return () => clearTimeout(id)
  }, [charIdx, cmdIdx, current, charIntervalMs, holdMs, sequence.length])

  return (
    <div className="font-mono text-sm text-profile-muted">
      <span>{prompt}</span>
      <span className="text-profile-fg">{current.slice(0, charIdx)}</span>
      <span
        aria-hidden="true"
        className="ml-px inline-block h-4 w-2 translate-y-0.5 bg-profile-accent"
        style={{ animation: 'profile-caret-blink 1.1s step-end infinite' }}
      />
    </div>
  )
}
