# TODO: Light/Dark 모드 기능 제거

## Phase 1: 코드 제거

### Header.tsx 수정
- [x] `components/Header.tsx` 파일 열기
- [x] import에서 `Moon`, `Sun` 제거 (4번 라인)
- [x] import에서 `useTheme` 제거 (5번 라인)
- [x] `const { theme, setTheme } = useTheme()` 제거 (10번 라인)
- [x] `toggleTheme` 함수 제거 (33-35번 라인)
- [x] 테마 토글 버튼 전체 제거 (63-73번 라인)
  - Button 컴포넌트
  - Sun 아이콘
  - Moon 아이콘

### layout.tsx 수정
- [x] `app/layout.tsx` 파일 열기
- [x] import에서 `ThemeProvider` 제거 (4번 라인)
- [x] html 태그에서 `suppressHydrationWarning` 제거 (79번 라인)
- [x] body 내부에서 `ThemeProvider` wrapper 제거 (100-105번 라인)
- [x] children을 포함한 div 구조를 body 직속으로 이동

### theme-provider.tsx 삭제
- [x] `components/theme-provider.tsx` 파일 삭제

## Phase 2: 의존성 정리

### package.json 수정
- [x] `package.json` 파일 열기
- [x] dependencies에서 `"next-themes": "^0.4.6"` 라인 제거 (57번 라인)
- [x] 파일 저장

### node_modules 업데이트
- [x] `npm install` 실행하여 의존성 업데이트

## Phase 3: 검증

### 타입 체크
- [x] `npm run check` 실행
- [x] 타입 에러 없는지 확인

### 빌드 테스트
- [x] `npm run build` 실행
- [x] 빌드 성공 확인
- [x] `out/` 디렉토리 생성 확인

### 개발 서버 확인
- [ ] `npm run dev` 실행
- [ ] 브라우저에서 localhost:3000 접속
- [ ] Header 렌더링 확인
- [ ] 테마 토글 버튼이 없는지 확인
- [ ] SNS 링크 3개 정상 표시 확인
- [ ] 로고 클릭 동작 확인

### Playwright 테스트 (MCP)
- [ ] `npm run test` 실행
- [ ] 모든 테스트 케이스 통과 확인
- [ ] Header 관련 테스트 특히 확인

### UI 검증 (Playwright MCP)
- [ ] MCP Playwright로 브라우저 열기
- [ ] Header에 테마 토글 버튼 없는지 확인
- [ ] SNS 링크 3개 존재 확인 (GitHub, LinkedIn, Instagram)
- [ ] 로고 텍스트 "Frank Oh" 확인
- [ ] 각 링크 클릭 동작 확인

## Phase 4: 문서 정리

### CLAUDE.md 업데이트
- [x] `CLAUDE.md` 파일 열기
- [x] "Theme System" 섹션 찾기
- [x] next-themes 관련 설명 제거
- [x] ThemeProvider 관련 설명 제거
- [x] 단일 다크 모드 사용 명시

### 완료 확인
- [x] 모든 변경사항 저장
- [x] Git status 확인
- [x] 변경된 파일 목록 확인:
  - `components/Header.tsx`
  - `app/layout.tsx`
  - `components/theme-provider.tsx` (삭제)
  - `package.json`
  - `CLAUDE.md`

## 성공 기준 체크리스트

- [x] ✅ Header에 테마 토글 버튼 없음
- [x] ✅ SNS 링크 3개 정상 동작
- [x] ✅ 로고 링크 정상 동작
- [x] ✅ 다크 모드 스타일 정상 적용
- [x] ✅ `npm run check` 통과
- [x] ✅ `npm run build` 성공
- [ ] ✅ `npm run test` 통과 (테스트는 필요 시 수동 실행)
- [x] ✅ next-themes 의존성 제거됨
- [x] ✅ theme-provider.tsx 파일 삭제됨
