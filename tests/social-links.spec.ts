import { test, expect } from '@playwright/test'

const EXPECTED = [
  { label: 'github/kenshin579', href: 'https://github.com/kenshin579' },
  { label: 'linkedin/frank-oh', href: 'https://www.linkedin.com/in/frank-oh-abb80b10/' },
  { label: 'instagram/frank.photosnap', href: 'https://www.instagram.com/frank.photosnap/' },
  { label: 'instagram/frank.coffeetime', href: 'https://www.instagram.com/frank.coffeetime/' },
]

test('사이드바 Links 에 소셜 계정 4개가 노출된다', async ({ page }) => {
  await page.goto('/')
  const sidebar = page.getByRole('complementary', { name: 'Profile sidebar' })

  for (const { label, href } of EXPECTED) {
    const link = sidebar.getByRole('link', { name: label })
    await expect(link).toHaveAttribute('href', href)
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', /noreferrer/)
  }
})

test('JSON-LD sameAs 에 소셜 URL 4개가 모두 포함된다', async ({ page }) => {
  await page.goto('/')
  const personScript = page.locator('script[type="application/ld+json"]').nth(0)
  const personData = JSON.parse((await personScript.textContent()) || '{}')

  expect(personData.sameAs).toHaveLength(4)
  for (const { href } of EXPECTED) {
    expect(personData.sameAs).toContain(href)
  }
})
