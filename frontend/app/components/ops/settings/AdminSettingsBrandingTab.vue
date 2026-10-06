<!-- frontend/app/components/ops/settings/AdminSettingsBrandingTab.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ShieldCheck,
  Award,
  Image as ImageIcon,
} from '@lucide/vue'
import type { SiteBrandingSettings, SiteIntegrationsSettings, SiteHomeHeroSettings } from '~/types/domain'

const branding = defineModel<SiteBrandingSettings>('branding', { required: true })
const integrations = defineModel<SiteIntegrationsSettings>('integrations', { required: true })
const homeHero = defineModel<SiteHomeHeroSettings>('homeHero')

if (!homeHero.value) {
  homeHero.value = {
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
  }
}
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

    <!-- بخش ۳: بنر هیرو صفحه نخست (Hero Showcase) -->
    <div v-if="homeHero" class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
          <ImageIcon class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            بنر هیرو صفحه نخست (Hero Showcase)
          </h3>
          <p class="text-xs text-muted-foreground">
            پیکربندی تیتر اصلی، کلمات متمایز، دکمه‌های فراخوان (CTA) و تصویر ویترین صفحه اصلی
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div class="sm:col-span-3 space-y-1.5">
          <label for="hero-badge" class="text-xs font-bold text-ink">
            برچسب بالای تیتر (فصلی / تیراژ محدود)
          </label>
          <input
            id="hero-badge"
            v-model="homeHero.badgeText"
            type="text"
            placeholder="طراحی اختصاصی • تیراژ محدود پاییز ۱۴۰۵"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label for="hero-title-prefix" class="text-xs font-bold text-ink">
            پیشوند تیتر
          </label>
          <input
            id="hero-title-prefix"
            v-model="homeHero.titlePrefix"
            type="text"
            placeholder="استایل منحصربه‌فرد"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label for="hero-title-highlight" class="text-xs font-bold text-ink">
            کلمه برجسته / رنگی
          </label>
          <input
            id="hero-title-highlight"
            v-model="homeHero.titleHighlight"
            type="text"
            placeholder="پاییز"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-rose font-bold"
          >
        </div>

        <div class="space-y-1.5">
          <label for="hero-title-suffix" class="text-xs font-bold text-ink">
            پسوند تیتر
          </label>
          <input
            id="hero-title-suffix"
            v-model="homeHero.titleSuffix"
            type="text"
            placeholder="خود را بسازید"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="sm:col-span-3 space-y-1.5">
          <label for="hero-desc" class="text-xs font-bold text-ink">
            متن توضیحات و داستان کالکشن
          </label>
          <textarea
            id="hero-desc"
            v-model="homeHero.description"
            rows="2"
            placeholder="توضیحات کوتاه کالکشن فصلی و نوع الیاف"
            class="w-full rounded-xl border border-sand bg-sand/15 p-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all resize-none"
          />
        </div>

        <div class="space-y-1.5">
          <label for="hero-cta-pri-text" class="text-xs font-bold text-ink">
            متن دکمه اصلی (CTA ۱)
          </label>
          <input
            id="hero-cta-pri-text"
            v-model="homeHero.primaryCtaText"
            type="text"
            placeholder="مشاهده کالکشن پاییز"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="hero-cta-pri-link" class="text-xs font-bold text-ink">
            پیوند دکمه اصلی (CTA ۱ Link)
          </label>
          <input
            id="hero-cta-pri-link"
            v-model="homeHero.primaryCtaLink"
            type="text"
            dir="ltr"
            placeholder="/shop?season=fall-1405"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="hero-cta-sec-text" class="text-xs font-bold text-ink">
            متن دکمه ثانویه (CTA ۲)
          </label>
          <input
            id="hero-cta-sec-text"
            v-model="homeHero.secondaryCtaText"
            type="text"
            placeholder="اکسسوری و شال‌ها"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="hero-cta-sec-link" class="text-xs font-bold text-ink">
            پیوند دکمه ثانویه (CTA ۲ Link)
          </label>
          <input
            id="hero-cta-sec-link"
            v-model="homeHero.secondaryCtaLink"
            type="text"
            dir="ltr"
            placeholder="/shop?division=accessories"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="sm:col-span-3 space-y-1.5">
          <label for="hero-bottom-badge" class="text-xs font-bold text-ink">
            نشان اصالت زیر دکمه‌ها
          </label>
          <input
            id="hero-bottom-badge"
            v-model="homeHero.bottomBadgeText"
            type="text"
            placeholder="کالکشن دست‌دوز استودیو کراس • نسخه محدود پاییز ۱۴۰۵"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="hero-img-url" class="text-xs font-bold text-ink">
            نشانی اینترنتی تصویر پرتره مدل هیرو (Image URL)
          </label>
          <input
            id="hero-img-url"
            v-model="homeHero.imageUrl"
            type="text"
            dir="ltr"
            placeholder="https://images.unsplash.com/..."
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="hero-img-alt" class="text-xs font-bold text-ink">
            متن جایگزین تصویر (Alt)
          </label>
          <input
            id="hero-img-alt"
            v-model="homeHero.imageAlt"
            type="text"
            placeholder="مدل کالکشن پاییز کراس"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label for="hero-img-badge-lbl" class="text-xs font-bold text-ink">
            برچسب کوچک روی عکس
          </label>
          <input
            id="hero-img-badge-lbl"
            v-model="homeHero.imageBadgeLabel"
            type="text"
            placeholder="طراحی کپسولی"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="hero-img-badge-val" class="text-xs font-bold text-ink">
            مقدار برچسب روی عکس
          </label>
          <input
            id="hero-img-badge-val"
            v-model="homeHero.imageBadgeValue"
            type="text"
            placeholder="پاییز ۱۴۰۵ • Fall Drop"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>
      </div>
    </div>
  </div>
</template>

