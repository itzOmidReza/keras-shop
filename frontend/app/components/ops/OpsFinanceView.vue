<script setup lang="ts">
import { Download, Printer } from '@lucide/vue'

const {
  financeDateRange,
  transactionsList,
  financialKpis,
  exportFinanceCsv,
  printFinanceSummary,
} = useOpsFinance()
</script>

<template>
  <section data-testid="nexus-finance-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          دفتر کل مالی و تسویه شاپرک
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          تراز مالی، کارمزدهای شاپرک، تخفیف‌های جذب‌شده و اسناد تسویه بانکی
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          data-testid="export-finance-csv-btn"
          class="h-9 px-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="exportFinanceCsv"
        >
          <Download class="w-4 h-4 text-slate-500" />
          <span>خروجی اکسل (CSV)</span>
        </button>
        <button
          type="button"
          data-testid="print-finance-summary-btn"
          class="h-9 px-3.5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="printFinanceSummary"
        >
          <Printer class="w-4 h-4" />
          <span>چاپ ترازنامه</span>
        </button>
      </div>
    </div>

    <!-- بازه زمانی و فیلترها -->
    <div class="flex items-center gap-1.5 bg-white border border-slate-200/80 p-2 rounded-2xl shadow-xs w-fit">
      <button
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
        :class="financeDateRange === 'today' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
        @click="financeDateRange = 'today'"
      >
        امروز
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
        :class="financeDateRange === 'week' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
        @click="financeDateRange = 'week'"
      >
        ۷ روز گذشته
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
        :class="financeDateRange === 'month' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
        @click="financeDateRange = 'month'"
      >
        این ماه
      </button>
      <button
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
        :class="financeDateRange === 'all' ? 'bg-ink text-white' : 'text-slate-600 hover:bg-slate-100'"
        @click="financeDateRange = 'all'"
      >
        کل دوره
      </button>
    </div>

    <!-- کارت‌های تراز مالی (Ledger KPI Cards) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span class="text-xs font-bold text-slate-500 block">فروش ناخالص (Gross)</span>
        <span class="text-lg font-black text-slate-900 font-mono block mt-2">{{ formatToman(financialKpis.gross) }}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
      </div>

      <div class="bg-white border border-emerald-200/80 rounded-2xl p-4 shadow-xs bg-emerald-50/20">
        <span class="text-xs font-bold text-emerald-800 block">درآمد خالص تسویه (Net)</span>
        <span class="text-lg font-black text-emerald-700 font-mono block mt-2">{{ formatToman(financialKpis.net) }}</span>
        <span class="text-[10px] text-emerald-600 block mt-0.5">تومان</span>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span class="text-xs font-bold text-slate-500 block">تخفیف‌های جذب‌شده</span>
        <span class="text-lg font-black text-rose font-mono block mt-2">{{ formatToman(financialKpis.discountsAbsorbed) }}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span class="text-xs font-bold text-slate-500 block">هزینه ارسال پست</span>
        <span class="text-lg font-black text-slate-800 font-mono block mt-2">{{ formatToman(financialKpis.estimatedShipping) }}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
      </div>

      <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span class="text-xs font-bold text-slate-500 block">کارمزد شاپرک (۱٪)</span>
        <span class="text-lg font-black text-amber-700 font-mono block mt-2">{{ formatToman(financialKpis.totalFees) }}</span>
        <span class="text-[10px] text-slate-400 block mt-0.5">تومان</span>
      </div>
    </div>

    <!-- جدول تراکنش‌های شاپرک -->
    <div class="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between">
        <h3 class="text-xs font-bold text-slate-900">ریز اسناد تسویه شبکه پرداخت شاپرک</h3>
        <span class="text-[11px] text-slate-500 font-mono">{{ transactionsList.length }} سند ثبت‌شده</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-slate-100/75 border-b border-slate-200 text-slate-700 font-bold">
            <tr>
              <th class="p-3.5 text-start">شماره ارجاع (RRN)</th>
              <th class="p-3.5 text-start">شماره کارت و بانک عامل</th>
              <th class="p-3.5 text-start">شماره سفارش و خریدار</th>
              <th class="p-3.5 text-start">مبلغ تراکنش</th>
              <th class="p-3.5 text-start">کارمزد ۱٪</th>
              <th class="p-3.5 text-start">وضعیت تسویه</th>
              <th class="p-3.5 text-start">زمان تسویه</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-mono">
            <tr
              v-for="tx in transactionsList"
              :key="tx.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- RRN -->
              <td class="p-3.5 font-bold text-slate-900">
                {{ tx.rrn }}
              </td>

              <!-- کارت و بانک -->
              <td class="p-3.5 font-sans">
                <span class="font-bold text-slate-800 block font-mono text-[11px]">{{ tx.cardNumber }}</span>
                <span class="text-[10px] text-slate-500 block mt-0.5">{{ tx.bankName }}</span>
              </td>

              <!-- سفارش و خریدار -->
              <td class="p-3.5 font-sans">
                <span class="font-bold text-slate-900 block font-mono text-[11px]">{{ tx.orderNumber }}</span>
                <span class="text-[10px] text-slate-600 block mt-0.5">{{ tx.customerName }}</span>
              </td>

              <!-- مبلغ -->
              <td class="p-3.5 font-bold text-slate-900">
                {{ formatToman(tx.amount) }} تومان
              </td>

              <!-- کارمزد -->
              <td class="p-3.5 text-slate-500">
                {{ formatToman(tx.fee) }} تومان
              </td>

              <!-- وضعیت -->
              <td class="p-3.5 font-sans">
                <span
                  class="px-2 py-0.5 rounded-full text-[11px] font-bold"
                  :class="tx.status === 'settled' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'"
                >
                  {{ tx.status === 'settled' ? 'تسویه‌شده' : 'در انتظار' }}
                </span>
              </td>

              <!-- زمان -->
              <td class="p-3.5 text-slate-500 font-sans text-[11px]">
                {{ tx.settledAt }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
