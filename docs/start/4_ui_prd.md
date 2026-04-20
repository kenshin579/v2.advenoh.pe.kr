# UI PRD #4 — Project Detail Modal을 Profile v2 스타일로 정렬

## 1. 배경

`v2.advenoh.pe.kr` 사이트는 "Profile v2"라 불리는 IDE/터미널 스타일의 톤앤매너를 쓴다(`Hero`, `TitleBar`, `StatsRow`, `ProjectCardV2`, `ProjectGrid` 등). 그런데 프로젝트 카드를 클릭하면 열리는 **프로젝트 개별 Detail 창**(`components/profile/ProjectModal.tsx`)은 이 톤을 따르지 않고, 일반적인 shadcn 느낌의 라운드 카드 모달로 남아 있어 사이트 흐름 속에서 이질감을 준다.

본 문서는:
- 현재 `ProjectModal`과 Profile v2 스타일(주로 `Hero` / `ProjectCardV2` / `TitleBar` / `ProjectGrid`)의 차이를 **비교표**로 정리하고,
- 이를 Profile v2 스타일에 맞추기 위한 **작업 항목**을 도출한다.

## 2. 스코프

**대상 파일**
- `v2.advenoh.pe.kr/components/profile/ProjectModal.tsx` (주 변경)
- `v2.advenoh.pe.kr/app/globals.css` (필요 시 애니메이션 / 프로필 토큰 추가)

**참고(변경 없음)**
- `components/profile/Hero.tsx`
- `components/profile/ProjectCardV2.tsx`
- `components/profile/ProjectGrid.tsx`
- `components/profile/TitleBar.tsx`
- `components/profile/StatsRow.tsx`

**비변경**
- `lib/portfolio.ts`의 `PortfolioItem` 스키마는 그대로 사용. 신규 필드 추가는 필요 없음.

## 3. 현재 모달 구조 요약

`ProjectModal.tsx`의 현재 모습:

```
[Radix Dialog.Content rounded-lg border bg-profile-bg-2]
 ├─ cover image (aspect-16/9)
 ├─ header
 │   ├─ slug.ext (font-mono xs accent)
 │   ├─ title    (font-display text-2xl)
 │   └─ [X] close
 ├─ dek (text-sm)
 ├─ meta dl (4-col, status/year/role/url)
 ├─ overview box (rounded bg-profile-bg-3)
 ├─ stack tags (rounded bg-profile-bg-3 mono 11px)
 └─ footer
     ├─ [‹ prev] [next ›]
     └─ [Open live ↗]
```

## 4. Profile v2 스타일 vs 현재 모달 — 비교표

