# Google AdSense 구현 가이드

## 📋 개요

이 문서는 포트폴리오 사이트(`v2.advenoh.pe.kr`)에 Google AdSense 스크립트를 통합하는 구현 가이드입니다.

---

## 🎯 구현 목표

- Next.js Script 컴포넌트를 사용한 AdSense 스크립트 통합
- 참고 프로젝트(`blog-v2.advenoh.pe.kr`)와 동일한 패턴 적용
- 정적 사이트 환경에서 AdSense 정상 동작 확인

---

## 📝 구현 단계

### Step 1: layout.tsx 수정

**파일**: `app/layout.tsx`

#### 1.1 Script 컴포넌트 import

파일 상단에 Script import 추가 (없는 경우):

```typescript
import Script from 'next/script'
```

#### 1.2 AdSense 스크립트 추가

`<head>` 태그 내부에 AdSense 스크립트 추가:

```tsx
<html lang="ko" suppressHydrationWarning>
  <head>
    {/* Structured Data */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
    />

    {/* Google AdSense */}
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  </head>
  <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
    <GoogleAnalytics />
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
```

#### 1.3 Script 설정 상세

| 속성 | 값 | 설명 |
|------|-----|------|
| `async` | true | 비동기 로딩 |
| `src` | AdSense URL | Publisher ID 포함 |
| `crossOrigin` | "anonymous" | CORS 정책 준수 |
| `strategy` | "afterInteractive" | 페이지 인터랙티브 후 로드 |

**Publisher ID**: `ca-pub-8868959494983515`

---

### Step 2: ads.txt 검증

**파일**: `public/ads.txt`

#### 2.1 파일 내용 확인

```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

#### 2.2 검증 포인트

- ✅ Publisher ID가 스크립트와 일치 (`pub-8868959494983515`)
- ✅ 형식이 올바름
- ✅ 파일이 `public/` 디렉토리에 위치

---

### Step 3: 빌드 및 로컬 테스트

#### 3.1 정적 빌드 생성

```bash
npm run build
```

#### 3.2 빌드 결과 확인

```bash
# ads.txt 파일 확인
ls -la out/ads.txt

# 빌드된 HTML에서 스크립트 확인
grep -r "adsbygoogle" out/
```

#### 3.3 로컬 프리뷰

```bash
# 프리뷰 서버 실행
npm run start
```

**브라우저 개발자 도구 확인**:
1. Network 탭: `adsbygoogle.js` 로드 확인
2. Console 탭: 에러 없는지 확인
3. Elements 탭: `<script>` 태그 존재 확인

---

### Step 4: 배포 및 검증

#### 4.1 Git Push (Netlify 자동 배포)

```bash
# 변경사항 커밋
git add .
git commit -m "feat: Add Google AdSense integration"

# main 브랜치에 push
git push origin main

# main 브랜치로 merge 시 Netlify가 자동으로 배포
```

**참고**: Netlify는 main 브랜치에 merge되면 자동으로 빌드 및 배포를 시작합니다.

#### 4.2 배포 후 검증

**ads.txt 접근 확인**:
```bash
curl https://advenoh.pe.kr/ads.txt
```

예상 결과:
```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

**페이지 소스 확인**:
1. `https://advenoh.pe.kr` 접속
2. 우클릭 → "페이지 소스 보기"
3. `adsbygoogle.js` 검색

---

## 🧪 테스트

### MCP Playwright를 이용한 E2E 테스트

AdSense 스크립트 로드를 검증하기 위해 MCP Playwright 도구를 사용합니다.

#### 테스트 1: 메인 페이지에서 AdSense 스크립트 확인

```
1. mcp__playwright__playwright_navigate 사용
   - url: https://advenoh.pe.kr
   - headless: false (개발 중에는 false, CI에서는 true)

2. mcp__playwright__playwright_get_visible_html 사용
   - selector: head
   - removeScripts: false (스크립트 확인 필요)

3. HTML에서 확인할 내용:
   - <script> 태그 존재
   - src 속성에 "adsbygoogle.js" 포함
   - Publisher ID "ca-pub-8868959494983515" 포함
   - crossOrigin="anonymous" 속성 존재

4. mcp__playwright__playwright_console_logs 사용
   - type: error
   - AdSense 관련 에러 없는지 확인
```

