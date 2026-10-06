<!-- frontend/app/components/home/ShopTheLookSlider.vue -->
<script setup lang="ts">
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Eye,
} from '@lucide/vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper/types'

const {
  looks,
  selectedSizes,
  activeHotspotId,
  toggleHotspot,
  getRegularTotal,
  getBundleTotal,
  addEntireOutfitToCart,
} = useShopTheLook()

const swiperInstance = ref<SwiperType | null>(null)
const activeIndex = ref(0)

const toggleHotspotWithAutoplay = (itemId: number) => {
  swiperInstance.value?.autoplay?.stop()
  toggleHotspot(itemId)
}

const onSwiper = (swiper: SwiperType) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper: SwiperType) => {
  activeIndex.value = swiper.realIndex ?? swiper.activeIndex
  activeHotspotId.value = null
}

const scrollToSlide = (index: number) => {
  swiperInstance.value?.slideToLoop(index)
}

const nextSlide = () => {
  swiperInstance.value?.slidePrev()
}

const prevSlide = () => {
  swiperInstance.value?.slideNext()
}
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
    <div class="space-y-6 sm:space-y-8">
      <!-- هدر بخش خرید ست با استایل ادیتوریال -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand/70 pb-5">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>پیشنهاد استایلیست‌های کراس</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            خرید ست کامل (Shop The Look)
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            استایل‌های هماهنگ پاییز با ۱۰٪ تخفیف ویژه پکیج بر روی مجموع آیتم‌ها
          </p>
        </div>

        <!-- دکمه‌های ناوبری اسلایدر و شاخص شماره اسلاید (در RTL: قبلی راست، بعدی چپ) -->
        <div class="flex items-center gap-3 self-end sm:self-auto">
          <!-- ایندیکیتورهای دایره‌ای اسلایدها -->
          <div class="flex items-center gap-1.5">
            <button
              v-for="(_, idx) in looks"
              :key="idx"
              type="button"
              class="h-2 rounded-full transition-all cursor-pointer"
              :class="activeIndex === idx ? 'w-6 bg-rose' : 'w-2 bg-sand hover:bg-sand/80'"
              :aria-label="`اسلاید شماره ${idx + 1}`"
              @click="scrollToSlide(idx)"
            />
          </div>

          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-rose hover:text-white hover:border-rose transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="ست قبلی"
              @click="prevSlide"
            >
              <ChevronRight class="w-4 h-4" />
            </button>
            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand bg-white text-ink hover:bg-rose hover:text-white hover:border-rose transition-colors flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
              aria-label="ست بعدی"
              @click="nextSlide"
            >
              <ChevronLeft class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- اسلایدر Swiper لوک‌های ادیتوریال همراه با اتوپلی نرم و سوایپ لمسی -->
      <Swiper
        :modules="[Autoplay, Pagination]"
        :slides-per-view="1"
        :loop="true"
        :speed="600"
        dir="rtl"
        :autoplay="{
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }"
        class="w-full rounded-3xl"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="look in looks"
          :key="look.id"
          class="!h-auto"
        >
          <div class="w-full rounded-3xl border border-sand/80 bg-white p-5 sm:p-8 shadow-xs">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              <!-- ستون سمت راست بصری: تصویر مدل با هات‌اسپات‌های تعاملی پالس‌دار -->
              <div
                class="lg:col-span-7 relative rounded-2xl bg-sand/30 aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/3] max-h-[520px]"
                @click="activeHotspotId = null"
              >
                <!-- کانتینر اختصاصی تصویر همراه با لبه‌های گرد -->
                <div class="absolute inset-0 rounded-2xl overflow-hidden">
                  <NuxtImg
                    :src="look.image"
                    :alt="look.title"
                    class="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  <!-- گرادیان ملایم برای جلوه ادیتوریال -->
                  <div class="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent pointer-events-none" />
                </div>

                <!-- هات‌اسپات‌های تعاملی روی تصویر -->
                <HomeLookHotspot
                  v-for="item in look.items"
                  :key="item.id"
                  :item="item"
                  :is-active="activeHotspotId === item.id"
                  @toggle="toggleHotspotWithAutoplay(item.id)"
                />

                <!-- بج راهنمای کلیک روی هات‌اسپات‌ها -->
                <div class="absolute bottom-3 inset-s-3 z-20 rounded-xl bg-white/85 backdrop-blur-md px-3 py-1.5 border border-sand/60 text-[10px] font-bold text-ink shadow-2xs flex items-center gap-1.5 pointer-events-none">
                  <Eye class="w-3.5 h-3.5 text-rose" />
                  <span>برای جزئیات، روی نقاط بزنید</span>
                </div>
              </div>

              <!-- ستون سمت چپ: تفکیک آیتم‌های ست، انتخاب سایز و دکمه خرید باندل -->
              <div class="lg:col-span-5">
                <HomeLookBundleCard
                  :look="look"
                  :selected-sizes="selectedSizes"
                  :regular-total="getRegularTotal(look)"
                  :bundle-total="getBundleTotal(look)"
                  @update-size="(itemId, sz) => (selectedSizes[itemId] = sz)"
                  @add-to-cart="addEntireOutfitToCart"
                />
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  </section>
</template>
