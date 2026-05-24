import { test, expect } from '@playwright/test'

test('영어 루트는 영어 라벨을 노출한다', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Search & jump').first()).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('/ko 는 한국어 라벨을 노출한다', async ({ page }) => {
  await page.goto('/ko/')
  await expect(page.getByText('검색 & 이동').first()).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
})

test('언어 토글로 /ko 로 이동한다', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('group', { name: /Switch language|언어 전환/ }).getByText('KO').click()
  await expect(page).toHaveURL(/\/ko\/?$/)
  await expect(page.getByText('검색 & 이동').first()).toBeVisible()
})
