<!-- frontend/app/pages/checkout/success.vue -->
<script setup lang="ts">
import {
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from '@lucide/vue'
import { formatToman, formatDate } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import type { OrderReceipt } from '~/types/domain'

useSeoMeta({
  title: 'سفارش ثبت شد | کراس',
  description: 'رسید نهایی و اطلاعات رهگیری سفارش پوشاک ورزشی کراس',
})

const route = useRoute()
const cartStore = useCartStore()
const order = ref<OrderReceipt | null>(null)
const rrn = ref<string | null>(null)

onMounted(() => {
  order.value = cartStore.getLastOrderReceipt()
  const rawRrn = route.query.rrn
  if (rawRrn && typeof rawRrn === 'string') {
    rrn.value = rawRrn
  } else if (import.meta.client) {
    rrn.value = sessionStorage.getItem('keras_last_payment_rrn')
  }

  // اگر آخرین رسید در استور نبود ولی در کوئری ارسال شد
  if (!order.value && route.query.order) {
    const rawOrder = route.query.order
    const orderNum = Array.isArray(rawOrder) ? rawOrder[0] : rawOrder
    if (orderNum) {
      order.value = {
        orderNumber: orderNum,
        createdAt: new Date().toISOString(),
        items: [],
        shippingAddress: {
          fullName: 'خریدار محترم کراس',
          phoneNumber: '۰۹۱۲۳۴۵۶۷۸۹',
          province: 'تهران',
          city: 'تهران',
          postalCode: '۱۹۸۲۳۱۴۰۱۱',
          exactAddress: 'ثبت‌شده در فاکتور سفارش',
        },
        shippingMethod: 'standard',
        paymentMethod: 'online_gateway',
        subtotal: 1450000,
        discount: 0,
        shippingCost: 0,
        paymentStatus: 'completed',
        finalTotal: 1450000,
        estimatedDelivery: '۲ تا ۴ روز کاری آینده',
      }
    }
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-16 max-w-4xl">
    <!-- حالت وجود اطلاعات سفارش -->
    <div v-if="order" class="space-y-8">
      <!-- هدر تایید و شماره سفارش -->
      <div class="text-center space-y-4">
        <div class="w-16 h-16 rounded-full bg-sage/15 text-sage mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 class="w-9 h-9" />
        </div>

        <div class="space-y-1">
          <span class="text-xs font-bold text-sage uppercase tracking-wider">
            پرداخت با موفقیت انجام شد
          </span>
          <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            از خرید شما سپاسگزاریم
          </h1>
          <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            سفارش شما در فرآیند آماده‌سازی و بسته‌بندی در انبار مرکزی کراس قرار گرفت.
          </p>
        </div>

        <!-- نشانگر شماره سفارش، تاریخ و کد رهگیری شاپرک -->
        <div class="inline-flex flex-wrap items-center justify-center gap-3 bg-sand/35 border border-sand px-4 py-2.5 rounded-2xl text-xs text-ink">
          <div class="flex items-center gap-1.5">
            <span class="text-muted-foreground">شماره پیگیری سفارش:</span>
            <span class="font-bold font-mono text-rose text-sm">{{ order.orderNumber }}</span>
          </div>
          <span class="text-sand">|</span>
          <div class="flex items-center gap-1.5">
            <span class="text-muted-foreground">تاریخ ثبت:</span>
            <span class="font-bold">{{ formatDate(order.createdAt) }}</span>
          </div>
          <template v-if="rrn">
            <span class="text-sand">|</span>
            <div class="flex items-center gap-1.5">
              <span class="text-muted-foreground">کد مرجع شاپرک (RRN):</span>
              <span class="font-bold font-mono text-sage text-xs">{{ rrn }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- کارت‌های ۲ گانه جزییات ارسال و مشخصات -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <!-- کارت شیوه ارسال و بازه زمانی -->
        <div class="rounded-2xl border border-sand bg-white p-5 shadow-2xs space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-ink">
            <Calendar class="w-4 h-4 text-rose" />
            <span>زمان‌بندی تحویل مرسوله</span>
          </div>
          <div class="rounded-xl bg-sand/20 p-3 text-xs space-y-1">
            <p class="font-bold text-ink">
              {{ order.estimatedDelivery || '۲ تا ۴ روز کاری آینده' }}
            </p>
            <p class="text-[11px] text-muted-foreground">
              شیوه ارسال: {{ order.shippingMethod === 'express' ? 'پیک اختصاصی تهران' : 'پست پیشتاز سراسری' }}
            </p>
          </div>
        </div>

        <!-- کارت اطلاعات تحویل‌گیرنده و آدرس -->
        <div class="rounded-2xl border border-sand bg-white p-5 shadow-2xs space-y-3">
          <div class="flex items-center gap-2 text-xs font-bold text-ink">
            <MapPin class="w-4 h-4 text-rose" />
            <span>اطلاعات مقصد و تحویل‌گیرنده</span>
          </div>
          <div class="rounded-xl bg-sand/20 p-3 text-xs space-y-1">
            <p class="font-bold text-ink">
              {{ order.shippingAddress.fullName }} ({{ order.shippingAddress.phoneNumber }})
            </p>
            <p class="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
              {{ order.shippingAddress.province }}، {{ order.shippingAddress.city }}، {{ order.shippingAddress.exactAddress }}
            </p>
          </div>
        </div>
      </div>

      <!-- کارت اقلام خریداری شده و فاکتور نهایی -->
      <div class="rounded-2xl border border-sand bg-white p-6 shadow-2xs space-y-5">
        <div class="flex items-center justify-between border-b border-sand/70 pb-3">
          <div class="flex items-center gap-2 text-xs font-bold text-ink">
            <Package class="w-4 h-4 text-rose" />
            <span>اقلام خریداری شده</span>
          </div>
          <span class="text-xs text-muted-foreground">
            {{ order.items.length }} عنوان محصول
          </span>
        </div>

        <!-- لیست محصولات -->
        <div class="divide-y divide-sand/50">
          <div
            v-for="item in order.items"
            :key="item.id"
            class="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <div class="aspect-4/5 w-12 h-15 rounded-lg overflow-hidden bg-sand/30 shrink-0 border border-sand/60">
                <NuxtImg
                  :src="item.image"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 class="text-xs font-bold text-ink">
                  {{ item.title }}
                </h4>
                <p class="text-[11px] text-muted-foreground mt-0.5">
                  سایز: {{ item.size }}
                  <span v-if="item.color"> | {{ item.color }}</span>
                  <span class="ms-2">({{ item.quantity }} عدد)</span>
                </p>
              </div>
            </div>

            <div class="text-xs font-bold text-ink">
              {{ formatToman(item.price * item.quantity) }}
            </div>
          </div>
        </div>

        <!-- خلاصه مالی فاکتور -->
        <div class="border-t border-sand/70 pt-4 space-y-2.5 text-xs">
          <div class="flex items-center justify-between text-muted-foreground">
            <span>مجموع اقلام</span>
            <span>{{ formatToman(order.subtotal) }}</span>
          </div>

          <div
            v-if="order.discount > 0"
            class="flex items-center justify-between text-rose font-medium"
          >
            <span>سود شما از تخفیف‌ها</span>
            <span>{{ formatToman(order.discount) }}-</span>
          </div>

          <div class="flex items-center justify-between text-muted-foreground">
            <span>هزینه ارسال</span>
            <span v-if="order.shippingCost === 0" class="font-bold text-sage">
              رایگان
            </span>
            <span v-else>
              {{ formatToman(order.shippingCost) }}
            </span>
          </div>

          <div class="flex items-center justify-between text-muted-foreground">
            <span>شیوه پرداخت</span>
            <span class="flex items-center gap-1 font-bold text-ink">
              <CreditCard class="w-3.5 h-3.5 text-sage" />
              {{ order.paymentMethod === 'online_gateway' ? 'پرداخت اینترنتی شاپرک' : 'کارت به کارت' }}
            </span>
          </div>

          <div class="border-t border-sand pt-3 flex items-center justify-between text-sm font-bold text-ink">
            <span>مبلغ نهایی پرداخت شده</span>
            <PriceTag :price="order.finalTotal" size="md" />
          </div>
        </div>
      </div>

      <!-- دکمه‌های اکشن بازگشت -->
      <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/shop"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose text-white hover:bg-rose/90 font-bold text-xs h-11 px-8 rounded-xl shadow-xs transition-all"
        >
          <Sparkles class="w-4 h-4" />
          <span>بازگشت به فروشگاه و ادامه خرید</span>
        </NuxtLink>

        <NuxtLink
          :to="`/tracking?order=${order.orderNumber}`"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-sand bg-white hover:bg-sand/30 text-ink font-bold text-xs h-11 px-6 rounded-xl transition-all"
        >
          <span>پیگیری سفارش با کد رهگیری</span>
        </NuxtLink>
      </div>
    </div>

    <!-- حالت عدم وجود سفارش فعال (ورود مستقیم به آدرس) -->
    <div
      v-else
      class="max-w-md mx-auto rounded-3xl border border-sand bg-white p-8 sm:p-10 text-center space-y-5 shadow-xs"
    >
      <div class="w-16 h-16 rounded-2xl bg-sand/40 mx-auto flex items-center justify-center text-rose">
        <ShoppingBag class="w-8 h-8" />
      </div>

      <div class="space-y-1">
        <h2 class="text-lg font-bold text-ink">
          سفارشی برای نمایش یافت نشد
        </h2>
        <p class="text-xs text-muted-foreground leading-relaxed">
          اطلاعات آخرین سفارش شما در دسترس نیست. می‌توانید برای مشاهده محصولات به فروشگاه مراجعه فرمایید.
        </p>
      </div>

      <NuxtLink
        to="/shop"
        class="inline-flex items-center justify-center gap-2 bg-rose text-white hover:bg-rose/90 font-bold text-xs h-10 px-6 rounded-xl shadow-xs transition-all"
      >
        <span>مشاهده محصولات کراس</span>
        <ArrowRight class="w-4 h-4 rtl:-scale-x-100" />
      </NuxtLink>
    </div>
  </div>
</template>
