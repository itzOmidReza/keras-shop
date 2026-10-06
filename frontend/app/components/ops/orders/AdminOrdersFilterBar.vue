<!-- frontend/app/components/ops/orders/AdminOrdersFilterBar.vue -->
<script setup lang="ts">
import { Plus, Search, Filter } from '@lucide/vue'
import { toFa } from '~/utils/format'

defineProps<{
  tabs: readonly { id: string; label: string; count: number }[]
  activeStatusTab: string
  carrierFilter: string
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:activeStatusTab': [value: string]
  'update:carrierFilter': [value: string]
  'update:searchQuery': [value: string]
  openManualOrder: []
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- هدر میز سفارش‌ها و صدور بارکد -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          سفارش‌ها و ارسال مرسولات
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          مدیریت خط لوله سفارش، صدور خودکار بارکد ۲۴ رقمی پستی و چاپ برگه آدرس مرسوله
        </p>
      </div>

      <button
        type="button"
        data-testid="create-manual-order-btn"
        class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all w-fit"
        @click="emit('openManualOrder')"
      >
        <Plus class="w-4 h-4" />
        <span>+ ثبت سفارش دستی جدید</span>
      </button>
    </div>

    <!-- تب‌های فیلتر وضعیت، فیلتر شرکت حمل و جست‌وجوی ترکیبی -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <!-- تب‌های وضعیت با شمارنده‌های پویا -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <button
            v-for="t in tabs"
            :key="t.id"
            type="button"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0"
            :class="activeStatusTab === t.id ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'"
            @click="emit('update:activeStatusTab', t.id)"
          >
            <span>{{ t.label }}</span>
            <span
              class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold"
              :class="activeStatusTab === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
            >
              {{ toFa(t.count) }}
            </span>
          </button>
        </div>

        <!-- فیلتر شرکت حمل و فیلد جست‌وجو -->
        <div class="flex flex-col sm:flex-row items-center gap-2.5">
          <!-- انتخاب شرکت حمل -->
          <div class="relative w-full sm:w-44">
            <select
              :value="carrierFilter"
              class="w-full h-9.5 ps-8 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-hidden focus:bg-white focus:border-slate-400 cursor-pointer"
              @change="emit('update:carrierFilter', ($event.target as HTMLSelectElement).value)"
            >
              <option value="all">همه شرکت‌های حمل</option>
              <option value="post">شرکت ملی پست</option>
              <option value="tipax">تیپاکس (Tipax)</option>
              <option value="courier">پیک اختصاصی</option>
            </select>
            <Filter class="w-3.5 h-3.5 text-slate-400 absolute inset-s-2.5 top-3 pointer-events-none" />
          </div>

          <!-- باکس جست‌وجوی چندفیلدی -->
          <div class="relative w-full sm:w-72">
            <input
              :value="searchQuery"
              type="text"
              placeholder="جستجو با شماره سفارش، نام، تلفن یا بارکد..."
              class="w-full h-9.5 ps-9 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden focus:border-slate-400"
              @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
            >
            <Search class="w-4 h-4 text-slate-400 absolute inset-s-3 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
