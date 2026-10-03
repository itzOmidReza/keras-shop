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
} from '@lucide/vue'
import { useAuthStore } from '~/stores/auth'
import { toFa } from '~/utils/format'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const isSidebarCollapsed = ref(false)
const isMobileSidebarOpen = ref(false)

const currentView = computed(() => {
  const v = route.query.view as string
  if (['analytics', 'fulfillment', 'inventory', 'vouchers', 'crm'].includes(v)) {
    return v
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

const navItems = [
  {
    id: 'analytics',
    title: 'دیده‌بان کل و تحلیل مالی',
    subtitle: 'گردش مالی، سود خالص و AOV',
    icon: TrendingUp,
  },
  {
    id: 'fulfillment',
    title: 'میز مدیریت سفارش‌ها',
    subtitle: 'توزیع و صدور بارکد پست',
    icon: Truck,
  },
  {
    id: 'inventory',
    title: 'انبارداری و ماتریس سایز',
    subtitle: 'موجودی S, M, L و هشدارهای کسری',
    icon: Boxes,
  },
  {
    id: 'vouchers',
    title: 'کمپین‌ها و کدهای تخفیف',
    subtitle: 'مدیریت کوپن‌ها و سقف مصرف',
    icon: TicketPercent,
  },
  {
    id: 'crm',
    title: 'باشگاه مشتریان و CRM',
    subtitle: 'دسته‌بندی و ارزش سبد مشتریان',
    icon: Users,
  },
]
</script>

<template>
  <div class="min-h-screen bg-ops-dark text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-300" dir="rtl">
    <!-- هدر سراسری مرکز فرماندهی (Top Ops Header) -->
    <header class="h-16 border-b border-ops-border bg-ops-surface/90 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- دکمه منوی موبایل -->
        <button
          type="button"
          class="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          aria-label="منوی عملیات"
          @click="isMobileSidebarOpen = !isMobileSidebarOpen"
        >
          <Menu v-if="!isMobileSidebarOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>

        <!-- نشان تجاری محرمانه آتلیه -->
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-2xs">
            <ShieldAlert class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-black tracking-wider text-white">کراس • استودیو مد</span>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                HQ NEXUS
              </span>
            </div>
            <p class="text-[10px] text-slate-400 hidden sm:block">مرکز فرماندهی، نظارت مالی و مدیریت زنجیره تامین</p>
          </div>
        </div>
      </div>

      <!-- مانیتور ضربان سرور و ساعت زنده -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- ضربان سرور -->
        <div class="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] sm:text-xs font-mono font-bold shadow-2xs">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Activity class="w-3.5 h-3.5" />
          <span>وضعیت سرور: آنلاین و پایدار</span>
          <span class="text-emerald-500/60 font-mono text-[10px] hidden sm:inline">(18ms)</span>
        </div>

        <!-- ساعت زنده ایران/شمسی -->
        <div class="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold shadow-2xs">
          <span class="text-slate-400 text-[11px]">۱۴۰۵/۰۷/۱۲ •</span>
          <span>{{ liveTime }}</span>
        </div>
      </div>

      <!-- بخش کاربر ارشد و قفل جلسه -->
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="hidden sm:flex items-center gap-2 ps-3 pe-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
          <div class="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[11px]">
            مد
          </div>
          <div class="text-start">
            <span class="text-[11px] font-bold text-slate-200 block leading-tight">مدیریت ارشد آتلیه</span>
            <span class="text-[9px] text-amber-400/90 font-mono block">SUPER_ADMIN</span>
          </div>
        </div>

        <button
          type="button"
          data-testid="ops-lock-btn"
          class="h-9 px-3 rounded-xl bg-slate-900 hover:bg-rose/20 text-slate-300 hover:text-rose border border-slate-800 hover:border-rose/30 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="قفل جلسه کاری و خروج امن"
          @click="handleLockSession"
        >
          <Lock class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">قفل جلسه کاری</span>
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <!-- سایدبار دسکتاپ تاشو (Collapsible Desktop Sidebar) -->
      <aside
        class="hidden lg:flex flex-col border-s border-ops-border bg-ops-surface transition-all duration-300 shrink-0 sticky top-16 h-[calc(100vh-4rem)]"
        :class="isSidebarCollapsed ? 'w-20' : 'w-72'"
      >
        <!-- دکمه جمع/باز کردن سایدبار -->
        <div class="p-3 border-b border-ops-border flex items-center justify-between">
          <span v-if="!isSidebarCollapsed" class="text-xs font-bold text-slate-400 px-2">
            میزهای عملیاتی
          </span>
          <button
            type="button"
            data-testid="sidebar-toggle-btn"
            class="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer ms-auto"
            :title="isSidebarCollapsed ? 'گسترش منو' : 'جمع کردن منو'"
            @click="isSidebarCollapsed = !isSidebarCollapsed"
          >
            <ChevronLeft v-if="!isSidebarCollapsed" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
        </div>

        <!-- فهرست ناوبری میزها -->
        <nav class="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            :data-testid="`ops-nav-${item.id}`"
            class="w-full rounded-xl transition-all flex items-center cursor-pointer group text-start"
            :class="[
              currentView === item.id
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-2xs font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent font-medium',
              isSidebarCollapsed ? 'justify-center p-3' : 'px-3.5 py-3 gap-3',
            ]"
            @click="switchView(item.id)"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 shrink-0 transition-colors"
              :class="currentView === item.id ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'"
            />
            <div v-if="!isSidebarCollapsed" class="min-w-0 flex-1">
              <span class="text-xs block truncate leading-tight">{{ item.title }}</span>
              <span class="text-[10px] text-slate-400 block truncate mt-0.5 leading-tight">{{ item.subtitle }}</span>
            </div>
          </button>
        </nav>

        <!-- بخش پایین سایدبار: پیوند به فروشگاه و خروج -->
        <div class="p-3 border-t border-ops-border space-y-1.5 bg-slate-950/40">
          <NuxtLink
            to="/"
            target="_blank"
            class="w-full rounded-xl transition-all flex items-center text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent p-2.5 text-xs font-bold cursor-pointer"
            :class="isSidebarCollapsed ? 'justify-center' : 'gap-2.5'"
            title="مشاهده ویترین فروشگاه"
          >
            <ExternalLink class="w-4 h-4 shrink-0 text-slate-400" />
            <span v-if="!isSidebarCollapsed">مشاهده فروشگاه</span>
          </NuxtLink>

          <button
            type="button"
            class="w-full rounded-xl transition-all flex items-center text-rose hover:bg-rose/15 border border-transparent p-2.5 text-xs font-bold cursor-pointer"
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
        class="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex"
        @click.self="isMobileSidebarOpen = false"
      >
        <div class="w-72 bg-ops-surface h-full border-s border-ops-border flex flex-col p-4 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-ops-border">
            <span class="text-xs font-bold text-white">میزهای فرماندهی کراس</span>
            <button
              type="button"
              class="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              @click="isMobileSidebarOpen = false"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <nav class="flex-1 space-y-1.5 overflow-y-auto">
            <button
              v-for="item in navItems"
              :key="item.id"
              type="button"
              class="w-full px-3.5 py-3 rounded-xl transition-all flex items-center gap-3 cursor-pointer text-start"
              :class="currentView === item.id ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:bg-slate-900 font-medium'"
              @click="switchView(item.id)"
            >
              <component :is="item.icon" class="w-5 h-5 shrink-0" />
              <div>
                <span class="text-xs block leading-tight">{{ item.title }}</span>
                <span class="text-[10px] text-slate-400 block mt-0.5 leading-tight">{{ item.subtitle }}</span>
              </div>
            </button>
          </nav>

          <div class="pt-3 border-t border-ops-border space-y-2">
            <NuxtLink
              to="/"
              class="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-slate-300 hover:bg-slate-900"
            >
              <ExternalLink class="w-4 h-4" />
              <span>مشاهده فروشگاه</span>
            </NuxtLink>
            <button
              type="button"
              class="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs text-rose hover:bg-rose/15 font-bold"
              @click="handleLockSession"
            >
              <Lock class="w-4 h-4" />
              <span>قفل جلسه کاری</span>
            </button>
          </div>
        </div>
      </div>

      <!-- محتوای اصلی (Main Canvas) -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>
