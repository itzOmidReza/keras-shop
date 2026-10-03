import { test, expect } from '@playwright/test'

test.describe('SMS OTP Authentication & Customer Dashboard Flow', () => {
  test('should validate invalid phone, normalize Persian digits, verify OTP and access account', async ({ page }) => {
    // ۱. باز کردن صفحه اصلی
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/کراس|Keras/i)

    // ۲. کلیک روی دکمه ورود در هدر
    const userButton = page.locator('header').getByRole('button', { name: 'ورود به حساب کاربری' })
    await expect(userButton).toBeVisible()
    await userButton.click()

    // ۳. بررسی باز شدن مدال ورود
    const modal = page.locator('div[role="dialog"]')
    await expect(modal).toBeVisible()
    await expect(modal.getByText('ورود یا ثبت‌نام')).toBeVisible()

    // ۴. اعتبارسنجی شماره نامعتبر (پیش‌شماره غیر ۰۹)
    const phoneInput = page.locator('#auth-phone-input')
    await phoneInput.fill('08123456789')
    const submitPhoneBtn = modal.getByRole('button', { name: 'دریافت کد تایید' })
    await submitPhoneBtn.click()

    const phoneError = modal.locator('p.text-destructive')
    await expect(phoneError).toBeVisible()
    await expect(phoneError).toContainText('۰۹')

    // ۵. وارد کردن شماره معتبر ایرانی با اعداد فارسی و اطمینان از نرمال‌سازی به انگلیسی
    await phoneInput.fill('۰۹۱۲۱۲۳۴۵۶۷')
    await expect(phoneInput).toHaveValue('09121234567')

    // ۶. ارسال فرم و رفتن به مرحله کد OTP
    await submitPhoneBtn.click()

    // بررسی ورود به مرحله ۲ مدال
    await expect(modal.getByText('تایید شماره موبایل')).toBeVisible()
    await expect(modal.getByText('امکان ارسال مجدد کد تا')).toBeVisible()

    // ۷. پر کردن کد ۵ رقمی تست (12345)
    const otpInput = modal.locator('input[autocomplete="one-time-code"], [data-slot="input-otp"] input, input[inputmode="numeric"]').last()
    if (await otpInput.isVisible()) {
      await otpInput.focus()
      await page.keyboard.type('12345', { delay: 50 })
    } else {
      await page.keyboard.type('12345', { delay: 50 })
    }

    // تایید دستی در صورت عدم تایید خودکار
    const verifyBtn = modal.getByRole('button', { name: 'تایید و ورود به حساب' })
    if (await verifyBtn.isVisible()) {
      await verifyBtn.click()
    }

    // ۸. اطمینان از بسته شدن مدال و تغییر دکمه هدر به حساب کاربری
    await expect(modal).not.toBeVisible({ timeout: 10000 })
    const accountBtn = page.locator('header').getByRole('button', { name: /حساب کاربری/i })
    await expect(accountBtn).toBeVisible()

    // ۹. مراجعه به صفحه /account و بررسی بارگذاری مشخصات کاربر
    await page.goto('/account')
    await expect(page).toHaveURL(/.*\/account/)
    // اطمینان از نبود کارت مسدودکننده مهمان
    await expect(page.getByText('ورود به حساب کاربری جهت دسترسی')).not.toBeVisible()
    // نمایش شماره موبایل لاگین شده در داشبورد (با ارقام فارسی یا انگلیسی)
    await expect(page.locator('body')).toContainText(/۰۹۱۲۱۲۳۴۵۶۷|09121234567/)
  })

  test('should bypass authentication using demo account login on /account and open full dashboard', async ({ page }) => {
    // ۱. مراجعه مستقیم به صفحه حساب کاربری در حالت مهمان
    await page.goto('/account')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveURL(/.*\/account/)

    // ۲. بررسی وجود دکمه ورود سریع آزمایشی در کارت مهمان
    const demoLoginBtn = page.locator('[data-testid="demo-login-btn"]')
    await expect(demoLoginBtn).toBeVisible()
    await expect(page.getByText('برای دسترسی به پیشخوان، رهگیری سفارش‌ها')).toBeVisible()

    // ۳. کلیک روی دکمه ورود سریع آزمایشی
    await demoLoginBtn.click()

    // ۴. اطمینان از ناپدید شدن دکمه لاگین مهمان و رندر فوری داشبورد کاربر دمو سارا رادمنش
    await expect(demoLoginBtn).not.toBeVisible()
    await expect(page.locator('body')).toContainText('سارا رادمنش')
    await expect(page.locator('body')).toContainText(/۰۹۱۲۱۱۱۲۲۳۳|09121112233/)
    await expect(page.locator('body')).toContainText('sara.rad@example.com')

    // ۵. بررسی بارگذاری تب‌های پیشخوان، سفارش‌ها و آدرس‌ها
    await expect(page.getByRole('button', { name: /سفارش‌های من/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /دفترچه نشانی‌ها/i })).toBeVisible()
  })

  test('should allow one-click demo login from AuthModal', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // باز کردن مدال ورود از هدر
    const userButton = page.locator('header').getByRole('button', { name: 'ورود به حساب کاربری' })
    await userButton.click()

    const modal = page.locator('div[role="dialog"]')
    await expect(modal).toBeVisible()

    // کلیک روی دکمه ورود سریع آزمایشی در مدال
    const modalDemoBtn = modal.locator('[data-testid="modal-demo-login-btn"]')
    await expect(modalDemoBtn).toBeVisible()
    await modalDemoBtn.click()

    // انتظار هدایت به صفحه /account و نمایش مشخصات سارا رادمنش
    await expect(page).toHaveURL(/.*\/account/)
    await expect(modal).not.toBeVisible()
    await expect(page.locator('body')).toContainText('سارا رادمنش')
  })
})
