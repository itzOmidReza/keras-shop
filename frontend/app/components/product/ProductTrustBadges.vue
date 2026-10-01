<!-- frontend/app/components/product/ProductTrustBadges.vue -->
<script setup lang="ts">
import { brandPerks } from '~/data'
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from '@lucide/vue'

const iconMap = {
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
}
</script>

<template>
  <div class="grid grid-cols-3 gap-2 pt-4 border-t border-sand/80 text-center">
    <div
v-for="(perk, idx) in brandPerks.slice(0, 3)" :key="perk.title" class="space-y-1"
      :class="idx === 1 ? 'border-x border-sand' : ''">
      <component :is="iconMap[perk.icon as keyof typeof iconMap]" class="w-4 h-4 mx-auto text-rose" />
      <p class="text-[11px] font-bold text-ink">
        {{ perk.title }}
      </p>
      <p class="text-[10px] text-muted-foreground">
        {{ perk.description }}
      </p>
    </div>
  </div>
</template>
