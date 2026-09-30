// frontend/eslint.config.mjs
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    // نادیده گرفتن کامپوننت‌های آماده‌ی shadcn
    ignores: ['app/components/ui/**'],
  },
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      // خاموش کردن بررسی لینک صفحاتی که در اسپرینت‌های بعدی ساخته می‌شوند
      'link-checker/valid-route': 'off',
      'link-checker/valid-sitemap-link': 'off',
    },
  },
);
