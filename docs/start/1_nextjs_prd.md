# Next.js 정적 사이트 전환 PRD

## 프로젝트 개요

현재 Express + Vite 기반의 풀스택 애플리케이션을 Next.js 기반의 정적 사이트(SSG)로 전환합니다.

### 전환 목표
- **서버리스 배포**: 서버 구동 없이 정적 파일만으로 호스팅 가능
- **성능 최적화**: SSG를 통한 빠른 페이지 로딩
- **간소화된 아키텍처**: 백엔드 제거, 프론트엔드 중심 구조
- **개발 경험 개선**: Next.js의 파일 기반 라우팅 및 최적화 활용

## 현재 아키텍처 분석

### 제거 대상
- `server/` 디렉토리 전체 (Express 백엔드)
  - `index.ts` - Express 서버
  - `routes.ts` - API 라우트
  - `vite.ts` - Vite 개발 서버 통합
  - `storage.ts` - Drizzle ORM (현재 미사용)

### 마이그레이션 대상
- `client/` 디렉토리
  - `src/components/` - React 컴포넌트들 → Next.js 컴포넌트로 전환
  - `src/pages/` - 페이지 컴포넌트들 → Next.js App Router 또는 Pages Router
  - `src/hooks/` - Custom hooks (그대로 유지 가능)
  - `src/lib/` - 유틸리티 함수들 (그대로 유지)

### 유지/활용 대상
- `contents/website/` - 마크다운 기반 포트폴리오 콘텐츠
  - Next.js에서 빌드 타임에 파싱하여 정적 페이지 생성
- `shared/schema.ts` - Zod 스키마 (데이터 검증용으로 유지)
- Tailwind CSS + shadcn/ui 설정
- 테마 시스템 (다크/라이트 모드)

## 기술 스택

### Next.js 설정
- **버전**: Next.js 14+ (App Router 권장)
- **렌더링 전략**: Static Site Generation (SSG)
- **라우팅**: App Router (`app/` 디렉토리)
- **TypeScript**: 기존 설정 유지

### 유지되는 스택
- **스타일링**: Tailwind CSS v3
- **UI 컴포넌트**: shadcn/ui (Radix UI)
- **타입 체크**: Zod schemas
- **폰트**: Inter (body), Space Grotesk (headings)

### 새로 추가되는 도구
- **마크다운 처리**:
  - `gray-matter` (frontmatter 파싱, 기존 사용 중)
  - `next-mdx-remote` 또는 `@next/mdx` (선택적, 향후 MDX 지원용)
- **이미지 최적화**: Next.js Image 컴포넌트

### 개발 도구 및 MCP 서버 활용
- **MCP Context7**: 라이브러리 최신 문서 및 베스트 프랙티스 참조
  - Next.js, React, Tailwind CSS 공식 패턴
  - next-themes, shadcn/ui 사용법
  - 버전별 마이그레이션 가이드
- **MCP Playwright**: E2E 테스트 및 브라우저 자동화
  - 포트폴리오 카드 렌더링 검증
  - 테마 전환 동작 테스트
  - 반응형 레이아웃 시각적 검증
  - 접근성 자동화 테스트 (WCAG 준수)

## 주요 기능 요구사항

### 1. 포트폴리오 시스템 (필수)
현재 `/api/portfolio` 엔드포인트가 제공하는 기능을 정적으로 구현:

- **데이터 소스**: `contents/website/*.md` 파일들
- **빌드 타임 처리**:
  - 모든 마크다운 파일을 읽고 frontmatter 파싱
  - `portfolioItemSchema`로 검증
  - 정적 데이터로 변환하여 페이지에 주입

- **Frontmatter 스키마** (유지):
  ```markdown
  ---
  site: https://example.com  # Required
  title: Project Title        # Optional
  description: Brief desc     # Required
  ---
  ```

- **정렬**: 파일명 기준 정렬 (현재 로직 유지)

### 2. 페이지 구조

#### 홈 페이지 (`/`)
- 현재 `client/src/pages/Home.tsx` 내용 마이그레이션
- 포트폴리오 카드 그리드 표시
- 반응형 레이아웃: 1열(모바일) → 2열(태블릿) → 3열(데스크톱)

