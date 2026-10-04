<!-- frontend/app/pages/internal-ops-nexus/audit/index.vue -->
<script setup lang="ts">
import { Search, Download, KeyRound, Lock } from '@lucide/vue'
import { useOpsAudit } from '~/composables/ops/useOpsAudit'
import OpsDomainSubNav from '~/components/ops/common/OpsDomainSubNav.vue'
import OpsAuditTable from '~/components/ops/auth/OpsAuditTable.vue'

definePageMeta({
  layout: 'ops',
  middleware: ['ops-guard'],
})

useSeoMeta({ title: 'امنیت و ممیزی | مرکز عملیات کراس', robots: 'noindex, nofollow' })

const activeSubTab = ref<'logs' | 'security'>('logs')
const subNavTabs = [
  { id: 'logs', label: 'دفتر کل لاگ‌های ممیزی' },
  { id: 'security', label: 'تنظیمات امنیت و نشست‌ها' },
]

const {
  searchQuery,
  selectedSeverity,
  filteredLogs,
  exportAuditCsv,
} = useOpsAudit()

const is2FaOpen = ref(false)
const isSessionsOpen = ref(false)
</script>

<template>
  <div class="space-y-4 max-w-7xl mx-auto font-sans" data-testid="nexus-audit-view">
    <!-- تب‌های افقی سطح دوم ناوبری امنیت (44px) -->
    <OpsDomainSubNav v-model="activeSubTab" :tabs="subNavTabs" />

    <!-- بخش اول: دفتر ممیزی لاگ‌ها -->
    <div v-if="activeSubTab === 'logs'" class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 class="text-lg font-black text-slate-900 tracking-tight">
            دفتر ممیزی و ردیابی عملیات حساس (Audit Trail)
          </h1>
          <p class="text-xs text-slate-500 mt-0.5">
            ثبت غیرقابل‌دستکاری تغییرات قیمت، وضعیت سفارشات، انتقال‌های انبار و رویدادهای امنیتی
          </p>
        </div>

        <button
          type="button"
          class="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="exportAuditCsv"
        >
          <Download class="w-4 h-4 text-slate-500" />
          <span>خروجی لاگ‌ها (CSV)</span>
        </button>
      </div>

      <!-- فیلترها و جست‌وجوی لاگ -->
      <div class="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div class="relative w-full sm:w-80">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جستجو در لاگ‌ها، اپراتور یا هدف..."
            class="w-full h-9 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-ink outline-hidden"
          >
          <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5" />
        </div>

        <div class="flex items-center gap-2">
          <select
            v-model="selectedSeverity"
            class="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 outline-hidden"
          >
            <option value="all">همه سطوح حساسیت</option>
            <option value="info">عادی (Info)</option>
            <option value="warning">هشدار (Warning)</option>
            <option value="critical">بحرانی (Critical)</option>
          </select>
        </div>
      </div>

      <!-- جدول جامع لاگ‌های ممیزی -->
      <OpsAuditTable :logs="filteredLogs" />
    </div>

    <!-- بخش دوم: تنظیمات امنیت و احراز هویت -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div class="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <KeyRound class="w-4 h-4 text-amber-600" />
          <span>احراز هویت دومرحله‌ای (2FA TOTP)</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          برای دسترسی به تغییرات قیمت عمده و خروجی‌های مالی، فعال‌سازی کلید سخت‌افزاری یا اپلیکیشن رمزساز اجباری است.
        </p>
        <button
          type="button"
          class="h-9 px-4 rounded-xl bg-ink text-white text-xs font-bold hover:bg-ink/90 cursor-pointer"
          @click="is2FaOpen = true"
        >
          تنظیم مجدد کلید دومرحله‌ای
        </button>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-4">
        <div class="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Lock class="w-4 h-4 text-purple-600" />
          <span>پایش نشست‌های فعال (Session Sentinel)</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          بررسی دستگاه‌ها و مرورگرهای متصل به پنل مدیریت ارشد و خاتمه دادن به نشست‌های مشکوک یا منقضی‌شده.
        </p>
        <button
          type="button"
          class="h-9 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
          @click="isSessionsOpen = true"
        >
          مدیریت نشست‌های فعال
        </button>
      </div>
    </div>

    <!-- مودال‌های امنیتی -->
    <LazyOpsTwoFactorModal v-model:open="is2FaOpen" />
    <LazyOpsSessionSentinelModal v-model:open="isSessionsOpen" />
  </div>
</template>
