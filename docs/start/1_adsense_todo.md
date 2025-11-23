# Google AdSense 구현 TODO

## 📋 Phase 1: 코드 구현

### Step 1: layout.tsx 수정

- [x] `app/layout.tsx` 파일 열기
- [x] 파일 상단에 `import Script from 'next/script'` 추가 확인
- [x] `<head>` 태그 내부에 AdSense Script 추가
  ```tsx
  <Script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
  ```
- [x] 배치 위치 확인: Structured Data 스크립트 이후
- [x] Publisher ID 확인: `ca-pub-8868959494983515`

### Step 2: ads.txt 검증

- [x] `public/ads.txt` 파일 열기
- [x] 내용 확인: `google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0`
- [x] Publisher ID 일치 확인: `pub-8868959494983515`
- [x] 파일 위치 확인: `public/` 디렉토리

---

## 🔨 Phase 2: 빌드 및 로컬 테스트

### Step 3: 빌드

- [x] `npm run build` 실행
- [x] 빌드 성공 확인 (에러 없음)
- [x] `out/ads.txt` 파일 존재 확인
  ```bash
  ls -la out/ads.txt
  ```
- [x] 빌드된 HTML에 스크립트 포함 확인
  ```bash
  grep -r "adsbygoogle" out/
  ```

### Step 4: 로컬 프리뷰

- [ ] 프리뷰 서버 실행
  ```bash
  npm run start
  ```
- [ ] 브라우저에서 프리뷰 서버 접속

#### 개발자 도구 확인

- [ ] Network 탭 열기
- [ ] `adsbygoogle.js` 파일 로드 확인
- [ ] 상태 코드 200 확인
- [ ] Console 탭에서 에러 없는지 확인
- [ ] Elements 탭에서 `<script src="...adsbygoogle.js">` 태그 확인

---

## 🚀 Phase 3: 배포

### Step 5: Git 커밋 및 자동 배포

- [ ] 변경사항 확인
  ```bash
  git status
  git diff app/layout.tsx
  ```
- [ ] 파일 스테이징
  ```bash
  git add app/layout.tsx
  ```
- [ ] 커밋
  ```bash
  git commit -m "feat: Add Google AdSense integration"
  ```
- [ ] main 브랜치에 Push
  ```bash
  git push origin main
  ```

**Netlify 자동 배포**:
- [ ] Netlify가 자동으로 빌드 시작 (main 브랜치 merge 감지)
- [ ] Netlify 대시보드에서 배포 진행 상황 확인
- [ ] 배포 완료 확인 (Deploy status: Published)
- [ ] 배포 로그에서 에러 확인

---

## ✅ Phase 4: 배포 검증

### Step 6: 프로덕션 확인

#### ads.txt 접근 테스트

- [ ] 브라우저에서 `https://advenoh.pe.kr/ads.txt` 접속
- [ ] 파일 내용 확인:
  ```
  google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
  ```
- [ ] 또는 curl로 확인:
  ```bash
  curl https://advenoh.pe.kr/ads.txt
  ```

#### 페이지 소스 확인

- [ ] `https://advenoh.pe.kr` 접속
- [ ] 우클릭 → "페이지 소스 보기"
- [ ] `Ctrl+F`로 "adsbygoogle" 검색
- [ ] Script 태그 존재 확인
- [ ] Publisher ID 확인: `ca-pub-8868959494983515`

#### 브라우저 개발자 도구 확인

- [ ] F12로 개발자 도구 열기
- [ ] Network 탭에서 `adsbygoogle.js` 로드 확인
- [ ] Console 탭에서 에러 없는지 확인
- [ ] 네트워크 상태: Status 200

---

## 🧪 Phase 5: MCP Playwright 테스트 (선택사항)

### Step 7: MCP Playwright로 E2E 테스트

**테스트 1: 메인 페이지 AdSense 스크립트 확인**

- [ ] Claude Code에서 MCP Playwright 도구 사용
- [ ] `mcp__playwright__playwright_navigate` 실행
  - url: `https://advenoh.pe.kr`
  - headless: `false`
- [ ] `mcp__playwright__playwright_get_visible_html` 실행
  - selector: `head`
  - removeScripts: `false`