| # | 요소 | 현재 `ProjectModal` | Profile v2 스타일 (기준 컴포넌트) | 조치 |
|---|------|---------------------|-------------------------------|------|
| 1 | **섹션 헤더** | 없음. 표지 이미지 바로 아래 제목 | `// projects` + `#02` + `border-t` 대시 라인 + 키 힌트 (`ProjectGrid`) | `// project.detail` 헤더 + `#NN` + 라인 추가 |
| 2 | **컨테이너 Chrome** | 단순 rounded card | macOS 트래픽 라이트 3개 점 + 브레드크럼 path (`TitleBar`) | 모달 상단에 미니 TitleBar(트래픽 라이트 + `~/projects/<slug>` path) 추가 |
| 3 | **배경 오버레이** | `bg-black/70 backdrop-blur` 만 | 바디 전역에 `NoiseOverlay` 노이즈 레이어 존재 | 모달 오버레이에도 동일한 noise-subtle 텍스처 한 겹 얹기 (선택) |
| 4 | **Slug 타이틀 표기** | `slug.ext` mono-xs + `Title` display-2xl 분리 2행 | Hero `// frank oh;` 패턴 — muted `//`·`;`, accent 키워드, display 대형 | `// <slug><span.accent>.ext</span>;` 한 줄 + 제목은 서브 라인 처리 |
| 5 | **타이틀 하위 라인** | dek 한 줄 `text-sm text-profile-fg-2` | Hero는 `<strong>headline</strong> — body` 패턴 | 제목 아래 `<strong>title</strong> — dek` 동일 패턴 적용 |
| 6 | **메타 테이블 그리드** | `grid-cols-2 sm:grid-cols-4` dt/dd (lowercase, mono xs) | Hero `<dl>` `grid-cols-[120px_1fr]` + 키는 `·_` 프리픽스 + 소문자 tracking | 모달도 `[120px_1fr]` 단일 열 `<dl>` + `·_` 프리픽스로 통일 |
| 7 | **live 상태 표시** | `status` 값을 단순 텍스트로 dt/dd에 표기 | 초록 점(`bg-profile-green` + glow) + uppercase `live` 라벨 (`ProjectCardV2`) | 헤더 우측에 초록 점 뱃지로 이동, dl에서는 제거 |
| 8 | **URL 표시** | `<dt>url</dt><dd>전체 URL truncate</dd>` | `→ host` + `year · role` 푸터 패턴 (`ProjectCardV2`) | dl에 `host`만 축약 표기 + 원본 URL은 CTA 버튼 href로만 |
| 9 | **Overview 박스** | `rounded border bg-profile-bg-3 p-4` 일반 박스 | 터미널/IDE 톤 — 코드 블록 프롬프트 프리픽스 (`$ cat overview.md`) 또는 `// overview` 서브헤더 + plain 본문 | 서브헤더 `// overview` + 세로 `border-l-2 border-profile-line-2 pl-4` 인용 스타일로 변경 |
| 10 | **Stack 태그 스타일** | `rounded border bg-profile-bg-3 font-mono text-[11px] text-profile-fg-2` (배경 채움) | `rounded-sm border-profile-line-2 px-[7px] py-0.5 font-mono text-[10px] text-profile-muted` (보더만) | 카드와 동일 토큰으로 축소, 배경 제거 |
| 11 | **Stack 섹션 헤더** | 없음 | `ProjectGrid`처럼 서브 섹션도 `// stack` 라벨 유지 가능 | `// stack` mono-uppercase 서브헤더 추가 |
| 12 | **Footer 구분선** | `border-t border-profile-line-2` | 카드 footer는 `border-dashed border-profile-line` 점선 | 점선(`border-dashed`)으로 맞추기 |
| 13 | **prev/next 버튼** | `ChevronLeft/Right` 아이콘 + "prev"/"next" 텍스트 | `j/k` 키 네비 사용 중 (`ProjectGrid` / `useKeyboardNav`) — kbd 힌트 노출 | `[← prev]` `[next →]` 텍스트 + `<kbd>j</kbd><kbd>k</kbd>` 힌트 병기 |
| 14 | **CTA "Open live"** | `bg-profile-accent-soft border-accent px-3 py-1` + `ExternalLink` | 카드의 `↵ open` kbd, 그리고 accent soft 배경 — 기본 톤은 유사함 | 아이콘을 `↗`로 바꾸고, `↵` kbd 힌트를 보조 텍스트로 병기(Enter로 열기) |
| 15 | **Close(X) 버튼** | `<X size={16}/>` 아이콘만 | Hero/TitleBar류는 kbd 힌트(`Esc`) 병기 선호 | `× close` + `<kbd>esc</kbd>` 힌트 |
| 16 | **이미지 테두리** | 전면 부착(바깥 라운드만) | `ProjectCardV2`는 `rounded border border-profile-line bg-profile-bg-3` | 이미지 블록도 카드와 동일한 border/radius 래퍼로 통일 |
| 17 | **여백/리듬(spacing)** | 하드코딩 `p-6 space-y-4` | 섹션=`var(--profile-space-section)`, 카드=`var(--profile-space-card)` 토큰 사용 | 모달 내부 수직 간격을 `var(--profile-space-card)`로 교체 |
| 18 | **타이포 패밀리** | 타이틀 `font-display`, 나머지 sans | Profile v2는 라벨·키·푸터 대부분 `font-mono` | 메타·푸터·서브헤더·kbd를 `font-mono`로 일괄 정리 |
| 19 | **라벨 프리픽스** | dt에 프리픽스 없음 | `// ` / `· ` / `▸ ` / `→ ` 같은 ASCII 프리픽스가 Profile v2 언어 | 섹션/서브헤더 `//`, 메타 키 `·`, host `→` 도입 |
| 20 | **애니메이션/캐럿** | 특별한 등장 애니메이션 없음 | `profile-caret-blink`, `profile-pulse` 등 전용 키프레임 존재 | 타이틀 뒤 blinking caret `▍` 추가(선택) |
| 21 | **키보드 네비** | `ArrowLeft/Right` 만 지원 | 사이트 전반 `j/k`/`Enter`/`Esc`/`/` 규약 | `j/k` 또는 `←/→` 모두 지원, `Esc` 닫기(Radix 기본) 유지 |
| 22 | **접근성** | `aria-describedby={undefined}` 로 비워둠 | — | dek/overview에 `id`를 달아 `aria-describedby`로 연결 |
| 23 | **모바일 레이아웃** | `w-[min(92vw,720px)]`, 4-col 메타가 2-col로 축소만 | 카드가 단일 컬럼 fallback 패턴 사용 | 모바일에서 메타 `[120px_1fr]`을 단일 스택으로, footer 버튼 그룹 세로화 |

