<!-- frontend/app/components/ops/product-studio/ProductStudioActionBar.vue -->
<script setup lang="ts">
import { Check, ArrowRight, Loader2, PackageCheck } from '@lucide/vue'
import { useOpsProductStudio } from '~/composables/ops/useOpsProductStudio'

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
  (e: 'save'): void
}>()

const {
  variants,
  seoScore,
} = useOpsProductStudio()

const totalStock = computed(() => {
  return variants.value.reduce((acc, v) => acc + (Number(v.stock) || 0), 0)
})
</script>

<template>
  <div class="fixed bottom-0 inset-x-0 z-30 lg:ps-60 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-3 px-4 sm:px-6 shadow-lg font-sans">
    <div class="max-w-5xl mx-auto flex items-center justify-between gap-4">
      <!-- آمار خلاصه وضعیت اثر -->
      <div class="hidden sm:flex items-center gap-4 text-xs">
        <div class="flex items-center gap-1.5 text-slate-600 font-medium">
          <PackageCheck class="w-4 h-4 text-slate-400" />
          <span>{{ variants.length }} متغیر</span>
          <span class="text-slate-300">|</span>
          <span class="tabular-nums font-mono font-bold text-slate-800">{{ totalStock }} موجودی انبار</span>
        </div>
        <div class="flex items-center gap-1.5 text-slate-500">
          <span class="text-[11px]">سئو:</span>
          <span
            class="px-2 py-0.5 rounded-full font-mono text-[11px] font-bold"
            :class="seoScore >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
          >
            {{ seoScore }}%
          </span>
        </div>
      </div>

      <!-- دکمه‌های اکشن -->
      <div class="flex items-center gap-3 ms-auto sm:ms-0">
        <NuxtLink
          to="/internal-ops-nexus/products"
          class="h-10 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowRight class="w-4 h-4" />
          <span>انصراف</span>
        </NuxtLink>

        <button
          type="button"
          data-testid="save-product-btn"
          :disabled="isSaving"
          class="h-10 px-6 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:pointer-events-none"
          @click="emit('save')"
        >
          <Loader2 v-if="isSaving" class="w-4 h-4 animate-spin" />
          <Check v-else class="w-4 h-4" />
          <span>{{ isEditing ? 'به‌روزرسانی و ثبت نهایی اثر' : 'انتشار و ثبت اثر در کاتالوگ' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
