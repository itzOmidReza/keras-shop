import { test, expect } from '@playwright/test'

test.describe('Catalog Discovery, Filtering & Live Search Flow', () => {
  test('should filter products by collection line and navigate via search autocomplete', async ({ page, isMobile }) => {
    // ۱. ناوبری به صفحه فروشگاه
    await page.goto('/shop')
    await expect(page).toHaveTitle(/فروشگاه|کاتالوگ/i)

    // ۲. فیلتر کردن بر اساس لاین Move
    if (isMobile) {
      // در حالت موبایل، ابتدا دراور فیلترها را باز می‌کنیم
      const filterDrawerBtn = page.getByRole('button', { name: /فیلترها/i })
      if (await filterDrawerBtn.isVisible()) {
        await filterDrawerBtn.click()
      }
    }

    // کلیک روی دکمه کالکشن پاییز ۱۴۰۵ در فیلتر فصل
    const seasonFilterBtn = page.getByRole('button', { name: /پاییز ۱۴۰۵/ }).first()
    await expect(seasonFilterBtn).toBeVisible()
    await seasonFilterBtn.click()

    // بررسی به‌روزرسانی URL
    await expect(page).toHaveURL(/.*season=fall-1405/)

    // بستن دراور فیلتر در صورت موبایل
    if (isMobile) {
      const applyBtn = page.getByRole('button', { name: /مشاهده.*محصول/i })
      if (await applyBtn.isVisible()) {
        await applyBtn.click()
      }
    }

    // ۳. استفاده از جست‌وجوی زنده ادیتوریال در هدر
    const searchTrigger = page.getByRole('button', { name: 'جست‌وجو' }).first()
    await searchTrigger.click()

    const searchInput = page.locator('#keras-search-autocomplete-input')
    await expect(searchInput).toBeVisible()
    await searchInput.fill('شومیز')

    // ۴. بررسی ظاهر شدن دراپ‌داون نتایج هوشمند با دسته‌بندی و قیمت‌ها
    const dropdown = page.locator('header').locator('div.divide-y')
    await expect(dropdown).toBeVisible({ timeout: 5000 })

    // بررسی وجود حداقل یک آیتم دارای تصویر و قیمت
    const firstResult = dropdown.locator('> div').first()
    await expect(firstResult).toBeVisible()
    await expect(firstResult.locator('img')).toBeVisible()

    // ۵. کلیک روی نتیجه اول و بررسی هدایت به صفحه محصول (/products/[slug])
    await firstResult.click()
    await expect(page).toHaveURL(/.*\/products\/.+/)

    // اطمینان از بارگذاری صحیح صفحه جزئیات کالا
    await expect(page.locator('h1')).toBeVisible()
  })
})
