# Google Analytics 추가 PRD

## 목적
Next.js 정적 사이트에 Google Analytics 4 (GA4)를 추가하여 사용자 행동 추적 및 분석 기능 구현

## 배경
- **측정 ID**: `G-4JL7C22JKN`
- **플랫폼**: Next.js 14 App Router (정적 사이트 생성)
- **요구사항**: 페이지뷰 자동 추적, 이벤트 추적 기반 구축

---

## 기술 요구사항

### 1. Google Analytics 컴포넌트 생성
- Next.js `Script` 컴포넌트를 사용한 GA4 추적 코드 추가
- 측정 ID `G-4JL7C22JKN` 하드코딩
- `strategy="afterInteractive"` 설정으로 성능 최적화

**파일**: `components/GoogleAnalytics.tsx`

### 2. Layout 통합
- `app/layout.tsx`에 GoogleAnalytics 컴포넌트 추가
- `<body>` 태그 내부 최상단 배치 (ThemeProvider 이전)

---

## 관련 문서

- **구현 가이드**: [1_analytics_implementation.md](./1_analytics_implementation.md)
- **구현 체크리스트**: [1_analytics_todo.md](./1_analytics_todo.md)

---

## 메타데이터

- **예상 소요 시간**: 약 40분
- **난이도**: ⭐☆☆☆☆ (5점 만점 중 1점)
- **우선순위**: HIGH

---

## 참고 자료

- [Next.js Google Analytics 공식 예제](https://github.com/vercel/next.js/tree/canary/examples/with-google-analytics)
- [Google Analytics 4 설정 가이드](https://support.google.com/analytics/answer/9304153)
- [Next.js Script 컴포넌트 문서](https://nextjs.org/docs/app/api-reference/components/script)
