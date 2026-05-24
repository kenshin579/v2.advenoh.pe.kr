import type { Metadata } from 'next'
import { ko } from '@/lib/i18n/ko'

export const metadata: Metadata = {
  title: ko.meta.title,
  description: ko.meta.description,
  openGraph: {
    locale: 'ko_KR',
    title: ko.meta.title,
    description: ko.meta.description,
  },
  alternates: {
    canonical: '/ko/',
    languages: {
      en: '/',
      ko: '/ko/',
      'x-default': '/',
    },
  },
}

export default function KoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
