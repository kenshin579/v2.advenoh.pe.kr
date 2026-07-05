# 사이드바 STATUS top3 + status 링크 + TWEAKS 제거 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** v2.advenoh.pe.kr 사이드바 STATUS 섹션을 상위 3개 + `···`로 축약하고 블록 전체를 새 탭 status 페이지 링크로 만들며, TWEAKS 기능을 완전히 제거한다.

**Architecture:** 표시 로직은 `SidebarContent.tsx` 한 곳에 있어 데스크톱(`Sidebar`)·모바일(`MobileSidebarDrawer`)에 동시 반영된다. TWEAKS 제거는 컴포넌트/훅 삭제 + globals.css 미사용 셀렉터 정리 + i18n(en/ko) 키 제거로 구성된다. `:root` 기본값(violet / comfortable / noise 0.35)이 남아 외관과 `NoiseOverlay`는 그대로 유지된다.

**Tech Stack:** Next.js 16 (App Router, static export), React 19, Tailwind CSS v3, TypeScript, Playwright (e2e), i18n `Dict = typeof en`.

---

## File Structure

- `components/profile/SidebarContent.tsx` — 수정: STATUS 블록을 `<a>` 링크로 감싸고 slice(0,3) + `···` + hover/`↗` 강조
- `lib/i18n/en.ts` — 수정: `a11y.statusPage` 추가(Task 1), `tweaks{}`·`a11y.openTweaks/closeTweaks/noiseIntensity` 제거(Task 4)
- `lib/i18n/ko.ts` — 수정: en.ts와 동일하게 동기화
- `components/profile/ProfileShell.tsx` — 수정: `TweaksPanel` import·렌더 제거
- `components/profile/TweaksPanel.tsx` — 삭제
- `hooks/useTweaks.ts` — 삭제
- `app/globals.css` — 수정: `[data-accent="*"]`·`[data-density="*"]` 미사용 셀렉터 제거
- `tests/status-link.spec.ts` — 생성: STATUS 링크 e2e 검증

---

### Task 1: STATUS 섹션 top3 + status 링크

**Files:**
- Modify: `lib/i18n/en.ts` (a11y 블록에 `statusPage` 키 추가)
- Modify: `lib/i18n/ko.ts` (동일 키 추가)
- Modify: `components/profile/SidebarContent.tsx:83-108`
- Test: `tests/status-link.spec.ts` (생성)

- [ ] **Step 1: 실패하는 e2e 테스트 작성**

`tests/status-link.spec.ts` 생성:

```ts
import { test, expect } from '@playwright/test'

test('사이드바 STATUS 블록은 새 탭으로 status 페이지로 연결된다', async ({ page }) => {
  await page.goto('/')
  const statusLink = page.getByRole('link', { name: 'Open system status page' }).first()
  await expect(statusLink).toHaveAttribute('href', 'https://status.advenoh.pe.kr/')
  await expect(statusLink).toHaveAttribute('target', '_blank')
  await expect(statusLink).toHaveAttribute('rel', /noreferrer/)
})

test('사이드바 STATUS 목록은 최대 3개까지만 노출한다', async ({ page }) => {
  await page.goto('/')
  const statusLink = page.getByRole('link', { name: 'Open system status page' }).first()
  // 서비스 항목 li 중 dot(rounded-full span)을 가진 것만 카운트
  const serviceDots = statusLink.locator('li span.rounded-full')
  expect(await serviceDots.count()).toBeLessThanOrEqual(3)
})
```

- [ ] **Step 2: 테스트 실행하여 실패 확인**

Run: `npx playwright test tests/status-link.spec.ts --project=chromium`
Expected: FAIL — `getByRole('link', { name: 'Open system status page' })` 를 찾지 못함 (아직 링크/aria-label 없음)

- [ ] **Step 3: i18n에 `statusPage` a11y 키 추가**

`lib/i18n/en.ts` — `a11y` 블록의 `navSections: 'Sections',` 아래(line 19 다음)에 추가:

```ts
    navSections: 'Sections',
    statusPage: 'Open system status page',
    noiseIntensity: 'Noise intensity',
```

`lib/i18n/ko.ts` — `a11y` 블록의 `navSections: '섹션',` 아래에 추가:

```ts
    navSections: '섹션',
    statusPage: '시스템 상태 페이지 열기',
    noiseIntensity: '노이즈 강도',
```

- [ ] **Step 4: SidebarContent STATUS 블록을 링크로 교체**