#### 404 페이지 (`/404`)
- 현재 `client/src/pages/NotFound.tsx` 내용 마이그레이션

#### 향후 확장 가능성
- 개별 포트폴리오 상세 페이지 (`/portfolio/[slug]`)
  - 현재 마크다운 body 콘텐츠는 미사용이지만 향후 활용 가능
  - Dynamic routes로 구현 준비

### 3. 컴포넌트 마이그레이션

#### 필수 컴포넌트
- **Header** (`components/Header.tsx`)
  - 네비게이션
  - 테마 토글 버튼
  - **SNS 링크**: Instagram, LinkedIn, GitHub (선택적 표시)

- **Footer** (`components/Footer.tsx`) - 신규 추가
  - 저작권 정보
  - **SNS 소셜 링크**:
    - Instagram: https://www.instagram.com/frank.photosnap/
    - LinkedIn: https://www.linkedin.com/in/frank-oh-abb80b10/
    - GitHub: https://github.com/kenshin579
  - 아이콘 기반 링크 (lucide-react 아이콘 활용)
  - 외부 링크 새 탭 열기 (`target="_blank" rel="noopener noreferrer"`)

- **PortfolioCard** (`components/PortfolioCard.tsx`)
  - 포트폴리오 아이템 카드
  - 호버 애니메이션 (scale-105)
  - 16:10 aspect ratio 유지

- **ThemeProvider** (`components/theme-provider.tsx`)
  - 다크/라이트 모드 전환
  - localStorage 기반 테마 저장
  - Next.js에서 SSR 호환성 확보 필요 (`next-themes` 라이브러리 고려)

#### shadcn/ui 컴포넌트 (기존 유지)
- Button, Card, DropdownMenu 등
- Next.js 환경에서 재설치 필요

### 4. 스타일링 시스템

#### Tailwind CSS 설정
- `tailwind.config.js` 기존 설정 이전
- 커스텀 컬러, 폰트 설정 유지
- 다크 모드: `class` 전략 사용

#### 디자인 가이드라인 준수
- 타이포그래피: Inter (body), Space Grotesk (headings)
- 스페이싱: Tailwind units 2, 4, 6, 8, 12, 16, 20
- 애니메이션: 200ms transition, subtle hover effects

### 5. 빌드 및 배포

#### Static Export 설정
```javascript
// next.config.js
module.exports = {
  output: 'export',  // 정적 사이트 생성
  images: {
    unoptimized: true  // 정적 호스팅용
  }
}
```

#### 빌드 명령어
```bash
npm run build  # Next.js static export
npm run export # 선택적 alias
```

#### 배포 타겟
- **Netlify** (선택) - 정적 사이트 호스팅 및 자동 배포
  - Next.js Static Export 지원
  - Git 연동 자동 배포 (CD)
  - 환경 변수 관리
  - 커스텀 도메인 설정
  - CDN 및 전역 배포

