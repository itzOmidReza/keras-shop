<!-- frontend/app/components/ops/auth/OpsAuditTrailTable.vue -->
<script setup lang="ts">
import { History, Search, Download, ArrowLeftRight, X } from '@lucide/vue'
import { useOpsAudit } from '~/composables/ops/useOpsAudit'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const {
  searchQuery,
  selectedSeverity,
  filteredLogs,
  exportAuditCsv,
} = useOpsAudit()

const getSeverityClass = (sev: string) => {
  switch (sev) {
    case 'critical':
      return 'bg-rose/10 text-rose border-rose/30 font-bold'
    case 'warning':
      return 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200'
  }
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- هدر -->
      <div class="p-5 border-b border-sand flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-sand/40 text-ink flex items-center justify-center">
            <History class="w-4 h-4 text-rose" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">دفتر ممیزی و ردیابی عملیات حساس (Audit Trail)</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">ثبت غیرقابل‌دستکاری تغییرات قیمت، وضعیت سفارشات و امنیت</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg border border-sand bg-paper hover:bg-sand/30 text-ink text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            @click="exportAuditCsv"
          >
            <Download class="w-3.5 h-3.5 text-rose" />
            <span>خروجی CSV</span>
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:text-ink cursor-pointer p-1"
            @click="emit('update:open', false)"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- نوار جست‌وجو و فیلتر شدت -->
      <div class="p-4 border-b border-sand/60 bg-paper/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div class="relative flex-1 min-w-56">
          <Search class="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="جست‌وجو بر اساس شناسه سفارش، نام اپراتور، شرح..."
            class="w-full h-9 ps-9 pe-3 rounded-xl border border-sand bg-white text-xs text-ink focus:outline-hidden focus:border-ink"
          >
        </div>

        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-2xs text-muted-foreground">فیلتر شدت:</span>
          <button
            v-for="sev in [
              { id: 'all', label: 'همه' },
              { id: 'info', label: 'عادی' },
              { id: 'warning', label: 'هشدار' },
              { id: 'critical', label: 'بحرانی' },
            ]"
            :key="sev.id"
            type="button"
            class="px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="selectedSeverity === sev.id ? 'bg-ink text-paper' : 'bg-sand/30 text-ink hover:bg-sand/60'"
            @click="selectedSeverity = sev.id"
          >
            {{ sev.label }}
          </button>
        </div>
      </div>

      <!-- جدول لاگ‌ها -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="border border-sand/80 rounded-xl overflow-hidden shadow-2xs">
          <table class="w-full text-xs text-start">
            <thead class="bg-sand/30 text-muted-foreground font-bold border-b border-sand/80 text-2xs">
              <tr>
                <th class="p-3 text-start">شناسه / زمان</th>
                <th class="p-3 text-start">اپراتور</th>
                <th class="p-3 text-start">عملیات</th>
                <th class="p-3 text-start">شناسه هدف</th>
                <th class="p-3 text-start">شدت</th>
                <th class="p-3 text-start">شرح و متادیتا</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-sand/50">
              <tr v-for="log in filteredLogs" :key="log.id" class="hover:bg-sand/10 transition-colors">
                <td class="p-3 font-mono text-2xs text-ink">
                  <div class="font-bold">{{ log.id }}</div>
                  <div class="text-muted-foreground">{{ log.timestamp }}</div>
                </td>
                <td class="p-3 font-medium text-ink">
                  {{ log.operatorName }}
                </td>
                <td class="p-3">
                  <span class="font-bold text-ink block">{{ log.actionTitle }}</span>
                  <span class="text-2xs font-mono text-muted-foreground">{{ log.action }}</span>
                </td>
                <td class="p-3 font-mono text-2xs text-ink">
                  {{ log.targetId }}
                </td>
                <td class="p-3">
                  <span class="inline-block px-2 py-0.5 rounded-full text-[10px] border" :class="getSeverityClass(log.severity)">
                    {{ log.severity === 'critical' ? 'بحرانی' : log.severity === 'warning' ? 'هشدار' : 'عادی' }}
                  </span>
                </td>
                <td class="p-3 max-w-xs">
                  <p class="text-slate-700 text-2xs leading-relaxed">{{ log.details }}</p>
                  <div v-if="log.diff" class="mt-1 p-1.5 rounded bg-sand/30 border border-sand/60 text-[10px] font-mono flex items-center gap-1.5 text-slate-800">
                    <span class="text-rose line-through truncate max-w-32">{{ log.diff.before }}</span>
                    <ArrowLeftRight class="w-3 h-3 text-slate-500 shrink-0" />
                    <span class="text-emerald-700 font-bold truncate max-w-32">{{ log.diff.after }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- فوتر -->
      <div class="p-3 bg-sand/10 border-t border-sand flex items-center justify-between text-2xs text-muted-foreground shrink-0">
        <span>مجموع رخدادهای منطبق: {{ filteredLogs.length }} مورد</span>
        <button
          type="button"
          class="h-7 px-3 rounded-lg bg-ink text-paper text-2xs font-bold hover:bg-ink/90 cursor-pointer"
          @click="emit('update:open', false)"
        >
          بستن دفتر ممیزی
        </button>
      </div>
    </div>
  </div>
</template>
