<!-- frontend/app/components/ops/orders/OpsScanToPackStation.vue -->
<script setup lang="ts">
import {
  ScanBarcode,
  AlertCircle,
  X,
  Sparkles,
  ShieldCheck,
  Check,
  Printer,
  Barcode,
} from '@lucide/vue'
import { toast } from 'vue-sonner'
import {
  useOpsFulfillmentDesk,
  type FulfillmentOrder,
  type FulfillmentItem,
} from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'
import { toFa } from '~/utils/format'

const {
  isScanToPackOpen,
  selectedOrderForDrawer,
  enrichedOrders,
  transitionOrderStage,
} = useOpsFulfillmentDesk()

const {
  openThermalLabel,
  generateBarcodeForCarrier,
} = useOpsShippingManifest()

// سفارش در حال اسکن
const activeOrder = computed<FulfillmentOrder | null>(() => {
  return selectedOrderForDrawer.value || enrichedOrders.value.find((o) => o.stage === 'packing' || o.stage === 'picking') || enrichedOrders.value[0] || null
})

const garmentBarcodeInput = ref('')
const mismatchError = ref<string | null>(null)

// چک‌لیست کنترل کیفیت (QC Checklist)
const qcChecklist = ref({
  fabricClean: false,
  seamsIntact: false,
  hangtagSealed: false,
})

// اقلام در حال اسکن
const itemsToScan = ref<FulfillmentItem[]>([])

const syncItems = () => {
  if (activeOrder.value) {
    itemsToScan.value = activeOrder.value.items.map((i) => ({
      ...i,
      scanned: i.scanned || false,
    }))
    if (activeOrder.value.qcChecklist) {
      qcChecklist.value = { ...activeOrder.value.qcChecklist }
    }
  }
}

watch(activeOrder, syncItems, { immediate: true })

const allItemsScanned = computed(() => {
  return itemsToScan.value.length > 0 && itemsToScan.value.every((i) => i.scanned)
})

const allQcPassed = computed(() => {
  return qcChecklist.value.fabricClean && qcChecklist.value.seamsIntact && qcChecklist.value.hangtagSealed
})

const canDispatch = computed(() => {
  return allItemsScanned.value && allQcPassed.value
})

const scannedCount = computed(() => {
  return itemsToScan.value.filter((i) => i.scanned).length
})

const progressPercentage = computed(() => {
  if (itemsToScan.value.length === 0) return 0
  return Math.round((scannedCount.value / itemsToScan.value.length) * 100)
})

// اعتبارسنجی اسکن بارکد لباس با Mismatch Guard
const handleGarmentBarcodeScan = () => {
  const query = garmentBarcodeInput.value.trim().toUpperCase()
  if (!query) return

  mismatchError.value = null

  // جستجو در اقلام سفارش
  const matched = itemsToScan.value.find(
    (item) => (item.barcode.toUpperCase() === query || item.sku.toUpperCase() === query) && !item.scanned,
  )

  if (matched) {
    matched.scanned = true
    toast.success(`بارکد تایید شد: ${matched.title} (سایز ${matched.size})`)
    garmentBarcodeInput.value = ''
  } else {
    // خطای عدم تطابق (Mismatch Guard)
    const alreadyScanned = itemsToScan.value.find(
      (item) => (item.barcode.toUpperCase() === query || item.sku.toUpperCase() === query) && item.scanned,
    )
    if (alreadyScanned) {
      mismatchError.value = `هشدار: بارکد «${query}» قبلاً اسکن شده است.`
      toast.warning(mismatchError.value)
    } else {
      mismatchError.value = `عدم تطابق بحرانی! بارکد «${query}» مربوط به هیچ‌یک از اقلام این بسته (مدل، رنگ یا سایز) نمی‌باشد.`
      toast.error(mismatchError.value)
    }
  }
}

// شبیه‌سازی اسکن موفق کلیه اقلام برای تست
const handleSimulateScanAll = () => {
  for (const item of itemsToScan.value) {
    item.scanned = true
  }
  qcChecklist.value.fabricClean = true
  qcChecklist.value.seamsIntact = true
  qcChecklist.value.hangtagSealed = true
  mismatchError.value = null
  toast.success('تمامی اقلام سفارش و چک‌لیست QC با موفقیت تایید شدند.')
}

// تایید نهایی بسته‌بندی و انتقال به مرحله تحویل
const handleFinalizeAndPrint = () => {
  if (!canDispatch.value) {
    toast.error('پیش از صدور بارکد، ۱۰۰٪ اقلام باید اسکن شده و چک‌لیست QC تایید گردد.')
    return
  }

  if (activeOrder.value) {
    // صدور بارکد پستی در صورت عدم وجود
    if (!activeOrder.value.trackingCode) {
      activeOrder.value.trackingCode = generateBarcodeForCarrier(activeOrder.value.carrierType)
    }

    // ذخیره وضعیت اقلام
    for (const item of activeOrder.value.items) {
      item.scanned = true
      item.qcPassed = true
    }

    activeOrder.value.qcChecklist = { ...qcChecklist.value }

    // انتقال مرحله به shipped
    transitionOrderStage(activeOrder.value.orderNumber, 'shipped')

    // باز کردن برچسب ۱۰×۱۵ پستی
    openThermalLabel(activeOrder.value)
    isScanToPackOpen.value = false
  }
}
</script>

