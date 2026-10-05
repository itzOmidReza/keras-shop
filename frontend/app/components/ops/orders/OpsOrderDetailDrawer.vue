<!-- frontend/app/components/ops/orders/OpsOrderDetailDrawer.vue -->
<script setup lang="ts">
import {
  X,
  Copy,
  Phone,
  MapPin,
  History,
  ScanBarcode,
  Printer,
  RotateCcw,
  Edit3,
  Save,
} from '@lucide/vue'
import {
  useOpsFulfillmentDesk,
  type FulfillmentItem,
} from '~/composables/ops/useOpsFulfillmentDesk'
import { useOpsShippingManifest } from '~/composables/ops/useOpsShippingManifest'
import { useOpsOrders } from '~/composables/ops/useOpsOrders'
import { toFa, formatToman } from '~/utils/format'

const {
  isDrawerOpen,
  selectedOrderForDrawer,
  closeOrderDetailDrawer,
  transitionOrderStage,
  updateEmergencyAddress,
  isScanToPackOpen,
  isExchangeModalOpen,
  selectedItemForExchange,
  simulateCarrierWebhook,
} = useOpsFulfillmentDesk()

const {
  CARRIER_CONFIGS,
  FREIGHT_PAYMENT_MODES,
  openThermalLabel,
} = useOpsShippingManifest()

const { copyToClipboard } = useOpsOrders()

// ویرایش اضطراری نشانی
const isEditingAddress = ref(false)
const editAddressInput = ref('')
const editPhoneInput = ref('')
const editPostalCodeInput = ref('')

watch(selectedOrderForDrawer, (order) => {
  if (order) {
    editAddressInput.value = order.shippingAddress
    editPhoneInput.value = order.recipientPhone || ''
    editPostalCodeInput.value = order.postalCode || ''
    isEditingAddress.value = false
  }
})

const handleSaveAddress = () => {
  if (!selectedOrderForDrawer.value) return
  updateEmergencyAddress(
    selectedOrderForDrawer.value.orderNumber,
    editAddressInput.value,
    editPhoneInput.value,
    editPostalCodeInput.value,
  )
  isEditingAddress.value = false
}

const handleStartExchangeForItem = (item: FulfillmentItem) => {
  if (selectedOrderForDrawer.value) {
    selectedItemForExchange.value = {
      order: selectedOrderForDrawer.value,
      item,
    }
    isExchangeModalOpen.value = true
  }
}

const handleOpenScan = () => {
  isScanToPackOpen.value = true
}

const handleOpenThermal = () => {
  if (selectedOrderForDrawer.value) {
    openThermalLabel(selectedOrderForDrawer.value)
  }
}
</script>

