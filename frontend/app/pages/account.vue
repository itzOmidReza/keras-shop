<!-- frontend/app/pages/account.vue -->
<script setup lang="ts">
import {
  User,
  Package,
  MapPin,
  Settings,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  Phone,
  Mail,
  X,
  ShoppingBag,
} from '@lucide/vue'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { useAuthStore } from '~/stores/auth'
import { toEn, toFa, formatToman, formatDate } from '~/utils/format'
import { IRAN_PROVINCES, iranianMobileRegex, iranianPostalCodeRegex } from '~/utils/validation'
import type { UserOrderSummary } from '~/types/domain'

useSeoMeta({
  title: 'حساب کاربری | کراس',
  description: 'مدیریت حساب کاربری، سفارش‌ها و نشانی‌های شما در برند پوشاک ورزشی کراس',
})

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

// تازه نگه‌داشتن داده‌های حساب کاربری
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await Promise.all([
      authStore.fetchProfile(),
      authStore.fetchAddresses(),
      authStore.fetchOrders(),
    ])
  }
})

watch(() => authStore.isAuthenticated, (isAuth) => {
  if (isAuth) {
    authStore.fetchProfile()
    authStore.fetchAddresses()
    authStore.fetchOrders()
  }
})

// مدیریت تب‌های فعال
type TabType = 'overview' | 'orders' | 'addresses' | 'profile'
const activeTab = ref<TabType>('overview')

// همگام‌سازی تب با پارامتر URL
watch(() => route.query.tab, (newTab) => {
  if (newTab && ['overview', 'orders', 'addresses', 'profile'].includes(String(newTab))) {
    activeTab.value = newTab as TabType
  }
}, { immediate: true })

const switchTab = (tab: TabType) => {
  activeTab.value = tab
  if (route.query.tab !== tab) {
    router.replace({ query: { ...route.query, tab } })
  }
}

// فرم ویرایش اطلاعات پروفایل
const profileForm = reactive({
  fullName: '',
  email: '',
})

watch(() => authStore.user, (u) => {
  if (u) {
    profileForm.fullName = u.fullName || ''
    profileForm.email = u.email || ''
  }
}, { immediate: true })

const handleSaveProfile = async () => {
  await authStore.updateProfile({
    fullName: profileForm.fullName,
    email: profileForm.email,
  })
}

// فرم افزودن نشانی جدید
const isAddressModalOpen = ref(false)
const newAddressForm = reactive({
  title: '',
  fullName: '',
  phoneNumber: '',
  province: '',
  city: '',
  postalCode: '',
  exactAddress: '',
  buildingNumber: '',
  unit: '',
  isDefault: false,
})
const addressFormError = ref('')

const openNewAddressModal = () => {
  addressFormError.value = ''
  newAddressForm.title = 'منزل'
  newAddressForm.fullName = authStore.user?.fullName || ''
  newAddressForm.phoneNumber = authStore.user?.phoneNumber || ''
  newAddressForm.province = 'تهران'
  newAddressForm.city = 'تهران'
  newAddressForm.postalCode = ''
  newAddressForm.exactAddress = ''
  newAddressForm.buildingNumber = ''
  newAddressForm.unit = ''
  newAddressForm.isDefault = authStore.addresses.length === 0
  isAddressModalOpen.value = true
}

const addressZodSchema = z.object({
  title: z.string().min(1, 'لطفاً عنوان نشانی را مشخص کنید.'),
  fullName: z.string().min(2, 'نام تحویل‌گیرنده الزامی است.'),
  phoneNumber: z.string().regex(iranianMobileRegex, 'شماره موبایل نامعتبر است (فرمت: ۰۹xxxxxxxxx).'),
  province: z.string().min(1, 'استان الزامی است.'),
  city: z.string().min(1, 'شهر الزامی است.'),
  postalCode: z.string().regex(iranianPostalCodeRegex, 'کد پستی باید دقیقاً ۱۰ رقم باشد.'),
  exactAddress: z.string().min(10, 'آدرس پستی باید حداقل ۱۰ حرف و شامل جزئیات باشد.'),
})

