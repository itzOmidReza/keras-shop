<!-- frontend/app/pages/checkout.vue -->
<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  Truck,
  Zap,
  CreditCard,
  Building,
  Lock,
} from '@lucide/vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { shippingAddressSchema, IRAN_PROVINCES } from '~/utils/validation'
import { toEn, formatToman } from '~/utils/format'
import { useCartStore } from '~/stores/cart'
import type { ShippingMethod, PaymentMethod, OrderReceipt } from '~/types/domain'
import { toast } from 'vue-sonner'

useSeoMeta({
  title: 'تسویه حساب و ثبت سفارش | کراس',
  description: 'تکمیل اطلاعات آدرس، انتخاب شیوه ارسال و پرداخت سفارش در کراس',
})

const cartStore = useCartStore()
const router = useRouter()

const currentStep = ref<1 | 2>(1)
const isSubmittingOrder = ref(false)

// بررسی وضعیت سبد خرید و هدایت در صورت خالی بودن
onMounted(() => {
  if (cartStore.isHydrated && cartStore.items.length === 0) {
    toast.info('سبد خرید شما خالی است.')
    router.replace('/cart')
  }
})

watch(
  () => cartStore.items.length,
  (len) => {
    if (cartStore.isHydrated && len === 0 && !isSubmittingOrder.value) {
      router.replace('/cart')
    }
  },
)

// فرم اعتبارسنجی مشخصات با Vee-Validate و Zod
const { defineField, errors, handleSubmit, values, validate } = useForm({
  validationSchema: toTypedSchema(shippingAddressSchema),
  initialValues: {
    fullName: '',
    phoneNumber: '',
    province: 'تهران',
    city: 'تهران',
    postalCode: '',
    exactAddress: '',
    buildingNumber: '',
    unit: '',
    notes: '',
  },
})

const [fullName, fullNameProps] = defineField('fullName')
const [phoneNumber, phoneNumberProps] = defineField('phoneNumber')
const [province, provinceProps] = defineField('province')
const [city, cityProps] = defineField('city')
const [postalCode, postalCodeProps] = defineField('postalCode')
const [exactAddress, exactAddressProps] = defineField('exactAddress')
const [buildingNumber, buildingNumberProps] = defineField('buildingNumber')
const [unit, unitProps] = defineField('unit')
const [notes, notesProps] = defineField('notes')

// شیوه‌های ارسال و پرداخت
const selectedShipping = ref<ShippingMethod>('standard')
const selectedPayment = ref<PaymentMethod>('online_gateway')

const handleShippingChange = (method: ShippingMethod) => {
  selectedShipping.value = method
  cartStore.setShippingMethod(method)
}

