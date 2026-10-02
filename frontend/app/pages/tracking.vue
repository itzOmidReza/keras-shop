<!-- frontend/app/pages/tracking.vue -->
<script setup lang="ts">
import {
  PackageSearch,
  Search,
  Copy,
  Check,
  ExternalLink,
  Truck,
  MapPin,
  Clock,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  X,
  Package,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import { toEn, toFa, formatToman, formatDate } from '~/utils/format'
import type { TrackOrderResponse } from '~/types/domain'
import TrackingTimeline from '~/components/tracking/TrackingTimeline.vue'

useSeoMeta({
  title: 'پیگیری سفارش و رهگیری مرسولات | کراس',
  description: 'سامانه پیگیری وضعیت سفارش، مشاهده بارکد پستی ۲۴ رقمی و مراحل آماده‌سازی پوشاک ورزشی کراس',
})

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const isLoading = ref(false)
const orderData = ref<TrackOrderResponse | null>(null)
const errorMessage = ref('')
const hasSearched = ref(false)
const isCopied = ref(false)

const testPills = [
  { label: 'سفارش در مسیر پست', code: 'KERAS-208314' },
  { label: 'سفارش تحویل‌شده', code: 'KERAS-104921' },
  { label: 'سفارش در حال پردازش', code: 'KERAS-309115' },
]

const maskPhone = (phone?: string) => {
  if (!phone) return ''
  const clean = toEn(phone).trim()
  if (clean.length === 11) {
    return toFa(`${clean.slice(0, 4)}***${clean.slice(7)}`)
  }
  return toFa(phone)
}

const handleSearch = async (explicitCode?: string) => {
  const targetQuery = explicitCode !== undefined ? explicitCode : searchQuery.value
  const normalized = toEn(targetQuery).trim()

  if (!normalized) {
    errorMessage.value = 'لطفاً شماره سفارش (مانند KERAS-208314) یا شماره تلفن همراه خود را وارد فرمایید.'
    orderData.value = null
    hasSearched.value = true
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  hasSearched.value = true

  try {
    const res = await $fetch<TrackOrderResponse>('/api/orders/track', {
      method: 'POST',
      body: { query: normalized },
    })

    orderData.value = res
    searchQuery.value = normalized

    // هماهنگ‌سازی پارامتر آدرس بار بدون ریلود
    router.replace({
      query: { ...route.query, order: normalized },
    })
  } catch (err: unknown) {
    orderData.value = null
    const fetchErr = err as { data?: { statusMessage?: string } }
    errorMessage.value =
      fetchErr?.data?.statusMessage ||
      'سفارشی با این مشخصات یافت نشد. لطفاً از صحت شماره سفارش یا شماره تماس اطمینان حاصل نمایید.'
  } finally {
    isLoading.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  orderData.value = null
  errorMessage.value = ''
  hasSearched.value = false
  router.replace({ query: {} })
}

const applyPill = (code: string) => {
  searchQuery.value = code
  handleSearch(code)
}

const copyTrackingCode = async () => {
  if (!orderData.value?.trackingCode) return
  try {
    await navigator.clipboard.writeText(orderData.value.trackingCode)
    isCopied.value = true
    toast.success('کد رهگیری پستی کپی شد.')
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  } catch {
    toast.error('امکان کپی خودکار فراهم نشد.')
  }
}

// مقداردهی اولیه از کوئری URL
onMounted(() => {
  const queryParam = (route.query.order || route.query.q) as string | undefined
  if (queryParam) {
    searchQuery.value = queryParam
    handleSearch(queryParam)
  }
})
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- بخش معرفی و هیرو -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-20">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <PackageSearch class="w-3.5 h-3.5" />
          <span>شفافیت و رهگیری زنده مرسولات</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight sm:leading-tight">
          پیگیری لحظه‌ای سفارش و بارکد پستی
        </h1>

        <p class="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          جهت مشاهده آخرین وضعیت آماده‌سازی، بسته‌بندی در انبار مرکزی یا دریافت کد رهگیری ۲۴ رقمی شرکت ملی پست، شماره سفارش یا شماره همراه خود را وارد کنید.
        </p>

        <!-- فرم جستجوی سفارش -->
        <div class="max-w-xl mx-auto pt-4">
          <form
            class="relative flex items-center shadow-xs rounded-2xl bg-white border border-sand focus-within:border-rose/60 focus-within:ring-2 focus-within:ring-rose/20 transition-all p-1.5"
            @submit.prevent="handleSearch()"
          >
            <div class="ps-3.5 text-muted-foreground">
              <Search class="w-5 h-5 text-rose/70" />
            </div>

            <input
              v-model="searchQuery"
              type="text"
              dir="auto"
              placeholder="شماره سفارش (مثال: KERAS-208314) یا شماره همراه..."
              class="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-ink placeholder:text-muted-foreground/60 focus:outline-none"
            >

            <button
              v-if="searchQuery"
              type="button"
              class="p-1.5 text-muted-foreground hover:text-ink me-1 transition-colors rounded-lg hover:bg-sand/30"
              @click="clearSearch"
            >
              <X class="w-4 h-4" />
            </button>

            <button
              type="submit"
              :disabled="isLoading"
              class="px-6 py-2.5 rounded-xl bg-ink text-sand hover:bg-ink/90 font-bold text-xs sm:text-sm shrink-0 transition-colors disabled:opacity-50"
            >
              <span v-if="isLoading">در حال استعلام...</span>
              <span v-else>رهگیری</span>
            </button>
          </form>

          <!-- چیپ‌های تست سریع برای بازبینی آزمونگران -->
          <div class="flex flex-wrap items-center justify-center gap-2 pt-4">
            <span class="text-2xs text-muted-foreground">نمونه‌های تستی:</span>
            <button
              v-for="pill in testPills"
              :key="pill.code"
              type="button"
              class="text-2xs px-2.5 py-1 rounded-full bg-white border border-sand hover:border-rose/50 hover:text-rose transition-colors font-mono"
              @click="applyPill(pill.code)"
            >
              {{ pill.label }}: {{ pill.code }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- بخش نتایج جستجو -->
    <main class="container mx-auto px-4 max-w-4xl py-12">
      <!-- حالت در حال بارگذاری -->
      <div v-if="isLoading" class="space-y-6 animate-pulse">
        <div class="h-28 bg-white rounded-3xl border border-sand/70 p-6" />
        <div class="h-44 bg-white rounded-3xl border border-sand/70 p-6" />
        <div class="h-56 bg-white rounded-3xl border border-sand/70 p-6" />
      </div>

      <!-- وضعیت خطا یا عدم یافتن سفارش -->
      <div
        v-else-if="errorMessage"
        class="rounded-3xl border border-rose/30 bg-white p-8 sm:p-10 text-center space-y-4 shadow-2xs"
      >
        <div class="w-14 h-14 rounded-2xl bg-rose/10 text-rose mx-auto flex items-center justify-center">
          <AlertCircle class="w-7 h-7" />
        </div>

        <div class="space-y-2">
          <h3 class="text-base sm:text-lg font-bold text-ink">
            نتیجه‌ای یافت نشد
          </h3>
          <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            {{ errorMessage }}
          </p>
        </div>

        <div class="pt-2">
          <NuxtLink
            to="/contact?subject=order"
            class="inline-flex items-center gap-2 text-xs font-bold text-rose hover:underline"
          >
            <span>ارتباط با کانسیرژ برای بررسی سفارش</span>
            <ArrowLeft class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>
      </div>

      <!-- نمایش اطلاعات سفارش یافته شده -->
      <div v-else-if="orderData" class="space-y-8">
        <!-- کارت خلاصه و وضعیت کلی -->
        <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div class="flex flex-wrap items-center justify-between gap-4 border-b border-sand/60 pb-6">
            <div class="space-y-1">
              <div class="flex items-center gap-3">
                <span class="text-xs text-muted-foreground font-medium">کد سفارش:</span>
                <span class="text-base sm:text-lg font-bold font-mono text-rose">{{ orderData.orderNumber }}</span>
              </div>
              <p class="text-xs text-muted-foreground">
                ثبت سفارش: {{ formatDate(orderData.createdAt) }}
              </p>
            </div>

            <!-- وضعیت سفارش -->
            <div class="flex items-center gap-3">
              <span
                class="px-3.5 py-1 rounded-full text-xs font-bold"
                :class="[
                  orderData.status === 'delivered' ? 'bg-sage/15 text-sage border border-sage/30' :
                  orderData.status === 'handed_over' ? 'bg-rose/10 text-rose border border-rose/30' :
                  orderData.status === 'processing' ? 'bg-clay/15 text-clay border border-clay/30' :
                  'bg-sand/60 text-ink border border-sand'
                ]"
              >
                {{ orderData.statusLabel }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div class="p-4 rounded-2xl bg-paper/60 border border-sand/50 space-y-1">
              <span class="text-muted-foreground flex items-center gap-1.5">
                <Truck class="w-3.5 h-3.5 text-rose" />
                <span>ناوگان ارسال</span>
              </span>
              <span class="font-bold text-ink block pt-0.5">{{ orderData.carrier }}</span>
            </div>

            <div class="p-4 rounded-2xl bg-paper/60 border border-sand/50 space-y-1">
              <span class="text-muted-foreground flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-rose" />
                <span>پیش‌بینی تحویل</span>
              </span>
              <span class="font-bold text-ink block pt-0.5">{{ orderData.estimatedDelivery }}</span>
            </div>

            <div class="p-4 rounded-2xl bg-paper/60 border border-sand/50 space-y-1">
              <span class="text-muted-foreground flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5 text-rose" />
                <span>مبلغ کل سفارش</span>
              </span>
              <span class="font-bold text-ink block pt-0.5">{{ formatToman(orderData.totalAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- کارت تایم‌لاین مراحل ارسال -->
        <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
          <div class="flex items-center justify-between border-b border-sand/60 pb-4">
            <h3 class="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
              <Clock class="w-4 h-4 text-rose" />
              <span>مراحل آماده‌سازی و ارسال مرسوله</span>
            </h3>
            <span class="text-2xs text-muted-foreground">به‌روزرسانی خودکار</span>
          </div>

          <TrackingTimeline
            :timeline="orderData.timeline"
            :current-status="orderData.status"
          />
        </div>

        <!-- کارت بارکد رهگیری پستی و مشخصات تحویل -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- مشخصات بارکد شرکت پست -->
          <div class="rounded-3xl border border-sand bg-white p-6 sm:p-7 space-y-5 shadow-2xs flex flex-col justify-between">
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-bold text-ink flex items-center gap-2">
                  <Package class="w-4 h-4 text-rose" />
                  <span>کد رهگیری پستی</span>
                </h4>
                <span class="text-2xs px-2 py-0.5 rounded-md bg-sand/30 font-medium text-ink/70">سامانه شاخص پست</span>
              </div>

              <div class="p-4 rounded-2xl bg-paper border border-sand/60 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-2xs text-muted-foreground">بارکد ۲۴ رقمی مرسوله:</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 text-2xs font-bold text-rose hover:underline cursor-pointer"
                    @click="copyTrackingCode"
                  >
                    <Check v-if="isCopied" class="w-3 h-3 text-sage" />
                    <Copy v-else class="w-3 h-3" />
                    <span>{{ isCopied ? 'کپی شد' : 'کپی بارکد' }}</span>
                  </button>
                </div>

                <div class="font-mono text-sm sm:text-base font-bold tracking-wider text-ink text-center py-1 bg-white rounded-xl border border-sand/40 select-all">
                  {{ orderData.trackingCode }}
                </div>
              </div>

              <p class="text-2xs text-muted-foreground leading-relaxed">
                با وارد کردن این شماره در درگاه رسمی شرکت ملی پست جمهوری اسلامی ایران می‌توانید وضعیت مسیر پستی بسته خود را رهگیری فرمایید.
              </p>
            </div>

            <div class="pt-2">
              <a
                href="https://tracking.post.ir"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-sand bg-white hover:bg-sand/20 text-ink text-xs font-bold transition-colors"
              >
                <span>ورود به سامانه رسمی رهگیری پست</span>
                <ExternalLink class="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>

          <!-- اطلاعات تحویل‌گیرنده و نشانی -->
          <div class="rounded-3xl border border-sand bg-white p-6 sm:p-7 space-y-4 shadow-2xs">
            <h4 class="text-sm font-bold text-ink flex items-center gap-2 pb-2 border-b border-sand/60">
              <MapPin class="w-4 h-4 text-rose" />
              <span>مشخصات تحویل‌گیرنده و نشانی</span>
            </h4>

            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between py-1.5 border-b border-sand/30">
                <span class="text-muted-foreground">نام تحویل‌گیرنده:</span>
                <span class="font-bold text-ink">{{ orderData.recipientName }}</span>
              </div>

              <div
                v-if="orderData.recipientPhone"
                class="flex items-center justify-between py-1.5 border-b border-sand/30"
              >
                <span class="text-muted-foreground">شماره تماس ثبت‌شده:</span>
                <span class="font-bold font-mono text-ink">{{ maskPhone(orderData.recipientPhone) }}</span>
              </div>

              <div class="space-y-1.5 pt-1">
                <span class="text-muted-foreground block">نشانی تحویل:</span>
                <p class="font-medium text-ink bg-paper/60 p-3 rounded-xl border border-sand/50 leading-relaxed text-xs">
                  {{ orderData.shippingAddress }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- کارت لیست اقلام خریداری‌شده در این سفارش -->
        <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 class="text-sm sm:text-base font-bold text-ink pb-2 border-b border-sand/60">
            اقلام موجود در این مرسوله
          </h3>

          <div class="divide-y divide-sand/40">
            <div
              v-for="item in orderData.items"
              :key="item.title + item.size"
              class="py-4 first:pt-2 last:pb-0 flex items-center justify-between gap-4"
            >
              <div class="flex items-center gap-4">
                <div class="w-14 h-18 rounded-xl overflow-hidden bg-sand/30 shrink-0 border border-sand/50">
                  <NuxtImg
                    :src="item.image || '/placeholder.jpg'"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="space-y-1">
                  <h4 class="text-xs sm:text-sm font-bold text-ink">
                    {{ item.title }}
                  </h4>
                  <div class="flex items-center gap-2 text-2xs text-muted-foreground">
                    <span>سایز: {{ item.size }}</span>
                    <span v-if="item.color">| رنگ: {{ item.color }}</span>
                    <span>| تعداد: {{ toFa(item.quantity) }}</span>
                  </div>
                </div>
              </div>

              <div class="text-end text-xs font-bold text-ink shrink-0 font-mono">
                {{ formatToman(item.price * item.quantity) }}
              </div>
            </div>
          </div>
        </div>

        <!-- بنر پشتیبانی و همراهی -->
        <div class="rounded-3xl border border-sand/70 bg-sand/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start">
          <div class="space-y-1">
            <h4 class="text-sm font-bold text-ink">
              نیاز به راهنمایی بیشتر در خصوص ارسال این سفارش دارید؟
            </h4>
            <p class="text-xs text-muted-foreground">
              تیم کانسیرژ کراس در تمام ساعات کاری آماده پاسخگویی و پیگیری امور لجستیک شماست.
            </p>
          </div>

          <NuxtLink
            to="/contact?subject=order"
            class="px-6 py-2.5 rounded-full bg-ink text-sand hover:bg-ink/90 text-xs font-bold transition-colors shrink-0"
          >
            گفت‌وگو با پشتیبانی
          </NuxtLink>
        </div>
      </div>

      <!-- وضعیت پیش از اولین جستجو -->
      <div
        v-else-if="!hasSearched"
        class="rounded-3xl border border-sand bg-white p-12 text-center space-y-4 shadow-2xs"
      >
        <div class="w-16 h-16 rounded-2xl bg-sand/30 text-rose mx-auto flex items-center justify-center">
          <PackageSearch class="w-8 h-8" />
        </div>
        <h3 class="text-base font-bold text-ink">
          سفارش خود را جستجو کنید
        </h3>
        <p class="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          با وارد کردن شماره سفارش یا شماره تلفن همراه، اطلاعات کامل بارکد پستی و موقعیت مکانی مرسوله نمایش داده خواهد شد.
        </p>
      </div>
    </main>
  </div>
</template>
