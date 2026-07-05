import { test, expect } from '@playwright/test'

test('사이드바 STATUS 블록은 새 탭으로 status 페이지로 연결된다', async ({ page }) => {
  await page.goto('/')
  const statusLink = page.getByRole('link', { name: 'Open system status page' }).first()
  await expect(statusLink).toHaveAttribute('href', 'https://status.advenoh.pe.kr/')
  await expect(statusLink).toHaveAttribute('target', '_blank')
  await expect(statusLink).toHaveAttribute('rel', /noreferrer/)
})

test('사이드바 STATUS 목록은 최대 3개까지만 노출한다', async ({ page }) => {
  await page.goto('/')
  const statusLink = page.getByRole('link', { name: 'Open system status page' }).first()
  const serviceDots = statusLink.locator('li span.rounded-full')
  expect(await serviceDots.count()).toBeLessThanOrEqual(3)
})
