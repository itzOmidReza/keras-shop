import { test, expect } from '@playwright/test'

test.describe('Full 2-Step Checkout & Simulated Shaparak IPG Flow', () => {
  test('should complete 2-step checkout, redirect to IPG gateway, simulate payment, verify callback, and track order', async ({ page }) => {
    // ۱. افزودن کالا به سبد خرید از طریق صفحه محصول
    await page.goto('/products/karen-slub-linen-blouse')
    await page.waitForLoadState('networkidle')
    const sizePill = page.getByRole('button', { name: 'M', exact: true }).first()
    await sizePill.click()
    const addToCartBtn = page.getByRole('button', { name: 'افزودن به سبد خرید' }).first()
    await addToCartBtn.click()

    // رفتن به صفحه سبد خرید و سپس تسویه‌حساب
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('h1')).toContainText('سبد خرید')

    const proceedToCheckoutBtn = page.getByRole('button', { name: /ادامه جهت تسویه حساب/i }).first()
    await proceedToCheckoutBtn.click()

    // ۲. ورود به مرحله اول تسویه‌حساب (اطلاعات تحویل‌گیرنده و آدرس)
    await expect(page).toHaveURL(/.*\/checkout/)
    await expect(page.locator('h2').first()).toContainText('اطلاعات تحویل‌گیرنده')

    // اطمینان از تکمیل هیدراتاسیون و تعاملی شدن فرم
    const fullNameInput = page.locator('#fullName')
    await expect(fullNameInput).toBeVisible()
    await fullNameInput.click()
    await fullNameInput.fill('مهسا احمدی')
    await expect(fullNameInput).toHaveValue('مهسا احمدی')

    const phoneInput = page.locator('#phoneNumber')
    await phoneInput.click()
    await phoneInput.fill('09129876543')
    await expect(phoneInput).toHaveValue('09129876543')

    const addressInput = page.locator('#exactAddress')
    await addressInput.click()
    await addressInput.fill('خیابان ولیعصر، بالاتر از پارک وی، کوچه فرشته، پلاک ۱۲')
    await expect(addressInput).toHaveValue('خیابان ولیعصر، بالاتر از پارک وی، کوچه فرشته، پلاک ۱۲')

    const postalInput = page.locator('#postalCode')
    await postalInput.click()
    await postalInput.fill('1965843210')
    await expect(postalInput).toHaveValue('1965843210')

    // ۳. ادامه به مرحله ۲ (ارسال و پرداخت)
    const nextStepBtn = page.getByRole('button', { name: /انتخاب شیوه ارسال و پرداخت/i })
    await expect(nextStepBtn).toBeVisible()
    await nextStepBtn.click()

    // بررسی ورود به مرحله ۲
    await expect(page.getByText('شیوه پرداخت وجه')).toBeVisible()

    // شیوه پرداخت پیش‌فرض آنلاین شاپرک است
    const submitOrderBtn = page.getByRole('button', { name: /ثبت نهایی سفارش و پرداخت/i })
    await submitOrderBtn.click()

    // بررسی و تایید شماره همراه کاربر مهمان با کد یک‌بار مصرف OTP درون‌برنامه‌ای
    const otpDialog = page.locator('[data-testid="checkout-otp-dialog"]')
    await expect(otpDialog).toBeVisible({ timeout: 10000 })

    const bypassBtn = otpDialog.locator('[data-testid="checkout-otp-bypass"]')
    if (await bypassBtn.isVisible()) {
      await bypassBtn.click()
    } else {
      const otpInput = otpDialog.locator('input[autocomplete="one-time-code"], [data-slot="input-otp"] input, input[inputmode="numeric"]').last()
      if (await otpInput.isVisible()) {
        await otpInput.focus()
        await page.keyboard.type('12345', { delay: 50 })
      }
      const confirmOtpBtn = otpDialog.getByRole('button', { name: /تایید و ادامه پرداخت/i })
      if (await confirmOtpBtn.isVisible()) {
        await confirmOtpBtn.click()
      }
    }

    // ۴. هدایت به درگاه پرداخت شاپرک (/checkout/gateway?token=...)
    await expect(page).toHaveURL(/.*\/checkout\/gateway\?token=.+/, { timeout: 15000 })

    // بررسی عناصر ظاهری درگاه
    await expect(page.getByText('سامانه پرداخت الکترونیک شاپرک')).toBeVisible()
    await expect(page.getByText('نام پذیرنده:')).toBeVisible()
    await expect(page.getByText(/زمان باقی‌مانده:/i)).toBeVisible()

    // ۵. کلیک روی دکمه شبیه‌ساز پرداخت موفقیت‌آمیز
    const devSuccessBtn = page.getByRole('button', { name: /تست پرداخت موفق/i })
    await expect(devSuccessBtn).toBeVisible()
    await devSuccessBtn.click()

    // ۶. بررسی هدایت از مسیر callback به صفحه رسید نهایی (/checkout/success)
    await expect(page).toHaveURL(/.*\/checkout\/success\?order=KERAS-.+/, { timeout: 15000 })

    // بررسی رسید موفقیت
    await expect(page.locator('h1')).toContainText('از خرید شما سپاسگزاریم')
    await expect(page.getByText('کد مرجع شاپرک (RRN):')).toBeVisible()

    // ۷. کلیک روی دکمه پیگیری سفارش با کد رهگیری
    const trackingBtn = page.getByRole('link', { name: /پیگیری سفارش با کد رهگیری/i })
    await expect(trackingBtn).toBeVisible()
    await trackingBtn.click()

    // بررسی ورود به صفحه رهگیری (/tracking?order=KERAS-...)
    await expect(page).toHaveURL(/.*\/tracking\?order=KERAS-.+/)
    await expect(page.getByText(/کد سفارش:/i)).toBeVisible()
  })
})
