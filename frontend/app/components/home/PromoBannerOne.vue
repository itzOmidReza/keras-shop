<!-- frontend/app/components/home/PromoBannerOne.vue -->
<script setup lang="ts">
import {
  Sparkles,
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
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
    <!-- نوار ادیتوریال کپسولی باریک و شیک (High-Fashion Compact Ribbon) -->
    <div class="relative overflow-hidden rounded-2xl sm:rounded-full border border-sand bg-gradient-to-r from-sand/70 via-paper to-sand/60 px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
      <!-- سمت راست: عنوان و پیام تخفیف خرید اول -->
      <div class="flex items-center gap-3 text-start min-w-0">
        <div class="w-8 h-8 rounded-full bg-rose/10 text-rose flex items-center justify-center shrink-0">
          <Sparkles class="w-4 h-4 text-rose" />
        </div>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm">
          <span class="inline-flex items-center gap-1 font-bold text-ink">
            <Tag class="w-3.5 h-3.5 text-rose shrink-0" />
            <span>تخفیف ویژه سفارش اول:</span>
          </span>
          <span class="text-muted-foreground">
            ۱۵٪ کسر از سبد خرید برای تمامی سفارش‌های پاییزه
          </span>
        </div>
      </div>

      <!-- سمت چپ: کپی کوپن و دکمه CTA -->
      <div class="flex items-center gap-2.5 shrink-0">
        <!-- پیل تعاملی کپی کوپن -->
        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-white border border-sand/80 px-3 py-1.5 shadow-2xs hover:border-rose/50 transition-colors cursor-pointer group active:scale-95"
          :title="isCopied ? 'کپی شد' : 'کپی کد تخفیف'"
          @click="copyVoucher"
        >
          <span class="text-[11px] text-muted-foreground font-medium">کد:</span>
          <span class="font-mono font-bold text-xs text-rose group-hover:underline">{{ promoCode }}</span>
          <Check v-if="isCopied" class="w-3.5 h-3.5 text-sage" />
          <Copy v-else class="w-3.5 h-3.5 text-muted-foreground group-hover:text-rose transition-colors" />
        </button>

        <!-- دکمه هدایت به خرید (جهت پیکان به سمت چپ در RTL) -->
        <NuxtLink
          to="/shop?season=fall-1405"
          class="inline-flex items-center gap-1.5 rounded-full bg-ink hover:bg-rose px-4 py-1.5 text-xs font-bold text-paper transition-all active:scale-95 shadow-2xs"
        >
          <span>خرید با تخفیف</span>
          <ArrowLeft class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
