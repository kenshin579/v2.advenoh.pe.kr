# Next.js 정적 사이트 전환 - TODO 체크리스트

> **관련 문서**: [1_nextjs_prd.md](./1_nextjs_prd.md) | [1_nextjs_implementation.md](./1_nextjs_implementation.md)

## Phase 1: Next.js 프로젝트 초기화

### 1.1 프로젝트 설정
- [x] Next.js 14 설치 및 초기화
- [x] `next.config.js` 설정 (static export)
- [x] `tsconfig.json` 경로 별칭 설정 (`@/*`)
- [x] `tailwind.config.ts` 설정 (기존 테마 이전)
- [x] `app/globals.css` 기본 스타일 설정

### 1.2 의존성 설치
- [x] `next-themes` 이미 설치됨 (0.4.6)
- [x] `gray-matter` 이미 설치됨 (4.0.3)
- [x] 기존 의존성 확인 완료
  - `lucide-react` ✅
  - `@radix-ui/*` ✅
  - `zod` ✅
  - `tailwindcss` ✅

---

## Phase 2: 컴포넌트 마이그레이션

### 2.1 shadcn/ui 재설치
- [ ] `components.json` 설정
- [ ] shadcn/ui 초기화
  ```bash
  npx shadcn-ui@latest init
  ```
- [x] 필요한 컴포넌트 복사 (button, card)

### 2.2 기본 컴포넌트 이전
- [x] `components/theme-provider.tsx` 생성 (next-themes 통합)
- [x] `components/Header.tsx` 마이그레이션
  - 테마 토글 버튼 추가
  - next-themes useTheme 훅 사용
  - SNS 링크 추가
- [x] `components/PortfolioCard.tsx` 마이그레이션
  - Next.js Link 컴포넌트 사용
  - 호버 애니메이션 유지

### 2.3 신규 컴포넌트 생성
- [x] `components/Footer.tsx` 생성
  - SNS 링크 추가 (Instagram, LinkedIn, GitHub)
  - lucide-react 아이콘 사용
  - `target="_blank" rel="noopener noreferrer"` 설정

### 2.4 설정 파일 생성
- [x] `lib/utils.ts` 생성
- [x] `lib/site-config.ts` 생성
  - 사이트 메타데이터
  - 작성자 정보 (Frank Oh)
  - SNS 링크

---

## Phase 3: 데이터 및 콘텐츠 처리

### 3.1 포트폴리오 데이터 로더
- [x] `lib/portfolio.ts` 생성
  - `getPortfolioItems()` 함수 구현
  - `contents/website/*.md` 파일 읽기
  - gray-matter로 frontmatter 파싱
  - Zod 스키마 검증
  - 파일명 기준 정렬

### 3.2 데이터 검증
- [x] Zod 스키마 정의 (`portfolioItemSchema`)
- [x] frontmatter 필드 검증
  - `site` (required, URL)
  - `title` (optional)
  - `description` (required)
- [x] 에러 핸들링 (파일 없음, 파싱 실패)

---

## Phase 4: 페이지 구현

### 4.1 Root Layout
- [ ] `app/layout.tsx` 생성
  - ThemeProvider 통합
  - Header, Footer 레이아웃
  - 폰트 최적화 (next/font)
    - Inter (body)
    - Space Grotesk (heading)
  - 메타데이터 설정

### 4.2 홈 페이지
- [ ] `app/page.tsx` 생성
  - `getPortfolioItems()` 데이터 로드
  - 포트폴리오 카드 그리드 렌더링
  - 반응형 레이아웃 (1열 → 2열 → 3열)

### 4.3 404 페이지
- [ ] `app/not-found.tsx` 생성
  - 404 메시지 및 홈 버튼

### 4.4 메타데이터 최적화
- [ ] SEO 메타태그 설정
  - `title`: "Frank Oh Portfolio"
  - `description`
  - Open Graph (`og:*`)
  - 작성자 정보
- [ ] Structured Data (JSON-LD) - 선택적
  - Person schema
  - 소셜 프로필 링크

---

## Phase 5: 최적화 및 테스트

### 5.1 성능 최적화
- [ ] 폰트 최적화 (`next/font` 사용)
- [ ] 이미지 최적화 검토 (필요시)
- [ ] CSS 최적화 (Tailwind purge 확인)

### 5.2 빌드 테스트
- [ ] 로컬 빌드 실행
  ```bash
  npm run build
  ```
- [ ] `out/` 디렉토리 생성 확인
- [ ] 정적 파일 서버 테스트
  ```bash
  npx serve out
  ```

