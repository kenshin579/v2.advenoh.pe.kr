# RightRail Latest Posts 노출 개수 확대 구현 문서

## 1. 변경 파일

단순 상수 치환 3곳이다 (PRD 3.3 옵션 A).

| 경로 | 변경 유형 |
|---|---|
| `v2.advenoh.pe.kr/app/page.tsx` | `getLatestPosts(6)` → `getLatestPosts(10)` |
| `v2.advenoh.pe.kr/lib/writing.ts` | JSDoc 주석 + default param `6` → `10` |
| `v2.advenoh.pe.kr/hooks/useLiveWriting.ts` | `.slice(0, 6)` → `.slice(0, 10)` |

## 2. 구현 상세

### 2.1 `app/page.tsx:16`

**Before**

```ts
getLatestPosts(6),
```

**After**

```ts
getLatestPosts(10),
```

- SSG 빌드 타임에 초기 데이터 `initialWriting.latest`에 10개가 주입된다.
- `Promise.all` 배열 순서는 유지.

### 2.2 `lib/writing.ts:102-108`

**Before**

```ts
/**
 * 우측 레일 Latest posts용 (IT+INV 병합, 날짜순 상위 6개)
 */
export async function getLatestPosts(limit = 6): Promise<WritingItem[]> {
  const [itBundle, invBundle] = await Promise.all([getWritingBlog(), getWritingInvestment()])
  return [...itBundle.items, ...invBundle.items]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit)
}
```

**After**

```ts
/**
 * 우측 레일 Latest posts용 (IT+INV 병합, 날짜순 상위 10개)
 */
export async function getLatestPosts(limit = 10): Promise<WritingItem[]> {
  const [itBundle, invBundle] = await Promise.all([getWritingBlog(), getWritingInvestment()])
  return [...itBundle.items, ...invBundle.items]
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, limit)
}
```

- JSDoc의 `"상위 6개"` → `"상위 10개"`.
- default param `6` → `10` (호출부가 명시적으로 10을 넘기므로 default는 보조적 역할이지만 일관성 유지).
- 함수 시그니처·반환 타입·내부 로직 변경 없음.

### 2.3 `hooks/useLiveWriting.ts:62-64`

**Before**

```ts
const latest = [...it, ...inv]
  .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  .slice(0, 6)
```

**After**

```ts
const latest = [...it, ...inv]
  .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  .slice(0, 10)
```

- 클라이언트 마운트 후 브라우저 `DOMParser`로 재파싱한 결과를 동일 기준으로 slice.
- 주변의 `it.slice(0, 5)`, `inv.slice(0, 5)`는 변경하지 않는다 (중앙 writing 섹션은 각 5개 유지).

### 2.4 변경 없음 (검증 포인트)

- `components/profile/RightRail.tsx` — 배열 길이 제한 없이 `latestPosts.map(...)`이므로 자동 반영.
- `components/profile/CommandPalette.tsx:145` — `latestPosts` 그대로 재사용 → 자동으로 10개 노출.
- `components/profile/ProfileShell.tsx:80` — 주입 경로 동일.
- `lib/writing.ts:getWritingSections()` — IT/INV 각 5개 유지 (중앙 섹션용, 변경 없음).

## 3. 검증 방법

### 3.1 정적 검증

```bash
cd v2.advenoh.pe.kr
npm run check   # 타입 통과
npm run lint    # 린트 (Next.js 16에서 제거되었을 경우 skip)
npm run build   # 정적 export 성공
```

### 3.2 로컬 시각 검증 (수동)

```bash
cd v2.advenoh.pe.kr
npm run dev     # http://localhost:3000
```

- xl 뷰포트(≥1280px)에서 RightRail "Latest posts" 10개 노출 확인
- 각 아이템의 `IT`/`INV` 배지가 정상 표시되는지 확인
- `pubDate` 내림차순 정렬 확인 (소스 섞여 있음)
- System 블록이 화면에서 잘리지 않는지 확인

### 3.3 MCP Playwright 자동 검증

`mcp__plugin_k_playwright__*` 도구를 사용해 로컬 개발 서버(`http://localhost:3000`) 상에서 다음을 자동 검증:

- `playwright_navigate` — 홈 접속
- 뷰포트 1440×900으로 설정 (xl 브레이크포인트 이상)
- `playwright_evaluate` — `document.querySelectorAll('aside ul li').length` 기반으로 Latest posts `<li>` 개수가 **10**인지 확인
- `playwright_get_visible_text` — Latest posts 영역에 `IT` / `INV` 배지 텍스트가 포함되어 있는지 확인
- `playwright_screenshot` — RightRail 영역 스크린샷 저장하여 시각 비교
- (선택) `Cmd+K`로 CommandPalette 열고 "Latest posts" 그룹에서도 10개 노출 확인

### 3.4 인코딩 검증

```bash
file -I v2.advenoh.pe.kr/app/page.tsx
file -I v2.advenoh.pe.kr/lib/writing.ts
file -I v2.advenoh.pe.kr/hooks/useLiveWriting.ts
# 기대: 모두 text/plain; charset=utf-8
```

## 4. 배포

1. 브랜치 생성: `feat/{issue-number}-latest-posts-10` (이슈 선행 생성 후 번호 매칭)
2. 한국어 커밋 (예: `feat: RightRail Latest posts 노출 개수 6 → 10`)
3. `gh pr create` + HEREDOC으로 PR 생성, reviewer: `kenshin579`
4. 머지 후 Netlify 자동 배포
5. 운영 도메인 `https://v2.advenoh.pe.kr` 최종 확인

## 5. 롤백

변경이 3라인이므로 문제 발생 시 해당 커밋 revert로 충분.

## 6. 참고

- PRD: `docs/start/6_latest_prd.md`
- 변경 파일 3종:
  - `app/page.tsx:16`
  - `lib/writing.ts:102-108`
  - `hooks/useLiveWriting.ts:62-64`
- 영향 받는 렌더 지점 (코드 변경 없음):
  - `components/profile/RightRail.tsx:34`
  - `components/profile/CommandPalette.tsx:145`
