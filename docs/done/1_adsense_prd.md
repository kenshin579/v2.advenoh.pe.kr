# Google AdSense 구현 PRD

## 📋 개요

### 목적
포트폴리오 사이트에 Google AdSense를 통합하여 수익화 기반을 마련합니다.

### 범위
- Google AdSense 스크립트 통합
- 이미 구현된 ads.txt 파일 검증
- Next.js 정적 사이트 환경에서의 AdSense 최적화

### 참고 프로젝트
`/Users/user/WebstormProjects/blog-v2.advenoh.pe.kr` - 이미 AdSense가 구현된 블로그 프로젝트

---

## 🔍 현재 상태 분석

### ✅ 이미 완료된 작업
- `public/ads.txt` 파일이 존재 (AdSense 계정 인증용)
- Google Analytics 이미 통합됨 (`components/GoogleAnalytics.tsx`)

### ❌ 필요한 작업
- AdSense 스크립트를 `app/layout.tsx`에 추가
- Next.js Script 컴포넌트를 사용한 최적화

---

## 📊 참고 프로젝트 구현 분석

### 블로그 프로젝트의 AdSense 구현
**파일**: `blog-v2.advenoh.pe.kr/app/layout.tsx` (57-63번 줄)

```tsx
{/* Google AdSense */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

**주요 특징**:
1. Next.js `Script` 컴포넌트 사용
2. `strategy="afterInteractive"` - 페이지가 인터랙티브해진 후 로드
3. `crossOrigin="anonymous"` - CORS 정책 준수
4. Publisher ID 하드코딩 (`ca-pub-8868959494983515`)

---

## 🎯 구현 요구사항

### 1. AdSense 스크립트 추가

**위치**: `app/layout.tsx`

**구현 방법**:
```tsx
{/* Google AdSense */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

**배치 위치**:
- `<head>` 태그 내부
- GoogleAnalytics 컴포넌트 근처
- Structured Data 스크립트 이후

### 2. 기존 ads.txt 검증

**파일**: `public/ads.txt`

**현재 내용**:
```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

**검증 사항**:
- Publisher ID가 스크립트와 일치하는지 확인 (`pub-8868959494983515`)
- 형식이 올바른지 확인 (이미 올바름)

---

## 🔧 기술 세부사항

### Next.js Script 컴포넌트 전략

| Strategy | 설명 | 사용 시점 |
|----------|------|-----------|
| `beforeInteractive` | 페이지 인터랙티브 전에 로드 | 필수 스크립트 (폴리필 등) |
| `afterInteractive` | 페이지 인터랙티브 후 로드 | **AdSense (권장)** |
| `lazyOnload` | 모든 리소스 로드 후 | 중요하지 않은 스크립트 |

**AdSense에 `afterInteractive` 사용 이유**:
- 페이지 초기 렌더링 속도에 영향을 주지 않음
- 사용자가 콘텐츠를 빠르게 볼 수 있음
- 광고는 페이지가 완전히 로드된 후 표시되어도 무방

### 정적 사이트 환경 고려사항

**현재 프로젝트 설정** (`next.config.mjs`):
```javascript
output: 'export',  // 정적 사이트 생성
images: {
  unoptimized: true  // 이미지 최적화 비활성화
}
```

**AdSense 정적 사이트 호환성**:
- ✅ AdSense는 순수 클라이언트 사이드 스크립트
- ✅ 정적 HTML에 스크립트 태그만 포함되면 동작
- ✅ 빌드 타임에 스크립트가 HTML에 포함됨
- ✅ 서버 런타임 없이 동작

---

## 🎨 현재 프로젝트와의 통합

### layout.tsx 구조

**현재 상태** (v2.advenoh.pe.kr):
```tsx
<html lang="ko" suppressHydrationWarning>
  <head>
    {/* Structured Data */}
    <script type="application/ld+json" {...} />
    <script type="application/ld+json" {...} />
  </head>
  <body>
    <GoogleAnalytics />  {/* 컴포넌트로 분리됨 */}
    <ThemeProvider>...</ThemeProvider>
  </body>
</html>
```

**변경 후 예상 구조**:
```tsx
import Script from 'next/script'

<html lang="ko" suppressHydrationWarning>
  <head>
    {/* Structured Data */}
    <script type="application/ld+json" {...} />
    <script type="application/ld+json" {...} />

    {/* Google AdSense */}
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  </head>
  <body>
    <GoogleAnalytics />
    <ThemeProvider>...</ThemeProvider>
  </body>
</html>
```

---

## 🔐 보안 및 성능 고려사항

### 1. Publisher ID 보안
- ✅ Publisher ID는 공개 정보이므로 코드에 하드코딩해도 보안 문제 없음
- ✅ ads.txt 파일을 통해 소유권 검증
- ✅ Google AdSense 콘솔에서 승인된 사이트만 광고 표시

### 2. 성능 최적화
- ✅ `async` 속성으로 비동기 로드
- ✅ `strategy="afterInteractive"`로 초기 렌더링 차단 방지
- ✅ 광고 스크립트가 Core Web Vitals에 미치는 영향 최소화

### 3. CORS 정책
- ✅ `crossOrigin="anonymous"` 속성으로 CORS 정책 준수
- ✅ Google CDN에서 스크립트를 안전하게 로드

---

## 📚 참고 자료

### 공식 문서
- [Google AdSense 시작 가이드](https://support.google.com/adsense/answer/10162)
- [Next.js Script 컴포넌트](https://nextjs.org/docs/app/api-reference/components/script)
- [ads.txt 가이드](https://support.google.com/adsense/answer/7532444)

### 프로젝트 파일
- 참고 구현: `blog-v2.advenoh.pe.kr/app/layout.tsx:57-63`
- 현재 프로젝트: `v2.advenoh.pe.kr/app/layout.tsx`
- ads.txt: `v2.advenoh.pe.kr/public/ads.txt`

### 관련 문서
- **구현 가이드**: [1_adsense_implementation.md](1_adsense_implementation.md)
- **TODO 체크리스트**: [1_adsense_todo.md](1_adsense_todo.md)

---

## ⚠️ 주의사항

### 1. Publisher ID 관리
- Publisher ID는 공개 정보이므로 코드에 포함되어도 보안 문제 없음
- ads.txt 파일로 소유권이 검증되므로 무단 사용 방지됨

### 2. AdSense 정책 준수
- AdSense 프로그램 정책을 준수해야 승인됨
- 포트폴리오 사이트는 일반적으로 승인 가능
- 충분한 고유 콘텐츠가 있어야 함

### 3. 정적 사이트 제약
- 서버 사이드 렌더링 없음 (순수 클라이언트 스크립트)
- 빌드 타임에 스크립트가 HTML에 포함됨
- 런타임 변경 불가 (재빌드 필요)

---

## ✅ 성공 기준

구현이 완료되었다고 판단하는 기준:

1. **기술적 성공**
   - AdSense 스크립트가 모든 페이지에서 로드됨
   - 브라우저 콘솔에 에러 없음
   - `ads.txt` 파일이 공개적으로 접근 가능

2. **비즈니스 성공**
   - Google AdSense 콘솔에서 사이트 인식
   - ads.txt 파일 검증 통과
   - 사이트 승인 대기 중이거나 승인 완료

3. **코드 품질**
   - 참고 프로젝트와 동일한 구현 패턴 사용
   - Next.js Script 컴포넌트 베스트 프랙티스 준수
   - 코드 가독성 및 유지보수성 확보

---

## 📊 비교: 블로그 vs 포트폴리오

| 항목 | 블로그 (참고) | 포트폴리오 (현재) |
|------|---------------|-------------------|
| 광고 전략 | 콘텐츠 페이지 다수 | 최소화 (홈페이지 중심) |
| 스크립트 위치 | `<head>` 태그 내 | `<head>` 태그 내 (동일) |
| Publisher ID | 하드코딩 | 하드코딩 (동일) |
| 광고 배치 | Auto Ads 가능 | 수동 배치 권장 |
| 수익 중요도 | 주요 목적 | 부가적 |

---

## 📅 작성 정보

- **작성일**: 2025-11-23
- **참고 프로젝트**: blog-v2.advenoh.pe.kr
- **대상 프로젝트**: v2.advenoh.pe.kr (포트폴리오)
- **기술 스택**: Next.js 14 App Router + TypeScript
- **배포 플랫폼**: Netlify
