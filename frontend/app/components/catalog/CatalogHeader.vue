<script setup lang="ts">
import { Sparkles, X } from '@lucide/vue'
import { toFa } from '~/utils/format'
import { BRAND_LABELS } from '~/composables/catalog/useShopCatalog'

defineProps<{
  searchQuery?: string | null
  badgeQuery?: string | null
  brandQuery?: string | null
  totalItems: number
}>()

const emit = defineEmits<{
  (e: 'clearSearch' | 'clearBadge' | 'clearBrand'): void
}>()
</script>

<template>
  <header class="mb-8 border-b border-sand pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-bold uppercase tracking-wider text-rose flex items-center gap-1">
          <Sparkles class="w-3.5 h-3.5" />
          کالکشن چهارفصل کراس (Keras Four-Season)
        </span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
        فروشگاه پوشاک و اکسسوری لایف‌استایل
      </h1>
      <p class="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
        طراحی‌شده برای چهارفصل سال با الیاف طبیعی لینن، بافت کشمیر و پشم مرینوس، و اکسسوری‌های دست‌ساز.
      </p>

      <!-- بج جست‌وجوی فعال و فیلترهای بالا -->
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <div v-if="searchQuery" class="inline-flex items-center gap-2 rounded-xl bg-sand/60 px-3 py-1.5 text-xs text-ink">
          <span>نتایج جست‌وجو برای: <strong class="text-rose font-bold">«{{ searchQuery }}»</strong></span>
          <button
            type="button"
            class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
            aria-label="حذف جست‌وجو"
            @click="emit('clearSearch')"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div v-if="badgeQuery" class="inline-flex items-center gap-2 rounded-xl bg-rose/10 px-3 py-1.5 text-xs text-rose font-bold">
          <span>فیلتر: <strong>{{ badgeQuery === 'sale' ? 'حراج فصل' : badgeQuery }}</strong></span>
          <button
            type="button"
            class="text-rose hover:text-ink cursor-pointer transition-colors"
            aria-label="حذف فیلتر نشان"
            @click="emit('clearBadge')"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <div v-if="brandQuery" class="inline-flex items-center gap-2 rounded-xl bg-sand/80 border border-sand px-3 py-1.5 text-xs text-ink font-medium">
          <span>برند: <strong>{{ BRAND_LABELS[String(brandQuery)] || brandQuery }}</strong></span>
          <button
            type="button"
            class="text-muted-foreground hover:text-rose cursor-pointer transition-colors"
            aria-label="حذف فیلتر برند"
            @click="emit('clearBrand')"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <div class="text-xs text-muted-foreground font-medium">
      <span>نمایش </span>
      <span class="font-bold text-ink">{{ toFa(totalItems) }}</span>
      <span> کالا در کاتالوگ کراس</span>
    </div>
  </header>
</template>
