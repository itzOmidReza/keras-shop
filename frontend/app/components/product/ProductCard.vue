<!-- frontend/app/components/product/ProductCard.vue -->
<script setup lang="ts">
import type { ProductListItem } from '~/types/domain'
import { productLines } from '~/data'
import PriceTag from '~/components/product/PriceTag.vue'

interface Props {
  product: ProductListItem
  priority?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  priority: false,
})

// استخراج تصویر اول و دوم برای هاور موشن مینیمال
const primaryImage = computed(() => {
  return props.product.images?.[0]?.url || '/placeholder.jpg'
})

const hoverImage = computed(() => {
  return props.product.images?.[1]?.url || primaryImage.value
})

const currentLine = computed(() => {
  return productLines[props.product.line as keyof typeof productLines]
})
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden">
    <!-- ظرف تصویر با نسبت ۴:۵ -->
    <NuxtLink
:to="`/products/${product.slug}`"
      class="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-sand/30">
      <!-- تصویر اصلی -->
      <NuxtImg
:src="primaryImage" :alt="product.title" :loading="priority ? 'eager' : 'lazy'"
        class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />

      <!-- تصویر ثانویه برای هاور -->
      <NuxtImg
v-if="hoverImage !== primaryImage" :src="hoverImage" :alt="product.title" loading="lazy"
        class="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <!-- بج لاین آرامش یا حرکت برگرفته از data -->
      <div v-if="currentLine" class="absolute inset-s-3 top-3">
        <span
class="rounded-full px-2.5 py-1 text-[10px] font-bold shadow-xs backdrop-blur-md" :class="[
          product.line === 'calm'
            ? 'bg-paper/85 text-ink border border-sand'
            : 'bg-rose text-white',
        ]">
          {{ currentLine.badge }}
        </span>
      </div>
    </NuxtLink>

    <!-- اطلاعات متنی محصول -->
    <div class="mt-3 flex flex-col gap-1 px-1">
      <NuxtLink
:to="`/products/${product.slug}`"
        class="text-xs sm:text-sm font-bold text-ink transition-colors hover:text-rose line-clamp-1">
        {{ product.title }}
      </NuxtLink>

      <div class="flex items-center justify-between pt-1">
        <PriceTag :price="product.base_price" size="sm" />

        <!-- نقاط تنوع رنگی مینیمال -->
        <div
v-if="product.colors && product.colors.length > 0"
          class="flex items-center -space-x-1 rtl:space-x-reverse">
          <span
v-for="color in product.colors.slice(0, 3)" :key="color.name"
            class="h-2.5 w-2.5 rounded-full border border-paper shadow-2xs" :style="{ backgroundColor: color.hex }"
            :title="color.name" />
          <span v-if="product.colors.length > 3" class="text-[9px] text-muted-foreground ps-1.5">
            +{{ product.colors.length - 3 }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
