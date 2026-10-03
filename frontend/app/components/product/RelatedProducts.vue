<!-- frontend/app/components/product/RelatedProducts.vue -->
<script setup lang="ts">
import type { ProductListItem } from '~/types/domain'
import { Sparkles, ArrowLeft } from '@lucide/vue'

interface Props {
  products: ProductListItem[]
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'تکمیل استایل با محصولات مکمل',
  subtitle: 'آیتم‌های هماهنگ با این کالکشن برای ساخت یک استایل ورزشی یکپارچه',
})
</script>

<template>
  <section v-if="products && products.length > 0" class="mt-16 pt-12 border-t border-sand" aria-label="محصولات پیشنهادی و مکمل">
    <!-- هدر بخش محصولات مکمل -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-1.5 text-rose mb-1">
          <Sparkles class="w-3.5 h-3.5" />
          <span class="text-xs font-bold uppercase tracking-wider">
            پیشنهاد استودیو کراس
          </span>
        </div>
        <h2 class="text-xl sm:text-2xl font-bold text-ink tracking-tight">
          {{ title }}
        </h2>
        <p class="text-xs text-muted-foreground mt-1">
          {{ subtitle }}
        </p>
      </div>

      <NuxtLink
        to="/shop"
        class="inline-flex items-center gap-1 text-xs font-bold text-rose hover:underline shrink-0"
      >
        <span>مشاهده کل کاتالوگ</span>
        <ArrowLeft class="w-3.5 h-3.5 ms-1" />
      </NuxtLink>
    </div>

    <!-- گرید واکنش‌گرا با استفاده از ProductCard موجود -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
      />
    </div>
  </section>
</template>
