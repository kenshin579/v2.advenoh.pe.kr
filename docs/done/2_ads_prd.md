# ads.txt 복원 PRD

## 📋 개요

포트폴리오 사이트(`v2.advenoh.pe.kr`)의 Google AdSense 콘솔에서 발생한 **"수익 손실 위험 - 사이트에서 발견된 ads.txt 파일 문제를 해결해야 합니다"** 경고를 해소하기 위해, 이전 PR에서 삭제된 `public/ads.txt`를 복원합니다.

### 목표
- `public/ads.txt`를 원본과 동일한 내용으로 복원
- `.gitignore`의 `!public/ads.txt` 예외 라인을 함께 복원하여 git 추적 보장
- 빌드 후 `out/ads.txt`가 정상 생성되고 프로덕션(`https://advenoh.pe.kr/ads.txt`)에서 200 응답 확인
- AdSense 콘솔의 경고 메시지 해소
- **광고 노출은 복원하지 않음** — `app/layout.tsx`의 AdSense `<Script>` 블록은 그대로 제거 상태 유지

### 배경
- 사이트에서 광고는 노출하지 않지만, AdSense 콘솔에 사이트가 등록되어 있는 한 Google 크롤러는 `ads.txt`를 주기적으로 조회함
- 파일 부재 시 publisher 인증 실패 → 잠재 수익 손실 경고 노출
- AdSense 콘솔에서 사이트를 완전히 해제하지 않는 한, `ads.txt`는 제공되어야 함

---

## 🔍 원인 분석

### 1. 직접 원인 — `ads.txt` 삭제 커밋

| 항목 | 값 |
|------|-----|
| 커밋 SHA | `da4418ece34dee9f1d2bc678cb6d9b7861ec3331` |
| PR | #35 ([#34] chore: Google AdSense 제거) |
| 작성자 | Frank Oh |
| 일자 | 2026-04-20 |
| 관련 PRD | `docs/done/2_remove_ad_prd.md` |

해당 커밋에서 다음 변경이 동시에 이루어졌습니다.

```
.gitignore                              |   1 -    # !public/ads.txt 예외 제거
app/layout.tsx                          |   9 --   # AdSense <Script> + import 제거
public/ads.txt                          |   1 -    # 파일 자체 삭제
docs/done/2_remove_ad_*.md              | +599 ++  # 작업 문서 추가
```

삭제된 `public/ads.txt`의 내용:
```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

### 2. 근본 원인 — 사이트에서만 제거하고 AdSense 콘솔 해제는 미수행

이전 PRD(`2_remove_ad_prd.md`)의 "리스크" 섹션에 이미 다음과 같이 명시되어 있었습니다.

> **AdSense 콘솔 잔존**: 사이트에서 스크립트를 제거해도 Google AdSense 관리자 콘솔에는 사이트가 등록된 채로 남음. 필요 시 운영자가 콘솔에서 직접 사이트 해제 필요.

즉, 다음 두 작업 중 하나를 선택해야 했으나 **둘 다 수행되지 않았음**:
1. AdSense 콘솔에서 `advenoh.pe.kr` 사이트 등록을 해제 → 그러면 `ads.txt`는 불필요
2. `ads.txt`는 유지하고 `<Script>`만 제거 → 광고는 안 띄우지만 인증 파일은 제공

이번 PRD는 **옵션 2** 방향으로 사후 보정합니다 (AdSense 콘솔 해제는 별도 결정 필요).

### 3. 보조 원인 — `.gitignore` 정책

`.gitignore` 10번째 줄에 `public/`이 포함되어 있어 `public/` 디렉토리가 통째로 무시됩니다. 따라서 `public/ads.txt`만 git에 추적되게 하려면 `!public/ads.txt` 예외 라인이 반드시 필요합니다. 이전 커밋에서 이 예외 라인까지 함께 제거된 것이 맞물려, 단순히 파일만 다시 만들면 git이 추적하지 않는 상태가 됩니다.

**현재 상태 확인:**
```bash
$ git check-ignore -v public/ads.txt
.gitignore:10:public/	public/ads.txt        # → ignored
```

### 4. AdSense 경고 메시지 해석

스크린샷의 경고:
> "수익 손실 위험 - 수익에 심각한 영향을 미치지 않도록 사이트에서 발견된 ads.txt 파일 문제를 해결해야 합니다."

이는 다음 시나리오 중 하나를 의미합니다.
- (a) `ads.txt`가 404 (현재 사례에 해당)
- (b) `ads.txt`가 존재하지만 publisher ID가 누락/오기재
- (c) Authorized Sellers 누락

본 사례는 (a)에 해당하므로, 동일 publisher ID(`pub-8868959494983515`)로 파일을 복원하면 해소됩니다.

---

## 🌐 서브도메인 적용 범위

본 ads.txt는 루트 도메인(`advenoh.pe.kr`)에 배포되며, IAB ads.txt 스펙상 **모든 서브도메인의 AdSense publisher 인증을 함께 커버**합니다. 따라서 v2 사이트(루트)에 ads.txt 1개만 두면 충분합니다.

### 적용 대상
| 도메인 | 광고 노출 | ads.txt 파일 위치 |
|--------|----------|-----------------|
| `advenoh.pe.kr` (루트, v2 포트폴리오) | ❌ (의도적 미노출) | ✅ 본 PRD로 복원 |
| `blog.advenoh.pe.kr` (IT 기술 블로그) | ✅ (정상 노출 중) | ❌ 별도 파일 불필요 — 루트 것을 공유 |
| 기타 `*.advenoh.pe.kr` (동일 publisher ID 사용 시) | 사이트별 | ❌ 별도 파일 불필요 |

### 원칙
- 각 서브도메인 프로젝트에 별도 `public/ads.txt`를 두지 **않는다** (single source of truth)
- ads.txt는 publisher 인증만 담당. 실제 광고 노출 여부는 각 사이트의 AdSense `<Script>` + 광고 단위/Auto Ads 설정으로 결정됨
- v2 사이트는 ads.txt만 제공하고 `<Script>`는 두지 않으므로 광고가 노출되지 않음 (의도된 분리)

### 본 작업이 다른 서브도메인에 미치는 영향
- blog 등 서브도메인은 **이미 광고가 정상 노출 중**이며 별도 코드 수정 / AdSense 콘솔 설정 변경 **불필요**
- 본 작업으로 루트 ads.txt가 복원되면 서브도메인의 AdSense 인증도 함께 안정화됨 (부수 효과)
- 따라서 본 작업의 변경 범위는 **오직 v2 프로젝트 2개 파일** (`public/ads.txt`, `.gitignore`)에 한정됨

---

## 🎯 범위 (Scope)

### In Scope
1. `public/ads.txt` 파일 신규 생성 (이전과 동일한 1줄)
2. `.gitignore`에 `!public/ads.txt` 예외 라인 추가
3. 빌드 후 `out/ads.txt` 산출물 검증
4. 배포 후 `https://advenoh.pe.kr/ads.txt`가 200 + 정확한 1줄 반환 확인
5. AdSense 콘솔에서 경고 해소 여부 모니터링 (반영까지 최대 24~48시간 소요 가능)