### 5.3 MCP Playwright E2E 테스트
- [ ] **포트폴리오 카드 렌더링 검증**
  - 카드 개수 확인
  - 제목, 설명 표시 확인
  - 외부 링크 클릭 동작
- [ ] **테마 전환 기능 테스트**
  - 테마 토글 버튼 클릭
  - 다크 모드 → 라이트 모드 전환
  - localStorage 저장 확인
- [ ] **반응형 레이아웃 검증**
  - 모바일 (375px): 1열 그리드
  - 태블릿 (768px): 2열 그리드
  - 데스크톱 (1024px+): 3열 그리드
- [ ] **Footer SNS 링크 동작**
  - Instagram 링크 존재 및 URL 확인
  - LinkedIn 링크 존재 및 URL 확인
  - GitHub 링크 존재 및 URL 확인
  - `target="_blank"` 속성 확인
  - 아이콘 렌더링 확인
- [ ] **접근성 테스트**
  - 키보드 네비게이션 (Tab, Enter)
  - ARIA 레이블 확인
  - 스크린 리더 호환성
- [ ] **스크린샷 기반 시각적 회귀 테스트**

### 5.4 Netlify 로컬 테스트
- [ ] `netlify.toml` 설정 확인
- [ ] Netlify CLI 설치
  ```bash
  npm install -D netlify-cli
  ```
- [ ] 로컬 배포 테스트
  ```bash
  npx netlify dev
  ```

---

## Phase 6: 클린업 및 배포 준비

### 6.1 클린업 작업
- [ ] `server/` 디렉토리 제거
- [ ] `client/` 디렉토리 정리 (내용 이전 완료 후)
- [ ] 미사용 파일 제거
  - `vite.config.ts`
  - `drizzle.config.ts`
  - `.replit` (선택적)

### 6.2 의존성 정리
- [ ] 서버 관련 패키지 제거
  ```bash
  npm uninstall express vite @vitejs/plugin-react drizzle-orm @neondatabase/serverless
  ```
- [ ] `package.json` 스크립트 업데이트
  - `dev`: `next dev`
  - `build`: `next build`
  - `start`: `next start`
  - `lint`: `next lint`

### 6.3 문서 업데이트
- [ ] `README.md` 업데이트
  - Next.js 프로젝트로 변경 사항 반영
  - 빌드/개발 명령어 업데이트
- [ ] `CLAUDE.md` 업데이트
  - 프로젝트 구조 변경
  - 개발 명령어 업데이트
  - Next.js 관련 가이드 추가

### 6.4 Netlify 배포 준비
- [ ] `netlify.toml` 최종 확인
  - `build.command`: `npm run build`
  - `build.publish`: `out`
  - 보안 헤더 설정
- [ ] Git 저장소 커밋
  ```bash
  git add .
  git commit -m "Migrate to Next.js static site"
  git push
  ```
- [ ] Netlify 사이트 연동
  ```bash
  npx netlify init
  ```
- [ ] 프로덕션 배포
  ```bash
  npx netlify deploy --prod
  ```

---

## 최종 검증 체크리스트

### 필수 기능 (MVP)
- [ ] ✅ 포트폴리오 카드 그리드가 홈 페이지에 정상 표시
- [ ] ✅ 다크/라이트 테마 전환 동작
- [ ] ✅ 반응형 레이아웃 (모바일/태블릿/데스크톱)
- [ ] ✅ Footer SNS 링크 동작 (Instagram, LinkedIn, GitHub)
- [ ] ✅ `npm run build` 성공적으로 정적 파일 생성
- [ ] ✅ **MCP Playwright 테스트 통과**
- [ ] ✅ **Netlify 배포 성공**

### 성능 및 품질
- [ ] Lighthouse 성능 점수 확인 (90+ 목표)
- [ ] 접근성 점수 확인 (WCAG 2.1 AA)
- [ ] SEO 메타데이터 확인
- [ ] 브라우저 호환성 테스트 (Chrome, Firefox, Safari, Edge)

---

**작업 시작일**: ___________
**완료 예정일**: ___________
**실제 완료일**: ___________

**참고사항**:
- MCP Context7: Next.js, next-themes, shadcn/ui 최신 문서 참조 시 활용
- MCP Playwright: 모든 E2E 테스트 시나리오 실행 시 활용
- 각 Phase 완료 후 다음 Phase로 진행
- 문제 발생 시 [1_nextjs_implementation.md](./1_nextjs_implementation.md) 참조
