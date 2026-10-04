<!-- frontend/app/components/ops/analytics/OpsExecutiveDigestCard.vue -->
<script setup lang="ts">
import { Sparkles, RefreshCw, CheckCircle } from '@lucide/vue'
import { toast } from 'vue-sonner'

const isGenerating = ref(false)
const lastGeneratedTime = ref('امروز، ساعت ۰۸:۰۰')

const digestPoints = ref([
  {
    title: 'رکورد فروش پالتو پشمی کشمیر',
    desc: 'کالکشن دست‌دوز کشمیر با ۱۲ سفارش در ۲۴ ساعت گذشته به بالاترین حجم فروش رسید. انتقال ۵ عدد از انبار شریعتی به آتلیه نیاوران ثبت شد.',
    type: 'positive',
  },
  {
    title: 'هشدار موجودی بحرانی شلوار راسته',
    desc: 'موجودی سایز L شلوار راسته پشمی در انبار تجریش به ۱ عدد رسیده و در وضعیت نیاز به شارژ مجدد (Reorder Point) قرار گرفته است.',
    type: 'warning',
  },
  {
    title: 'تسویه کامل پایانه شاپرک',
    desc: 'کلیه تراکنش‌های کارت‌خوان اینترنتی بانک ملت و سامان در روز گذشته با کارمزد ۱٪ و بدون خطای مغایرت تسویه گردیدند.',
    type: 'positive',
  },
])

const handleRegenerate = () => {
  isGenerating.value = true
  setTimeout(() => {
    isGenerating.value = false
    lastGeneratedTime.value = 'هم‌اکنون'
    toast.success('خلاصه اجرایی هوشمند روزانه با موفقیت به‌روزرسانی شد')
  }, 700)
}
</script>

<template>
  <div class="bg-white border border-sand/80 rounded-2xl p-5 shadow-2xs space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-sand/60">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-rose/10 text-rose flex items-center justify-center">
          <Sparkles class="w-4 h-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-ink">خلاصه گزارش مدیریتی روزانه (Executive AI Digest)</h3>
          <p class="text-2xs text-muted-foreground mt-0.5">تحلیل هوشمند رخدادهای زنجیره تامین، پرفروش‌ترین کالاها و گلوگاه‌های عملیاتی</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-2xs text-muted-foreground">تولید: {{ lastGeneratedTime }}</span>
        <button
          type="button"
          :disabled="isGenerating"
          class="h-8 px-2.5 rounded-lg border border-sand bg-paper hover:bg-sand/30 text-ink text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          @click="handleRegenerate"
        >
          <RefreshCw class="w-3 h-3 text-rose" :class="{ 'animate-spin': isGenerating }" />
          <span>{{ isGenerating ? 'در حال تحلیل...' : 'به‌روزرسانی تحلیل' }}</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div
        v-for="(point, idx) in digestPoints"
        :key="idx"
        class="p-3.5 rounded-xl border text-xs space-y-1.5"
        :class="point.type === 'positive' ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950' : 'bg-amber-50/40 border-amber-200/80 text-amber-950'"
      >
        <div class="flex items-center gap-1.5 font-bold">
          <CheckCircle v-if="point.type === 'positive'" class="w-4 h-4 text-emerald-600 shrink-0" />
          <Sparkles v-else class="w-4 h-4 text-amber-600 shrink-0" />
          <span>{{ point.title }}</span>
        </div>
        <p class="text-2xs leading-relaxed text-slate-700">{{ point.desc }}</p>
      </div>
    </div>
  </div>
</template>