## 5. 작업 항목 (체크리스트)

### 5.1 `ProjectModal.tsx` 리팩토링

- [ ] **A. 모달 Chrome 추가**
  - 모달 상단 높이 36~40px의 미니 타이틀바 섹션 추가
  - 왼쪽: 3개의 traffic-light 점 (`#ff5f57`/`#febc2e`/`#28c840`) — `TitleBar.tsx` 재사용 가능 여부 검토, 안 되면 인라인 복제
  - 중앙/좌: breadcrumb `frank@seoul:~/projects/<slug>` mono text
  - 우: `[esc]` kbd 힌트 + Close(`×`)
- [ ] **B. 섹션 헤더(`// project.detail #NN`) 추가**
  - 타이틀바 하단에 `//` 프리픽스 mono-uppercase 헤더 한 줄
  - 우측에 `N/total` (예: `2/5 items`) 뱃지 + `j`/`k` kbd 힌트
  - 아래 `border-t border-profile-line` 라인
- [ ] **C. 히어로 타이틀 블록 재구성**
  - 현재의 "slug.ext / Title" 2행 구조를 `// slug<span.accent>.ext</span>;` 한 줄 mono + 그 아래 `<strong>Title</strong> — dek` display 문단으로 교체
  - 선택적으로 slug 뒤에 blinking caret(`profile-caret-blink` keyframe) 추가
- [ ] **D. 메타 `<dl>` 재배치**
  - `grid-cols-[120px_1fr]` 단일 열 형태로 변경 (Hero와 동일)
  - 키: `·_` 프리픽스 + lowercase + `text-profile-muted`
  - 값: `text-profile-fg` mono-13px
  - 표시 키 후보: `role` / `year` / `stack(요약)` / `host` (stack 길면 아래 태그 리스트 유지)
- [ ] **E. live 상태 이동**
  - `status`가 `live`이면 히어로 우측에 초록 점 + uppercase `live` 라벨로 표시 (`ProjectCardV2` 패턴 동일)
  - dl에서 `status` 제거
- [ ] **F. URL 표시 간소화**
  - dl에서 `url` 전체를 표기하지 않고 `host`만 `→ example.com` 포맷으로 노출
  - 풀 URL은 `Open live ↗` CTA의 href로만 유지
- [ ] **G. Overview 블록 스타일 변경**
  - `rounded border bg-profile-bg-3 p-4` 박스 → `// overview` mono 서브헤더 + `border-l-2 border-profile-line-2 pl-4` 인용 블록으로 변경
  - 본문 폰트/행간(`text-sm leading-relaxed text-profile-fg-2`)은 유지, `whitespace-pre-line` 유지
- [ ] **H. Stack 태그 스타일 통일**
  - 사이즈/토큰을 `ProjectCardV2`와 동일하게: `rounded-sm border border-profile-line-2 px-[7px] py-0.5 font-mono text-[10px] text-profile-muted`
  - 배경(`bg-profile-bg-3`) 제거
  - 섹션 위에 `// stack` mono-uppercase 서브헤더 추가
- [ ] **I. Footer 구분선 점선화**
  - `border-t` → `border-t border-dashed border-profile-line`
- [ ] **J. prev/next 버튼 문구/힌트 개편**
  - 텍스트 `[← prev]` / `[next →]` + `<kbd>j</kbd>`/`<kbd>k</kbd>` 힌트 병기
  - 아이콘은 유지하되 mono 텍스트가 주인공이 되도록 순서/크기 조정
- [ ] **K. CTA `Open live` 개편**
  - 아이콘 `ExternalLink` → 텍스트 `↗`
  - 오른쪽 끝에 `<kbd>↵</kbd>` 힌트
  - 클래스는 기존 `border-profile-accent bg-profile-accent-soft` 유지
