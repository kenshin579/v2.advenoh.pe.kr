# v2 포트폴리오 EN/KO 다국어 지원 — 설계

- **작성일:** 2026-05-25
- **대상:** `v2.advenoh.pe.kr` (Frank Oh 포트폴리오 정적 사이트)
- **참고 구현:** `markora.advenoh.pe.kr` (같은 워크스페이스의 형제 정적 사이트, 동일 i18n 패턴 완성됨)

## 목표

포트폴리오 사이트를 영어(EN)/한국어(KO) 2개 언어로 제공한다.

- **기본 언어는 영어**, 루트 `/`에 노출. 한국어는 `/ko/`.
- 번역 범위: **UI 문자열 + 직접 작성한 콘텐츠**(포트폴리오 항목 설명, 프로필 readme). 외부에서 가져오는 콘텐츠(블로그 RSS 글 제목, 오늘의 명언 등)는 원문 유지하고 둘러싼 UI 라벨만 번역.
- `output: 'export'` 정적 사이트 제약(미들웨어 미동작)을 지키면서 언어별 정적 HTML을 각각 생성한다.

## 비목표 (Out of Scope)

- 외부 콘텐츠(블로그 글 본문/제목, 명언 텍스트, GitHub 활동) 자동 번역.
- 3개 이상 언어 확장(구조는 2개 언어 전제, 추후 확장은 별도 작업).
- `trailingSlash` 등 기존 URL 동작 변경(기존 SEO/외부 링크 보존).

## 아키텍처

### 라우팅 & 빌드

markora의 라우트 분리 패턴을 그대로 채택한다.

```
app/
  layout.tsx      공통 root 레이아웃. <html lang> 기본값을 "ko" → "en"으로 변경
  page.tsx        영어, 루트 /        (<AutoLangRedirect /> 포함)
  ko/
    layout.tsx    한국어 전용 metadata (canonical /ko/, hreflang alternates)
    page.tsx      한국어, /ko/        (document.documentElement.lang = 'ko')
```

- `output: 'export'`로 빌드 시 `out/index.html`(en) + `out/ko/index.html`(ko)가 생성된다.
- `trailingSlash`는 현 설정(미설정) 유지 — 라우트 세그먼트 디렉토리는 어차피 `index.html`을 생성하므로 `/ko/`는 정상 동작하고, 기존 URL 동작에 영향이 없다.

### 데이터 로딩 중복 제거

현재 `app/page.tsx`는 async 서버 컴포넌트로 `status·github·writing·portfolio·readme`를 `Promise.all`로 로딩한다. en/ko 두 라우트가 동일 데이터를 필요로 하므로 공통 헬퍼로 추출한다.

```ts
// lib/home-data.ts (신규)
export async function loadHomeData(locale: Locale) {
  // 기존 page.tsx의 Promise.all 로딩 + locale 인지 콘텐츠(portfolio, readme) 포함
}
```

두 `page.tsx`는 `loadHomeData(locale)` 호출 후 `<ProfileShell locale={locale} t={dict} ... />`를 렌더한다.

### i18n 사전 (UI 문자열)

```
lib/i18n/
  en.ts      원본. export type Dict = typeof en
  ko.ts      Dict 타입을 강제 → 한쪽만 키 추가/삭제 시 빌드 에러로 검출
  types.ts   export type { Dict } from './en'; export type Locale = 'en' | 'ko'
```

- React Context를 쓰지 않고 `t: Dict`와 `lang: Locale`을 props로 컴포넌트 트리에 전달한다(markora와 동일, 정적 export 친화적).
- 약 25개 `components/profile/*` 컴포넌트의 하드코딩 텍스트(섹션 제목, 라벨, 버튼, CommandPalette 명령, StatusBar 문구 등)를 사전으로 추출한다.
- dict로 빼기 애매한 인라인/장식 텍스트는 컴포넌트 내부에서 `lang === 'ko' ? … : …` 분기로 처리(markora 관례).

### 콘텐츠 번역 — 필드 단위 언어 접미사

같은 마크다운 파일 안에서 번역 대상 필드만 `_en`/`_ko` 접미사로 분리하고, 언어 무관 필드는 단일로 유지한다.

**포트폴리오 항목** (`contents/website/*/index.md`):

- 번역 대상: `description`, `dek`, `overview`, `role`, `year`, `status`
  → `description_en`/`description_ko`, `dek_en`/`dek_ko`, `overview_en`/`overview_ko`, `role_en`/`role_ko`, `year_en`/`year_ko`, `status_en`/`status_ko`
