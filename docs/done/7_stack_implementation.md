# 7. 포트폴리오 스택 업데이트 — 구현 문서

**근거 PRD**: [`7_stack_prd.md`](./7_stack_prd.md)

## 개요

`contents/website/*/index.md` 5개 파일의 frontmatter `stack` 배열을, PRD의 "권장 수정안"에 맞춰 일괄 교체한다. 다른 코드/스키마 변경 없음.

## 변경 대상

| 파일 | 변경 |
|---|---|
| `contents/website/ai-chatbot/index.md` | `stack` 배열 교체 |
| `contents/website/inspire-me/index.md` | `stack` 배열 교체 |
| `contents/website/investment-blog/index.md` | `stack` 배열 교체 |
| `contents/website/it-blog/index.md` | `stack` 배열 교체 |
| `contents/website/status/index.md` | `stack` 배열 교체 |

다른 frontmatter 필드(`site`, `title`, `description`, `cover`, `status`, `year`, `role`, `dek`, `overview`, `featured`, `ext`, `order`)와 본문은 손대지 않는다.

## 적용 원칙 (PRD 가이드라인 요약)

- 버전 숫자 미기재
- UI 라이브러리(shadcn/ui, Tailwind, Radix 등) 배열 제외
- **Backend 언어 필수 포함** (Python + FastAPI, Go + Echo)
- 실제 런타임에 없는 항목 제거(`it-blog`의 Drizzle, `inspire-me`의 Markdown 등)

## 각 파일 변경 스펙

### 1) `ai-chatbot/index.md`

**변경 전**
```yaml
stack:
  - Next.js 16
  - FastAPI
  - LangChain
  - ChromaDB
  - OpenAI
```

**변경 후**
```yaml
stack:
  - Next.js
  - Python
  - FastAPI
  - LangChain
  - ChromaDB
  - OpenAI
  - Kubernetes
  - Helm
```

### 2) `inspire-me/index.md`

**변경 전**
```yaml
stack:
  - Next.js
  - Tailwind
  - Markdown
```

**변경 후**
```yaml
stack:
  - Next.js
  - Go
  - Echo
  - GORM
  - MySQL
  - Redis
  - OpenAI
  - Kubernetes
  - Helm
```

### 3) `investment-blog/index.md`

**변경 전**
```yaml
stack:
  - Next.js 15
  - React 19
  - Tailwind
```

**변경 후**
```yaml
stack:
  - Next.js
  - Markdown
  - Netlify
```

### 4) `it-blog/index.md`

**변경 전**
```yaml
stack:
  - Next.js
  - React 18
  - Markdown
  - shadcn/ui
```

**변경 후**
```yaml
stack:
  - Next.js
  - Markdown
  - Netlify
```

### 5) `status/index.md`

**변경 전**
```yaml
stack:
  - Next.js 16
  - Supabase
  - GitHub Actions
  - Python
  - Telegram Bot
```

**변경 후**
```yaml
stack:
  - Next.js
  - Python
  - Supabase
  - GitHub Actions
  - Netlify
```

## 구현 시 지켜야 할 기술 제약

- **YAML 유지**: frontmatter 구분자(`---`)와 다른 필드 순서/들여쓰기는 변경하지 않는다. `stack:` 블록만 in-place 교체.
- **UTF-8 인코딩**: 파일 저장 후 `file -I`로 `charset=utf-8` 확인.
- **Zod 검증 통과**: `lib/portfolio.ts`의 `portfolioItemSchema`는 `stack: z.array(z.string()).optional()`로 길이 제한 없음 → 최대 9개(inspire-me)도 OK.
- **UI wrap**: `components/profile/ProjectCardV2.tsx`가 `flex flex-wrap` 이므로 배열 길이로 레이아웃이 깨지지 않는다. 다만 카드 내 가독성을 위해 9개 이하 유지.

## 검증 방법

### 1) 타입/파싱 검증
```bash
npm run check   # TypeScript
npm run lint    # ESLint
npm run build   # 빌드 시 portfolio.ts가 전체 frontmatter를 Zod로 검증 → 실패 시 빌드 에러
```

### 2) 로컬 프리뷰 + MCP Playwright 시각 검증
```bash
npm run build
npm run start   # http://localhost:3000 서빙
```

MCP Playwright로 확인할 항목:
- 홈 페이지(`/`)의 포트폴리오 카드에 새 `stack` 태그가 보이는지
- 카드 레이아웃이 깨지지 않는지 (특히 `inspire-me` 9개 항목)
- `CommandPalette` 검색에서 `go`, `python`, `k8s`, `helm` 입력 시 해당 프로젝트 매칭되는지 (`components/profile/CommandPalette.tsx:126`이 `p.stack?.join(' ')`을 인덱스에 포함)
- `ProjectModal` 상세 뷰에서도 동일한 `stack` 노출 확인

### 3) 인코딩 검증
```bash
file -I contents/website/*/index.md
# 모두 text/plain; charset=utf-8 이어야 한다
```

## 배포

- feature 브랜치 → PR → merge → Netlify 자동 재빌드 1회
- 롤백은 PR revert로 충분 (스키마/코드 변경 없음)
