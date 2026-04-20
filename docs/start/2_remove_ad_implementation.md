# Google AdSense 제거 구현 가이드

## 📋 개요

포트폴리오 사이트(`v2.advenoh.pe.kr`)에서 Google AdSense 스크립트와 관련 인증 파일을 제거하는 구현 가이드입니다.

관련 PRD: [`2_remove_ad_prd.md`](./2_remove_ad_prd.md)

---

## 🎯 구현 목표

- `app/layout.tsx`에서 AdSense `<Script>` 블록 제거
- `public/ads.txt` 파일 삭제
- 정적 빌드 결과물(`out/`)에 AdSense 흔적이 남지 않도록 검증
- Google Analytics는 영향받지 않도록 유지

---

## 📝 구현 단계

### Step 1: `app/layout.tsx` 수정

**파일**: `app/layout.tsx`

#### 1.1 AdSense `<Script>` 블록 삭제

기존 코드 (line 101~107, `<head>` 내부):

```tsx
{/* Google AdSense */}
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8868959494983515"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

→ **해당 JSX 블록과 주석을 전부 삭제**

#### 1.2 `Script` import 검토

- 파일 내 `Script` 컴포넌트의 다른 사용처를 검색
- 사용처가 없으면 `import Script from 'next/script'` 제거
- 사용처가 있으면 import는 그대로 유지

```bash
grep -n "Script" app/layout.tsx
```

#### 1.3 최종 `<head>` 상태 (예시)

```tsx
<head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
  />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
  />
</head>
```

---

### Step 2: `public/ads.txt` 삭제

**파일**: `public/ads.txt`

```bash
rm v2.advenoh.pe.kr/public/ads.txt
```

삭제 후 확인:
```bash
ls public/ads.txt 2>/dev/null || echo "deleted"
# 기대 출력: deleted
```

---

### Step 3: 정적 분석 및 린트

```bash
cd v2.advenoh.pe.kr
npm run check   # TypeScript 타입 검사
npm run lint    # ESLint
```

- 에러 0건이어야 통과

---

### Step 4: 프로덕션 빌드 & 산출물 검증

#### 4.1 빌드 실행

```bash
npm run build
```

- `out/` 디렉토리 재생성 여부 확인

#### 4.2 AdSense 흔적 검증

```bash
# adsbygoogle 스크립트 흔적
grep -r "adsbygoogle" out/
# 기대: 결과 없음

# AdSense CDN 도메인 흔적
grep -r "pagead2.googlesyndication.com" out/
# 기대: 결과 없음

# Publisher ID 흔적
grep -r "ca-pub-8868959494983515" out/
# 기대: 결과 없음

# ads.txt 부재 확인
[ ! -f out/ads.txt ] && echo "OK: ads.txt removed" || echo "FAIL: ads.txt still exists"
```

#### 4.3 HTML 메인 페이지 확인

```bash
grep -n "adsbygoogle\|pagead2" out/index.html
# 기대: 결과 없음
```

---

### Step 5: 로컬 프리뷰 검증

```bash
npm run start
# → http://localhost:3000 접속
```

Chrome DevTools 확인 항목:
- **Network 탭**: `pagead2.googlesyndication.com` 요청 0건
- **Elements 탭**: `<head>` 내 `adsbygoogle.js` script 태그 없음
- **Console 탭**: AdSense 관련 에러/경고 없음
- **GA 정상 동작**: `google-analytics.com/g/collect` 요청은 정상 발생해야 함

---

### Step 6: Git 워크플로우

#### 6.1 브랜치 생성

```bash
git checkout main && git pull origin main
git checkout -b feature/remove-google-adsense
```

#### 6.2 커밋

```bash
git add v2.advenoh.pe.kr/app/layout.tsx
git add -u v2.advenoh.pe.kr/public/ads.txt   # 삭제 추적
git commit -m "chore: Google AdSense 스크립트 및 ads.txt 제거"
```

#### 6.3 PR 생성

```bash
git push -u origin feature/remove-google-adsense

gh pr create --title "chore: Google AdSense 제거" --body "$(cat <<'EOF'
## Summary
- `app/layout.tsx`의 AdSense `<Script>` 블록 제거
- `public/ads.txt` 삭제
- Google Analytics는 유지 (광고와 무관)

## Test plan
- [ ] `npm run check` 통과
- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과
- [ ] `grep -r "adsbygoogle" out/` → 결과 없음
- [ ] `out/ads.txt` 존재하지 않음
- [ ] 로컬 프리뷰 Network 탭에 AdSense 요청 없음
- [ ] 배포 후 프로덕션에서 AdSense 요청 0건 재확인
EOF
)"
```

리뷰어: `kenshin579`

---

### Step 7: 배포 & 사후 검증

Netlify 자동 배포 이후 프로덕션(`https://advenoh.pe.kr`)에서 동일 검증:

- `curl -I https://advenoh.pe.kr/ads.txt` → `404 Not Found`
- 브라우저 DevTools → AdSense 네트워크 요청 0건
- Google AdSense 콘솔에서 사이트 상태 확인 (선택: 운영자가 콘솔에서 사이트 제거)

---

## 🔍 변경 파일 요약

| 파일 | 변경 유형 | 내용 |
|------|----------|------|
| `app/layout.tsx` | 수정 | AdSense `<Script>` 블록 및 주석 제거, 필요 시 `Script` import 제거 |
| `public/ads.txt` | 삭제 | Publisher 인증 파일 제거 |
| `docs/start/2_remove_ad_prd.md` | 신규 | PRD 문서 |
| `docs/start/2_remove_ad_implementation.md` | 신규 | 본 문서 |
| `docs/start/2_remove_ad_todo.md` | 신규 | TODO 체크리스트 |

---

## ⚠️ 트러블슈팅

### 문제 1: 빌드 결과에 여전히 `ads.txt`가 존재
- 원인: `public/ads.txt`가 삭제되지 않았거나 빌드 캐시 잔존
- 해결: `rm -rf .next out && npm run build` 후 재검증

### 문제 2: `Script` 미사용으로 `no-unused-vars` 린트 에러
- 원인: `app/layout.tsx` 내 `Script` 사용처 모두 제거 후 import 남음
- 해결: `import Script from 'next/script'` 행 삭제

### 문제 3: 프로덕션에서 여전히 AdSense 요청 발생
- 원인: Netlify/브라우저 캐시
- 해결: 하드 리프레시(⌘+Shift+R), Netlify 캐시 클리어 후 재검증

---

## 📚 참고 자료

- PRD: [`2_remove_ad_prd.md`](./2_remove_ad_prd.md)
- TODO: [`2_remove_ad_todo.md`](./2_remove_ad_todo.md)
- 최초 통합 PRD: [`../done/1_adsense_prd.md`](../done/1_adsense_prd.md)
- Next.js Script: https://nextjs.org/docs/app/api-reference/components/script
- AdSense 사이트 제거: https://support.google.com/adsense/answer/10513?hl=ko
