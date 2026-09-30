<!-- frontend/app/components/product/ProductCard.vue -->
<script setup lang="ts">
import type { ProductListItem } from '~/types/domain'
import { formatToman } from '~/utils/format'
import { Star, ShieldCheck } from '@lucide/vue'

const props = defineProps<{
  product: ProductListItem
  priority?: boolean
}>()

// تصویر اصلی (photo) و تصویر ثانویه/حرکت (motion) برای هاور
const primaryImage = computed(() => {
  return props.product.images.find(img => img.kind === 'photo') || props.product.images[0]
})

const hoverImage = computed(() => {
  return props.product.images.find(img => img.kind === 'motion') || null
})
</script>

<template>
  <article
    class="group relative flex flex-col rounded-card bg-paper overflow-hidden border border-sand transition-shadow duration-200 hover:shadow-soft">
    <!-- لینک سراسری روی کل کارت -->
    <NuxtLink :to="`/p/${product.slug}`" class="absolute inset-0 z-10" :aria-label="product.title">
      <span class="sr-only">{{ product.title }}</span>
    </NuxtLink>

    <!-- بخش تصویر با نسبت ۴:۵ -->
    <div class="relative aspect-[4/5] w-full overflow-hidden bg-sand/40">
      <!-- برچسب تست شفافیت -->
      <div
v-if="product.has_transparency_test"
        class="absolute top-3 start-3 z-20 flex items-center gap-1 rounded-full bg-paper/90 backdrop-blur px-2.5 py-1 text-xs text-ink shadow-sm">
        <ShieldCheck class="w-3.5 h-3.5 text-sage" />
        <span class="font-medium">تست شفافیت</span>
      </div>

      <!-- برچسب خط محصول (حرکت / آرامش) -->
      <div
class="absolute top-3 end-3 z-20 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide"
        :class="product.line === 'move' ? 'bg-coral/15 text-coral' : 'bg-sage/20 text-ink'">
        {{ product.line === 'move' ? 'حرکت' : 'آرامش' }}
      </div>

      <!-- تصویر اصلی -->
      <img
v-if="primaryImage" :src="primaryImage.url" :alt="primaryImage.alt"
        class="h-full w-full object-cover object-center transition-opacity duration-300"
        :class="hoverImage ? 'group-hover:opacity-0' : ''" :loading="priority ? 'eager' : 'lazy'" width="400"
        height="500">

      <!-- تصویر هاور (در صورت وجود) -->
      <img
v-if="hoverImage" :src="hoverImage.url" :alt="hoverImage.alt"
        class="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        loading="lazy" width="400" height="500">
    </div>

    <!-- اطلاعات متنی محصول -->
    <div class="flex flex-1 flex-col p-4">
      <!-- انتخاب رنگ و امتیاز -->
      <div class="flex items-center justify-between gap-2 mb-2">
        <!-- دایره‌های رنگ -->
        <div class="flex items-center gap-1.5" aria-label="رنگ‌های موجود">
          <span
v-for="color in product.colors" :key="color.name"
            class="h-3.5 w-3.5 rounded-full border border-sand shadow-inner" :style="{ backgroundColor: color.hex }"
            :title="color.name" />
        </div>

        <!-- امتیاز و تعداد نقد -->
        <div v-if="product.rating_count > 0" class="flex items-center gap-1 text-xs text-muted">
          <span class="text-ink font-medium">{{ product.rating_avg }}</span>
          <Star class="w-3.5 h-3.5 fill-coral text-coral" />
          <span class="text-[11px]">({{ product.rating_count }})</span>
        </div>
      </div>

      <!-- عنوان محصول -->
      <h3 class="text-sm font-medium text-ink line-clamp-1 mb-2">
        {{ product.title }}
      </h3>

      <!-- قیمت و وضعیت موجودی -->
      <div class="mt-auto flex items-center justify-between pt-2 border-t border-sand/50">
        <span class="text-sm font-bold text-ink">
          {{ formatToman(product.base_price) }}
        </span>

        <span class="text-xs text-muted">
          {{ product.available_sizes.join(' · ') }}
        </span>
      </div>
    </div>
  </article>
</template>
