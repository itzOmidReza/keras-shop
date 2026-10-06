// frontend/tests/e2e/06-journal-and-articles.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Unified Luxury Editorial Journal & Admin Articles Hub', () => {
  test('should cleanly redirect /blog to /journal', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForURL('**/journal**', { timeout: 10000 })
    await expect(page.locator('h1').first()).toContainText('روایت‌های استایل، فرم و الیاف')
  })

  test('should display luxury magazine storefront with hero cover, categories, and digest ribbon', async ({ page }) => {
    await page.goto('/journal')
    await page.waitForLoadState('domcontentloaded')

    // ۱. بررسی کاور برجسته (Hero Cover Story)
    const heroCover = page.locator('[data-testid="journal-hero-cover"]')
    await expect(heroCover).toBeVisible({ timeout: 10000 })
    await expect(heroCover).toContainText('روایت برگزیده سردبیر')

    // ۲. بررسی تب‌های فیلتر دسته‌بندی مینیمال
    const categoryTabs = page.locator('[data-testid="journal-category-tabs"]')
    await expect(categoryTabs).toBeVisible()

    // کلیک روی تب نگهداری الیاف لوکس
    await page.locator('[data-testid="journal-tab-fabric-care"]').click()
    const grid = page.locator('[data-testid="journal-grid"]')
    await expect(grid).toContainText('نگهداری الیاف لوکس')

    // ۳. تست جست‌وجوی سریع
    const searchInput = page.locator('[data-testid="journal-search-input"]')
    await searchInput.fill('کشمیر')
    await expect(grid).toContainText('کشمیر')
    await searchInput.clear()

    // ۴. بررسی ریبون خبرنامه ادیتوریال
    const digestRibbon = page.locator('[data-testid="journal-digest-ribbon"]')
    await expect(digestRibbon).toBeVisible()
    await page.locator('[data-testid="digest-email-input"]').fill('atelier-reader@keras.luxury')
    await page.locator('[data-testid="digest-submit-btn"]').click()
    await expect(page.locator('text=عضویت شما در گاهنامه تحلیلی آتلیه کراس با موفقیت ثبت شد.')).toBeVisible({ timeout: 6000 })
  })

  test('should navigate to article reader page, show reading progress bar, and cross-sell shop the story widget', async ({ page }) => {
    await page.goto('/journal/the-art-of-autumn-layering')
    await page.waitForLoadState('domcontentloaded')

    // ۱. بررسی نوار پیشرفت مطالعه در بالا
    const progressBar = page.locator('[data-testid="reading-progress-bar"]')
    await expect(progressBar).toBeAttached()

    // ۲. بررسی عنوان و نویسنده مقاله
    await expect(page.locator('h1').first()).toContainText('راهنمای جامع استایل چندلایه پاییز')
    await expect(page.locator('text=سارا کیانی')).toBeVisible()

    // ۳. بررسی پیوند بازگشت به ژورنال
    const backLink = page.locator('[data-testid="back-to-journal-link"]')
    await expect(backLink).toBeVisible()

    // ۴. بررسی ویجت خرید محصولات این استایل (Shop the Story)
    const storyWidget = page.locator('[data-testid="shop-the-story-widget"]')
    await expect(storyWidget).toBeVisible()
    await expect(storyWidget).toContainText('خرید آیتم‌های ادیتوریال')

    // افزودن اولین آیتم استایل به سبد خرید
    const addToCartBtn = page.locator('[data-testid="add-story-product-btn"]').first()
    await expect(addToCartBtn).toBeVisible()
    await addToCartBtn.click()
    await expect(addToCartBtn).toContainText('افزوده شد')

    // بستن دراور سبد خرید
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    // ۵. بازگشت به ژورنال
    await backLink.click({ force: true })
    await page.waitForURL('**/journal**', { timeout: 10000 })
  })

  test('should manage articles in ops nexus hub (table, draft toggle, and create new article)', async ({ page }) => {
    // ۱. ورود مدیر ارشد
    await page.goto('/login?redirect=/internal-ops-nexus/articles')
    await page.waitForLoadState('domcontentloaded')

    const adminBypassBtn = page.locator('[data-testid="login-admin-bypass"]')
    await expect(adminBypassBtn).toBeVisible()
    await adminBypassBtn.click()

    await page.waitForURL('**/internal-ops-nexus/articles**', { timeout: 15000 })
    await page.waitForLoadState('domcontentloaded')

    // ۲. بررسی وجود جدول مقالات و سوئیچ وضعیت انتشار
    const table = page.locator('[data-testid="articles-table"]')
    await expect(table).toBeVisible({ timeout: 10000 })

    const firstToggle = page.locator('[data-testid^="toggle-status-"]').first()
    await expect(firstToggle).toBeVisible()
    const initialText = await firstToggle.innerText()
    await firstToggle.click()
    await expect(firstToggle).not.toHaveText(initialText)

    // برگرداندن به حالت اولیه
    await firstToggle.click()

    // ۳. ایجاد مقاله جدید
    const createBtn = page.locator('[data-testid="create-article-btn"]')
    await expect(createBtn).toBeVisible()
    await createBtn.click()

    await page.waitForURL('**/internal-ops-nexus/articles/new**', { timeout: 10000 })
    await expect(page.locator('[data-testid="admin-article-form"]')).toBeVisible()

    // پر کردن اطلاعات فرم
    await page.locator('[data-testid="article-title-input"]').fill('روایت کمد مینیمال پاییزی آتلیه')
    await page.locator('[data-testid="article-excerpt-input"]').fill('چگونگی خلق ۳۰ ست متمایز با چند قطعه اصلی در فصل پاییز.')
    await page.locator('[data-testid="article-content-input"]').fill('استایل مینیمال بر پایه اصالت الیاف شکل می‌گیرد و هر تکه باید داستانی از راحتی و هنر باشد.')

    // کلیک روی دکمه انتشار
    await page.locator('[data-testid="publish-article-btn"]').click()

    // هدایت به لیست مقالات و مشاهده مقاله جدید در جدول
    await page.waitForURL('**/internal-ops-nexus/articles**', { timeout: 10000 })
    await expect(page.locator('[data-testid="articles-table"]')).toContainText('روایت کمد مینیمال پاییزی آتلیه')
  })
})
