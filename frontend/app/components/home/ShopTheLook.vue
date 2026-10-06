<!-- frontend/app/components/home/ShopTheLook.vue -->
<script setup lang="ts">
import { Sparkles, Eye } from '@lucide/vue'

const {
  looks,
  selectedSizes,
  activeHotspotId,
  toggleHotspot,
  getRegularTotal,
  getBundleTotal,
  addEntireOutfitToCart,
} = useShopTheLook()

const activeLookId = ref(looks[0]?.id || 'look-autumn')
const activeLook = computed(() => {
  return looks.find(l => l.id === activeLookId.value) || looks[0]!
})
</script>

<template>
  <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
    <div class="rounded-3xl border border-sand bg-white p-6 sm:p-10 shadow-xs space-y-8">
      <!-- هدر و انتخابگر چندگانه استایل‌ها (Multi-Look Switcher) -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-sand/70 pb-6">
        <div class="space-y-1.5 text-start">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5 text-rose" />
            <span>خرید هوشمند پکیج ست (Bundle)</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            استایل تن مدل را بخرید (Shop The Look)
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
            ست‌های هماهنگ با آزمون تن‌خور و هارمونی رنگی اختصاصی؛ خرید همزمان اقلام ست شامل ۱۰٪ تخفیف مستقیم می‌شود.
          </p>
        </div>

        <!-- تب‌های انتخاب استایل -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            v-for="look in looks"
            :key="look.id"
            type="button"
            class="shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
            :class="[
              activeLookId === look.id
                ? 'bg-ink text-paper shadow-xs'
                : 'border border-sand bg-sand/20 hover:bg-sand/40 text-ink',
            ]"
            @click="activeLookId = look.id; activeHotspotId = null"
          >
            {{ look.title }}
          </button>
        </div>
      </div>

      <!-- محتوای اصلی ۲ ستونه: تصویر تعاملی هات‌اسپات + سایدبار خلاصه ست -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <!-- ستون سمت راست: تصویر عمودی مدل با هات‌اسپات‌های متحرک (۷ ستون) -->
        <div
          class="lg:col-span-7 relative aspect-3/4 sm:aspect-4/5 rounded-3xl overflow-hidden bg-sand/30 border border-sand shadow-xs"
          @click="activeHotspotId = null"
        >
          <NuxtImg
            :src="activeLook.image"
            :alt="activeLook.title"
            class="w-full h-full object-cover object-top transition-all duration-700"
            loading="lazy"
          />

          <!-- لایه گرادیان بسیار ملایم در پایین -->
          <div class="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent pointer-events-none" />

          <!-- هات‌اسپات‌های تپنده روی لباس مدل -->
          <HomeLookHotspot
            v-for="item in activeLook.items"
            :key="item.id"
            :item="item"
            :is-active="activeHotspotId === item.id"
            @toggle="toggleHotspot(item.id)"
          />

          <!-- زیرنویس تصویر -->
          <div class="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-2xl bg-white/90 backdrop-blur-md px-4 py-2.5 border border-sand/70 text-xs">
            <div class="flex items-center gap-2 text-ink font-bold">
              <Eye class="w-4 h-4 text-rose" />
              <span>روی نشانگرهای لباس بزنید</span>
            </div>
            <span class="text-muted-foreground text-[11px]">
              {{ activeLook.items.length }} قلم در این ست
            </span>
          </div>
        </div>

        <!-- ستون سمت چپ: کارت خلاصه اقلام ست، انتخاب سایزها و دکمه افزودن کل ست (۵ ستون) -->
        <div class="lg:col-span-5">
          <HomeLookBundleCard
            :look="activeLook"
            :selected-sizes="selectedSizes"
            :regular-total="getRegularTotal(activeLook)"
            :bundle-total="getBundleTotal(activeLook)"
            @update-size="(itemId, sz) => (selectedSizes[itemId] = sz)"
            @add-to-cart="addEntireOutfitToCart"
          />
        </div>
      </div>
    </div>
  </section>
</template>
