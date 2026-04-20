# 프로필 Stack 항목 변경 구현 문서

## 1. 변경 파일

단일 파일 수정만 필요하다. 코드(`.ts`/`.tsx`) 변경은 없다.

| 경로 | 변경 유형 |
|---|---|
| `v2.advenoh.pe.kr/contents/profile/readme.md` | frontmatter `stack` 배열 교체 |

## 2. 구현 상세

### 2.1 `contents/profile/readme.md` frontmatter 수정

**Before**

```yaml
stack:
  - Claude
  - Python
  - Go
  - TypeScript
  - Java
  - Spring Boot
```

**After**

```yaml
stack:
  - Go
  - Python
  - Claude
  - Cursor
  - Java
  - Spring Boot
```

- `TypeScript` 제거
- `Cursor` 신규 추가
- 순서: `Go → Python → Claude → Cursor → Java → Spring Boot`
- 이외 필드(`role`, `focus`, `based`, `xp`, `headline`, `db`, `cloud`, `cicd`, 본문)는 건드리지 않는다.

### 2.2 렌더링 동작 (변경 없음, 검증 포인트)

- `lib/profile-readme.ts:loadReadme()`의 `parseArray(data.stack)`가 배열 그대로 반환 → 순서 보존.
- `components/profile/Hero.tsx:24`의 `readme.stack.join(' · ')`가 노출 문자열 생성.
- 예상 노출: `stack   Go · Python · Claude · Cursor · Java · Spring Boot`

## 3. 검증 방법

### 3.1 정적 검증

```bash
cd v2.advenoh.pe.kr
npm run check   # 타입 통과
npm run lint    # 린트 통과
npm run build   # out/ 정적 export 성공
```

### 3.2 로컬 시각 검증

```bash
npm run dev     # http://localhost:3000
```

- 브라우저에서 Hero 블록 확인
  - `stack` 행에 `Go · Python · Claude · Cursor · Java · Spring Boot` 순서로 노출
  - `TypeScript` 문자열이 페이지 어디에도 남아 있지 않음
  - 다른 필드(`role`, `focus`, `db`, `cloud`, `ci/cd` 등)는 기존과 동일

### 3.3 인코딩 검증

```bash
file -I v2.advenoh.pe.kr/contents/profile/readme.md
# 기대: text/plain; charset=utf-8
```

## 4. 배포

1. 브랜치 생성: `chore/update-profile-stack`
2. 한국어 커밋 (예: `chore: 프로필 stack 항목 재정렬 및 Cursor 추가`)
3. `gh pr create` + HEREDOC으로 PR 생성, reviewer: kenshin579
4. 머지 후 Netlify 자동 배포
5. 운영 도메인 `https://v2.advenoh.pe.kr` 최종 확인

## 5. 롤백

문제 발생 시 해당 커밋만 revert하면 된다(frontmatter 1개 배열 교체이므로 의존 영향 없음).

## 6. 참고

- PRD: `docs/start/5_stack_prd.md`
- 데이터 소스: `contents/profile/readme.md`
- 파서: `lib/profile-readme.ts`
- 렌더러: `components/profile/Hero.tsx:24`
