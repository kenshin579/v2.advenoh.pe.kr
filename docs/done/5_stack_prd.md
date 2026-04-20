# 프로필 Stack 항목 변경 PRD

## 1. 배경 & 목적

`v2.advenoh.pe.kr` 메인 페이지 Hero 영역의 readme 블록에는 `stack` 항목이 노출된다. 이 값은 `contents/profile/readme.md`의 frontmatter에서 관리되며, `lib/profile-readme.ts`가 빌드 타임에 파싱해 `components/profile/Hero.tsx`에서 ` · ` 구분자로 렌더링한다.

현재 실제 사용하는 주력 기술 스택과의 정합성을 맞추기 위해, **stack 목록에서 `TypeScript`를 제거하고 `Cursor`를 추가**하며, **노출 순서를 재정렬**한다.

### 목표

1. 프로필 stack이 현재 주력 사용 기술을 정확히 반영하도록 정리한다.
2. AI 협업 도구(`Claude`, `Cursor`)의 가시성을 확보한다.
3. 데이터 소스(`contents/profile/readme.md`)만 수정하여 코드 변경 없이 반영한다.

### 비목표

- `db`, `cloud`, `cicd` 등 stack 외 다른 항목은 변경하지 않는다.
- Hero 컴포넌트(`Hero.tsx`), 파서(`profile-readme.ts`), 렌더링 로직은 변경하지 않는다.
- 스택 항목에 아이콘/링크를 추가하는 등 UI 개선은 이 작업 범위에 포함하지 않는다.

## 2. 현재 상태

### 2.1 파일: `contents/profile/readme.md`

```yaml
stack:
  - Claude
  - Python
  - Go
  - TypeScript
  - Java
  - Spring Boot
```

### 2.2 렌더링 경로

- `lib/profile-readme.ts:loadReadme()` — frontmatter를 읽어 `ReadmeData.stack: string[]` 반환
- `components/profile/Hero.tsx:24` — `readme.stack.join(' · ')`로 조인하여 `dl` 행에 노출
- 현재 노출 결과: `stack   Claude · Python · Go · TypeScript · Java · Spring Boot`

## 3. 변경 사항

### 3.1 변경 후 stack (순서 고정)

```yaml
stack:
  - Go
  - Python
  - Claude
  - Cursor
  - Java
  - Spring Boot
```

### 3.2 변경 내역 요약

| 구분 | 항목 | 비고 |
|---|---|---|
| 제거 | `TypeScript` | 주력 사용 아님 |
| 추가 | `Cursor` | AI 에디터 주력 사용 |
| 순서 변경 | `Go` → 1순위 | 백엔드 주 언어 강조 |
| 순서 변경 | `Claude` → 3순위 | 언어(Go/Python) 뒤로 배치 |

### 3.3 최종 노출 문자열

```
stack   Go · Python · Claude · Cursor · Java · Spring Boot
```

## 4. 작업 항목 (Tasks)

구체적인 단계별 체크리스트는 `5_stack_todo.md` 참조. 구현 상세는 `5_stack_implementation.md` 참조.

## 5. 리스크 & 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| YAML 들여쓰기/인코딩 오류 | frontmatter 파싱 실패 → `stack` 미노출 | 수정 후 `npm run dev`로 즉시 시각 확인 |
| 의도치 않은 다른 필드 변경 | Hero의 다른 행 손상 | diff로 stack 배열만 변경되었는지 확인 |

## 6. 참고 경로

- `v2.advenoh.pe.kr/contents/profile/readme.md` — 변경 대상 파일
- `v2.advenoh.pe.kr/lib/profile-readme.ts` — frontmatter 로더 (변경 없음)
- `v2.advenoh.pe.kr/components/profile/Hero.tsx:24` — stack 렌더링 (변경 없음)
