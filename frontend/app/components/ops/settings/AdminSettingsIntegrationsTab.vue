<!-- frontend/app/components/ops/settings/AdminSettingsIntegrationsTab.vue -->
<script setup lang="ts">
import {
  Search,
  BarChart3,
  MessageSquare,
} from '@lucide/vue'
import type { SiteBrandingSettings, SiteIntegrationsSettings } from '~/types/domain'

const branding = defineModel<SiteBrandingSettings>('branding', { required: true })
const integrations = defineModel<SiteIntegrationsSettings>('integrations', { required: true })
</script>

<template>
  <div class="space-y-6">
    <!-- بخش ۱: بهینه‌سازی موتورهای جست‌وجو (SEO) -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
          <Search class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            تنظیمات سئو و متاتگ‌های پیش‌فرض موتورهای جست‌وجو
          </h3>
          <p class="text-xs text-muted-foreground">
            پیکربندی پیش‌فرض عنوان و متای توضیحات جهت بهینه‌سازی نرخ کلیک در گوگل
          </p>
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="seo-meta-description" class="text-xs font-bold text-ink">
          توضیحات پیش‌فرض متا (Default Meta Description)
        </label>
        <textarea
          id="seo-meta-description"
          v-model="branding.metaDescription"
          rows="3"
          placeholder="پوشاک تخصصی زنانه کراس - بافت‌های بدون درز، راحتی و آزادی حرکت"
          class="w-full rounded-xl border border-sand bg-sand/15 p-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all leading-relaxed"
        />
        <p class="text-[11px] text-muted-foreground">
          این متن به عنوان چکیده در نتایج جست‌وجوی گوگل و پیش‌نمایش لینک‌ها قرار می‌گیرد.
        </p>
      </div>
    </div>

    <!-- بخش ۲: ابزارهای آماری و ره‌گیری کاربر -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center text-sage">
          <BarChart3 class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            اتصال به ابزارهای تحلیل رفتار کاربر (Analytics)
          </h3>
          <p class="text-xs text-muted-foreground">
            اتصال گوگل آنالیتیکس ۴ و گوگل تگ منیجر جهت سنجش نرخ تبدیل و رفتار خرید
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="ga-id" class="text-xs font-bold text-ink">
            شناسه اندازه‌گیری گوگل آنالیتیکس (GA4 Measurement ID)
          </label>
          <input
            id="ga-id"
            v-model="integrations.googleAnalyticsId"
            type="text"
            dir="ltr"
            placeholder="مثال: G-KERAS2026"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="gtm-id" class="text-xs font-bold text-ink">
            شناسه کانتینر گوگل تگ منیجر (GTM ID)
          </label>
          <input
            id="gtm-id"
            v-model="integrations.googleTagManagerId"
            type="text"
            dir="ltr"
            placeholder="مثال: GTM-KERAS01"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>
      </div>
    </div>

    <!-- بخش ۳: وب‌سرویس پیامک و احراز هویت -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-clay/15 flex items-center justify-center text-clay">
          <MessageSquare class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            وب‌سرویس ارسال پیامک OTP و اطلاع‌رسانی
          </h3>
          <p class="text-xs text-muted-foreground">
            تنظیم خط پیامکی و رصد میزان اعتبار جهت ارسال کدهای ورود و رهگیری سفارشات
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="sms-sender" class="text-xs font-bold text-ink">
            شماره سرخط پیامکی ارسال سریع (Sender Number)
          </label>
          <input
            id="sms-sender"
            v-model="integrations.smsProviderSender"
            type="text"
            dir="ltr"
            placeholder="مثال: 30007788"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="sms-balance" class="text-xs font-bold text-ink">
            اعتبار شارژ پنل پیامکی (تومان)
          </label>
          <input
            id="sms-balance"
            v-model.number="integrations.smsProviderBalance"
            type="number"
            min="0"
            step="50000"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            تعداد تخمینی پیامک‌های قابل ارسال بر اساس این موجودی محاسبه می‌شود.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

