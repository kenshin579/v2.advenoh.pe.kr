# 사이드바 STATUS top 3 축약 + status 페이지 링크 + TWEAKS 제거

- 날짜: 2026-07-05
- 대상 프로젝트: `v2.advenoh.pe.kr` (Frank Oh 포트폴리오)
- 데이터 소스: `advenoh-status` (Supabase)

## 배경 / 문제

사이드바 `STATUS` 섹션이 감시 서비스 6개를 모두 나열해 세로 공간을 많이 차지한다.
또한 우하단 `TWEAKS` 플로팅 패널(accent/density/noise 커스터마이즈)은 실사용 가치가 낮아 제거하려 한다.

## 목표

1. 사이드바 STATUS 섹션을 **상위 3개 서비스 + `···`** 로 축약한다.
2. STATUS 블록 전체를 클릭하면 **새 탭**으로 시스템 상태 페이지(`https://status.advenoh.pe.kr/`)로 이동한다.
3. `TWEAKS` 기능을 **완전 제거**한다. (`NoiseOverlay` 배경 텍스처는 기본값으로 유지)

## 비목표

- TitleBar / RightRail 등 다른 위치의 상태 표시 변경 (이번 범위 아님)
- 별도의 내부 status 라우트 신설 (이 사이트는 정적 포트폴리오 — 외부 링크로 처리)
- NoiseOverlay 제거

## 확정 사항

| 항목 | 결정 |
|------|------|
| 클릭 영역 | STATUS 블록 전체 (헤더 · 서비스 3개 · `···`) — A안 |
| 이동 방식 | 새 탭 (`target="_blank"`, `rel="noreferrer noopener"`) |
| 이동 대상 | `siteConfig.external.status` (`https://status.advenoh.pe.kr/`) |
| 표시 개수 | 상위 3개 (`slice(0, 3)`) |
| 더보기 표기 | `···` 행, `summary.total > 3` 일 때만 노출 |
| TWEAKS | 기능 완전 제거 (B안) |
| NoiseOverlay | 유지 (기본 noise 0.35) |

## 설계

### 1. STATUS 섹션 — `components/profile/SidebarContent.tsx`

`Sidebar`(데스크톱)와 `MobileSidebarDrawer`(모바일)가 이 컴포넌트를 공유하므로 **한 곳 수정으로 양쪽 반영**된다.

- STATUS 블록(헤더 `<div>` + 서비스 `<ul>`) 전체를 하나의 `<a>`로 감싼다.
  - `href={siteConfig.external.status}`, `target="_blank"`, `rel="noreferrer noopener"`
  - `aria-label`: 시스템 상태 페이지 열기 (i18n 키로 처리, `t.a11y` 신규 키 또는 기존 패턴 재사용)
- 서비스 목록: `status.services.slice(0, 6)` → **`status.services.slice(0, 3)`**
- 서비스 3개 아래 **`···` 행** 추가. 조건: `status.summary.total > 3` (또는 `status.services.length > 3`) 일 때만 렌더.
- hover 상태: 블록 배경 `--profile-accent-soft`, 라벨/화살표 `--profile-accent` 강조. 헤더 우측에 `↗` 아이콘 노출.
- 기존 offline 빈 상태(`status.services.length === 0` → `t.sidebar.offline`) 처리는 그대로 유지. (링크는 유지하되 목록만 offline 문구)
- 키보드 포커스 가능해야 하며 `focus-visible` 아웃라인 유지.

기존 STATUS 마크업(참고):
```tsx
<div>
  <div className="mb-2 ...">{t.sidebar.status} · {status.summary.up}/{status.summary.total}</div>
  <ul>
    {status.services.slice(0, 6).map(svc => ( ... ))}
    {status.services.length === 0 && ( ...offline... )}
  </ul>
</div>
```

변경 방향: 위 블록을 `<a>` 로 감싸고 slice 3, `···` 행 추가, hover/`↗` 강조 클래스 부여.

### 2. TWEAKS 완전 제거

| 파일 | 작업 |
|------|------|
| `components/profile/ProfileShell.tsx` | `import { TweaksPanel }` 및 `<TweaksPanel t={t} />` 삭제 |
| `components/profile/TweaksPanel.tsx` | 파일 삭제 |
| `hooks/useTweaks.ts` | 파일 삭제 (유일 소비자가 TweaksPanel) |
| `app/globals.css` | 미사용 셀렉터 제거: `[data-accent="violet\|red\|green\|orange\|amber"]`, `[data-density="comfortable\|compact"]`. **`:root` 기본값은 유지** |
| `lib/i18n/en.ts` | `tweaks: { ... }` 블록 제거 + `a11y`의 `openTweaks` / `closeTweaks` / `noiseIntensity` 제거 |
| `lib/i18n/ko.ts` | 위와 동일 키 제거 (Dict = `typeof en` 이므로 양쪽 동기화 필수) |

`:root`에 이미 정의된 기본값이 남으므로 외관은 그대로 유지된다:
- `--profile-accent: oklch(0.68 0.19 295)` (violet)
- `--profile-space-card / --profile-space-section` (comfortable)
- `--profile-noise: 0.35` → `NoiseOverlay` 정상 동작

### 3. 유지

- `components/profile/NoiseOverlay.tsx` — 변경 없음. `--profile-noise: 0.35` 기본값으로 렌더.

## 데이터 흐름 (변경 없음)

`lib/status.ts` (Supabase fetch) → `useLiveStatus` → `ProfileShell` → `Sidebar` / `MobileSidebarDrawer` → `SidebarContent`. 표시 로직만 변경.

## 엣지 케이스

- **서비스 3개 이하**: `···` 미표시. 블록 링크는 유지.
- **서비스 0개 (offline)**: offline 문구 표시, `···` 미표시. 링크는 유지(상태 페이지로 이동 가능).
- **정적 export**: 외부 절대 URL이므로 SSG(`output: 'export'`)와 무관하게 동작.

## 검증 계획

- `npm run check` — 타입 검사 (i18n Dict 동기화 확인 지점)
- `npm run lint`
- `npm run build` — 정적 export 성공
- 수동: 데스크톱/모바일 사이드바 STATUS 블록 클릭 → 새 탭으로 `status.advenoh.pe.kr` 열림
- 수동: 우하단 TWEAKS 버튼 사라짐, accent=violet 고정, 배경 노이즈 유지 확인
