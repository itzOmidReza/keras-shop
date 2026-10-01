<!-- frontend/app/components/layout/Footer.vue -->
<script setup lang="ts">
import {
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
} from '@lucide/vue'

const email = ref('')

const handleNewsletter = () => {
  if (!email.value) return
  if (import.meta.client) {
    window.alert('عضویت شما در خبرنامه کراس با موفقیت ثبت شد.')
    email.value = ''
  }
}

const shopLinks = [
  { label: 'تمام محصولات', href: '/shop' },
  { label: 'لگ‌های ورزشی', href: '/products?category=leggings' },
  { label: 'نیم‌تنه و تاپ', href: '/products?category=tops' },
  { label: 'لاین آرامش (Calm)', href: '/products?line=calm' },
  { label: 'لاین حرکت (Move)', href: '/products?line=move' },
]

const serviceLinks = [
  { label: 'راهنمای اندازه‌گیری سایز', href: '/size-guide' },
  { label: 'پیگیری سفارش‌ها', href: '/tracking' },
  { label: 'رویه بازگشت و تعویض ۷ روزه', href: '/returns' },
  { label: 'پرسش‌های متداول', href: '/faq' },
  { label: 'تماس با ما', href: '/contact' },
]

const brandLinks = [
  { label: 'داستان کراس', href: '/about' },
  { label: 'تست شفافیت و کیفیت الیاف', href: '/fabric-standards' },
  { label: 'مجله استایل و تمرین', href: '/blog' },
  { label: 'فرصت‌های شغلی', href: '/careers' },
]
</script>

<template>
  <footer class="mt-20 border-t border-sand bg-paper text-ink">
    <!-- بخش ۴ ارزش بنیادین برند (مشابه رفرنس Luxora) -->
    <div class="border-b border-sand">
      <div class="container mx-auto px-4 py-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div class="space-y-1.5">
            <Truck class="mx-auto h-5 w-5 text-rose" />
            <h4 class="text-xs font-bold text-ink">
              ارسال سریع کشوری
            </h4>
            <p class="text-[11px] text-muted-foreground">
              سفارش‌های بالای ۱٫۵ م رایگان
            </p>
          </div>

          <div class="space-y-1.5">
            <RotateCcw class="mx-auto h-5 w-5 text-sage" />
            <h4 class="text-xs font-bold text-ink">
              تعویض آسان سایز
            </h4>
            <p class="text-[11px] text-muted-foreground">
              تا ۷ روز کاری بدون دغدغه
            </p>
          </div>

          <div class="space-y-1.5">
            <ShieldCheck class="mx-auto h-5 w-5 text-clay" />
            <h4 class="text-xs font-bold text-ink">
              تست عدم عبور نور
            </h4>
            <p class="text-[11px] text-muted-foreground">
              پارچه‌های کاملاً ضد دید
            </p>
          </div>

          <div class="space-y-1.5">
            <Sparkles class="mx-auto h-5 w-5 text-rose" />
            <h4 class="text-xs font-bold text-ink">
              طراحی ارگونومیک
            </h4>
            <p class="text-[11px] text-muted-foreground">
              حس پوست دوم در تمرین
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- بدنه اصلی فوتر -->
    <div class="container mx-auto px-4 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
        <!-- ستون معرفی برند و عضویت خبرنامه -->
        <div class="lg:col-span-4 space-y-4">
          <div class="space-y-2">
            <span class="text-2xl font-bold tracking-tight text-ink">
              کراس
            </span>
            <p class="text-xs leading-relaxed text-muted-foreground max-w-sm">
              طراحی و تولید پوشاک ورزشی و روزمره تخصصی زنانه با تمرکز بر بافت‌های بدون درز، آزادی حرکت، حس سبکی و لطافت
              ماندگار.
            </p>
          </div>

          <!-- فرم عضویت خبرنامه -->
          <div class="space-y-2 pt-2">
            <span class="text-xs font-bold text-ink block">
              عضویت در باشگاه کراس (۱۰٪ تخفیف خرید اول)
            </span>
            <form class="flex items-center gap-2 max-w-sm" @submit.prevent="handleNewsletter">
              <input
v-model="email" type="email" required placeholder="ایمیل خود را وارد کنید..."
                class="h-10 flex-1 rounded-xl border border-sand bg-white px-3 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:outline-none">
              <button
type="submit"
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose text-white transition-opacity hover:opacity-90 shrink-0 cursor-pointer"
                aria-label="ثبت ایمیل در خبرنامه">
                <Send class="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <!-- لینک‌های فروشگاه -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-ink">
            دسته‌بندی کالاها
          </h4>
          <ul class="space-y-2 text-xs">
            <li v-for="link in shopLinks" :key="link.href">
              <NuxtLink :to="link.href" class="text-muted-foreground transition-colors hover:text-rose">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- خدمات مشتریان -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-ink">
            خدمات و پشتیبانی
          </h4>
          <ul class="space-y-2 text-xs">
            <li v-for="link in serviceLinks" :key="link.href">
              <NuxtLink :to="link.href" class="text-muted-foreground transition-colors hover:text-rose">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- درباره کراس -->
        <div class="lg:col-span-2 space-y-3">
          <h4 class="text-xs font-bold uppercase tracking-wider text-ink">
            برند کراس
          </h4>
          <ul class="space-y-2 text-xs">
            <li v-for="link in brandLinks" :key="link.href">
              <NuxtLink :to="link.href" class="text-muted-foreground transition-colors hover:text-rose">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- کپی‌رایت و امضای پایین -->
    <div class="border-t border-sand/80 py-6">
      <div
        class="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
        <span>© تمامی حقوق مادی و معنوی متعلق به برند کراس است.</span>
        <div class="flex items-center gap-6">
          <NuxtLink to="/privacy" class="hover:text-ink transition-colors">
            حریم خصوصی
          </NuxtLink>
          <NuxtLink to="/terms" class="hover:text-ink transition-colors">
            قوانین و مقررات
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>
