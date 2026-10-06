<!-- frontend/app/layouts/account.vue -->
<script setup lang="ts">
import {
  Sparkles,
  Package,
  MapPin,
  LogOut,
  ChevronLeft,
  User,
  Phone,
  ShieldCheck,
  Terminal,
  Heart,
} from '@lucide/vue'
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
import MobileNav from '~/components/layout/MobileNav.vue'
import CartDrawer from '~/components/cart/CartDrawer.vue'
import AuthModal from '~/components/auth/AuthModal.vue'
import { useAuthStore } from '~/stores/auth'
import { useWishlistStore } from '~/stores/wishlist'
import { toFa } from '~/utils/format'

const isMobileNavOpen = ref(false)
const authStore = useAuthStore()
const wishlistStore = useWishlistStore()
const route = useRoute()
const router = useRouter()

type TabKey = 'overview' | 'orders' | 'addresses' | 'profile'

const currentTab = computed<TabKey>(() => {
  const tab = route.query.tab as string
  if (['overview', 'orders', 'addresses', 'profile'].includes(tab)) {
    return tab as TabKey
  }
  return 'overview'
})

const switchTab = (tab: TabKey) => {
  router.push({ path: '/account', query: { tab } })
}

const userMonogram = computed(() => {
  const name = authStore.user?.fullName?.trim() || ''
  if (!name) return 'ک'
  const parts = name.split(/\s+/).filter(Boolean)
  const first = parts[0]
  const second = parts[1]
  if (first && second && first[0] && second[0]) {
    return `${first[0]}‌${second[0]}`
  }
  return first?.[0] || 'ک'
})

