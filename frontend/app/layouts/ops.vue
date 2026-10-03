<!-- frontend/app/layouts/ops.vue -->
<script setup lang="ts">
import {
  TrendingUp,
  Truck,
  Boxes,
  TicketPercent,
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
  FileText,
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { toFa } from '~/utils/format'

import type { Component } from 'vue'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const currentView = computed(() => {
  const v = route.query.view as string
  if (['analytics', 'products', 'fulfillment', 'inventory', 'orders', 'finance', 'articles', 'vouchers', 'crm'].includes(v)) {
    return v === 'orders' ? 'fulfillment' : v
  }
  return 'analytics'
})

const switchView = (view: string) => {
  isMobileSidebarOpen.value = false
  router.push({ path: '/internal-ops-nexus', query: { view } })
}

const handleLockSession = () => {
  authStore.logout()
  navigateTo('/')
}

// ساعت زنده شمسی
const liveTime = ref('')

const updateLiveTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  liveTime.value = `${toFa(hours)}:${toFa(minutes)}:${toFa(seconds)}`
}

let clockInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateLiveTime()
  clockInterval = setInterval(updateLiveTime, 1000)
})

onUnmounted(() => {
  if (clockInterval) {
    clearInterval(clockInterval)
  }
})

interface NavSection {
  groupTitle: string
  items: {
    id: string
    title: string
    subtitle: string
    icon: Component
    badge?: string
  }[]
}

