<!-- frontend/app/components/catalog/CatalogHeader.vue -->
<script setup lang="ts">
import { Sparkles } from '@lucide/vue'
import { toFa } from '~/utils/format'

defineProps<{
  totalItems: number
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
    </div>

    <div class="text-xs text-muted-foreground font-medium">
      <span>نمایش </span>
      <span class="font-bold text-ink">{{ toFa(totalItems) }}</span>
      <span> کالا در کاتالوگ کراس</span>
    </div>
  </header>
</template>
