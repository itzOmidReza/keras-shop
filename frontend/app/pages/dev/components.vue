<!-- frontend/app/pages/dev/components.vue -->
<script setup lang="ts">
import { Sparkles, ShoppingBag, ArrowLeft } from '@lucide/vue'
import { toast } from 'vue-sonner'

const selectedSize = ref<string | null>('M')
const { getProducts, getProductBySlug } = useProducts()

const { data: products, pending: loading } = await useAsyncData(
  'dev-products',
  () => getProducts(),
)

const { data: detailProduct } = await useAsyncData(
  'dev-detail-product',
  () => getProductBySlug('calm-seamless-leggings-black'),
)

const firstProduct = computed(() => products.value?.[0] ?? null)

const openSizeGuide = () => {
  toast.info('راهنمای سایز: تطبیق دور کمر و دور باسن به سانتی‌متر')
}
</script>

<template>
  <div class="min-h-screen bg-paper pb-20 pt-8">
    <div class="container mx-auto px-4 max-w-6xl space-y-12">
      <!-- هدر صفحه تست -->
      <header class="border-b border-sand pb-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-ink flex items-center gap-2">
            <Sparkles class="w-6 h-6 text-rose" />
            آزمایشگاه کامپوننت‌های کراس (Dev Lab)
          </h1>
          <p class="text-sm text-muted-foreground mt-1">
            تست بصری و رفتاری کامپوننت‌ها به صورت مستقل
          </p>
        </div>
        <Badge variant="outline" class="border-rose text-rose">
          محیط توسعه
        </Badge>
      </header>

      <!-- بخش ۱: تست پالت رنگی و استایل دکمه‌ها -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-ink">
          ۱. دکمه‌ها و بج‌ها (UI)
        </h2>
        <div class="flex flex-wrap items-center gap-4 p-6 rounded-2xl border border-sand bg-white/50">
          <Button variant="default">
            <ShoppingBag class="w-4 h-4 ms-2" />
            دکمه اصلی (Rose)
          </Button>

          <Button variant="outline">
            دکمه ثانویه (Outline)
          </Button>

          <Button variant="secondary">
            دکمه خنثی
          </Button>

          <Button variant="ghost">
            دکمه بدون حاشیه
            <ArrowLeft class="w-4 h-4 me-2 rtl:-scale-x-100" />
          </Button>

          <div class="flex items-center gap-2 border-s border-sand ps-4">
            <Badge class="bg-rose text-white">
              رز
            </Badge>
            <Badge class="bg-sage text-white">
              سبز مریم‌گلی
            </Badge>
            <Badge class="bg-sand text-ink">
              شنی
            </Badge>
          </div>
        </div>
      </section>

      <!-- بخش ۲: تست کارت محصول با داده‌های Mock Service -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-ink">
            ۲. کارت محصول (ProductCard)
          </h2>
          <span class="text-xs text-muted-foreground">نسبت ۴:۵ + هاور موشن + تست شفافیت</span>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="aspect-4/5 rounded-2xl bg-sand/40 animate-pulse" />
        </div>

        <div v-else-if="products && products.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCard
            v-for="(product, idx) in products"
            :key="product.id"
            :product="product"
            :priority="idx === 0"
          />
        </div>
      </section>

      <!-- بخش ۳: سنجه‌های پارچه و قیمت متصل به Mock Service -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-ink">
          ۳. مشخصات پارچه (FabricMeters) و تگ قیمت (PriceTag)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <FabricMeters
            v-if="detailProduct"
            :stretch="detailProduct.stretch"
            :softness="detailProduct.softness"
            :opacity="detailProduct.opacity"
            :composition="detailProduct.fabric_composition"
            :gsm="detailProduct.fabric_gsm"
          />

          <div class="p-6 rounded-2xl border border-sand bg-white/50 space-y-4">
            <h4 class="text-sm font-bold text-ink">
              اندازه‌های مختلف PriceTag
            </h4>
            <div v-if="detailProduct" class="space-y-2">
              <PriceTag :price="detailProduct.base_price" size="sm" />
              <PriceTag
                :price="detailProduct.base_price"
                :compare-at-price="detailProduct.compare_at_price"
                size="md"
              />
              <PriceTag
                :price="detailProduct.base_price"
                :compare-at-price="detailProduct.compare_at_price"
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- بخش ۴: انتخابگر سایز (SizeSelector) -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-ink">
          ۴. انتخابگر سایز (SizeSelector)
        </h2>
        <div class="max-w-md p-6 rounded-2xl border border-sand bg-white/50">
          <SizeSelector
            v-if="detailProduct"
            v-model="selectedSize"
            :variants="detailProduct.variants"
            :sizes="detailProduct.available_sizes"
            @open-size-guide="openSizeGuide"
          />
        </div>
      </section>

      <!-- بخش ۵: گالری محصول (ProductGallery) -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-ink">
          ۵. گالری تصاویر محصول (ProductGallery)
        </h2>
        <div class="max-w-md p-6 rounded-2xl border border-sand bg-white/50">
          <ProductGallery
            v-if="detailProduct || firstProduct"
            :images="(detailProduct || firstProduct)!.images"
            :title="(detailProduct || firstProduct)!.title"
            :line="(detailProduct || firstProduct)!.line"
          />
        </div>
      </section>
    </div>
  </div>
</template>
