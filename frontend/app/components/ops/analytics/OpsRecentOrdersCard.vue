<!-- frontend/app/components/ops/analytics/OpsRecentOrdersCard.vue -->
<script setup lang="ts">
import { ArrowLeft, Clock } from '@lucide/vue'
import { formatToman } from '~/utils/format'
import { useOpsOrders } from '~/composables/ops/useOpsOrders'

const router = useRouter()
const { ordersList, getStatusBadge } = useOpsOrders()

const recentOrders = computed(() => {
  return ordersList.value.slice(0, 5)
})
</script>

<template>
  <div class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs font-sans">
    <div class="flex items-center justify-between pb-3 border-b border-slate-100">
      <div class="flex items-center gap-2">
        <Clock class="w-4 h-4 text-slate-500" />
        <h3 class="text-sm font-bold text-slate-900">
          آخرین سفارش‌های نیازمند اقدام فوری
        </h3>
      </div>
      <button
        type="button"
        class="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
        @click="router.push('/internal-ops-nexus/orders')"
      >
        <span>مشاهده همه</span>
        <ArrowLeft class="w-3.5 h-3.5" />
      </button>
    </div>

    <div class="overflow-x-auto mt-3">
      <table class="w-full text-start text-xs">
        <thead class="text-slate-500 font-medium">
          <tr>
            <th class="py-2 text-start">شماره سفارش</th>
            <th class="py-2 text-start">مشتری</th>
            <th class="py-2 text-start">مبلغ کل</th>
            <th class="py-2 text-start">وضعیت</th>
            <th class="py-2 text-end">اقدام</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr
            v-for="order in recentOrders"
            :key="order.orderNumber"
            class="hover:bg-slate-50/70 transition-colors"
          >
            <td class="py-2.5 font-mono text-slate-800 font-bold tabular-nums">
              {{ order.orderNumber }}
            </td>
            <td class="py-2.5 text-slate-700 font-bold">
              {{ order.recipientName }}
            </td>
            <td class="py-2.5 font-mono tabular-nums text-slate-900">
              {{ formatToman(order.totalAmount) }} تومان
            </td>
            <td class="py-2.5">
              <span
                class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                :class="getStatusBadge(order.status).class"
              >
                {{ getStatusBadge(order.status).label }}
              </span>
            </td>
            <td class="py-2.5 text-end">
              <button
                type="button"
                class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                @click="router.push('/internal-ops-nexus/orders')"
              >
                بررسی
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
