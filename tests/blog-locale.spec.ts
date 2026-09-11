import { test, expect } from '@playwright/test'

const EN_BLOG = 'https://blog.advenoh.pe.kr/en/'

test('영어 페이지의 IT 블로그 글 링크는 모두 /en/ 을 가리킨다', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('#writing a[href*="blog.advenoh.pe.kr"]')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    expect(await links.nth(i).getAttribute('href')).toContain(EN_BLOG)
  }
})

test('한국어 페이지의 IT 블로그 글 링크는 /en/ 을 가리키지 않는다', async ({ page }) => {
  await page.goto('/ko/')
  const links = page.locator('#writing a[href*="blog.advenoh.pe.kr"]')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    expect(await links.nth(i).getAttribute('href')).not.toContain(EN_BLOG)
  }
})

test('영어 페이지의 IT Blog 카드는 영어 블로그로 연결된다', async ({ page }) => {
  await page.goto('/')
  await page.locator('[data-project-card="it-blog"]').click()
  const link = page.getByRole('dialog').getByRole('link', { name: /Open live/ })
  await expect(link).toHaveAttribute('href', EN_BLOG)
})

test('한국어 페이지의 IT Blog 카드는 한국어 블로그로 연결된다', async ({ page }) => {
  await page.goto('/ko/')
  await page.locator('[data-project-card="it-blog"]').click()
  const link = page.getByRole('dialog').getByRole('link', { name: /사이트 열기/ })
  await expect(link).toHaveAttribute('href', 'https://blog.advenoh.pe.kr/')
})
