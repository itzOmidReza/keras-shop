<!-- frontend/app/components/ops/product-studio/ProductStudioActionBar.vue -->
<script setup lang="ts">
import { Check, ArrowRight, Loader2, PackageCheck, Printer, Eye, Save } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'
import { toFa } from '~/utils/format'

withDefaults(
  defineProps<{
    isSaving?: boolean
    isEditing?: boolean
  }>(),
  {
    isSaving: false,
    isEditing: false,
  },
)

const emit = defineEmits<{
  save: []
  saveDraft: []
  preview: []
  printHangtag: []
}>()

const {
  variants,
  isDirty,
} = useOpsProductStudio()

const totalStock = computed(() => {
  return variants.value.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
})
</script>

<template>
  <div class="fixed bottom-0 inset-x-0 lg:ps-60 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-4 shadow-lg font-sans">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
      <!-- سمت راست: وضعیت تغییرات و آمار موجودی انبار -->
      <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <!-- نشان وضعیت تغییرات (Dirty State Badge) -->
        <div
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
          :class="isDirty ? 'bg-amber-100/80 text-amber-900 border border-amber-300/80' : 'bg-emerald-100/80 text-emerald-900 border border-emerald-300/80'"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="isDirty ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'"
          />
          <span>{{ isDirty ? 'پیش‌نویس ذخیره‌نشده' : 'تغییرات ذخیره شد ✓' }}</span>
        </div>

        <div class="hidden md:flex items-center gap-1.5 text-xs text-slate-600 font-medium border-s border-slate-200 ps-3">
          <PackageCheck class="w-4 h-4 text-slate-400" />
          <span>{{ toFa(variants.length) }} متغیر</span>
          <span class="text-slate-300">|</span>
          <span class="tabular-nums font-mono font-bold text-slate-800">{{ toFa(totalStock) }} موجودی کل</span>
        </div>
      </div>

      <!-- سمت چپ: دکمه‌های اکشن استاندارد آتلیه -->
      <div class="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
        <NuxtLink
          to="/internal-ops-nexus/products"
          class="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <ArrowRight class="w-3.5 h-3.5" />
          <span>انصراف</span>
        </NuxtLink>

        <!-- دکمه چاپ اتیکت فیزیکی -->
        <button
          type="button"
          class="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="چاپ اتیکت لباس و لیبل حرارتی"
          @click="emit('printHangtag')"
        >
          <Printer class="w-3.5 h-3.5 text-slate-500" />
          <span class="hidden md:inline">چاپ اتیکت آتلیه</span>
        </button>

        <!-- پیش‌نمایش در سایت -->
        <button
          type="button"
          class="h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          @click="emit('preview')"
        >
          <Eye class="w-3.5 h-3.5 text-slate-500" />
          <span class="hidden sm:inline">پیش‌نمایش در سایت</span>
        </button>

        <!-- ذخیره به عنوان پیش‌نویس -->
        <button
          type="button"
          :disabled="isSaving"
          class="h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          @click="emit('saveDraft')"
        >
          <Save class="w-3.5 h-3.5 text-slate-600" />
          <span>ذخیره پیش‌نویس</span>
        </button>

        <!-- دکمه اصلی انتشار کالا -->
        <button
          type="button"
          data-testid="save-product-btn"
          :disabled="isSaving"
          class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none"
          @click="emit('save')"
        >
          <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
          <Check v-else class="w-3.5 h-3.5" />
          <span>{{ isEditing ? 'به‌روزرسانی و ثبت اثر' : 'انتشار اثر در کاتالوگ' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