const maskedPhone = computed(() => {
  const phone = authStore.user?.phoneNumber || ''
  if (phone.length === 11) {
    return `${phone.slice(0, 4)}***${phone.slice(7)}`
  }
  return phone
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-paper text-ink">
    <AppHeader @open-mobile-menu="isMobileNavOpen = true" />

    <main class="flex-1">
      <!-- حالت مهمان: بدون سایدبار، اسلات در مرکز صفحه رندر می‌شود -->
      <div v-if="!authStore.isAuthenticated" class="w-full">
        <slot />
      </div>

      <!-- حالت احراز هویت شده: لی‌آوت اختصاصی ۲ ستونه ادیتوریال -->
      <div v-else class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        <!-- ناوبری افقی سریع در موبایل -->
        <div class="lg:hidden mb-6 border-b border-sand overflow-x-auto pb-2 flex items-center gap-2">
          <button
            type="button"
            data-testid="mobile-tab-overview"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            :class="currentTab === 'overview' ? 'bg-rose text-white shadow-2xs' : 'bg-sand/30 text-ink hover:bg-sand/60'"
            @click="switchTab('overview')"
          >
            <Sparkles class="w-3.5 h-3.5" />
            <span>پیشخوان</span>
          </button>

          <button
            type="button"
            data-testid="mobile-tab-orders"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            :class="currentTab === 'orders' ? 'bg-rose text-white shadow-2xs' : 'bg-sand/30 text-ink hover:bg-sand/60'"
            @click="switchTab('orders')"
          >
            <Package class="w-3.5 h-3.5" />
            <span>سفارش‌های من</span>
            <span
              v-if="authStore.orders.length > 0"
              class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono"
              :class="currentTab === 'orders' ? 'bg-white text-rose' : 'bg-sand text-ink'"
            >
              {{ toFa(authStore.orders.length) }}
            </span>
          </button>

          <NuxtLink
            to="/wishlist"
            data-testid="mobile-tab-wishlist"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-sand/30 text-ink hover:bg-sand/60"
          >
            <Heart class="w-3.5 h-3.5 text-rose" />
            <span>علاقه‌مندی‌ها</span>
            <span
              v-if="wishlistStore.itemCount > 0"
              class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono bg-sand text-ink"
            >
              {{ toFa(wishlistStore.itemCount) }}
            </span>
          </NuxtLink>

          <button
            type="button"
            data-testid="mobile-tab-addresses"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            :class="currentTab === 'addresses' ? 'bg-rose text-white shadow-2xs' : 'bg-sand/30 text-ink hover:bg-sand/60'"
            @click="switchTab('addresses')"
          >
            <MapPin class="w-3.5 h-3.5" />
            <span>دفترچه نشانی‌ها</span>
            <span
              v-if="authStore.addresses.length > 0"
              class="w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono"
              :class="currentTab === 'addresses' ? 'bg-white text-rose' : 'bg-sand text-ink'"
            >
              {{ toFa(authStore.addresses.length) }}
            </span>
          </button>

          <button
            type="button"
            data-testid="mobile-tab-profile"
            class="px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            :class="currentTab === 'profile' ? 'bg-rose text-white shadow-2xs' : 'bg-sand/30 text-ink hover:bg-sand/60'"
            @click="switchTab('profile')"
          >
            <User class="w-3.5 h-3.5" />
            <span>اطلاعات فردی</span>
          </button>

          <!-- دکمه ناوبری سریع به مرکز فرماندهی ویژه مدیر ارشد در موبایل -->
          <NuxtLink
            v-if="authStore.user?.role === 'super_admin'"
            to="/internal-ops-nexus"
            data-testid="mobile-tab-ops"
            class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer bg-sand/40 text-rose border border-sand hover:bg-sand/70"
          >
            <Terminal class="w-3.5 h-3.5" />
            <span>مرکز عملیات آتلیه</span>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- سایدبار سمت راست: پروفایل استیکی، مشخصات کاربر و منوی عمودی -->
          <aside class="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24 space-y-4">
            <!-- کارت پروفایل کاربر با مونوگرام -->
            <div class="rounded-3xl border border-sand bg-white p-6 shadow-2xs space-y-4 text-center">
              <div class="relative w-20 h-20 mx-auto">
                <div class="w-20 h-20 rounded-2xl bg-sand/35 text-rose border border-sand flex items-center justify-center font-bold text-2xl tracking-wider shadow-2xs">
                  {{ userMonogram }}
                </div>
                <div class="absolute -bottom-1 -inset-s-1 w-6 h-6 rounded-full bg-sage text-white flex items-center justify-center shadow-2xs" title="حساب تایید شده">
                  <ShieldCheck class="w-3.5 h-3.5" />
                </div>
              </div>

              <div class="space-y-1">
                <h2 class="text-base font-bold text-ink tracking-tight">
                  {{ authStore.user?.fullName || 'کاربر گرامی کراس' }}
                </h2>
                <p class="text-xs text-muted-foreground font-mono flex items-center justify-center gap-1">
                  <Phone class="w-3.5 h-3.5 text-sand" />
                  <span>{{ toFa(maskedPhone) }}</span>
                </p>

                <!-- پیوند ملایم و ظریف مدیریت آتلیه برای ادمین -->
                <div
                  v-if="authStore.user?.role === 'super_admin'"
                  data-testid="privileged-ops-card"
                  class="pt-2"
                >
                  <NuxtLink
                    to="/internal-ops-nexus"
                    data-testid="privileged-ops-link"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand/40 hover:bg-sand/70 text-rose text-xs font-bold transition-colors cursor-pointer border border-sand/80"
                  >
                    <Terminal class="w-3.5 h-3.5" />
                    <span>مرکز فرماندهی و عملیات آتلیه</span>
                  </NuxtLink>
                </div>
              </div>

              <!-- منوی عمودی ناوبری داشبورد -->
              <nav class="pt-4 border-t border-sand/70 space-y-1.5 text-start">
                <button
                  type="button"
                  data-testid="tab-overview"
                  class="w-full h-11 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  :class="currentTab === 'overview' ? 'bg-rose text-white shadow-2xs' : 'text-ink/80 hover:bg-sand/30 hover:text-ink'"
                  @click="switchTab('overview')"
                >
                  <div class="flex items-center gap-2.5">
                    <Sparkles class="w-4 h-4" :class="currentTab === 'overview' ? 'text-white' : 'text-rose'" />
                    <span>پیشخوان</span>
                  </div>
                  <ChevronLeft class="w-4 h-4 opacity-70" />
                </button>

                <button
                  type="button"
                  data-testid="tab-orders"
                  class="w-full h-11 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  :class="currentTab === 'orders' ? 'bg-rose text-white shadow-2xs' : 'text-ink/80 hover:bg-sand/30 hover:text-ink'"
                  @click="switchTab('orders')"
                >
                  <div class="flex items-center gap-2.5">
                    <Package class="w-4 h-4" :class="currentTab === 'orders' ? 'text-white' : 'text-rose'" />
                    <span>سفارش‌های من</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="authStore.orders.length > 0"
                      class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                      :class="currentTab === 'orders' ? 'bg-white text-rose' : 'bg-sand text-ink'"
                    >
                      {{ toFa(authStore.orders.length) }}
                    </span>
                    <ChevronLeft class="w-4 h-4 opacity-70" />
                  </div>
                </button>

                <NuxtLink
                  to="/wishlist"
                  data-testid="tab-wishlist"
                  class="w-full h-11 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between text-ink/80 hover:bg-sand/30 hover:text-ink cursor-pointer"
                >
                  <div class="flex items-center gap-2.5">
                    <Heart class="w-4 h-4 text-rose" />
                    <span>علاقه‌مندی‌ها</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="wishlistStore.itemCount > 0"
                      class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sand text-ink"
                    >
                      {{ toFa(wishlistStore.itemCount) }}
                    </span>
                    <ChevronLeft class="w-4 h-4 opacity-70" />
                  </div>
                </NuxtLink>

                <button
                  type="button"
                  data-testid="tab-addresses"
                  class="w-full h-11 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  :class="currentTab === 'addresses' ? 'bg-rose text-white shadow-2xs' : 'text-ink/80 hover:bg-sand/30 hover:text-ink'"
                  @click="switchTab('addresses')"
                >
                  <div class="flex items-center gap-2.5">
                    <MapPin class="w-4 h-4" :class="currentTab === 'addresses' ? 'text-white' : 'text-rose'" />
                    <span>دفترچه نشانی‌ها</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      v-if="authStore.addresses.length > 0"
                      class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                      :class="currentTab === 'addresses' ? 'bg-white text-rose' : 'bg-sand text-ink'"
                    >
                      {{ toFa(authStore.addresses.length) }}
                    </span>
                    <ChevronLeft class="w-4 h-4 opacity-70" />
                  </div>
                </button>

                <button
                  type="button"
                  data-testid="tab-profile"
                  class="w-full h-11 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                  :class="currentTab === 'profile' ? 'bg-rose text-white shadow-2xs' : 'text-ink/80 hover:bg-sand/30 hover:text-ink'"
                  @click="switchTab('profile')"
                >
                  <div class="flex items-center gap-2.5">
                    <User class="w-4 h-4" :class="currentTab === 'profile' ? 'text-white' : 'text-rose'" />
                    <span>اطلاعات فردی</span>
                  </div>
                  <ChevronLeft class="w-4 h-4 opacity-70" />
                </button>

                <!-- خط جداکننده و دکمه خروج گوست -->
                <div class="pt-3 border-t border-sand/70">
                  <button
                    type="button"
                    class="w-full h-11 px-3.5 rounded-xl text-xs font-bold text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex items-center justify-between cursor-pointer"
                    @click="authStore.logout()"
                  >
                    <div class="flex items-center gap-2.5">
                      <LogOut class="w-4 h-4" />
                      <span>خروج از حساب</span>
                    </div>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          <!-- بوم اصلی سمت چپ (Main Canvas) -->
          <div class="lg:col-span-8 xl:col-span-9 min-w-0">
            <slot />
          </div>
        </div>
      </div>
    </main>

    <AppFooter />

    <MobileNav :is-open="isMobileNavOpen" @close="isMobileNavOpen = false" />
    <CartDrawer />
    <AuthModal />
  </div>
</template>