**Netlify 배포 설정**:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
```

## 마이그레이션 단계

상세한 구현 가이드 및 작업 체크리스트는 별도 문서를 참조하세요:

- **구현 가이드**: [1_nextjs_implementation.md](./1_nextjs_implementation.md)
  - 프로젝트 구조
  - 설정 파일 상세
  - 컴포넌트 코드 예시
  - 배포 설정

- **작업 체크리스트**: [1_nextjs_todo.md](./1_nextjs_todo.md)
  - Phase 1: Next.js 프로젝트 초기화
  - Phase 2: 컴포넌트 마이그레이션
  - Phase 3: 데이터 및 콘텐츠 처리
  - Phase 4: 페이지 구현
  - Phase 5: 최적화 및 테스트 (MCP Playwright)
  - Phase 6: 클린업 및 배포 준비

### 핵심 작업 흐름

1. **초기화** → Next.js 14 설치, 설정 파일 구성
2. **컴포넌트** → Header, Footer, PortfolioCard, ThemeProvider 마이그레이션
3. **데이터** → 마크다운 파싱 로직 구현 (`lib/portfolio.ts`)
4. **페이지** → 홈, 404 페이지 구현
5. **테스트** → MCP Playwright E2E 테스트 (테마, 반응형, SNS 링크, 접근성)
6. **배포** → Netlify 배포 및 클린업

## 의존성 변경 사항

### 제거할 패키지
```json
{
  "express": "^4.x",
  "vite": "^5.x",
  "@vitejs/plugin-react": "^4.x",
  "drizzle-orm": "^0.x",
  "@neondatabase/serverless": "^0.x",
  // 기타 서버 관련 패키지
}
```

### 추가할 패키지
```json
{
  "next": "^14.0.0",
  "react": "^18.x",
  "react-dom": "^18.x",
  "next-themes": "^0.2.x",  // 테마 시스템
  "gray-matter": "^4.x",     // 기존 사용 중
  // 선택적: "next-mdx-remote" 또는 "@next/mdx"
}
```

### 개발 의존성 (devDependencies)
```json
{
  "netlify-cli": "^17.x"  // Netlify 로컬 테스트 및 배포
}
```

### 유지할 패키지
```json
{
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "zod": "^3.x",
  "gray-matter": "^4.x",
  "lucide-react": "^0.x",
  "@radix-ui/*": "^1.x",
  "class-variance-authority": "^0.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

## 설정 파일 변경

### 새로 생성할 파일
- `next.config.js` - Next.js 설정 (static export)
- `netlify.toml` - Netlify 배포 설정
- `app/layout.tsx` - Root layout (App Router 사용 시)
- `app/page.tsx` - 홈 페이지 (App Router 사용 시)
- `middleware.ts` - 선택적 (리다이렉트 등)
- **`lib/site-config.ts`** - 사이트 메타데이터 및 SNS 링크 설정
  ```typescript
  export const siteConfig = {
    name: "Frank Oh Portfolio",
    description: "Portfolio website showcasing web development projects",
    url: "https://advenoh.pe.kr", // 실제 도메인으로 변경
    author: {
      name: "Frank Oh",
      social: {
        instagram: "https://www.instagram.com/frank.photosnap/",
        linkedin: "https://www.linkedin.com/in/frank-oh-abb80b10/",
        github: "https://github.com/kenshin579"
      }
    }
  }
  ```

### 수정할 파일
- `tsconfig.json` - Next.js 경로 별칭 및 설정
- `tailwind.config.js` - content 경로 업데이트
- `package.json` - 스크립트 및 의존성

### 제거할 파일
- `vite.config.ts`
- `drizzle.config.ts`
- `.replit` (Replit 설정, 필요 시 업데이트)

## 비기능 요구사항

### 성능
- Lighthouse 성능 점수 90+ 목표
- First Contentful Paint < 1.5s
- Time to Interactive < 3s

### 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### SEO
- 메타 태그 최적화:
  - `title`: "Frank Oh Portfolio"
  - `description`: Portfolio 사이트 설명
  - `og:image`: 대표 이미지 (선택적)
  - `og:url`: https://advenoh.pe.kr
  - **작성자 정보**: Frank Oh
  - **소셜 미디어 메타태그**:
    - `twitter:creator`: @frank (있는 경우)
    - Open Graph 프로필 정보
- sitemap.xml 생성
- robots.txt 설정
- **Structured Data (JSON-LD)**:
  - Person schema (작성자 정보)
  - 소셜 프로필 링크 (Instagram, LinkedIn, GitHub)

### 브라우저 호환성
- 최신 2개 버전의 주요 브라우저 (Chrome, Firefox, Safari, Edge)
- 모바일 브라우저 지원 (iOS Safari, Chrome Mobile)

## 성공 기준

### 필수 (MVP)
- ✅ 포트폴리오 카드 그리드가 홈 페이지에 정상 표시
- ✅ 다크/라이트 테마 전환 동작
- ✅ 반응형 레이아웃 (모바일/태블릿/데스크톱)
- ✅ `npm run build` 성공적으로 정적 파일 생성
- ✅ **MCP Playwright 테스트 통과**: 렌더링, 테마, 반응형, 접근성 검증
- ✅ **Netlify 배포 성공**: 프로덕션 환경에서 정상 동작

### 선택적 (향후 개선)
- 🔲 개별 포트폴리오 상세 페이지 구현
- 🔲 마크다운 body 콘텐츠 렌더링 (MDX)
- 🔲 이미지 갤러리 기능
- 🔲 태그 기반 필터링
- 🔲 검색 기능
- 🔲 다국어 지원 (i18n)

## 위험 요소 및 대응

### 위험 1: 테마 시스템 SSR 충돌
- **문제**: 서버/클라이언트 불일치로 인한 hydration 오류
- **대응**: `next-themes` 라이브러리 사용 또는 클라이언트 전용 렌더링

### 위험 2: 빌드 타임 데이터 로딩 실패
- **문제**: 마크다운 파싱 오류로 빌드 실패
- **대응**: 강력한 에러 핸들링 및 Zod 스키마 검증

### 위험 3: shadcn/ui 컴포넌트 호환성
- **문제**: Next.js 환경에서 일부 컴포넌트 동작 이상
- **대응**: Next.js 공식 문서 참고하여 재설치 및 설정

### 위험 4: 경로 별칭 충돌
- **문제**: `@/` 등 기존 별칭이 Next.js 기본 설정과 충돌
- **대응**: Next.js 표준 경로 별칭 채택 (`@/` for app root)

## 참고 자료

### Next.js 공식 문서
- [Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [App Router](https://nextjs.org/docs/app)
- [next/font](https://nextjs.org/docs/app/api-reference/components/font)
- [next/image](https://nextjs.org/docs/app/api-reference/components/image)

### 마이그레이션 가이드
- [Migrating from Vite to Next.js](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)

### 배포 가이드
- [Netlify Next.js 배포](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Static Exports](https://docs.netlify.com/frameworks/next-js/#manual-configuration)
- [netlify.toml 설정 가이드](https://docs.netlify.com/configure-builds/file-based-configuration/)

### MCP 서버 활용
- **Context7**: 라이브러리 최신 문서 참조 시 활용
- **Playwright**: E2E 테스트 및 시각적 검증 시 활용

## 타임라인 (예상)

- **Week 1**: Phase 1-2 (프로젝트 초기화, 컴포넌트 마이그레이션)
- **Week 2**: Phase 3-4 (데이터 처리, 페이지 구현)
- **Week 3**: Phase 5-6 (최적화, 클린업, 배포)

---

**문서 버전**: 1.3
**작성일**: 2025-11-07
**최종 수정**: 2025-11-07
**검토 필요**: 아키텍처 결정 (App Router vs Pages Router)

## 변경 이력

### v1.3 (2025-11-07)
- **문서 구조 개선**:
  - 구현 가이드 분리: `1_nextjs_implementation.md`
  - TODO 체크리스트 분리: `1_nextjs_todo.md`
  - PRD에서 마이그레이션 단계 상세 내용 제거, 별도 문서 참조로 변경
- 핵심 작업 흐름 요약 추가

### v1.2 (2025-11-07)
- **SNS 소셜 링크 추가**:
  - Instagram: https://www.instagram.com/frank.photosnap/
  - LinkedIn: https://www.linkedin.com/in/frank-oh-abb80b10/
  - GitHub: https://github.com/kenshin579
- Footer 컴포넌트 신규 추가 (SNS 링크 표시)
- Header에 SNS 링크 옵션 추가
- `lib/site-config.ts` 설정 파일 생성 (사이트 메타데이터 및 작성자 정보)
- SEO 섹션에 작성자 및 소셜 프로필 메타태그 추가
- Structured Data (JSON-LD) 요구사항 추가

### v1.1 (2025-11-07)
- 배포 플랫폼: Netlify로 확정
- MCP 서버 활용 명시:
  - Context7: 라이브러리 최신 문서 참조
  - Playwright: E2E 테스트 및 시각적 검증
- Phase 5에 Playwright 기반 테스트 시나리오 추가
- Netlify 배포 설정 가이드 추가 (netlify.toml)

### v1.0 (2025-11-07)
- 초기 PRD 작성
- Next.js 정적 사이트 전환 요구사항 정의
