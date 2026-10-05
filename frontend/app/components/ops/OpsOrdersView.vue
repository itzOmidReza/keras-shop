<!-- frontend/app/components/ops/OpsOrdersView.vue -->
<script setup lang="ts">
import {
  Plus,
  Search,
  ScanBarcode,
  RotateCcw,
  LayoutGrid,
  TableProperties,
  ListTodo,
  FileCheck2,
} from '@lucide/vue'
import { useOpsFulfillmentDesk } from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'
import { useOpsOrders } from '~/composables/ops/useOpsOrders'
import { useOpsModals } from '~/composables/ops/useOpsModals'
import OpsOrdersTable from '~/components/ops/orders/OpsOrdersTable.vue'
import OpsOrdersKanbanBoard from '~/components/ops/orders/OpsOrdersKanbanBoard.vue'
import OpsOrderDetailDrawer from '~/components/ops/orders/OpsOrderDetailDrawer.vue'
import OpsScanToPackStation from '~/components/ops/orders/OpsScanToPackStation.vue'
import OpsWavePickingModal from '~/components/ops/orders/OpsWavePickingModal.vue'
import OpsThermalShippingLabelModal from '~/components/ops/orders/OpsThermalShippingLabelModal.vue'
import OpsPostManifestModal from '~/components/ops/orders/OpsPostManifestModal.vue'
import OpsOrderExchangeModal from '~/components/ops/orders/OpsOrderExchangeModal.vue'
import OpsBatchActionDock from '~/components/ops/orders/OpsBatchActionDock.vue'
import { toFa } from '~/utils/format'

const {
  viewMode,
  activeStatusTab,
  selectedShift,
  selectedCarrierFilter,
  deskSearchQuery,
  isWavePickingOpen,
  isScanToPackOpen,
  enrichedOrders,
} = useOpsFulfillmentDesk()

const {
  openPostManifest,
} = useOpsShippingManifest()

const {
  openManualOrderModal,
} = useOpsOrders()

const { isRmaOpen } = useOpsModals()

const statusTabs = [
  { id: 'all', label: 'همه مرسوله‌ها' },
  { id: 'registered', label: 'ثبت جدید' },
  { id: 'picking', label: 'انبارداری' },
  { id: 'packing', label: 'بسته‌بندی و QC' },
  { id: 'shipped', label: 'تحویل به پست' },
  { id: 'delivered', label: 'تحویل نهایی' },
  { id: 'delayed', label: 'معطله پستی (۴+ روز)' },
]
</script>

<template>
  <section data-testid="nexus-fulfillment-view" class="space-y-5 font-sans">
    <!-- نوار عنوان، ابزارهای تخصصی و دکمه‌های اقدام -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          میز لجستیک و توزیع پوشاک آتلیه
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          پایپ‌لاین دوگانه سفارش‌ها، برداشت تجمیعی انبار، ایستگاه اسکن اقلام و ترخیص رسمی شرکت ملی پست
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- سوئیچ نمای جدول / کانبان -->
        <div class="p-1 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center gap-1 text-xs font-bold">
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            :class="viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
            @click="viewMode = 'table'"
          >
            <TableProperties class="w-3.5 h-3.5" />
            <span>جدول</span>
          </button>
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            :class="viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
            @click="viewMode = 'kanban'"
          >
            <LayoutGrid class="w-3.5 h-3.5" />
            <span>کانبان</span>
          </button>
        </div>

        <!-- برداشت تجمیعی انبار (Wave Picking) -->
        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isWavePickingOpen = true"
        >
          <ListTodo class="w-4 h-4 text-sky-600" />
          <span>برداشت تجمیعی</span>
        </button>

        <!-- ایستگاه کنترل و اسکن بارکد (Scan-to-Pack) -->
        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isScanToPackOpen = true"
        >
          <ScanBarcode class="w-4 h-4 text-rose" />
          <span>ایستگاه اسکن و QC</span>
        </button>

        <!-- مانیفست روزانه ترخیص به پست -->
        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="openPostManifest('post')"
        >
          <FileCheck2 class="w-4 h-4 text-purple-600" />
          <span>مانیفست واگذاری</span>
        </button>

        <!-- بازرسی مرجوعی RMA -->
        <button
          type="button"
          class="h-10 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
          @click="isRmaOpen = true"
        >
          <RotateCcw class="w-4 h-4 text-amber-600" />
          <span>RMA مرجوعی</span>
        </button>

        <!-- دکمه ثبت سفارش دستی (تست E2E) -->
        <button
          type="button"
          data-testid="create-manual-order-btn"
          class="h-10 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
          @click="openManualOrderModal"
        >
          <Plus class="w-4 h-4" />
          <span>+ ثبت سفارش دستی جدید</span>
        </button>
      </div>
    </div>

    <!-- نوار چندفیلتره (تب وضعیت، شیفت، کوریر، جستجو) -->
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
      <!-- تب‌های وضعیت سفارش -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          v-for="tab in statusTabs"
          :key="tab.id"
          type="button"
          class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          :class="activeStatusTab === tab.id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'"
          @click="activeStatusTab = tab.id"
        >
          {{ tab.label }}
          <span v-if="tab.id === 'all'" class="text-[11px] opacity-80 ms-1 font-mono">({{ toFa(enrichedOrders.length) }})</span>
        </button>
      </div>

      <!-- ردیف دوم فیلترها (شیفت، کوریر، جستجوی زنده) -->
      <div class="flex flex-col sm:flex-row items-center gap-2.5 justify-between pt-2 border-t border-slate-100">
        <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <!-- برش زمانی شیفت ارسال -->
          <select
            v-model="selectedShift"
            class="h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white outline-hidden cursor-pointer"
          >
            <option value="all">همه نوبت‌های کاری</option>
            <option value="morning">نوبت صبح (۱۰ الی ۱۳)</option>
            <option value="evening">نوبت عصر (۱۵ الی ۱۸)</option>
          </select>

          <!-- فیلتر شرکت حمل -->
          <select
            v-model="selectedCarrierFilter"
            class="h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:bg-white outline-hidden cursor-pointer"
          >
            <option value="all">همه سرویس‌های پستی و پیک</option>
            <option value="post">پست پیشتاز</option>
            <option value="tipax">تیپاکس (Tipax)</option>
            <option value="chapar">کالارسان چاپار</option>
            <option value="courier">پیک اختصاصی کراس</option>
          </select>
        </div>

        <!-- باکس جستجوی متنی -->
        <div class="relative w-full sm:w-80">
          <input
            v-model="deskSearchQuery"
            type="text"
            placeholder="جستجوی شماره سفارش، نام مشتری یا بارکد ۲۴ رقمی..."
            class="w-full h-9 ps-8 pe-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-hidden"
          >
          <Search class="w-3.5 h-3.5 text-slate-400 absolute inset-s-2.5 top-2.5" />
        </div>
      </div>
    </div>

    <!-- بدنه بوم سفارش‌ها: جدول یا کانبان -->
    <OpsOrdersTable v-if="viewMode === 'table'" />
    <OpsOrdersKanbanBoard v-else />

    <!-- دراور و مودال‌های میز لجستیک -->
    <OpsOrderDetailDrawer />
    <OpsScanToPackStation />
    <OpsWavePickingModal />
    <OpsThermalShippingLabelModal />
    <OpsPostManifestModal />
    <OpsOrderExchangeModal />
    <OpsBatchActionDock />
  </section>
</template>
