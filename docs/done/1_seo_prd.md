# SEO 최적화 PRD (Product Requirements Document)

## 1. 개요

### 1.1 목적
Frank Oh Portfolio 사이트의 검색 엔진 최적화(SEO)를 통해 자연 검색 유입을 증가시키고, 검색 결과에서 더 높은 순위를 달성합니다.

### 1.2 현재 상태 분석

**구현된 SEO 요소:**
- ✅ 기본 메타데이터 (title, description)
- ✅ Open Graph 태그 (소셜 미디어 공유용)
- ✅ Twitter Card 메타데이터
- ✅ 시맨틱 HTML (lang="ko" 설정)
- ✅ 폰트 최적화 (display: 'swap')

**부족한 SEO 요소:**
- ❌ robots.txt 파일 없음
- ❌ sitemap.xml 자동 생성 없음
- ❌ 구조화된 데이터 (JSON-LD) 없음
- ❌ 이미지 Alt 텍스트 불완전
- ❌ Open Graph 이미지 미설정
- ❌ Canonical URL 미설정

### 1.3 관련 문서
- 구현 가이드: `1_seo_implementation.md`
- Todo 체크리스트: `1_seo_todo.md`

---

## 2. 필수 SEO 최적화 요구사항

### 2.1 Robots.txt 생성
- Next.js 14의 `robots.ts` 파일 생성
- 모든 검색 엔진 크롤러 허용
- Sitemap 위치 명시

### 2.2 Sitemap 자동 생성
- Next.js 14의 `sitemap.ts` 파일 생성
- Homepage 및 포트폴리오 항목 자동 포함
- 우선순위(priority)와 변경 빈도(changefreq) 설정

### 2.3 메타데이터 개선
- Canonical URL 추가
- Keywords 메타 태그 추가 (['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI'])
- Open Graph 이미지 추가
- Twitter Card 이미지 추가
- Robots 메타 태그 추가

### 2.4 구조화된 데이터 (JSON-LD)
- Person Schema (Frank Oh 정보, jobTitle: Software Engineer)
- WebSite Schema (사이트 전체 정보)

### 2.5 이미지 SEO 최적화
- Alt 텍스트 개선 (`{title} - {description}` 형식)
- Lazy loading 추가 (`loading="lazy"`)

### 2.6 Open Graph 이미지
- 1200x630px 이미지 생성
- `public/og-image.png` 배치

---

## 3. 성공 지표 (KPI)

### 3.1 기술적 지표
- Robots.txt 정상 작동
- Sitemap.xml 생성 확인
- 구조화된 데이터 정상 적용
- 메타데이터 완전성 확보

### 3.2 비즈니스 지표
- 자연 검색 유입 증가
- 검색 결과 CTR 개선

---

## 4. 파일 구조

```
app/
├── layout.tsx (수정 - 메타데이터 강화, JSON-LD 추가)
├── sitemap.ts (신규 - sitemap 생성)
└── robots.ts (신규 - robots.txt 생성)

lib/
├── site-config.ts (수정 - 설정 확장)
└── structured-data.ts (신규 - JSON-LD 생성)

components/
└── PortfolioCard.tsx (수정 - alt 텍스트 개선)

public/
└── og-image.png (신규 - Open Graph 이미지)

tests/
└── seo.spec.ts (신규 - Playwright SEO 테스트)
```

---

## 5. 검증 도구

- **MCP Playwright** - 자동화된 SEO 테스트 (메타 태그, sitemap, robots.txt 검증)
- **개발자 도구** - 브라우저 내장 도구로 메타데이터 확인

---

## 6. 참고 자료

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central - SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org - Person](https://schema.org/Person)
- [Schema.org - WebSite](https://schema.org/WebSite)
