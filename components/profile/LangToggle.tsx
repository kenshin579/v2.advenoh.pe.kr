'use client'

import { usePathname, useRouter } from 'next/navigation'

type LangToggleProps = { label: string }

export function LangToggle({ label }: LangToggleProps) {
  const pathname = usePathname() || '/'
  const router = useRouter()
  const isKo = pathname.startsWith('/ko')

  function go(to: 'en' | 'ko') {
    if (typeof window !== 'undefined') {
      localStorage.setItem('v2-lang', to)
    }
    router.push(to === 'ko' ? '/ko/' : '/')
  }

  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center overflow-hidden rounded border border-profile-line-2 text-[10px] font-mono"
    >
      <button
        type="button"
        onClick={() => go('en')}
        className={`px-1.5 py-0.5 ${!isKo ? 'bg-profile-bg-3 text-profile-accent' : 'text-profile-muted hover:text-profile-fg'}`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => go('ko')}
        className={`px-1.5 py-0.5 ${isKo ? 'bg-profile-bg-3 text-profile-accent' : 'text-profile-muted hover:text-profile-fg'}`}
      >
        KO
      </button>
    </div>
  )
}
