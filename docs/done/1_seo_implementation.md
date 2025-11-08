# SEO 최적화 구현 가이드

## 1. Robots.txt 생성

### 파일: `app/robots.ts`

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://advenoh.pe.kr/sitemap.xml',
  }
}
```

---

## 2. Sitemap 자동 생성

### 파일: `app/sitemap.ts`

```typescript
import { MetadataRoute } from 'next'
import { getPortfolioItems } from '@/lib/portfolio'

export default function sitemap(): MetadataRoute.Sitemap {
  const portfolioItems = getPortfolioItems()

  // Homepage
  const routes: MetadataRoute.Sitemap = [
    {
      url: 'https://advenoh.pe.kr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  // Portfolio items (external links - 참고용으로만 포함)
  const portfolioRoutes = portfolioItems.map((item) => ({
    url: `https://advenoh.pe.kr/#${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...portfolioRoutes]
}
```

---

## 3. 메타데이터 개선

### 파일: `app/layout.tsx` (수정)

```typescript
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
    google: 'your-google-verification-code', // Google Search Console에서 발급
  },
}
```

---

## 4. 구조화된 데이터 (JSON-LD)

### 파일: `lib/structured-data.ts` (신규)

```typescript
import { siteConfig } from './site-config'

export function getPersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    sameAs: [
      siteConfig.author.social.linkedin,
      siteConfig.author.social.github,
      siteConfig.author.social.instagram,
    ],
    jobTitle: 'Software Engineer',
    description: siteConfig.description,
  }
}

export function getWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
  }
}
```

### 파일: `app/layout.tsx` (JSON-LD 스크립트 추가)

`<body>` 태그 내부에 다음 추가:

```typescript
import { getPersonStructuredData, getWebSiteStructuredData } from '@/lib/structured-data'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const personData = getPersonStructuredData()
  const websiteData = getWebSiteStructuredData()

  return (
    <html lang="ko" suppressHydrationWarning>
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
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        {/* ... */}
      </body>
    </html>
  )
}
```

---

## 5. 이미지 Alt 텍스트 개선

### 파일: `components/PortfolioCard.tsx` (수정)

```typescript
// 기존 코드에서 alt 텍스트 개선
<Image
  src={coverImagePath}
  alt={`${title} - ${description}`}  // 더 설명적인 alt 텍스트
  fill
  className="object-cover transition-transform duration-200 ease-out group-hover:scale-110"
  unoptimized
  loading="lazy"  // lazy loading 추가
/>
```

---

## 6. Open Graph 이미지 생성

### 필요 작업:
1. 1200x630px 크기의 `og-image.png` 생성
2. `public/` 디렉토리에 배치
3. 브랜드 컬러와 사이트명 포함

**이미지 내용 예시:**
- 배경: 그라데이션 또는 단색
- 텍스트: "Frank Oh Portfolio"
- 서브텍스트: "Web Development Projects"

---

## 7. Site Config 확장

### 파일: `lib/site-config.ts` (수정)

```typescript
export const siteConfig = {
  name: "Frank Oh Portfolio",
  description: "Portfolio website showcasing web development projects",
  url: "https://advenoh.pe.kr",
  author: {
    name: "Frank Oh",
    jobTitle: "Software Engineer",
    social: {
      instagram: "https://www.instagram.com/frank.photosnap/",
      linkedin: "https://www.linkedin.com/in/frank-oh-abb80b10/",
      github: "https://github.com/kenshin579",
    }
  },
  keywords: ['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI'],
} as const

export type SiteConfig = typeof siteConfig
```

---

## 8. 테스트

### MCP Playwright를 사용한 SEO 검증

#### 테스트 항목:
1. **메타 태그 검증**
   - title, description, og:image 존재 확인
   - robots 메타 태그 확인

2. **Sitemap 접근 확인**
   - `/sitemap.xml` 200 응답 확인
   - XML 형식 유효성 검증

3. **Robots.txt 접근 확인**
   - `/robots.txt` 200 응답 확인
   - Sitemap 경로 포함 확인

4. **구조화된 데이터 확인**
   - JSON-LD 스크립트 존재 확인
   - Schema.org 형식 유효성

5. **이미지 Alt 텍스트 확인**
   - 모든 이미지에 alt 속성 존재

#### Playwright 테스트 예시:

```typescript
// tests/seo.spec.ts
import { test, expect } from '@playwright/test'

test('메타 태그 확인', async ({ page }) => {
  await page.goto('https://advenoh.pe.kr')

  // Title 확인
  await expect(page).toHaveTitle(/Frank Oh Portfolio/)

  // Meta description 확인
  const description = await page.locator('meta[name="description"]').getAttribute('content')
  expect(description).toBeTruthy()

  // OG image 확인
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
  expect(ogImage).toContain('/og-image.png')
})

test('Sitemap 접근 확인', async ({ page }) => {
  const response = await page.goto('https://advenoh.pe.kr/sitemap.xml')
  expect(response?.status()).toBe(200)

  const content = await page.content()
  expect(content).toContain('<urlset')
  expect(content).toContain('https://advenoh.pe.kr')
})

test('Robots.txt 확인', async ({ page }) => {
  const response = await page.goto('https://advenoh.pe.kr/robots.txt')
  expect(response?.status()).toBe(200)

  const content = await page.content()
  expect(content).toContain('User-agent: *')
  expect(content).toContain('Sitemap: https://advenoh.pe.kr/sitemap.xml')
})

test('구조화된 데이터 확인', async ({ page }) => {
  await page.goto('https://advenoh.pe.kr')

  const jsonLd = await page.locator('script[type="application/ld+json"]').count()
  expect(jsonLd).toBeGreaterThan(0)
})

test('이미지 Alt 텍스트 확인', async ({ page }) => {
  await page.goto('https://advenoh.pe.kr')

  const images = await page.locator('img').all()
  for (const img of images) {
    const alt = await img.getAttribute('alt')
    expect(alt).toBeTruthy()
  }
})
```

---

## 9. 예상 성과

- ✅ 모든 페이지 크롤링 가능 상태
- ✅ 구조화된 데이터 정상 적용
- ✅ 메타데이터 완전성 확보
- ✅ 이미지 접근성 개선
