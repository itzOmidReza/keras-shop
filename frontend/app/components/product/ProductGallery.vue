<!-- frontend/app/components/product/ProductGallery.vue -->
<script setup lang="ts">
import type { ProductImage } from '~/types/domain'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '~/components/ui/carousel'
import { Eye, ZoomIn } from '@lucide/vue'

defineProps<{
  images: ProductImage[]
  title: string
}>()

const activeIndex = ref(0)
const carouselApi = ref<CarouselApi>()

// همگام‌سازی Carousel موبایل هنگام سوایپ
const onSelect = () => {
  if (!carouselApi.value) return
  activeIndex.value = carouselApi.value.selectedScrollSnap()
}

watch(carouselApi, (api) => {
  if (!api) return
  api.on('select', onSelect)
})

const selectImage = (index: number) => {
  activeIndex.value = index
  carouselApi.value?.scrollTo(index)
}

// وضعیت زوم در دسکتاپ
const isZoomed = ref(false)
const zoomOrigin = ref('50% 50%')

const handleMouseMove = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  zoomOrigin.value = `${x}% ${y}%`
}
</script>

<template>
  <div class="space-y-4">
    <!-- حالت موبایل: اسلایدر لمسی Carousel با نسبت 4:5 -->
    <div class="block md:hidden">
      <Carousel :opts="{ direction: 'rtl' }" class="w-full" @init-api="(val) => (carouselApi = val)">
        <CarouselContent class="-ms-0">
          <CarouselItem v-for="(img, idx) in images" :key="img.id || idx" class="ps-0">
            <div class="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-sand/30">
              <NuxtImg
:src="img.url" :alt="img.alt || title" format="webp" loading="lazy"
                class="h-full w-full object-cover" />

              <!-- برچسب عکس تست شفافیت -->
              <div
v-if="img.kind === 'transparency_test'"
                class="absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-paper backdrop-blur-sm">
                <Eye class="h-3.5 w-3.5 text-coral" />
                <span>تست کشش و شفافیت</span>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!-- نشانگر نقاط صفحه اسلایدر موبایل (Dots) -->
      <div v-if="images.length > 1" class="mt-3 flex justify-center gap-1.5">
        <button
v-for="(_, idx) in images" :key="idx" type="button" :aria-label="`مشاهده تصویر ${idx + 1}`"
          class="h-1.5 rounded-full transition-all"
          :class="activeIndex === idx ? 'w-6 bg-ink' : 'w-1.5 bg-sand hover:bg-muted'" @click="selectImage(idx)" />
      </div>
    </div>

    <!-- حالت دسکتاپ: تصویر شاخص با زوم هاور + گرید تامب‌نیل‌ها -->
    <div class="hidden md:flex flex-col gap-4">
      <!-- تصویر بزرگ اصلی -->
      <div
        class="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-sand/20 cursor-crosshair border border-sand/50"
        @mouseenter="isZoomed = true" @mouseleave="isZoomed = false" @mousemove="handleMouseMove">
        <NuxtImg
:src="images[activeIndex]?.url" :alt="images[activeIndex]?.alt || title" format="webp" priority
          class="h-full w-full object-cover transition-transform duration-200 ease-out" :style="{
            transform: isZoomed ? 'scale(1.75)' : 'scale(1)',
            transformOrigin: zoomOrigin,
          }" />

        <!-- برچسب تست شفافیت -->
        <div
v-if="images[activeIndex]?.kind === 'transparency_test'"
          class="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-medium text-paper shadow-md backdrop-blur-sm">
          <Eye class="h-4 w-4 text-coral" />
          <span>تست عدم عبور نور در حداکثر کشش (Squat-Proof)</span>
        </div>

        <div
          class="absolute top-4 end-4 rounded-full bg-paper/80 p-2 text-ink backdrop-blur-sm shadow-sm opacity-60 hover:opacity-100 transition-opacity">
          <ZoomIn class="h-4 w-4" />
        </div>
      </div>

      <!-- تصاویر بندانگشتی (Thumbnails) -->
      <div v-if="images.length > 1" class="grid grid-cols-5 gap-3">
        <button
v-for="(img, idx) in images" :key="img.id || idx" type="button"
          class="relative aspect-[4/5] overflow-hidden rounded-lg border-2 transition-all cursor-pointer bg-sand/20"
          :class="[
            activeIndex === idx
              ? 'border-coral shadow-sm ring-1 ring-coral/40'
              : 'border-transparent opacity-70 hover:opacity-100 hover:border-sand'
          ]" @click="selectImage(idx)">
          <NuxtImg
:src="img.url" :alt="img.alt || `${title} - بندانگشتی ${idx + 1}`" format="webp" loading="lazy"
            class="h-full w-full object-cover" />

          <span
v-if="img.kind === 'transparency_test'"
            class="absolute top-1 start-1 flex h-2 w-2 rounded-full bg-coral" title="تست شفافیت" />
        </button>
      </div>
    </div>
  </div>
</template>
