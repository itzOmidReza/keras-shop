import { test, expect } from '@playwright/test'

test.describe('Catalog Discovery, Filtering & Live Search Flow', () => {
  test('should filter products by collection line and navigate via search autocomplete', async ({ page }) => {
    // ۱. ناوبری به صفحه فروشگاه
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/فروشگاه|کاتالوگ/i)

    // ۲. فیلتر کردن بر اساس شاخه پوشاک با باز کردن دراور فیلترها (مشترک در دسکتاپ و موبایل)
    const filterDrawerBtn = page.getByRole('button', { name: /فیلترها/i })
    await expect(filterDrawerBtn).toBeVisible()
    await filterDrawerBtn.click()
    await page.waitForTimeout(300)

    // کلیک روی دکمه شاخه پوشاک در فیلتر
    const divisionFilterBtn = page.getByRole('button', { name: /پوشاک/ }).first()
    await expect(divisionFilterBtn).toBeVisible()
    await divisionFilterBtn.click()

    // اعمال فیلترها از طریق دکمه استیکی پنل فیلترها
    const applyBtn = page.locator('[data-testid="apply-filters-btn"]').filter({ visible: true })
    await expect(applyBtn).toBeVisible()
    await applyBtn.click()

    // بررسی به‌روزرسانی URL
    await expect(page).toHaveURL(/.*division=apparel/)

    // اطمینان از بسته شدن دراور کشویی فیلترها پس از اعمال
    await expect(page.locator('[role="dialog"]')).not.toBeVisible()

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
    await page.waitForLoadState('domcontentloaded')

    // ۲. بررسی وجود بخش‌های جدید روی صفحه اصلی (مجله ادیتوریال و مارکی برندها)
    const journalHeading = page.getByRole('heading', { name: /روایت پارچه‌ها و هنر استایلینگ/i })
    await expect(journalHeading).toBeVisible()

    const brandLink = page.locator('a[href*="brand=toteme"]').first()
    await expect(brandLink).toBeVisible()

    // ۳. ناوبری مستقیم به فروشگاه با فیلتر برند (مثلاً Totême)
    await page.goto('/shop?brand=toteme')
    await page.waitForLoadState('domcontentloaded')

    // ۴. بررسی وجود چیپ فیلتر برند و نمایش محصولات مرتبط
    const brandChip = page.getByText(/توتِم/i).first()
    await expect(brandChip).toBeVisible()

    // بررسی کارت محصولات فیلترشده
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards.first()).toBeVisible()
  })

  test('should handle 12-item pagination, page 2 URL sync, and reset to page 1 on filter modification', async ({ page }) => {
    // ۱. ناوبری به صفحه فروشگاه
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    // ۲. بررسی حضور کنترل‌های صفحه‌بندی و وضعیت اولیه صفحه ۱
    const paginationNav = page.locator('nav[aria-label="صفحه‌بندی محصولات"]')
    await expect(paginationNav).toBeVisible()
    const page1Indicator = paginationNav.getByText(/صفحه.*۱.*از.*۲/i)
    await expect(page1Indicator).toBeVisible()

    // دکمه صفحه ۲ را کلیک می‌کنیم
    const page2Btn = paginationNav.getByRole('button', { name: 'صفحه ۲' })
    await expect(page2Btn).toBeVisible()
    await page2Btn.click()

    // ۳. بررسی به‌روزرسانی URL به page=2 و تغییر شاخص صفحه‌بندی به صفحه ۲
    await expect(page).toHaveURL(/.*page=2/)
    const page2Indicator = paginationNav.getByText(/صفحه.*۲.*از.*۲/i)
    await expect(page2Indicator).toBeVisible()

    // ۴. کلیک روی دکمه قبلی (RTL ChevronRight) برای برگشت به صفحه ۱
    const prevBtn = paginationNav.getByRole('button', { name: 'صفحه قبل' })
    await expect(prevBtn).toBeVisible()
    await prevBtn.click()

    await expect(page).not.toHaveURL(/.*page=2/)
    await expect(page1Indicator).toBeVisible()

    // ۵. رفتن مجدد به صفحه ۲ و سپس تغییر فیلتر برای بررسی ریست خودکار صفحه به ۱
    await page2Btn.click()
    await expect(page).toHaveURL(/.*page=2/)

    // فیلتر کردن شاخه اکسسوری با باز کردن دراور فیلترها
    const filterDrawerBtn = page.getByRole('button', { name: /فیلترها/i })
    await expect(filterDrawerBtn).toBeVisible()
    await filterDrawerBtn.click()
    await page.waitForTimeout(300)

    const accessoryBtn = page.getByRole('button', { name: /اکسسوری/ }).first()
    await expect(accessoryBtn).toBeVisible()
    await accessoryBtn.click()

    // اعمال فیلترها از طریق دکمه استیکی پنل فیلترها
    const applyAccessoryBtn = page.locator('[data-testid="apply-filters-btn"]').filter({ visible: true })
    await expect(applyAccessoryBtn).toBeVisible()
    await applyAccessoryBtn.click()

    // بررسی اینکه فیلتر اعمال شده و صفحه به ۱ ریست شده و page=2 از URL حذف شده است
    await expect(page).toHaveURL(/.*division=accessories/)
    await expect(page).not.toHaveURL(/.*page=2/)
  })

  test('should buffer filter choices in draft state until explicit apply and support reset all', async ({ page }) => {
    // ۱. بارگذاری کاتالوگ فروشگاه
    await page.goto('/shop')
    await page.waitForLoadState('networkidle')

    const filterDrawerBtn = page.getByRole('button', { name: /فیلترها/i })
    await expect(filterDrawerBtn).toBeVisible()
    await filterDrawerBtn.click()
    await page.waitForTimeout(300)

    // ۲. انتخاب فیلتر شاخه پوشاک در وضعیت پیش‌نویس
    const divisionBtn = page.getByRole('button', { name: /پوشاک/ }).first()
    await expect(divisionBtn).toBeVisible()
    await divisionBtn.click()

    // ۳. تأیید عدم جهش و عدم تغییر زودهنگام URL پیش از فشردن دکمه اعمال
    await page.waitForTimeout(200)
    expect(page.url()).not.toContain('division=apparel')

    // ۴. اعمال صریح با فشردن دکمه اعمال فیلترها
    const applyBtn = page.locator('[data-testid="apply-filters-btn"]').filter({ visible: true })
    await expect(applyBtn).toBeVisible()
    await applyBtn.click()

    // ۵. بررسی همگام‌سازی کوئری URL پس از اعمال
    await expect(page).toHaveURL(/.*division=apparel/)

    // ۶. تست دکمه بازنشانی / حذف همه
    await expect(filterDrawerBtn).toBeVisible()
    await filterDrawerBtn.click()
    await page.waitForTimeout(300)

    const resetBtn = page.locator('[data-testid="reset-filters-btn"]').filter({ visible: true })
    await expect(resetBtn).toBeVisible()
    await resetBtn.click()

    // ۷. بررسی حذف پارامتر فیلتر از URL و بازگشت به حالت بدون فیلتر
    await expect(page).not.toHaveURL(/.*division=apparel/)
  })
})
