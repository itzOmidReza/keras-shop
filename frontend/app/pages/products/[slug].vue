<!-- frontend/app/pages/products/[slug].vue -->
<script setup lang="ts">
import { ShoppingBag, Heart, Check } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { useCartStore } from '~/stores/cart'
import { useWishlistStore } from '~/stores/wishlist'

const route = useRoute()
const { getProductBySlug, getProductReviews, getRelatedProducts } = useProducts()
const cartStore = useCartStore()

const slug = computed(() => String(route.params.slug))

const { data: product } = await useAsyncData(
  `product-${slug.value}`,
  () => getProductBySlug(slug.value),
  { watch: [slug] },
)

if (!product.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'محصول مورد نظر یافت نشد.',
    fatal: true,
  })
}

// واکشی موازی دیدگاه‌ها و محصولات مرتبط
const { data: reviewsData } = await useAsyncData(
  `product-reviews-${slug.value}`,
  () => getProductReviews(slug.value),
  { watch: [slug] },
)

const { data: relatedProducts } = await useAsyncData(
  `product-related-${slug.value}`,
  () => getRelatedProducts(slug.value),
  { watch: [slug] },
)

const selectedSize = ref<string | null>(null)
const wishlistStore = useWishlistStore()

const isWishlisted = computed(() => {
  return product.value ? wishlistStore.isInWishlist(product.value.id) : false
})

const handleToggleWishlist = () => {
  if (product.value) {
    wishlistStore.toggleWishlist(product.value)
  }
}

const displayPrice = computed(() => product.value?.base_price ?? 0)
const displayCompareAtPrice = computed(() => product.value?.compare_at_price)

const fabricData = computed(() => {
  if (!product.value) return undefined
  return {
    stretch: product.value.stretch,
    softness: product.value.softness,
    opacity: product.value.opacity,
    composition: product.value.fabric_composition,
    gsm: product.value.fabric_gsm,
  }
})

if (product.value) {
  useSeoMeta({
    title: `${product.value.title} | کراس`,
    description: product.value.description,
  })
}

const handleAddToCart = () => {
  if (!product.value) return

  if (!selectedSize.value) {
    toast.error('لطفاً ابتدا سایز مورد نظر خود را انتخاب کنید.')
    return
  }

  const matchingVariant = product.value.variants.find(
    (v) => v.size === selectedSize.value,
  )

  const availableStock = matchingVariant
    ? matchingVariant.stock - matchingVariant.reserved
    : 10

  if (availableStock <= 0) {
    toast.error('متأسفانه موجودی این سایز به اتمام رسیده است.')
    return
  }

  cartStore.addItem({
    productId: product.value.id,
    variantId: matchingVariant?.id,
    title: product.value.title,
    slug: product.value.slug,
    size: selectedSize.value,
    color: matchingVariant?.color,
    price: matchingVariant?.price_override ?? product.value.base_price,
    compareAtPrice: matchingVariant?.compare_at_price ?? product.value.compare_at_price,
    maxStock: availableStock,
    image: product.value.images[0]?.url || '',
  })
}

const isSizeGuideOpen = ref(false)

const openSizeGuide = () => {
  isSizeGuideOpen.value = true
}

const handleSizeSelectedFromGuide = (size: string) => {
  selectedSize.value = size
  toast.success(`سایز ${size} با موفقیت انتخاب شد.`)
}
</script>

<template>
  <div v-if="product" class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
      <!-- ۱. گالری عمودی ادیتوریال -->
      <div class="lg:col-span-7">
        <ProductGallery
          :images="product.images || []"
          :title="product.title"
          :line="product.line"
          :season="product.season"
          :badge="product.badge"
        />
      </div>

      <!-- ۲. ستون خرید و سفارش -->
      <div class="lg:col-span-5 space-y-6">
        <!-- عنوان و وضعیت انبار -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              کالکشن تخصصی کراس
            </span>
            <span
              class="text-xs font-medium text-sage bg-sage/10 border border-sage/20 px-2 py-0.5 rounded-full flex items-center gap-1"
            >
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
          v-model="selectedSize"
          :variants="product.variants"
          :sizes="product.available_sizes"
          @open-size-guide="openSizeGuide"
        />

        <!-- اکشن اصلی خرید -->
        <div class="flex items-center gap-3 pt-2">
          <Button
            size="lg"
            class="flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            :class="[
              selectedSize
                ? 'bg-rose hover:bg-rose/90 text-white'
                : 'bg-sand/60 text-muted-foreground hover:bg-sand/80 cursor-not-allowed',
            ]"
            :disabled="!selectedSize"
            @click="handleAddToCart"
          >
            <ShoppingBag class="w-5 h-5 shrink-0" />
            <span>{{ selectedSize ? 'افزودن به سبد خرید' : 'انتخاب سایز الزامی است' }}</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            class="h-12 w-12 rounded-xl border-sand hover:bg-sand/30 shrink-0 text-ink cursor-pointer transition-all active:scale-90"
            :aria-label="isWishlisted ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'"
            @click="handleToggleWishlist"
          >
            <Heart class="w-5 h-5 transition-colors" :class="isWishlisted ? 'fill-rose text-rose' : 'text-ink'" />
          </Button>
        </div>

        <!-- بج‌های اعتمادساز متصل به data -->
        <ProductTrustBadges />
      </div>
    </div>

    <!-- ۳. تب‌های مشخصات فنی، سنجه‌ها و شست‌وشو -->
    <ProductTabs
      :title="product.title"
      :description="product.description"
      :fabric="fabricData"
    />

    <!-- ۴. دیدگاه‌ها و ارزیابی کیفی خریداران -->
    <ProductReviews
      v-if="reviewsData"
      :reviews="reviewsData.reviews"
      :summary="reviewsData.summary"
      :product-title="product.title"
    />

    <!-- ۵. محصولات مکمل و تکمیل استایل -->
    <RelatedProducts
      v-if="relatedProducts && relatedProducts.length > 0"
      :products="relatedProducts"
      title="محصولات مکمل برای استایل چهارفصل"
    />

    <!-- نوار شناور موبایل -->
    <StickyBuyBar
      :price="displayPrice"
      :compare-at-price="displayCompareAtPrice"
      :variants="product.variants"
      :selected-size="selectedSize"
      @update:selected-size="selectedSize = $event"
      @add-to-cart="handleAddToCart"
    />

    <!-- مدال راهنمای سایز و محاسبه‌گر هوشمند فیت -->
    <SizeGuideModal
      v-if="product"
      v-model:open="isSizeGuideOpen"
      :collection="product.line"
      :current-size="selectedSize"
      :available-sizes="product.available_sizes"
      @select-size="handleSizeSelectedFromGuide"
    />
  </div>
</template>
