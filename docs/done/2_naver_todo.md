# 네이버 검색 등록 구현 체크리스트

## Phase 1: 구현

### 1.1 메타데이터 수정
- [x] `app/layout.tsx` 파일 열기
- [x] `metadata` 객체에 `verification` 속성 추가
- [x] `naver-site-verification` 메타 태그 설정 (코드: `b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57`)
- [x] 문법 오류 없는지 확인

---

## Phase 2: 로컬 테스트

### 2.1 빌드 테스트
- [x] `npm run build` 실행
- [x] 빌드 에러 없이 완료 확인
- [x] `out/` 디렉토리 생성 확인

### 2.2 메타 태그 확인
- [x] `out/index.html` 파일 열기
- [x] `<meta name="naver-site-verification" content="b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57" />` 존재 확인
- [x] 또는 명령어 실행: `cat out/index.html | grep "naver-site-verification"`

### 2.3 프로덕션 프리뷰
- [x] `npx serve out` 실행
- [x] 브라우저에서 `http://localhost:3000` 접속
- [x] 개발자 도구 → Elements 탭 → `<head>` 확인
- [x] 네이버 메타 태그 존재 확인

---

## Phase 3: MCP Playwright 테스트

### 3.1 로컬 서버 준비
- [ ] `npm run build` 실행
- [ ] `npx serve out` 실행 (별도 터미널)

### 3.2 MCP Playwright 실행 순서

**Step 1: 페이지 이동**
```
도구: mcp__playwright__playwright_navigate
URL: http://localhost:3000
```
- [ ] 페이지 로드 성공 확인

**Step 2: HTML 확인**
```
도구: mcp__playwright__playwright_get_visible_html
확인 내용:
- <meta name="naver-site-verification" content="b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57"
```
- [ ] 메타 태그 포함 여부 확인

**Step 3: 메타 태그 값 검증**
```
도구: mcp__playwright__playwright_evaluate
스크립트:
  const metaTag = document.querySelector('meta[name="naver-site-verification"]');
  return {
    exists: metaTag !== null,
    content: metaTag ? metaTag.getAttribute('content') : null,
    isCorrect: metaTag ? metaTag.getAttribute('content') === 'b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57' : false
  }

예상 결과:
{
  "exists": true,
  "content": "b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57",
  "isCorrect": true
}
```
- [ ] `exists: true` 확인
- [ ] `content` 값이 정확한지 확인
- [ ] `isCorrect: true` 확인

**Step 4: 브라우저 종료**
```
도구: mcp__playwright__playwright_close
```
- [ ] 브라우저 정상 종료

---

## Phase 4: 배포 및 검증

### 4.1 배포
- [ ] 변경사항 커밋
- [ ] Git push to main
- [ ] Netlify 자동 배포 확인
- [ ] 배포 성공 확인

### 4.2 프로덕션 검증 (MCP Playwright)
- [ ] MCP Playwright로 배포된 사이트 접속 (`https://advenoh.pe.kr`)
- [ ] `playwright_navigate`로 페이지 이동
- [ ] `playwright_get_visible_html`로 메타 태그 확인
- [ ] `playwright_evaluate`로 메타 태그 값 검증
- [ ] `playwright_close`로 브라우저 종료

### 4.3 네이버 서치어드바이저 인증
- [ ] [네이버 서치어드바이저](https://searchadvisor.naver.com/) 로그인
- [ ] 사이트 등록 → HTML 태그 인증 선택
- [ ] "소유권 확인" 버튼 클릭
- [ ] 인증 성공 메시지 확인
- [ ] 사이트 등록 완료 확인

---

## 완료 기준

✅ **모든 체크리스트 항목 완료**
✅ **네이버 서치어드바이저에서 소유권 인증 성공**
✅ **빌드 및 배포 에러 없음**
✅ **Playwright 테스트 통과**

---

## 예상 소요 시간
- Phase 1: 3분
- Phase 2: 5분
- Phase 3: 5분
- Phase 4: 5분
- **총 소요 시간**: 약 15분
