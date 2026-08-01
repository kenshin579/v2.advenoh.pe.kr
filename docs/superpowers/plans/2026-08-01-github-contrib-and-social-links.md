# GitHub 컨트리뷰션 복구 + 소셜 링크 구조 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 프로덕션에서 전부 0으로 표시되는 GitHub 컨트리뷰션 그래프를 복구하고, 재발 시 거짓 데이터 대신 "데이터 없음"이 표시되게 하며, 소셜 링크를 배열 단일 원천으로 바꿔 `instagram/frank.coffeetime` 을 추가한다.

**Architecture:** 로딩 파이프라인(`getGithubContrib` → `withCache` → `loadHomeData`)은 그대로 두고 두 겹의 안전망만 추가한다 — (1) `.cache/github-contrib.json` 시드를 git 에 커밋해 fetch 실패 시에도 데이터가 남게 하고, (2) `buildFallback()` 이 심는 epoch `fetchedAt` 을 센티넬로 폴백을 감지해 호출부에서 그래프 대신 안내 문구를 렌더한다. 소셜 링크는 `siteConfig.author.social` 을 `{id, label, url}` 배열로 바꾸고 사이드바·JSON-LD·커맨드 팔레트가 모두 여기서 파생되게 한다.

**Tech Stack:** Next.js 16 (App Router, `output: 'export'`), React 19, TypeScript 5.6, Playwright 1.56 (유일한 테스트 러너 — 단위 테스트 러너 없음), Tailwind CSS 3.4

**Spec:** `docs/superpowers/specs/2026-08-01-github-contrib-and-social-links-design.md`

---

## 사전 상태 (이미 완료됨)

- 브랜치 `fix/github-contrib-and-social-links` 생성됨 (`main` 기준)
- 설계 문서 커밋됨 (`570a82d`)
- 사용자가 GitHub PAT 재발급 + Netlify `GITHUB_TOKEN` 갱신 완료

> **스펙과의 차이 (의도적):** 스펙은 "커밋 2개"로 스케치했으나, 이 계획은 TDD 사이클마다 커밋해 6개가 된다. 스펙의 실제 제약은 **PR 1개**(양쪽 작업이 `lib/i18n/{en,ko}.ts` 를 함께 건드려 브랜치 분리 시 충돌)였고 그 제약은 지킨다.

## 작업 중 발생하는 부수 변경 (커밋하지 말 것)

`npm run dev` / `npx playwright test` / `npm run build` 를 돌리면 아래 파일들이 이번 변경과 무관하게 수정된다. 커밋 전에 되돌린다.

| 파일 | 원인 |
|------|------|
| `.cache/writing-blog.json`, `.cache/writing-investment.json` | RSS 로더가 성공해 `withCache` 가 캐시를 갱신 |
| `next-env.d.ts` | Next.js 16 이 dev 는 `./.next/dev/types/routes.d.ts`, build 는 `./.next/types/routes.d.ts` 로 자동 전환 |
| `.cache/github-contrib.json` | 셸에 `GITHUB_TOKEN` 이 있으면 라이브 fetch 성공분으로 덮어씀 (Task 2 이후) |

```bash
git checkout -- .cache/writing-blog.json .cache/writing-investment.json next-env.d.ts
```

## 사람의 개입이 필요한 지점

**Task 2 는 GitHub PAT 가 셸 환경에 있어야 실행 가능하다.** 에이전트가 단독으로 완료할 수 없다.
토큰이 없으면 Task 2 를 건너뛰고 Task 3 부터 진행한 뒤, 사람이 나중에 Task 2 를 수행한다.

## 파일 구조

