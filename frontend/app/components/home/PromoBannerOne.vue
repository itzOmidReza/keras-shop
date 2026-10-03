<!-- frontend/app/components/home/PromoBannerOne.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ShoppingBag,
  CreditCard,
  Copy,
  Check,
  ArrowLeft,
  Tag,
} from '@lucide/vue'
import { toast } from 'vue-sonner'

const promoCode = 'KERAS15'
const isCopied = ref(false)

const copyVoucher = async () => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(promoCode)
    }
    isCopied.value = true
    toast.success('کد تخفیف KERAS15 با موفقیت کپی شد')
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch {
    toast.error('امکان کپی خودکار فراهم نشد.')
  }
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
    <!-- کادر اصلی بنر با طراحی گرم الهام‌گرفته از Luxora -->
    <div class="relative overflow-hidden rounded-3xl border border-sand bg-gradient-to-r from-sand/50 via-paper to-sand/40 p-6 sm:p-10 lg:p-12 shadow-2xs">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- ستون پیام و کوپن تخفیف (در RTL سمت راست) -->
        <div class="lg:col-span-8 space-y-5 text-start">
          <!-- بج پیشنهاد ویژه -->
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Tag class="w-3.5 h-3.5 text-rose" />
            <span>پیشنهاد استثنایی خرید اول</span>
          </div>

          <!-- عنوان و جزئیات تخفیف -->
          <div class="space-y-2">
            <h2 class="text-2xl sm:text-4xl font-bold text-ink tracking-tight">
              ۱۵٪ تخفیف روی تمام سبد خرید شما!
            </h2>
            <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
              برای تجربه نخستین خرید از کالکشن پاییز و اکسسوری‌های دست‌ساز کراس، با کد تخفیف زیر از ۱۵٪ کسر هزینه سفارش بهره‌مند شوید.
            </p>
          </div>

          <!-- باکس تعاملی کپی کوپن و دکمه CTA -->
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <!-- پیل کپی کد تخفیف -->
            <div class="inline-flex items-center gap-2 rounded-2xl bg-white border border-sand px-3 py-2 shadow-2xs">
              <span class="text-xs text-muted-foreground font-medium">کد تخفیف:</span>
              <span class="font-mono font-bold text-sm text-rose">{{ promoCode }}</span>
              <button
                type="button"
                class="ms-1 p-1 rounded-lg text-ink hover:text-rose hover:bg-sand/30 transition-colors cursor-pointer"
                :title="isCopied ? 'کپی شد' : 'کپی کد'"
                @click="copyVoucher"
              >
                <Check v-if="isCopied" class="w-4 h-4 text-sage" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- دکمه خرید سریع -->
            <NuxtLink
              to="/shop?season=fall-1405"
              class="inline-flex items-center gap-2 rounded-2xl bg-rose px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-rose/90 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>خرید با تخفیف ۱۵٪</span>
              <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
            </NuxtLink>
          </div>

          <!-- ۳ مرحله آسان بهره‌مندی از تخفیف (بر اساس رفرنس Luxora) -->
          <div class="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-sand/70 max-w-lg">
            <div class="flex items-center gap-2 text-start">
              <div class="w-7 h-7 rounded-lg bg-sand/60 flex items-center justify-center shrink-0 text-ink">
                <ShoppingBag class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-ink">۱. انتخاب آیتم‌ها</span>
            </div>

            <div class="flex items-center gap-2 text-start">
              <div class="w-7 h-7 rounded-lg bg-sand/60 flex items-center justify-center shrink-0 text-ink">
                <CreditCard class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-ink">۲. رفتن به سبد</span>
            </div>

            <div class="flex items-center gap-2 text-start">
              <div class="w-7 h-7 rounded-lg bg-sand/60 flex items-center justify-center shrink-0 text-rose">
                <Sparkles class="w-3.5 h-3.5" />
              </div>
              <span class="text-[11px] font-bold text-rose">۳. اعمال تخفیف</span>
            </div>
          </div>
        </div>

        <!-- تمبر یا بج بزرگ گرافیکی در سمت دیگر (در RTL سمت چپ) -->
        <div class="lg:col-span-4 flex justify-center lg:justify-end">
          <div class="relative flex flex-col items-center justify-center w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed border-rose/60 bg-rose/10 p-4 text-center shadow-xs">
            <span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">کوپن اختصاصی</span>
            <span class="text-3xl sm:text-4xl font-extrabold text-rose my-1">۱۵٪</span>
            <span class="text-xs font-bold text-ink">تخفیف سفارش اول</span>
            <div class="absolute -bottom-2 px-3 py-0.5 rounded-full bg-rose text-white text-[10px] font-bold">
              تایید آنی
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
