# 프로젝트 상세(Project Detail) 디자인 정합성 PRD

## 📋 개요

포트폴리오 사이트(`v2.advenoh.pe.kr`)의 **개별 프로젝트 카드(`.file`)**와 **프로젝트 상세 모달(`.modal`)**이 디자인 레퍼런스인 `docs/start/Profile/Profile v2.html`과 다르게 구현되어 있다. 특히 **모달 영역은 "에디터 창 패러디" 장식이 과하게 추가**되어 원본의 "README.md 스타일의 담백한 프로젝트 상세 페이지"라는 의도와 벗어난다.

본 문서는 두 구현의 차이를 구체적으로 분석하고, Profile v2 레퍼런스에 맞추기 위한 개선 방향을 정의한다.

### 목표

- Profile v2.html 레퍼런스 디자인을 **단일 진실(single source of truth)** 로 확정한다.
- 현재 구현(`components/profile/ProjectCardV2.tsx`, `components/profile/ProjectModal.tsx`)의 시각적/구조적 이탈 항목을 모두 파악한다.
- 카드·모달 두 컴포넌트가 레퍼런스와 "포맷 수준에서" 일치하도록 개선 범위를 명확히 한다.

### 비교 대상

| 구분 | 레퍼런스 | 현재 구현 |
|---|---|---|
| 프로젝트 카드 | `Profile v2.html` `.file` / `.file.featured` (L221–257) | `components/profile/ProjectCardV2.tsx` |
| 프로젝트 그리드 | `Profile v2.html` `#projects` 섹션 (L627–686) | `components/profile/ProjectGrid.tsx` |
| 프로젝트 모달 | `Profile v2.html` `.modal` / `#modal-scrim` (L408–458, L800–834) | `components/profile/ProjectModal.tsx` |

> 참고: 레퍼런스는 `docs/start/Profile/Profile.html`(초기 3종 카드 스타일 `polaroid`/`list`/`index`)과는 별개이며, 본 프로젝트가 채택한 터미널 IDE 스타일의 최신 버전인 **Profile v2**만을 기준으로 한다.

---

## 🔍 레퍼런스 디자인 분석 (Profile v2.html)

### 1) 프로젝트 카드 — 기본(`.file`)

- **그리드**: `.files`는 `grid-template-columns:repeat(6, 1fr); gap:10px`. 기본 카드는 `grid-column:span 3` (한 행에 2장).
- **카드 컨테이너**: `bg-2`, `border:1px solid var(--line)`, `border-radius:10px`, `padding:16px 18px 18px`, `display:flex;flex-direction:column;gap:10px`.
- **Hover**: `border-color:var(--accent)` + 배경 `linear-gradient(180deg, var(--accent-soft), var(--bg-2))`.
- **Focus 상태**: `.file.focused`에서 `outline:1px solid var(--accent); outline-offset:-2px` (키보드 j/k 네비게이션 시각 피드백).
- **.row**: `name` + `status` 두 요소를 `baseline` 정렬.
- **.name**: `font-size:14px; color:var(--fg); font-weight:500`. `::before` 는 `▸ ` (muted, 10px). `.ext` 는 accent.
- **.status**: `i` 녹색 점(`bg:var(--green)`, glow) + 대문자 트래킹 라벨.
- **.preview**: `height:120px`, `background:cover`, `border-radius:6px`, `border:1px solid var(--line)`, hover 시 `scale(1.02)`.
- **.desc**: sans, 13px, `line-height:1.55`, `text-wrap:pretty`.
- **.stack**: mono 10px, `margin-top:auto`, 태그는 `padding:2px 7px; border:1px solid var(--line-2); border-radius:3px`.
- **.meta-bot**: 호스트·연도 한 줄, `border-top:1px dashed var(--line)`, mono 10px.
- **.kbd** (↵ open): 우상단 absolute, 기본 `opacity:0`, `.focused`에서 `opacity:1`.

