'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { StatusSnapshot } from '@/lib/status'
import type { Dict } from '@/lib/i18n/types'
import { SidebarContent } from './SidebarContent'

type MobileSidebarDrawerProps = {
  status: StatusSnapshot
  activeSection?: string | null
  t: Dict
}

export function MobileSidebarDrawer({ status, activeSection, t }: MobileSidebarDrawerProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('profile:open-sidebar', handler)
    return () => window.removeEventListener('profile:open-sidebar', handler)
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[54] bg-black/60 backdrop-blur md:hidden data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <Dialog.Content
          aria-label={t.mobile.navigation}
          className="fixed inset-y-0 left-0 z-[55] flex w-[280px] max-w-[85vw] flex-col overflow-y-auto border-r border-profile-line bg-profile-bg-2 p-4 pt-[calc(env(safe-area-inset-top)+1rem)] pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl md:hidden data-[state=open]:animate-in data-[state=open]:slide-in-from-left data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:duration-200 data-[state=closed]:duration-150"
        >
          <Dialog.Title className="sr-only">{t.mobile.navigation}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {t.mobile.navigationDesc}
          </Dialog.Description>
          <Dialog.Close
            aria-label={t.a11y.closeNavigation}
            className="absolute top-2 right-2 flex h-[44px] w-[44px] items-center justify-center rounded text-profile-muted hover:bg-profile-bg-3 hover:text-profile-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
          >
            <X size={16} />
          </Dialog.Close>
          <div className="mt-[44px]">
            <SidebarContent
              status={status}
              activeSection={activeSection}
              onNavigate={() => setOpen(false)}
              t={t}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
