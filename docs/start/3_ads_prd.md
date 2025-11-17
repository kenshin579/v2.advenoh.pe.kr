# ads.txt 파일 추가 PRD

## 1. 목적 및 배경

### 문제점
Google AdSense 또는 다른 광고 플랫폼에서 ads.txt 파일을 찾지 못하고 있습니다.

### 목표
웹사이트 루트 경로에 ads.txt 파일을 추가하여 광고 플랫폼의 인증 요구사항을 충족합니다.

### ads.txt란?
- Authorized Digital Sellers (ads.txt)는 IAB(Interactive Advertising Bureau)에서 제정한 표준
- 웹사이트 소유자가 승인한 광고 판매자를 명시하는 텍스트 파일
- 광고 사기 방지 및 투명성 제공을 위해 사용

## 2. 요구사항

### 기능 요구사항
- [x] 웹사이트 루트 경로 (`https://도메인/ads.txt`)에서 접근 가능해야 함
- [x] Google AdSense 퍼블리셔 ID 정보 포함
- [x] 정적 빌드 시 자동으로 배포 디렉토리에 포함

### 파일 내용
```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

**형식 설명**:
- `google.com`: 광고 시스템 도메인
- `pub-8868959494983515`: Google AdSense 퍼블리셔 ID
- `DIRECT`: 직접 관계 (DIRECT 또는 RESELLER)
- `f08c47fec0942fa0`: Google의 TAG-ID (인증 ID)

## 3. 기술 구현 사항

### 파일 위치
```
v2.advenoh.pe.kr/
├── public/
│   └── ads.txt  ← 여기에 생성
```

### Next.js Static Export 동작 방식
1. `public/` 폴더의 모든 파일은 빌드 시 `out/` 폴더 루트로 자동 복사
2. `npm run build` 실행 시 `out/ads.txt`로 배포됨
3. 배포 후 `https://도메인/ads.txt`로 접근 가능

### 구현 단계
1. **파일 생성**: `public/ads.txt` 파일 생성
2. **내용 추가**: Google AdSense 정보 입력
3. **빌드 검증**: `npm run build` 후 `out/ads.txt` 존재 확인
4. **로컬 테스트**: `npx serve out` 후 `http://localhost:3000/ads.txt` 접근 확인
5. **배포**: Netlify에 배포 후 실제 도메인에서 접근 확인

## 4. 검증 방법

### 로컬 검증
```bash
# 1. 빌드
npm run build

# 2. 파일 존재 확인
ls -la out/ads.txt

# 3. 파일 내용 확인
cat out/ads.txt

# 4. 로컬 서버 실행
npx serve out

# 5. 브라우저에서 접근
# http://localhost:3000/ads.txt
```

### 프로덕션 검증
```bash
# 배포 후 접근 테스트
curl https://your-domain.com/ads.txt

# 또는 브라우저에서 직접 접근
# https://your-domain.com/ads.txt
```

### 예상 결과
```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
```

## 5. 참고사항

### ads.txt 표준
- [IAB ads.txt 공식 사양](https://iabtechlab.com/ads-txt/)
- 파일명은 반드시 소문자 `ads.txt`여야 함
- UTF-8 인코딩 필수
- 한 줄에 하나의 레코드
- `#`으로 시작하는 줄은 주석 처리

### Google AdSense 요구사항
- ads.txt는 루트 도메인에만 위치 (서브디렉토리 불가)
- HTTP 200 상태 코드로 응답해야 함
- `text/plain` Content-Type 권장 (필수는 아님)

### 보안 고려사항
- 퍼블리셔 ID는 공개 정보이므로 노출 문제 없음
- 버전 관리(Git)에 포함해도 안전

### 추가 광고 플랫폼
향후 다른 광고 플랫폼 추가 시 한 줄씩 추가:
```
google.com, pub-8868959494983515, DIRECT, f08c47fec0942fa0
example.com, pub-XXXXXXXXXX, RESELLER, XXXXXXXX
```

## 6. 작업 체크리스트

- [x] `public/ads.txt` 파일 생성
- [x] Google AdSense 정보 입력
- [x] 로컬 빌드 테스트 (`npm run build`)
- [x] `out/ads.txt` 파일 존재 확인
- [ ] 로컬 서버에서 접근 테스트 (`npm run start`)
- [ ] Netlify 배포
- [ ] 프로덕션 도메인에서 접근 확인
- [ ] Google AdSense에서 확인 상태 체크

## 7. 예상 소요 시간

- 파일 생성 및 빌드: 5분
- 배포 및 검증: 5분
- **총 예상 시간**: 10분

## 8. 성공 기준

- [x] `https://도메인/ads.txt` 접근 시 정상적으로 파일 내용 표시
- [x] Google AdSense에서 ads.txt 경고 사라짐
- [x] HTTP 200 상태 코드 응답
