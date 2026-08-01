# GitHub 컨트리뷰션 그래프 복구 + 소셜 링크 구조 개편

- 날짜: 2026-08-01
- 대상 프로젝트: `v2.advenoh.pe.kr` (Frank Oh 포트폴리오)
- 데이터 소스: GitHub GraphQL (`contributionsCollection`)

## 배경 / 문제

### 문제 1 — 컨트리뷰션 그래프가 전부 빈 칸

프로덕션(`https://advenoh.pe.kr/`) 실측 결과:

```
data-l="0"   182개 (26주 × 7일 전부 NONE)
data-l="1~4"   0개
commits · 26w = 0, sparkline 완전 평평
```

같은 시점 공개 프로필(`github.com/users/kenshin579/contributions`)은 최근 1년 중 **304일이 non-zero** 다.
즉 "활동이 없어서 0"이 아니라 빌드 시점 fetch 가 실패해 `buildFallback()` 의 전부-0 더미가 정적 HTML 에 박힌 것이다.

실패 경로:

1. `lib/github.ts` — `GITHUB_TOKEN` 이 없거나 무효하면 fetcher 가 throw
2. `lib/cache.ts::withCache` — 실패 시 `.cache/github-contrib.json` (stale) 로 폴백
3. **그 시드 캐시가 git 에 없다.** `git ls-files .cache` 결과는 `writing-blog.json`, `writing-investment.json` 둘뿐
4. 결국 `buildFallback()` 의 전부-0 데이터 반환
5. `status`/`writing` 과 달리 GitHub 은 **클라이언트 재조회 훅이 없어** 브라우저에서 복구될 여지도 없음

두 겹의 안전장치(라이브 fetch, 시드 캐시)가 동시에 뚫린 상태이며, **이 상태로 몇 달이 지나도록 아무도 인지하지 못했다.**

