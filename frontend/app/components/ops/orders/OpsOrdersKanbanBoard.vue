<!-- frontend/app/components/ops/orders/OpsOrdersKanbanBoard.vue -->
<script setup lang="ts">
import {
  ChevronLeft,
  ChevronRight,
  ScanBarcode,
  Printer,
  AlertTriangle,
} from '@lucide/vue'
import {
  useOpsFulfillmentDesk,
  type FulfillmentOrder,
  type FulfillmentStage,
} from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'
import { toFa, formatToman } from '~/utils/format'

const {
  kanbanColumns,
  transitionOrderStage,
  openOrderDetailDrawer,
  isScanToPackOpen,
} = useOpsFulfillmentDesk()

const {
  CARRIER_CONFIGS,
  openThermalLabel,
} = useOpsShippingManifest()

// مدیریت Drag and Drop
const draggedOrderNumber = ref<string | null>(null)
const dragOverColumnId = ref<string | null>(null)

const onDragStart = (e: DragEvent, order: FulfillmentOrder) => {
  draggedOrderNumber.value = order.orderNumber
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', order.orderNumber)
  }
}

const onDragOver = (e: DragEvent, columnId: string) => {
  e.preventDefault()
  dragOverColumnId.value = columnId
}

const onDragLeave = () => {
  dragOverColumnId.value = null
}

const onDrop = (e: DragEvent, targetStage: FulfillmentStage) => {
  e.preventDefault()
  dragOverColumnId.value = null
  const orderNumber = draggedOrderNumber.value || e.dataTransfer?.getData('text/plain')
  if (orderNumber) {
    transitionOrderStage(orderNumber, targetStage)
  }
  draggedOrderNumber.value = null
}

const stagesList: FulfillmentStage[] = ['registered', 'picking', 'packing', 'shipped', 'delivered']

const getNextStage = (current: FulfillmentStage): FulfillmentStage | null => {
  const idx = stagesList.indexOf(current)
  if (idx > -1 && idx < stagesList.length - 1) {
    return stagesList[idx + 1]!
  }
  return null
}

const getPrevStage = (current: FulfillmentStage): FulfillmentStage | null => {
  const idx = stagesList.indexOf(current)
  if (idx > 0) {
    return stagesList[idx - 1]!
  }
  return null
}

const handleScanToPack = (order: FulfillmentOrder) => {
  openOrderDetailDrawer(order)
  isScanToPackOpen.value = true
}
</script>

