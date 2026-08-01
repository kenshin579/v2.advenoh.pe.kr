/**
 * 컨트리뷰션 데이터가 실데이터인지 폴백인지 가르는 센티넬.
 *
 * `lib/github.ts::buildFallback()` 이 이 값을 심고, 클라이언트 컴포넌트가 읽는다.
 * 상수를 공유하므로 생산자와 해석자가 어긋날 수 없다.
 *
 * `lib/github.ts` 가 아니라 별도 leaf 모듈인 이유: 그 파일은 `lib/cache.ts` → `fs`
 * 에 의존해서, 'use client' 컴포넌트가 값(타입 아님)으로 임포트하면 브라우저 번들에
 * fs 가 끌려와 빌드가 깨진다. 이 모듈은 런타임 의존이 없어야 한다 — import 금지.
 *
 * 파라미터를 GithubContrib 대신 구조적 타입으로 받는 것도 같은 이유다.
 */
export const FALLBACK_FETCHED_AT = new Date(0).toISOString()

export function isFallbackContrib(c: { fetchedAt: string }): boolean {
  return c.fetchedAt === FALLBACK_FETCHED_AT
}
