<script setup lang="ts">
import { ShoppingBag, ArrowLeft } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import type { OutfitLook } from '~/composables/home/useShopTheLook'

defineProps<{
  look: OutfitLook
  selectedSizes: Record<number, string>
  regularTotal: number
  bundleTotal: number
}>()

const emit = defineEmits<{
  (e: 'updateSize', itemId: number, size: string): void
  (e: 'addToCart', look: OutfitLook): void
}>()
</script>

<template>
  <div class="space-y-5 text-start">
    <div>
      <span class="text-xs font-bold text-rose uppercase tracking-wider">
        {{ look.subtitle }}
      </span>
      <h3 class="text-xl sm:text-2xl font-bold text-ink mt-0.5">
        {{ look.title }}
      </h3>
      <p class="text-xs text-muted-foreground mt-1.5 leading-relaxed">
        {{ look.description }}
      </p>
    </div>

    <!-- لیست ۳ آیتم تشکیل‌دهنده ست به همراه سلکتور سایز اختصاصی -->
    <div class="space-y-2.5 divide-y divide-sand/60 border-y border-sand/60 py-2.5">
      <div
        v-for="item in look.items"
        :key="item.id"
        class="pt-2.5 first:pt-0 flex items-center justify-between gap-3"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <img
            :src="item.image"
            :alt="item.title"
            class="w-11 h-13 rounded-xl object-cover bg-sand/30 shrink-0 border border-sand/50"
          >
          <div class="space-y-0.5 min-w-0">
            <NuxtLink
              :to="`/products/${item.slug}`"
              class="text-xs font-bold text-ink hover:text-rose transition-colors truncate block"
            >
              {{ item.title }}
            </NuxtLink>
            <span class="text-xs font-bold text-rose block">
              {{ formatToman(item.price) }}
            </span>
          </div>
        </div>

        <!-- انتخابگر سایز این محصول از ست -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            v-for="sz in item.sizes"
            :key="sz"
            type="button"
            class="px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer"
            :class="[
              selectedSizes[item.id] === sz
                ? 'bg-rose text-white border-rose shadow-2xs'
                : 'border-sand bg-sand/20 hover:bg-sand/50 text-ink',
            ]"
            @click="emit('updateSize', item.id, sz)"
          >
            {{ sz }}
          </button>
        </div>
      </div>
    </div>

    <!-- محاسبه قیمت پکیج و دکمه خرید ۱-کلیک کل ست -->
    <div class="rounded-2xl bg-sand/30 border border-sand/70 p-4 space-y-3">
      <div class="flex items-center justify-between text-xs">
        <span class="text-muted-foreground">مجموع قیمت تکی آیتم‌ها:</span>
        <span class="line-through text-muted-foreground font-mono">
          {{ formatToman(regularTotal) }}
        </span>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-ink block">قیمت ویژه پکیج ست (۱۰٪ کسر):</span>
          <span class="text-xs text-sage font-medium">سود شما از خرید ست: {{ formatToman(regularTotal - bundleTotal) }}</span>
        </div>
        <span class="text-base sm:text-lg font-black text-rose font-mono">
          {{ formatToman(bundleTotal) }}
        </span>
      </div>

      <button
        type="button"
        class="w-full py-3 px-4 rounded-xl bg-rose hover:bg-rose/90 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all active:scale-98 cursor-pointer"
        @click="emit('addToCart', look)"
      >
        <ShoppingBag class="w-4 h-4" />
        <span>افزودن کل ست به سبد خرید با ۱۰٪ تخفیف</span>
        <ArrowLeft class="w-4 h-4 ms-auto" />
      </button>
    </div>
  </div>
</template>
