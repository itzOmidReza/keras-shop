<script setup lang="ts">
const { vouchers, toggleVoucher } = useOpsInventory()
</script>

<template>
  <section data-testid="nexus-vouchers-view" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          کمپین‌های تخفیف و پروموشن
        </h1>
        <p class="text-xs sm:text-sm text-slate-600 mt-1">
          مدیریت کوپن‌های فعال، درصد تخفیف، محدودیت مصرف و تاریخ انقضا
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="v in vouchers"
        :key="v.id"
        class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs relative flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <span class="font-mono font-black text-base text-slate-900 px-2 py-1 rounded bg-slate-100 border border-slate-200">
              {{ v.code }}
            </span>
            <button
              type="button"
              class="px-2 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition-colors"
              :class="v.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'"
              @click="toggleVoucher(v)"
            >
              {{ v.active ? 'فعال' : 'غیرفعال' }}
            </button>
          </div>

          <div class="mt-4 space-y-1.5 text-xs text-slate-600">
            <div class="flex justify-between">
              <span>میزان تخفیف:</span>
              <span class="font-bold text-slate-900">{{ v.discount }}</span>
            </div>
            <div class="flex justify-between">
              <span>سقف تخفیف:</span>
              <span class="font-bold text-slate-900">{{ v.maxDiscount }}</span>
            </div>
            <div class="flex justify-between">
              <span>حداقل سبد خرید:</span>
              <span class="font-bold text-slate-900">{{ v.minOrder }}</span>
            </div>
            <div class="flex justify-between">
              <span>مصرف شده:</span>
              <span class="font-bold text-slate-900 font-mono">{{ v.usedCount }} از {{ v.limit }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>انقضا: {{ v.expiresAt }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