const navSections: NavSection[] = [
  {
    groupTitle: 'کاتالوگ و انبارداری',
    items: [
      {
        id: 'products',
        title: 'مدیریت محصولات',
        subtitle: 'تعریف کالا، قیمت و متغیرها',
        icon: Package,
      },
      {
        id: 'inventory',
        title: 'ماتریس انبار و سایز',
        subtitle: 'موجودی S, M, L و هشدارهای کسری',
        icon: Boxes,
      },
    ],
  },
  {
    groupTitle: 'فروش و سفارشات',
    items: [
      {
        id: 'fulfillment',
        title: 'میز سفارش‌ها و ارسال',
        subtitle: 'پردازش، ثبت دستی و بارکد پست',
        icon: Truck,
      },
      {
        id: 'vouchers',
        title: 'کمپین‌ها و کدهای تخفیف',
        subtitle: 'مدیریت کوپن‌ها و سقف مصرف',
        icon: TicketPercent,
      },
    ],
  },
  {
    groupTitle: 'امور مالی و حسابداری',
    items: [
      {
        id: 'finance',
        title: 'امور مالی و شاپرک',
        subtitle: 'دفتر کل، کارمزد و تسویه',
        icon: CreditCard,
      },
    ],
  },
  {
    groupTitle: 'محتوا و ژورنال',
    items: [
      {
        id: 'articles',
        title: 'مدیریت ژورنال و مقالات',
        subtitle: 'نگارش و انتشار محتوا',
        icon: FileText,
      },
    ],
  },
  {
    groupTitle: 'دیده‌بان و اعضا',
    items: [
      {
        id: 'analytics',
        title: 'دیده‌بان اجرایی',
        subtitle: 'گردش مالی، سود خالص و AOV',
        icon: TrendingUp,
      },
      {
        id: 'crm',
        title: 'باشگاه مشتریان و CRM',
        subtitle: 'دسته‌بندی و ارزش سبد مشتریان',
        icon: Users,
      },
    ],
  },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900" dir="rtl">
    <!-- هدر سراسری مرکز فرماندهی (Top Ops Header - Clean Light) -->
    <header class="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between shadow-2xs">
      <div class="flex items-center gap-3">
        <!-- دکمه منوی موبایل -->
        <button
          type="button"
          class="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 cursor-pointer"
          aria-label="منوی عملیات"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <Menu v-if="!isMobileSidebarOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>

        <!-- نشان تجاری آتلیه -->
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-ink/5 border border-ink/10 flex items-center justify-center text-ink shadow-2xs">
            <ShieldAlert class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black tracking-wider text-slate-900">کراس • استودیو مد</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                HQ NEXUS
              </span>
            </div>
            <p class="text-[10px] text-slate-500 hidden sm:block">مرکز فرماندهی، نظارت مالی و مدیریت زنجیره تامین</p>
          </div>
        </div>
      </div>

      <!-- مانیتور ضربان سرور و ساعت زنده -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- ضربان سرور (Exact Text Preserved) -->
        <div
          data-testid="server-heartbeat-badge"
          class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-mono font-bold shadow-2xs"
        >
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Activity class="w-3.5 h-3.5 text-emerald-600" />
          <span>وضعیت سرور: آنلاین و پایدار</span>
          <span class="text-emerald-600/70 font-mono text-[10px] hidden sm:inline">(18ms)</span>
        </div>

        <!-- ساعت زنده ایران/شمسی -->
        <div class="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-mono font-bold shadow-2xs">
          <span class="text-slate-400 text-[11px]">۱۴۰۵/۰۷/۱۲ •</span>
          <span>{{ liveTime }}</span>
        </div>
      </div>

      <!-- بخش کاربر ارشد و قفل جلسه -->
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="hidden sm:flex items-center gap-2 ps-3 pe-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs">
          <div class="w-6 h-6 rounded-full bg-ink/10 text-ink flex items-center justify-center font-bold text-[11px]">
            مد
          </div>
          <div class="text-start">
            <span class="text-[11px] font-bold text-slate-800 block leading-tight">مدیریت ارشد آتلیه</span>
            <span class="text-[9px] text-slate-500 font-mono block">SUPER_ADMIN</span>
          </div>
        </div>

        <button
          type="button"
          data-testid="ops-lock-btn"
          class="h-9 px-3 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose border border-slate-200 hover:border-rose/30 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="قفل جلسه کاری و خروج امن"
          @click="handleLockSession"
        >
          <Lock class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">قفل جلسه کاری</span>
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- سایدبار دسکتاپ تاشو (Collapsible Desktop Sidebar - Clean Light) -->
      <aside
        class="hidden lg:flex flex-col border-s border-slate-200 bg-white transition-all duration-300 shrink-0 sticky top-16 h-[calc(100vh-4rem)]"
        :class="isSidebarCollapsed ? 'w-20' : 'w-72'"
      >
        <!-- دکمه جمع/باز کردن سایدبار -->
        <div class="p-3 border-b border-slate-200 flex items-center justify-between">
          <span v-if="!isSidebarCollapsed" class="text-xs font-bold text-slate-500 px-2">
            میزهای عملیاتی آتلیه
          </span>
          <button
            type="button"
            data-testid="sidebar-toggle-btn"
            class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer ms-auto"
            :title="isSidebarCollapsed ? 'گسترش منو' : 'جمع کردن منو'"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
          >
            <ChevronLeft v-if="!isSidebarCollapsed" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- فهرست ناوبری گروه‌بندی‌شده -->
        <nav class="flex-1 p-3 space-y-4 overflow-y-auto">
          <div v-for="section in navSections" :key="section.groupTitle" class="space-y-1">
            <span
              v-if="!isSidebarCollapsed"
              class="text-[10px] font-bold text-slate-400 px-3 py-1 block uppercase tracking-wider"
            >
              {{ section.groupTitle }}
            </span>
            <button
              v-for="item in section.items"
              :key="item.id"
              type="button"
              :data-testid="`ops-nav-${item.id}`"
              class="w-full rounded-xl transition-all flex items-center cursor-pointer group text-start"
              :class="[
                currentView === item.id
                  ? 'bg-ink text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent font-medium',
                isSidebarCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3',
              ]"
              @click="switchView(item.id)"
            >
              <component
                :is="item.icon"
                class="w-4.5 h-4.5 shrink-0 transition-colors"
                :class="currentView === item.id ? 'text-amber-300' : 'text-slate-500 group-hover:text-slate-800'"
              />
              <div v-if="!isSidebarCollapsed" class="min-w-0 flex-1">
                <span class="text-xs block truncate leading-tight">{{ item.title }}</span>
                <span
                  class="text-[10px] block truncate mt-0.5 leading-tight"
                  :class="currentView === item.id ? 'text-white/80' : 'text-slate-400'"
                >
                  {{ item.subtitle }}
                </span>
              </div>
            </button>
          </div>
        </nav>

        <!-- بخش پایین سایدبار: پیوند به فروشگاه و خروج -->
        <div class="p-3 border-t border-slate-200 space-y-1.5 bg-slate-50/50">
          <NuxtLink
            to="/"
            target="_blank"
            class="w-full rounded-xl transition-all flex items-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent p-2.5 text-xs font-bold cursor-pointer"
            :class="isSidebarCollapsed ? 'justify-center' : 'gap-2.5'"
            title="مشاهده ویترین فروشگاه"
          >
            <ExternalLink class="w-4 h-4 shrink-0 text-slate-500" />
            <span v-if="!isSidebarCollapsed">مشاهده فروشگاه</span>
          </NuxtLink>

          <button
            type="button"
            class="w-full rounded-xl transition-all flex items-center text-rose hover:bg-rose-50 border border-transparent p-2.5 text-xs font-bold cursor-pointer"
            :class="isSidebarCollapsed ? 'justify-center' : 'gap-2.5'"
            title="قفل جلسه کاری"
            @click="handleLockSession"
          >
            <Lock class="w-4 h-4 shrink-0" />
            <span v-if="!isSidebarCollapsed">قفل جلسه کاری</span>
          </button>
        </div>
      </aside>

      <!-- دراور موبایل برای سایدبار -->
      <div
        v-if="isMobileSidebarOpen"
        class="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex"
        @click.self="isMobileSidebarOpen = false"
      >
        <div class="w-72 bg-white h-full border-s border-slate-200 flex flex-col p-4 space-y-4 shadow-xl">
          <div class="flex items-center justify-between pb-3 border-b border-slate-200">
            <span class="text-xs font-bold text-slate-900">میزهای فرماندهی کراس</span>
            <button
              type="button"
              class="p-1 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
              @click="isMobileSidebarOpen = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="flex-1 space-y-3 overflow-y-auto">
            <div v-for="section in navSections" :key="section.groupTitle" class="space-y-1">
              <span class="text-[10px] font-bold text-slate-400 px-3 py-0.5 block uppercase tracking-wider">
                {{ section.groupTitle }}
              </span>
              <button
                v-for="item in section.items"
                :key="item.id"
                type="button"
                class="w-full px-3 py-2.5 rounded-xl transition-all flex items-center gap-3 cursor-pointer text-start"
                :class="currentView === item.id ? 'bg-ink text-white font-bold' : 'text-slate-600 hover:bg-slate-100 font-medium'"
                @click="switchView(item.id)"
              >
                <component :is="item.icon" class="w-4.5 h-4.5 shrink-0" />
                <div>
                  <span class="text-xs block leading-tight">{{ item.title }}</span>
                  <span
                    class="text-[10px] block mt-0.5 leading-tight"
                    :class="currentView === item.id ? 'text-white/80' : 'text-slate-400'"
                  >
                    {{ item.subtitle }}
                  </span>
                </div>
              </button>
            </div>
          </nav>

          <div class="pt-3 border-t border-slate-200 space-y-2">
            <NuxtLink
              to="/"
              class="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-slate-700 hover:bg-slate-100"
            >
              <ExternalLink class="w-4 h-4" />
              <span>مشاهده فروشگاه</span>
            </NuxtLink>
            <button
              type="button"
              class="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-rose hover:bg-rose-50 font-bold"
              @click="handleLockSession"
            >
              <Lock class="w-4 h-4" />
              <span>قفل جلسه کاری</span>
            </button>
          </div>
        </div>
      </div>

      <!-- محتوای اصلی (Main Canvas - Clean Slate 50) -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>