`components/profile/SidebarContent.tsx` 의 STATUS 블록(현재 line 83-108, `<div>...{t.sidebar.status}...</div>`)을 아래로 교체:

```tsx
      <a
        href={siteConfig.external.status}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={t.a11y.statusPage}
        onClick={() => onNavigate?.()}
        className="group -mx-2 block rounded px-2 py-1 transition-colors hover:bg-profile-accent-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-profile-accent"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-profile-muted-2 group-hover:text-profile-accent">
            {t.sidebar.status} · {status.summary.up}/{status.summary.total}
          </span>
          <span className="text-[10px] text-profile-muted-2 group-hover:text-profile-accent">↗</span>
        </div>
        <ul className="flex flex-col gap-1">
          {status.services.slice(0, 3).map(svc => (
            <li key={svc.id} className="flex items-center gap-2 px-2 py-0.5">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    svc.currentStatus === 'OK'
                      ? 'var(--profile-green)'
                      : svc.currentStatus === 'WARN'
                      ? 'var(--profile-yellow)'
                      : 'var(--profile-red)',
                }}
              />
              <span className="truncate text-profile-fg-2">{svc.name}</span>
            </li>
          ))}
          {status.services.length === 0 && (
            <li className="px-2 py-0.5 text-profile-muted-2">{t.sidebar.offline}</li>
          )}
          {status.services.length > 3 && (
            <li className="px-2 py-0.5 tracking-[0.15em] text-profile-muted-2 group-hover:text-profile-accent">
              ···
            </li>
          )}
        </ul>
      </a>
```

참고: `siteConfig`는 파일 상단에서 이미 `import { siteConfig } from '@/lib/site-config'` 로 import되어 있으므로 추가 import 불필요.

- [ ] **Step 5: 타입 검사**

Run: `npm run check`
Expected: 에러 없음 (ko.ts가 en.ts와 동일 shape이라 Dict 일치)

- [ ] **Step 6: 테스트 실행하여 통과 확인**

Run: `npx playwright test tests/status-link.spec.ts --project=chromium`
Expected: PASS (2 tests)

- [ ] **Step 7: 커밋**

```bash
git add lib/i18n/en.ts lib/i18n/ko.ts components/profile/SidebarContent.tsx tests/status-link.spec.ts
git commit -m "feat: 사이드바 STATUS top3 축약 + status 페이지 새 탭 링크"
```

---

### Task 2: ProfileShell에서 TweaksPanel 제거 + 파일 삭제

**Files:**
- Modify: `components/profile/ProfileShell.tsx:25,104`
- Delete: `components/profile/TweaksPanel.tsx`
- Delete: `hooks/useTweaks.ts`

- [ ] **Step 1: ProfileShell import 제거**

`components/profile/ProfileShell.tsx` line 25 삭제:

```tsx
import { TweaksPanel } from './TweaksPanel'
```

- [ ] **Step 2: ProfileShell 렌더 제거**

`components/profile/ProfileShell.tsx` line 104 삭제:

```tsx
      <TweaksPanel t={t} />
```

(바로 위 `<NoiseOverlay />` 와 아래 `<CommandPalette ... />` 는 유지)

- [ ] **Step 3: 파일 삭제**

```bash
git rm components/profile/TweaksPanel.tsx hooks/useTweaks.ts
```

- [ ] **Step 4: 잔여 참조 없음 확인**

Run: `grep -rn "TweaksPanel\|useTweaks" components hooks app lib`
Expected: 출력 없음 (매치 0건)

- [ ] **Step 5: 타입 검사**

Run: `npm run check`
Expected: 에러 없음

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "refactor: TweaksPanel 렌더 제거 및 TweaksPanel/useTweaks 파일 삭제"
```

---

### Task 3: globals.css 미사용 셀렉터 제거

**Files:**
- Modify: `app/globals.css:404-446`

- [ ] **Step 1: data-accent / data-density 셀렉터 블록 제거**

`app/globals.css` 에서 아래 두 주석 블록 전체를 삭제한다 (line 404-445 범위: `/* Accent 5종 ... */` 부터 `[data-density="compact"] { ... }` 까지). `:root` 내부의 기본값 정의(`--profile-accent`, `--profile-space-*`, `--profile-noise`)와 그 바로 아래 `/* Animations ... */` 이하는 **건드리지 않는다**.

삭제 대상(전체 제거):

```css
/* Accent 5종 (Tweaks panel로 전환) */
[data-accent="violet"] { ... }
[data-accent="red"] { ... }
[data-accent="green"] { ... }
[data-accent="orange"] { ... }
[data-accent="amber"] { ... }