- [ ] HTML 결과에서 확인:
  - [ ] `<script>` 태그 존재
  - [ ] `src` 속성에 "adsbygoogle.js" 포함
  - [ ] Publisher ID "ca-pub-8868959494983515" 포함
  - [ ] `crossOrigin="anonymous"` 속성 존재
- [ ] `mcp__playwright__playwright_console_logs` 실행
  - type: `error`
  - [ ] AdSense 관련 에러 없음 확인

**테스트 2: ads.txt 파일 접근 확인**

- [ ] `mcp__playwright__playwright_navigate` 실행
  - url: `https://advenoh.pe.kr/ads.txt`
- [ ] `mcp__playwright__playwright_get_visible_text` 실행
- [ ] 텍스트에서 확인:
  - [ ] "google.com" 포함
  - [ ] "pub-8868959494983515" 포함
  - [ ] "DIRECT" 포함

**테스트 3: 네트워크 및 스크린샷**

- [ ] `mcp__playwright__playwright_navigate` 실행
  - url: `https://advenoh.pe.kr`
- [ ] 브라우저에서 Network 탭 확인
  - [ ] adsbygoogle.js 로드 확인
  - [ ] Status 200 확인
- [ ] `mcp__playwright__playwright_screenshot` 실행
  - name: `adsense-loaded`
  - fullPage: `true`
- [ ] 스크린샷 확인
- [ ] `mcp__playwright__playwright_close` 실행

**참고**: MCP Playwright는 대화형으로 테스트를 진행하므로 별도의 테스트 코드 작성이 필요 없습니다.

---

## 🎯 Phase 6: Google AdSense 콘솔 설정

### Step 8: AdSense 계정 설정

- [ ] [Google AdSense](https://www.google.com/adsense) 로그인
- [ ] **사이트** 메뉴 클릭
- [ ] **사이트 추가** 버튼 클릭
- [ ] URL 입력: `https://advenoh.pe.kr`
- [ ] 사이트 추가 완료

### Step 9: ads.txt 검증

- [ ] AdSense 콘솔에서 **사이트** 선택
- [ ] `advenoh.pe.kr` 클릭
- [ ] **ads.txt** 탭 선택
- [ ] 상태 확인: "확인됨" 또는 "승인됨"
- [ ] 문제 있으면 수정 후 재확인

### Step 10: 사이트 승인 대기

- [ ] 사이트 상태 확인: "검토 중"
- [ ] 승인 이메일 대기 (1-2일 소요)
- [ ] 승인 완료 확인

---

## 📊 최종 체크리스트

### 기술적 확인

- [ ] AdSense 스크립트가 모든 페이지에서 로드됨
- [ ] 브라우저 콘솔에 에러 없음
- [ ] `https://advenoh.pe.kr/ads.txt` 접근 가능
- [ ] Publisher ID가 일치함 (스크립트 ↔ ads.txt)

### Google AdSense 확인

- [ ] AdSense 계정에 사이트 추가됨
- [ ] ads.txt 파일 검증 통과
- [ ] 사이트 승인 대기 중 또는 승인 완료

### 코드 품질

- [ ] 참고 프로젝트와 동일한 패턴 사용
- [ ] Next.js Script 컴포넌트 사용
- [ ] `strategy="afterInteractive"` 적용
- [ ] 코드 가독성 확보

---

## ⚠️ 문제 발생 시

### 스크립트 로드 안 됨

1. `app/layout.tsx` 에서 Script import 확인
2. Publisher ID 오타 확인
3. 빌드 다시 실행

### ads.txt 404 에러

1. `public/ads.txt` 파일 존재 확인
2. 빌드 다시 실행
3. `out/ads.txt` 확인
4. 재배포

### CORS 에러

1. `crossOrigin="anonymous"` 속성 확인
2. 빌드 다시 실행

### Publisher ID 불일치

1. ads.txt: `pub-8868959494983515`
2. layout.tsx: `ca-pub-8868959494983515`
3. 두 값이 매칭되는지 확인

---

## 📚 참고 문서

- 구현 가이드: `docs/start/1_adsense_implementation.md`
- PRD: `docs/start/1_adsense_prd.md`
- 참고 프로젝트: `blog-v2.advenoh.pe.kr/app/layout.tsx:57-63`
