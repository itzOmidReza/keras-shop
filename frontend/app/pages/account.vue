<!-- frontend/app/pages/account.vue -->
<script setup lang="ts">
import {
  User,
  ArrowLeft,
  Sparkles,
  Mail,
} from '@lucide/vue'

definePageMeta({
  layout: 'account',
})

useSeoMeta({
  title: 'حساب کاربری | کراس',
  description: 'مدیریت حساب کاربری، سفارش‌ها و نشانی‌های شما در برند پوشاک ورزشی کراس',
})

const {
  authStore,
  activeTab,
  switchTab,
  activeTabTitle,
  activeTabDescription,
  openNewAddressModal,
  handleDeleteAddress,
  activeOrdersCount,
  recentOrder,
} = useAccountDashboard()

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
</script>

<template>
  <div :class="authStore.isAuthenticated ? 'w-full' : 'container mx-auto px-4 py-8 lg:py-12 max-w-5xl'">
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

    <!-- ۲. حالت احراز هویت شده: بوم اصلی داشبورد (Main Canvas) -->
    <div v-else class="space-y-6">
      <!-- هدر سربرگ ادیتوریال تب جاری -->
      <div class="rounded-3xl border border-sand bg-white p-6 sm:p-7 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-bold text-ink tracking-tight">
              {{ activeTabTitle }}
            </h1>
            <span class="rounded-full bg-sage/15 text-sage text-[10px] font-bold px-2.5 py-0.5">
              عضو رسمی
            </span>
          </div>
          <p class="text-xs text-muted-foreground">
            {{ activeTabDescription }}
          </p>
        </div>

        <div v-if="authStore.user?.email" class="flex items-center gap-1.5 text-xs text-muted-foreground font-mono bg-sand/20 px-3.5 py-2 rounded-xl border border-sand/60 w-fit">
          <Mail class="w-3.5 h-3.5 text-sand" />
          <span>{{ authStore.user.email }}</span>
        </div>
      </div>

      <!-- محتوای تب ۱: پیشخوان (Overview) -->
      <AccountOverviewTab
        v-if="activeTab === 'overview'"
        :active-orders-count="activeOrdersCount"
        :orders-count="authStore.orders.length"
        :recent-order="recentOrder"
        :default-address="authStore.defaultAddress"
        @switch-tab="switchTab"
        @open-address-modal="openNewAddressModal"
      />

      <!-- محتوای تب ۲: سفارش‌های من (Orders) -->
      <AccountOrdersTab
        v-else-if="activeTab === 'orders'"
        :orders="authStore.orders"
      />

      <!-- محتوای تب ۳: دفترچه نشانی‌ها (Addresses) -->
      <AccountAddressesTab
        v-else-if="activeTab === 'addresses'"
        :addresses="authStore.addresses"
        @open-address-modal="openNewAddressModal"
        @set-default-address="authStore.setDefaultAddress($event)"
        @delete-address="handleDeleteAddress"
      />

      <!-- محتوای تب ۴: اطلاعات فردی (Profile) -->
      <AccountProfileTab
        v-else-if="activeTab === 'profile'"
      />
    </div>

    <!-- مدال افزودن نشانی جدید -->
    <LazyAccountAddressModal />
  </div>
</template>
