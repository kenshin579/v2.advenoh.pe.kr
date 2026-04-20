# RightRail Latest Posts 노출 개수 확대 PRD

## 1. 배경 & 목적

`v2.advenoh.pe.kr` 메인 페이지 오른쪽 레일(`RightRail`)의 **Latest posts** 섹션은 현재 IT 블로그(`blog-v2.advenoh.pe.kr`)와 투자 블로그(`investment.advenoh.pe.kr`) RSS를 병합하여 최신 **6개**만 노출한다. 방문자가 최근 발행된 글을 한눈에 더 많이 확인할 수 있도록 노출 개수를 **10개로 확대**한다.

### 목표

1. RightRail의 Latest posts 노출 개수를 6 → 10으로 늘린다.
2. 서버(SSG) 초기 렌더와 클라이언트(live fetch) 재렌더 양쪽에서 동일하게 10개가 보장되도록 한다.
3. 기존 정렬 기준(IT + INV 병합 후 `pubDate` 내림차순)과 UI 스타일은 유지한다.

### 비목표

- RSS 피드/캐시 정책(`lib/writing.ts`의 `withCache`) 변경은 하지 않는다.
- 중앙 writing 섹션(`getWritingSections`, IT/INV 각 5개)의 개수는 변경하지 않는다.
- Latest posts 아이템 카드 디자인/아이콘/배지 스타일 변경은 범위에 포함하지 않는다.
- 페이지네이션, "더 보기" 인터랙션 도입은 하지 않는다 (단순 개수 확대).

## 2. 현재 상태

### 2.1 데이터 경로

- `app/page.tsx:16` — 빌드 타임에 `getLatestPosts(6)` 호출, `ProfileShell`에 `initialWriting.latest`로 주입
- `lib/writing.ts:104` — `getLatestPosts(limit = 6)`가 두 RSS 번들을 병합·정렬 후 `slice(0, limit)`
- `hooks/useLiveWriting.ts:64` — 클라이언트 마운트 시 RSS를 재fetch하여 `.slice(0, 6)`으로 `latest` 재구성
- `components/profile/ProfileShell.tsx:80` — `<RightRail latestPosts={writing.latest} />` 로 전달
- `components/profile/RightRail.tsx:34` — `latestPosts.map(...)`로 제한 없이 수신한 배열을 그대로 렌더

### 2.2 부수 사용처

- `components/profile/CommandPalette.tsx:145` — 동일한 `writing.latest` 배열을 "Latest posts" 그룹에 노출
  - 현재 6개 → 이번 변경으로 10개 노출 (의도된 side effect, 검색 편의 향상)

### 2.3 현재 노출 개수 하드코딩 지점

| 위치 | 현재 값 | 역할 |
|---|---|---|
| `app/page.tsx:16` | `getLatestPosts(6)` | SSG 초기 데이터 |
| `lib/writing.ts:104` | `limit = 6` (default) | 서버 사이드 slice |
| `lib/writing.ts:102-103` | JSDoc 주석 `"상위 6개"` | 문서화 |
| `hooks/useLiveWriting.ts:64` | `.slice(0, 6)` | 클라이언트 fresh 데이터 slice |

## 3. 변경 사항

### 3.1 하드코딩 값 수정 (3개 파일)

| 파일 | 라인 | Before | After |
|---|---|---|---|
| `app/page.tsx` | 16 | `getLatestPosts(6)` | `getLatestPosts(10)` |
| `lib/writing.ts` | 104 | `getLatestPosts(limit = 6)` | `getLatestPosts(limit = 10)` |
| `lib/writing.ts` | 102-103 | `"상위 6개"` 주석 | `"상위 10개"` 주석 |
| `hooks/useLiveWriting.ts` | 64 | `.slice(0, 6)` | `.slice(0, 10)` |

### 3.2 컴포넌트 변경 없음

