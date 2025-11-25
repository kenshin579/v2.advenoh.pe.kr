# Implementation: Light/Dark 모드 기능 제거

## 구현 개요
헤더의 테마 전환 기능을 제거하고 단일 다크 모드로 고정

## 변경 파일 목록

### 1. components/Header.tsx
**제거할 import**
```typescript
// 기존
import { Moon, Sun, Instagram, Linkedin, Github } from 'lucide-react'
import { useTheme } from 'next-themes'

// 변경 후
import { Instagram, Linkedin, Github } from 'lucide-react'
```

**제거할 코드**
```typescript
// 10번 라인: useTheme 훅
const { theme, setTheme } = useTheme()

// 33-35번 라인: toggleTheme 함수
const toggleTheme = () => {
  setTheme(theme === 'dark' ? 'light' : 'dark')
}

// 63-73번 라인: 테마 토글 버튼 전체
<Button
  variant="ghost"
  size="icon"
  onClick={toggleTheme}
  className="rounded-md"
  aria-label="Toggle theme"
  data-testid="button-theme-toggle"
>
  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</Button>
```

### 2. app/layout.tsx
**제거할 import**
```typescript
// 4번 라인
import { ThemeProvider } from '@/components/theme-provider'
```

**수정할 HTML 태그**
```typescript
// 79번 라인
// 기존
<html lang="ko" suppressHydrationWarning>

// 변경 후
<html lang="ko">
```

**제거할 wrapper**
```typescript
// 98-114번 라인
// 기존
<body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
  <GoogleAnalytics />
  <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem={false}
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

// 변경 후
<body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
  <GoogleAnalytics />
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
</body>
```

### 3. components/theme-provider.tsx
**파일 삭제**
```bash
rm components/theme-provider.tsx
```

### 4. package.json
**제거할 의존성**
```json
// 57번 라인
"next-themes": "^0.4.6"
```

**의존성 재설치**
```bash
npm install
```

## 테스트 방법

### MCP Playwright를 사용한 E2E 테스트
```typescript
// 테스트 시나리오
1. Header 렌더링 확인
   - 로고 표시 확인
   - SNS 링크 3개 표시 확인
   - 테마 토글 버튼 미표시 확인

2. Header 기능 테스트
   - 로고 클릭 시 홈으로 이동
   - GitHub 링크 클릭 시 새 탭에서 열림
   - LinkedIn 링크 클릭 시 새 탭에서 열림
   - Instagram 링크 클릭 시 새 탭에서 열림

3. 스타일 테스트
   - 다크 모드 스타일 적용 확인
   - mix-blend-difference 효과 확인
   - 반응형 레이아웃 확인
```

### 빌드 및 타입 체크
```bash
# 타입 체크
npm run check

# 빌드 테스트
npm run build

# 개발 서버 확인
npm run dev

# E2E 테스트
npm run test
```

## 검증 항목
- [ ] Header에 테마 토글 버튼이 없음
- [ ] SNS 링크 3개 정상 동작
- [ ] 로고 클릭 시 홈으로 이동
- [ ] 타입 에러 없음
- [ ] 빌드 성공
- [ ] Playwright 테스트 통과
- [ ] 다크 모드 스타일 정상 적용
- [ ] next-themes 의존성 제거됨
- [ ] theme-provider.tsx 파일 삭제됨

## 주의 사항
- Header의 `mix-blend-difference` 클래스는 유지 (흰색 텍스트 효과)
- globals.css의 CSS 변수는 유지 (dark 모드 변수 사용)
- 다른 컴포넌트에는 영향 없음
