import { test, expect } from '@playwright/test'

test.describe('SEO Optimization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000')
  })

  test('should have proper meta tags', async ({ page }) => {
    // Title
    await expect(page).toHaveTitle(/Frank Oh Portfolio/)

    // Description
    const description = page.locator('meta[name="description"]')
    await expect(description).toHaveAttribute('content', 'Portfolio website showcasing web development projects')

    // Keywords
    const keywords = page.locator('meta[name="keywords"]')
    const keywordsContent = await keywords.getAttribute('content')
    expect(keywordsContent).toContain('portfolio')
    expect(keywordsContent).toContain('web development')
    expect(keywordsContent).toContain('Frank Oh')
    expect(keywordsContent).toContain('backend')
    expect(keywordsContent).toContain('서버')
    expect(keywordsContent).toContain('AI')

    // Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', 'Frank Oh Portfolio')

    const ogDescription = page.locator('meta[property="og:description"]')
    await expect(ogDescription).toHaveAttribute('content', 'Portfolio website showcasing web development projects')

    const ogImage = page.locator('meta[property="og:image"]')
    await expect(ogImage).toHaveAttribute('content', /og-image\.png/)

    // Twitter Card
    const twitterCard = page.locator('meta[name="twitter:card"]')
    await expect(twitterCard).toHaveAttribute('content', 'summary_large_image')

    const twitterImage = page.locator('meta[name="twitter:image"]')
    await expect(twitterImage).toHaveAttribute('content', /og-image\.png/)

    // Robots meta
    const robotsIndex = page.locator('meta[name="robots"]')
    const robotsContent = await robotsIndex.getAttribute('content')
    expect(robotsContent).toContain('index')
    expect(robotsContent).toContain('follow')
  })

  test('should have JSON-LD structured data', async ({ page }) => {
    // Get all JSON-LD scripts
    const jsonLdScripts = page.locator('script[type="application/ld+json"]')
    const count = await jsonLdScripts.count()

    // Should have exactly 2 JSON-LD scripts (Person + WebSite)
    expect(count).toBe(2)

    // Validate Person schema
    const personScript = jsonLdScripts.nth(0)
    const personContent = await personScript.textContent()
    const personData = JSON.parse(personContent || '{}')

    expect(personData['@context']).toBe('https://schema.org')
    expect(personData['@type']).toBe('Person')
    expect(personData.name).toBe('Frank Oh')
    expect(personData.url).toBe('https://advenoh.pe.kr')
    expect(personData.jobTitle).toBe('Software Engineer')
    expect(personData.sameAs).toBeInstanceOf(Array)
    expect(personData.sameAs.length).toBeGreaterThan(0)

    // Validate WebSite schema
    const websiteScript = jsonLdScripts.nth(1)
    const websiteContent = await websiteScript.textContent()
    const websiteData = JSON.parse(websiteContent || '{}')

    expect(websiteData['@context']).toBe('https://schema.org')
    expect(websiteData['@type']).toBe('WebSite')
    expect(websiteData.name).toBe('Frank Oh Portfolio')
    expect(websiteData.url).toBe('https://advenoh.pe.kr')
    expect(websiteData.author).toBeDefined()
    expect(websiteData.author['@type']).toBe('Person')
    expect(websiteData.author.name).toBe('Frank Oh')
  })

  test('should have alt text on all images', async ({ page }) => {
    // Get all images
    const images = page.locator('img')
    const imageCount = await images.count()

    // Verify all images have alt attributes
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      const alt = await img.getAttribute('alt')

      // Alt attribute should exist and not be empty
      expect(alt).toBeTruthy()
      expect(alt?.length).toBeGreaterThan(0)
    }
  })

  test('should have lazy loading on portfolio images', async ({ page }) => {
    // Get portfolio card images (with cover images)
    const portfolioImages = page.locator('[data-testid^="card-portfolio-"] img')
    const imageCount = await portfolioImages.count()

    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = portfolioImages.nth(i)
        const loading = await img.getAttribute('loading')

        // Images should have lazy loading
        expect(loading).toBe('lazy')
      }
    }
  })
})

test.describe('SEO Files', () => {
  test('should serve robots.txt with 200 status', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/robots.txt')

    expect(response?.status()).toBe(200)

    const content = await page.textContent('body')

    // Should contain sitemap reference
    expect(content).toContain('sitemap')
    expect(content).toContain('https://advenoh.pe.kr/sitemap.xml')

    // Should allow all user agents
    expect(content).toContain('User-Agent: *')
    expect(content).toContain('Allow: /')
  })

  test('should serve sitemap.xml with 200 status and valid format', async ({ page }) => {
    const response = await page.goto('http://localhost:3000/sitemap.xml')

    expect(response?.status()).toBe(200)

    const content = await page.textContent('body')

    // Should be valid XML sitemap format
    expect(content).toContain('<?xml')
    expect(content).toContain('<urlset')
    expect(content).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')

    // Should contain homepage
    expect(content).toContain('<loc>https://advenoh.pe.kr</loc>')

    // Should contain changeFrequency
    expect(content).toContain('<changefreq>monthly</changefreq>')

    // Should contain priority
    expect(content).toContain('<priority>1</priority>')
  })
})