### 2) 프로젝트 카드 — Featured(`.file.featured`)

- `grid-column:1 / -1` (행 전체 차지).
- `grid-template-columns:1.2fr 1fr; gap:22px; padding:22px; align-items:stretch`.
- `.preview`는 `grid-row:1 / span 4; grid-column:2; min-height:240px; height:100%`.
- **.name**: `font-size:32px; font-family:var(--display); font-weight:500`, `::before` 가 `★ ` (accent).
- **.desc**: `font-size:15px; line-height:1.6; max-width:48ch`.
- **.featured-tag**: 우상단 accent 배경 + 대문자 라벨(`uppercase; letter-spacing:0.14em`).

### 3) 섹션 헤더(`#projects > .sec-head`)

- `h2 "projects"` + `.hash "#02"` + `.bar`(flex-1 구분선) + `.cnt "ls ./projects · 5 items · [j][k] to navigate"` (mono 11px).

### 4) 프로젝트 모달 (`.modal`)

레퍼런스의 모달은 **"README 스타일의 상세 페이지"** 에 가깝다. 장식은 최소한이며 Hero → Title → Dek → Meta Grid → Overview → Stack → Footer 순서로 흐른다.

- **크기**: `width:min(960px, 100%); max-height:calc(100vh - 80px); border-radius:12px`.
- **구조**: `grid-template-rows:auto 1fr auto` (header / body / footer).
- **Header `.mh`**: `display:flex; gap:14px; padding:12px 16px; background:var(--bg-3); border-bottom:1px solid var(--line)`.
  - 맥 트래픽 라이트 3 dots (장식).
  - `.path`: `~/projects/<b>{slug}</b>` — 오직 이 한 줄만.
  - 우측 `close · ESC` 버튼.
  - **`// project.detail #04` 서브 헤더나 `j/k` kbd는 존재하지 않음.**
- **Hero 이미지**: `.hero-img` — `aspect-ratio:16/9`, `border-bottom:1px solid var(--line)`, **모달 상단 가득 flush** (좌우·상단 여백 없음, border-radius 없음). content padding(`.mcontent { padding:26px 32px }`) 바깥에 위치.
- **Title/Dek (`.mcontent` 안)**:
  - `h3` (id=`m-title`): display 32px, weight 500, `letter-spacing:-0.02em`.
  - `p.dek`: sans 15px, `line-height:1.6; max-width:60ch; margin:0 0 22px`.
  - **`// slug.ext;` monospace 코드 라인은 없음.**
- **Meta Grid (`.meta-grid`)**: ★ 가장 특징적인 요소.
  - `display:grid; grid-template-columns:repeat(4, 1fr); gap:18px`.
  - `border:1px solid var(--line); border-radius:8px; padding:16px 0`.
  - 각 셀(`.m`) 좌우 패딩 16px, 셀 사이 `border-right:1px solid var(--line)`.
  - 4개 고정 항목: **status / year / role / url**.
  - 각 셀은 `.l`(라벨, 10px uppercase muted) 위 / `.v`(값, 13.5px fg) 아래.
- **Overview**: `h4` ("Overview", 11px accent uppercase `letter-spacing:0.14em`) + `.readme` (sans 14px, `line-height:1.7`, `max-width:72ch`).
  - `.readme` 는 **HTML 조각**을 그대로 렌더: `<p>`, `<ul><li>`, `<b>`, `<code>`(mono, `var(--bg-3)` 배경) 지원.
- **Stack**: `h4 "Stack"` + `.readme` 안에 `flex-wrap` 태그들.
  - 태그 스타일: `padding:3px 8px; border:1px solid var(--line-2); border-radius:3px; font-family:mono; font-size:11px`.
