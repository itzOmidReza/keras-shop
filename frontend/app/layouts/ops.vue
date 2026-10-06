<!-- frontend/app/layouts/ops.vue -->
<script setup lang="ts">
import {
  LayoutDashboard,
  Shirt,
  Package,
  MessageSquareQuote,
  Tag,
  BookOpen,
  Settings,
  Lock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import { useAdminReviews } from '~/composables/admin/useAdminReviews'
import OpsCommandPalette from '~/components/ops/common/OpsCommandPalette.vue'
import type { Component } from 'vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { isCommandPaletteOpen } = useOpsModals()
const { pendingCount } = useAdminReviews()

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)
const isProfileMenuOpen = ref(false)

const handleLockSession = () => {
  authStore.logout()
  navigateTo('/')
}

interface NavItem {
  id: string
  title: string
  path: string
  icon: Component
  testId: string
  legacyTestId?: string
  badge?: string
}

const navItems = computed<NavItem[]>(() => [
  {
    id: 'dashboard',
    title: 'پیشخوان و آمار',
    path: '/internal-ops-nexus',
    icon: LayoutDashboard,
    testId: 'ops-nav-dashboard',
    legacyTestId: 'tab-view-analytics',
  },
  {
    id: 'products',
    title: 'محصولات و لباس‌ها',
    path: '/internal-ops-nexus/products',
    icon: Shirt,
    testId: 'ops-nav-products',
    legacyTestId: 'tab-view-products',
  },
  {
    id: 'orders',
    title: 'سفارش‌ها و ارسال',
    path: '/internal-ops-nexus/orders',
    icon: Package,
    testId: 'ops-nav-orders',
    legacyTestId: 'tab-view-fulfillment',
  },
  {
    id: 'reviews',
    title: 'نظرات و دیدگاه‌ها',
    path: '/internal-ops-nexus/reviews',
    icon: MessageSquareQuote,
    testId: 'ops-nav-reviews',
    badge: pendingCount.value > 0 ? String(pendingCount.value) : undefined,
  },
  {
    id: 'discounts',
    title: 'تخفیف‌ها و کوپن‌ها',
    path: '/internal-ops-nexus/discounts',
    icon: Tag,
    testId: 'ops-nav-discounts',
    legacyTestId: 'tab-view-vouchers',
  },
  {
    id: 'articles',
    title: 'مجله و مقالات',
    path: '/internal-ops-nexus/articles',
    icon: BookOpen,
    testId: 'ops-nav-articles',
  },
  {
    id: 'settings',
    title: 'تنظیمات فروشگاه',
    path: '/internal-ops-nexus/settings',
    icon: Settings,
    testId: 'ops-nav-settings',
  },
])

const isItemActive = (item: NavItem) => {
  const currentPath = route.path
  if (item.path === '/internal-ops-nexus') {
    return currentPath === '/internal-ops-nexus'
  }
  return currentPath.startsWith(item.path)
}

const navigateToDomain = (item: NavItem) => {
  isMobileSidebarOpen.value = false
  router.push(item.path)
}

