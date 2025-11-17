# 네이버 검색 등록 PRD

## 목적
Next.js 정적 사이트를 네이버 검색엔진에 등록하여 네이버 검색 결과에 노출되도록 사이트 소유권 인증 구현

## 배경
- **인증 코드**: `b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57`
- **플랫폼**: Next.js 14 App Router (정적 사이트 생성)
- **요구사항**: HTML 메타 태그를 통한 사이트 소유권 인증

---

## 기술 요구사항

### 1. 메타 태그 추가
- Next.js App Router의 Metadata API 활용
- `app/layout.tsx`의 `metadata` 객체에 네이버 사이트 인증 메타 태그 추가
- 인증 코드 `b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57` 설정

**파일**: `app/layout.tsx`

**구현 방법**:
```typescript
export const metadata: Metadata = {
  // 기존 메타데이터...
  verification: {
    google: '기존 구글 인증 코드 (있다면)',
    other: {
      'naver-site-verification': 'b63b630c8f37fb1c0d2bd69cbbaa6e0b3a999a57',
    },
  },
}
```

### 2. 빌드 및 배포 확인
- `npm run build`로 정적 사이트 생성 시 메타 태그가 HTML에 올바르게 포함되는지 확인
- 배포 후 네이버 서치어드바이저에서 소유권 인증 검증
- MCP Playwright로 메타 태그 존재 및 값 검증

---

## 검증 기준

✅ **성공 조건**:
- `app/layout.tsx`의 `metadata` 객체에 네이버 인증 코드가 추가됨
- 빌드된 HTML 파일의 `<head>` 섹션에 메타 태그가 포함됨
- 네이버 서치어드바이저에서 소유권 인증 성공

❌ **실패 조건**:
- 메타 태그가 HTML에 렌더링되지 않음
- 인증 코드가 잘못 입력됨
- 네이버 서치어드바이저에서 인증 실패

---

## 관련 문서

- **구현 가이드**: [2_naver_implementation.md](./2_naver_implementation.md)
- **구현 체크리스트**: [2_naver_todo.md](./2_naver_todo.md)

---

## 메타데이터

- **예상 소요 시간**: 약 15분
- **난이도**: ⭐☆☆☆☆ (5점 만점 중 1점)
- **우선순위**: MEDIUM
- **의존성**: 없음

---

## 참고 자료

- [Next.js Metadata API - verification](https://nextjs.org/docs/app/api-reference/functions/generate-metadata#verification)
- [네이버 서치어드바이저](https://searchadvisor.naver.com/)
- [네이버 사이트 소유 확인 가이드](https://searchadvisor.naver.com/guide/seo-basic-ownership)
