<!-- frontend/app/components/product/ProductCard.vue -->
<script setup lang="ts">
import type { ProductListItem } from '~/types/domain'
import { formatToman } from '~/utils/format'
import { Heart } from '@lucide/vue'

const props = defineProps<{
  product: ProductListItem
  priority?: boolean
}>()

const isFavorite = ref(false)

const primaryImage = computed(() => {
  return props.product.images?.find(img => img.kind === 'photo') || props.product.images?.[0]
})

const hoverImage = computed(() => {
  return props.product.images?.find(img => img.kind === 'motion') || null
})
</script>

<template>
  <article class="group relative flex flex-col">
    <!-- کادر تصویر به سبک Velora با حاشیه نرم -->
    <div
      class="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand/30 border border-sand/50 transition-all duration-300 group-hover:border-sand group-hover:shadow-sm">

      <!-- لینک اصلی کارت -->
      <NuxtLink :to="`/products/${product.slug}`" class="absolute inset-0 z-10" :aria-label="product.title">
        <span class="sr-only">{{ product.title }}</span>
      </NuxtLink>

      <!-- بج وضعیت (لاین کالا / تست شفافیت) -->
      <div class="absolute top-3 start-3 z-20 flex flex-col gap-1 pointer-events-none">
        <span
v-if="product.line"
          class="inline-block rounded-full bg-paper/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-ink shadow-xs">
          لاین {{ product.line.toUpperCase() }}
        </span>
      </div>

      <!-- دکمه علاقه‌مندی شناور در گوشه کارت -->
      <button
type="button"
        class="absolute top-3 end-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-paper/80 backdrop-blur-md text-ink shadow-xs transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        :aria-label="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
        @click.prevent="isFavorite = !isFavorite">
        <Heart
class="h-4 w-4 transition-colors"
          :class="isFavorite ? 'fill-rose text-rose' : 'text-ink/70 hover:text-ink'" />
      </button>

      <!-- عکس اول -->
      <img
v-if="primaryImage" :src="primaryImage.url" :alt="primaryImage.alt || product.title"
        class="h-full w-full object-cover object-center transition-all duration-500 ease-out"
        :class="hoverImage ? 'group-hover:scale-105 group-hover:opacity-0' : 'group-hover:scale-105'"
        :loading="priority ? 'eager' : 'lazy'">

      <!-- عکس دوم هنگام هاور موس -->
      <img
v-if="hoverImage" :src="hoverImage.url" :alt="hoverImage.alt || product.title"
        class="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
        loading="lazy">
    </div>

    <!-- اطلاعات متنی زیر عکس (خلوت و مینیمال) -->
    <div class="flex flex-col pt-3 pb-1 space-y-1.5">
      <!-- سایزهای موجود و رنگ‌ها -->
      <div class="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{{ product.available_sizes?.join(' · ') || 'فری‌سایز' }}</span>

        <div v-if="product.colors?.length" class="flex items-center gap-1">
          <span
v-for="color in product.colors.slice(0, 3)" :key="color.name"
            class="h-2.5 w-2.5 rounded-full border border-sand" :style="{ backgroundColor: color.hex }" />
        </div>
      </div>

      <!-- عنوان کالا -->
      <h3 class="text-sm font-bold text-ink line-clamp-1 transition-colors group-hover:text-rose">
        <NuxtLink :to="`/products/${product.slug}`">
          {{ product.title }}
        </NuxtLink>
      </h3>

      <!-- قیمت -->
      <div class="pt-0.5">
        <span class="text-sm font-bold text-ink">
          {{ formatToman(product.base_price) }}
        </span>
      </div>
    </div>
  </article>
</template>
