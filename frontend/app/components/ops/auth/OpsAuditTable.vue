<!-- frontend/app/components/ops/auth/OpsAuditTable.vue -->
<script setup lang="ts">
import type { OpsAuditEntry } from '~/composables/ops/useOpsAudit'

defineProps<{
  logs: OpsAuditEntry[]
}>()

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
  <div class="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden font-sans">
    <div class="overflow-x-auto">
      <table class="w-full text-start text-xs">
        <thead class="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold">
          <tr>
            <th class="p-3 text-start">زمان و اپراتور</th>
            <th class="p-3 text-start">عملیات</th>
            <th class="p-3 text-start">هدف</th>
            <th class="p-3 text-start">جزئیات و تغییرات</th>
            <th class="p-3 text-end">سطح</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="log in logs"
            :key="log.id"
            class="hover:bg-slate-50/70 transition-colors"
          >
            <td class="p-3">
              <span class="font-bold text-slate-900 block">{{ log.operatorName }}</span>
              <span class="text-[10px] text-slate-400 font-mono block mt-0.5">{{ log.timestamp }}</span>
            </td>
            <td class="p-3">
              <span class="font-bold text-slate-800 block">{{ log.actionTitle }}</span>
              <span class="text-[10px] text-slate-400 font-mono block mt-0.5">{{ log.action }}</span>
            </td>
            <td class="p-3 font-mono text-[11px] text-slate-600">
              {{ log.targetId }}
            </td>
            <td class="p-3">
              <p class="text-slate-700 max-w-md">{{ log.details }}</p>
              <div v-if="log.diff" class="mt-1 text-[10px] font-mono text-slate-500 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                <span class="text-rose">قبل: {{ log.diff.before }}</span>
                <span class="mx-1">←</span>
                <span class="text-emerald-700">بعد: {{ log.diff.after }}</span>
              </div>
            </td>
            <td class="p-3 text-end">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] border font-bold"
                :class="getSeverityClass(log.severity)"
              >
                {{ log.severity }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
