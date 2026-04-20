# Google AdSense 제거 PRD

## 📋 개요

포트폴리오 사이트(`v2.advenoh.pe.kr`)에서 이전에 통합했던 Google AdSense 광고 스크립트와 관련 설정을 제거합니다.

### 목표
- Google AdSense 스크립트 완전 제거
- AdSense 계정 인증 파일(`ads.txt`) 제거
- 정적 빌드 결과물(`out/`)에 AdSense 흔적이 남지 않도록 보장
- Google Analytics(GA)는 **유지** (광고와 무관)

### 배경
- `docs/done/1_adsense_prd.md` 기반으로 AdSense를 통합했으나, 포트폴리오 성격상 광고 노출이 사이트 톤과 맞지 않아 제거하기로 결정
- 수익화보다 브랜드/콘텐츠 경험을 우선시

---

## 🔍 현재 구현 현황

### 1. AdSense 스크립트 삽입 위치
**파일**: `app/layout.tsx` (line 101-107)

```tsx
{/* Google AdSense */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

- `<head>` 안에 `next/script`의 `Script` 컴포넌트로 삽입되어 있음
- Publisher ID: `ca-pub-8868959494983515`

### 2. AdSense 계정 인증 파일
**파일**: `public/ads.txt`

```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

- 정적 export 시 `out/ads.txt`로 복사됨
- AdSense 계정 검증용이며 광고 제거 시 함께 삭제 필요

### 3. 관련 문서 (이미 `docs/done/`에 위치)
- `docs/done/1_adsense_prd.md`
- `docs/done/1_adsense_implementation.md`
- `docs/done/1_adsense_todo.md`

> 해당 문서들은 역사적 맥락을 위해 삭제하지 않고 그대로 둠. 본 PRD(`2_remove_ad_prd.md`)가 후속 이력으로 동작.

### 4. 무관한 항목 (제거 대상 아님)
- `components/GoogleAnalytics.tsx` — Google Analytics 전용, **유지**
- `app/layout.tsx`의 `<GoogleAnalytics />` 렌더링 — **유지**
- `lib/site-config.ts`, `lib/structured-data.ts` 등 SEO 메타데이터 — **유지**

---

## 🎯 범위 (Scope)

### In Scope
1. `app/layout.tsx`에서 AdSense `<Script>` 블록과 `{/* Google AdSense */}` 주석 제거
2. `public/ads.txt` 파일 삭제
3. 사용하지 않게 되는 `next/script`의 `Script` 임포트 검토 (다른 곳에서 쓰이지 않으면 제거)
4. 빌드 결과(`out/`)에 `adsbygoogle.js`, `pagead2.googlesyndication.com`, `ads.txt` 흔적이 남지 않는지 검증
5. Netlify 배포 후 프로덕션에서 재확인

### Out of Scope
- Google Analytics 제거 (별도 주제)
- Publisher 계정(AdSense 콘솔)에서 사이트 해제 — 필요 시 운영자가 수동 수행
- SEO 메타데이터 변경
- 레이아웃/UI 수정

---

## ✅ 요구 사항

### 기능 요구 사항
| ID | 요구 사항 | 검증 방법 |
|----|----------|----------|
| FR-1 | `app/layout.tsx`의 AdSense `<Script>` 태그를 제거한다 | 파일 내 `adsbygoogle`, `pagead2.googlesyndication.com` grep 결과 0건 |
| FR-2 | `public/ads.txt`를 삭제한다 | 파일 존재하지 않음 |
| FR-3 | 빌드 후 `out/` 디렉토리에 AdSense 관련 코드/파일이 남아있지 않다 | `grep -r "adsbygoogle" out/` 결과 0건, `out/ads.txt` 부재 |
| FR-4 | 프로덕션 페이지에서 AdSense 네트워크 요청이 발생하지 않는다 | DevTools Network 탭에서 `pagead2.googlesyndication.com` 요청 없음 |
| FR-5 | Google Analytics는 정상 동작한다 | `gtag/js`, `google-analytics.com/g/collect` 요청 정상 확인 |

### 비기능 요구 사항
- **빌드 안정성**: `npm run check`, `npm run lint`, `npm run build` 모두 에러 없이 통과
- **성능**: AdSense 스크립트 제거로 인해 LCP/TBT가 소폭 개선될 것으로 기대 (회귀 없음)
- **호환성**: Next.js 16 정적 export 파이프라인 영향 없음

