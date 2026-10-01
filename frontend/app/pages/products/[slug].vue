<!-- frontend/app/pages/products/[slug].vue -->
<script setup lang="ts">
import type { ProductDetail, Variant } from '~/types/domain'
import { ShoppingBag, Heart, Check } from '@lucide/vue'

interface ExtendedVariant extends Variant {
  price?: number
  compareAtPrice?: number
}

interface ExtendedProductDetail extends Omit<ProductDetail, 'variants' | 'base_price'> {
  base_price?: number
  price?: number
  compareAtPrice?: number
  compare_at_price?: number
  variants: ExtendedVariant[]
  fabric?: {
    stretch?: number
    softness?: number
    opacity?: number
    composition?: string
    gsm?: number
  }
}

const route = useRoute()
const { getProductBySlug } = useProducts()

const slug = computed(() => String(route.params.slug))
const rawProduct = await getProductBySlug(slug.value)
const product = computed(() => (rawProduct as unknown as ExtendedProductDetail) || null)

const selectedSize = ref<string | null>(null)
const isWishlisted = ref(false)

const displayPrice = computed(() => {
  if (!product.value) return 0
  if (typeof product.value.base_price === 'number') return product.value.base_price
  if (typeof product.value.price === 'number') return product.value.price
  const firstVariant = product.value.variants?.[0]
  if (firstVariant && typeof firstVariant.price === 'number') return firstVariant.price
  return 1450000
})

const displayCompareAtPrice = computed(() => {
  if (!product.value) return undefined
  if (typeof product.value.compare_at_price === 'number') return product.value.compare_at_price
  if (typeof product.value.compareAtPrice === 'number') return product.value.compareAtPrice
  return undefined
})

if (product.value) {
  useSeoMeta({
    title: `${product.value.title} | کراس`,
    description: product.value.description,
  })
}

const handleAddToCart = () => {
  if (!selectedSize.value) {
    if (import.meta.client) window.alert('لطفاً ابتدا سایز مورد نظر خود را انتخاب کنید.')
    return
  }
  if (import.meta.client) window.alert(`محصول با سایز ${selectedSize.value} به سبد افزوده شد.`)
}

const openSizeGuide = () => {
  if (import.meta.client) {
    window.alert('راهنمای سایز کراس: لطفاً دور کمر و دور باسن را بر حسب سانتی‌متر تطبیق دهید.')
  }
}
</script>

<template>
  <div v-if="product" class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      <!-- ۱. گالری عمودی ادیتوریال -->
      <div class="lg:col-span-7">
        <ProductGallery :images="product.images || []" :title="product.title" :line="product.line" />
      </div>

      <!-- ۲. ستون خرید و سفارش -->
      <div class="lg:col-span-5 space-y-6">
        <!-- عنوان و وضعیت انبار -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">کالکشن تخصصی کراس</span>
            <span
              class="text-xs font-medium text-sage bg-sage/10 border border-sage/20 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check class="w-3 h-3" /> موجود در انبار
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {{ product.title }}
          </h1>

          <p class="text-sm text-muted-foreground leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- قیمت -->
        <div class="pt-1 pb-3 border-b border-sand/80">
          <PriceTag :price="displayPrice" :compare-at-price="displayCompareAtPrice" size="lg" />
        </div>

        <!-- کامپوننت انتخاب سایز -->
        <SizeSelector
v-model="selectedSize" :variants="product.variants" :sizes="product.available_sizes"
          @open-size-guide="openSizeGuide" />

        <!-- اکشن اصلی خرید -->
        <div class="flex items-center gap-3 pt-2">
          <Button
size="lg"
            class="flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            :class="[
              selectedSize
                ? 'bg-rose hover:bg-rose/90 text-white'
                : 'bg-sand/60 text-muted-foreground hover:bg-sand/80 cursor-not-allowed',
            ]" :disabled="!selectedSize" @click="handleAddToCart">
            <ShoppingBag class="w-5 h-5 shrink-0" />
            <span>{{ selectedSize ? 'افزودن به سبد خرید' : 'انتخاب سایز الزامی است' }}</span>
          </Button>

          <Button
variant="outline" size="lg"
            class="h-12 w-12 rounded-xl border-sand hover:bg-sand/30 shrink-0 text-ink cursor-pointer"
            @click="isWishlisted = !isWishlisted">
            <Heart class="w-5 h-5" :class="isWishlisted ? 'fill-rose text-rose' : 'text-ink'" />
          </Button>
        </div>

        <!-- بج‌های اعتمادساز متصل به data -->
        <ProductTrustBadges />
      </div>
    </div>

    <!-- ۳. تب‌های مشخصات فنی، سنجه‌ها و شست‌وشو -->
    <ProductTabs :title="product.title" :description="product.description" :fabric="product.fabric" />

    <!-- نوار شناور موبایل -->
    <StickyBuyBar
:price="displayPrice" :compare-at-price="displayCompareAtPrice" :variants="product.variants"
      :selected-size="selectedSize" @update:selected-size="selectedSize = $event" @add-to-cart="handleAddToCart" />
  </div>
</template>
