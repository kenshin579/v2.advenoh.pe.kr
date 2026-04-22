'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { GithubContrib } from '@/lib/github'
import type { StatusSnapshot } from '@/lib/status'
import type { WritingItem } from '@/lib/writing'
import { RightRailContent } from './RightRailContent'

type MobileRightRailDrawerProps = {
  github: GithubContrib
  latestPosts: WritingItem[]
  status: StatusSnapshot
}

export function MobileRightRailDrawer({
  github,
  latestPosts,
  status,
}: MobileRightRailDrawerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('profile:open-rightrail', handler)
    return () => window.removeEventListener('profile:open-rightrail', handler)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[54] bg-black/60 backdrop-blur md:hidden data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-label="Activity panel"
          className="fixed inset-y-0 right-0 z-[55] flex w-[85vw] max-w-[340px] flex-col overflow-y-auto border-l border-profile-line bg-profile-bg-2 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl md:hidden data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:duration-200 data-[state=closed]:duration-150"
        >
          <Dialog.Title className="sr-only">Activity panel</Dialog.Title>
          <Dialog.Description className="sr-only">
            GitHub contributions, latest posts, and system metrics
          </Dialog.Description>
          <Dialog.Close
            aria-label="Close activity panel"
            className="absolute top-2 left-2 flex h-[44px] w-[44px] items-center justify-center rounded text-profile-muted hover:bg-profile-bg-3 hover:text-profile-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
          >
            <X size={16} />
          </Dialog.Close>
          <div className="mt-[44px]">
            <RightRailContent
              github={github}
              latestPosts={latestPosts}
              status={status}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