const handleCreateAddress = async () => {
  addressFormError.value = ''

  const cleanPhone = toEn(newAddressForm.phoneNumber.trim())
  const cleanPostal = toEn(newAddressForm.postalCode.trim())

  const validation = addressZodSchema.safeParse({
    title: newAddressForm.title.trim(),
    fullName: newAddressForm.fullName.trim(),
    phoneNumber: cleanPhone,
    province: newAddressForm.province,
    city: newAddressForm.city.trim(),
    postalCode: cleanPostal,
    exactAddress: newAddressForm.exactAddress.trim(),
  })

  if (!validation.success) {
    addressFormError.value = validation.error.errors[0]?.message || 'اطلاعات وارد شده نامعتبر است.'
    return
  }

  const success = await authStore.addAddress({
    title: newAddressForm.title.trim(),
    fullName: newAddressForm.fullName.trim(),
    phoneNumber: cleanPhone,
    province: newAddressForm.province,
    city: newAddressForm.city.trim(),
    postalCode: cleanPostal,
    exactAddress: newAddressForm.exactAddress.trim(),
    buildingNumber: newAddressForm.buildingNumber.trim() || undefined,
    unit: newAddressForm.unit.trim() || undefined,
    isDefault: newAddressForm.isDefault,
  })

  if (success) {
    isAddressModalOpen.value = false
  }
}

const handleDeleteAddress = async (id: string) => {
  if (typeof window !== 'undefined') {
    const confirmed = window.confirm('آیا از حذف این نشانی از حساب خود اطمینان دارید؟')
    if (!confirmed) return
  }
  await authStore.deleteAddress(id)
}

// محاسبه آمار پیشخوان
const activeOrdersCount = computed(() => {
  return authStore.orders.filter((o: UserOrderSummary) => o.status === 'processing').length
})
const recentOrder = computed(() => authStore.orders[0] || null)
</script>