| 파일 | 책임 | 작업 |
|------|------|------|
| `tests/github-contrib.spec.ts` | 그래프가 폴백 데이터로 렌더되지 않는지 회귀 검증 | 생성 |
| `tests/social-links.spec.ts` | 소셜 링크 4개와 JSON-LD `sameAs` 검증 | 생성 |
| `.cache/github-contrib.json` | fetch 실패 시 쓰이는 시드 스냅샷 | 생성 (커밋 대상) |
| `lib/github.ts` | GitHub 데이터 로딩 + **폴백 판별** | 수정 (함수 1개 추가) |
| `lib/i18n/en.ts` | 영문 문자열 (`Dict` 원본 타입) | 수정 (키 1개 추가, 3개 삭제) |
| `lib/i18n/ko.ts` | 한글 문자열 (`Dict` 준수 강제) | 수정 (동일) |
| `components/profile/RightRailContent.tsx` | 우측 패널 조립 — 폴백 분기 | 수정 |
| `components/profile/StatsRow.tsx` | Hero 통계 4칸 — 폴백 분기 | 수정 |
| `lib/site-config.ts` | 외부 링크 단일 원천 | 수정 (`social` 배열화 + `socialUrl` 파생) |
| `components/profile/SidebarContent.tsx` | 사이드바 조립 — 소셜 목록 렌더 | 수정 (하드코딩 상수 제거) |
| `lib/structured-data.ts` | JSON-LD 생성 | 수정 (`sameAs` 파생) |
| `components/profile/CommandPalette.tsx` | 커맨드 팔레트 | 수정 (참조 1줄) |

`components/profile/CommitGraph.tsx` 는 **건드리지 않는다.** "주어진 데이터를 그린다"는 책임만 유지하고, "그릴 데이터가 없다"는 판단은 호출부가 한다.

---

### Task 1: 컨트리뷰션 그래프 회귀 테스트

원래 장애를 잡아냈을 테스트를 먼저 작성한다. 시드 캐시가 없는 현재 상태에서는 실패해야 정상이다.

**Files:**
- Create: `tests/github-contrib.spec.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

`CommitGraph` 는 셀마다 `data-l="0"`~`"4"` 를 찍는다(`components/profile/CommitGraph.tsx:55`). 범례 스팬에는 `data-l` 이 없으므로 셀만 정확히 잡힌다. `RightRail` 은 `hidden xl:flex` 라 화면에 안 보일 수 있지만 DOM 에는 존재하므로 속성 조회는 가능하다.

```ts
import { test, expect } from '@playwright/test'

