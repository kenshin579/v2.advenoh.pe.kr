# 네이버 검색 등록 구현 가이드

## 개요
Next.js 정적 사이트에 네이버 사이트 소유권 인증 메타 태그를 추가합니다.

**인증 코드**: `b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57`

---

## 구현 단계

### 1. 메타데이터 수정

**파일**: `app/layout.tsx`

**변경 전**:
```typescript
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@advenoh",
  },
}
```

**변경 후**:
```typescript
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
  ],
  creator: siteConfig.author.name,
  verification: {  // 추가
    other: {
      'naver-site-verification': 'b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57',
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@advenoh",
  },
}
```

**추가 내용**:
```typescript
verification: {
  other: {
    'naver-site-verification': 'b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57',
  },
},
```

---

## 기술적 고려사항

### Next.js Metadata API
- `verification` 속성 사용으로 자동 메타 태그 생성
- Google, Yandex, Me 등 다른 검색엔진도 지원
- `other` 객체로 커스텀 verification 메타 태그 추가 가능

### 정적 사이트 호환성
- Next.js 정적 빌드 (`output: 'export'`)와 완벽 호환
- 빌드 시 HTML `<head>` 섹션에 메타 태그 자동 삽입

---

## 빌드 및 배포

### 로컬 빌드
```bash
npm run build
```

**확인 사항**:
- 빌드 에러 없이 완료
- `out/index.html` 파일에 메타 태그 포함 확인

### 메타 태그 확인
```bash
cat out/index.html | grep "naver-site-verification"
```

**예상 출력**:
```html
<meta name="naver-site-verification" content="b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57"/>
```

### 배포
- Netlify에 자동 배포 (기존 설정 사용)
- 추가 환경 변수 설정 불필요

---

## 검증 방법

### 1. 로컬 빌드 확인
```bash
npm run build
npx serve out
```

**브라우저 개발자 도구 확인**:
1. Elements 탭 → `<head>` 섹션 확인
2. 네이버 메타 태그 존재 확인

### 2. MCP Playwright 자동 검증

**프로덕션 빌드 테스트**:
```bash
npm run build
npx serve out  # 별도 터미널에서 실행
```

**MCP Playwright 실행 순서**:

1. **페이지 접속**
   - 도구: `mcp__playwright__playwright_navigate`
   - URL: `http://localhost:3000`

2. **HTML 확인**
   - 도구: `mcp__playwright__playwright_get_visible_html`
   - 확인: 네이버 메타 태그 포함 여부
   - 검색 패턴: `naver-site-verification`

3. **메타 태그 값 검증**
   - 도구: `mcp__playwright__playwright_evaluate`
   - 스크립트:
     ```javascript
     const metaTag = document.querySelector('meta[name="naver-site-verification"]');
     return {
       exists: metaTag !== null,
       content: metaTag ? metaTag.getAttribute('content') : null,
       isCorrect: metaTag ? metaTag.getAttribute('content') === 'b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57' : false
     }
     ```
   - 예상 결과:
     ```json
     {
       "exists": true,
       "content": "b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57",
       "isCorrect": true
     }
     ```

4. **브라우저 종료**
   - 도구: `mcp__playwright__playwright_close`

### 3. 프로덕션 환경

**배포 후 확인**:
1. 배포된 사이트 접속 (`https://advenoh.pe.kr`)
2. 브라우저 개발자 도구로 메타 태그 확인
3. 네이버 서치어드바이저에서 소유권 인증 수행

**네이버 서치어드바이저**:
1. [네이버 서치어드바이저](https://searchadvisor.naver.com/) 로그인
2. 사이트 등록 → HTML 태그 인증 선택
3. "소유권 확인" 버튼 클릭
4. 인증 성공 확인

---

## 트러블슈팅

### 메타 태그가 HTML에 없는 경우
- `npm run build` 재실행
- `out/index.html` 파일 직접 확인
- `app/layout.tsx`의 `verification` 객체 문법 확인

### 네이버 인증 실패
- 인증 코드 정확성 확인 (`b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57`)
- 배포 완료 후 충분한 시간 대기 (1-2분)
- 브라우저 캐시 삭제 후 재시도
