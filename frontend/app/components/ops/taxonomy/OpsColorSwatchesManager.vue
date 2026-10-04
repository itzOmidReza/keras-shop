<!-- frontend/app/components/ops/taxonomy/OpsColorSwatchesManager.vue -->
<script setup lang="ts">
import { Plus, Trash2, ArrowLeftRight } from '@lucide/vue'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'
import OpsAttributeMergerModal from '~/components/ops/taxonomy/OpsAttributeMergerModal.vue'

const { colorSwatches, deleteColorSwatch } = useOpsTaxonomy()

const isMergerOpen = ref(false)
const preselectedSourceId = ref<string | undefined>()

const openMerger = (colorId: string) => {
  preselectedSourceId.value = colorId
  isMergerOpen.value = true
}

const emit = defineEmits<{
  (e: 'openAddColor'): void
}>()
</script>

<template>
  <div class="space-y-4 font-sans">
    <!-- هدر کنترل‌ها -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div>
        <h3 class="text-sm font-bold text-slate-900">
          مدیریت پالت رنگ و پترن‌های پارچه
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          تعریف رنگ‌های اختصاصی آتلیه، کدهای هگز، بافت‌های پیچازی و خوشه‌بندی خانواده رنگ‌ها
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isMergerOpen = true"
        >
          <ArrowLeftRight class="w-3.5 h-3.5 text-slate-500" />
          <span>ادغام رنگ‌های مشابه</span>
        </button>

        <button
          type="button"
          class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          @click="emit('openAddColor')"
        >
          <Plus class="w-4 h-4" />
          <span>افزودن رنگ جدید</span>
        </button>
      </div>
    </div>

    <!-- گرید سواچ‌های رنگی -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="color in colorSwatches"
        :key="color.id"
        class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-3 hover:border-slate-300 transition-all"
      >
        <div class="flex items-center gap-3 min-w-0">
          <!-- دایره رنگ یا پترن -->
          <div
            v-if="color.patternUrl"
            class="w-10 h-10 rounded-xl border border-slate-200 shrink-0 bg-cover bg-center shadow-xs"
            :style="{ backgroundImage: `url(${color.patternUrl})` }"
          />
          <div
            v-else
            class="w-10 h-10 rounded-xl border border-slate-200 shrink-0 shadow-xs"
            :style="{ backgroundColor: color.hex }"
          />

          <div class="min-w-0">
            <span class="font-bold text-slate-900 block truncate text-xs">{{ color.name }}</span>
            <span class="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">{{ color.enName }} ({{ color.hex }})</span>
            <div class="flex items-center gap-1.5 mt-1.5">
              <span class="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                {{ color.family }}
              </span>
              <span class="px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-mono tabular-nums text-[10px] font-bold">
                {{ color.inUseCount }} محصول
              </span>
            </div>
          </div>
        </div>

        <!-- دکمه‌های عملیات سریع -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
            title="ادغام با رنگ دیگر"
            @click="openMerger(color.id)"
          >
            <ArrowLeftRight class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose cursor-pointer"
            title="حذف رنگ"
            @click="deleteColorSwatch(color.id)"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- مودال ادغام رنگ‌ها -->
    <OpsAttributeMergerModal
      v-model:open="isMergerOpen"
      :initial-source-id="preselectedSourceId"
    />
  </div>
</template>
