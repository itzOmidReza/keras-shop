<!-- frontend/app/components/product/ProductTrustBadges.vue -->
<script setup lang="ts">
import {
  Truck,
  RotateCcw,
  ShieldCheck,
} from '@lucide/vue'

const { freeShippingThreshold, returnPolicyDays } = useSiteSettings()

const dynamicPerks = computed(() => [
  {
    icon: Truck,
    title: 'ارسال سریع کشوری',
    description: `سفارش بالای ${formatToman(freeShippingThreshold.value)} رایگان`,
  },
  {
    icon: RotateCcw,
    title: 'تعویض آسان سایز',
    description: `تا ${toFa(returnPolicyDays.value)} روز کاری`,
  },
  {
    icon: ShieldCheck,
    title: 'تست عدم عبور نور',
    description: 'پارچه‌های کاملاً ضد دید',
  },
])
</script>

<template>
  <div class="grid grid-cols-3 gap-2 pt-4 border-t border-sand/80 text-center">
    <div
      v-for="(perk, idx) in dynamicPerks"
      :key="perk.title"
      class="space-y-1"
      :class="idx === 1 ? 'border-x border-sand' : ''"
    >
      <component :is="perk.icon" class="w-4 h-4 mx-auto text-rose" />
      <p class="text-[11px] font-bold text-ink">
        {{ perk.title }}
      </p>
      <p class="text-[10px] text-muted-foreground">
        {{ perk.description }}
      </p>
    </div>
  </div>
</template>