const breadcrumb = computed(() => {
  const path = route.path
  if (path === '/internal-ops-nexus/products/new') {
    return 'محصولات و لباس‌ها / افزودن محصول جدید'
  }
  if (path.startsWith('/internal-ops-nexus/products/') && path.endsWith('/edit')) {
    return 'محصولات و لباس‌ها / ویرایش محصول'
  }
  if (path.startsWith('/internal-ops-nexus/products')) {
    return 'محصولات و لباس‌ها'
  }
  if (path.startsWith('/internal-ops-nexus/orders')) {
    return 'سفارش‌ها و ارسال'
  }
  if (path.startsWith('/internal-ops-nexus/discounts')) {
    return 'تخفیف‌ها و کوپن‌ها'
  }
  if (path === '/internal-ops-nexus/articles/new') {
    return 'مجله و مقالات / نگارش مقاله جدید'
  }
  if (path.startsWith('/internal-ops-nexus/articles/') && path.endsWith('/edit')) {
    return 'مجله و مقالات / ویرایش مقاله'
  }
  if (path.startsWith('/internal-ops-nexus/articles')) {
    return 'مجله و مقالات'
  }
  return 'پیشخوان و آمار'
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900" dir="rtl">
    <!-- هدر باریک ۵۶ پیکسلی ثابت (Fixed Top Header - 56px) -->
    <header class="fixed top-0 inset-x-0 h-14 z-40 bg-white border-b border-slate-200/80 px-3 sm:px-5 flex items-center justify-between shadow-2xs">
      <!-- سمت راست: دکمه تاگل سایدبار و مسیر ناوبری (Breadcrumb) -->
      <div class="flex items-center gap-2.5 min-w-0">
        <!-- دکمه منوی موبایل -->
        <button
          type="button"
          class="lg:hidden p-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer shrink-0"
          aria-label="منوی عملیات"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <Menu v-if="!isMobileSidebarOpen" class="w-4 h-4" />
          <X v-else class="w-4 h-4" />
        </button>

        <!-- دکمه جمع/باز کردن سایدبار دسکتاپ -->
        <button
          type="button"
          data-testid="sidebar-toggle-btn"
          class="hidden lg:flex p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
          :title="isSidebarCollapsed ? 'گسترش منو' : 'جمع کردن منو'"
          @click="isSidebarCollapsed = !isSidebarCollapsed"
        >
          <ChevronRight v-if="!isSidebarCollapsed" class="w-4 h-4" />
          <ChevronLeft v-else class="w-4 h-4" />
        </button>

        <!-- نشان تجاری و مسیر ناوبری (Breadcrumb) -->
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xs font-black tracking-wider text-slate-900 hidden sm:inline shrink-0">
            کراس • آتلیه
          </span>
          <span class="text-slate-300 hidden sm:inline">/</span>
          <span class="text-xs font-bold text-slate-700 truncate">
            {{ breadcrumb }}
          </span>
        </div>
      </div>

      <!-- مرکز: کپسول جست‌وجوی سراسری (Omnisearch Pill - Ctrl + K) -->
      <div class="hidden md:flex items-center justify-center flex-1 max-w-sm px-4">
        <button
          type="button"
          data-testid="omnisearch-pill"
          class="w-full h-8.5 px-3 rounded-xl bg-slate-100/80 hover:bg-slate-200/70 border border-slate-200 text-xs text-slate-500 hover:text-slate-800 flex items-center justify-between transition-all cursor-pointer shadow-2xs"
          @click="isCommandPaletteOpen = true"
        >
          <div class="flex items-center gap-2">
            <Search class="w-3.5 h-3.5 text-slate-400" />
            <span>جست‌وجوی سریع کالاها و سفارش‌ها...</span>
          </div>
          <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-600 font-bold shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      <!-- سمت چپ: اعلان‌ها، قفل جلسه و پروفایل مدیریت -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- زنگوله اعلان‌ها -->
        <button
          type="button"
          class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer relative"
          title="مرکز اعلان‌ها"
        >
          <Bell class="w-4 h-4" />
          <span class="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-rose ring-2 ring-white" />
        </button>

        <!-- دکمه قفل سریع جلسه کاری -->
        <button
          type="button"
          data-testid="ops-lock-btn"
          class="h-8.5 px-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose border border-slate-200 hover:border-rose/30 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs shrink-0"
          title="خروج امن از سیستم"
          @click="handleLockSession"
        >
          <Lock class="w-3.5 h-3.5 text-rose" />
          <span class="hidden sm:inline">خروج امن</span>
        </button>

        <!-- منوی پروفایل فشرده اپراتور -->
        <div class="relative">
          <button
            type="button"
            class="flex items-center gap-2 ps-2 pe-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors cursor-pointer"
            @click="isProfileMenuOpen = !isProfileMenuOpen"
          >
            <div class="w-6 h-6 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-[10px]">
              مد
            </div>
            <div class="text-start hidden sm:block">
              <span class="text-[11px] font-bold text-slate-800 block leading-tight">مدیریت بوتیک</span>
              <span class="text-[9px] text-slate-500 font-mono block">ADMIN</span>
            </div>
          </button>

          <!-- پس‌زمینه شفاف جهت بستن منو -->
          <div
            v-if="isProfileMenuOpen"
            class="fixed inset-0 z-40"
            @click="isProfileMenuOpen = false"
          />

          <!-- دراپ‌داون پروفایل -->
          <div
            v-if="isProfileMenuOpen"
            class="absolute end-0 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs animate-in fade-in zoom-in-95"
          >
            <NuxtLink
              to="/"
              target="_blank"
              class="w-full flex items-center gap-2 p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              @click="isProfileMenuOpen = false"
            >
              <ExternalLink class="w-3.5 h-3.5 text-slate-500" />
              <span>مشاهده ویترین فروشگاه</span>
            </NuxtLink>

            <button
              type="button"
              class="w-full flex items-center gap-2 p-2 rounded-lg text-rose hover:bg-rose-50 transition-colors font-bold cursor-pointer"
              @click="isProfileMenuOpen = false; handleLockSession()"
            >
              <Lock class="w-3.5 h-3.5" />
              <span>قفل جلسه کاری</span>
            </button>

            <div class="border-t border-slate-100 my-1" />

            <button
              type="button"
              class="w-full flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              @click="isProfileMenuOpen = false; handleLockSession()"
            >
              <LogOut class="w-3.5 h-3.5 text-slate-400" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- سایدبار ثابت راست: منحصراً ۴ دکمه اصلی ناوبری -->
    <aside
      class="hidden lg:flex flex-col fixed top-14 start-0 bottom-0 h-[calc(100vh-3.5rem)] z-30 bg-white border-e border-slate-200/80 overflow-y-auto transition-all duration-200"
      :class="isSidebarCollapsed ? 'w-[72px]' : 'w-60'"
    >
      <div class="p-3 border-b border-slate-200/80 flex items-center justify-between">
        <span v-if="!isSidebarCollapsed" class="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-wider">
          مدیریت آتلیه کراس
        </span>
        <span v-else class="text-[10px] font-mono font-bold text-slate-400 mx-auto">
          OPS
        </span>
      </div>

      <!-- ۴ مورد ناوبری اصلی -->
      <nav class="flex-1 p-2.5 space-y-1.5 overflow-y-auto">
        <NuxtLink
          v-for="item in navItems"
          :key="item.id"
          :to="item.path"
          :data-testid="item.testId"
          class="w-full rounded-xl transition-all flex items-center cursor-pointer group text-start relative"
          :class="[
            isItemActive(item)
              ? 'bg-ink text-white shadow-2xs font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium',
            isSidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 gap-2.5',
          ]"
          :title="isSidebarCollapsed ? item.title : undefined"
          @click="navigateToDomain(item)"
        >
          <component
            :is="item.icon"
            class="w-4 h-4 shrink-0 transition-colors"
            :class="isItemActive(item) ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-800'"
          />
          <span v-if="!isSidebarCollapsed" class="text-xs truncate flex-1 leading-tight">
            {{ item.title }}
          </span>
          <span
            v-if="!isSidebarCollapsed && item.badge"
            class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0"
            :class="isItemActive(item) ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'"
          >
            {{ item.badge }}
          </span>
        </NuxtLink>
      </nav>

      <!-- بخش پایین سایدبار: پیوند به فروشگاه و خروج -->
      <div class="p-2.5 border-t border-slate-200/80 space-y-1 bg-slate-50/50">
        <NuxtLink
          to="/"
          target="_blank"
          class="w-full rounded-xl transition-all flex items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 text-xs font-bold cursor-pointer"
          :class="isSidebarCollapsed ? 'justify-center' : 'gap-2'"
          title="مشاهده ویترین فروشگاه"
        >
          <ExternalLink class="w-4 h-4 shrink-0 text-slate-500" />
          <span v-if="!isSidebarCollapsed">مشاهده فروشگاه</span>
        </NuxtLink>

        <button
          type="button"
          data-testid="ops-lock-btn"
          class="w-full rounded-xl transition-all flex items-center text-rose hover:bg-rose-50 p-2 text-xs font-bold cursor-pointer"
          :class="isSidebarCollapsed ? 'justify-center' : 'gap-2'"
          title="خروج امن"
          @click="handleLockSession"
        >
          <Lock class="w-4 h-4 shrink-0" />
          <span v-if="!isSidebarCollapsed">خروج امن</span>
        </button>
      </div>
    </aside>

    <!-- منوی سایدبار موبایل -->
    <div
      v-if="isMobileSidebarOpen"
      class="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex"
      @click.self="isMobileSidebarOpen = false"
    >
      <div class="w-64 bg-white h-full border-e border-slate-200 flex flex-col p-4 space-y-4 shadow-xl">
        <div class="flex items-center justify-between pb-3 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-900">مدیریت آتلیه کراس</span>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
            @click="isMobileSidebarOpen = false"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <nav class="flex-1 space-y-1.5 overflow-y-auto">
          <NuxtLink
            v-for="item in navItems"
            :key="item.id"
            :to="item.path"
            class="w-full px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-start"
            :class="isItemActive(item) ? 'bg-ink text-white font-bold' : 'text-slate-600 hover:bg-slate-100 font-medium'"
            @click="navigateToDomain(item)"
          >
            <component :is="item.icon" class="w-4 h-4 shrink-0" />
            <span class="text-xs flex-1">{{ item.title }}</span>
            <span
              v-if="item.badge"
              class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold shrink-0"
              :class="isItemActive(item) ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700'"
            >
              {{ item.badge }}
            </span>
          </NuxtLink>
        </nav>

        <div class="pt-3 border-t border-slate-200 space-y-1.5">
          <NuxtLink
            to="/"
            class="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-700 hover:bg-slate-100 font-bold"
          >
            <ExternalLink class="w-4 h-4 text-slate-500" />
            <span>مشاهده فروشگاه</span>
          </NuxtLink>
          <button
            type="button"
            class="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-rose hover:bg-rose-50 font-bold"
            @click="handleLockSession"
          >
            <Lock class="w-4 h-4" />
            <span>خروج امن</span>
          </button>
        </div>
      </div>
    </div>

    <!-- بوم اصلی صفحه (Workspace Canvas) -->
    <main
      class="min-h-screen bg-slate-50 pt-14 pb-16 lg:pb-0 transition-all duration-200 font-sans"
      :class="isSidebarCollapsed ? 'lg:ps-[72px]' : 'lg:ps-60'"
    >
      <div class="p-4 sm:p-6 lg:p-7 min-w-0 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>

    <!-- نوار ناوبری پایین صفحه مخصوص موبایل (Mobile Bottom Nav) -->
    <nav class="lg:hidden fixed bottom-0 inset-x-0 h-14 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/90 flex items-center justify-around px-2 shadow-lg">
      <NuxtLink
        v-for="item in navItems"
        :key="item.id"
        :to="item.path"
        :data-testid="item.testId"
        class="flex-1 py-1 flex flex-col items-center justify-center gap-0.5 text-center transition-colors cursor-pointer"
        :class="isItemActive(item) ? 'text-ink font-bold' : 'text-slate-500 hover:text-slate-800 font-medium'"
      >
        <div class="relative">
          <component
            :is="item.icon"
            class="w-4 h-4 transition-transform"
            :class="isItemActive(item) ? 'text-amber-500 scale-110' : 'text-slate-400'"
          />
          <span
            v-if="item.badge"
            class="absolute -top-1.5 -end-2 min-w-3.5 h-3.5 px-0.5 bg-rose text-white text-[9px] font-mono font-bold rounded-full flex items-center justify-center leading-none"
          >
            {{ item.badge }}
          </span>
        </div>
        <span class="text-[10px] leading-tight">{{ item.title.split(' ')[0] }}</span>
      </NuxtLink>
    </nav>

    <!-- پالت دستورات سراسری ⌘K -->
    <OpsCommandPalette v-model:open="isCommandPaletteOpen" @navigate="path => router.push(path)" />
  </div>
</template>
