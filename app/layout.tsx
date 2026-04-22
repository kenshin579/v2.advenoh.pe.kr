import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans_KR, Space_Grotesk } from 'next/font/google'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'
import { siteConfig } from '@/lib/site-config'
import { getPersonStructuredData, getWebSiteStructuredData } from '@/lib/structured-data'

const ibmPlexSansKR = IBM_Plex_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://advenoh.pe.kr'),
  title: siteConfig.name,
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  keywords: ['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI'],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Frank Oh Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    other: {
      'naver-site-verification': 'b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0a0c',
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personData = getPersonStructuredData()
  const websiteData = getWebSiteStructuredData()

  return (
    <html
      lang="ko"
      className="dark"
      data-accent="violet"
      data-density="comfortable"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
      </head>
      <body
        className={`${ibmPlexSansKR.variable} ${ibmPlexMono.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