- **Footer `.mf`**: `padding:12px 16px; background:var(--bg-3); border-top:1px solid var(--line)`.
  - 좌: `press [←] [→] to navigate projects` 텍스트 안내(mono 11px muted).
  - 우: `[← prev]` `[next →]` 일반 버튼 + **`[Open live ↗]` primary 버튼**(`background:var(--accent); color:var(--accent-ink)`).
  - 네비게이션 키: **화살표 키(←/→)** 기준. `j/k` 는 카드 그리드 탐색에만 쓰인다.

---

## 🔍 현재 구현 분석

### 1) `ProjectCardV2.tsx`

레퍼런스와 대체로 일치한다. 아래 항목만 살짝 다르다.

- 기본 카드 패딩: `px-[18px] pt-4 pb-[18px]` (top 16px, bottom 18px) — 레퍼런스 `16px 18px 18px`와 동일한 의도지만 `pt-4`(16px)로 대응하고 있어 정상.
- `::before` 프리픽스, `.ext`, `.status` dot, `.meta-bot` 점선 등은 모두 반영됨.
- Featured `h3` 크기는 `text-[28px] sm:text-[32px]` — 레퍼런스는 고정 32px. **반응형 다운그레이드가 추가**되어 있으나 레퍼런스와 완전히 동일하지는 않다.
- Focus 상태가 `outline` 으로 구현되어 있으나, **키보드 j/k 네비게이션(`.focused` 클래스 토글)이 `ProjectGrid`에서 미구현**. 레퍼런스의 "5 items · [j][k] to navigate" 문구에 기능이 따라가지 못하고 있다.
- Featured 카드의 `::before '★ '` 은 `h3`의 `before:content-['★_']`로 구현 — 일치.
- **하단 우측 kbd(`↵ open`)가 hover 시 나타나게 되어 있으나, 레퍼런스는 focused 상태에서 나타남**(`.file.focused .kbd{opacity:1}`). 현재 구현은 `opacity-0 transition-opacity` 만 있고 hover/focus 연결이 없어 보이지 않는다.

### 2) `ProjectModal.tsx` (이탈이 큰 영역)

현재 모달은 레퍼런스의 "README 문서" 톤을 **"IDE/코드 에디터 창"** 톤으로 과하게 재해석했다. 주요 이탈:

