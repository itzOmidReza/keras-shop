<!-- frontend/app/components/cart/CartItemRow.vue -->
<script setup lang="ts">
import type { CartItem } from '~/types/domain'
import { Plus, Minus, Trash2 } from '@lucide/vue'
import { useCartStore } from '~/stores/cart'

const props = defineProps<{
  item: CartItem
}>()

const cartStore = useCartStore()

const handleIncrement = () => {
  cartStore.updateQuantity(props.item.id, 1)
}

const handleDecrement = () => {
  cartStore.updateQuantity(props.item.id, -1)
}

const handleRemove = () => {
  cartStore.removeItem(props.item.id)
}
</script>

<template>
  <div class="flex items-center gap-3 py-3.5 border-b border-sand/70 last:border-b-0">
    <!-- تصویر شاخص محصول -->
    <NuxtLink
      :to="`/products/${item.slug}`"
      class="relative aspect-4/5 w-16 h-20 rounded-xl overflow-hidden bg-sand/30 shrink-0 border border-sand/50"
      @click="cartStore.closeCart()"
    >
      <NuxtImg
        :src="item.image"
        :alt="item.title"
        class="w-full h-full object-cover object-center"
        loading="lazy"
      />
    </NuxtLink>

    <!-- جزئیات محصول و قیمت -->
    <div class="flex-1 min-w-0 flex flex-col justify-between h-20 py-0.5">
      <div>
        <div class="flex items-start justify-between gap-2">
          <NuxtLink
            :to="`/products/${item.slug}`"
            class="text-xs font-bold text-ink hover:text-rose transition-colors line-clamp-1"
            @click="cartStore.closeCart()"
          >
            {{ item.title }}
          </NuxtLink>

          <!-- دکمه حذف -->
          <button
            type="button"
            class="text-muted-foreground hover:text-rose transition-colors p-1 -me-1 cursor-pointer"
            aria-label="حذف از سبد خرید"
            @click="handleRemove"
          >
            <Trash2 class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- تگ سایز و رنگ -->
        <div class="flex items-center gap-1.5 mt-1 text-[11px] text-muted-foreground">
          <span class="rounded-md bg-sand/50 px-1.5 py-0.5 font-bold text-ink">
            سایز {{ item.size }}
          </span>
          <span v-if="item.color" class="text-[10px]">
            {{ item.color }}
          </span>
        </div>
      </div>

      <!-- نوار قیمت و کنترل تعداد -->
      <div class="flex items-center justify-between pt-1">
        <PriceTag
          :price="item.price * item.quantity"
          :compare-at-price="item.compareAtPrice ? item.compareAtPrice * item.quantity : undefined"
          size="sm"
        />

        <!-- کنترلر افزایش/کاهش تعداد -->
        <div class="flex items-center border border-sand rounded-lg bg-white overflow-hidden shadow-2xs">
          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center text-ink hover:bg-sand/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            :disabled="item.quantity <= 1"
            aria-label="کاهش تعداد"
            @click="handleDecrement"
          >
            <Minus class="w-3 h-3" />
          </button>

          <span class="w-7 text-center text-xs font-bold text-ink select-none">
            {{ item.quantity }}
          </span>

          <button
            type="button"
            class="w-7 h-7 flex items-center justify-center text-ink hover:bg-sand/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            :disabled="item.quantity >= item.maxStock"
            aria-label="افزایش تعداد"
            @click="handleIncrement"
          >
            <Plus class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