- `RightRail.tsx` — 수신한 `latestPosts` 배열을 그대로 렌더하므로 코드 변경 불필요
- `CommandPalette.tsx` — 동일 배열 재사용. 자동으로 10개로 늘어남 (목표 부합)

### 3.3 상수화 검토 (선택)

서버·클라이언트 두 곳에 동일한 숫자(`10`)가 존재하여 drift 위험이 있다. 다음 중 선택:

- **옵션 A (권장, 최소 변경)**: 3곳의 숫자를 단순히 `10`으로 치환. 지금까지의 컨벤션 유지.
- **옵션 B (상수화)**: `lib/writing.ts`에 `export const LATEST_POSTS_LIMIT = 10`을 추가하고 `app/page.tsx`, `hooks/useLiveWriting.ts`에서 import. 추후 재조정 시 한 곳만 수정.

이번 작업에서는 **옵션 A**로 진행하되, 이후 다시 숫자가 조정될 가능성이 있으면 후속 chore로 옵션 B를 분리 진행한다.

## 4. 수용 기준 (Acceptance Criteria)

- [ ] 데스크탑(xl 이상) 뷰포트에서 RightRail "Latest posts" 섹션에 **정확히 10개** 아이템이 노출된다 (피드 합산 개수가 10 이상인 경우).
- [ ] IT/INV 소스가 섞여 있으며, `pubDate` 내림차순으로 정렬되어 있다.
- [ ] 피드 합산 개수가 10 미만이면 가용한 만큼만 노출되고 에러가 나지 않는다.
- [ ] 서버 초기 렌더와 클라이언트 fresh fetch 모두 10개 기준으로 동작한다 (개발자 도구 Network 탭에서 RSS 재fetch 확인).
- [ ] CommandPalette의 "Latest posts" 그룹도 10개로 노출된다.
- [ ] 중앙 `writing.it` / `writing.inv` 섹션은 여전히 각각 5개로 유지된다 (regression 없음).
- [ ] `npm run check`, `npm run lint`, `npm run build` 통과.

## 5. 리스크 & 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| RightRail 세로 길이가 늘어나 System 블록이 스크롤 뒤로 밀림 | 초기 뷰포트에서 System 블록이 가려질 수 있음 | 1280×800 데스크탑 기준으로 시각 확인. 필요 시 후속 todo로 `max-h` + 내부 스크롤 or 간격 축소 검토 |
| 서버·클라이언트 숫자 불일치 (drift) | SSG는 10개, 클라 재fetch는 6개로 바뀌는 혼선 | 3곳(`app/page.tsx`, `lib/writing.ts`, `useLiveWriting.ts`) 모두 동시 수정. 리뷰 시 diff로 3곳 모두 변경되었는지 재확인 |
| RSS 피드가 10개 미만 반환 | 목록이 6개보다 늘지 않음 | 현 시점 두 RSS 피드 합계는 충분 (IT + INV 각각 최소 10+). fallback 동작은 `slice`가 알아서 처리하므로 추가 방어 불필요 |
| CommandPalette 목록이 길어져 스크롤 발생 | 검색 UX 저하 | cmdk는 자체 스크롤 영역을 가지므로 영향 미미. 의도된 개선으로 간주 |

## 6. 참고 경로

- `v2.advenoh.pe.kr/app/page.tsx:16` — 변경 대상
- `v2.advenoh.pe.kr/lib/writing.ts:102-108` — 변경 대상 (`getLatestPosts`)
- `v2.advenoh.pe.kr/hooks/useLiveWriting.ts:62-64` — 변경 대상 (클라 slice)
- `v2.advenoh.pe.kr/components/profile/RightRail.tsx:26-56` — 렌더 로직 (변경 없음)
- `v2.advenoh.pe.kr/components/profile/CommandPalette.tsx:141-165` — 부수 사용처 (변경 없음, 자동 반영)
- `v2.advenoh.pe.kr/components/profile/ProfileShell.tsx:80` — 데이터 주입 지점 (변경 없음)