---

## 🛠 구현 계획

### Step 1. AdSense 스크립트 제거
`app/layout.tsx`에서 아래 블록 삭제:
```tsx
{/* Google AdSense */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### Step 2. 임포트 정리
- 파일 내 다른 `Script` 사용처가 없으면 `import Script from 'next/script'` 제거
- 사용처가 있으면 임포트는 유지

### Step 3. `ads.txt` 삭제
```bash
rm v2.advenoh.pe.kr/public/ads.txt
```

### Step 4. 빌드 & 검증 (로컬)
```bash
cd v2.advenoh.pe.kr
npm run check
npm run lint
npm run build

# AdSense 흔적 검증
grep -r "adsbygoogle" out/          # 결과: 없음
grep -r "pagead2" out/              # 결과: 없음
[ ! -f out/ads.txt ] && echo "OK"   # 결과: OK
```

### Step 5. 로컬 실행 확인
```bash
npm run start
# http://localhost:3000 접속 후 DevTools:
# - Network 탭: pagead2.googlesyndication.com 요청 없음
# - Elements 탭: adsbygoogle.js script 태그 없음
# - Console: 에러 없음
```

### Step 6. 배포 & 사후 확인
- feature 브랜치 생성 → PR 생성 (`feature/remove-google-adsense`)
- 머지 후 Netlify 자동 배포
- 프로덕션 URL(`https://advenoh.pe.kr`)에서 동일 검증 반복
- `https://advenoh.pe.kr/ads.txt`가 404 반환하는지 확인

---

## 🧪 테스트 계획

### 단위 검증 (빌드 산출물 기준)
| 항목 | 기대값 |
|------|-------|
| `grep -r "adsbygoogle" out/` | 0 matches |
| `grep -r "pagead2.googlesyndication.com" out/` | 0 matches |
| `out/ads.txt` 존재 여부 | 존재하지 않음 |
| `out/index.html`의 `<head>` | AdSense script 태그 없음 |

### 배포 후 수동 검증 (프로덕션)
| 시나리오 | 기대 결과 |
|---------|---------|
| 메인 페이지 로드 | AdSense 네트워크 요청 0건 |
| 404 페이지 로드 | AdSense 네트워크 요청 0건 |
| Google Analytics | `gtag/js` 요청 정상 (회귀 없음) |
| `/ads.txt` 접근 | 404 Not Found |

---

## ⚠️ 리스크 & 고려 사항

1. **AdSense 콘솔 잔존**: 사이트에서 스크립트를 제거해도 Google AdSense 관리자 콘솔에는 사이트가 등록된 채로 남음. 필요 시 운영자가 콘솔에서 직접 사이트 해제 필요.
2. **Publisher ID 노출 이력**: 과거 커밋에는 `ca-pub-8868959494983515`가 남아있으나, 이는 공개 정보(HTML에 노출되던 값)이므로 git history rewrite 불필요.
3. **캐시**: Netlify/브라우저 캐시로 인해 배포 직후에도 구 스크립트가 잠시 노출될 수 있음. 하드 리프레시로 재검증.
4. **Script 임포트 잔존**: `next/script` 임포트를 다른 곳(GoogleAnalytics 등)에서도 쓴다면 `layout.tsx`에서는 제거해도 컴포넌트 레벨에서는 유지될 수 있음 — 전역 grep으로 확인.

---

## 📅 작업 산출물 (Deliverables)

1. `app/layout.tsx` 수정 (AdSense 스크립트 삭제)
2. `public/ads.txt` 삭제
3. 후속 문서:
   - `docs/start/2_remove_ad_implementation.md` (구현 가이드)
   - `docs/start/2_remove_ad_todo.md` (체크리스트)
4. PR: `feature/remove-google-adsense`
5. 완료 후 `docs/start/2_remove_ad_*.md` → `docs/done/`으로 이동

---

## 🔗 관련 문서

- 기존 통합 PRD: [`1_adsense_prd.md`](./1_adsense_prd.md)
- 기존 구현 가이드: [`1_adsense_implementation.md`](./1_adsense_implementation.md)
- 기존 TODO: [`1_adsense_todo.md`](./1_adsense_todo.md)
- Next.js Script: https://nextjs.org/docs/app/api-reference/components/script
- AdSense 사이트 제거 가이드: https://support.google.com/adsense/answer/10513?hl=ko
