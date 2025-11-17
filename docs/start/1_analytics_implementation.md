# Google Analytics 구현 가이드

## 개요
Next.js 정적 사이트에 Google Analytics 4 (GA4) 추적 코드를 추가합니다.

**측정 ID**: `G-4JL7C22JKN`

---

## 구현 단계

### 1. GoogleAnalytics 컴포넌트 생성

**파일**: `components/GoogleAnalytics.tsx`

```typescript
import Script from 'next/script'

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-4JL7C22JKN"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-4JL7C22JKN');
        `}
      </Script>
    </>
  )
}
```

**핵심 설정**:
- `strategy="afterInteractive"`: 페이지 인터랙티브 후 스크립트 로드 (성능 최적화)
- `id="google-analytics"`: 인라인 스크립트 식별자 (Next.js 요구사항)

---

### 2. Layout에 컴포넌트 추가

**파일**: `app/layout.tsx`

**변경 전**:
```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* structured data scripts */}
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider ...>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**변경 후**:
```typescript
import GoogleAnalytics from '@/components/GoogleAnalytics'  // 추가

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* structured data scripts */}
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <GoogleAnalytics />  {/* 추가 - ThemeProvider 앞에 배치 */}
        <ThemeProvider ...>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**배치 위치**: `<body>` 태그 내부 최상단 (ThemeProvider 이전)

---

## 기술적 고려사항

### Next.js Script 컴포넌트
- `next/script` 사용으로 스크립트 로딩 최적화
- `dangerouslySetInnerHTML` 대신 Script children 사용 (Next.js 권장)

### 성능 최적화
- `afterInteractive` 전략으로 초기 페이지 로드 성능 유지
- GA 스크립트는 페이지가 사용 가능해진 후 로드

### 정적 사이트 호환성
- Next.js 정적 빌드 (`output: 'export'`)와 완벽 호환
- 클라이언트 사이드에서만 실행됨

---

## 빌드 및 배포

### 로컬 빌드
```bash
npm run build
```

**확인 사항**:
- 빌드 에러 없이 완료
- `out/` 디렉토리에 정적 파일 생성

### 배포
- Netlify에 자동 배포 (기존 설정 사용)
- 추가 환경 변수 설정 불필요

---

## 검증 방법

### 1. 개발 환경 (브라우저 개발자 도구)
```bash
npm run dev
```

**브라우저 개발자 도구 확인**:
1. Network 탭 → `gtag/js?id=G-4JL7C22JKN` 요청 확인
2. Console 탭 → `window.dataLayer` 객체 확인

### 2. MCP Playwright 자동 검증

**개발 서버 테스트**:
```bash
npm run dev  # 별도 터미널에서 실행
```

**MCP Playwright 실행 순서**:

1. **페이지 접속**
   - 도구: `mcp__playwright__playwright_navigate`
   - URL: `http://localhost:3000`

2. **HTML 확인**
   - 도구: `mcp__playwright__playwright_get_visible_html`
   - 확인: GA 스크립트 태그 포함 여부

3. **dataLayer 객체 검증**
   - 도구: `mcp__playwright__playwright_evaluate`
   - 스크립트:
     ```javascript
     return {
       dataLayerExists: typeof window.dataLayer !== 'undefined',
       dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
       dataLayerType: typeof window.dataLayer
     }
     ```

4. **gtag 함수 검증**
   - 도구: `mcp__playwright__playwright_evaluate`
   - 스크립트:
     ```javascript
     return {
       gtagExists: typeof window.gtag === 'function',
       gtagType: typeof window.gtag
     }
     ```

5. **브라우저 종료**
   - 도구: `mcp__playwright__playwright_close`

### 3. 프로덕션 환경
```bash
npm run build
npx serve out
```

**확인**:
- 정적 HTML에 GA 스크립트 포함 여부
- MCP Playwright로 동일한 검증 수행 가능

### 4. Google Analytics 대시보드
- 실시간 → 개요
- 사이트 방문 후 1-2분 내 데이터 표시 확인