### Out of Scope
- AdSense `<Script>` 태그 복원 (광고는 계속 노출하지 않음)
- AdSense 콘솔에서 사이트 해제 (별도 운영 결정 사항)
- 다른 광고/수익화 도구 도입
- Google Analytics 변경 (영향 없음)
- 레이아웃/UI 수정

---

## ✅ 요구 사항

### 기능 요구 사항
| ID | 요구 사항 | 검증 방법 |
|----|----------|----------|
| FR-1 | `public/ads.txt`가 다음 1줄 내용으로 존재한다 | `cat public/ads.txt` → `google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0` |
| FR-2 | `public/ads.txt`가 git에서 추적된다 | `git ls-files public/ads.txt`에 출력됨 |
| FR-3 | `.gitignore`에 `!public/ads.txt` 예외 라인이 있다 | `grep '!public/ads.txt' .gitignore` |
| FR-4 | `npm run build` 후 `out/ads.txt`가 동일 내용으로 존재한다 | `diff public/ads.txt out/ads.txt` 차이 없음 |
| FR-5 | 프로덕션 `https://advenoh.pe.kr/ads.txt`가 200 + 정확한 1줄 반환 | `curl -s https://advenoh.pe.kr/ads.txt`로 확인 |
| FR-6 | AdSense `<Script>` 태그는 복원되지 않는다 | `grep -r "adsbygoogle\|pagead2" app/ out/` 결과 0건 |

### 비기능 요구 사항
- **빌드 안정성**: `npm run check`, `npm run lint`, `npm run build` 모두 에러 없이 통과
- **회귀 없음**: 기존 페이지/SEO/Analytics 동작에 영향 없음
- **호환성**: Next.js 16 정적 export 파이프라인이 `public/` 자산을 그대로 `out/`에 복사하는 동작 활용

---

## 🛠 구현 계획

### Step 1. `public/ads.txt` 생성
```bash
cd v2.advenoh.pe.kr
printf 'google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0\n' > public/ads.txt
```

> ⚠️ Publisher ID는 git history(`git show da4418e:public/ads.txt`)와 AdSense 콘솔 URL(`/u/0/pub-8868959494983515/home`) 양쪽에서 동일함을 교차 검증함.

### Step 2. `.gitignore` 예외 라인 복원
`.gitignore`의 `public/` 라인 바로 아래에 다음을 추가:
```
public/
!public/ads.txt
```

