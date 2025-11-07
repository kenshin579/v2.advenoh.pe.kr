# Next.js 정적 사이트 전환 - 구현 가이드

> **관련 문서**: [1_nextjs_prd.md](./1_nextjs_prd.md) | [1_nextjs_todo.md](./1_nextjs_todo.md)

## 프로젝트 구조

```
v2.advenoh.pe.kr/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # 홈 페이지
│   ├── not-found.tsx        # 404 페이지
│   └── globals.css          # 전역 스타일
├── components/              # React 컴포넌트
│   ├── Header.tsx
│   ├── Footer.tsx           # 신규
│   ├── PortfolioCard.tsx
│   ├── theme-provider.tsx
│   └── ui/                  # shadcn/ui 컴포넌트
├── lib/                     # 유틸리티 및 설정
│   ├── utils.ts
│   ├── site-config.ts       # 신규
│   └── portfolio.ts         # 신규 - 포트폴리오 데이터 로더
├── contents/
│   └── website/             # 마크다운 포트폴리오 파일
├── public/                  # 정적 자산
├── next.config.js
├── netlify.toml             # 신규
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## 1. Next.js 프로젝트 초기화

### 1.1 Next.js 설치

```bash
# Next.js 14 설치 (TypeScript, Tailwind CSS, App Router)
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir

# 또는 기존 프로젝트에서 수동 설치
npm install next@14 react@18 react-dom@18
```

### 1.2 next.config.js 설정

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 정적 사이트 생성
  images: {
    unoptimized: true  // 정적 호스팅용 (Netlify에서 이미지 최적화 불필요)
  },
  // 경로 별칭은 tsconfig.json에서 관리
}

module.exports = nextConfig
```

### 1.3 tsconfig.json 설정

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 1.4 Tailwind CSS 설정

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],  // next-themes 호환
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
      // 기존 커스텀 컬러 및 테마 설정 유지
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## 2. 핵심 라이브러리 설치

### 2.1 필수 패키지

```bash
# Next.js 및 React
npm install next@14 react@18 react-dom@18

# 테마 시스템
npm install next-themes

# 마크다운 처리
npm install gray-matter

# 폰트 최적화 (Next.js 내장)
# next/font 사용

# 기존 UI 라이브러리 (유지)
# - lucide-react
# - @radix-ui/*
# - class-variance-authority
# - clsx
# - tailwind-merge
```

### 2.2 개발 도구

```bash
# Netlify CLI
npm install -D netlify-cli

# TypeScript 및 Tailwind (이미 설치됨)
# - typescript
# - tailwindcss
# - @types/node
# - @types/react
# - @types/react-dom
```

## 3. 사이트 설정 파일

### 3.1 lib/site-config.ts

```typescript
export const siteConfig = {
  name: "Frank Oh Portfolio",
  description: "Portfolio website showcasing web development projects",
  url: "https://advenoh.pe.kr",
  author: {
    name: "Frank Oh",
    email: "your-email@example.com", // 선택적
    social: {
      instagram: "https://www.instagram.com/frank.photosnap/",
      linkedin: "https://www.linkedin.com/in/frank-oh-abb80b10/",
      github: "https://github.com/kenshin579"
    }
  }
} as const

export type SiteConfig = typeof siteConfig
```

## 4. 포트폴리오 데이터 로더

### 4.1 lib/portfolio.ts

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

// Zod 스키마 (기존 shared/schema.ts에서 이전)
export const portfolioItemSchema = z.object({
  site: z.string().url(),
  title: z.string().optional(),
  description: z.string(),
})

export type PortfolioItem = z.infer<typeof portfolioItemSchema> & {
  slug: string
}

/**
 * contents/website/ 디렉토리에서 모든 포트폴리오 항목 로드
 */
export function getPortfolioItems(): PortfolioItem[] {
  const contentsDir = path.join(process.cwd(), 'contents/website')

  // 디렉토리가 없으면 빈 배열 반환
  if (!fs.existsSync(contentsDir)) {
    console.warn('Portfolio contents directory not found:', contentsDir)
    return []
  }

  const files = fs.readdirSync(contentsDir)
  const mdFiles = files.filter(file => file.endsWith('.md'))

  const items = mdFiles.map(filename => {
    const filePath = path.join(contentsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(fileContents)

    // Zod로 검증
    const validated = portfolioItemSchema.parse(data)

    // title이 없으면 URL에서 추출
    const title = validated.title || extractTitleFromUrl(validated.site)

    return {
      ...validated,
      title,
      slug: filename.replace('.md', ''),
    }
  })

  // 파일명 기준 정렬 (기존 로직 유지)
  return items.sort((a, b) => a.slug.localeCompare(b.slug))
}

/**
 * URL에서 타이틀 추출 (기존 로직)
 */
function extractTitleFromUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace('www.', '').split('.')[0]
  } catch {
    return 'Untitled'
  }
}
```

## 5. 컴포넌트 구현

### 5.1 app/layout.tsx (Root Layout)

```tsx
import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import './globals.css'
import { siteConfig } from '@/lib/site-config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  // Structured Data는 별도 컴포넌트로 추가
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 5.2 app/page.tsx (홈 페이지)