| 항목 | 레퍼런스 | 현재 구현 | 문제 |
|---|---|---|---|
| 모달 최대 너비 | `min(960px, 100%)` | `min(92vw, 720px)` | **너비가 240px 좁음**, content cramp |
| Header | 트래픽 라이트 dots + `~/projects/<b>{slug}</b>` + `close · ESC` 한 줄 | 38px 타이틀바(dots + `frank@seoul:~/projects/{slug}` + esc kbd) | 프롬프트 문자열이 복잡해짐 |
| Section Header | **없음** | `// project.detail #04` + `N/Total` + `j`/`k` kbd (섹션 서브헤더 추가) | **레퍼런스에 없는 섹션 머리말이 통째로 추가됨** |
| Hero 이미지 | `.hero-img` 모달 상단 flush, `aspect-ratio:16/9`, `border-bottom:1px solid var(--line)` | `.mcontent` 안쪽의 박스 (`aspect-[16/9] rounded border`) | flush가 아니고 **content padding 내부에 또 하나의 border 박스로 감싸짐** |
| 슬러그 라인 | **없음** (바로 `h3` 타이틀) | `<span>//</span> {slug}<span>{ext}</span>;` 한 줄(monospace) 추가 | **불필요한 "코드 흉내" 라인 추가**, 시각적 노이즈 |
| 타이틀/데크 | `h3` (32px display) + `p.dek` (15px, max-60ch, 별도 문단) | `h3` 안에 `{title} — {dek}` 가 **inline**으로 섞임 | 타이틀과 데크의 정보 위계가 뭉개짐 |
| Meta 영역 | `.meta-grid` — 4 cell 박스, border-box + vertical dividers, 고정 4항목(status/year/role/url) | `<dl>` `grid-cols-[120px_1fr]` — 좌측 라벨/우측 값 리스트, `· ` 프리픽스, role/year/stack/host 혼재 | **포맷 자체가 다름**: 레퍼런스는 "카드 4분할", 현재는 "정의 리스트". stack 을 meta에 넣어 summary(`+N`)로 표시 — 레퍼런스 구조와 맞지 않음 |
| Overview 제목 | `h4 "Overview"` (11px accent uppercase) | `h3` `// overview` 서브헤더(11px accent uppercase, `//_` 프리픽스) | 프리픽스(`// `) 불일치 |
| Overview 본문 | `.readme` — sans 14px, **HTML(`<p>`/`<ul>`/`<b>`/`<code>`) 지원**, `max-width:72ch` | `border-l-2 pl-4 whitespace-pre-line` — **plain text + 인용블록 스타일** | Markdown/HTML 구조를 표현할 수 없음. 인용 블록 장식은 레퍼런스에 없음 |
| Stack 제목 | `h4 "Stack"` | `h3` `// stack` | 프리픽스·태그 불일치 |
| Stack 태그 스타일 | `padding:3px 8px; border:1px solid var(--line-2); font-size:11px` | `border border-profile-line-2 px-[7px] py-0.5 text-[10px]` | 폰트/패딩이 카드용(10px) 그대로 적용됨 — 레퍼런스 모달 태그는 더 크다 (11px, padding 3×8) |
| Footer 안내 | `press [←] [→] to navigate projects` | `k` `j` kbd 안에 포함 | **네비게이션 키가 k/j로 표기** — 레퍼런스 모달은 화살표 키 중심 |
| Footer 버튼 | `[← prev]` `[next →]` `[Open live ↗]`(primary, accent 배경) | `prev/next` + `Open live ↗`(accent border + accent-soft bg) | primary 버튼이 **outline 스타일**로 약화됨. 시각적 강조가 부족 |
| Footer 여백 | `padding:12px 16px; bg:var(--bg-3); border-top:1px solid var(--line)` | `border-t border-dashed border-profile-line pt-4` | 점선+투명 배경 — 레퍼런스의 chrome처럼 고정 footer 느낌이 아님 |

### 3) `ProjectGrid.tsx`

- 그리드 설정은 레퍼런스와 동일(`md:grid-cols-6`, `gap-[10px]`).
- 섹션 헤더의 카운터·힌트 텍스트는 레퍼런스와 일치.
- 단, **`.focused` 상태 관리(키보드 j/k 탐색)가 카드 쪽에만 상태 정의가 있고, 그리드 레벨에서 포커스 인덱스를 관리하지 않는다** — 레퍼런스 JS(L1099–1108)에서는 `setFocus(i)`로 그리드 전체가 관리한다.

---

## 🎯 차이 요약 및 원인 진단

### 핵심 진단

1. **모달의 "장르"가 다르다**
   - 레퍼런스: 문서(README) 스타일. 이미지가 상단 hero로 크게 나오고, 제목·설명·메타(4칸)·Overview·Stack·Footer로 **위에서 아래로 정보가 흐른다**.
   - 현재: 에디터 창 스타일. 매 섹션마다 `// xxx` 프리픽스, `.slug.ext;` 코드 라인, j/k kbd, 트래픽 라이트 + 프롬프트 경로, border-l 인용 블록 등 **장식이 내용을 침범**.

2. **Meta Grid 포맷이 근본적으로 다르다**
   - 레퍼런스는 4칸 박스(카드) — 한눈에 스캔 가능.
   - 현재는 정의 리스트 — 라벨과 값이 세로로 쭉 이어짐, 훑어보기 어려움.

3. **Hero 이미지가 외곽(flush)이 아닌 내부(inset)에 있다**
   - 레퍼런스는 모달 상단 가득 덮는 "표지". 현재는 content padding 안에 또 하나의 border 박스.

