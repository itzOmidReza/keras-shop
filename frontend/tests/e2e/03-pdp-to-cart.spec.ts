import { test, expect } from '@playwright/test'

test.describe('PDP, Metric Size Guide, Cart & Wishlist Flow', () => {
  test('should verify metric size guide, select size, add to cart, and toggle wishlist', async ({ page }) => {
    // ۱. ناوبری به صفحه محصول مشخص
    await page.goto('/products/calm-seamless-leggings-black')
    await expect(page.locator('h1')).toContainText('لگ')

    // ۲. باز کردن مدال راهنمای سایز
    const sizeGuideBtn = page.getByRole('button', { name: /راهنمای سایز/i })
    await expect(sizeGuideBtn).toBeVisible()
    await sizeGuideBtn.click()

    // بررسی باز شدن مدال
    const modal = page.locator('div[role="dialog"]')
    await expect(modal).toBeVisible()
    await expect(modal.getByText(/راهنمای سایز و تنخور تخصصی کراس/i)).toBeVisible()

    // ۳. بررسی رعایت واحدهای کاملاً متریک (CM/KG) و نبود واحدهای اینچ و پوند
    await expect(modal.getByText(/دور کمر \(CM\)/i)).toBeVisible()
    await expect(modal.getByText(/قد داخل پا \(CM\)/i)).toBeVisible()
    await expect(modal).not.toContainText(/inch|inches|lbs|pound/i)

    // ورود به تب محاسبه‌گر هوشمند
    const calculatorTab = modal.getByRole('tab', { name: /محاسبه‌گر هوشمند فیت/i })
    await calculatorTab.click()
    await expect(modal.getByText(/قد شما \(سانتی‌متر\)/i)).toBeVisible()
    await expect(modal.getByText(/وزن شما \(کیلوگرم\)/i)).toBeVisible()
    await expect(modal.getByText(/سایز پیشنهادی/i)).toBeVisible()

    // بستن مدال راهنمای سایز
    await page.keyboard.press('Escape')
    await expect(modal).not.toBeVisible()

    // ۴. انتخاب سایز و افزودن به سبد خرید
    const sizePill = page.getByRole('button', { name: 'M', exact: true }).first()
    await expect(sizePill).toBeVisible()
    await sizePill.click()

    const addToCartBtn = page.getByRole('button', { name: 'افزودن به سبد خرید' }).first()
    await expect(addToCartBtn).toBeEnabled()
    await addToCartBtn.click()

    // ۵. بررسی باز شدن دراور سبد خرید و وجود کالا با سایز و قیمت
    const cartDrawer = page.locator('div[role="dialog"], [data-slot="sheet-content"]').last()
    await expect(cartDrawer).toBeVisible()
    await expect(cartDrawer.getByText(/سبد خرید/i).first()).toBeVisible()
    await expect(cartDrawer.getByText(/سایز M/i)).toBeVisible()

    // بررسی نوار پیشرفت ارسال رایگان
    await expect(cartDrawer.getByText(/ارسال رایگان/i)).toBeVisible()

    // بستن دراور سبد خرید
    const closeDrawerBtn = cartDrawer.getByRole('button', { name: /بستن|X/i }).first()
    if (await closeDrawerBtn.isVisible()) {
      await closeDrawerBtn.click()
    } else {
      await page.keyboard.press('Escape')
    }

    // ۶. تست افزودن به علاقه‌مندی‌ها (Wishlist)
    const wishlistBtn = page.getByRole('button', { name: /افزودن به علاقه‌مندی‌ها|حذف از علاقه‌مندی‌ها/i }).first()
    await wishlistBtn.click()

    // بررسی شمارنده علاقه‌مندی‌ها در هدر (در دسکتاپ) یا ناوبری به صفحه ویش‌لیست
    await page.goto('/wishlist')
    await expect(page.locator('h1')).toContainText('علاقه‌مندی‌ها')
    // وجود حداقل یک محصول ذخیره شده
    await expect(page.locator('body')).toContainText('لگ')
  })
})