test('컨트리뷰션 그래프는 폴백이 아닌 실제 기여 데이터를 렌더한다', async ({ page }) => {
  await page.goto('/')

  const total = await page.locator('[data-l]').count()
  expect(total).toBeGreaterThan(0)

  // 전부 level 0 이면 buildFallback() 의 전부-0 더미가 박힌 것.
  // 2026-08 장애(시드 캐시 부재 + 토큰 실패)의 재발 방지용.
  const zeroCells = await page.locator('[data-l="0"]').count()
  expect(zeroCells).toBeLessThan(total)
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

셸에 `GITHUB_TOKEN` 이 **없는** 상태로 실행해야 한다. 있으면 라이브 fetch 가 성공해 테스트가 그냥 통과해버린다.

```bash
unset GITHUB_TOKEN
npx playwright test tests/github-contrib.spec.ts
```

Expected: FAIL — `expect(received).toBeLessThan(expected)`, received `182`, expected `182`

- [ ] **Step 3: 커밋**

```bash
git add tests/github-contrib.spec.ts
git commit -m "test: 컨트리뷰션 그래프 폴백 회귀 테스트 추가"
```

---

### Task 2: 시드 캐시 생성 및 커밋

> **이 태스크는 GitHub PAT 가 필요하다.** 토큰이 없으면 건너뛰고 Task 3 으로 진행한다.

**Files:**
- Create: `.cache/github-contrib.json`

- [ ] **Step 1: 캐시 시드 생성**

`tsx` 는 `.env` 를 자동 로드하지 않으므로 토큰을 인라인으로 주입한다.

```bash
GITHUB_TOKEN=<새로_발급한_PAT> npx tsx scripts/warm-cache.ts
```

Expected 출력 (status 는 Supabase 환경변수가 없으면 실패하는 게 정상):
```
  ! status 실패: ...
  ✓ github (xxxms)
  ✓ writing:blog (xxxms)
  ✓ writing:investment (xxxms)
캐시 시드 생성 완료 — .cache/ 디렉터리 확인
```

- [ ] **Step 2: 생성된 시드 검증**

```bash
grep -o '"totalContributions": [0-9]*' .cache/github-contrib.json
grep -o '"login": "[^"]*"' .cache/github-contrib.json
```

Expected: `"totalContributions": <0보다 큰 수>` 와 `"login": "kenshin579"`

`totalContributions` 가 `0` 이면 토큰이 여전히 무효한 것이다. 멈추고 토큰을 다시 확인한다.

- [ ] **Step 3: 무관한 캐시 변경 되돌리기**

`warm-cache.ts` 는 writing 캐시도 갱신하므로 PR 에 노이즈가 섞인다. 이번 변경과 무관하므로 되돌린다.

```bash
git checkout -- .cache/writing-blog.json .cache/writing-investment.json
git status --short
```

Expected: `?? .cache/github-contrib.json` 한 줄만 (또는 Task 1 커밋 이후이므로 이것만)

- [ ] **Step 4: 테스트가 통과하는지 확인**

```bash
unset GITHUB_TOKEN
npx playwright test tests/github-contrib.spec.ts
```

Expected: PASS (1 passed) — 라이브 fetch 는 실패하지만 시드 캐시가 stale 로 제공됨

- [ ] **Step 5: 커밋**

```bash
git add .cache/github-contrib.json
git commit -m "fix: GitHub 컨트리뷰션 시드 캐시 커밋

* 토큰 fetch 실패 시 전부-0 폴백으로 떨어지던 문제 해소
* .cache/writing-*.json 과 동일한 기존 시드 패턴을 따름"
```

---

### Task 3: 폴백 감지 헬퍼 + i18n 키

**Files:**
- Modify: `lib/github.ts` (파일 끝에 추가)
- Modify: `lib/i18n/en.ts:81-84`
- Modify: `lib/i18n/ko.ts:83-86`

- [ ] **Step 1: `isFallbackContrib` 추가**

`lib/github.ts` 맨 끝, `getGithubContrib` 아래에 붙인다.

```ts
/**
 * 폴백 데이터 판별.
 * `buildFallback()` 의 `fetchedAt: new Date(0)` 이 epoch 를 만드는 유일한 지점이고,
 * 실제 GitHub 응답 경로는 `new Date().toISOString()` 을 쓰므로 오탐이 없다.
 */
export function isFallbackContrib(c: GithubContrib): boolean {
  return new Date(c.fetchedAt).getTime() === 0
}
```

- [ ] **Step 2: 영문 문자열 추가**

`lib/i18n/en.ts` 의 `commits` 블록(81-84행)을 아래로 교체한다.

```ts
  commits: {
    less: 'Less',
    more: 'More',
    unavailable: 'data unavailable',
  },
```

- [ ] **Step 3: 한글 문자열 추가**

`lib/i18n/ko.ts` 의 `commits` 블록(83-86행)을 아래로 교체한다. `Dict = typeof en` 이므로 en 에 키를 추가하면 ko 는 필수다.

```ts
  commits: {
    less: '적음',
    more: '많음',
    unavailable: '데이터 없음',
  },
```

- [ ] **Step 4: 타입 검사**

```bash
npm run check
```

Expected: 에러 없이 종료 (exit 0). ko.ts 에 키를 빠뜨렸다면 여기서 잡힌다.

- [ ] **Step 5: 커밋**

```bash
git add lib/github.ts lib/i18n/en.ts lib/i18n/ko.ts
git commit -m "feat: 컨트리뷰션 폴백 감지 헬퍼와 안내 문구 추가"
```

---

### Task 4: UI 폴백 분기

**Files:**
- Modify: `components/profile/RightRailContent.tsx:3, 19-25`
- Modify: `components/profile/StatsRow.tsx:4, 16-22, 40-46`

- [ ] **Step 1: `RightRailContent` 임포트 교체**

3행의 `import type { GithubContrib } from '@/lib/github'` 를 아래로 바꾼다. 인라인 `type` 수식자를 쓰면 중복 임포트 없이 값과 타입을 함께 가져올 수 있다.

```ts
import { isFallbackContrib, type GithubContrib } from '@/lib/github'
```

- [ ] **Step 2: `RightRailContent` 본문 분기**

함수 본문 첫 줄에 폴백 여부를 계산하고, 19-25행의 commits 블록을 교체한다.

```tsx
export function RightRailContent({ github, latestPosts, status, t }: RightRailContentProps) {
  const fallback = isFallbackContrib(github)

  return (
    <div className="flex flex-col gap-6 font-mono text-xs">
      <div>
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-profile-muted-2">
          <span>{t.rightRail.commits} · 26w</span>
          <span>{fallback ? '—' : github.totalContributions}</span>
        </div>
        {fallback ? (
          <div className="rounded border border-dashed border-profile-line-2 px-2 py-4 text-center text-profile-muted-2">
            {t.commits.unavailable}
          </div>
        ) : (
          <CommitGraph data={github} size="sm" t={t} />
        )}
      </div>
```

이하 `latestPosts` / `system` 블록은 그대로 둔다.

- [ ] **Step 3: `StatsRow` 임포트 교체**

4행의 `import type { GithubContrib } from '@/lib/github'` 를 아래로 바꾼다.

```ts
import { isFallbackContrib, type GithubContrib } from '@/lib/github'
```

- [ ] **Step 4: `StatsRow` 본문 분기**

16-22행에 `fallback` 계산을 추가한다.

```tsx
export function StatsRow({ stats, github, status, t }: StatsRowProps) {
  // 주(week) 단위 contributionCount 합계 → 26개 sparkline 값
  const weekTotals = github.weeks.map(w =>
    w.contributionDays.reduce((sum, d) => sum + d.contributionCount, 0)
  )

  const allUp = status.summary.up === status.summary.total
  const fallback = isFallbackContrib(github)
```

그리고 40-46행의 commits Cell 을 교체한다.

```tsx
      <Cell
        label="commits · 26w"
        value={fallback ? '—' : stats.commits26w.toLocaleString()}
        trailing={
          fallback ? undefined : (
            <Sparkline values={weekTotals} width={70} height={20} className="text-profile-accent" />
          )
        }
      />
```

- [ ] **Step 5: 타입 검사와 린트**

```bash
npm run check && npm run lint
```

Expected: 둘 다 에러 없이 종료

- [ ] **Step 6: 회귀 테스트 상태 확인**

이 변경 이후 `tests/github-contrib.spec.ts` 의 **실패 지점이 이동한다.** 폴백일 때 `CommitGraph` 자체를 렌더하지 않으므로 `data-l` 셀이 0개가 되어, 두 번째 단언(`zeroCells < total`)이 아니라 첫 번째(`total > 0`)에서 걸린다.

```bash
unset GITHUB_TOKEN
npx playwright test tests/github-contrib.spec.ts
```

- **Task 2 미완료 상태**: FAIL — `expect(received).toBeGreaterThan(expected)`, received `0`, expected `0`. **정상이다.** 시드 캐시가 없으면 실제 데이터가 있을 수 없다.
- **Task 2 완료 상태**: PASS — 시드가 stale 로 제공되어 실제 레벨 분포가 렌더된다.

테스트를 통과시키려고 UI 를 되돌리지 마라. 이 테스트는 Task 2 가 채워질 때 GREEN 이 된다.

> 테스트 의미는 오히려 선명해진다 — 이제 "그래프가 있고 그 안에 실제 활동이 있다"를 요구한다. 폴백이 배포되면 어느 쪽 단언이든 반드시 걸린다.

- [ ] **Step 7: 폴백 화면 확인**

Task 2 가 아직이면 폴백이 **현재 로컬의 기본 상태**이므로 시드를 치울 필요 없이 바로 확인된다.

```bash
unset GITHUB_TOKEN
npm run dev
```

다른 셸에서 렌더 결과를 직접 확인한다.

```bash
curl -s http://localhost:3000/    | grep -c 'data unavailable'
curl -s http://localhost:3000/ko/ | grep -c '데이터 없음'
curl -s http://localhost:3000/    | grep -o 'data-l=' | wc -l
```

Expected: 앞의 두 명령은 `1` 이상, 세 번째는 `0` (그래프 미렌더)

브라우저로도 `http://localhost:3000` 을 열어 확인한다:
- Hero 통계 `commits · 26w` 값이 `—`, sparkline 없음
- 우측 활동 패널(창 폭 1280px 이상) commits 자리에 점선 박스 + `data unavailable`

> Task 2 를 먼저 끝냈다면 시드를 잠시 치우고 같은 확인을 한다.
> `mv .cache/github-contrib.json .cache/github-contrib.json.bak` → 확인 → `mv .cache/github-contrib.json.bak .cache/github-contrib.json`

> **주의:** 셸에 `GITHUB_TOKEN` 이 있는 채로 `npm run dev` 나 `npm run build` 를 돌리면 `withCache` 가 성공 경로를 타면서 `.cache/github-contrib.json` 을 **덮어쓴다.** 커밋 전에 항상 `git status` 를 확인한다.

- [ ] **Step 8: 커밋**

```bash
git add components/profile/RightRailContent.tsx components/profile/StatsRow.tsx
git commit -m "feat: 컨트리뷰션 데이터가 폴백일 때 그래프 대신 안내 문구 표시

* 전부-0 그래프가 '커밋 0회'로 오독되던 문제 해소
* CommitGraph 는 그대로 두고 호출부에서 분기"
```

---

### Task 5: 소셜 링크 e2e 테스트

**Files:**
- Create: `tests/social-links.spec.ts`

- [ ] **Step 1: 실패하는 테스트 작성**

사이드바 `<aside aria-label="Profile sidebar">` 는 role `complementary` 로 잡힌다. 모바일 드로어는 Radix `Dialog.Portal` 이라 닫혀 있으면 DOM 에 없으므로 데스크톱 뷰포트에서는 링크가 한 벌만 존재한다.

```ts
import { test, expect } from '@playwright/test'

const EXPECTED = [
  { label: 'github/kenshin579', href: 'https://github.com/kenshin579' },
  { label: 'linkedin/frank-oh', href: 'https://www.linkedin.com/in/frank-oh-abb80b10/' },
  { label: 'instagram/frank.photosnap', href: 'https://www.instagram.com/frank.photosnap/' },
  { label: 'instagram/frank.coffeetime', href: 'https://www.instagram.com/frank.coffeetime/' },
]

test('사이드바 Links 에 소셜 계정 4개가 노출된다', async ({ page }) => {
  await page.goto('/')
  const sidebar = page.getByRole('complementary', { name: 'Profile sidebar' })

  for (const { label, href } of EXPECTED) {
    const link = sidebar.getByRole('link', { name: label })
    await expect(link).toHaveAttribute('href', href)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noreferrer/)
  }
})

test('JSON-LD sameAs 에 소셜 URL 4개가 모두 포함된다', async ({ page }) => {
  await page.goto('/')
  const personScript = page.locator('script[type="application/ld+json"]').nth(0)
  const personData = JSON.parse((await personScript.textContent()) || '{}')

  expect(personData.sameAs).toHaveLength(4)
  for (const { href } of EXPECTED) {
    expect(personData.sameAs).toContain(href)
  }
})
```

- [ ] **Step 2: 테스트가 실패하는지 확인**

```bash
npx playwright test tests/social-links.spec.ts
```

Expected: 두 테스트 모두 FAIL
- 첫 번째 — 현재 링크의 접근 가능한 이름이 `aria-label` 값(`GitHub profile: kenshin579`)이라 `github/kenshin579` 로 못 찾음
- 두 번째 — `sameAs` 길이가 `3` (기대 `4`)

- [ ] **Step 3: 커밋**

```bash
git add tests/social-links.spec.ts
git commit -m "test: 소셜 링크 4개와 JSON-LD sameAs 검증 추가"
```

---

### Task 6: 소셜 링크 배열 전환

`site-config` 의 타입이 바뀌면 소비처가 전부 컴파일 에러가 난다. 원자적으로 한 번에 바꾼다.

**Files:**
- Modify: `lib/site-config.ts:5-13, 38-41`
- Modify: `components/profile/SidebarContent.tsx:16-32, 129-144`
- Modify: `lib/structured-data.ts:10-14`
- Modify: `components/profile/CommandPalette.tsx:9, 175`
- Modify: `lib/i18n/en.ts:12-14`
- Modify: `lib/i18n/ko.ts:14-16`

- [ ] **Step 1: `siteConfig.author.social` 을 배열로 전환**

`lib/site-config.ts` 의 `author` 블록(5-13행)을 교체한다.

```ts
  author: {
    name: "Frank Oh",
    jobTitle: "Software Engineer",
    // 사이드바 Links · JSON-LD sameAs · 커맨드 팔레트가 모두 이 배열에서 파생된다.
    // 계정을 추가하려면 여기에 항목 한 줄만 넣으면 된다.
    social: [
      { id: "github", label: "github/kenshin579", url: "https://github.com/kenshin579" },
      { id: "linkedin", label: "linkedin/frank-oh", url: "https://www.linkedin.com/in/frank-oh-abb80b10/" },
      { id: "instagram", label: "instagram/frank.photosnap", url: "https://www.instagram.com/frank.photosnap/" },
      { id: "instagram-coffee", label: "instagram/frank.coffeetime", url: "https://www.instagram.com/frank.coffeetime/" },
    ],
  },
```

- [ ] **Step 2: `socialUrl` 파생 맵 추가**

`lib/site-config.ts` 끝의 `export type SiteConfig = typeof siteConfig` 아래에 붙인다.

```ts
export type SocialId = (typeof siteConfig.author.social)[number]['id']

/**
 * id → url 조회용 파생 맵.
 * `as const` 덕분에 SocialId 가 리터럴 유니온이라 `socialUrl.github` 이 타입 안전하고,
 * 배열에서 항목을 지우면 소비처가 컴파일 에러로 잡힌다.
 */
export const socialUrl = Object.fromEntries(
  siteConfig.author.social.map(s => [s.id, s.url])
) as Record<SocialId, string>
```

- [ ] **Step 3: `SidebarContent` 하드코딩 상수 제거**

`components/profile/SidebarContent.tsx` 의 `SOCIAL_LINKS` 상수(16-32행)를 **통째로 삭제**한다.

그리고 Links 블록의 `<ul>`(129-144행)을 교체한다. 세 가지가 동시에 바뀐다.

1. `aria-label` 제거 + `↗` 를 `aria-hidden` 처리 → 접근 가능한 이름이 화면에 보이는 텍스트와 일치
2. `block` → `flex items-center gap-1` → 화살표와 라벨이 한 줄에 고정
3. 라벨에 `min-w-0 truncate` → 사이드바 폭(`w-[236px]`)을 넘으면 말줄임

3번이 필요한 이유: 현재 `↗ instagram/frank.photosnap` 이 사이드바 폭을 아슬아슬하게 넘겨 화살표만 남고 라벨이 다음 줄로 떨어진다. 추가되는 `frank.coffeetime` 은 한 글자 더 길어 같은 증상이 난다.
Tailwind 의 `truncate` 는 flex 자식에서 `min-width: auto` 때문에 동작하지 않으므로 `min-w-0` 을 반드시 함께 준다.

```tsx
        <ul className="flex flex-col gap-0.5">
          {siteConfig.author.social.map(({ label, url }) => (
            <li key={url}>
              <Link
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => onNavigate?.()}
                className="flex items-center gap-1 rounded px-2 py-2.5 md:py-1 font-mono text-profile-fg-2 hover:text-profile-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
              >
                <span aria-hidden="true" className="shrink-0">↗</span>
                <span className="min-w-0 truncate">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
```

> `truncate` 는 CSS `text-overflow` 이므로 DOM 의 텍스트는 온전히 남는다. Task 5 의 `getByRole('link', { name: 'instagram/frank.coffeetime' })` 은 그대로 동작하며 테스트 수정은 필요 없다.

- [ ] **Step 4: JSON-LD `sameAs` 를 파생으로 교체**

`lib/structured-data.ts` 의 `sameAs` 블록(10-14행)을 한 줄로 줄인다.

```ts
    sameAs: siteConfig.author.social.map(s => s.url),
```

- [ ] **Step 5: 커맨드 팔레트 참조 교체**

`components/profile/CommandPalette.tsx` 9행의 임포트를 바꾼다. `siteConfig` 는 183행의 `external.status` 에서 계속 쓰이므로 남긴다.

```ts
import { siteConfig, socialUrl } from '@/lib/site-config'
```

175행을 바꾼다.

```tsx
              onSelect={() => openUrl(socialUrl.github)}
```

- [ ] **Step 6: 계정별 aria 키 삭제**

`lib/i18n/en.ts` 의 12-14행 세 줄을 삭제한다.

```ts
    githubProfile: 'GitHub profile: kenshin579',
    linkedinProfile: 'LinkedIn profile: Frank Oh',
    instagramProfile: 'Instagram: frank.photosnap',
```

`lib/i18n/ko.ts` 의 14-16행 세 줄을 삭제한다.

```ts
    githubProfile: 'GitHub 프로필: kenshin579',
    linkedinProfile: 'LinkedIn 프로필: Frank Oh',
    instagramProfile: 'Instagram: frank.photosnap',
```

- [ ] **Step 7: 잔여 참조 확인**

옛 객체 접근과 삭제된 i18n 키가 어디에도 안 남았는지 확인한다.

```bash
grep -rn "social\.\(github\|linkedin\|instagram\)" lib components app
grep -rn "githubProfile\|linkedinProfile\|instagramProfile" lib components app tests
```

Expected: 두 명령 모두 출력 없음 (exit 1)

- [ ] **Step 8: 타입 검사와 린트**

```bash
npm run check && npm run lint
```

Expected: 둘 다 에러 없이 종료. `Object.fromEntries` 의 `as Record<SocialId, string>` 캐스팅이 통과하는지 여기서 확인된다.

- [ ] **Step 9: 테스트 통과 확인**

```bash
npx playwright test tests/social-links.spec.ts
```

Expected: 2 passed

- [ ] **Step 10: 줄바꿈 수정 수동 확인**

```bash
npm run dev
```

`http://localhost:3000` 사이드바 `LINKS` 섹션에서 확인:
- 항목 4개가 각각 **한 줄**에 렌더된다 (화살표만 남고 라벨이 다음 줄로 떨어지는 현상 없음)
- 넘치는 라벨은 `instagram/frank.coffeeti…` 처럼 말줄임 처리된다
- 창 폭을 좁혀 모바일 드로어(햄버거 → Navigation)를 열어도 동일하다. 드로어는 `w-[280px]` 로 더 넓어 말줄임 없이 다 보일 수 있다

- [ ] **Step 11: 커밋**

```bash
git add lib/site-config.ts lib/structured-data.ts lib/i18n/en.ts lib/i18n/ko.ts \
        components/profile/SidebarContent.tsx components/profile/CommandPalette.tsx
git commit -m "feat: 소셜 링크 배열 구조 전환 및 frank.coffeetime 추가

* author.social 을 {id,label,url} 배열 단일 원천으로 전환
* 사이드바 · JSON-LD sameAs · 커맨드 팔레트가 배열에서 파생
* 계정별 aria 키 제거 — 보이는 링크 텍스트를 접근 가능한 이름으로 사용
* 사이드바 Links 항목이 줄바꿈되던 문제를 flex + truncate 로 수정
* instagram/frank.coffeetime 추가"
```

---

### Task 7: 전체 검증 및 PR

**Files:** 없음 (검증과 PR 생성만)

- [ ] **Step 1: 전체 테스트 스위트**

```bash
unset GITHUB_TOKEN
npm test
```

Expected: 모든 테스트 통과. 기존 `seo.spec.ts`, `i18n.spec.ts`, `status-link.spec.ts` 도 함께 돌며, `seo.spec.ts:68-69` 의 `sameAs` 검사(배열 · 길이 > 0)는 계속 만족한다.

- [ ] **Step 2: 프로덕션 빌드**

```bash
npm run build
```

Expected: 정적 export 성공, `out/` 생성

- [ ] **Step 3: 빌드 산출물에 캐시 변경이 섞이지 않았는지 확인**

```bash
git status --short
```

Expected: 커밋되지 않은 변경 없음. `.cache/github-contrib.json` 이 modified 로 뜨면 빌드 중 토큰으로 갱신된 것이니 내용을 확인하고 의도적으로 커밋하거나 `git checkout --` 로 되돌린다.

- [ ] **Step 4: 푸시 및 PR 생성**

리뷰어는 지정하지 않는다 (사용자가 직접 지정).

```bash
git push -u origin fix/github-contrib-and-social-links

gh pr create --title "fix: GitHub 컨트리뷰션 그래프 복구 + 소셜 링크 구조 개편" --body "$(cat <<'EOF'
## Summary

- 프로덕션에서 컨트리뷰션 그래프 26주가 전부 `data-l="0"` 으로 렌더되던 문제 수정
- 원인: 빌드 시점 GitHub fetch 실패 + `.cache/github-contrib.json` 시드 부재 → `buildFallback()` 의 전부-0 더미가 정적 HTML 에 박힘
- `author.social` 을 배열 단일 원천으로 전환하고 `instagram/frank.coffeetime` 추가

## 변경 내용

**GitHub 컨트리뷰션**
- `.cache/github-contrib.json` 시드 커밋 (`.cache/writing-*.json` 과 동일 패턴)
- `isFallbackContrib()` 추가 — `buildFallback()` 이 심는 epoch `fetchedAt` 을 센티넬로 판별
- 폴백일 때 `RightRailContent` 는 점선 박스 + `data unavailable`, `StatsRow` 는 값 `—` + sparkline 생략
- `CommitGraph` 는 변경 없음

**소셜 링크**
- `author.social` 객체 → `{id, label, url}` 배열 + 파생 `socialUrl` 맵
- 사이드바 · JSON-LD `sameAs` · 커맨드 팔레트가 모두 배열에서 파생 (링크 추가 비용: 5파일 → 1파일)
- 계정별 aria 키 3개 제거 — 보이는 텍스트를 접근 가능한 이름으로 사용

## Test plan

- [ ] `npm run check`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm test` — 신규 `github-contrib.spec.ts`, `social-links.spec.ts` 포함 전체 통과
- [ ] 수동: 시드 캐시를 임시로 치웠을 때 `data unavailable` / `데이터 없음` 표시
- [ ] 배포 후: `curl -s https://advenoh.pe.kr/ | grep -o 'data-l="[0-4]"' | sort | uniq -c` 에 `1`~`4` 등장

## 관련 문서

- 설계: `docs/superpowers/specs/2026-08-01-github-contrib-and-social-links-design.md`
- 계획: `docs/superpowers/plans/2026-08-01-github-contrib-and-social-links.md`

## 운영 참고

- Netlify 는 환경변수 변경만으로 재빌드하지 않는다 — Deploys → Trigger deploy 필요
- 새 PAT 은 `read:user` 스코프만으로 충분하다 (기존 토큰은 `admin:org` 등 과도한 권한 보유)
EOF
)"
```

- [ ] **Step 5: 배포 후 프로덕션 검증**

머지 및 Netlify 배포 완료 후 실행한다.

```bash
curl -s https://advenoh.pe.kr/ | grep -o 'data-l="[0-4]"' | sort | uniq -c
```

Expected: `data-l="1"`~`"4"` 가 등장. 전부 `"0"` 이면 여전히 폴백 경로이므로 Netlify 배포 로그에서 `cache:WARN` 을 검색해 실제 실패 사유를 확인한다.

---

## 자체 점검 결과

**스펙 커버리지**

| 스펙 항목 | 담당 태스크 |
|---|---|
| 토큰 재발급 / Netlify 갱신 | 사용자가 사전 완료 (코드 변경 없음) |
| 폴백 감지 헬퍼 | Task 3 Step 1 |
| UI 분기 — RightRailContent | Task 4 Step 1-2 |
| UI 분기 — StatsRow | Task 4 Step 3-4 |
| `commits.unavailable` i18n | Task 3 Step 2-3 |
| 시드 캐시 커밋 | Task 2 |
| `social` 배열 전환 + `socialUrl` | Task 6 Step 1-2 |
| 소비처 3곳 | Task 6 Step 3-5 |
| aria 키 3개 삭제 | Task 6 Step 6 |
| `frank.coffeetime` 추가 | Task 6 Step 1 |
| 검증 계획 | Task 7 |
| PR 1개 구성 | Task 7 Step 4 |

**타입 일관성 확인**
- `isFallbackContrib(c: GithubContrib): boolean` — Task 3 에서 정의, Task 4 의 두 컴포넌트에서 동일 시그니처로 사용
- `socialUrl: Record<SocialId, string>` — Task 6 Step 2 에서 정의, Step 5 에서 `socialUrl.github` 로 사용
- `social` 항목 형태 `{id, label, url}` — Task 6 Step 1 정의, Step 3 에서 `{label, url}` 구조 분해, Step 4 에서 `s.url` 접근으로 일치

**알려진 제약**
- Task 2 는 사람의 PAT 주입이 필요해 에이전트 단독 완료 불가
- 폴백 UI 는 환경 의존적이라 e2e 로 결정적 검증 불가 — Task 4 Step 7 의 수동 절차로 대체