```tsx
import { getPortfolioItems } from '@/lib/portfolio'
import PortfolioCard from '@/components/PortfolioCard'

export default function HomePage() {
  const portfolioItems = getPortfolioItems()

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-12">
        <h1 className="font-heading text-4xl font-bold mb-4">
          Portfolio
        </h1>
        <p className="text-muted-foreground">
          A collection of web development projects
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioItems.map(item => (
            <PortfolioCard
              key={item.slug}
              title={item.title}
              description={item.description}
              url={item.site}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
```

### 5.3 app/not-found.tsx (404 페이지)

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="font-heading text-6xl font-bold mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Page not found
      </p>
      <Button asChild>
        <Link href="/">
          Go Home
        </Link>
      </Button>
    </div>
  )
}
```

### 5.4 components/Header.tsx

```tsx
'use client'

import Link from 'next/link'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-heading text-xl font-bold">
          Frank Oh
        </Link>

        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </nav>
      </div>
    </header>
  )
}
```

### 5.5 components/Footer.tsx (신규)

```tsx
import Link from 'next/link'
import { Instagram, Linkedin, Github } from 'lucide-react'
import { siteConfig } from '@/lib/site-config'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {siteConfig.author.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.author.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href={siteConfig.author.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href={siteConfig.author.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

### 5.6 components/PortfolioCard.tsx

```tsx
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ExternalLink } from 'lucide-react'

interface PortfolioCardProps {
  title: string
  description: string
  url: string
}

export default function PortfolioCard({ title, description, url }: PortfolioCardProps) {
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer">
      <Card className="h-full transition-all duration-200 hover:scale-105 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {title}
            <ExternalLink className="h-4 w-4" />
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
```

### 5.7 components/theme-provider.tsx

```tsx
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

## 6. Netlify 배포 설정

### 6.1 netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "out"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

# 404 페이지 리다이렉트
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### 6.2 package.json 스크립트

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  }
}
```

## 7. shadcn/ui 재설치

### 7.1 components.json 설정

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### 7.2 필요한 shadcn/ui 컴포넌트 설치

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dropdown-menu
```

## 8. 테스트 전략

### 8.1 MCP Playwright 테스트 시나리오

**테스트 파일**: `tests/portfolio.spec.ts` (향후 작성)

테스트 항목:
1. **포트폴리오 카드 렌더링**
   - 카드 개수 확인
   - 제목, 설명 표시 확인

2. **테마 전환**
   - 테마 토글 버튼 클릭
   - 다크/라이트 모드 전환 확인

3. **반응형 레이아웃**
   - 모바일 (375px): 1열 그리드
   - 태블릿 (768px): 2열 그리드
   - 데스크톱 (1024px): 3열 그리드

4. **Footer SNS 링크**
   - Instagram, LinkedIn, GitHub 링크 존재
   - 올바른 URL 확인
   - `target="_blank"` 속성 확인

5. **접근성**
   - 키보드 네비게이션 (Tab, Enter)
   - ARIA 레이블 확인

## 9. 빌드 및 배포

### 9.1 로컬 빌드 테스트

```bash
# 빌드
npm run build

# 빌드 결과 확인
ls -la out/

# Netlify 로컬 테스트 (선택적)
npx netlify dev
```

### 9.2 Netlify 배포

```bash
# Netlify 로그인
npx netlify login

# 사이트 초기화
npx netlify init

# 배포 (프로덕션)
npx netlify deploy --prod
```

## 10. 클린업 작업

### 10.1 제거할 디렉토리 및 파일

```bash
# 서버 디렉토리
rm -rf server/

# 클라이언트 디렉토리 (내용 이전 후)
# client/src/ 내용을 app/, components/로 이동 후 제거

# 설정 파일
rm vite.config.ts
rm drizzle.config.ts

# 미사용 의존성 제거
npm uninstall express vite @vitejs/plugin-react drizzle-orm @neondatabase/serverless
```

### 10.2 package.json 정리

제거할 패키지:
- `express`
- `vite`
- `@vitejs/plugin-react`
- `drizzle-orm`
- `@neondatabase/serverless`
- 기타 서버 관련 패키지

## 11. 최종 검증

### 11.1 빌드 성공 확인

```bash
npm run build
# ✓ 정적 파일이 out/ 디렉토리에 생성되었는지 확인
```

### 11.2 로컬 테스트

```bash
# 정적 파일 서버 (예: serve)
npx serve out

# 브라우저에서 확인:
# - http://localhost:3000
# - 포트폴리오 카드 표시
# - 테마 전환 동작
# - SNS 링크 동작
```

### 11.3 Playwright E2E 테스트 실행

```bash
# Playwright 테스트 (todo.md 완료 후)
npx playwright test
```

---

**다음 단계**: [1_nextjs_todo.md](./1_nextjs_todo.md) 체크리스트 참조
