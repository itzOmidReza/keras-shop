<!-- frontend/app/components/home/CatalogDiscoveryTabs.vue -->
<script setup lang="ts">
import { ArrowLeft, Sparkles } from '@lucide/vue'
import ProductCard from '~/components/product/ProductCard.vue'
import type { ProductListItem } from '~/types/domain'

interface Props {
  initialProducts?: ProductListItem[]
}

const props = withDefaults(defineProps<Props>(), {
  initialProducts: () => [],
})

const activeTab = ref<'bestseller' | 'move' | 'calm'>('bestseller')
const isLoading = ref(false)
const localProducts = ref<ProductListItem[]>(props.initialProducts)

const tabs = [
  { id: 'bestseller', label: 'پرفروش‌ترین‌های هفته', description: 'محبوب‌ترین انتخاب‌های بانوان ورزشکار کراس' },
  { id: 'move', label: 'کالکشن حرکت (Move)', description: 'پرفورمنس و فشرده‌سازی ۳۰۰ گرمی ضد دید' },
  { id: 'calm', label: 'کالکشن آرامش (Calm)', description: 'بافت سبک ۲۲۰ گرمی با حس پوست دوم' },
] as const

const filteredProducts = computed(() => {
  if (activeTab.value === 'move') {
    return localProducts.value.filter(p => p.line === 'move')
  }
  if (activeTab.value === 'calm') {
    return localProducts.value.filter(p => p.line === 'calm')
  }
  return localProducts.value
})

// سوییچ تب با دریافت داده در صورت نیاز
const selectTab = async (tabId: 'bestseller' | 'move' | 'calm') => {
  activeTab.value = tabId
  if (localProducts.value.length === 0) {
    isLoading.value = true
    try {
      const data = await $fetch<ProductListItem[]>('/api/products')
      localProducts.value = data || []
    } catch {
      // استفاده از داده‌های پیش‌فرض
    } finally {
      isLoading.value = false
    }
  }
}

watch(
  () => props.initialProducts,
  (newItems) => {
    if (newItems && newItems.length > 0) {
      localProducts.value = newItems
    }
  },
  { immediate: true },
)
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
    <div class="space-y-8">
      <!-- هدر بخش به همراه تب‌های ناوبری سریع -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/70 pb-6">
        <div class="space-y-1 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>کاتالوگ هوشمند کالاها</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            کشف سریع کالکشن‌های کراس
          </h2>
        </div>

        <!-- کنترلرهای تب فیلتر بدون رفرش صفحه -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="[
              activeTab === tab.id
                ? 'bg-ink text-paper shadow-xs'
                : 'border border-sand bg-sand/20 hover:bg-sand/40 text-ink',
            ]"
            @click="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- شبکه محصولات با ProductCard استاندارد -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <ProductCard
          v-for="(product, idx) in filteredProducts"
          :key="product.id"
          :product="product"
          :priority="idx < 2"
        />
      </div>

      <!-- وضعیت خالی یا در حال بارگذاری -->
      <div
        v-else-if="isLoading"
        class="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-pulse"
      >
        <div v-for="i in 4" :key="i" class="aspect-4/5 rounded-2xl bg-sand/30" />
      </div>

      <!-- دکمه CTA انتهای بخش جهت ناوبری به کاتالوگ جامع -->
      <div class="pt-4 text-center">
        <NuxtLink
          to="/shop"
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white hover:bg-sand/30 px-8 py-3.5 text-xs sm:text-sm font-bold text-ink shadow-2xs hover:shadow-xs transition-all"
        >
          <span>مشاهده تمامی محصولات در کاتالوگ فروشگاه</span>
          <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