/* Density 2단 */
[data-density="comfortable"] { ... }
[data-density="compact"] { ... }
```

- [ ] **Step 2: 잔여 참조 없음 확인**

Run: `grep -n "data-accent\|data-density" app/globals.css`
Expected: 출력 없음

- [ ] **Step 3: 빌드로 CSS 정상 확인**

Run: `npm run build`
Expected: 빌드 성공 (에러/경고로 인한 실패 없음)

- [ ] **Step 4: 커밋**

```bash
git add app/globals.css
git commit -m "style: 미사용 data-accent/data-density 셀렉터 제거"
```

---

### Task 4: i18n에서 tweaks 관련 키 제거

**Files:**
- Modify: `lib/i18n/en.ts` (a11y의 openTweaks/closeTweaks/noiseIntensity, tweaks 블록)
- Modify: `lib/i18n/ko.ts` (동일)

- [ ] **Step 1: en.ts에서 tweaks a11y 키 제거**

`lib/i18n/en.ts` `a11y` 블록에서 아래 두 줄 삭제:

```ts
    openTweaks: 'Open tweaks panel',
    closeTweaks: 'Close tweaks',
```

그리고 아래 줄 삭제:

```ts
    noiseIntensity: 'Noise intensity',
```

- [ ] **Step 2: en.ts에서 tweaks 블록 제거**

`lib/i18n/en.ts` 에서 아래 블록 전체 삭제:

```ts
  tweaks: {
    title: 'tweaks',
    accent: 'accent',
    density: 'density',
    comfortable: 'comfortable',
    compact: 'compact',
    noise: 'noise',
  },
```

- [ ] **Step 3: ko.ts에서 동일 키 제거**

`lib/i18n/ko.ts` `a11y` 블록에서 삭제:

```ts
    openTweaks: '설정 패널 열기',
    closeTweaks: '설정 닫기',
```

그리고 삭제:

```ts
    noiseIntensity: '노이즈 강도',
```

그리고 tweaks 블록 전체 삭제:

```ts
  tweaks: {
    title: '설정',
    accent: '강조색',
    density: '밀도',
    comfortable: '여유',
    compact: '조밀',
    noise: '노이즈',
  },
```

- [ ] **Step 4: 잔여 참조 없음 확인**

Run: `grep -rn "openTweaks\|closeTweaks\|noiseIntensity\|\.tweaks\b\|t\.tweaks" components hooks app lib`
Expected: 출력 없음

- [ ] **Step 5: 타입 검사**

Run: `npm run check`
Expected: 에러 없음 (en.ts에서 키를 지웠고 ko.ts도 동일하게 지워 Dict 일치)

- [ ] **Step 6: 커밋**

```bash
git add lib/i18n/en.ts lib/i18n/ko.ts
git commit -m "chore: 미사용 tweaks i18n 키 제거 (en/ko)"
```

---

### Task 5: 전체 검증

**Files:** (없음 — 검증 전용)

- [ ] **Step 1: 타입 검사**

Run: `npm run check`
Expected: 에러 없음

- [ ] **Step 2: 린트**

Run: `npm run lint`
Expected: 에러 없음

- [ ] **Step 3: 프로덕션 빌드 (정적 export)**

Run: `npm run build`
Expected: 빌드 성공, `out/` 생성

- [ ] **Step 4: 전체 e2e 테스트**

Run: `npx playwright test --project=chromium`
Expected: 기존 i18n/seo 테스트 + 신규 status-link 테스트 모두 PASS

- [ ] **Step 5: 수동 확인 (dev 서버)**

Run: `npm run dev` 후 http://localhost:3000
확인 항목:
- 데스크톱 사이드바 STATUS: 서비스 3개 + `···`, 블록 hover 시 보라 강조 + `↗`, 클릭 시 새 탭으로 `status.advenoh.pe.kr` 열림
- 모바일 드로어(좁은 화면)에서도 동일 동작
- 우하단 TWEAKS 버튼 사라짐, 강조색 violet 고정, 배경 노이즈 유지

---

## 실행 순서 메모

Task 1 → 2 → 3 → 4 → 5 순서. Task 1에서 `a11y.statusPage`를 추가하고, Task 4에서 `a11y`의 tweaks 키만 제거하므로 서로 충돌 없음 (같은 블록의 다른 라인).
