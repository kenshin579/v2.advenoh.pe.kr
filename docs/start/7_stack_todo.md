# 7. 포트폴리오 스택 업데이트 — 체크리스트

**근거 문서**: [`7_stack_prd.md`](./7_stack_prd.md) · [`7_stack_implementation.md`](./7_stack_implementation.md)

---

## 1단계: 준비

- [x] 최신 main pull: `git checkout main && git pull origin main`
- [x] feature 브랜치 생성: `git checkout -b chore/portfolio-stack-update` (또는 관련 이슈 번호 사용)
- [x] `portfolioItemSchema` (`lib/portfolio.ts`)에 `stack` 길이 제한 없는지 재확인 (없음 — 확인 완료)

## 2단계: frontmatter `stack` 배열 교체 (5개 파일)

- [x] `contents/website/ai-chatbot/index.md` — `stack` 교체
  - `Next.js, Python, FastAPI, LangChain, ChromaDB, OpenAI, Kubernetes, Helm`
- [x] `contents/website/inspire-me/index.md` — `stack` 교체
  - `Next.js, Go, Echo, GORM, MySQL, Redis, OpenAI, Kubernetes, Helm`
- [x] `contents/website/investment-blog/index.md` — `stack` 교체
  - `Next.js, Markdown, Netlify`
- [x] `contents/website/it-blog/index.md` — `stack` 교체
  - `Next.js, Markdown, Netlify`
- [x] `contents/website/status/index.md` — `stack` 교체
  - `Next.js, Python, Supabase, GitHub Actions, Netlify`
- [x] 다른 frontmatter 필드(`site`, `title`, `dek`, `overview` 등)와 본문은 수정하지 않았는지 git diff 확인

## 3단계: 인코딩/형식 검증

- [x] `file -I contents/website/*/index.md` 결과가 모두 `charset=utf-8`
- [x] `git diff` 상 수정 범위가 `stack:` 블록으로 한정되는지 시각 확인

## 4단계: 타입/빌드 검증

- [x] `npm run check` (TypeScript 에러 없음)
- [~] `npm run lint` — Next.js 16의 `next lint` deprecation으로 실행 실패 (프로젝트 스크립트 이슈, 본 변경과 무관)
- [x] `npm run build` 성공 — 빌드 시 `portfolio.ts`의 Zod 검증이 실행되므로 frontmatter 오타 시 여기서 실패

## 5단계: 로컬 프리뷰 + MCP Playwright 시각 검증

- [x] `npm run start` 로 `out/` 서빙 (http://localhost:3000)
- [x] MCP Playwright: 홈(`/`) 스크린샷 캡처, 각 포트폴리오 카드 스택 태그 육안 확인
- [x] MCP Playwright: `inspire-me` 카드의 9개 태그가 카드 레이아웃을 깨지 않는지 확인 (flex-wrap 동작)
- [x] MCP Playwright: 카드 클릭 → `ProjectModal` 상세 뷰에 동일한 스택이 노출되는지 확인
- [x] MCP Playwright: `CommandPalette` 열고 `python`, `go`, `kubernetes`, `helm`, `openai` 검색 시 해당 프로젝트가 매칭되는지 확인
- [x] MCP Playwright: 콘솔 에러/경고 없는지 확인

## 6단계: 커밋 & PR

- [ ] 커밋: `[#47] chore: 포트폴리오 stack 배열을 실제 저장소 기준으로 업데이트`
- [ ] `gh pr create` + HEREDOC 으로 PR 작성 (Summary / Test plan)
- [ ] 리뷰어 지정: `kenshin579`
- [ ] merge 후 Netlify 자동 재빌드 확인 (프로덕션 카드에서 스택 확인)

## 롤백 (필요 시)

- [ ] 프로덕션에서 이슈 발견 시 PR revert → Netlify 자동 재배포
