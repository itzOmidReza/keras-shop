<!-- frontend/app/pages/dev/components.vue -->
<script setup lang="ts">
import ProductCard from '~/components/product/ProductCard.vue'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { useProducts } from '~/composables/useProducts'
import { Sparkles, ShoppingBag, ArrowLeft } from '@lucide/vue'

const { getProducts, loading } = useProducts()
const products = ref([])

onMounted(async () => {
  products.value = await getProducts()
})
</script>

<template>
  <div class="min-h-screen bg-paper pb-20 pt-8">
    <div class="container mx-auto px-4 max-w-6xl space-y-12">
      <!-- هدر صفحه تست -->
      <header class="border-b border-sand pb-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-ink flex items-center gap-2">
            <Sparkles class="w-6 h-6 text-coral" />
            آزمایشگاه کامپوننت‌های کراس (Dev Lab)
          </h1>
          <p class="text-sm text-muted mt-1">تست بصری و رفتاری کامپوننت‌ها به صورت مستقل</p>
        </div>
        <Badge variant="outline" class="border-coral text-coral">
          محیط توسعه
        </Badge>
      </header>

      <!-- بخش ۱: تست پالت رنگی و استایل دکمه‌ها -->
      <section class="space-y-4">
        <h2 class="text-lg font-bold text-ink">۱. دکمه‌ها و بج‌ها (UI)</h2>
        <div class="flex flex-wrap items-center gap-4 p-6 rounded-card border border-sand bg-white/50">
          <Button variant="default">
            <ShoppingBag class="w-4 h-4 ms-2" />
            دکمه اصلی (Coral)
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
            <Badge class="bg-coral text-white">مرجانی</Badge>
            <Badge class="bg-sage text-ink">سبز مریم‌گلی</Badge>
            <Badge class="bg-sand text-ink">شنی</Badge>
          </div>
        </div>
      </section>

      <!-- بخش ۲: تست کارت محصول با داده‌های Mock -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-ink">۲. کارت محصول (ProductCard)</h2>
          <span class="text-xs text-muted">نسبت ۴:۵ + هاور موشن + تست شفافیت</span>
        </div>

        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="aspect-[4/5] rounded-card bg-sand/40 animate-pulse" />
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ProductCard v-for="(product, idx) in products" :key="product.id" :product="product" :priority="idx === 0" />
        </div>
      </section>
    </div>
  </div>
</template>