<template>
  <div
    v-if="isScanToPackOpen && activeOrder"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
  >
    <div class="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
      <!-- هدر استیشن اسکن و کنترل کیفیت -->
      <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <ScanBarcode class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-sm sm:text-base font-bold text-slate-900">
              میز اسکن و کنترل کیفیت بسته‌بندی (Scan-to-Pack QC Station)
            </h2>
            <p class="text-[11px] text-slate-500 mt-0.5">
              سفارش {{ activeOrder.orderNumber }} • گیرنده: {{ activeOrder.recipientName }}
            </p>
          </div>
        </div>

        <button
          type="button"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          @click="isScanToPackOpen = false"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- محتوای استیشن -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        <!-- ورودی بارکدخوان و Mismatch Guard -->
        <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Barcode class="w-4 h-4 text-indigo-600" />
              <span>اسکن بارکد تک‌تک اقلام لباس (EAN-13 یا SKU):</span>
            </label>
            <button
              type="button"
              class="text-indigo-600 text-[11px] font-bold hover:underline cursor-pointer flex items-center gap-1"
              @click="handleSimulateScanAll"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>تایید خودکار اقلام و QC (تست)</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <input
              v-model="garmentBarcodeInput"
              type="text"
              placeholder="بارکد لباس را با بارکدخوان اسکن کنید یا وارد نمایید..."
              class="w-full h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 outline-hidden focus:border-ink"
              @keydown.enter.prevent="handleGarmentBarcodeScan"
            >
            <button
              type="button"
              class="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shrink-0 cursor-pointer transition-colors"
              @click="handleGarmentBarcodeScan"
            >
              ثبت اسکن
            </button>
          </div>

          <!-- پیام هشدار عدم تطابق بارکد (Mismatch Guard Alert) -->
          <div
            v-if="mismatchError"
            class="p-2.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-bold flex items-start gap-2 animate-in shake"
          >
            <AlertCircle class="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{{ mismatchError }}</span>
          </div>
        </div>

        <!-- درصد پیشرفت اسکن و لیست اقلام داخل بسته -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-bold">
            <span class="text-slate-800">اقلام تایید شده داخل بسته:</span>
            <span class="font-mono text-indigo-700 tabular-nums">
              {{ toFa(scannedCount) }} از {{ toFa(itemsToScan.length) }} قلم ({{ toFa(progressPercentage) }}٪)
            </span>
          </div>

          <!-- پروگرس‌بار تطبیق -->
          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300 rounded-full"
              :class="allItemsScanned ? 'bg-emerald-500' : 'bg-indigo-600'"
              :style="{ width: `${progressPercentage}%` }"
            />
          </div>

          <!-- لیست اقلام سفارش -->
          <div class="space-y-2 pt-1">
            <div
              v-for="item in itemsToScan"
              :key="item.sku"
              class="p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors"
              :class="item.scanned ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950' : 'border-slate-200 bg-white'"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <div
                  class="w-6 h-6 rounded-full border flex items-center justify-center shrink-0"
                  :class="item.scanned ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-300 bg-slate-50'"
                >
                  <Check v-if="item.scanned" class="w-3.5 h-3.5" />
                </div>
                <img
                  :src="item.image"
                  :alt="item.title"
                  class="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                >
                <div class="min-w-0">
                  <span class="font-bold text-xs truncate block text-slate-900">{{ item.title }}</span>
                  <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 font-mono">
                    <span>رنگ: {{ item.color }}</span>
                    <span>•</span>
                    <span class="font-bold text-slate-700">سایز {{ item.size }}</span>
                    <span>•</span>
                    <span>بارکد: {{ item.barcode }}</span>
                  </div>
                </div>
              </div>

              <div class="text-end shrink-0">
                <span
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold"
                  :class="item.scanned ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'"
                >
                  {{ item.scanned ? 'اسکن شد ✓' : 'در انتظار اسکن' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- چک‌لیست کنترل کیفیت آتلیه (QC Inspection Checklist) -->
        <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-900">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            <span>چک‌لیست کنترل کیفیت البسه (QC Inspection):</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <label
              class="p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors text-xs"
              :class="qcChecklist.fabricClean ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-600'"
            >
              <input
                v-model="qcChecklist.fabricClean"
                type="checkbox"
                class="w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
              >
              <span>سلامت بافت و الیاف پارچه</span>
            </label>

            <label
              class="p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors text-xs"
              :class="qcChecklist.seamsIntact ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-600'"
            >
              <input
                v-model="qcChecklist.seamsIntact"
                type="checkbox"
                class="w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
              >
              <span>دوخت، دکمه و زیپ بی‌نقص</span>
            </label>

            <label
              class="p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors text-xs"
              :class="qcChecklist.hangtagSealed ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold' : 'border-slate-200 bg-white text-slate-600'"
            >
              <input
                v-model="qcChecklist.hangtagSealed"
                type="checkbox"
                class="w-4 h-4 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
              >
              <span>اتیکت و پلمپ اصالت آتلیه</span>
            </label>
          </div>
        </div>
      </div>

      <!-- فوتر استیشن با دکمه تایید نهایی و چاپ -->
      <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] text-slate-500">
          وضعیت ترخیص:
          <span :class="canDispatch ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'">
            {{ canDispatch ? 'مجاز به صدور برچسب پستی ✓' : 'نیازمند تکمیل اسکن و تایید QC' }}
          </span>
        </span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-4 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
            @click="isScanToPackOpen = false"
          >
            انصراف
          </button>

          <button
            type="button"
            :disabled="!canDispatch"
            class="h-9 px-5 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:pointer-events-none"
            @click="handleFinalizeAndPrint"
          >
            <Printer class="w-4 h-4" />
            <span>تایید نهایی و چاپ برچسب ۱۰×۱۵</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
