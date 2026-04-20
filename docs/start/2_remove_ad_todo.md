# Google AdSense 제거 TODO

관련 문서: [`2_remove_ad_prd.md`](./2_remove_ad_prd.md) · [`2_remove_ad_implementation.md`](./2_remove_ad_implementation.md)

---

## 📋 Phase 1: 코드 수정

### Step 1: `app/layout.tsx` 수정

- [x] `app/layout.tsx` 파일 열기
- [x] `<head>` 내부의 AdSense 블록 (line 101~107) 삭제
  ```tsx
  {/* Google AdSense */}
  <Script
    async
    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
    crossOrigin="anonymous"
    strategy="afterInteractive"
  />
  ```
- [x] `{/* Google AdSense */}` 주석 제거 확인
- [x] 파일 내 다른 `Script` 사용처 검색
  ```bash
  grep -n "Script" app/layout.tsx
  ```
- [x] 사용처 없으면 `import Script from 'next/script'` 제거
- [x] 사용처 있으면 import 유지

### Step 2: `public/ads.txt` 삭제

- [x] `public/ads.txt` 존재 확인
  ```bash
  ls public/ads.txt
  ```
- [x] 파일 삭제
  ```bash
  rm public/ads.txt
  ```
- [x] 삭제 확인
  ```bash
  ls public/ads.txt 2>/dev/null || echo "deleted"
  ```
- [x] `.gitignore`의 `!public/ads.txt` 예외 라인 제거

---

## 🔨 Phase 2: 정적 분석 & 빌드

### Step 3: 타입 검사 / 린트

- [x] `npm run check` 실행 → 에러 없음
- [~] `npm run lint` 실행 → Next.js 16에서 `next lint` deprecated (기존 이슈, 이번 작업과 무관)

### Step 4: 프로덕션 빌드

- [x] 기존 빌드 캐시 정리 (선택)
  ```bash
  rm -rf .next out
  ```
- [x] `npm run build` 실행 → 성공
- [x] `out/` 디렉토리 생성 확인

### Step 5: 빌드 산출물 검증

- [x] AdSense 스크립트 흔적 0건
  ```bash
  grep -r "adsbygoogle" out/
  ```
- [x] AdSense CDN 도메인 흔적 0건
  ```bash
  grep -r "pagead2.googlesyndication.com" out/
  ```
- [x] Publisher ID 흔적 0건
  ```bash
  grep -r "ca-pub-8868959494983515" out/
  ```
- [x] `out/ads.txt` 부재 확인
  ```bash
  [ ! -f out/ads.txt ] && echo "OK" || echo "FAIL"
  ```
- [x] `out/index.html`의 `<head>`에 AdSense 태그 없음

---

## 🧪 Phase 3: 로컬 검증

### Step 6: 프리뷰 서버

- [ ] `npm run start` 실행
- [ ] `http://localhost:3000` 접속

### Step 7: DevTools 수동 확인

- [ ] Network 탭: `pagead2.googlesyndication.com` 요청 0건
- [ ] Network 탭: `adsbygoogle.js` 요청 0건
- [ ] Elements 탭: `<head>`에 AdSense script 태그 없음
- [ ] Console 탭: AdSense 관련 에러/경고 없음
- [ ] GA 리소스(`googletagmanager.com/gtag/js`) 정상 로드 확인

---

## 🚀 Phase 4: Git & PR

### Step 8: 브랜치 생성

- [ ] main 최신화
  ```bash
  git checkout main && git pull origin main
  ```
- [ ] feature 브랜치 생성
  ```bash
  git checkout -b feature/remove-google-adsense
  ```

### Step 9: 커밋

- [ ] 변경사항 확인
  ```bash
  git status
  git diff v2.advenoh.pe.kr/app/layout.tsx
  ```
- [ ] 파일 스테이징
  ```bash
  git add v2.advenoh.pe.kr/app/layout.tsx
  git add -u v2.advenoh.pe.kr/public/ads.txt
  ```
- [ ] 커밋
  ```bash
  git commit -m "chore: Google AdSense 스크립트 및 ads.txt 제거"
  ```

### Step 10: PR 생성

- [ ] 브랜치 푸시
  ```bash
  git push -u origin feature/remove-google-adsense
  ```
- [ ] PR 생성 (`gh pr create` + HEREDOC 사용)
  ```bash
  gh pr create --title "chore: Google AdSense 제거" --body "$(cat <<'EOF'
  ## Summary
  - app/layout.tsx의 AdSense Script 블록 제거
  - public/ads.txt 삭제
  - Google Analytics 유지 (광고와 무관)

  ## Test plan
  - [ ] npm run check / lint / build 통과
  - [ ] grep -r "adsbygoogle" out/ 결과 없음
  - [ ] out/ads.txt 부재
  - [ ] DevTools Network에 AdSense 요청 없음
  - [ ] 배포 후 프로덕션 URL 재검증
  EOF
  )"
  ```
- [ ] 리뷰어(`kenshin579`) 지정

---

## 🌐 Phase 5: 배포 & 사후 검증

### Step 11: Netlify 자동 배포

- [ ] PR 머지 후 Netlify 배포 완료 확인
- [ ] 빌드 로그에 에러 없음

### Step 12: 프로덕션 검증

- [ ] `curl -I https://advenoh.pe.kr/ads.txt` → `404 Not Found`
- [ ] `https://advenoh.pe.kr` 방문
  - [ ] DevTools Network: AdSense 요청 0건
  - [ ] DevTools Elements: AdSense script 태그 없음
  - [ ] Console 에러 없음
- [ ] 하드 리프레시(⌘+Shift+R) 후 재확인

### Step 13: 문서 이동

- [ ] 완료된 문서를 `docs/done/`으로 이동
  ```bash
  mv docs/start/2_remove_ad_prd.md docs/done/
  mv docs/start/2_remove_ad_implementation.md docs/done/
  mv docs/start/2_remove_ad_todo.md docs/done/
  ```

### Step 14 (선택): AdSense 콘솔 정리

- [ ] Google AdSense 콘솔 로그인
- [ ] `advenoh.pe.kr` 사이트 항목에서 제거 (운영자 판단)

---

## ✅ 완료 기준

- [ ] 코드 상 AdSense 관련 코드/파일 0건
- [ ] `out/` 빌드 산출물에 AdSense 흔적 0건
- [ ] 프로덕션에서 AdSense 네트워크 요청 0건
- [ ] Google Analytics 정상 동작 (회귀 없음)
- [ ] PR 머지 및 문서 `docs/done/` 이동 완료
