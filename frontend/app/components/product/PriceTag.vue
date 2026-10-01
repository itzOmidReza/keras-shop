<!-- frontend/app/components/product/PriceTag.vue -->
<script setup lang="ts">
interface Props {
  price: number
  compareAtPrice?: number | null
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  compareAtPrice: null,
  size: 'md',
})

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('fa-IR').format(value)
}

const discountPercent = computed(() => {
  if (!props.compareAtPrice || props.compareAtPrice <= props.price) return null
  return Math.round(((props.compareAtPrice - props.price) / props.compareAtPrice) * 100)
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        price: 'text-xs sm:text-sm font-bold',
        compare: 'text-[10px]',
        badge: 'text-[9px] px-1 py-0.2',
        currency: 'text-[10px]',
      }
    case 'lg':
      return {
        price: 'text-xl sm:text-2xl font-bold',
        compare: 'text-sm',
        badge: 'text-xs px-2 py-0.5',
        currency: 'text-xs',
      }
    case 'md':
    default:
      return {
        price: 'text-base sm:text-lg font-bold',
        compare: 'text-xs',
        badge: 'text-[10px] px-1.5 py-0.5',
        currency: 'text-[11px]',
      }
  }
})
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- قیمت اصلی و واحد پولی -->
    <div class="flex items-baseline gap-1">
      <span class="text-ink tracking-tight" :class="sizeClasses.price">
        {{ formatPrice(price) }}
      </span>
      <span class="text-muted-foreground font-medium" :class="sizeClasses.currency">
        تومان
      </span>
    </div>

    <!-- قیمت قبل از تخفیف -->
    <span
v-if="compareAtPrice && compareAtPrice > price"
      class="line-through text-muted-foreground decoration-sand-dark" :class="sizeClasses.compare">
      {{ formatPrice(compareAtPrice) }}
    </span>

    <!-- درصد تخفیف مینیمال به رنگ رز -->
    <span v-if="discountPercent" class="rounded-full bg-rose/10 font-bold text-rose" :class="sizeClasses.badge">
      {{ discountPercent }}٪-
    </span>
  </div>
</template>