4. **Overview 렌더링이 plain text 뿐**
   - 레퍼런스 데이터(`overview: \`<p>...</p><ul><li>...</li></ul>\``)는 **HTML 조각**이 전제.
   - 현재 `whitespace-pre-line` 은 줄바꿈만 유지할 뿐 `<ul>`/`<b>`/`<code>` 를 살릴 수 없음.

5. **불필요한 "코드 에디터 흉내" 레이어**
   - Modal Chrome에 `frank@seoul:~/projects/{slug}` 프롬프트.
   - `// project.detail #04` 서브 헤더.
   - `// slug.ext;` 코드 라인.
   - `// overview`, `// stack` 프리픽스.
   - 이 모든 것이 레퍼런스에 **존재하지 않는다**.

6. **네비게이션 키 표기 혼선**
   - 레퍼런스: 카드 그리드 = j/k, 모달 안 = ←/→.
   - 현재: 모달 안에서도 j/k 노출.

### 데이터 스키마 확인 필요 항목

- `PortfolioItem` 에 `overview` 가 **HTML 문자열**을 담을 수 있는지, 아니면 Markdown/plain text 인지 확인 필요.
- 레퍼런스의 `role`, `year`, `status`, `url` 네 항목은 meta-grid의 **고정 컬럼**이므로, 프런트매터에서 이 4종이 일관되게 채워져야 함. 현재 `lib/portfolio.ts` 스키마가 어떻게 되어 있는지 점검 필요.

---

## ✅ 개선 방향 (목표 포맷)

모든 변경은 **Profile v2.html 을 기준**으로 한다. 의도적으로 커스텀한 부분이 있다면 이 문서에 별도 Exceptions 절로 남긴다.

### A. `ProjectCardV2.tsx`

1. Featured `h3` 폰트 크기를 고정 32px로 맞춘다(반응형 축소 제거 검토).
2. `.kbd (↵ open)` 을 **`.focused` 상태에서만 보이도록** 하고, 그리드의 j/k 네비게이션과 연결.

### B. `ProjectGrid.tsx`

1. `focusIdx` 상태를 도입하여 카드에 `.focused` 클래스를 토글.
2. 전역 키보드 핸들러: `j`(다음) / `k`(이전) / `Enter`(모달 열기) / `/`(팔레트).
3. 카드의 `hover` 시에도 포커스 인덱스 업데이트 (레퍼런스 `mouseenter` 동작).

### C. `ProjectModal.tsx` (대대적 리팩토링)

1. **모달 너비를 960px로 확대**(`max-w-[960px]`).
2. **Modal Chrome 간소화**
   - 트래픽 라이트 dots + `~/projects/{slug}` (`<b>{slug}</b>` accent) + `close · ESC` 버튼만.
   - `frank@seoul:~/...` 프롬프트 제거.
   - `// project.detail #04` 섹션 헤더 **완전 제거**.
3. **Hero 이미지를 flush 상단으로 이동**
   - `.mcontent` 바깥, 헤더 바로 아래.
   - `aspect-[16/9]`, `border-bottom: 1px solid var(--line)`, border-radius 없음.
4. **슬러그 라인 제거** — `h3` 타이틀이 바로 보이도록.
5. **Title/Dek 분리**
   - `h3`: display 32px, `letter-spacing:-0.02em`, margin 0 0 6px.
   - `p.dek`: sans 15px, `line-height:1.6`, `max-w-[60ch]`, `mb-[22px]`.
6. **Meta Grid 재설계** — 4-cell 박스
   - `grid-cols-4`, `border + rounded-lg + py-4`.
   - 셀: `px-4 border-r border-profile-line`(마지막 제외).
   - 셀 내부: `.l`(10px uppercase muted) / `.v`(13.5px fg).
   - 항목: **status / year / role / url** 고정.