const goToStep2 = handleSubmit(() => {
  currentStep.value = 2
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

const goToStep1 = () => {
  currentStep.value = 1
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ارسال نهایی سفارش
const handleFinalSubmit = async () => {
  const result = await validate()
  if (!result.valid) {
    currentStep.value = 1
    toast.error('لطفاً خطاهای آدرس و مشخصات تحویل‌گیرنده را برطرف کنید.')
    return
  }

  isSubmittingOrder.value = true
  try {
    const receipt = await $fetch<OrderReceipt>('/api/orders/create', {
      method: 'POST',
      body: {
        items: cartStore.items,
        shippingAddress: {
          fullName: values.fullName || '',
          phoneNumber: toEn((values.phoneNumber || '').trim()),
          province: values.province || '',
          city: values.city || '',
          postalCode: toEn((values.postalCode || '').trim()),
          exactAddress: values.exactAddress || '',
          buildingNumber: values.buildingNumber || undefined,
          unit: values.unit || undefined,
          notes: values.notes || undefined,
        },
        shippingMethod: selectedShipping.value,
        paymentMethod: selectedPayment.value,
        couponCode: cartStore.appliedCoupon?.code,
        couponDiscount: cartStore.couponDiscount,
      },
    })

    cartStore.setLastOrderReceipt(receipt)
    cartStore.clearCart()
    toast.success('سفارش شما با موفقیت ثبت شد!')
    router.push('/checkout/success')
  } catch (err: unknown) {
    const errorObj = err as { data?: { statusMessage?: string }; message?: string }
    const message =
      errorObj.data?.statusMessage || errorObj.message || 'خطا در ثبت سفارش. لطفاً مجدداً تلاش کنید.'
    toast.error(message)
  } finally {
    isSubmittingOrder.value = false
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- نشانگر مراحل ۲ گانه تسویه حساب -->
    <CheckoutSteps :current-step="currentStep" />

    <!-- بدنه اصلی فرآیند تسویه حساب -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      <!-- ستون فرم (راست در RTL) -->
      <div class="lg:col-span-8 space-y-6">
        <!-- مرحله ۱: مشخصات و آدرس پستی -->
        <div v-show="currentStep === 1" class="rounded-2xl border border-sand bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <div class="border-b border-sand/70 pb-4">
            <h2 class="text-lg font-bold text-ink">
              اطلاعات تحویل‌گیرنده و آدرس پستی
            </h2>
            <p class="text-xs text-muted-foreground mt-1">
              لطفاً آدرس دقیق و شماره موبایل در دسترس را جهت هماهنگی ارسال مرسوله وارد فرمایید.
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="goToStep2">
            <!-- ردیف نام و شماره تماس -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="fullName" class="text-xs font-bold text-ink">
                  نام و نام خانوادگی <span class="text-rose">*</span>
                </label>
                <input
                  id="fullName"
                  v-model="fullName"
                  v-bind="fullNameProps"
                  type="text"
                  placeholder="مثال: سارا محمدی"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
                  :class="{ 'border-rose': errors.fullName }"
                >
                <span v-if="errors.fullName" class="text-[11px] text-rose block">
                  {{ errors.fullName }}
                </span>
              </div>

              <div class="space-y-1.5">
                <label for="phoneNumber" class="text-xs font-bold text-ink">
                  شماره موبایل <span class="text-rose">*</span>
                </label>
                <input
                  id="phoneNumber"
                  v-model="phoneNumber"
                  v-bind="phoneNumberProps"
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
                  :class="{ 'border-rose': errors.phoneNumber }"
                >
                <span v-if="errors.phoneNumber" class="text-[11px] text-rose block">
                  {{ errors.phoneNumber }}
                </span>
              </div>
            </div>

            <!-- ردیف استان و شهر -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="province" class="text-xs font-bold text-ink">
                  استان <span class="text-rose">*</span>
                </label>
                <select
                  id="province"
                  v-model="province"
                  v-bind="provinceProps"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all cursor-pointer"
                  :class="{ 'border-rose': errors.province }"
                >
                  <option v-for="prov in IRAN_PROVINCES" :key="prov" :value="prov">
                    {{ prov }}
                  </option>
                </select>
                <span v-if="errors.province" class="text-[11px] text-rose block">
                  {{ errors.province }}
                </span>
              </div>

              <div class="space-y-1.5">
                <label for="city" class="text-xs font-bold text-ink">
                  شهر <span class="text-rose">*</span>
                </label>
                <input
                  id="city"
                  v-model="city"
                  v-bind="cityProps"
                  type="text"
                  placeholder="مثال: تهران"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
                  :class="{ 'border-rose': errors.city }"
                >
                <span v-if="errors.city" class="text-[11px] text-rose block">
                  {{ errors.city }}
                </span>
              </div>
            </div>

            <!-- آدرس دقیق پستی -->
            <div class="space-y-1.5">
              <label for="exactAddress" class="text-xs font-bold text-ink">
                نشانی دقیق پستی <span class="text-rose">*</span>
              </label>
              <textarea
                id="exactAddress"
                v-model="exactAddress"
                v-bind="exactAddressProps"
                rows="2"
                placeholder="نام خیابان اصلی و فرعی، کوچه، پلاک، زنگ یا مشخصات تکمیلی..."
                class="w-full rounded-xl border border-sand bg-sand/15 p-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all leading-relaxed"
                :class="{ 'border-rose': errors.exactAddress }"
              />
              <span v-if="errors.exactAddress" class="text-[11px] text-rose block">
                {{ errors.exactAddress }}
              </span>
            </div>

            <!-- پلاک، واحد و کد پستی -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="space-y-1.5">
                <label for="postalCode" class="text-xs font-bold text-ink">
                  کد پستی (۱۰ رقمی) <span class="text-rose">*</span>
                </label>
                <input
                  id="postalCode"
                  v-model="postalCode"
                  v-bind="postalCodeProps"
                  type="text"
                  dir="ltr"
                  maxlength="10"
                  placeholder="1234567890"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
                  :class="{ 'border-rose': errors.postalCode }"
                >
                <span v-if="errors.postalCode" class="text-[11px] text-rose block">
                  {{ errors.postalCode }}
                </span>
              </div>

              <div class="space-y-1.5">
                <label for="buildingNumber" class="text-xs font-bold text-ink">
                  پلاک (اختیاری)
                </label>
                <input
                  id="buildingNumber"
                  v-model="buildingNumber"
                  v-bind="buildingNumberProps"
                  type="text"
                  placeholder="مثال: ۱۲"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
                >
              </div>

              <div class="space-y-1.5">
                <label for="unit" class="text-xs font-bold text-ink">
                  واحد (اختیاری)
                </label>
                <input
                  id="unit"
                  v-model="unit"
                  v-bind="unitProps"
                  type="text"
                  placeholder="مثال: ۳"
                  class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
                >
              </div>
            </div>

            <!-- توضیحات یا یادداشت تحویل -->
            <div class="space-y-1.5">
              <label for="notes" class="text-xs font-bold text-ink">
                یادداشت یا زمان تحویل (اختیاری)
              </label>
              <input
                id="notes"
                v-model="notes"
                v-bind="notesProps"
                type="text"
                placeholder="توضیحات تکمیلی تحویل، شماره تماس دوم و..."
                class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
              >
            </div>

            <!-- دکمه ادامه به مرحله بعد -->
            <div class="pt-4 flex items-center justify-between border-t border-sand/70">
              <NuxtLink
                to="/cart"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-ink transition-colors"
              >
                <ArrowRight class="w-4 h-4 rtl:-scale-x-100" />
                <span>بازگشت به سبد خرید</span>
              </NuxtLink>

              <Button
                type="submit"
                size="lg"
                class="h-12 px-6 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <span>انتخاب شیوه ارسال و پرداخت</span>
                <ArrowLeft class="w-4 h-4 rtl:-scale-x-100" />
              </Button>
            </div>
          </form>
        </div>

        <!-- مرحله ۲: شیوه ارسال و پرداخت -->
        <div v-show="currentStep === 2" class="space-y-6">
          <!-- کارت گزینه‌های شیوه ارسال -->
          <div class="rounded-2xl border border-sand bg-white p-6 sm:p-8 shadow-2xs space-y-4">
            <div class="border-b border-sand/70 pb-3">
              <h2 class="text-lg font-bold text-ink">
                شیوه ارسال مرسوله
              </h2>
              <p class="text-xs text-muted-foreground mt-1">
                سفارش شما در بسته‌بندی امن و محافظ الیاف ورزشی کراس تحویل می‌گردد.
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <!-- گزینه ۱: پست پیشتاز کشوری -->
              <div
                class="relative p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2"
                :class="[
                  selectedShipping === 'standard'
                    ? 'border-rose bg-rose/5 shadow-2xs'
                    : 'border-sand bg-white hover:border-sand/80',
                ]"
                @click="handleShippingChange('standard')"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Truck
                      class="w-5 h-5"
                      :class="selectedShipping === 'standard' ? 'text-rose' : 'text-muted-foreground'"
                    />
                    <span class="text-xs font-bold text-ink">پست پیشتاز کشوری</span>
                  </div>
                  <span
                    v-if="cartStore.isFreeShipping"
                    class="text-[11px] font-bold text-sage bg-sage/10 px-2 py-0.5 rounded-full"
                  >
                    رایگان
                  </span>
                  <span v-else class="text-xs font-bold text-ink">
                    {{ formatToman(65000) }}
                  </span>
                </div>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  تحویل در تمام نقاط کشور طی ۲ الی ۴ روز کاری همراه با کد رهگیری پستی
                </p>
              </div>

              <!-- گزینه ۲: پیک فوری کراس (مخصوص تهران) -->
              <div
                class="relative p-4 rounded-xl border-2 transition-all cursor-pointer space-y-2"
                :class="[
                  selectedShipping === 'express'
                    ? 'border-rose bg-rose/5 shadow-2xs'
                    : 'border-sand bg-white hover:border-sand/80',
                ]"
                @click="handleShippingChange('express')"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Zap
                      class="w-5 h-5"
                      :class="selectedShipping === 'express' ? 'text-rose' : 'text-muted-foreground'"
                    />
                    <span class="text-xs font-bold text-ink">پیک اختصاصی تهران</span>
                  </div>
                  <span class="text-xs font-bold text-ink">
                    {{ formatToman(120000) }}
                  </span>
                </div>
                <p class="text-[11px] text-muted-foreground leading-relaxed">
                  تحویل روز کاری بعد در محدوده مناطق ۲۲ گانه شهر تهران با هماهنگی تلفنی
                </p>
              </div>
            </div>
          </div>

          <!-- کارت گزینه‌های شیوه پرداخت -->
          <div class="rounded-2xl border border-sand bg-white p-6 sm:p-8 shadow-2xs space-y-4">
            <div class="border-b border-sand/70 pb-3">
              <h2 class="text-lg font-bold text-ink">
                شیوه پرداخت وجه
              </h2>
              <p class="text-xs text-muted-foreground mt-1">
                کلیه تراکنش‌ها از بستر امن شاپرک با پروتکل رمزنگاری SSL پردازش می‌شوند.
              </p>
            </div>

            <div class="space-y-3 pt-2">
              <!-- درگاه آنلاین شاپرک -->
              <div
                class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between"
                :class="[
                  selectedPayment === 'online_gateway'
                    ? 'border-rose bg-rose/5 shadow-2xs'
                    : 'border-sand bg-white hover:border-sand/80',
                ]"
                @click="selectedPayment = 'online_gateway'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-rose/10 flex items-center justify-center text-rose shrink-0">
                    <CreditCard class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-ink">
                        پرداخت آنلاین با کلیه کارت‌های شتاب
                      </span>
                      <span class="text-[10px] bg-rose text-white px-2 py-0.5 rounded-full font-bold">
                        توصیه شده
                      </span>
                    </div>
                    <p class="text-[11px] text-muted-foreground mt-0.5">
                      اتصال آنی به درگاه الکترونیک شاپرک (بانک سامان / ملت)
                    </p>
                  </div>
                </div>

                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="selectedPayment === 'online_gateway' ? 'border-rose' : 'border-sand'"
                >
                  <div
                    v-if="selectedPayment === 'online_gateway'"
                    class="w-2.5 h-2.5 rounded-full bg-rose"
                  />
                </div>
              </div>

              <!-- کارت به کارت -->
              <div
                class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between"
                :class="[
                  selectedPayment === 'card_to_card'
                    ? 'border-rose bg-rose/5 shadow-2xs'
                    : 'border-sand bg-white hover:border-sand/80',
                ]"
                @click="selectedPayment = 'card_to_card'"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-sand/50 flex items-center justify-center text-ink shrink-0">
                    <Building class="w-5 h-5" />
                  </div>
                  <div>
                    <span class="text-xs font-bold text-ink">
                      واریز کارت به کارت مستقیم
                    </span>
                    <p class="text-[11px] text-muted-foreground mt-0.5">
                      ثبت سفارش و واریز به حساب رسمی کراس با پشتیبانی واتس‌اپ
                    </p>
                  </div>
                </div>

                <div
                  class="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  :class="selectedPayment === 'card_to_card' ? 'border-rose' : 'border-sand'"
                >
                  <div
                    v-if="selectedPayment === 'card_to_card'"
                    class="w-2.5 h-2.5 rounded-full bg-rose"
                  />
                </div>
              </div>
            </div>

            <!-- خلاصه آدرس ثبت شده در مرحله ۱ -->
            <div class="rounded-xl bg-sand/30 p-3.5 border border-sand/70 text-xs text-ink space-y-1 mt-4">
              <div class="flex items-center justify-between">
                <span class="font-bold">تحویل‌گیرنده: {{ values.fullName }} ({{ values.phoneNumber }})</span>
                <button
                  type="button"
                  class="text-rose text-[11px] font-bold hover:underline cursor-pointer"
                  @click="goToStep1"
                >
                  ویرایش آدرس
                </button>
              </div>
              <p class="text-[11px] text-muted-foreground leading-relaxed">
                {{ values.province }}، {{ values.city }}، {{ values.exactAddress }}
              </p>
            </div>

            <!-- دکمه‌های ناوبری مرحله ۲ -->
            <div class="pt-4 flex items-center justify-between border-t border-sand/70">
              <button
                type="button"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-ink transition-colors cursor-pointer"
                @click="goToStep1"
              >
                <ArrowRight class="w-4 h-4 rtl:-scale-x-100" />
                <span>مرحله قبل: ویرایش آدرس</span>
              </button>

              <Button
                size="lg"
                class="h-12 px-8 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
                :disabled="isSubmittingOrder"
                @click="handleFinalSubmit"
              >
                <Lock v-if="!isSubmittingOrder" class="w-4 h-4" />
                <span v-if="isSubmittingOrder">در حال پردازش تراکنش...</span>
                <span v-else>ثبت نهایی سفارش و پرداخت</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- ستون خلاصه سفارش و قیمت زنده (چپ در RTL) -->
      <div class="lg:col-span-4 lg:sticky lg:top-24">
        <CheckoutOrderSummary />
      </div>
    </div>
  </div>
</template>