- 언어 무관(단일): `site`, `cover`, `stack`, `order`, `title`(고유명사), `ext`

`lib/portfolio.ts`:
- `portfolioItemSchema`에 `_en`/`_ko` 필드를 추가(기존 무접미사 필드는 마이그레이션 기간 호환을 위해 fallback 용도로 optional 유지).
- `getPortfolioItems(locale)`가 locale에 맞는 필드를 선택해 **기존 `PortfolioItem` 형태 그대로** 반환 → 소비 컴포넌트는 변경 없음.

**프로필 readme** (`contents/profile/readme.md`):
- 번역 대상: `role`, `focus`, `based`, `xp`, `headline`, 본문 `body`
  → `_en`/`_ko` 접미사 + `body_en`/`body_ko`(본문은 frontmatter로 이동하거나 별도 처리)
- 언어 무관: `stack`, `db`, `cloud`, `cicd`
- `loadReadme(locale)`가 locale에 맞는 값을 선택해 기존 `ReadmeData` 형태로 반환.

**영어 카피**: 현재 콘텐츠는 언어가 섞여 있다(`description`은 영어, `dek`/`overview`/`body`는 한국어). 부족한 영어 카피는 **구현 시 직접 작성**한다.

### 언어 토글 & 자동 전환

- `components/profile/LangToggle.tsx` (신규): EN/KO pill. 클릭 시 `router.push('/' | '/ko/')` + `localStorage['v2-lang']`에 선택 저장.
- `components/profile/AutoLangRedirect.tsx` (신규): `localStorage['v2-lang']` 미설정이고 `navigator.language`가 `ko`로 시작하면 `/ko/`로 `router.replace`. 명시 선택 시 비활성.
- **배치: `TitleBar` 우측** — 현재 `⌘K` 커맨드 팔레트 버튼 + `N/M up` 상태 표시가 있는 `ml-auto` 그룹에 토글 pill 추가. 데스크톱·모바일 공통 노출, 항상 상단 고정.

### SEO / 메타데이터

- root `<html lang>` 기본 `en`, ko page에서 `ko`로 설정(useEffect).
- root `metadata`: OG `locale: 'en_US'`, `alternates.languages`(en `/`, ko `/ko/`, x-default `/`).
- `app/ko/layout.tsx` `metadata`: OG `locale: 'ko_KR'`, `canonical: '/ko/'`, hreflang alternates.
- `app/sitemap.ts`: en/ko 두 URL 등록 + hreflang `alternates.languages`.
- `lib/structured-data.ts`(Person/WebSite): locale별 description/name 반영.

## 영향받는 파일

**신규**
- `lib/i18n/en.ts`, `lib/i18n/ko.ts`, `lib/i18n/types.ts`
- `lib/home-data.ts`
- `app/ko/layout.tsx`, `app/ko/page.tsx`
- `components/profile/LangToggle.tsx`, `components/profile/AutoLangRedirect.tsx`

**수정**
- `app/layout.tsx` (기본 lang, OG locale, hreflang)
- `app/page.tsx` (en + loadHomeData 사용, AutoLangRedirect)
- `app/sitemap.ts`, `lib/structured-data.ts`
- `lib/portfolio.ts`, `lib/profile-readme.ts` (locale 인자 + `_en`/`_ko` 필드)
- `components/profile/*.tsx` 약 25개 (텍스트 → dict/분기)
- `components/profile/TitleBar.tsx` (LangToggle 삽입)
- `contents/website/*/index.md` 6개, `contents/profile/readme.md` (영어 카피 추가)

## 테스트

- `tests/` Playwright 스모크 추가:
  - `/` 접속 시 영어 카피 노출
  - `/ko/` 접속 시 한국어 카피 노출
  - TitleBar 토글로 언어 전환 + `localStorage['v2-lang']` 저장 동작
- `npm run check`(tsc)로 `Dict` 타입 정합성(en/ko 키 일치) 보장.
- `npm run build`로 `out/index.html` + `out/ko/index.html` 생성 확인.

## 열린 질문 / 위험

- `overview`/`body`는 분량이 있는 마크다운이라 frontmatter `_en`/`_ko`로 옮기면 YAML 가독성이 다소 떨어질 수 있음. 필요 시 해당 필드만 별도 파일 분리(`overview.en.md` 등)로 후속 조정 가능.
- 25개 컴포넌트 텍스트 추출은 분량이 크므로 구현 계획에서 컴포넌트 그룹 단위로 단계 분할 예정.
