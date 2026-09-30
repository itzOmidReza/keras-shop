// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  // ۱. تنظیمات پایه پروژه و Nuxt
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  // ۲. ماژول‌ها
  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  // ۳. استایل و پیکربندی Vite
  css: ['~/assets/css/tailwind.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  // ۴. کانفیگ کامپوننت‌ها و UI
  components: [
    { path: '~/components/layout', pathPrefix: false },
    '~/components',
  ],

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  // ۵. سئو و سورس تصاویر
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://keras.local',
    name: 'کراس',
    defaultLocale: 'fa',
    indexable: false,
  },

  image: {
    quality: 80,
    format: ['avif', 'webp'],
    domains: ['images.unsplash.com'],
  },

  // ۶. قوانین رندرینگ و کش صفحات (SWR / CSR)
  routeRules: {
    // صفحات عمومی با کش سمت سرور
    '/': { swr: 300 },
    '/shop/**': { swr: 300 },
    '/p/**': { swr: 300 },

    // صفحات اختصاصی فقط سمت کلاینت و بدون ایندکس موتورهای جستجو
    '/cart': { ssr: false, robots: false },
    '/checkout/**': { ssr: false, robots: false },
    '/account/**': { ssr: false, robots: false },
    '/dev/**': { ssr: false, robots: false },
  },

  // ۷. تگ‌های Head سند HTML (فونت، متادیتا و RTL)
  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      meta: [{ name: 'theme-color', content: '#1F2A44' }],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        {
          rel: 'preload',
          href: '/fonts/Vazirmatn-Regular.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/Vazirmatn-Bold.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
  },
});