7. **Overview 섹션**
   - `h4 "Overview"`: 11px accent uppercase `tracking-[0.14em]`, `// ` 프리픽스 **제거**.
   - 본문: `.readme` — sans 14px, `line-height:1.7`, `max-w-[72ch]`.
   - HTML 렌더링(`dangerouslySetInnerHTML` 혹은 MDX) 지원 검토. 최소한 `<p>`, `<ul><li>`, `<b>`, `<code>` 스타일은 globals.css에서 prose 대체로 준비.
   - `border-l-2 pl-4` 인용 장식 **제거**.
8. **Stack 섹션**
   - `h4 "Stack"`, `// ` 프리픽스 제거.
   - 태그: `px-2 py-[3px] text-[11px] border border-profile-line-2 rounded-[3px]`.
9. **Footer 재설계**
   - 좌: `press [←] [→] to navigate projects` (mono 11px muted). **키 표기를 ←/→로 교체**.
   - 우: `[← prev]` `[next →]` 일반 outline 버튼 + `[Open live ↗]` **primary 버튼**(`bg-profile-accent text-profile-accent-ink border-profile-accent`).
   - 배경: `bg-profile-bg-3`, 상단 `border-t border-profile-line` (점선 아님), 패딩 `12px 16px`.
10. **키보드**
    - 모달 내부: `Esc`(닫기), `←`/`ArrowLeft` = prev, `→`/`ArrowRight` = next.
    - 현재 구현의 `j`/`k` 매핑은 **모달 안에서는 제거**(카드 그리드에만 남김).

### D. 데이터 / 스키마

- `PortfolioItem.overview` 를 **HTML 문자열** 또는 Markdown으로 승격(모달 `.readme` 풍부한 렌더링 지원).
- `status` 필드는 `live`, `live · v1.3` 등 **짧은 라벨**임을 명시.
- `role` / `year` / `url` 이 누락되지 않도록 Zod 스키마 optional → required 여부를 레퍼런스 예시에 맞춰 조정.

---

## 🚫 비목표 (Out of Scope)

- 카드 그리드 레이아웃(6-col, featured full-width) 변경 — 이미 레퍼런스와 일치.
- 사이드바/상단 타이틀바/우측 Rail 등 **모달·카드 외 영역** 개선.
- 라이트 모드 지원(단일 다크 테마 유지).
- i18n/다국어 도입.

---

## 📏 수용 기준 (Acceptance Criteria)

개선 완료 후 다음을 모두 만족해야 한다.

- [ ] 모달 최대 너비 960px, 헤더 한 줄(dots + path + close).
- [ ] Hero 이미지가 모달 상단에 flush로 배치, border-radius 없이 `border-bottom` 만.
- [ ] Meta 영역이 4-cell(status/year/role/url) 박스로 렌더됨.
- [ ] Overview 가 `<ul>/<b>/<code>` 등 HTML 조각을 올바르게 렌더.
- [ ] Footer 에 primary `Open live ↗` 버튼이 accent 배경으로 강조됨.
- [ ] 모달 키보드 네비가 `← / → / Esc` 만으로 동작.
- [ ] 카드 그리드에서 `j / k / Enter` 키가 동작하고, 포커스 카드에 `↵ open` kbd가 보임.
- [ ] 모달 어디에도 `// project.detail`, `//slug.ext;`, `frank@seoul:...` 문구가 없다.

---

## 📚 참고

- 레퍼런스: `docs/start/Profile/Profile v2.html`
  - 카드 CSS: L220–257
  - 모달 CSS: L408–458
  - 카드 HTML: L635–685
  - 모달 HTML: L800–834
  - 모달 JS(데이터 구조 포함): L1055–1139
- 현재 구현:
  - `components/profile/ProjectCardV2.tsx`
  - `components/profile/ProjectGrid.tsx`
  - `components/profile/ProjectModal.tsx`
  - `lib/portfolio.ts`
