# Google Analytics 구현 체크리스트

## Phase 1: 구현

### 1.1 GoogleAnalytics 컴포넌트 생성
- [x] `components/GoogleAnalytics.tsx` 파일 생성
- [x] `next/script` import 추가
- [x] GA 스크립트 컴포넌트 작성 (측정 ID: `G-4JL7C22JKN`)
- [x] `strategy="afterInteractive"` 설정 확인

### 1.2 Layout 수정
- [x] `app/layout.tsx` 파일 열기
- [x] `GoogleAnalytics` 컴포넌트 import 추가
- [x] `<body>` 태그 내부 최상단에 `<GoogleAnalytics />` 추가
- [x] ThemeProvider보다 앞에 배치 확인

---

## Phase 2: 로컬 테스트

### 2.1 개발 서버 테스트
- [x] `npm run dev` 실행
- [ ] 브라우저에서 `http://localhost:3000` 접속
- [ ] 개발자 도구 → Network 탭에서 `gtag/js` 요청 확인
- [ ] Console 탭에서 `window.dataLayer` 객체 존재 확인
- [ ] 에러 없이 정상 로드 확인

### 2.2 빌드 테스트
- [x] `npm run build` 실행
- [x] 빌드 에러 없이 완료 확인
- [x] `out/` 디렉토리 생성 확인

### 2.3 프로덕션 프리뷰
- [ ] `npm run start` 실행
- [ ] 브라우저에서 프리뷰 접속
- [ ] Network 탭에서 GA 스크립트 로드 확인
- [ ] 정적 파일에 스크립트 포함 확인

---

## Phase 3: MCP Playwright 테스트

### 3.1 로컬 개발 서버 테스트
- [ ] `npm run dev` 실행 (별도 터미널)
- [ ] MCP Playwright로 페이지 접속
- [ ] HTML에 GA 스크립트 포함 확인
- [ ] JavaScript로 `window.dataLayer` 객체 확인
- [ ] JavaScript로 `window.gtag` 함수 확인

### 3.2 MCP Playwright 실행 순서

**Step 1: 페이지 이동**
```
도구: mcp__playwright__playwright_navigate
URL: http://localhost:3000
```

**Step 2: HTML 확인**
```
도구: mcp__playwright__playwright_get_visible_html
확인 내용:
- <script src="https://www.googletagmanager.com/gtag/js?id=G-4JL7C22JKN">
- <script id="google-analytics">
```

**Step 3: dataLayer 객체 확인**
```
도구: mcp__playwright__playwright_evaluate
스크립트:
  return {
    dataLayerExists: typeof window.dataLayer !== 'undefined',
    dataLayerLength: window.dataLayer ? window.dataLayer.length : 0,
    dataLayerType: typeof window.dataLayer
  }

예상 결과:
{
  "dataLayerExists": true,
  "dataLayerLength": > 0,
  "dataLayerType": "object"
}
```

**Step 4: gtag 함수 확인**
```
도구: mcp__playwright__playwright_evaluate
스크립트:
  return {
    gtagExists: typeof window.gtag === 'function',
    gtagType: typeof window.gtag
  }

예상 결과:
{
  "gtagExists": true,
  "gtagType": "function"
}
```

**Step 5: 콘솔 로그 확인 (선택)**
```
도구: mcp__playwright__playwright_console_logs
확인: GA 관련 에러 메시지 없음
```

**Step 6: 브라우저 종료**
```
도구: mcp__playwright__playwright_close
```

### 3.3 프로덕션 빌드 테스트
- [ ] `npm run build && npm run start` 실행
- [ ] MCP Playwright로 `http://localhost:3000` 접속
- [ ] 동일한 Step 1-6 실행
- [ ] 정적 HTML에 GA 스크립트 포함 확인

---

## Phase 4: 배포 및 검증

### 4.1 배포
- [ ] 변경사항 커밋
- [ ] Git push to main/master
- [ ] Netlify 자동 배포 확인
- [ ] 배포 성공 확인

### 4.2 프로덕션 검증 (MCP Playwright)
- [ ] MCP Playwright로 배포된 사이트 접속 (`https://advenoh.pe.kr`)
- [ ] `playwright_navigate`로 페이지 이동
- [ ] `playwright_get_visible_html`로 GA 스크립트 확인
- [ ] `playwright_evaluate`로 `window.dataLayer` 확인
- [ ] `playwright_evaluate`로 `window.gtag` 확인
- [ ] `playwright_close`로 브라우저 종료

### 4.3 Google Analytics 대시보드
- [ ] Google Analytics 로그인
- [ ] 실시간 → 개요 메뉴 접속
- [ ] 사이트 방문 후 1-2분 내 실시간 데이터 표시 확인
- [ ] 페이지뷰 카운트 증가 확인

---

## 완료 기준

✅ **모든 체크리스트 항목 완료**
✅ **Google Analytics 실시간 보고서에서 데이터 확인**
✅ **빌드 및 배포 에러 없음**
✅ **Playwright 테스트 통과**

---

## 예상 소요 시간
- Phase 1: 10분
- Phase 2: 10분
- Phase 3: 10분
- Phase 4: 10분
- **총 소요 시간**: 약 40분