<template>
  <div class="overflow-x-auto pb-4 font-sans">
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 min-w-[1050px]">
      <div
        v-for="(col, key) in kanbanColumns"
        :key="key"
        class="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col min-h-[580px] transition-all"
        :class="dragOverColumnId === col.id ? 'border-ink bg-sand-100/50 ring-2 ring-ink/20' : ''"
        @dragover="onDragOver($event, col.id)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, col.id as FulfillmentStage)"
      >
        <!-- هدر ستون کانبان -->
        <div class="flex items-center justify-between pb-3 mb-2 border-b border-slate-200/80">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="w-2 h-2 rounded-full" :class="col.id === 'registered' ? 'bg-amber-500' : col.id === 'picking' ? 'bg-sky-500' : col.id === 'packing' ? 'bg-indigo-500' : col.id === 'shipped' ? 'bg-purple-500' : 'bg-emerald-500'" />
            <h3 class="text-xs font-bold text-slate-800 truncate">{{ col.title }}</h3>
          </div>
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
            :class="col.badgeColor"
          >
            {{ toFa(col.orders.length) }}
          </span>
        </div>

        <!-- کارت‌های سفارش ستون -->
        <div class="flex-1 space-y-2.5 overflow-y-auto max-h-[640px] pe-1">
          <div
            v-for="order in col.orders"
            :key="order.orderNumber"
            draggable="true"
            class="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-2.5 group"
            @dragstart="onDragStart($event, order)"
          >
            <!-- ردیف بالای کارت: شماره سفارش و شیفت -->
            <div class="flex items-center justify-between gap-1 text-[11px]">
              <span
                class="font-mono font-bold text-slate-900 cursor-pointer hover:text-ink hover:underline"
                @click="openOrderDetailDrawer(order)"
              >
                {{ order.orderNumber }}
              </span>
              <span
                class="px-1.5 py-0.2 rounded text-[10px] font-bold"
                :class="order.shift === 'morning' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-indigo-50 text-indigo-800 border border-indigo-200'"
              >
                {{ order.shift === 'morning' ? 'صبح' : 'عصر' }}
              </span>
            </div>

            <!-- اطلاعات خریدار و نشانی -->
            <div class="cursor-pointer" @click="openOrderDetailDrawer(order)">
              <span class="text-xs font-bold text-slate-800 block truncate">{{ order.recipientName }}</span>
              <span class="text-[10px] text-slate-500 block truncate mt-0.5" :title="order.shippingAddress">
                {{ order.shippingAddress }}
              </span>
            </div>

            <!-- خلاصه اقلام لباس و تصاویر -->
            <div
              class="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer"
              @click="openOrderDetailDrawer(order)"
            >
              <img
                v-if="order.items[0]?.image"
                :src="order.items[0].image"
                :alt="order.items[0].title"
                class="w-8 h-8 rounded-md object-cover bg-slate-200 shrink-0"
              >
              <div class="min-w-0 flex-1 text-[10px] leading-tight">
                <span class="font-bold text-slate-800 truncate block">{{ order.items[0]?.title }}</span>
                <span class="text-slate-500 font-mono">
                  {{ order.items[0]?.color }} • {{ order.items[0]?.size }}
                  <span v-if="order.items.length > 1" class="text-ink font-bold font-sans">
                    (+{{ toFa(order.items.length - 1) }})
                  </span>
                </span>
              </div>
            </div>

            <!-- قیمت، روش پرداخت و شرکت حمل -->
            <div class="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
              <span class="font-mono font-bold text-slate-900">{{ formatToman(order.totalAmount) }} ت</span>
              <span
                class="px-1.5 py-0.2 rounded-full text-[10px] font-bold"
                :class="order.carrierType === 'post' ? 'bg-amber-100/70 text-amber-900' : order.carrierType === 'tipax' ? 'bg-blue-100/70 text-blue-900' : 'bg-purple-100/70 text-purple-900'"
              >
                {{ CARRIER_CONFIGS[order.carrierType]?.shortName || 'پست' }}
              </span>
            </div>

            <!-- نشان هشدار تاخیر -->
            <div
              v-if="order.isDelayed"
              class="p-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[10px] font-bold flex items-center gap-1"
            >
              <AlertTriangle class="w-3 h-3 text-rose-600 shrink-0" />
              <span>معطله پستی ({{ toFa(order.delayedDays || 4) }} روز)</span>
            </div>

            <!-- دکمه‌های انتقال سریع ستون و ابزارها -->
            <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
              <!-- دکمه برگشت به مرحله قبل -->
              <button
                v-if="getPrevStage(order.stage)"
                type="button"
                class="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="بازگشت به مرحله قبل"
                @click="transitionOrderStage(order.orderNumber, getPrevStage(order.stage)!)"
              >
                <ChevronRight class="w-3.5 h-3.5" />
              </button>
              <span v-else class="w-4" />

              <div class="flex items-center gap-1">
                <!-- کلید اسکن اختصاصی مرحله بسته‌بندی -->
                <button
                  v-if="order.stage === 'picking' || order.stage === 'packing'"
                  type="button"
                  class="p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer"
                  title="میز اسکن و بارکدخوان اقلام"
                  @click="handleScanToPack(order)"
                >
                  <ScanBarcode class="w-3 h-3" />
                </button>

                <!-- چاپ لیبل پستی -->
                <button
                  type="button"
                  class="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="چاپ لیبل پستی ۱۰×۱۵"
                  @click="openThermalLabel(order)"
                >
                  <Printer class="w-3 h-3" />
                </button>
              </div>

              <!-- دکمه رفتن به مرحله بعد -->
              <button
                v-if="getNextStage(order.stage)"
                type="button"
                class="p-1 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="انتقال به مرحله بعد"
                @click="transitionOrderStage(order.orderNumber, getNextStage(order.stage)!)"
              >
                <ChevronLeft class="w-3.5 h-3.5" />
              </button>
              <span v-else class="w-4" />
            </div>
          </div>

          <!-- وضعیت ستون خالی -->
          <div
            v-if="col.orders.length === 0"
            class="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[11px] text-slate-400 font-medium"
          >
            سفارشی در این مرحله نیست
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