- [ ] **L. 이미지 블록 래퍼 정리**
  - `rounded border border-profile-line bg-profile-bg-3` 래퍼로 감싸서 카드와 일관성
  - aspect는 `16/9` 유지
- [ ] **M. Spacing 토큰화**
  - `space-y-4` → `space-y-[var(--profile-space-card)]`
  - 상위 컨테이너 padding도 `p-[var(--profile-space-card)]` 또는 섹션별 분리
- [ ] **N. 접근성 정리**
  - dek와 overview에 `id` 부여, `Dialog.Content`의 `aria-describedby`에 overview id 연결
  - footer 버튼에 `aria-keyshortcuts="j"` / `aria-keyshortcuts="k"` 추가
- [ ] **O. 키보드 네비 확장**
  - 기존 `ArrowLeft/Right` 외에 `j`/`k` 추가 (`useKeyboardNav`와 일관)
  - 이벤트 우선순위: `input` focus 상태에서는 무시(Radix Dialog 기본)

### 5.2 `globals.css` (변경 시)

- [ ] 기존 `profile-caret-blink` 키프레임은 존재하니 그대로 사용 (추가 없음)
- [ ] 모달 전용 클래스가 필요하면 `.project-modal__*` 네임스페이스로 최소 한정적 추가
- [ ] 변경 최소화, 가능한 한 Tailwind 유틸로 해결

### 5.3 회귀 테스트 항목

- [ ] 카드 클릭 → 모달 오픈 (기존 `profile:open-project` 이벤트 계약 유지)
- [ ] ArrowLeft/ArrowRight, j/k로 prev/next 동작
- [ ] Esc로 닫힘 (Radix 기본)
- [ ] 커버 이미지 없는 항목(대비용 수동 테스트) 렌더 깨짐 없음
- [ ] `status`/`role`/`year`/`stack`/`overview` 필드 누락 항목에서 각 섹션이 조건부 렌더링 되는지
- [ ] 모바일 375px / 태블릿 768px / 데스크탑 1100px에서 레이아웃 확인
- [ ] `data-accent="violet|red|green|orange|amber"` 5종 전환 시 색이 모두 반영되는지
- [ ] `data-density="compact|comfortable"` 시 간격 토큰이 반영되는지
- [ ] Radix 포커스 트랩/스크롤락 여전히 동작
- [ ] WCAG AA — 본문/라벨 대비비 통과 (변경된 `profile-muted` 조합 확인)

## 6. 비스코프 (이번 작업에서 하지 않음)

- `PortfolioItem` 스키마 확장 (신규 필드 추가 금지)
- `ProjectCardV2` / `ProjectGrid` / `Hero` 등 주변 컴포넌트 수정
- 라우팅 기반 detail 페이지(`/projects/[slug]`) 신설 — 지금은 Modal 유지
- 애니메이션 성능 개선 / 새로운 상호작용 추가

## 7. 수용 기준 (Acceptance Criteria)

1. 모달을 열었을 때 `Hero`·`ProjectCardV2`·`TitleBar`와 같은 톤(프롬프트 프리픽스, mono 라벨, 점선 푸터, kbd 힌트)이 시각적으로 일관되게 보인다.
2. 섹션 헤더(`// project.detail`), 메타 `[120px_1fr]` dl, `// overview` 인용 블록, 카드 동일 톤의 스택 태그, `→ host` / `↗ Open live` / `[esc]` kbd가 모두 존재한다.
3. 기존 키보드·이벤트 계약(`profile:open-project`, Esc 닫기, Arrow/j/k 네비)이 깨지지 않는다.
4. `status`/`role`/`year`/`overview` 필드가 누락된 레거시 포트폴리오 항목에서도 섹션이 조건부 렌더되어 깨짐 없이 표시된다.
5. 모바일/태블릿/데스크탑 3 뷰포트에서 Overflow/Cut-off 없이 내용이 읽힌다.

## 8. 참고 파일

- `components/profile/ProjectModal.tsx` — 주 변경 대상
- `components/profile/Hero.tsx` — 히어로 타이틀 + `<dl>` 패턴 참고
- `components/profile/ProjectCardV2.tsx` — 스택 태그 / `→ host` / kbd 패턴 참고
- `components/profile/ProjectGrid.tsx` — 섹션 헤더 패턴 참고
- `components/profile/TitleBar.tsx` — 트래픽 라이트 + breadcrumb 패턴 참고
- `app/globals.css` — `--profile-*` 토큰 / `profile-caret-blink` 등 애니메이션
