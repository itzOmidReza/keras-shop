// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  // ۱. تنظیمات پایه پروژه و Nuxt
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  telemetry: false,

  typescript: {
    typeCheck: true,
    shim: true,
    tsConfig: {
      compilerOptions: {
        libReplacement: undefined,
      },
    },
  },

  // ۲. ماژول‌ها
  modules: [
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  pinia: {
    storesDirs: ['~/stores/**', './app/stores/**'],
  },

  // ۳. استایل و پیکربندی Vite
  css: [
    '~/assets/css/tailwind.css',
    'swiper/css/bundle',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  // ۴. کانفیگ کامپوننت‌ها و UI
  components: [
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/components/product', pathPrefix: false },
    { path: '~/components/cart', pathPrefix: false },
    { path: '~/components/checkout', pathPrefix: false },
    { path: '~/components/catalog', pathPrefix: false },
    { path: '~/components/ops', pathPrefix: false },
    '~/components',
  ],

  imports: {
    dirs: ['composables/**', 'utils/**'],
  },

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
    domains: ['images.unsplash.com'],
    provider: 'none',
  },
  // خاموش کردن چک آنلاین فونت یا رندرهای خارجی سئو در محیط لوکال
  seo: {
    redirectToCanonicalSiteUrl: false,
  },

  // ۶. قوانین رندرینگ و کش صفحات (SWR / CSR)
  routeRules: {
    '/': { swr: 300 },
    '/shop/**': { swr: 300 },
    '/products/**': { swr: 300 }, // تغییر از /p/** به مسیر جدید سئو
    '/products': { redirect: { to: '/shop', statusCode: 301 } },

    '/cart': { ssr: false, robots: false },
    '/checkout': { ssr: false, robots: false },
    '/checkout/**': { ssr: false, robots: false },
    '/account/**': { ssr: false, robots: false },
    '/dev/**': { ssr: false, robots: false },
    '/internal-ops-nexus/**': { ssr: false, robots: false },
  },

  // ۷. تگ‌های Head سند HTML (فونت، متادیتا و RTL)
  app: {
    head: {
      htmlAttrs: { lang: 'fa', dir: 'rtl' },
      meta: [{ name: 'theme-color', content: '#FBF6F1' }],
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

  hooks: {
    'prepare:types'({ tsConfig }) {
      if (
        tsConfig.compilerOptions &&
        'libReplacement' in tsConfig.compilerOptions
      ) {
        delete (tsConfig.compilerOptions as Record<string, unknown>)
          .libReplacement;
      }
    },
  },
});
