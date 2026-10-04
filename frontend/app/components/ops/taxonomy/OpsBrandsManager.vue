<!-- frontend/app/components/ops/taxonomy/OpsBrandsManager.vue -->
<script setup lang="ts">
import { Plus, Award, MapPin } from '@lucide/vue'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'

const { brandItems } = useOpsTaxonomy()

const emit = defineEmits<{
  (e: 'openAddBrand'): void
}>()
</script>

<template>
  <div class="space-y-4 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
      <div>
        <h3 class="text-sm font-bold text-slate-900">
          برندها، طراحان و خطوط تولید آتلیه
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
          مدیریت هویت سازندگان، بیوگرافی طراحان اثر و شناسنامه مبدا جغرافیایی
        </p>
      </div>

      <button
        type="button"
        class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
        @click="emit('openAddBrand')"
      >
        <Plus class="w-4 h-4" />
        <span>ثبت برند یا طراح جدید</span>
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="brand in brandItems"
        :key="brand.id"
        class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
      >
        <div>
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Award class="w-4 h-4" />
            </div>
            <div class="min-w-0 flex-1">
              <span class="text-xs font-black text-slate-900 block truncate">{{ brand.name }}</span>
              <div class="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                <MapPin class="w-3 h-3" />
                <span>{{ brand.origin }}</span>
              </div>
            </div>
          </div>

          <p class="text-xs text-slate-600 mt-3 leading-relaxed">
            {{ brand.bio }}
          </p>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-[10px] font-mono text-slate-400">{{ brand.slug }}</span>
          <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono font-bold tabular-nums">
            {{ brand.inUseCount }} اثر
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
