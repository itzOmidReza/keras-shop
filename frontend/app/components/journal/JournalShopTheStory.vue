<!-- frontend/app/components/journal/JournalShopTheStory.vue -->
<script setup lang="ts">
import { ShoppingBag, ArrowLeft, Check, Sparkles } from '@lucide/vue'
import type { LinkedGarment } from '~/types/domain'

defineProps<{
  products: LinkedGarment[]
}>()

const cartStore = useCartStore()
const addedIds = ref<number[]>([])

const handleAddToCart = (product: LinkedGarment) => {
  cartStore.addItem({
    productId: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    size: 'Free',
    color: 'پیش‌فرض',
    maxStock: 10,
    slug: product.slug,
  })

  if (!addedIds.value.includes(product.id)) {
    addedIds.value.push(product.id)
    setTimeout(() => {
      addedIds.value = addedIds.value.filter(id => id !== product.id)
    }, 2500)
  }
}
</script>

<template>
  <section
    v-if="products && products.length > 0"
    class="my-16 pt-12 border-t border-sand/80"
    data-testid="shop-the-story-widget"
  >
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sand/60 text-ink mb-2">
          <Sparkles class="w-3.5 h-3.5 text-rose" />
          محصولات این استایل
        </div>
        <h3 class="text-xl sm:text-2xl lg:text-3xl font-black font-sans text-ink">
          خرید آیتم‌های ادیتوریال (Shop the Story)
        </h3>
        <p class="text-xs sm:text-sm text-ink/70 font-sans mt-1">
          قطعات معرفی‌شده در این روایت را به آسانی به استایل خود اضافه کنید.
        </p>
      </div>

      <NuxtLink
        to="/shop"
        class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-ink hover:text-rose transition-colors shrink-0"
      >
        <span>مشاهده همه محصولات کاتالوگ</span>
        <ArrowLeft class="w-4 h-4" />
      </NuxtLink>
    </div>

    <!-- گرید محصولات معرفی‌شده -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="group bg-white rounded-2xl border border-sand/70 p-4 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        data-testid="story-product-card"
      >
        <div>
          <!-- تصویر کالا -->
          <NuxtLink
            :to="`/products/${product.slug}`"
            class="block overflow-hidden rounded-xl aspect-4/5 bg-sand/20 mb-3 relative"
          >
            <img
              :src="product.image"
              :alt="product.title"
              class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            >
            <span
              v-if="product.badge"
              class="absolute top-2.5 start-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-ink shadow-2xs"
            >
              {{ product.badge }}
            </span>
          </NuxtLink>

          <!-- اطلاعات محصول -->
          <h4 class="text-sm font-bold text-ink group-hover:text-rose transition-colors line-clamp-1 mb-1">
            <NuxtLink :to="`/products/${product.slug}`">
              {{ product.title }}
            </NuxtLink>
          </h4>

          <div class="text-xs font-bold text-ink/80 font-mono mb-4">
            {{ formatToman(product.price) }}
          </div>
        </div>

        <!-- دکمه‌های اقدام سریع -->
        <div class="flex items-center gap-2 pt-3 border-t border-sand/40">
          <button
            type="button"
            data-testid="add-story-product-btn"
            class="flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="[
              addedIds.includes(product.id)
                ? 'bg-sage text-white'
                : 'bg-ink hover:bg-ink/90 text-white shadow-2xs',
            ]"
            @click="handleAddToCart(product)"
          >
            <Check v-if="addedIds.includes(product.id)" class="w-3.5 h-3.5" />
            <ShoppingBag v-else class="w-3.5 h-3.5" />
            <span>{{ addedIds.includes(product.id) ? 'افزوده شد' : 'افزودن به سبد' }}</span>
          </button>

          <NuxtLink
            :to="`/products/${product.slug}`"
            class="p-2 rounded-xl border border-sand text-ink/70 hover:text-ink hover:bg-sand/30 transition-colors"
            title="مشاهده جزئیات محصول"
          >
            <ArrowLeft class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