<template>
  <div class="container mx-auto px-4 py-8 lg:py-12 max-w-5xl">
    <!-- وضعیت در حال هیدراتاسیون اولیه -->
    <div v-if="!authStore.isHydrated" class="py-24 text-center space-y-3">
      <div class="w-10 h-10 border-2 border-sand border-t-rose rounded-full animate-spin mx-auto" />
      <p class="text-xs text-muted-foreground font-medium">
        در حال بررسی دسترسی به حساب کاربری...
      </p>
    </div>

    <!-- ۱. حالت عدم ورود کاربر (Guest Auth Guard) -->
    <div
      v-else-if="!authStore.isAuthenticated"
      class="max-w-lg mx-auto rounded-3xl border border-sand bg-white p-8 sm:p-12 text-center space-y-6 shadow-xs my-8"
    >
      <div class="w-20 h-20 rounded-2xl bg-sand/40 text-rose mx-auto flex items-center justify-center">
        <User class="w-10 h-10 stroke-1" />
      </div>

      <div class="space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <Sparkles class="w-3.5 h-3.5" />
          <span>باشگاه مشتریان کراس</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold text-ink tracking-tight">
          ورود به حساب کاربری
        </h1>
        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          برای دسترسی به پیشخوان، رهگیری سفارش‌ها، ذخیره آدرس‌های پستی و مدیریت سبد خرید، لطفاً وارد حساب کاربری خود شوید.
        </p>
      </div>

      <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          class="w-full sm:w-auto min-w-56 h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs inline-flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          @click="authStore.openAuthModal()"
        >
          <span>ورود یا عضویت با پیامک (OTP)</span>
          <ArrowLeft class="w-4 h-4" />
        </button>

        <button
          type="button"
          data-testid="demo-login-btn"
          class="w-full sm:w-auto h-12 px-5 rounded-xl border border-sand bg-sand/30 hover:bg-sand/60 text-ink font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.99]"
          @click="authStore.loginAsMockUser()"
        >
          <Sparkles class="w-4 h-4 text-rose" />
          <span>ورود سریع آزمایشی (اکانت دمو)</span>
        </button>
      </div>
    </div>

    <!-- ۲. حالت احراز هویت شده: داشبورد جامع کاربری -->
    <div v-else class="space-y-8">
      <!-- هدر خوش‌آمدگویی کاربر -->
      <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-2xl bg-sand/40 text-rose flex items-center justify-center font-bold text-xl border border-sand shrink-0">
            <User class="w-8 h-8 text-rose" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h1 class="text-lg sm:text-2xl font-bold text-ink tracking-tight">
                {{ authStore.user?.fullName || 'کاربر گرامی کراس' }}
              </h1>
              <span class="rounded-full bg-sage/15 text-sage text-[10px] font-bold px-2.5 py-0.5">
                عضو رسمی
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
              <span class="flex items-center gap-1">
                <Phone class="w-3.5 h-3.5 text-sand" />
                <span>{{ toFa(authStore.user?.phoneNumber || '') }}</span>
              </span>
              <span v-if="authStore.user?.email" class="hidden sm:inline text-sand">|</span>
              <span v-if="authStore.user?.email" class="flex items-center gap-1 font-sans">
                <Mail class="w-3.5 h-3.5 text-sand" />
                <span>{{ authStore.user.email }}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-destructive transition-colors cursor-pointer self-end sm:self-auto"
          @click="authStore.logout()"
        >
          <LogOut class="w-4 h-4" />
          <span>خروج از حساب</span>
        </button>
      </div>

      <!-- ناوبری تب‌های داشبورد -->
      <div class="border-b border-sand flex items-center gap-2 sm:gap-6 overflow-x-auto pb-px">
        <button
          type="button"
          class="py-3 px-2 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'overview' ? 'text-rose' : 'text-muted-foreground hover:text-ink'"
          @click="switchTab('overview')"
        >
          <Sparkles class="w-4 h-4" />
          <span>پیشخوان</span>
          <span
            v-if="activeTab === 'overview'"
            class="absolute inset-x-0 bottom-0 h-0.5 bg-rose"
          />
        </button>

        <button
          type="button"
          class="py-3 px-2 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'orders' ? 'text-rose' : 'text-muted-foreground hover:text-ink'"
          @click="switchTab('orders')"
        >
          <Package class="w-4 h-4" />
          <span>سفارش‌های من</span>
          <span
            v-if="authStore.orders.length > 0"
            class="w-5 h-5 rounded-full bg-sand text-ink text-[10px] font-bold flex items-center justify-center font-mono"
          >
            {{ toFa(authStore.orders.length) }}
          </span>
          <span
            v-if="activeTab === 'orders'"
            class="absolute inset-x-0 bottom-0 h-0.5 bg-rose"
          />
        </button>

        <button
          type="button"
          class="py-3 px-2 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'addresses' ? 'text-rose' : 'text-muted-foreground hover:text-ink'"
          @click="switchTab('addresses')"
        >
          <MapPin class="w-4 h-4" />
          <span>دفترچه نشانی‌ها</span>
          <span
            v-if="authStore.addresses.length > 0"
            class="w-5 h-5 rounded-full bg-sand text-ink text-[10px] font-bold flex items-center justify-center font-mono"
          >
            {{ toFa(authStore.addresses.length) }}
          </span>
          <span
            v-if="activeTab === 'addresses'"
            class="absolute inset-x-0 bottom-0 h-0.5 bg-rose"
          />
        </button>

        <button
          type="button"
          class="py-3 px-2 text-xs sm:text-sm font-bold transition-all relative whitespace-nowrap cursor-pointer flex items-center gap-2"
          :class="activeTab === 'profile' ? 'text-rose' : 'text-muted-foreground hover:text-ink'"
          @click="switchTab('profile')"
        >
          <Settings class="w-4 h-4" />
          <span>اطلاعات فردی</span>
          <span
            v-if="activeTab === 'profile'"
            class="absolute inset-x-0 bottom-0 h-0.5 bg-rose"
          />
        </button>
      </div>

      <!-- محتوای تب ۱: پیشخوان (Overview) -->
      <div v-if="activeTab === 'overview'" class="space-y-6">
        <!-- کارت‌های معیارهای آماری -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
            <span class="text-xs font-medium text-muted-foreground">سفارش‌های در حال پردازش</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-bold font-mono text-ink">{{ toFa(activeOrdersCount) }}</span>
              <Clock class="w-5 h-5 text-rose" />
            </div>
            <p class="text-[11px] text-muted-foreground pt-1 border-t border-sand/40">
              آماده‌سازی در انبار مرکزی
            </p>
          </div>

          <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
            <span class="text-xs font-medium text-muted-foreground">کل سفارش‌های ثبت شده</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-bold font-mono text-ink">{{ toFa(authStore.orders.length) }}</span>
              <Package class="w-5 h-5 text-sage" />
            </div>
            <p class="text-[11px] text-muted-foreground pt-1 border-t border-sand/40">
              سابقه خرید پوشاک کراس
            </p>
          </div>

          <div class="rounded-2xl border border-sand bg-white p-5 space-y-2 shadow-2xs">
            <span class="text-xs font-medium text-muted-foreground">امتیاز باشگاه مشتریان</span>
            <div class="flex items-baseline justify-between">
              <span class="text-2xl font-bold font-mono text-ink">{{ toFa(240) }}</span>
              <Sparkles class="w-5 h-5 text-clay" />
            </div>
            <p class="text-[11px] text-muted-foreground pt-1 border-t border-sand/40">
              سطح آرامش (نقره‌ای)
            </p>
          </div>
        </div>

        <!-- آخرین سفارش کاربر -->
        <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-ink flex items-center gap-2">
              <Package class="w-4 h-4 text-rose" />
              <span>آخرین سفارش ثبت‌شده</span>
            </h2>

            <button
              v-if="authStore.orders.length > 0"
              type="button"
              class="text-xs font-bold text-rose hover:underline cursor-pointer"
              @click="switchTab('orders')"
            >
              مشاهده تمام سفارش‌ها
            </button>
          </div>

          <div v-if="recentOrder" class="rounded-2xl border border-sand/70 p-4 space-y-3 bg-paper/30">
            <div class="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-medium text-muted-foreground">شماره سفارش:</span>
                <span class="font-bold font-mono text-ink">{{ recentOrder.orderNumber }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-medium text-muted-foreground">تاریخ:</span>
                <span>{{ formatDate(recentOrder.createdAt) }}</span>
              </div>
              <span
                class="rounded-full px-2.5 py-0.5 text-[11px] font-bold"
                :class="recentOrder.status === 'delivered' ? 'bg-sage/15 text-sage' : 'bg-rose/10 text-rose'"
              >
                {{ recentOrder.statusLabel }}
              </span>
            </div>

            <!-- بند انگشتی تصاویر اقلام سفارش -->
            <div class="flex items-center gap-3 pt-2">
              <div
                v-for="item in recentOrder.items"
                :key="item.id"
                class="w-14 h-16 rounded-xl overflow-hidden bg-sand/30 border border-sand shrink-0"
              >
                <NuxtImg
                  :src="item.image || '/placeholder.jpg'"
                  :alt="item.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="ms-auto text-end">
                <span class="text-xs font-bold text-ink block">
                  {{ formatToman(recentOrder.finalTotal) }}
                </span>
                <NuxtLink
                  :to="`/tracking?order=${recentOrder.orderNumber}`"
                  class="text-[11px] font-bold text-rose hover:underline inline-flex items-center gap-1 mt-1"
                >
                  <span>رهگیری مرسوله</span>
                  <ArrowLeft class="w-3 h-3" />
                </NuxtLink>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-xs text-muted-foreground">
            هنوز سفارشی در حساب شما ثبت نشده است.
          </div>
        </div>

        <!-- پیش‌نمایش نشانی پیش‌فرض -->
        <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-ink flex items-center gap-2">
              <MapPin class="w-4 h-4 text-rose" />
              <span>نشانی پیش‌فرض تحویل</span>
            </h2>

            <button
              type="button"
              class="text-xs font-bold text-rose hover:underline cursor-pointer"
              @click="switchTab('addresses')"
            >
              مدیریت نشانی‌ها
            </button>
          </div>

          <div v-if="authStore.defaultAddress" class="rounded-2xl border border-sand/70 p-4 space-y-1.5 text-xs bg-paper/30">
            <div class="flex items-center justify-between font-bold text-ink">
              <span>{{ authStore.defaultAddress.title }} - {{ authStore.defaultAddress.fullName }}</span>
              <span class="text-[10px] font-mono text-muted-foreground">{{ toFa(authStore.defaultAddress.phoneNumber) }}</span>
            </div>
            <p class="text-muted-foreground leading-relaxed">
              {{ authStore.defaultAddress.province }}، {{ authStore.defaultAddress.city }}، {{ authStore.defaultAddress.exactAddress }}
            </p>
          </div>

          <div v-else class="text-center py-6 space-y-2">
            <p class="text-xs text-muted-foreground">نشانی ثبت‌شده‌ای ندارید.</p>
            <button
              type="button"
              class="text-xs font-bold text-rose hover:underline cursor-pointer"
              @click="openNewAddressModal"
            >
              افزودن نشانی جدید
            </button>
          </div>
        </div>
      </div>

      <!-- محتوای تب ۲: سفارش‌های من (Orders) -->
      <div v-else-if="activeTab === 'orders'" class="space-y-4">
        <div v-if="authStore.orders.length > 0" class="space-y-4">
          <div
            v-for="order in authStore.orders"
            :key="order.orderNumber"
            class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-sand/60">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-ink">کد سفارش:</span>
                  <span class="text-xs font-mono font-bold text-rose">{{ order.orderNumber }}</span>
                </div>
                <p class="text-[11px] text-muted-foreground">
                  ثبت شده در {{ formatDate(order.createdAt) }}
                </p>
              </div>

              <div class="flex items-center gap-3">
                <span
                  class="rounded-full px-3 py-1 text-xs font-bold"
                  :class="order.status === 'delivered' ? 'bg-sage/15 text-sage' : 'bg-rose/10 text-rose'"
                >
                  {{ order.statusLabel }}
                </span>

                <NuxtLink
                  :to="`/tracking?order=${order.orderNumber}`"
                  class="rounded-xl border border-sand px-3 py-1.5 text-xs font-bold text-ink hover:border-rose hover:text-rose transition-colors"
                >
                  پیگیری مرسوله
                </NuxtLink>
              </div>
            </div>

            <!-- اقلام سفارش -->
            <div class="space-y-3">
              <div
                v-for="item in order.items"
                :key="item.id"
                class="flex items-center gap-4 py-2 border-b border-sand/30 last:border-none"
              >
                <div class="w-14 h-18 rounded-xl overflow-hidden bg-sand/30 shrink-0">
                  <NuxtImg
                    :src="item.image || '/placeholder.jpg'"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div class="flex-1 min-w-0">
                  <h3 class="text-xs sm:text-sm font-bold text-ink truncate">{{ item.title }}</h3>
                  <div class="flex items-center gap-2 text-[11px] text-muted-foreground mt-1">
                    <span>سایز: {{ item.size }}</span>
                    <span>|</span>
                    <span>تعداد: {{ toFa(item.quantity) }} عدد</span>
                  </div>
                </div>

                <div class="text-end">
                  <span class="text-xs font-bold text-ink block">{{ formatToman(item.price * item.quantity) }}</span>
                </div>
              </div>
            </div>

            <!-- خلاصه مالی سفارش -->
            <div class="pt-3 border-t border-sand/60 flex items-center justify-between text-xs font-bold">
              <span class="text-muted-foreground">مبلغ کل پرداخت شده:</span>
              <span class="text-sm font-bold text-ink">{{ formatToman(order.finalTotal) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="rounded-3xl border border-sand bg-white p-12 text-center space-y-4">
          <ShoppingBag class="w-12 h-12 text-sand mx-auto" />
          <h3 class="text-sm font-bold text-ink">سفارشی ثبت نشده است</h3>
          <p class="text-xs text-muted-foreground">محصولات مورد علاقه خود را انتخاب کنید و اولین سفارش خود را ثبت نمایید.</p>
          <NuxtLink
            to="/shop"
            class="inline-flex items-center gap-2 rounded-xl bg-rose px-6 py-2.5 text-xs font-bold text-white hover:bg-rose/90 transition-colors"
          >
            مشاهده کاتالوگ فروشگاه
          </NuxtLink>
        </div>
      </div>

      <!-- محتوای تب ۳: دفترچه نشانی‌ها (Addresses) -->
      <div v-else-if="activeTab === 'addresses'" class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-base font-bold text-ink">نشانی‌های ثبت‌شده</h2>
            <p class="text-xs text-muted-foreground mt-0.5">آدرس‌های ذخیره شده جهت تسریع در فرآیند ثبت سفارش</p>
          </div>

          <button
            type="button"
            class="h-10 px-4 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            @click="openNewAddressModal"
          >
            <Plus class="w-4 h-4" />
            <span>افزودن نشانی جدید</span>
          </button>
        </div>

        <div v-if="authStore.addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="addr in authStore.addresses"
            :key="addr.id"
            class="rounded-3xl border bg-white p-5 space-y-3 transition-all relative"
            :class="addr.isDefault ? 'border-rose shadow-xs ring-1 ring-rose/20' : 'border-sand shadow-2xs'"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-ink">{{ addr.title }}</span>
                <span
                  v-if="addr.isDefault"
                  class="rounded-full bg-rose/10 text-rose text-[10px] font-bold px-2 py-0.5"
                >
                  پیش‌فرض
                </span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  v-if="!addr.isDefault"
                  type="button"
                  class="text-[11px] font-bold text-muted-foreground hover:text-rose cursor-pointer"
                  @click="authStore.setDefaultAddress(addr.id)"
                >
                  انتخاب به عنوان پیش‌فرض
                </button>

                <button
                  type="button"
                  class="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="حذف نشانی"
                  @click="handleDeleteAddress(addr.id)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p class="text-xs text-ink leading-relaxed">
              {{ addr.province }}، {{ addr.city }}، {{ addr.exactAddress }}
              <span v-if="addr.buildingNumber">، پلاک {{ toFa(addr.buildingNumber) }}</span>
              <span v-if="addr.unit">، واحد {{ toFa(addr.unit) }}</span>
            </p>

            <div class="pt-2 border-t border-sand/60 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground">
              <span>تحویل‌گیرنده: {{ addr.fullName }}</span>
              <span class="font-mono">کد پستی: {{ toFa(addr.postalCode) }}</span>
            </div>
          </div>
        </div>

        <div v-else class="rounded-3xl border border-sand bg-white p-12 text-center space-y-3">
          <MapPin class="w-12 h-12 text-sand mx-auto" />
          <h3 class="text-sm font-bold text-ink">هنوز نشانی ثبت نکرده‌اید</h3>
          <p class="text-xs text-muted-foreground">برای سهولت در فرآیند خرید، نشانی منزل یا محل کار خود را اضافه کنید.</p>
        </div>
      </div>

      <!-- محتوای تب ۴: اطلاعات فردی (Profile) -->
      <div v-else-if="activeTab === 'profile'" class="max-w-xl">
        <form class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-5 shadow-2xs" @submit.prevent="handleSaveProfile">
          <div class="space-y-1">
            <h2 class="text-base font-bold text-ink">اطلاعات کاربری</h2>
            <p class="text-xs text-muted-foreground">مشخصات هویتی و راه‌های ارتباطی ثبت شده در حساب شما</p>
          </div>

          <div class="space-y-4 pt-2">
            <!-- شماره موبایل (غیرقابل ویرایش) -->
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-ink flex items-center justify-between">
                <span>شماره تلفن همراه</span>
                <span class="text-[10px] text-sage font-bold flex items-center gap-1">
                  <CheckCircle2 class="w-3 h-3" />
                  <span>تایید شده با پیامک</span>
                </span>
              </label>
              <input
                type="text"
                :value="toFa(authStore.user?.phoneNumber || '')"
                disabled
                class="w-full h-11 rounded-xl border border-sand bg-sand/20 px-4 text-xs font-mono text-muted-foreground cursor-not-allowed"
              >
            </div>

            <!-- نام و نام خانوادگی -->
            <div class="space-y-1.5">
              <label for="profile-name" class="text-xs font-bold text-ink">نام و نام خانوادگی</label>
              <input
                id="profile-name"
                v-model="profileForm.fullName"
                type="text"
                placeholder="مثال: سارا ملکی"
                class="w-full h-11 rounded-xl border border-sand bg-white px-4 text-xs text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all"
              >
            </div>

            <!-- آدرس ایمیل -->
            <div class="space-y-1.5">
              <label for="profile-email" class="text-xs font-bold text-ink">آدرس ایمیل (اختیاری)</label>
              <input
                id="profile-email"
                v-model="profileForm.email"
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                class="w-full h-11 rounded-xl border border-sand bg-white px-4 text-xs text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all"
              >
            </div>
          </div>

          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full h-11 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span>ذخیره تغییرات</span>
          </button>
        </form>
      </div>
    </div>

    <!-- مدال افزودن نشانی جدید -->
    <Dialog :open="isAddressModalOpen" @update:open="(val: boolean) => isAddressModalOpen = val">
      <DialogContent class="max-w-lg w-[calc(100%-2rem)] rounded-3xl border border-sand bg-paper p-6 sm:p-8 shadow-xl text-ink" dir="rtl">
        <button
          type="button"
          class="absolute inset-e-4 top-4 w-8 h-8 rounded-full bg-sand/30 hover:bg-sand/60 text-ink/70 hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
          aria-label="بستن"
          @click="isAddressModalOpen = false"
        >
          <X class="w-4 h-4" />
        </button>

        <DialogHeader class="space-y-1 text-start">
          <DialogTitle class="text-lg font-bold text-ink">افزودن نشانی جدید</DialogTitle>
          <DialogDescription class="text-xs text-muted-foreground">
            اطلاعات دقیق پستی جهت دریافت سفارش‌های خریداری شده
          </DialogDescription>
        </DialogHeader>

        <form class="space-y-4 mt-4" @submit.prevent="handleCreateAddress">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="addr-title" class="text-xs font-bold text-ink">عنوان نشانی</label>
              <input
                id="addr-title"
                v-model="newAddressForm.title"
                type="text"
                placeholder="منزل، محل کار..."
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
              >
            </div>

            <div class="space-y-1">
              <label for="addr-fullname" class="text-xs font-bold text-ink">نام تحویل‌گیرنده</label>
              <input
                id="addr-fullname"
                v-model="newAddressForm.fullName"
                type="text"
                placeholder="نام و نام خانوادگی"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="addr-phone" class="text-xs font-bold text-ink">شماره تماس تحویل‌گیرنده</label>
              <input
                id="addr-phone"
                v-model="newAddressForm.phoneNumber"
                type="tel"
                dir="ltr"
                placeholder="09123456789"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs font-mono text-ink focus:border-rose focus:outline-none"
              >
            </div>

            <div class="space-y-1">
              <label for="addr-postal" class="text-xs font-bold text-ink">کد پستی (۱۰ رقم)</label>
              <input
                id="addr-postal"
                v-model="newAddressForm.postalCode"
                type="text"
                dir="ltr"
                maxlength="10"
                placeholder="کد پستی ۱۰ رقمی"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs font-mono text-ink focus:border-rose focus:outline-none"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="addr-province" class="text-xs font-bold text-ink">استان</label>
              <select
                id="addr-province"
                v-model="newAddressForm.province"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
              >
                <option v-for="prov in IRAN_PROVINCES" :key="prov" :value="prov">
                  {{ prov }}
                </option>
              </select>
            </div>

            <div class="space-y-1">
              <label for="addr-city" class="text-xs font-bold text-ink">شهر</label>
              <input
                id="addr-city"
                v-model="newAddressForm.city"
                type="text"
                placeholder="نام شهر"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
              >
            </div>
          </div>

          <div class="space-y-1">
            <label for="addr-exact" class="text-xs font-bold text-ink">آدرس پستی دقیق</label>
            <textarea
              id="addr-exact"
              v-model="newAddressForm.exactAddress"
              rows="2"
              placeholder="خیابان، کوچه، پلاک، واحد..."
              class="w-full rounded-xl border border-sand bg-white p-3 text-xs text-ink focus:border-rose focus:outline-none leading-relaxed"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="addr-building" class="text-xs font-bold text-ink">پلاک</label>
              <input
                id="addr-building"
                v-model="newAddressForm.buildingNumber"
                type="text"
                placeholder="پلاک"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
              >
            </div>

            <div class="space-y-1">
              <label for="addr-unit" class="text-xs font-bold text-ink">واحد</label>
              <input
                id="addr-unit"
                v-model="newAddressForm.unit"
                type="text"
                placeholder="واحد"
                class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
              >
            </div>
          </div>

          <div class="flex items-center gap-2 pt-1">
            <input
              id="addr-default"
              v-model="newAddressForm.isDefault"
              type="checkbox"
              class="w-4 h-4 rounded border-sand text-rose focus:ring-rose accent-rose"
            >
            <label for="addr-default" class="text-xs font-bold text-ink cursor-pointer">
              تنظیم به عنوان نشانی پیش‌فرض تحویل سفارش
            </label>
          </div>

          <p v-if="addressFormError" class="text-xs text-destructive font-medium pt-1">
            {{ addressFormError }}
          </p>

          <div class="pt-2">
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="w-full h-11 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <span>ثبت نشانی</span>
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
