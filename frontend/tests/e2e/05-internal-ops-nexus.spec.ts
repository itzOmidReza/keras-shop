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
    await page.waitForURL('**/internal-ops-nexus**', { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    // بررسی هدر و نشان ضربان سرور
    await expect(page.locator('text=وضعیت سرور: آنلاین و پایدار')).toBeVisible()

    // بررسی نمای دیده‌بان مالی (Analytics View)
    await expect(page.locator('[data-testid="nexus-analytics-view"]')).toBeVisible()
    await expect(page.locator('text=فروش ناخالص دوره')).toBeVisible()
    await expect(page.locator('text=حاشیه سود خالص تخمینی')).toBeVisible()

    // ۴. جابجایی به میز سفارش‌ها و توزیع پستی (Fulfillment Desk)
    const fulfillmentTab = page.locator('[data-testid="tab-view-fulfillment"]')
    await fulfillmentTab.click()
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

    // ۵. جابجایی به ماتریس انبارداری و سایز (Inventory Matrix)
    const inventoryTab = page.locator('[data-testid="tab-view-inventory"]')
    await inventoryTab.click()
    await expect(page.locator('[data-testid="nexus-inventory-view"]')).toBeVisible()
    await expect(page.locator('text=کسری انبار').first()).toBeVisible()

    // ۶. جابجایی به کدهای تخفیف (Discount Vouchers)
    const vouchersTab = page.locator('[data-testid="tab-view-vouchers"]')
    await vouchersTab.click()
    await expect(page.locator('[data-testid="nexus-vouchers-view"]')).toBeVisible()
    await expect(page.locator('text=KERAS-PRO')).toBeVisible()

    // ۷. تست قفل جلسه کاری و خروج امن
    const lockSessionBtn = page.locator('[data-testid="ops-lock-btn"]')
    await expect(lockSessionBtn).toBeVisible()
    await lockSessionBtn.click()

    // بازگشت امن به صفحه اصلی فروشگاه
    await page.waitForURL('**/', { timeout: 10000 })
  })

  test('should support full Product CRUD, Manual Order Entry, Packing Slip, Financial Ledger, and CMS Journal Editor in clean light theme', async ({ page }) => {
    // ۱. ورود مستقیم مدیریت ارشد به بوم عملیات
    await page.goto('/login?redirect=/internal-ops-nexus')
    await page.waitForLoadState('networkidle')

    const adminBypassBtn = page.locator('[data-testid="login-admin-bypass"]')
    await expect(adminBypassBtn).toBeVisible()
    await adminBypassBtn.click()

    await page.waitForURL('**/internal-ops-nexus**', { timeout: 10000 })
    await page.waitForLoadState('networkidle')

    // ۲. تست مدیریت محصولات و افزودن محصول جدید (Product CRUD)
    await page.locator('[data-testid="tab-view-products"]').click()
    await expect(page.locator('[data-testid="nexus-products-view"]')).toBeVisible()

    await page.locator('[data-testid="add-product-btn"]').click()
    await expect(page.locator('text=افزودن محصول جدید به کاتالوگ آتلیه')).toBeVisible()

    // پر کردن اطلاعات کالا
    await page.locator('input[placeholder*="کت پشمی"]').fill('پالتو کشمیر لیمیتد آتلیه')
    await page.locator('[data-testid="save-product-btn"]').click()

    // بررسی افزوده شدن کالا به جدول
    await expect(page.getByTestId('nexus-products-view').locator('text=پالتو کشمیر لیمیتد آتلیه')).toBeVisible()

    // ۳. تست ثبت سفارش دستی جدید و چاپ برگ ارسال (Manual Order & Packing Slip)
    await page.locator('[data-testid="tab-view-fulfillment"]').click()
    await expect(page.locator('[data-testid="nexus-fulfillment-view"]')).toBeVisible()

    await page.locator('[data-testid="create-manual-order-btn"]').click()
    await expect(page.getByRole('heading', { name: /ثبت سفارش دستی جدید/ })).toBeVisible()
    await page.locator('[data-testid="submit-manual-order-btn"]').click()

    // باز کردن و بررسی برگ ارسال مرسوله پستی
    await page.locator('[data-testid="print-packing-slip-btn"]').first().click()
    await expect(page.locator('text=برگ ارسال مرسوله پستی (Packing Slip)')).toBeVisible()
    await page.locator('button:has-text("بستن")').click()

    // ۴. تست امور مالی و دفتر کل شاپرک (Financial Ledger)
    await page.locator('[data-testid="tab-view-finance"]').click()
    await expect(page.locator('[data-testid="nexus-finance-view"]')).toBeVisible()
    await expect(page.locator('text=فروش ناخالص (Gross)')).toBeVisible()
    await expect(page.locator('text=982301449102')).toBeVisible()

    // فیلتر زمانی
    await page.locator('button:has-text("۷ روز گذشته")').click()
    await expect(page.locator('[data-testid="export-finance-csv-btn"]')).toBeVisible()

    // ۵. تست سیستم مدیریت محتوای ژورنال (CMS Journal Editor)
    await page.locator('[data-testid="tab-view-articles"]').click()
    await expect(page.locator('[data-testid="nexus-articles-view"]')).toBeVisible()

    await page.locator('[data-testid="create-article-btn"]').click()
    await expect(page.locator('text=نگارش مقاله جدید در مجله ادیتوریال کراس')).toBeVisible()

    await page.locator('input[placeholder*="هنر لایه‌بندی"]').fill('راهنمای استایل پاییزه ۱۴۰۵')
    await page.locator('[data-testid="publish-article-btn"]').click()

    await expect(page.getByTestId('nexus-articles-view').locator('text=راهنمای استایل پاییزه ۱۴۰۵')).toBeVisible()
  })
})
