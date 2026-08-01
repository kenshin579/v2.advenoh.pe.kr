import { test, expect } from '@playwright/test'

test('컨트리뷰션 그래프는 폴백이 아닌 실제 기여 데이터를 렌더한다', async ({ page }) => {
  await page.goto('/')

  const total = await page.locator('[data-l]').count()
  expect(total).toBeGreaterThan(0)

  // 전부 level 0 이면 buildFallback() 의 전부-0 더미가 박힌 것.
  // 2026-08 장애(시드 캐시 부재 + 토큰 실패)의 재발 방지용.
  const zeroCells = await page.locator('[data-l="0"]').count()
  expect(zeroCells).toBeLessThan(total)
})
