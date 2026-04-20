# UI Implementation #4 — Project Detail Modal을 Profile v2 스타일로 정렬

> 관련 PRD: `4_ui_prd.md`
> TODO: `4_ui_todo.md`

## 1. 개요

`ProjectModal.tsx` 한 파일의 JSX 구조와 Tailwind 클래스를 Profile v2 톤에 맞게 재조립한다. 로직(이벤트 계약·상태 관리·키보드 네비)과 데이터 계약(`PortfolioItem`)은 그대로 유지한다.

## 2. 변경 범위

| 파일 | 변경 종류 | 비고 |
|------|-----------|------|
| `components/profile/ProjectModal.tsx` | 주 변경 (JSX/클래스 재작성 + 키바인딩 추가) | 단일 컴포넌트 내에서 완결 |
| `app/globals.css` | 조건부 변경 | Tailwind 유틸로 해결 가능하면 미변경 |
| 그 외 | 변경 없음 | Hero/ProjectCardV2/TitleBar는 패턴 참조용 |

## 3. 컴포넌트 구조 (변경 후)

```
<Dialog.Root>
  <Dialog.Overlay />                            ← bg-black/70 backdrop-blur (기존 유지)
  <Dialog.Content>                              ← rounded-lg border bg-profile-bg-2 w-[min(92vw,720px)]
    ├─ <ModalChrome />                          ← [신규] 38px 고정 높이 미니 TitleBar
    │    ├─ traffic-light dots (3)
    │    ├─ breadcrumb: frank@seoul:~/projects/<slug>
    │    └─ [esc] kbd + Dialog.Close (×)
    ├─ <SectionHeader />                        ← [신규] // project.detail + #NN + · N/total + j/k kbd + border-t
    ├─ <CoverImage />                           ← [수정] rounded border wrapper 추가
    ├─ <Hero />                                 ← [수정] // slug.ext; 한 줄 + Title + dek + live 뱃지
    ├─ <MetaList />                             ← [수정] <dl grid-cols-[120px_1fr]> · 프리픽스
    ├─ <OverviewQuote />                        ← [수정] // overview 서브헤더 + border-l-2 인용 블록
    ├─ <StackList />                            ← [수정] // stack 서브헤더 + 10px 보더만 태그
    └─ <Footer />                               ← [수정] border-dashed + prev/next kbd + Open live ↗
  </Dialog.Content>
</Dialog.Root>
```

각 블록은 JSX 인라인 표현으로 구현(파일 분리 없음). 명명은 마커 주석만 추가.

## 4. 핵심 구현 지침

### 4.1 ModalChrome (미니 TitleBar)

- `TitleBar.tsx`는 `status: StatusSnapshot`에 강결합되어 있어 **재사용하지 않고 인라인 복제**한다.
- 구조:
  - 외곽: `flex h-[38px] items-center gap-3 border-b border-profile-line-2 bg-profile-bg-3/95 px-4 font-mono text-xs text-profile-fg-2 backdrop-blur`
  - 좌: 3개 점 (`#ff5f57` / `#febc2e` / `#28c840`) — `h-3 w-3 rounded-full`
  - 중앙: breadcrumb 텍스트 `frank@seoul:~/projects/<slug>` (`text-profile-muted truncate`)
  - 우: `<kbd>esc</kbd>` + `Dialog.Close` (`×`)
- `Dialog.Close`는 Radix 컴포넌트 그대로 사용(기본 Esc 닫기 보존).

### 4.2 SectionHeader

- `ProjectGrid` 패턴 복제:
  - `h2.mono uppercase tracking-[0.14em] text-profile-muted before:content-['//_']`
  - 본문: `project.detail`
  - 우측에 `#04`(고정) + ` · N/total items` + `<kbd>j</kbd><kbd>k</kbd>` to navigate
  - 아래 `border-t border-profile-line`
- `N`은 `openIdx + 1`, `total`은 `items.length`.

### 4.3 Hero 블록

- `// <slug><span.text-profile-accent>.ext</span>;` 한 줄 — `font-mono text-sm text-profile-muted`
- 타이틀: `<strong class="font-display text-3xl font-medium leading-tight tracking-[-0.02em] text-profile-fg">{title}</strong>` + ` — ` + dek
- live 뱃지(우측):
  ```jsx
  isLive && <span class="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-profile-muted">
    <i class="h-1.5 w-1.5 rounded-full bg-profile-green" style={{ boxShadow: '0 0 4px var(--profile-green)' }} />
    {status}
  </span>
  ```
- caret 깜빡임(선택): slug 뒤 `<span class="text-profile-accent" style={{ animation: 'profile-caret-blink 1s infinite' }}>▍</span>`

### 4.4 MetaList (`<dl>`)

- `grid grid-cols-[120px_1fr] gap-x-5 gap-y-[7px] font-mono text-[13px]`
- 각 엔트리 `<div class="contents">`:
  - `<dt class="text-profile-muted lowercase tracking-[0.02em] before:content-['·_']">role</dt>`
  - `<dd class="text-profile-fg-2">{value}</dd>`