#### 테스트 2: ads.txt 파일 접근 확인

```
1. mcp__playwright__playwright_navigate 사용
   - url: https://advenoh.pe.kr/ads.txt

2. mcp__playwright__playwright_get_visible_text 사용
   - 페이지 텍스트 추출

3. 텍스트에서 확인할 내용:
   - "google.com" 포함
   - "pub-8868959494983515" 포함
   - "DIRECT" 포함
```

#### 테스트 3: 네트워크 요청 확인

```
1. mcp__playwright__playwright_navigate 사용
   - url: https://advenoh.pe.kr

2. 브라우저 개발자 도구에서 Network 탭 확인
   - adsbygoogle.js 파일 로드 확인
   - Status 200 확인

3. mcp__playwright__playwright_screenshot 사용
   - name: adsense-loaded
   - fullPage: true
   - 스크린샷으로 시각적 확인

4. mcp__playwright__playwright_close 사용
   - 브라우저 종료
```

**MCP Playwright 사용 예시**:

Claude Code에서 직접 MCP Playwright 도구를 호출하여 테스트를 수행합니다. 별도의 테스트 코드 작성이 필요 없으며, 대화형으로 테스트를 진행할 수 있습니다.

---

## 🔍 Google AdSense 콘솔 설정

### 1. 사이트 추가

1. [Google AdSense](https://www.google.com/adsense) 로그인
2. **사이트** → **사이트 추가**
3. URL 입력: `https://advenoh.pe.kr`
4. 승인 대기

### 2. ads.txt 검증

1. AdSense 콘솔에서 **사이트** 메뉴
2. `advenoh.pe.kr` 선택
3. **ads.txt** 상태 확인
4. "확인됨" 표시 확인

### 3. 사이트 승인

- 승인까지 보통 1-2일 소요
- 승인 조건:
  - 충분한 콘텐츠
  - AdSense 정책 준수
  - ads.txt 검증 완료

---

## ⚠️ 트러블슈팅

### 문제 1: AdSense 스크립트가 로드되지 않음

**원인**: Script import 누락

**해결**:
```typescript
import Script from 'next/script'
```

### 문제 2: ads.txt 접근 불가 (404)

**원인**: 빌드 시 ads.txt가 out/ 디렉토리에 복사되지 않음

**해결**:
```bash
# public/ 디렉토리에 ads.txt가 있는지 확인
ls -la public/ads.txt

# 빌드 다시 실행
npm run build

# out/ 디렉토리 확인
ls -la out/ads.txt
```

### 문제 3: CORS 에러

**원인**: crossOrigin 속성 누락

**해결**:
```tsx
<Script
  crossOrigin="anonymous"  // 이 속성 필수
  src="..."
/>
```

### 문제 4: Publisher ID 불일치

**확인**:
```bash
# ads.txt 확인
cat public/ads.txt | grep pub-

# layout.tsx 확인
grep "ca-pub-" app/layout.tsx
```

**두 값이 일치해야 함**:
- ads.txt: `pub-8868959494983515`
- layout.tsx: `ca-pub-8868959494983515`

---

## ✅ 완료 확인

구현이 완료되면 다음을 확인:

- [x] `app/layout.tsx`에 Script 컴포넌트 추가됨
- [x] Publisher ID가 올바르게 입력됨
- [x] `npm run build` 성공
- [x] `out/ads.txt` 파일 존재
- [x] 브라우저에서 스크립트 로드 확인
- [x] 배포 후 `https://advenoh.pe.kr/ads.txt` 접근 가능
- [x] Google AdSense 콘솔에서 사이트 인식
- [x] Playwright 테스트 통과

---

## 📚 참고

- **참고 구현**: `blog-v2.advenoh.pe.kr/app/layout.tsx:57-63`
- **Next.js Script**: https://nextjs.org/docs/app/api-reference/components/script
- **Google AdSense 가이드**: https://support.google.com/adsense/answer/10162
