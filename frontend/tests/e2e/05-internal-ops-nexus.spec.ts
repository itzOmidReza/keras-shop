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
})
