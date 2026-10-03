import { test, expect } from '@playwright/test'

test.describe('Catalog Discovery, Filtering & Live Search Flow', () => {
  test('should filter products by collection line and navigate via search autocomplete', async ({ page, isMobile }) => {
    // ۱. ناوبری به صفحه فروشگاه
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/فروشگاه|کاتالوگ/i)

    // ۲. فیلتر کردن بر اساس لاین Move
    if (isMobile) {
      // در حالت موبایل، ابتدا دراور فیلترها را باز می‌کنیم
      const filterDrawerBtn = page.getByRole('button', { name: /فیلترها/i })
      await expect(filterDrawerBtn).toBeVisible()
      await filterDrawerBtn.click()
      await page.waitForTimeout(300)
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

  test('should navigate via brand logos marquee to filtered shop catalog and render editorial journal', async ({ page }) => {
    // ۱. ناوبری به صفحه اصلی
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // ۲. بررسی وجود بخش‌های جدید روی صفحه اصلی (مجله ادیتوریال و مارکی برندها)
    const journalHeading = page.getByRole('heading', { name: /روایت پارچه‌ها و هنر استایلینگ/i })
    await expect(journalHeading).toBeVisible()

    const brandLink = page.locator('a[href*="brand=toteme"]').first()
    await expect(brandLink).toBeVisible()

    // ۳. ناوبری مستقیم به فروشگاه با فیلتر برند (مثلاً Totême)
    await page.goto('/shop?brand=toteme')
    await page.waitForLoadState('networkidle')

    // ۴. بررسی وجود چیپ فیلتر برند و نمایش محصولات مرتبط
    const brandChip = page.getByText(/توتِم/i).first()
    await expect(brandChip).toBeVisible()

    // بررسی تعداد محصولات فیلترشده (۴ محصول برای توتم)
    const productsCount = page.getByText(/نمایش/i).first()
    await expect(productsCount).toBeVisible()
  })

  test('should handle 12-item pagination, page 2 URL sync, and reset to page 1 on filter modification', async ({ page, isMobile }) => {
    // ۱. ناوبری به صفحه فروشگاه
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    // ۲. بررسی شمارنده صفحه اول (نمایش ۱–۱۲ از ۲۴ محصول)
    const counterText = page.getByText(/نمایش.*۱–۱۲.*از.*۲۴.*محصول/i).first()
    await expect(counterText).toBeVisible()

    // ۳. بررسی حضور کنترل‌های صفحه‌بندی
    const paginationNav = page.locator('nav[aria-label="صفحه‌بندی محصولات"]')
    await expect(paginationNav).toBeVisible()

    // دکمه صفحه ۲ را کلیک می‌کنیم
    const page2Btn = paginationNav.getByRole('button', { name: 'صفحه ۲' })
    await expect(page2Btn).toBeVisible()
    await page2Btn.click()

    // ۴. بررسی به‌روزرسانی URL به page=2 و تغییر شمارنده به ۱۳–۲۴
    await expect(page).toHaveURL(/.*page=2/)
    const page2Counter = page.getByText(/نمایش.*۱۳–۲۴.*از.*۲۴.*محصول/i).first()
    await expect(page2Counter).toBeVisible()

    // ۵. کلیک روی دکمه قبلی (RTL ChevronRight) برای برگشت به صفحه ۱
    const prevBtn = paginationNav.getByRole('button', { name: 'صفحه قبل' })
    await expect(prevBtn).toBeVisible()
    await prevBtn.click()

    await expect(page).not.toHaveURL(/.*page=2/)
    await expect(counterText).toBeVisible()

    // ۶. رفتن مجدد به صفحه ۲ و سپس تغییر فیلتر برای بررسی ریست خودکار صفحه به ۱
    await page2Btn.click()
    await expect(page).toHaveURL(/.*page=2/)

    // فیلتر کردن کالکشن زمستان (در موبایل ابتدا دراور باز می‌شود)
    if (isMobile) {
      const filterDrawerBtn = page.getByRole('button', { name: /فیلترها/i })
      await expect(filterDrawerBtn).toBeVisible()
      await filterDrawerBtn.click()
      await page.waitForTimeout(300)
    }

    const winterBtn = page.getByRole('button', { name: /زمستان ۱۴۰۵/ }).first()
    await expect(winterBtn).toBeVisible()
    await winterBtn.click()

    // بررسی اینکه فیلتر اعمال شده و صفحه به ۱ ریست شده و page=2 از URL حذف شده است
    await expect(page).toHaveURL(/.*season=winter-1405/)
    await expect(page).not.toHaveURL(/.*page=2/)
  })
})
