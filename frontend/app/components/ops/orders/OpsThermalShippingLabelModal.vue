<!-- frontend/app/components/ops/orders/OpsThermalShippingLabelModal.vue -->
<script setup lang="ts">
import {
  Printer,
  X,
  QrCode,
} from '@lucide/vue'
import { useOpsShippingManifest, type CarrierType } from '~/composables/ops/useOpsShippingManifest'
import type { TrackOrderResponse } from '~/types/domain'
import { toFa, formatToman } from '~/utils/format'

const {
  isThermalLabelOpen,
  selectedOrderForThermal,
  bulkOrdersForThermal,
  CARRIER_CONFIGS,
  triggerPrintThermalLabel,
} = useOpsShippingManifest()

const activeOrders = computed(() => {
  if (bulkOrdersForThermal.value.length > 0) return bulkOrdersForThermal.value
  if (selectedOrderForThermal.value) return [selectedOrderForThermal.value]
  return []
})

const getCarrierName = (order: TrackOrderResponse) => {
  const cType = ((order as unknown as { carrierType?: CarrierType }).carrierType || 'post') as CarrierType
  return CARRIER_CONFIGS[cType]?.shortName || 'پست پیشتاز'
}
</script>

<template>
  <div
    v-if="isThermalLabelOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
  >
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- هدر پیش‌نمایش چاپگر حرارتی -->
      <div class="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center">
            <Printer class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-900">
              پیش‌نمایش برچسب حرارتی استاندارد ۱۰×۱۵ سانتیمتر (Thermal Label)
            </h3>
            <p class="text-[11px] text-slate-500 mt-0.5">
              مناسب پرینترهای لیبل‌زن زبرا، بیکسولون و وینپک با کالیبره استاندارد
            </p>
          </div>
        </div>

        <button
          type="button"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          @click="isThermalLabelOpen = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- محتوای برچسب ۱۰×۱۵ (قابلیت اسکرول برای چند برچسب) -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60 flex flex-col items-center gap-6">
        <div
          v-for="order in activeOrders"
          :key="order.orderNumber"
          class="w-[360px] sm:w-[400px] bg-white border-2 border-black rounded-lg p-4 shadow-md text-black space-y-3 font-sans"
        >
          <!-- هدر لیبل: لوگو و مشخصات بارکد شرکت حمل -->
          <div class="border-b-2 border-black pb-2.5 flex items-center justify-between">
            <div>
              <span class="font-black text-sm tracking-widest block uppercase">KERAS ATELIER</span>
              <span class="text-[10px] text-slate-600 block">استودیو مد و لباس کراس</span>
            </div>
            <div class="text-end font-mono">
              <span class="font-bold text-xs block">{{ order.orderNumber }}</span>
              <span class="text-[10px] text-slate-600 font-sans block">
                {{ getCarrierName(order) }}
              </span>
            </div>
          </div>

          <!-- بارکد ۲۴ رقمی پستی به صورت وکتور شبیه‌سازی‌شده -->
          <div class="text-center py-1 space-y-1 border-b-2 border-black pb-2.5">
            <div class="font-mono text-sm tracking-widest font-black dir-ltr">
              {{ order.trackingCode || '189396311100009823412345' }}
            </div>
            <!-- میله‌های بارکد SVG -->
            <div class="h-10 w-full flex items-center justify-center overflow-hidden">
              <svg class="h-10 w-full max-w-[320px]" viewBox="0 0 240 30" preserveAspectRatio="none">
                <rect x="0" y="0" width="3" height="30" fill="black" />
                <rect x="5" y="0" width="2" height="30" fill="black" />
                <rect x="9" y="0" width="4" height="30" fill="black" />
                <rect x="15" y="0" width="2" height="30" fill="black" />
                <rect x="19" y="0" width="5" height="30" fill="black" />
                <rect x="26" y="0" width="2" height="30" fill="black" />
                <rect x="30" y="0" width="3" height="30" fill="black" />
                <rect x="35" y="0" width="5" height="30" fill="black" />
                <rect x="42" y="0" width="2" height="30" fill="black" />
                <rect x="46" y="0" width="4" height="30" fill="black" />
                <rect x="52" y="0" width="3" height="30" fill="black" />
                <rect x="57" y="0" width="2" height="30" fill="black" />
                <rect x="61" y="0" width="5" height="30" fill="black" />
                <rect x="68" y="0" width="3" height="30" fill="black" />
                <rect x="73" y="0" width="2" height="30" fill="black" />
                <rect x="77" y="0" width="4" height="30" fill="black" />
                <rect x="83" y="0" width="3" height="30" fill="black" />
                <rect x="88" y="0" width="5" height="30" fill="black" />
                <rect x="95" y="0" width="2" height="30" fill="black" />
                <rect x="99" y="0" width="4" height="30" fill="black" />
                <rect x="105" y="0" width="3" height="30" fill="black" />
                <rect x="110" y="0" width="2" height="30" fill="black" />
                <rect x="114" y="0" width="5" height="30" fill="black" />
                <rect x="121" y="0" width="3" height="30" fill="black" />
                <rect x="126" y="0" width="2" height="30" fill="black" />
                <rect x="130" y="0" width="4" height="30" fill="black" />
                <rect x="136" y="0" width="5" height="30" fill="black" />
                <rect x="143" y="0" width="2" height="30" fill="black" />
                <rect x="147" y="0" width="4" height="30" fill="black" />
                <rect x="153" y="0" width="3" height="30" fill="black" />
                <rect x="158" y="0" width="2" height="30" fill="black" />
                <rect x="162" y="0" width="5" height="30" fill="black" />
                <rect x="169" y="0" width="3" height="30" fill="black" />
                <rect x="174" y="0" width="2" height="30" fill="black" />
                <rect x="178" y="0" width="4" height="30" fill="black" />
                <rect x="184" y="0" width="3" height="30" fill="black" />
                <rect x="189" y="0" width="5" height="30" fill="black" />
                <rect x="196" y="0" width="2" height="30" fill="black" />
                <rect x="200" y="0" width="4" height="30" fill="black" />
                <rect x="206" y="0" width="3" height="30" fill="black" />
                <rect x="211" y="0" width="2" height="30" fill="black" />
                <rect x="215" y="0" width="5" height="30" fill="black" />
                <rect x="222" y="0" width="3" height="30" fill="black" />
                <rect x="227" y="0" width="2" height="30" fill="black" />
                <rect x="231" y="0" width="4" height="30" fill="black" />
                <rect x="237" y="0" width="3" height="30" fill="black" />
              </svg>
            </div>
          </div>

          <!-- بلوک آدرس فرستنده و گیرنده -->
          <div class="grid grid-cols-2 gap-2 text-[10px] border-b-2 border-black pb-2.5">
            <div class="border-e-2 border-black pe-2">
              <span class="font-bold block">فرستنده:</span>
              <p class="leading-tight mt-0.5">آتلیه مد کراس</p>
              <p class="leading-tight text-slate-700">تهران، خ فرشته، پلاک ۱۸</p>
              <p class="font-mono mt-0.5">کد پستی: ۱۹۶۵۹۳۴۱۱۱</p>
              <p class="font-mono">تلفن: ۰۲۱۲۲۰۰۳۳۰۰</p>
            </div>

            <div class="ps-1">
              <span class="font-bold block">گیرنده:</span>
              <p class="font-bold text-[11px] leading-tight mt-0.5">{{ order.recipientName }}</p>
              <p class="font-mono leading-tight">{{ order.recipientPhone || '—' }}</p>
              <p class="leading-tight text-slate-800 mt-0.5 line-clamp-2" :title="order.shippingAddress">
                {{ order.shippingAddress }}
              </p>
              <p class="font-mono mt-0.5 font-bold">کد پستی: {{ (order as any).postalCode || '۱۹۶۵۹۸۸۱۲۳' }}</p>
            </div>
          </div>

          <!-- خلاصه اقلام داخل بسته جهت تایید مامور توزیع -->
          <div class="space-y-1 text-[10px] border-b-2 border-black pb-2">
            <div class="flex items-center justify-between font-bold">
              <span>محتوای مرسوله (پوشاک آتلیه):</span>
              <span class="font-mono">وزن: {{ toFa((order as any).weightGrams || 450) }} گرم</span>
            </div>
            <div class="space-y-0.5">
              <div
                v-for="(item, idx) in order.items"
                :key="idx"
                class="flex items-center justify-between text-slate-800"
              >
                <span class="truncate max-w-[240px]">• {{ item.title }} ({{ item.color }} - {{ item.size }})</span>
                <span class="font-mono font-bold">{{ toFa(item.quantity) }}x</span>
              </div>
            </div>
          </div>

          <!-- فوتر لیبل: QR کد رهگیری و تسویه مالی -->
          <div class="flex items-center justify-between pt-1 text-[10px]">
            <div class="flex items-center gap-2">
              <div class="w-10 h-10 border border-black p-0.5 flex items-center justify-center shrink-0">
                <QrCode class="w-8 h-8 text-black" />
              </div>
              <div>
                <span class="font-bold block">رهگیری آنلاین:</span>
                <span class="font-mono text-[9px] text-slate-600 block">keras.ir/t/{{ order.orderNumber }}</span>
              </div>
            </div>

            <div class="text-end">
              <span class="font-bold block text-[11px]">
                {{ (order as any).freightMode === 'cod' ? 'پس‌کرایه (COD)' : 'پیش‌کرایه (پرداخت‌شده)' }}
              </span>
              <span class="font-mono font-bold text-xs">{{ formatToman(order.totalAmount) }} تومان</span>
            </div>
          </div>
        </div>
      </div>

      <!-- فوتر دیالوگ -->
      <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] text-slate-500">
          تعداد برچسب‌های آماده چاپ: {{ toFa(activeOrders.length) }} برگ
        </span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
            @click="isThermalLabelOpen = false"
          >
            بستن
          </button>

          <button
            type="button"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            @click="triggerPrintThermalLabel"
          >
            <Printer class="w-4 h-4" />
            <span>چاپ برچسب حرارتی (۱۰×۱۵)</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
