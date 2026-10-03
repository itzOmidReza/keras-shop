<script setup lang="ts">
import { formatToman } from '~/utils/format'
import type { LookItem } from '~/composables/home/useShopTheLook'

defineProps<{
  item: LookItem
  isActive: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <div
    class="absolute -translate-x-1/2 -translate-y-1/2 z-30"
    :style="{ top: `${item.hotspot.top}%`, right: `${item.hotspot.right}%` }"
  >
    <!-- دکمه هات‌اسپات با افکت پینگ -->
    <button
      type="button"
      class="relative group/hotspot flex items-center justify-center w-8 h-8 rounded-full bg-white/95 text-rose shadow-md border-2 border-white cursor-pointer active:scale-90 transition-transform focus:outline-none focus:ring-2 focus:ring-rose/40"
      :aria-label="`مشاهده آیتم ${item.title}`"
      @click.stop="emit('toggle')"
    >
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose/60 opacity-75 pointer-events-none" />
      <span class="w-2.5 h-2.5 rounded-full bg-rose relative z-10 pointer-events-none" />
    </button>

    <!-- پاپ‌اور گلس‌مورفیسم اطلاعات محصول -->
    <div
      v-if="isActive"
      class="absolute z-50 w-56 sm:w-64 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-sand shadow-2xl text-start pointer-events-auto space-y-2.5 animate-in fade-in zoom-in-95 duration-200"
      :class="item.hotspot.top <= 35 ? 'top-full mt-2.5' : 'bottom-full mb-2.5'"
      style="left: 50%; transform: translateX(-50%);"
      @click.stop
    >
      <div class="flex items-center gap-2.5">
        <img
          :src="item.image"
          :alt="item.title"
          class="w-12 h-14 rounded-xl object-cover bg-sand/30 shrink-0 border border-sand/50"
        >
        <div class="space-y-0.5 overflow-hidden">
          <h4 class="text-xs font-bold text-ink truncate">
            {{ item.title }}
          </h4>
          <p class="text-xs font-bold text-rose">
            {{ formatToman(item.price) }}
          </p>
        </div>
      </div>

      <NuxtLink
        :to="`/products/${item.slug}`"
        class="block text-center py-1.5 rounded-xl bg-ink text-paper hover:bg-rose text-[11px] font-bold transition-colors shadow-2xs"
      >
        <span>مشاهده و خرید محصول</span>
      </NuxtLink>
    </div>
  </div>
</template>
