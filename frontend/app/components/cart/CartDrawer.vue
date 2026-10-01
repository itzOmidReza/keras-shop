<!-- frontend/app/components/cart/CartDrawer.vue -->
<script setup lang="ts">
import {
  ShoppingBag,
  Truck,
  ArrowLeft,
  Sparkles,
} from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { toast } from 'vue-sonner'

const cartStore = useCartStore()
const router = useRouter()

const goToShop = () => {
  cartStore.closeCart()
  router.push('/shop')
}

const handleCheckout = () => {
  cartStore.closeCart()
  toast.success('در حال انتقال به فرایند پرداخت و تسویه حساب...')
  router.push('/cart')
}
</script>

<template>
  <Sheet :open="cartStore.isOpen" @update:open="(val: boolean) => val ? cartStore.openCart() : cartStore.closeCart()">
    <SheetContent
      side="start"
      class="w-full sm:max-w-md p-0 flex flex-col bg-paper border-sand h-full shadow-2xl"
    >
      <!-- ۱. هدر مینی‌کارت -->
      <SheetHeader class="p-4 sm:p-5 border-b border-sand text-start">
        <div class="flex items-center justify-between pe-8">
          <div class="flex items-center gap-2">
            <ShoppingBag class="w-5 h-5 text-rose" />
            <SheetTitle class="text-base font-bold text-ink">
              سبد خرید
            </SheetTitle>
            <span
              v-if="cartStore.itemCount > 0"
              class="rounded-full bg-rose/10 px-2 py-0.5 text-xs font-bold text-rose"
            >
              {{ cartStore.itemCount }} کالا
            </span>
          </div>

          <button
            v-if="cartStore.items.length > 0"
            type="button"
            class="text-[11px] text-muted-foreground hover:text-rose transition-colors cursor-pointer"
            @click="cartStore.clearCart()"
          >
            خالی کردن سبد
          </button>
        </div>
        <SheetDescription class="sr-only">
          لیست کالاهای افزوده شده به سبد خرید و محاسبه هزینه نهایی
        </SheetDescription>
      </SheetHeader>

      <!-- ۲. سنجه ارسال رایگان -->
      <div class="bg-sand/35 p-3.5 border-b border-sand/70 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <div
            class="flex items-center gap-1.5 font-bold"
            :class="cartStore.isFreeShipping ? 'text-sage' : 'text-ink'"
          >
            <Truck
              class="w-4 h-4"
              :class="cartStore.isFreeShipping ? 'text-sage' : 'text-rose'"
            />
            <span v-if="cartStore.isFreeShipping">
              تبریک! سفارش شما مشمول ارسال رایگان شد 🎉
            </span>
            <span v-else>
              {{ formatToman(cartStore.amountNeededForFreeShipping) }} تا ارسال رایگان کشوری
            </span>
          </div>
          <span class="text-[11px] font-bold text-muted-foreground">
            {{ cartStore.freeShippingProgress }}٪
          </span>
        </div>

        <div class="h-2 w-full rounded-full bg-sand overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="cartStore.isFreeShipping ? 'bg-sage' : 'bg-rose'"
            :style="{ width: `${cartStore.freeShippingProgress}%` }"
          />
        </div>
      </div>

      <!-- ۳. فهرست اقلام سبد خرید -->
      <div
        v-if="cartStore.items.length > 0"
        class="flex-1 overflow-y-auto px-4 sm:px-5 divide-y divide-sand/50"
      >
        <CartItemRow
          v-for="item in cartStore.items"
          :key="item.id"
          :item="item"
        />
      </div>

      <!-- ۴. حالت خالی بودن سبد -->
      <div
        v-else
        class="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4"
      >
        <div class="w-16 h-16 rounded-2xl bg-sand/40 flex items-center justify-center text-muted-foreground">
          <ShoppingBag class="w-8 h-8 text-rose/70" />
        </div>
        <div class="space-y-1">
          <h3 class="text-sm font-bold text-ink">
            سبد خرید شما در حال حاضر خالی است
          </h3>
          <p class="text-xs text-muted-foreground max-w-xs leading-relaxed">
            محصولات ورزشی و پوشاک تمرین کراس را متناسب با سایز خود انتخاب کنید.
          </p>
        </div>
        <Button
          class="bg-rose text-white hover:bg-rose/90 rounded-xl font-bold text-xs h-10 px-5 cursor-pointer"
          @click="goToShop"
        >
          مشاهده کاتالوگ فروشگاه
        </Button>
      </div>

      <!-- ۵. فوتر مبالغ و دکمه پرداخت -->
      <div
        v-if="cartStore.items.length > 0"
        class="p-4 sm:p-5 border-t border-sand bg-white/70 space-y-3.5"
      >
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between text-muted-foreground">
            <span>مجموع اقلام</span>
            <span>{{ formatToman(cartStore.subtotal) }}</span>
          </div>

          <div
            v-if="cartStore.discountTotal > 0"
            class="flex items-center justify-between text-rose font-medium"
          >
            <span>سود شما از تخفیف‌ها</span>
            <span>{{ formatToman(cartStore.discountTotal) }}-</span>
          </div>

          <div class="flex items-center justify-between text-muted-foreground">
            <span>هزینه ارسال کشوری</span>
            <span v-if="cartStore.isFreeShipping" class="font-bold text-sage">
              رایگان
            </span>
            <span v-else>
              {{ formatToman(cartStore.shippingEstimate) }}
            </span>
          </div>

          <div class="border-t border-sand/70 pt-2 flex items-center justify-between text-sm font-bold text-ink">
            <span>مبلغ قابل پرداخت</span>
            <PriceTag :price="cartStore.finalTotal" size="md" />
          </div>
        </div>

        <Button
          class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-sm shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
          @click="handleCheckout"
        >
          <span>نهایی‌سازی و ثبت سفارش</span>
          <ArrowLeft class="w-4 h-4 me-1 rtl:-scale-x-100" />
        </Button>

        <div class="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <Sparkles class="w-3 h-3 text-rose" />
          <span>ضمانت اصالت و تعویض ۷ روزه پوشاک کراس</span>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>