배포 자체는 최신이다(마지막 커밋 #62 콘텐츠가 라이브에 반영됨). 오래된 빌드가 박제된 문제가 아니다.

### 문제 2 — 소셜 링크 하나 추가에 5개 파일

인스타그램 계정 `frank.coffeetime` 을 추가하려면 현재 구조에서는 아래를 모두 손봐야 한다.

| # | 파일 | 이유 |
|---|------|------|
| 1 | `lib/site-config.ts` | `author.social.instagram` 이 **단일 문자열**이라 계정 2개가 안 들어감 |
| 2 | `components/profile/SidebarContent.tsx` | `SOCIAL_LINKS` 상수에 label + ariaKey 하드코딩 |
| 3 | `lib/i18n/en.ts` | 계정별 aria 키 |
| 4 | `lib/i18n/ko.ts` | 같은 키 (`Dict = typeof en` 이라 타입이 강제) |
| 5 | `lib/structured-data.ts` | JSON-LD `sameAs` 하드코딩 3줄 |

## 목표

1. 컨트리뷰션 그래프에 실제 데이터가 표시되게 한다.
2. 같은 실패가 재발해도 **조용히 거짓 데이터를 보여주지 않게** 한다.
3. 소셜 링크를 배열 기반 단일 원천으로 바꾸고 `frank.coffeetime` 을 추가한다.
4. 링크 추가 비용을 **파일 1개**로 줄인다.

## 비목표

- GitHub 데이터의 클라이언트 재조회 훅 신설 (GraphQL 은 인증 필수 → 브라우저에서 토큰 노출 불가)
- 공개 HTML 엔드포인트 스크레이핑으로의 전환 (토큰이 살아있음이 확인되어 불필요)
- `fetchedAt` 기반 **stale** 표시 (임계값을 정할 근거가 없음 — 필요해지면 `isFallbackContrib` 옆에 추가)
- `.cache/status.json` 시드화 (status 는 `useLiveStatus` 로 클라이언트 복구됨)
- 커맨드 팔레트에 소셜 링크 노출 확대 (현재 `github` + `status` 유지)

## 확정 사항

| 항목 | 결정 |
|------|------|
| 토큰 | 새 PAT 재발급 + Netlify 갱신 (**사용자가 이미 수행**). 코드 변경 없음 |
| 토큰 스코프 권고 | `read:user` 만. 기존 토큰은 `admin:enterprise, admin:org, repo, user, workflow, write:discussion` 로 정적 빌드에 과도 |
| Netlify 설정 권고 | "Same value in all deploy contexts" 로 통일 (기존: `4 values in 4 deploy contexts`) |
| 안전망 | 시드 캐시 커밋 + UI 폴백 표시 **둘 다** |
| 폴백 감지 | `fetchedAt` 이 epoch 인지로 판별 (`buildFallback()` 이 심는 유일한 값) |
| 소셜 구조 | `author.social` 을 `{id, label, url}` **배열**로 전환 + 파생 `socialUrl` 맵 |
| aria 라벨 | 계정별 aria 키 **삭제**, 보이는 링크 텍스트를 접근 가능한 이름으로 사용 |
| 새 계정 id | `instagram-coffee` |
| PR 구성 | **PR 1개 / 커밋 2개** (양쪽 작업이 `lib/i18n/{en,ko}.ts` 를 함께 건드려 브랜치 분리 시 충돌) |

## 설계

### 1. 폴백 감지 헬퍼 — `lib/github.ts`

```ts
export function isFallbackContrib(c: GithubContrib): boolean {
  return new Date(c.fetchedAt).getTime() === 0
}
```

`buildFallback()` 의 `fetchedAt: new Date(0).toISOString()` 이 epoch 를 만드는 **유일한 지점**이므로 센티넬로 안전하다.
값을 만드는 곳과 해석하는 곳을 한 파일에 두어, 폴백 표현이 바뀌면 판별도 같이 바뀌도록 묶는다.

### 2. UI 분기 — 2곳

`CommitGraph` 컴포넌트는 **건드리지 않는다.** "주어진 데이터를 그린다"는 책임만 갖게 두고,
"그릴 데이터가 없다"는 판단은 호출부가 한다.

#### 2-1. `components/profile/RightRailContent.tsx`

- 헤더 우측 합계 `{github.totalContributions}` → 폴백이면 `—`
- `<CommitGraph …/>` → 폴백이면 점선 테두리 박스에 `t.commits.unavailable` 문구

#### 2-2. `components/profile/StatsRow.tsx`

- `commits · 26w` 셀 값 `stats.commits26w.toLocaleString()` → 폴백이면 `—`
- `trailing` 의 `<Sparkline …/>` → 폴백이면 렌더하지 않음

`lib/stats.ts` 는 변경하지 않는다. `StatsRow` 가 이미 `github` prop 을 받으므로 거기서 판별한다.

#### 2-3. i18n 키 추가

| 키 | en | ko |
|----|----|----|
| `commits.unavailable` | `data unavailable` | `데이터 없음` |

### 3. 시드 캐시 커밋

```bash
GITHUB_TOKEN=<새토큰> npx tsx scripts/warm-cache.ts
git add .cache/github-contrib.json
```

`tsx` 는 `.env` 를 자동 로드하지 않으므로 인라인 주입이 필요하다.
`.cache` 는 gitignore 대상이 아니며 `writing-*.json` 이 이미 커밋되어 있으므로 **기존 패턴을 그대로 따른다.**

부수 효과: 지금은 토큰 없는 로컬 개발자가 그래프를 전혀 못 보는데, 시드가 커밋되면 로컬 `npm run dev` 에서도 렌더된다.

### 4. 두 안전망의 상호작용

| 상황 | 결과 |
|------|------|
| 정상 | 라이브 데이터 |
| fetch 실패 + 시드 있음 | stale 시드 (그래프 보임, 데이터는 과거 시점) |
| fetch 실패 + 시드 없음 | `data unavailable` ← UI 폴백이 담당 |

시드를 커밋하면 UI 폴백은 *안전망의 안전망*이 되어 실제로는 거의 노출되지 않는다.
그럼에도 넣는 이유는 **이번 장애가 정확히 3번 경로였고 몇 달간 아무도 몰랐기** 때문이다.
`.cache` 없는 신규 clone, 캐시 파일 손상(`readCache` 가 `null` 반환) 에서도 같은 경로를 탄다.

### 5. 소셜 링크 배열 전환 — `lib/site-config.ts`

```ts
social: [
  { id: 'github',           label: 'github/kenshin579',          url: 'https://github.com/kenshin579' },
  { id: 'linkedin',         label: 'linkedin/frank-oh',          url: 'https://www.linkedin.com/in/frank-oh-abb80b10/' },
  { id: 'instagram',        label: 'instagram/frank.photosnap',  url: 'https://www.instagram.com/frank.photosnap/' },
  { id: 'instagram-coffee', label: 'instagram/frank.coffeetime', url: 'https://www.instagram.com/frank.coffeetime/' },
],
```

키 참조가 필요한 소비처를 위해 파생 맵을 함께 export 한다:

```ts
export type SocialId = (typeof siteConfig.author.social)[number]['id']

export const socialUrl = Object.fromEntries(
  siteConfig.author.social.map(s => [s.id, s.url])
) as Record<SocialId, string>
```

`as const` 덕분에 `SocialId` 가 리터럴 유니온(`'github' | 'linkedin' | 'instagram' | 'instagram-coffee'`)으로 좁혀진다.
따라서 `socialUrl.github` 은 타입 안전하며, 배열에서 github 항목을 지우면 컴파일이 깨진다.

배열 순서가 곧 사이드바 표시 순서다.

### 6. 소비처 3곳

| 파일 | 변경 |
|------|------|
| `components/profile/SidebarContent.tsx` | `SOCIAL_LINKS` 상수 **삭제** → `siteConfig.author.social` 직접 map. `aria-label` 제거, `↗` 를 `aria-hidden="true"` 로 감쌈 |
| `lib/structured-data.ts` | `sameAs: siteConfig.author.social.map(s => s.url)` — 하드코딩 3줄 제거 |
| `components/profile/CommandPalette.tsx` | `siteConfig.author.social.github` → `socialUrl.github` |

### 7. i18n aria 키 삭제

`a11y.githubProfile` / `a11y.linkedinProfile` / `a11y.instagramProfile` 3키를 `en.ts`·`ko.ts` 양쪽에서 삭제한다.
사용처는 `SidebarContent` 하나뿐임을 확인했다.

접근성 후퇴가 아니다. 링크의 접근 가능한 이름이 `"Instagram: frank.photosnap"` 에서
화면에 실제로 보이는 `"instagram/frank.photosnap"` 으로 바뀔 뿐이며,
보이는 텍스트와 읽히는 텍스트가 일치해 음성 제어에 오히려 유리하다.
그리고 계정 추가 시 i18n 을 건드릴 필요가 사라진다.

## 데이터 흐름 (변경 없음)

`lib/github.ts::getGithubContrib` → `withCache` → `lib/home-data.ts::loadHomeData`
→ `app/page.tsx` / `app/ko/page.tsx` → `ProfileShell` → `RightRail`/`MobileRightRailDrawer` → `RightRailContent` → `CommitGraph`,
그리고 `Hero` → `StatsRow`.

표시 로직만 변경하고 로딩 파이프라인은 그대로 둔다.

## 엣지 케이스

- **시드 캐시가 실제 26주보다 짧거나 김**: `CommitGraph` 는 `data.weeks.length` 로 그리드 열 수를 잡으므로 길이에 무관하게 렌더된다.
- **`fetchedAt` 이 epoch 인 정상 데이터**: 발생 불가. GitHub 응답 경로는 `new Date().toISOString()` 을 쓴다.
- **스키마 검증 실패**: `githubContribSchema.parse` 가 throw → `withCache` 가 캐시/폴백으로 처리 (기존 동작 유지).
- **소셜 배열이 빈 경우**: `sameAs: []` 가 되어 `tests/seo.spec.ts:69` 의 `length > 0` 이 깨진다. 배열을 비우지 않는 것으로 충분하며 별도 가드는 두지 않는다.
- **정적 export**: 소셜 URL 은 모두 외부 절대 URL 이라 `output: 'export'` 와 무관하다.

## 검증 계획

```bash
npm run check      # tsc --noEmit — i18n Dict 동기화 확인 지점
npm run lint
npm run build      # 정적 export 성공
npm test           # playwright (webServer 가 npm run dev 기동)
```

- `tests/seo.spec.ts:68-69` 는 `sameAs` 가 배열이고 비어있지 않은지만 검사하므로 리팩터에 안전하다. 커밋 그래프 관련 테스트는 없다.
- 수동: 사이드바 Links 에 4줄 노출 (`github` / `linkedin` / `instagram×2`), 각 링크 새 탭 이동 확인
- 수동: 데스크톱 RightRail 과 모바일 드로어 양쪽에서 그래프 확인

배포 후 프로덕션 검증:

```bash
curl -s https://advenoh.pe.kr/ | grep -o 'data-l="[0-4]"' | sort | uniq -c
```

`data-l="1"`~`"4"` 가 나오면 성공. 전부 `"0"` 이면 여전히 폴백 경로다.

## 운영 메모

- Netlify 는 **환경변수 변경만으로 재빌드하지 않는다.** Deploys → Trigger deploy 로 수동 실행이 필요하다.
- 새 PAT 은 이 사이트 전용으로 용도가 드러나는 이름(예: `advenoh-portfolio-contrib`)을 쓰고 만료일을 설정하는 편이 추적에 유리하다. 현재 classic 토큰 5개 중 4개가 만료일 없음 상태다.
