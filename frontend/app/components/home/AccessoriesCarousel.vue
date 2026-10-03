<!-- frontend/app/components/home/AccessoriesCarousel.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from '@lucide/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { Swiper as SwiperType } from 'swiper/types'
import ProductCard from '~/components/product/ProductCard.vue'
import type { ProductListItem } from '~/types/domain'

interface Props {
  products?: ProductListItem[]
}

const props = withDefaults(defineProps<Props>(), {
  products: () => [],
})

const swiperInstance = ref<SwiperType | null>(null)

// فیلتر اختصاصی آیتم‌های زیرشاخه اکسسوری (شال، اسکارف، دستمال سر و کش مو)
const accessoryProducts = computed(() => {
  if (props.products && props.products.length > 0) {
    return props.products.filter((p) => p.division === 'accessories')
  }
  return []
})

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const scrollNext = () => {
  swiperInstance.value?.slideNext()
}

const scrollPrev = () => {
  swiperInstance.value?.slidePrev()
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="space-y-6 sm:space-y-8">
      <!-- هدر بخش اختصاصی اکسسوری همراه با بج و دکمه‌های ناوبری -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/10 text-sage text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-sage" />
            <span>ریزجزئیات استایل</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            لمس نهایی: اسکارف، دستمال سر و اکسسوری مو
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            کپسول اکسسوری‌های ابریشمی و پشمی پاییزه برای درخشش و تکمیل هماهنگی استایل روزمره
          </p>
        </div>

        <!-- دکمه‌های ناوبری کاروسل و پیوند به آرشیو کامل اکسسوری‌ها -->
        <div class="flex items-center gap-3 self-end sm:self-auto">
          <NuxtLink
            to="/shop?division=accessories"
            class="text-xs font-bold text-sage hover:text-ink transition-colors hidden sm:inline-flex items-center gap-1.5"
          >
            <span>مشاهده همه اکسسوری‌ها</span>
            <ArrowLeft class="w-3.5 h-3.5" />
          </NuxtLink>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-sage hover:text-white hover:border-sage transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="اکسسوری‌های قبلی"
              @click="scrollPrev"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-sage hover:text-white hover:border-sage transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="اکسسوری‌های بعدی"
              @click="scrollNext"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- کاروسل Swiper اختصاصی اکسسوری‌ها با پشتیبانی کامل از لمس و RTL -->
      <Swiper
        :slides-per-view="'auto'"
        :space-between="16"
        dir="rtl"
        :breakpoints="{
          320: { slidesPerView: 1.25, spaceBetween: 12 },
          480: { slidesPerView: 1.8, spaceBetween: 14 },
          640: { slidesPerView: 2.3, spaceBetween: 16 },
          1024: { slidesPerView: 3.5, spaceBetween: 20 },
          1280: { slidesPerView: 4.2, spaceBetween: 24 }
        }"
        class="w-full !pb-3 !pt-1"
        @swiper="onSwiper"
      >
        <SwiperSlide
          v-for="product in accessoryProducts"
          :key="product.id"
          class="!h-auto"
        >
          <ProductCard :product="product" class="h-full" />
        </SwiperSlide>
      </Swiper>

      <!-- دکمه CTA زیر کاروسل در موبایل -->
      <div class="pt-2 text-center sm:hidden">
        <NuxtLink
          to="/shop?division=accessories"
          class="inline-flex items-center justify-center gap-2 rounded-2xl border border-sand bg-white px-6 py-3 text-xs font-bold text-ink shadow-2xs w-full"
        >
          <span>مشاهده تمامی اکسسوری‌ها در کاتالوگ</span>
          <ArrowLeft class="w-4 h-4" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
