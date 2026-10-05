<!-- frontend/app/components/product/ProductCard.vue -->
<script setup lang="ts">
import type { ProductListItem } from '~/types/domain'
import { Heart } from '@lucide/vue'
import { productLines } from '~/data'
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'

interface Props {
  product: ProductListItem
  priority?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  priority: false,
})

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()
const isFavorite = computed(() => wishlistStore.isInWishlist(props.product.id))

const availableSizes = computed(() => {
  if (props.product.sizes && props.product.sizes.length > 0) {
    return props.product.sizes
  }
  if (props.product.available_sizes && props.product.available_sizes.length > 0) {
    return props.product.available_sizes
  }
  return ['Free']
})

const quickAddSize = (size: string, event: Event) => {
  event.stopPropagation()
  event.preventDefault()
  const primaryColor = props.product.colors?.[0]?.name || 'پیش‌فرض'
  const price = props.product.price ?? props.product.base_price

  cartStore.addItem({
    productId: props.product.id,
    title: props.product.title,
    price,
    compareAtPrice: props.product.compare_at_price,
    size,
    color: primaryColor,
    image: primaryImage.value,
    slug: props.product.slug,
    maxStock: 10,
  }, 1)
}

// استخراج تصویر اول و دوم برای هاور موشن مینیمال
const primaryImage = computed(() => {
  return props.product.images?.[0]?.url || '/placeholder.jpg'
})

const hoverImage = computed(() => {
  return props.product.images?.[1]?.url || primaryImage.value
})

const productBadge = computed(() => {
  if (props.product.badge) return props.product.badge
  if (props.product.season === 'fall-1405') return 'پاییز ۱۴۰۵'
  if (props.product.season === 'spring-1406') return 'بهار ۱۴۰۶'
  if (props.product.season === 'winter-1405') return 'زمستان ۱۴۰۵'
  if (props.product.season === 'summer-1405') return 'تابستان ۱۴۰۵'
  if (props.product.line && productLines[props.product.line as keyof typeof productLines]) {
    return productLines[props.product.line as keyof typeof productLines].badge
  }
  return null
})

const productBadgeClass = computed(() => {
  if (props.product.badge === 'حراج' || props.product.badge === 'sale') {
    return 'bg-rose text-white'
  }
  if (props.product.season === 'fall-1405') {
    return 'bg-rose text-white'
  }
  if (props.product.season === 'spring-1406') {
    return 'bg-sage text-white'
  }
  return 'bg-paper/85 text-ink border border-sand'
})
</script>

<template>
  <div class="group relative flex flex-col overflow-hidden" data-testid="product-card">
    <!-- ظرف تصویر با نسبت ۴:۵ -->
    <NuxtLink
      :to="`/products/${product.slug}`"
      class="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-sand/30"
    >
      <!-- تصویر اصلی -->
      <NuxtImg
        :src="primaryImage"
        :alt="product.title"
        :loading="priority ? 'eager' : 'lazy'"
        class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />

      <!-- تصویر ثانویه برای هاور -->
      <NuxtImg
        v-if="hoverImage !== primaryImage"
        :src="hoverImage"
        :alt="product.title"
        loading="lazy"
        class="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      <!-- بج فصل یا کالکشن کالا -->
      <div v-if="productBadge" class="absolute inset-s-3 top-3">
        <span
          class="rounded-full px-2.5 py-1 text-[10px] font-bold shadow-xs backdrop-blur-md"
          :class="productBadgeClass"
        >
          {{ productBadge }}
        </span>
      </div>

      <!-- دکمه علاقه‌مندی شناور روی تصویر -->
      <button
        type="button"
        class="absolute inset-e-3 top-3 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs flex items-center justify-center text-ink hover:text-rose hover:bg-white shadow-2xs transition-all active:scale-90 cursor-pointer"
        :aria-label="isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
        @click.stop.prevent="wishlistStore.toggleWishlist(product)"
      >
        <Heart
          class="w-4 h-4 transition-colors"
          :class="isFavorite ? 'fill-rose text-rose' : 'text-ink/80'"
        />
      </button>

      <!-- پیل‌های انتخاب سریع سایز در هاور کارت دسکتاپ -->
      <div
        class="absolute inset-x-2 bottom-2 z-10 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hidden sm:flex flex-col items-center gap-1 p-2 rounded-xl bg-white/95 backdrop-blur-md shadow-xs border border-sand/60"
        @click.stop.prevent
      >
        <span class="text-[9px] font-bold text-muted-foreground">انتخاب سریع سایز:</span>
        <div class="flex flex-wrap items-center justify-center gap-1">
          <button
            v-for="s in availableSizes"
            :key="s"
            type="button"
            class="px-2 py-0.5 text-[10px] font-bold rounded-md border border-sand bg-paper hover:bg-ink hover:text-paper hover:border-ink text-ink transition-colors cursor-pointer active:scale-95"
            @click.stop.prevent="quickAddSize(s, $event)"
          >
            {{ s }}
          </button>
        </div>
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
        <PriceTag :price="product.base_price" :compare-at-price="product.compare_at_price" size="sm" />

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
