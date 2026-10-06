// app/stores/settings.ts
import { defineStore } from 'pinia'
import type { SiteSettings } from '~/types/domain'
import { toast } from 'vue-sonner'

export const defaultSiteSettings: SiteSettings = {
  branding: {
    brandNameFa: 'کراس',
    brandNameEn: 'Keras',
    tagline: 'زیبایی در سادگی، آزادی در حرکت',
    subTagline: 'پوشاک تخصصی تمرین و روزمره زنانه',
    logoUrl: '/logo.svg',
    faviconUrl: '/favicon.ico',
    metaDescription: 'پوشاک تخصصی زنانه کراس - بافت‌های بدون درز، راحتی و آزادی حرکت',
  },
  contact: {
    supportPhone: '۰۲۱-۸۸۸۸۴۴۲۲',
    supportPhoneRaw: '02188884422',
    inquiryMobile: '09120000000',
    whatsappNumber: '09120000000',
    officialEmail: 'care@keras.ir',
    atelierAddress: 'تهران، جردن، خیابان سعیدی، پلاک ۲۴',
    workingHours: 'شنبه تا پنج‌شنبه: ۹ الی ۱۸',
  },
  shipping: {
    freeShippingThreshold: 1500000,
    flatShippingFee: 65000,
    estimatedDispatchText: 'ارسال ۲ تا ۴ روز کاری با پست پیشتاز و تیپاکس',
    announcementBarText: 'ارسال رایگان برای تمام سفارش‌های بالای ۱٫۵۰۰٫۰۰۰ تومان',
    announcementBarHighlight: 'ضمانت تعویض تا ۷ روز کاری',
    announcementBarVisible: true,
  },
  checkoutRules: {
    minCartTotal: 100000,
    maxItemQuantityPerCart: 5,
    reservationTimeoutMinutes: 15,
    returnPolicyDays: 7,
    holidayModeEnabled: false,
    holidayNoticeText: 'فروشگاه موقتاً به دلیل تعطیلات ارسال سفارشات را متوقف کرده است.',
  },
  social: {
    instagram: 'https://instagram.com/keras.brand',
    telegram: 'https://t.me/kerasbrand',
    pinterest: 'https://pinterest.com/kerasbrand',
    youtube: 'https://youtube.com/@kerasbrand',
  },
  integrations: {
    googleAnalyticsId: 'G-KERAS2026',
    googleTagManagerId: 'GTM-KERAS01',
    enamadCode: '12345678',
    samandehiCode: '87654321',
    smsProviderSender: '30007788',
    smsProviderBalance: 125000,
  },
  homeHero: {
    badgeText: 'طراحی اختصاصی • تیراژ محدود پاییز ۱۴۰۵',
    titlePrefix: 'استایل منحصربه‌فرد',
    titleHighlight: 'پاییز',
    titleSuffix: 'خود را بسازید',
    description: 'تلفیق پارچه‌های الیاف طبیعی، بافت‌های مرینوس و ابریشم خالص با الگوهای مدرن برای بانوان آگاه.',
    primaryCtaText: 'مشاهده کالکشن پاییز',
    primaryCtaLink: '/shop?season=fall-1405',
    secondaryCtaText: 'اکسسوری و شال‌ها',
    secondaryCtaLink: '/shop?division=accessories',
    bottomBadgeText: 'کالکشن دست‌دوز استودیو کراس • نسخه محدود پاییز ۱۴۰۵',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'مدل کالکشن پاییز ۱۴۰۵ کراس با پالتوی پشمی و بافت لوکس',
    imageBadgeLabel: 'طراحی کپسولی',
    imageBadgeValue: 'پاییز ۱۴۰۵ • Fall Drop',
  },
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SiteSettings>(JSON.parse(JSON.stringify(defaultSiteSettings)))
  const isLoading = ref(false)
  const isSaving = ref(false)
  const isHydrated = ref(false)
  const error = ref<string | null>(null)

  // بازیابی اولیه‌ در کلاینت برای اطمینان از به‌روز بودن متغیرها
  if (import.meta.client) {
    onNuxtReady(() => {
      fetchSettings().catch(() => {})
      isHydrated.value = true
    })
  }

  async function fetchSettings() {
    isLoading.value = true
    error.value = null
    try {
      const data = await $fetch<SiteSettings>('/api/settings')
      if (data) {
        settings.value = data
      }
      return data
    } catch (err: unknown) {
      const errorObj = err as { message?: string }
      error.value = errorObj?.message || 'خطا در دریافت تنظیمات فروشگاه'
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function updateSettings(updated: Partial<SiteSettings>) {
    isSaving.value = true
    error.value = null
    try {
      const data = await $fetch<SiteSettings>('/api/settings', {
        method: 'PUT',
        body: updated,
      })
      if (data) {
        settings.value = data
        toast.success('تنظیمات فروشگاه با موفقیت ذخیره شد.')
      }
      return data
    } catch (err: unknown) {
      const errorObj = err as { data?: { statusMessage?: string }; message?: string }
      const msg = errorObj?.data?.statusMessage || errorObj?.message || 'خطا در ذخیره تنظیمات'
      error.value = msg
      toast.error(msg)
      throw err
    } finally {
      isSaving.value = false
    }
  }

  async function resetSettings() {
    isSaving.value = true
    try {
      const data = await $fetch<SiteSettings>('/api/settings', {
        method: 'PUT',
        body: JSON.parse(JSON.stringify(defaultSiteSettings)),
      })
      if (data) {
        settings.value = data
        toast.success('تنظیمات به مقادیر پیش‌فرض بازگردانی شدند.')
      }
      return data
    } catch (err: unknown) {
      toast.error('خطا در بازگردانی تنظیمات.')
      throw err
    } finally {
      isSaving.value = false
    }
  }

  return {
    settings,
    isLoading,
    isSaving,
    isHydrated,
    error,
    fetchSettings,
    updateSettings,
    resetSettings,
  }
})

export default useSettingsStore