<template>
  <div>
    <!-- پس‌زمینه محو شونده -->
    <div
      v-if="isDrawerOpen"
      class="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      @click="closeOrderDetailDrawer"
    />

    <!-- پنل اسلاید-آور از سمت راست -->
    <div
      v-if="isDrawerOpen && selectedOrderForDrawer"
      class="fixed inset-y-0 start-0 z-50 w-full sm:max-w-lg bg-white border-e border-slate-200 shadow-2xl flex flex-col font-sans animate-in slide-in-from-start duration-200"
    >
      <!-- هدر دراور -->
      <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-sm text-slate-900">{{ selectedOrderForDrawer.orderNumber }}</span>
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-bold"
              :class="selectedOrderForDrawer.shift === 'morning' ? 'bg-amber-100 text-amber-900' : 'bg-indigo-100 text-indigo-900'"
            >
              {{ selectedOrderForDrawer.shift === 'morning' ? 'نوبت صبح' : 'نوبت عصر' }}
            </span>
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5">{{ selectedOrderForDrawer.statusLabel }}</p>
        </div>

        <button
          type="button"
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          @click="closeOrderDetailDrawer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- محتوای قابل اسکرول دراور -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
        <!-- دکمه‌های اقدام سریع بالای دراور -->
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            class="h-9 px-3 rounded-xl bg-ink text-white font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs hover:bg-ink/90 text-[11px]"
            @click="handleOpenScan"
          >
            <ScanBarcode class="w-3.5 h-3.5" />
            <span>اسکن و بسته‌بندی کالا</span>
          </button>

          <button
            type="button"
            class="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
            @click="handleOpenThermal"
          >
            <Printer class="w-3.5 h-3.5 text-slate-600" />
            <span>چاپ لیبل پستی ۱۰×۱۵</span>
          </button>
        </div>

        <!-- اقلام سفارش با کلید تعویض سایز اختصاصی -->
        <div class="space-y-2">
          <span class="font-bold text-slate-800 block text-xs">اقلام فاکتور مشتری:</span>
          <div
            v-for="(item, idx) in selectedOrderForDrawer.items"
            :key="idx"
            class="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
          >
            <div class="flex items-center gap-3">
              <img
                :src="item.image"
                :alt="item.title"
                class="w-12 h-12 rounded-xl object-cover bg-slate-200 shrink-0 border border-slate-200"
              >
              <div class="min-w-0 flex-1">
                <span class="font-bold text-slate-900 block truncate">{{ item.title }}</span>
                <div class="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span>رنگ: {{ item.color }}</span>
                  <span>•</span>
                  <span class="font-mono font-bold text-slate-700">سایز {{ item.size }}</span>
                  <span>•</span>
                  <span class="font-bold text-slate-700 font-mono">{{ toFa(item.quantity) }} عدد</span>
                </div>
                <div class="flex items-center justify-between mt-1 text-[11px]">
                  <span class="font-mono text-slate-400 text-[10px]">بارکد: {{ item.barcode }}</span>
                  <span class="font-mono font-bold text-slate-900">{{ formatToman(item.price) }} ت</span>
                </div>
              </div>
            </div>

            <!-- کلید تعویض سایز سریع قلم کالا -->
            <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span class="text-[10px] text-slate-400">نیاز به تغییر سایز؟</span>
              <button
                type="button"
                class="h-7 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                @click="handleStartExchangeForItem(item)"
              >
                <RotateCcw class="w-3 h-3 text-amber-700" />
                <span>درخواست تعویض سایز</span>
              </button>
            </div>
          </div>
        </div>

        <!-- اطلاعات تحویل‌گیرنده و ویرایش اضطراری نشانی -->
        <div class="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-bold text-slate-900">
              <MapPin class="w-4 h-4 text-ink" />
              <span>مشخصات و آدرس گیرنده</span>
            </div>
            <button
              v-if="!isEditingAddress"
              type="button"
              class="text-[11px] text-ink font-bold hover:underline flex items-center gap-1 cursor-pointer"
              @click="isEditingAddress = true"
            >
              <Edit3 class="w-3 h-3" />
              <span>ویرایش اضطراری</span>
            </button>
          </div>

          <!-- حالت نمایش عادی -->
          <div v-if="!isEditingAddress" class="space-y-1.5 text-slate-600">
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-800">{{ selectedOrderForDrawer.recipientName }}</span>
              <div class="flex items-center gap-1 font-mono text-[11px]">
                <Phone class="w-3 h-3 text-slate-400" />
                <span>{{ selectedOrderForDrawer.recipientPhone || '—' }}</span>
                <button
                  v-if="selectedOrderForDrawer.recipientPhone"
                  type="button"
                  class="p-0.5 hover:text-ink cursor-pointer"
                  title="کپی شماره تلفن"
                  @click="copyToClipboard(selectedOrderForDrawer.recipientPhone)"
                >
                  <Copy class="w-3 h-3" />
                </button>
              </div>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed">{{ selectedOrderForDrawer.shippingAddress }}</p>
            <div class="text-[10px] text-slate-400 font-mono">
              کد پستی: {{ selectedOrderForDrawer.postalCode || '—' }}
            </div>
          </div>

          <!-- فرم ویرایش اضطراری نشانی -->
          <div v-else class="space-y-2 pt-1 border-t border-slate-100">
            <div>
              <label class="block text-[10px] font-bold text-slate-600 mb-1">نشانی پستی گیرنده:</label>
              <textarea
                v-model="editAddressInput"
                rows="2"
                class="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-1">شماره همراه:</label>
                <input
                  v-model="editPhoneInput"
                  type="text"
                  class="w-full h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink"
                >
              </div>
              <div>
                <label class="block text-[10px] font-bold text-slate-600 mb-1">کد پستی ۱۰ رقمی:</label>
                <input
                  v-model="editPostalCodeInput"
                  type="text"
                  class="w-full h-8 px-2 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-800 outline-hidden focus:bg-white focus:border-ink"
                >
              </div>
            </div>
            <div class="flex items-center justify-end gap-1.5 pt-1">
              <button
                type="button"
                class="h-7 px-2.5 rounded-lg text-[11px] text-slate-600 hover:bg-slate-100 cursor-pointer"
                @click="isEditingAddress = false"
              >
                انصراف
              </button>
              <button
                type="button"
                class="h-7 px-3 rounded-lg bg-ink text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                @click="handleSaveAddress"
              >
                <Save class="w-3 h-3" />
                <span>ذخیره تغییرات</span>
              </button>
            </div>
          </div>
        </div>

        <!-- مشخصات ناوگان حمل و پرداخت -->
        <div class="grid grid-cols-2 gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/60">
          <div>
            <span class="text-[10px] text-slate-400 block">شرکت خدمات لجستیک:</span>
            <span class="font-bold text-slate-800 text-[11px] block mt-0.5">
              {{ CARRIER_CONFIGS[selectedOrderForDrawer.carrierType]?.name || selectedOrderForDrawer.carrier }}
            </span>
            <span class="text-[10px] text-slate-500 font-mono mt-0.5 block">
              بارکد: {{ selectedOrderForDrawer.trackingCode || 'در انتظار صدور' }}
            </span>
          </div>

          <div>
            <span class="text-[10px] text-slate-400 block">تسویه حساب کرایه و کالا:</span>
            <span class="font-bold text-slate-800 text-[11px] block mt-0.5">
              {{ FREIGHT_PAYMENT_MODES[selectedOrderForDrawer.freightMode]?.label || 'پرداخت آنلاین' }}
            </span>
            <span class="font-mono font-bold text-slate-900 text-xs mt-0.5 block">
              مجموع: {{ formatToman(selectedOrderForDrawer.totalAmount) }} ت
            </span>
          </div>
        </div>

        <!-- شبیه‌ساز رویداد وب‌هوک شرکت پست و پیامک -->
        <div class="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
          <div class="flex items-center justify-between">
            <span class="font-bold text-indigo-950 text-[11px]">وب‌هوک هوشمند شرکت پست & پیامک:</span>
            <span class="text-[10px] text-indigo-600 font-mono">SMS GATEWAY</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="h-7 px-2.5 rounded-lg bg-white border border-indigo-300 text-indigo-900 text-[10px] font-bold hover:bg-indigo-100 cursor-pointer"
              @click="simulateCarrierWebhook(selectedOrderForDrawer.orderNumber, 'delayed_hub')"
            >
              شبیه‌سازی باجه معطله (تاخیر)
            </button>
            <button
              type="button"
              class="h-7 px-2.5 rounded-lg bg-indigo-700 text-white text-[10px] font-bold hover:bg-indigo-800 cursor-pointer"
              @click="simulateCarrierWebhook(selectedOrderForDrawer.orderNumber, 'delivered')"
            >
              شبیه‌سازی تایید تحویل نهایی
            </button>
          </div>
        </div>

        <!-- تایم‌لاین تاریخچه وضعیت سفارش -->
        <div class="space-y-2 pt-2 border-t border-slate-100">
          <div class="flex items-center gap-1.5 font-bold text-slate-800">
            <History class="w-4 h-4 text-slate-500" />
            <span>تاریخچه عملیات و رهگیری:</span>
          </div>
          <div class="space-y-2 ps-2 border-s-2 border-slate-200 ms-2">
            <div
              v-for="(ev, idx) in selectedOrderForDrawer.timeline"
              :key="idx"
              class="relative ps-3 text-[11px]"
            >
              <div
                class="absolute -start-[17px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                :class="ev.completed ? 'bg-emerald-500' : 'bg-slate-300'"
              />
              <span class="font-bold text-slate-800 block">{{ ev.title }}</span>
              <span class="text-slate-500 text-[10px] block">{{ ev.description }}</span>
              <span class="text-slate-400 font-mono text-[9px] block">{{ ev.timestamp }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- فوتر دراور با دکمه انتقال مرحله -->
      <div class="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
        <span class="text-[11px] text-slate-500">تغییر مرحله:</span>
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold cursor-pointer"
            @click="transitionOrderStage(selectedOrderForDrawer.orderNumber, 'picking')"
          >
            انبارداری
          </button>
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11px] font-bold cursor-pointer"
            @click="transitionOrderStage(selectedOrderForDrawer.orderNumber, 'packing')"
          >
            بسته‌بندی
          </button>
          <button
            type="button"
            class="h-8 px-2.5 rounded-lg bg-ink text-white hover:bg-ink/90 text-[11px] font-bold cursor-pointer"
            @click="transitionOrderStage(selectedOrderForDrawer.orderNumber, 'shipped')"
          >
            تحویل به پست
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
