<!-- frontend/app/components/ops/settings/AdminSettingsContactTab.vue -->
<script setup lang="ts">
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Share2,
} from '@lucide/vue'
import type { SiteContactSettings, SiteSocialSettings } from '~/types/domain'

const contact = defineModel<SiteContactSettings>('contact', { required: true })
const social = defineModel<SiteSocialSettings>('social', { required: true })
</script>

<template>
  <div class="space-y-6">
    <!-- بخش ۱: اطلاعات تماس و پشتیبانی -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-rose/10 flex items-center justify-center text-rose">
          <Phone class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            کانال‌های ارتباطی و کانسیرژ اختصاصی
          </h3>
          <p class="text-xs text-muted-foreground">
            تنظیم شماره‌های تماس، ایمیل سازمانی، ساعات کاری و آدرس شوروم مرکزی
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="contact-phone" class="text-xs font-bold text-ink flex items-center gap-1.5">
            <Phone class="w-3.5 h-3.5 text-muted-foreground" />
            <span>تلفن تماس پشتیبانی (نمایشی)</span>
          </label>
          <input
            id="contact-phone"
            v-model="contact.supportPhone"
            type="text"
            placeholder="مثال: ۰۲۱-۸۸۸۸۴۴۲۲"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
          <p class="text-[11px] text-muted-foreground">
            در فوتر، هدر و صفحه تماس با ما نمایش داده می‌شود.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="contact-phone-raw" class="text-xs font-bold text-ink">
            شماره شماره‌گیری سریع (بدون خط تیره)
          </label>
          <input
            id="contact-phone-raw"
            v-model="contact.supportPhoneRaw"
            type="text"
            dir="ltr"
            placeholder="مثال: 02188884422"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
          <p class="text-[11px] text-muted-foreground">
            برای پروتکل‌های ارتباطی تلفنی نظیر لینک tel: مورد استفاده قرار می‌گیرد.
          </p>
        </div>

        <div class="space-y-1.5">
          <label for="contact-inquiry" class="text-xs font-bold text-ink">
            شماره موبایل مشاوره سایز / واتس‌اپ
          </label>
          <input
            id="contact-inquiry"
            v-model="contact.inquiryMobile"
            type="text"
            dir="ltr"
            placeholder="مثال: 09120000000"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="contact-email" class="text-xs font-bold text-ink flex items-center gap-1.5">
            <Mail class="w-3.5 h-3.5 text-muted-foreground" />
            <span>ایمیل رسمی پشتیبانی و کانسیرژ</span>
          </label>
          <input
            id="contact-email"
            v-model="contact.officialEmail"
            type="email"
            dir="ltr"
            placeholder="care@keras.ir"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="contact-hours" class="text-xs font-bold text-ink flex items-center gap-1.5">
            <Clock class="w-3.5 h-3.5 text-muted-foreground" />
            <span>ساعت کاری پاسخگویی</span>
          </label>
          <input
            id="contact-hours"
            v-model="contact.workingHours"
            type="text"
            placeholder="مثال: شنبه تا پنج‌شنبه: ۹ الی ۱۸"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="sm:col-span-2 space-y-1.5">
          <label for="contact-address" class="text-xs font-bold text-ink flex items-center gap-1.5">
            <MapPin class="w-3.5 h-3.5 text-muted-foreground" />
            <span>نشانی فیزیکی آتلیه و شو روم مرکزی</span>
          </label>
          <textarea
            id="contact-address"
            v-model="contact.atelierAddress"
            rows="2"
            placeholder="مثال: تهران، جردن، خیابان سعیدی، ساختمان کراس، طبقه ۴"
            class="w-full rounded-xl border border-sand bg-sand/15 p-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all leading-relaxed"
          />
        </div>
      </div>
    </div>

    <!-- بخش ۲: شبکه‌های اجتماعی -->
    <div class="rounded-2xl border border-sand bg-white p-5 sm:p-6 shadow-2xs space-y-6">
      <div class="flex items-center gap-3 border-b border-sand/70 pb-4">
        <div class="w-9 h-9 rounded-xl bg-sage/15 flex items-center justify-center text-sage">
          <Share2 class="w-5 h-5" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">
            پیوند شبکه‌های اجتماعی برند
          </h3>
          <p class="text-xs text-muted-foreground">
            لینک‌های هدایت مستقیم مخاطبان در فوتر و مقالات مجله
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div class="space-y-1.5">
          <label for="social-instagram" class="text-xs font-bold text-ink">
            صفحه اینستاگرام (Instagram)
          </label>
          <input
            id="social-instagram"
            v-model="social.instagram"
            type="url"
            dir="ltr"
            placeholder="https://instagram.com/keras.brand"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="social-telegram" class="text-xs font-bold text-ink">
            کانال تلگرام (Telegram)
          </label>
          <input
            id="social-telegram"
            v-model="social.telegram"
            type="url"
            dir="ltr"
            placeholder="https://t.me/kerasbrand"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="social-pinterest" class="text-xs font-bold text-ink">
            پینترست ادیتوریال (Pinterest)
          </label>
          <input
            id="social-pinterest"
            v-model="social.pinterest"
            type="url"
            dir="ltr"
            placeholder="https://pinterest.com/kerasbrand"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>

        <div class="space-y-1.5">
          <label for="social-youtube" class="text-xs font-bold text-ink">
            کانال ویدیویی یوتیوب (YouTube)
          </label>
          <input
            id="social-youtube"
            v-model="social.youtube"
            type="url"
            dir="ltr"
            placeholder="https://youtube.com/@kerasbrand"
            class="h-10 w-full rounded-xl border border-sand bg-sand/15 px-3 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
          >
        </div>
      </div>
    </div>
  </div>
</template>