### Step 3. git 추적 확인
```bash
git status                          # public/ads.txt가 untracked로 나와야 함
git check-ignore -v public/ads.txt  # 출력 없어야 함 (= 더 이상 ignored 아님)
git add public/ads.txt .gitignore
```

### Step 4. 빌드 & 검증 (로컬)
```bash
npm run check
npm run lint
npm run build

# 산출물 검증
diff public/ads.txt out/ads.txt && echo "OK: contents match"
```

### Step 5. 로컬 서빙 확인
```bash
npm run start
curl -s http://localhost:3000/ads.txt
# 기대: google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

### Step 6. PR & 배포
- 브랜치: `fix/restore-ads-txt`
- PR 제목: `[#xx] fix: ads.txt 복원하여 AdSense ads.txt 경고 해소`
- 머지 후 Netlify 자동 배포

### Step 7. 사후 검증 (프로덕션)
```bash
curl -i https://advenoh.pe.kr/ads.txt
# 기대: HTTP/1.1 200 OK + 정확한 1줄
```
- AdSense 콘솔에서 "지금 해결하기" 버튼으로 재검사 트리거 (있다면)
- 경고 해소까지 Google 측 크롤 주기로 인해 최대 24~48시간 소요 가능

---

## 🧪 테스트 계획

### 빌드 산출물 기준
| 항목 | 기대값 |
|------|-------|
| `public/ads.txt` 존재 | 1줄, 정확한 publisher ID |
| `out/ads.txt` 존재 | `public/ads.txt`와 byte 단위 동일 |
| `grep -r "adsbygoogle" out/` | 0 matches (AdSense 스크립트는 복원 안 함) |
| `grep -r "pagead2.googlesyndication.com" out/` | 0 matches |
| `git ls-files public/ads.txt` | 한 줄 출력 (= 추적됨) |

### 프로덕션 검증
| 시나리오 | 기대 결과 |
|---------|---------|
| `curl https://advenoh.pe.kr/ads.txt` | 200 OK, 정확한 1줄 |
| 브라우저로 `/ads.txt` 접근 | 텍스트 콘텐츠 표시 |
| 메인 페이지 Network 탭 | `pagead2.googlesyndication.com` 요청 없음 |
| AdSense 콘솔 경고 | 24~48시간 내 해소 |

---

## ⚠️ 리스크 & 고려 사항

1. **AdSense 콘솔 정책 결정 필요**: 본 PRD는 "광고는 안 띄우되 publisher 인증 파일만 제공" 방향. 만약 운영자가 AdSense를 완전히 종료하기로 한다면 콘솔에서 사이트를 해제하는 것이 더 깔끔함. 그 경우 본 PRD 작업 대신 콘솔 해제만 수행하면 됨.
2. **재발 방지**: 향후 누군가 다시 "AdSense 흔적 정리" 작업을 할 때 `ads.txt`를 또 삭제할 수 있음. `.gitignore`의 `!public/ads.txt` 라인 위에 짧은 주석을 남겨 의도를 명시할 것:
   ```
   public/
   # AdSense publisher 인증 파일 (계정 등록 유지 중) — 삭제 금지
   !public/ads.txt
   ```
3. **캐시**: Netlify/CDN/브라우저 캐시로 인해 배포 직후에도 404가 잠시 노출될 수 있음. 하드 리프레시 + 5~10분 대기 후 재검증.
4. **Publisher ID 노출**: `pub-8868959494983515`는 본래 공개되는 식별자(HTML/ads.txt에 노출)이므로 보안 이슈 아님.
5. **AdSense 경고 즉시 해소 미보장**: Google의 ads.txt 크롤 주기로 인해 파일 복원 후에도 콘솔 경고는 즉시 사라지지 않을 수 있음. 24~48시간 모니터링 필요.

---

## 📅 작업 산출물 (Deliverables)

1. `public/ads.txt` 신규 생성 (1줄)
2. `.gitignore` 수정 (`!public/ads.txt` 예외 라인 + 의도 주석 추가)
3. PR: `fix/restore-ads-txt`
4. (선택) 후속 문서:
   - `docs/start/2_ads_implementation.md`
   - `docs/start/2_ads_todo.md`
5. 완료 후 본 PRD 및 후속 문서를 `docs/done/`으로 이동

---

## 🔗 관련 문서 / 레퍼런스

- 직접 원인 커밋: `da4418ece34dee9f1d2bc678cb6d9b7861ec3331` (PR #35)
- 이전 통합 PRD: [`docs/done/1_adsense_prd.md`](../done/1_adsense_prd.md)
- 이전 제거 PRD: [`docs/done/2_remove_ad_prd.md`](../done/2_remove_ad_prd.md)
- Google ads.txt 가이드: https://support.google.com/adsense/answer/7532444
- Next.js Static Files: https://nextjs.org/docs/app/building-your-application/optimizing/static-assets
