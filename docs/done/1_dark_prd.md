# PRD: Light/Dark 모드 기능 제거

## 개요
헤더에서 light/dark 테마 전환 기능을 제거하여 단일 테마로 통일

## 배경
- 현재 next-themes 라이브러리를 사용하여 dark/light 모드 지원
- Header 컴포넌트에 테마 토글 버튼 존재
- defaultTheme="dark"로 기본 다크 모드 설정되어 있음

## 목표
- 테마 전환 기능 완전 제거
- 단일 테마(다크 모드)로 고정
- 불필요한 의존성 제거

## 범위

### 제거 대상
1. **Header.tsx**
   - 테마 토글 버튼 (63-73번 라인)
   - `useTheme` 훅 사용 (10번 라인)
   - `toggleTheme` 함수 (33-35번 라인)
   - Moon, Sun 아이콘 import (4번 라인)

2. **layout.tsx**
   - `ThemeProvider` import (4번 라인)
   - `ThemeProvider` wrapper (100-105번 라인)
   - `suppressHydrationWarning` attribute (79번 라인)

3. **theme-provider.tsx**
   - 파일 전체 삭제

4. **package.json**
   - `next-themes` 의존성 제거 (57번 라인)

### 유지 대상
- **globals.css**: CSS 변수는 유지 (dark 모드 변수만 사용하도록 변경 가능)
- **Header 레이아웃**: SNS 링크와 로고는 유지
- **기타 컴포넌트**: 테마 기능과 무관한 모든 컴포넌트

## 관련 문서
- **구현 상세**: [1_dark_implementation.md](./1_dark_implementation.md)
- **작업 체크리스트**: [1_dark_todo.md](./1_dark_todo.md)

## 영향 분석

### 긍정적 영향
- 번들 크기 감소 (next-themes 라이브러리 제거)
- 코드 복잡도 감소
- 테마 관련 버그 가능성 제거
- 빌드 시간 단축

### 부정적 영향
- 사용자 테마 선택권 제거
- 향후 다시 추가 시 작업 필요

### 리스크
- **낮음**: 테마 기능은 독립적이며 다른 기능에 영향 없음
- **호환성**: 정적 사이트 빌드에 영향 없음

## 참고 사항
- 현재 defaultTheme="dark"로 설정되어 있으므로 다크 모드 유지
- globals.css의 CSS 변수는 유지
- Header의 `mix-blend-difference` 클래스는 유지 (흰색 텍스트 효과)
- 웹 UI 테스트는 MCP Playwright 사용
