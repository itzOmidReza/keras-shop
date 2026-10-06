<!-- frontend/app/components/ops/settings/AdminSettingsBrandingTab.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ShieldCheck,
  Award,
} from '@lucide/vue'
import type { SiteBrandingSettings, SiteIntegrationsSettings } from '~/types/domain'

const branding = defineModel<SiteBrandingSettings>('branding', { required: true })
const integrations = defineModel<SiteIntegrationsSettings>('integrations', { required: true })
</script>

<template>
  <div class="space-y-6">
    <!-- بخش ۱: هویت بصری و شعارها -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
          <Sparkles class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            هویت بصری، عناوین و شعارهای آتلیه
          </h3>
          <p class="text-xs text-muted-foreground">
            پیکربندی نام تجاری، شعارهای کلیدی و دارایی‌های گرافیکی هویت برند
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="brand-name-fa" class="text-xs font-bold text-ink">
            نام فارسی برند
          </label>
          <input
            id="brand-name-fa"
            v-model="branding.brandNameFa"
            type="text"
            placeholder="کراس"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label for="brand-name-en" class="text-xs font-bold text-ink">
            نام لاتین برند (English)
          </label>
          <input
            id="brand-name-en"
            v-model="branding.brandNameEn"
            type="text"
            dir="ltr"
            placeholder="Keras"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="brand-tagline" class="text-xs font-bold text-ink">
            شعار اصلی برند (Tagline)
          </label>
          <input
            id="brand-tagline"
            v-model="branding.tagline"
            type="text"
            placeholder="مثال: زیبایی در سادگی، آزادی در حرکت"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            در فوتر و متاتگ‌های پیش‌فرض شبکه‌های اجتماعی درج می‌شود.
          </p>
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="brand-subtagline" class="text-xs font-bold text-ink">
            شعار تکمیلی / حوزه فعالیت
          </label>
          <input
            id="brand-subtagline"
            v-model="branding.subTagline"
            type="text"
            placeholder="مثال: پوشاک تخصصی تمرین و روزمره زنانه"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label for="brand-logo-url" class="text-xs font-bold text-ink">
            مسیر لوگوی رسمی (SVG / WebP)
          </label>
          <input
            id="brand-logo-url"
            v-model="branding.logoUrl"
            type="text"
            dir="ltr"
            placeholder="/logo.svg"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="brand-favicon-url" class="text-xs font-bold text-ink">
            مسیر فاوآیکون مرورگر (Favicon)
          </label>
          <input
            id="brand-favicon-url"
            v-model="branding.faviconUrl"
            type="text"
            dir="ltr"
            placeholder="/favicon.ico"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>
      </div>
    </div>

    <!-- بخش ۲: نمادهای اعتماد و مجوزهای قانونی -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center text-sage">
          <ShieldCheck class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            مجوزهای قانونی و نمادهای اعتماد الکترونیکی
          </h3>
          <p class="text-xs text-muted-foreground">
            کدهای فعال‌سازی و رهگیری نماد اعتماد اینماد و ستاد ساماندهی پایگاه‌های اینترنتی
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="enamad-code" class="text-xs font-bold text-ink flex items-center gap-1.5">
            <Award class="w-3.5 h-3.5 text-muted-foreground" />
            <span>کد اختصاصی اینماد (eNamad ID)</span>
          </label>
          <input
            id="enamad-code"
            v-model="integrations.enamadCode"
            type="text"
            dir="ltr"
            placeholder="مثال: 12345678"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
          <p class="text-[11px] text-muted-foreground">
            کد اصالت نماد اعتماد تجارت الکترونیکی جهت احراز هویت در فوتر.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="samandehi-code" class="text-xs font-bold text-ink flex items-center gap-1.5">
            <ShieldCheck class="w-3.5 h-3.5 text-muted-foreground" />
            <span>کد ثبت رسانه دیجیتال (ساماندهی)</span>
          </label>
          <input
            id="samandehi-code"
            v-model="integrations.samandehiCode"
            type="text"
            dir="ltr"
            placeholder="مثال: 87654321"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
          <p class="text-[11px] text-muted-foreground">
            شناسه نشان ملی ثبت رسانه‌های دیجیتال وزارت فرهنگ و ارشاد اسلامی.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

