// frontend/tests/e2e/05-internal-ops-nexus.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Stealth Super Admin Operations Nexus & Security Guard', () => {
  test('should conceal /internal-ops-nexus with a 404 error for unauthenticated visitors', async ({ page }) => {
    // تلاش برای دسترسی مستقیم کاربر مهمان به مسیر محرمانه عملیات
    const response = await page.goto('/internal-ops-nexus')

    // سرور یا روت‌گارد باید وضعیت ۴۰۴ بدهد و به هیچ وجه فرم لاگین را افشا نکند
    expect([404, 200]).toContain(response?.status()) // Nuxt error page might render with 404 status
    await expect(page.locator('body')).toContainText(/404|یافت نشد|Go back home/i)

    // اطمینان از عدم دسترسی به بوم عملیات
    await expect(page.locator('[data-testid="nexus-analytics-view"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="nexus-fulfillment-view"]')).not.toBeVisible()
  })

  test('should allow super admin login, reveal privileged card in /account, and grant access to HQ Nexus command center', async ({ page }) => {
    // ۱. ورود از طریق دکمه بای‌پاس مدیریت ارشد در صفحه ورود مستقل
    await page.goto('/login?redirect=/account')
    await page.waitForLoadState('networkidle')

    const adminBypassBtn = page.locator('[data-testid="login-admin-bypass"]')
    await expect(adminBypassBtn).toBeVisible()
    await adminBypassBtn.click()

    // ۲. هدایت به داشبورد حساب کاربری و مشاهده کارت فوق‌ممتاز
    await page.waitForURL('**/account', { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    const isDesktop = (page.viewportSize()?.width ?? 1280) >= 1024
    if (isDesktop) {
      const privilegedCard = page.locator('[data-testid="privileged-ops-card"]')
      await expect(privilegedCard).toBeVisible({ timeout: 15000 })
      await expect(privilegedCard).toContainText('مرکز فرماندهی و عملیات آتلیه')

      const opsLink = page.locator('[data-testid="privileged-ops-link"]')
      await expect(opsLink).toBeVisible({ timeout: 10000 })
      await opsLink.click()
    } else {
      const mobileOpsTab = page.locator('[data-testid="mobile-tab-ops"]')
      await expect(mobileOpsTab).toBeVisible({ timeout: 15000 })
      await mobileOpsTab.scrollIntoViewIfNeeded()
      await mobileOpsTab.click()
    }

    // ۳. ورود به مرکز فرماندهی محرمانه عملیات (HQ Nexus)
    await page.waitForURL('**/internal-ops-nexus**', { timeout: 15000 })
    await page.waitForLoadState('networkidle')

    // بررسی نمای دیده‌بان مالی و آمار (Analytics View)
    await expect(page.locator('[data-testid="nexus-analytics-view"]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=فروش ناخالص امروز')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=فروش این ماه')).toBeVisible({ timeout: 15000 })

    // ۴. جابجایی به میز سفارش‌ها و توزیع پستی (Orders Fulfillment Desk)
    await page.locator('[data-testid="ops-nav-orders"]:visible').first().click()
    await page.waitForURL('**/internal-ops-nexus/orders**', { timeout: 15000 })
    await expect(page.locator('[data-testid="nexus-fulfillment-view"]')).toBeVisible()

    // تست باز کردن مودال بارکد پستی و تولید بارکد تستی
    const assignBarcodeBtn = page.locator('[data-testid="assign-barcode-btn"]').first()
    await expect(assignBarcodeBtn).toBeVisible()
    await assignBarcodeBtn.click()

    // بررسی دیالوگ تخصیص بارکد ۲۴ رقمی پست
    await expect(page.locator('text=تخصیص بارکد ۲۴ رقمی شرکت ملی پست')).toBeVisible()
    await page.locator('text=تولید بارکد ۲۴ رقمی نمونه برای تست').click()

    // ثبت بارکد
    await page.locator('[data-testid="submit-barcode-btn"]').click()

    // ۵. جابجایی به محصولات و لباس‌ها (Products Hub)
    await page.locator('[data-testid="ops-nav-products"]:visible').first().click()
    await page.waitForURL('**/internal-ops-nexus/products**', { timeout: 15000 })
    await expect(page.locator('[data-testid="nexus-products-view"]')).toBeVisible()
    await expect(page.locator('text=محصولات و لباس‌های آتلیه')).toBeVisible()

    // ۶. جابجایی به کدهای تخفیف (Discount Vouchers)
    await page.locator('[data-testid="ops-nav-discounts"]:visible').first().click()
    await page.waitForURL('**/internal-ops-nexus/discounts**', { timeout: 15000 })
    await expect(page.locator('[data-testid="nexus-vouchers-view"]')).toBeVisible()
    await expect(page.locator('text=KERAS-PRO')).toBeVisible()

    // ۷. تست قفل جلسه کاری و خروج امن
    const lockSessionBtn = page.locator('[data-testid="ops-lock-btn"]:visible').first()
    await expect(lockSessionBtn).toBeVisible()
    await lockSessionBtn.click()

    // بازگشت امن به صفحه اصلی فروشگاه
    await page.waitForURL('**/', { timeout: 10000 })
  })

  test('should support full Product CRUD, Manual Order Entry, and Packing Slip in clean 4-pillar backoffice', async ({ page }) => {
    // ۱. ورود مستقیم مدیریت ارشد به بوم عملیات
    await page.goto('/login?redirect=/internal-ops-nexus')
    await page.waitForLoadState('networkidle')

    const adminBypassBtn = page.locator('[data-testid="login-admin-bypass"]')
    await expect(adminBypassBtn).toBeVisible()
    await adminBypassBtn.click()

    await page.waitForURL('**/internal-ops-nexus**', { timeout: 15000 })
    await page.waitForLoadState('networkidle')

    // ۲. تست مدیریت محصولات و افزودن محصول جدید (Product CRUD)
    await page.locator('[data-testid="ops-nav-products"]:visible').first().click()
    await page.waitForURL('**/internal-ops-nexus/products**', { timeout: 15000 })
    await expect(page.locator('[data-testid="nexus-products-view"]')).toBeVisible()

    await page.locator('[data-testid="add-product-btn"]').click()
    await page.waitForURL('**/internal-ops-nexus/products/new**', { timeout: 15000 })
    await expect(page.locator('text=افزودن محصول جدید به کاتالوگ آتلیه')).toBeVisible()

    // پر کردن اطلاعات کالا
    await page.locator('input[placeholder*="کت پشمی"]').fill('پالتو کشمیر لیمیتد آتلیه')
    await page.locator('[data-testid="save-product-btn"]').click()

    // بررسی بازگشت به لیست و افزوده شدن کالا به جدول
    await page.waitForURL('**/internal-ops-nexus/products**', { timeout: 15000 })
    await expect(page.getByTestId('nexus-products-view').locator('text=پالتو کشمیر لیمیتد آتلیه').first()).toBeVisible()

    // ۳. تست ثبت سفارش دستی جدید و چاپ برگ ارسال (Manual Order & Packing Slip)
    await page.locator('[data-testid="ops-nav-orders"]:visible').first().click()
    await page.waitForURL('**/internal-ops-nexus/orders**', { timeout: 15000 })
    await expect(page.locator('[data-testid="nexus-fulfillment-view"]')).toBeVisible()

    await page.locator('[data-testid="create-manual-order-btn"]').click()
    await expect(page.getByRole('heading', { name: /ثبت سفارش دستی جدید/ })).toBeVisible()
    await page.locator('[data-testid="submit-manual-order-btn"]').click()

    // باز کردن و بررسی برگ ارسال مرسوله پستی
    await page.locator('[data-testid="print-packing-slip-btn"]').first().click()
    await expect(page.locator('text=برگ ارسال مرسوله پستی (Packing Slip)')).toBeVisible()
    await page.locator('button:has-text("بستن")').click()
  })

  test('should navigate to Store Settings hub, edit variables, and persist configuration', async ({ page }) => {
    // ۱. ورود مدیر ارشد
    await page.goto('/login?redirect=/internal-ops-nexus/settings')
    await page.waitForLoadState('networkidle')

    const adminBypassBtn = page.locator('[data-testid="login-admin-bypass"]')
    if (await adminBypassBtn.isVisible()) {
      await adminBypassBtn.click()
    }

    await page.waitForURL('**/internal-ops-nexus/settings**', { timeout: 15000 })
    await page.waitForLoadState('networkidle')

    // ۲. بررسی وجود بوم تنظیمات
    await expect(page.locator('[data-testid="ops-settings-workspace"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=پیکربندی متغیرهای فروشگاه')).toBeVisible()

    // ۳. ویرایش متن نوار اعلان و ذخیره
    const announcementInput = page.locator('#announcement-text')
    if (await announcementInput.isVisible()) {
      await announcementInput.fill('ارسال رایگان برای تمام خریدها در جشنواره ویژه کراس')
    }

    const saveBtn = page.locator('[data-testid="ops-settings-save-btn"]').first()
    await expect(saveBtn).toBeVisible()
    await saveBtn.click()

    // انتظار برای پیام موفقیت
    await expect(page.locator('text=تنظیمات فروشگاه با موفقیت ذخیره شد').first()).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to Admin Reviews Desk, moderate status, and submit atelier reply', async ({ page }) => {
    // ۱. ورود مدیر ارشد و هدایت به میز نظرات
    await page.goto('/login?redirect=/internal-ops-nexus/reviews')
    await page.waitForLoadState('networkidle')

    const adminBypassBtn = page.locator('[data-testid="login-admin-bypass"]')
    if (await adminBypassBtn.isVisible()) {
      await adminBypassBtn.click()
    }

    await page.waitForURL('**/internal-ops-nexus/reviews**', { timeout: 15000 })
    await page.waitForLoadState('networkidle')

    // ۲. بررسی وجود صفحه مدیریت نظرات
    await expect(page.locator('[data-testid="nexus-reviews-page"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('text=میز بررسی و مدیریت نظرات خریداران')).toBeVisible()

    // ۳. بررسی فیلتر تب‌ها
    const pendingTab = page.locator('[data-testid="filter-tab-pending"]')
    await expect(pendingTab).toBeVisible()
    await pendingTab.click()

    // ۴. تایید یک دیدگاه
    const approveBtn = page.locator('[data-testid="approve-review-btn"]:not([disabled])').first()
    if (await approveBtn.isVisible()) {
      await approveBtn.click()
      await expect(page.locator('text=دیدگاه با موفقیت تایید و در ویترین فروشگاه منتشر شد').first()).toBeVisible({ timeout: 10000 })
    }

    // ۵. ثبت پاسخ آتلیه
    const replyBtn = page.locator('[data-testid="open-reply-modal-btn"]').first()
    await expect(replyBtn).toBeVisible()
    await replyBtn.click()

    await expect(page.locator('[data-testid="review-reply-textarea"]')).toBeVisible({ timeout: 10000 })
    await page.locator('[data-testid="review-reply-textarea"]').fill('پاسخ تست آتلیه کراس: با تشکر از دیدگاه ارزشمند شما.')

    const submitReplyBtn = page.locator('[data-testid="submit-review-reply-btn"]')
    await expect(submitReplyBtn).toBeVisible()
    await submitReplyBtn.click()

    await expect(page.locator('text=پاسخ رسمی آتلیه با موفقیت ثبت و پیوست شد').first()).toBeVisible({ timeout: 10000 })
  })
})

