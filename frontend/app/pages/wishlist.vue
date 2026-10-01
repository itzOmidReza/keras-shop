<!-- frontend/app/pages/wishlist.vue -->
<script setup lang="ts">
import {
  Heart,
  Sparkles,
  ArrowLeft,
  Trash2,
  ShoppingBag,
} from '@lucide/vue'
import { toFa } from '~/utils/format'
import { useWishlistStore } from '~/stores/wishlist'
import { useCartStore } from '~/stores/cart'
import type { WishlistItem } from '~/types/domain'

useSeoMeta({
  title: 'علاقه‌مندی‌ها | کراس',
  description: 'لیست محصولات برگزیده و نشان‌شده شما در برند پوشاک ورزشی کراس',
})

const wishlistStore = useWishlistStore()
const cartStore = useCartStore()

const availableSizes = ['XS', 'S', 'M', 'L', 'XL']

// انتقال سریع کالا با سایز مشخص به سبد خرید
const quickAddToCart = (item: WishlistItem, size: string) => {
  cartStore.addItem({
    productId: item.id,
    title: item.title,
    slug: item.slug,
    size,
    price: item.price,
    compareAtPrice: item.compare_at_price,
    maxStock: 10,
    image: item.primary_image,
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- وضعیت در حال هیدراتاسیون جهت جلوگیری از پرش چیدمان -->
    <div v-if="!wishlistStore.isHydrated" class="py-20 text-center space-y-3">
      <div class="w-10 h-10 border-2 border-sand border-t-rose rounded-full animate-spin mx-auto" />
      <p class="text-xs text-muted-foreground font-medium">
        در حال بازیابی لیست علاقه‌مندی‌های شما...
      </p>
    </div>

    <!-- حالت وجود آیتم در لیست علاقه‌مندی‌ها -->
    <div v-else-if="wishlistStore.items.length > 0" class="space-y-8">
      <!-- هدر صفحه و ابزارهای کنترلی -->
      <div class="border-b border-sand pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-bold uppercase tracking-wider text-rose flex items-center gap-1">
              <Heart class="w-4 h-4 fill-rose" />
              کالکشن برگزیده‌ها
            </span>
            <span class="rounded-full bg-sand/60 px-2 py-0.5 text-[11px] font-bold text-ink">
              {{ toFa(wishlistStore.itemCount) }} کالا
            </span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            لیست علاقه‌مندی‌های شما
          </h1>
          <p class="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            محصولات نشان‌شده شما جهت بررسی نهایی، انتخاب سریع سایز و انتقال به سبد خرید.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-rose transition-colors cursor-pointer"
            @click="wishlistStore.clearWishlist()"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>پاک کردن همه</span>
          </button>

          <NuxtLink
            to="/shop"
            class="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-rose transition-colors"
          >
            <span>ادامه خرید از کاتالوگ</span>
            <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
          </NuxtLink>
        </div>
      </div>

      <!-- گرید محصولات برگزیده -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        <div
          v-for="item in wishlistStore.items"
          :key="item.id"
          class="group relative flex flex-col justify-between rounded-2xl border border-sand bg-white p-3.5 shadow-2xs transition-all hover:shadow-xs hover:border-sand/80"
        >
          <!-- بخش بالا: تصویر و بج‌ها -->
          <div>
            <div class="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-sand/30">
              <NuxtLink :to="`/products/${item.slug}`" class="block w-full h-full">
                <NuxtImg
                  :src="item.primary_image || '/placeholder.jpg'"
                  :alt="item.title"
                  loading="lazy"
                  class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </NuxtLink>

              <!-- بج لاین آرامش یا حرکت -->
              <div class="absolute inset-s-2.5 top-2.5">
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md"
                  :class="[
                    item.line === 'calm'
                      ? 'bg-paper/90 text-ink border border-sand'
                      : 'bg-rose text-white',
                  ]"
                >
                  {{ item.line === 'calm' ? 'آرامش' : 'حرکت' }}
                </span>
              </div>

              <!-- دکمه حذف از علاقه‌مندی‌ها -->
              <button
                type="button"
                class="absolute inset-e-2.5 top-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-muted-foreground hover:text-rose hover:bg-white shadow-2xs transition-all active:scale-90 cursor-pointer"
                aria-label="حذف از لیست علاقه‌مندی‌ها"
                @click="wishlistStore.removeItem(item.id)"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- مشخصات و قیمت -->
            <div class="mt-3 space-y-1">
              <NuxtLink
                :to="`/products/${item.slug}`"
                class="text-xs sm:text-sm font-bold text-ink transition-colors hover:text-rose line-clamp-1"
              >
                {{ item.title }}
              </NuxtLink>

              <div class="flex items-center justify-between pt-0.5">
                <PriceTag
                  :price="item.price"
                  :compare-at-price="item.compare_at_price"
                  size="sm"
                />
              </div>
            </div>
          </div>

          <!-- بخش پایین: انتخاب سریع سایز و انتقال به سبد خرید -->
          <div class="mt-4 pt-3 border-t border-sand/60 space-y-2">
            <div class="flex items-center justify-between text-[11px] text-muted-foreground">
              <span class="font-medium flex items-center gap-1">
                <ShoppingBag class="w-3 h-3 text-rose" />
                <span>انتقال مستقیم به سبد:</span>
              </span>
            </div>

            <!-- پیل‌های انتخاب سایز جهت انتقال آنی به سبد -->
            <div class="flex items-center justify-between gap-1">
              <button
                v-for="size in availableSizes"
                :key="size"
                type="button"
                class="flex-1 h-7 rounded-lg border border-sand bg-sand/15 text-[11px] font-bold text-ink hover:border-rose hover:bg-rose hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-2xs"
                :title="`افزودن سایز ${size} به سبد خرید`"
                @click="quickAddToCart(item, size)"
              >
                {{ size }}
              </button>
            </div>

            <NuxtLink
              :to="`/products/${item.slug}`"
              class="block text-center text-[10px] font-bold text-muted-foreground hover:text-ink pt-0.5 transition-colors"
            >
              مشاهده صفحه کامل محصول
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- حالت خالی بودن لیست علاقه‌مندی‌ها -->
    <div
      v-else
      class="max-w-md mx-auto rounded-3xl border border-sand bg-white p-8 sm:p-12 text-center space-y-6 shadow-xs my-8"
    >
      <div class="w-20 h-20 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center text-rose">
        <Heart class="w-10 h-10 stroke-1" />
      </div>

      <div class="space-y-2">
        <h2 class="text-xl font-bold text-ink">
          لیست علاقه‌مندی‌های شما خالی است
        </h2>
        <p class="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          محصولات مورد علاقه خود را با لمس آیکون قلب در کاتالوگ یا صفحه جزئیات محصول ذخیره کنید تا در هر زمان به راحتی به آن‌ها دسترسی داشته باشید.
        </p>
      </div>

      <div class="pt-2">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center justify-center gap-2 bg-rose hover:bg-rose/90 text-white font-bold text-xs h-12 px-8 rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Sparkles class="w-4 h-4" />
          <span>مشاهده کاتالوگ و خرید</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