- 키 순서: `role` → `year` → `stack`(요약 `A · B · C`, 3개 초과면 `+N`) → `host`(→ prefix)
- `status`는 Hero 우측 뱃지로 이동했으므로 dl에서 제외.
- 모바일(`sm` 미만): `grid-cols-1` 로 키/값을 세로 스택으로 전환 (`sm:grid-cols-[120px_1fr]`).

### 4.5 OverviewQuote

- `<h3 class="font-mono text-[11px] uppercase tracking-[0.14em] text-profile-muted-2 before:content-['//_']">overview</h3>`
- 본문: `<div class="border-l-2 border-profile-line-2 pl-4 text-sm leading-relaxed text-profile-fg-2 whitespace-pre-line">{overview}</div>`
- 접근성: 이 `<div>`에 `id="modal-overview-<slug>"` 부여 → `Dialog.Content`의 `aria-describedby`에 전달.

### 4.6 StackList

- 서브헤더: `// stack` (MetaList의 overview 패턴과 동일)
- `<ul class="flex flex-wrap gap-1.5 font-mono text-[10px] text-profile-muted">`
- `<li class="rounded-sm border border-profile-line-2 px-[7px] py-0.5">` (배경 없음)

### 4.7 Footer

- 구분선: `border-t border-dashed border-profile-line pt-4`
- 레이아웃: `flex items-center justify-between font-mono text-xs` (모바일은 `flex-col gap-3`)
- 좌측 prev/next:
  - `<button aria-keyshortcuts="k" aria-label="Previous project">[<ChevronLeft size={12}/> prev] <kbd>k</kbd></button>`
  - `<button aria-keyshortcuts="j" aria-label="Next project">[next <ChevronRight size={12}/>] <kbd>j</kbd></button>`
  - 클래스: `flex items-center gap-1 rounded border border-profile-line-2 px-2 py-1 text-profile-muted hover:border-profile-accent hover:text-profile-accent`
- 우측 CTA:
  - `<a href={site} target="_blank" rel="noreferrer noopener">Open live <span class="ml-1">↗</span> <kbd>↵</kbd></a>`
  - 클래스: `flex items-center gap-1 rounded border border-profile-accent bg-profile-accent-soft px-3 py-1 text-profile-accent`

### 4.8 CoverImage

- 외곽: `<div class="relative aspect-[16/9] w-full overflow-hidden rounded border border-profile-line bg-profile-bg-3">`
- Next.js `<Image fill unoptimized class="object-cover" sizes="(min-width: 768px) 720px, 92vw" />`
- `coverSrc`가 없으면 블록 자체를 렌더하지 않음 (기존 동작 유지).

### 4.9 Spacing 토큰화

- `Dialog.Content` 내부 래퍼: `p-[var(--profile-space-card)] space-y-[var(--profile-space-card)]`
- 헤더(Chrome + SectionHeader)는 padding 분리해 타이틀바 외곽은 pad 없이 bleed.

## 5. 데이터·이벤트 계약 (불변)

- 이벤트: `profile:open-project` (detail: `slug`)
- 닫기: `Dialog.onOpenChange`에서 `setOpenIdx(null)`
- 키보드:
  - `ArrowLeft` / `k` → prev
  - `ArrowRight` / `j` → next
  - `Esc` → Radix 기본 close
  - 입력 요소에 포커스된 경우 무시 (Radix Dialog가 포커스 트랩하므로 자연히 보장)
- 내비 wrap-around 동작 유지 (`(i + len) % len`).

## 6. 키바인딩 구현 수정

현재:
```ts
if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
else if (e.key === 'ArrowRight') { e.preventDefault(); next() }
```

변경:
```ts
if (e.key === 'ArrowLeft' || e.key === 'k') { e.preventDefault(); prev() }
else if (e.key === 'ArrowRight' || e.key === 'j') { e.preventDefault(); next() }
```

## 7. 접근성

- `Dialog.Content`
  - `aria-describedby="modal-overview-<slug>"` (overview 없으면 dek id로 폴백)
  - `aria-labelledby`는 Radix `Dialog.Title`이 자동 처리 (유지)
- dek: `id="modal-dek-<slug>"`
- overview 블록: `id="modal-overview-<slug>"`
- prev/next 버튼: `aria-keyshortcuts="k"` / `aria-keyshortcuts="j"` 명시
- kbd 힌트는 `<kbd>` 엘리먼트로 렌더 (스크린리더 자연 읽기 가능)

## 8. 반응형 기준

| 뷰포트 | 모달 너비 | Meta 그리드 | Footer |
|--------|-----------|-------------|--------|
| `<640px` | `w-[92vw]` | 단일 컬럼(세로 스택) | 세로 스택, CTA full-width |
| `640~768px` | `w-[min(92vw,600px)]` | `[120px_1fr]` | 가로 |
| `≥768px` | `w-[min(92vw,720px)]` | `[120px_1fr]` | 가로 |

## 9. Do Not

- `lib/portfolio.ts` 스키마/타입 추가 금지
- 새 컴포넌트 파일 분리 금지 (단일 파일 완결)
- `TitleBar.tsx` / `Hero.tsx` / `ProjectCardV2.tsx` 수정 금지
- 라우팅 detail 페이지(`/projects/[slug]`) 신설 금지
- CSS-in-JS / 별도 모듈 CSS 도입 금지 — Tailwind 유틸만 사용
