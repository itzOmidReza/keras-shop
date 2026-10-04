<!-- frontend/app/layouts/ops.vue -->
<script setup lang="ts">
import {
  TrendingUp,
  Truck,
  Users,
  ShieldAlert,
  Lock,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Activity,
  Menu,
  X,
  Package,
  CreditCard,
  Search,
  Bell,
  LogOut,
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import OpsCommandPalette from '~/components/ops/common/OpsCommandPalette.vue'
import type { Component } from 'vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const { isCommandPaletteOpen } = useOpsModals()

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
  badge?: string
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    title: 'پیشخوان اصلی',
    path: '/internal-ops-nexus',
    icon: TrendingUp,
    testId: 'ops-nav-analytics',
  },
  {
    id: 'products',
    title: 'کاتالوگ پوشاک',
    path: '/internal-ops-nexus/products',
    icon: Package,
    testId: 'ops-nav-products',
  },
  {
    id: 'orders',
    title: 'فروش و مرسوله‌ها',
    path: '/internal-ops-nexus/orders',
    icon: Truck,
    testId: 'ops-nav-fulfillment',
    badge: '۳',
  },
  {
    id: 'finance',
    title: 'امور مالی و تسویه',
    path: '/internal-ops-nexus/finance',
    icon: CreditCard,
    testId: 'ops-nav-finance',
  },
  {
    id: 'crm',
    title: 'مشتریان و وفاداری',
    path: '/internal-ops-nexus/crm',
    icon: Users,
    testId: 'ops-nav-crm',
  },
  {
    id: 'audit',
    title: 'امنیت و لاگ ممیزی',
    path: '/internal-ops-nexus/audit',
    icon: ShieldAlert,
    testId: 'ops-nav-audit',
  },
]

const isItemActive = (item: NavItem) => {
  const currentPath = route.path
  if (item.path === '/internal-ops-nexus') {
    return currentPath === '/internal-ops-nexus' && !route.query.view
  }
  if (currentPath.startsWith(item.path)) {
    return true
  }
  // پشتیبانی از پارامترهای کوئری قدیمی (Backwards Compatibility)
  if (item.id === 'products' && route.query.view === 'products') return true
  if (item.id === 'orders' && (route.query.view === 'fulfillment' || route.query.view === 'orders')) return true
  if (item.id === 'finance' && route.query.view === 'finance') return true
  if (item.id === 'crm' && route.query.view === 'crm') return true
  if (item.id === 'audit' && route.query.view === 'audit') return true
  return false
}

const navigateToDomain = (item: NavItem) => {
  isMobileSidebarOpen.value = false
  router.push(item.path)
}

