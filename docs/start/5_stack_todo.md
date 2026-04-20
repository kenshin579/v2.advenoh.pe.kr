# 프로필 Stack 항목 변경 TODO

## 1. 사전 준비

- [x] `main` 최신화: `git checkout main && git pull origin main`
- [x] 브랜치 생성: `git checkout -b feat/38-update-profile-stack`

## 2. 콘텐츠 수정

- [x] `v2.advenoh.pe.kr/contents/profile/readme.md` 열기
- [x] frontmatter `stack` 배열을 아래로 교체
  ```yaml
  stack:
    - Go
    - Python
    - Claude
    - Cursor
    - Java
    - Spring Boot
  ```
- [x] `TypeScript` 항목이 완전히 제거되었는지 확인
- [x] `Cursor` 항목이 3번째 뒤(4번째)에 위치하는지 확인
- [x] 다른 필드(`role`, `focus`, `based`, `xp`, `headline`, `db`, `cloud`, `cicd`, 본문)는 변경되지 않았는지 `git diff`로 확인

## 3. 인코딩 확인

- [x] `file -I v2.advenoh.pe.kr/contents/profile/readme.md` → `charset=utf-8`

## 4. 정적 검증

- [x] `cd v2.advenoh.pe.kr && npm run check`
- [ ] ~~`cd v2.advenoh.pe.kr && npm run lint`~~ (Next.js 16에서 `next lint` 제거 — 선행 이슈, 본 변경과 무관)
- [x] `cd v2.advenoh.pe.kr && npm run build` (정적 export 성공, out/index.html에 새 stack 문자열 확인)

## 5. 로컬 시각 검증

- [ ] `npm run dev`로 개발 서버 기동
- [ ] 브라우저에서 `http://localhost:3000` 접속
- [ ] Hero 블록 `stack` 행이 `Go · Python · Claude · Cursor · Java · Spring Boot` 순서로 노출되는지 확인
- [ ] 페이지 전체에서 `TypeScript` 문자열이 보이지 않음을 확인
- [ ] 다크 테마에서 레이아웃 틀어짐 없는지 육안 확인

## 6. 커밋 & PR

- [x] 한국어 커밋 메시지로 커밋 (예: `chore: 프로필 stack 항목 재정렬 및 Cursor 추가`)
- [ ] 원격 push: `git push -u origin feat/38-update-profile-stack`
- [ ] `gh pr create` + HEREDOC으로 PR 생성
- [ ] reviewer `kenshin579` 지정
- [ ] PR 본문 Summary에 Before/After stack 목록 포함
- [ ] PR 본문 Test plan에 로컬 시각 검증 결과 체크리스트 포함

## 7. 배포 & 최종 확인

- [ ] PR 머지
- [ ] Netlify 자동 배포 완료 확인
- [ ] 운영 도메인 `https://v2.advenoh.pe.kr` 접속
- [ ] Hero 블록 `stack` 행이 새 순서로 노출되는지 확인
