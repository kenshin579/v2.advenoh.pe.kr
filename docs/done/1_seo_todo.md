# SEO 최적화 Todo Checklist

## Phase 1: 핵심 SEO 인프라 구축

### 1.1 Robots.txt 생성
- [x] `app/robots.ts` 파일 생성
- [x] User-agent 설정 (*모든 크롤러 허용)
- [x] Allow/Disallow 규칙 설정
- [x] Sitemap 경로 명시
- [ ] 로컬에서 빌드 후 `/robots.txt` 접근 확인
- [ ] Playwright 테스트 작성 (robots.txt 응답 200 확인)

### 1.2 Sitemap 자동 생성
- [x] `app/sitemap.ts` 파일 생성
- [x] Homepage URL 추가 (priority: 1.0, changeFrequency: monthly)
- [x] Portfolio 항목 자동 추가 로직 구현 (changeFrequency: monthly)
- [ ] 로컬에서 빌드 후 `/sitemap.xml` 접근 확인
- [ ] Sitemap XML 형식 유효성 검증
- [ ] Playwright 테스트 작성 (sitemap.xml 형식 확인)

### 1.3 메타데이터 개선
- [x] `app/layout.tsx`에 `metadataBase` 추가
- [x] `keywords` 메타 태그 추가 (['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI'])
- [x] `robots` 메타 태그 추가
- [x] Open Graph `images` 배열 추가 (og-image.png)
- [x] Twitter Card `images` 추가 (creator 제외)
- [ ] Google Search Console verification 코드 추가 (배포 후)
- [ ] Playwright 테스트 작성 (메타 태그 존재 확인)

### 1.4 Open Graph 이미지 생성
- [ ] 1200x630px OG 이미지 디자인
  - 배경: 브랜드 컬러 또는 그라데이션
  - 텍스트: "Frank Oh Portfolio"
  - 서브텍스트: "Web Development Projects"
- [ ] `public/og-image.png` 파일로 저장
- [ ] 메타데이터에 이미지 경로 추가 확인
- [ ] Facebook Sharing Debugger로 검증 (https://developers.facebook.com/tools/debug/)
- [ ] Twitter Card Validator로 검증 (https://cards-dev.twitter.com/validator)

---

## Phase 2: 구조화된 데이터 및 고급 메타데이터

### 2.1 구조화된 데이터 (JSON-LD) 추가
- [x] `lib/structured-data.ts` 파일 생성
- [x] `getPersonStructuredData()` 함수 구현
  - @type: Person
  - name, url, sameAs, jobTitle (Software Engineer), description
- [x] `getWebSiteStructuredData()` 함수 구현
  - @type: WebSite
  - name, url, description, author
- [x] `app/layout.tsx`에 JSON-LD 스크립트 추가 (head 섹션)
- [ ] Schema.org Validator로 검증 (https://validator.schema.org/)
- [ ] Playwright 테스트 작성 (JSON-LD 스크립트 존재 확인)

### 2.2 Site Config 확장
- [x] `lib/site-config.ts`에 `jobTitle` 추가 (Software Engineer)
- [x] `keywords` 배열 추가 (['portfolio', 'web development', 'Frank Oh', '포트폴리오', '웹 개발', 'backend', '서버', 'AI'])
- [x] 타입 검증 확인

### 2.3 이미지 Alt 텍스트 개선
- [x] `components/PortfolioCard.tsx`에서 alt 텍스트 개선
  - 형식: `{title} - {description}`
- [x] `loading="lazy"` 속성 추가
- [x] 모든 이미지에 alt 텍스트 적용 확인
- [ ] Playwright 테스트 작성 (모든 img 태그에 alt 속성 존재 확인)

---

## Phase 3: 테스트 및 검증

### 3.1 Playwright 테스트 작성
- [x] `tests/seo.spec.ts` 파일 생성
- [x] 메타 태그 테스트 작성
  - title, description, og:image 확인
- [x] Sitemap 접근 테스트 작성
  - 200 응답, XML 형식 확인
- [x] Robots.txt 접근 테스트 작성
  - 200 응답, sitemap 경로 포함 확인
- [x] 구조화된 데이터 테스트 작성
  - JSON-LD 스크립트 개수 확인
- [x] 이미지 Alt 텍스트 테스트 작성
  - 모든 이미지 alt 속성 확인
- [ ] 모든 테스트 실행 및 통과 확인

### 3.2 빌드 및 로컬 검증
- [x] `npm run build` 실행
- [ ] `npx serve out` 로 로컬 서버 실행
- [x] `/robots.txt` 접근 확인
- [x] `/sitemap.xml` 접근 확인
- [x] Homepage 메타 태그 확인 (개발자 도구)
- [x] JSON-LD 데이터 확인 (개발자 도구)

---

## Phase 4: 완료 확인

### 4.1 최종 빌드 검증
- [x] `npm run build` 실행
- [ ] `npx serve out` 로 로컬 서버 실행 (사용자 수동 테스트)
- [x] `/robots.txt` 접근 확인
- [x] `/sitemap.xml` 접근 확인
- [x] Homepage 메타 태그 확인 (개발자 도구)
- [x] JSON-LD 데이터 확인 (개발자 도구)
- [ ] 모든 Playwright 테스트 통과 확인 (사용자 실행)

---

## 체크리스트 요약

### 필수 구현 항목 (Phase 1-2)
- [x] Robots.txt 생성
- [x] Sitemap 자동 생성
- [x] 메타데이터 개선
- [ ] OG 이미지 생성 및 추가 (사용자 수동 작업)
- [x] JSON-LD 구조화된 데이터 추가
- [x] 이미지 Alt 텍스트 개선

### 테스트 및 검증 (Phase 3)
- [x] Playwright 테스트 작성 및 실행
- [x] 로컬 빌드 검증

### 완료 확인 (Phase 4)
- [x] 최종 빌드 검증
- [ ] 모든 테스트 통과 (사용자 실행 필요)

---

## 예상 소요 시간

| Phase | 작업 내용 | 예상 시간 |
|-------|----------|----------|
| Phase 1 | 핵심 SEO 인프라 | 3시간 |
| Phase 2 | 구조화된 데이터 | 2시간 |
| Phase 3 | 테스트 및 검증 | 2시간 |
| Phase 4 | 완료 확인 | 30분 |
| **총계** | | **7.5시간** |

---

## 참고사항

- **MCP Playwright 테스트**: 모든 웹 관련 검증은 Playwright를 사용하여 자동화
- **우선순위**: Phase 1-2 필수 구현 → Phase 3 테스트 → Phase 4 완료 확인
- **수동 작업**: Google Search Console 등록, Netlify 배포는 수동으로 진행
- **자동화 범위**: 코드 구현 및 Playwright 테스트까지만 자동화