const breadcrumb = computed(() => {
  const path = route.path
  if (path === '/internal-ops-nexus/products/new') {
    return 'کاتالوگ پوشاک / افزودن لباس جدید'
  }
  if (path.startsWith('/internal-ops-nexus/products/') && path.endsWith('/edit')) {
    return 'کاتالوگ پوشاک / ویرایش مشخصات کالا'
  }
  if (path === '/internal-ops-nexus/products' || route.query.view === 'products') {
    return 'کاتالوگ پوشاک / لیست محصولات'
  }
  if (path === '/internal-ops-nexus/orders' || route.query.view === 'fulfillment' || route.query.view === 'orders') {
    return 'فروش و مرسوله‌ها / میز سفارش‌ها'
  }
  if (path === '/internal-ops-nexus/finance' || route.query.view === 'finance') {
    return 'امور مالی و تسویه / تراز و درآمد'
  }
  if (path === '/internal-ops-nexus/crm' || route.query.view === 'crm') {
    return 'مشتریان و وفاداری / باشگاه اعضا'
  }
  if (path === '/internal-ops-nexus/audit' || route.query.view === 'audit') {
    return 'امنیت و ممیزی / لاگ رویدادها'
  }
  return 'پیشخوان اصلی / دیده‌بان اجرایی'
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900" dir="rtl">
    <!-- هدر باریک ۵۶ پیکسلی ارگونومیک (Slim Top Header - 56px) -->
    <header class="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-5 flex items-center justify-between shadow-2xs">
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
          <ChevronLeft v-if="!isSidebarCollapsed" class="w-4 h-4" />
          <ChevronRight v-else class="w-4 h-4" />
        </button>

        <!-- مسیر ناوبری (Breadcrumb) -->
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-xs font-black tracking-wider text-slate-900 hidden sm:inline shrink-0">
            کراس • HQ
          </span>
          <span class="text-slate-300 hidden sm:inline">/</span>
          <span class="text-xs font-medium text-slate-600 truncate">
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
            <span>جست‌وجوی سریع در سیستم...</span>
          </div>
          <kbd class="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-600 font-bold shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      <!-- سمت چپ: وضعیت اتصال، اعلان‌ها و پروفایل فشرده -->
      <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <!-- ضربان سرور و وضعیت اتصال -->
        <div
          data-testid="server-heartbeat-badge"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-mono font-bold shadow-2xs tabular-nums"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Activity class="w-3 h-3 text-emerald-600" />
          <span class="text-[11px] whitespace-nowrap">وضعیت سرور: آنلاین و پایدار</span>
        </div>

        <!-- آیکون زنگوله اعلان‌ها -->
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
          title="قفل جلسه کاری و خروج امن"
          @click="handleLockSession"
        >
          <Lock class="w-3.5 h-3.5 text-rose" />
          <span class="hidden sm:inline">قفل جلسه</span>
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
              <span class="text-[11px] font-bold text-slate-800 block leading-tight">مدیریت ارشد</span>
              <span class="text-[9px] text-slate-500 font-mono block">SUPER_ADMIN</span>
            </div>
          </button>

          <!-- پس‌زمینه شفاف جهت بستن منو با کلیک در بیرون -->
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
              <span>مشاهده فروشگاه</span>
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

    <div class="flex-1 flex overflow-hidden">
      <!-- سایدبار ثابت راست ۲۴۰ پیکسلی (Fixed Right Sidebar - 240px) -->
      <aside
        class="hidden lg:flex flex-col border-s border-slate-200/80 bg-white transition-all duration-200 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]"
        :class="isSidebarCollapsed ? 'w-[72px]' : 'w-60'"
      >
        <!-- عنوان سایدبار -->
        <div class="p-3 border-b border-slate-200/80 flex items-center justify-between">
          <span v-if="!isSidebarCollapsed" class="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider">
            دامنه‌های اصلی کسب‌وکار
          </span>
          <span v-else class="text-[10px] font-mono font-bold text-slate-400 mx-auto">
            HQ
          </span>
        </div>

        <!-- ناوبری عمودی ۶ دامنه اصلی -->
        <nav class="flex-1 p-2.5 space-y-1.5 overflow-y-auto">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
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
          </button>
        </nav>

        <!-- بخش پایین سایدبار: پیوند به فروشگاه و قفل جلسه -->
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
            class="w-full rounded-xl transition-all flex items-center text-rose hover:bg-rose-50 p-2 text-xs font-bold cursor-pointer"
            :class="isSidebarCollapsed ? 'justify-center' : 'gap-2'"
            title="قفل جلسه کاری"
            @click="handleLockSession"
          >
            <Lock class="w-4 h-4 shrink-0" />
            <span v-if="!isSidebarCollapsed">قفل جلسه</span>
          </button>
        </div>
      </aside>

      <!-- دراور موبایل برای سایدبار -->
      <div
        v-if="isMobileSidebarOpen"
        class="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex"
        @click.self="isMobileSidebarOpen = false"
      >
        <div class="w-64 bg-white h-full border-s border-slate-200 flex flex-col p-4 space-y-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <span class="text-xs font-bold text-slate-900">مرکز فرماندهی آتلیه کراس</span>
            <button
              type="button"
              class="p-1 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
              @click="isMobileSidebarOpen = false"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <nav class="flex-1 space-y-1.5 overflow-y-auto">
            <button
              v-for="item in navItems"
              :key="item.id"
              type="button"
              class="w-full px-3 py-2.5 rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-start"
              :class="isItemActive(item) ? 'bg-ink text-white font-bold' : 'text-slate-600 hover:bg-slate-100 font-medium'"
              @click="navigateToDomain(item)"
            >
              <component :is="item.icon" class="w-4 h-4 shrink-0" />
              <span class="text-xs flex-1">{{ item.title }}</span>
              <span v-if="item.badge" class="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-slate-100 text-slate-700">
                {{ item.badge }}
              </span>
            </button>
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
              <span>قفل جلسه کاری</span>
            </button>
          </div>
        </div>
      </div>

      <!-- بوم اصلی و فضای کاری (Workspace Area) -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 min-w-0 font-sans">
        <slot />
      </main>
    </div>

    <!-- پالت دستورات سراسری ⌘K -->
    <OpsCommandPalette v-model:open="isCommandPaletteOpen" @navigate="path => router.push(path)" />
  </div>
</template>
