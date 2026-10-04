<!-- frontend/app/components/ops/orders/OpsRmaModal.vue -->
<script setup lang="ts">
import { RotateCcw, ShieldCheck, Wallet, CreditCard, X } from '@lucide/vue'
import { useOpsRMA, type RmaRequest } from '~/composables/ops/useOpsRMA'
import { formatToman } from '~/utils/format'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const { rmaRequests, approveRma, rejectRma } = useOpsRMA()
const defaultRma: RmaRequest = {
  id: 'RMA-1405-001',
  orderId: 'KRS-1405-9921',
  customerName: 'سارا رادمنش',
  customerPhone: '09121234567',
  items: [
    {
      sku: 'KRS-COAT-KSH-M',
      title: 'پالتو پشمی کشمیر دست‌دوز',
      price: 4250000,
      reason: 'سایز متناسب نبود (کوچک بودن سرشانه)',
      hygienePassed: true,
      tagsIntact: true,
      approved: false,
    },
  ],
  createdDate: '۱۴۰۵/۰۷/۱۰',
  status: 'pending_inspection',
  refundMethod: 'wallet',
  totalRefundAmount: 4250000,
}
const selectedRma = ref<RmaRequest>(rmaRequests.value[0] || defaultRma)
const selectedMethod = ref<'wallet' | 'bank_gateway'>('wallet')
const inspectorNote = ref('بافت پارچه و اتیکت اصالت سالم بررسی شد.')

const handleApprove = () => {
  approveRma(selectedRma.value.id, selectedMethod.value, inspectorNote.value)
  emit('update:open', false)
}

const handleReject = () => {
  rejectRma(selectedRma.value.id, inspectorNote.value)
  emit('update:open', false)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-rose/10 text-rose flex items-center justify-center">
            <RotateCcw class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">میز بازرسی و مدیریت مرجوعی کالا (RMA Desk)</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">درخواست {{ selectedRma.id }} • سفارش {{ selectedRma.orderId }}</p>
          </div>
        </div>
        <button
          type="button"
          class="text-muted-foreground hover:text-ink cursor-pointer p-1"
          @click="emit('update:open', false)"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-5 space-y-4">
        <!-- مشخصات مشتری و علت بازگشت -->
        <div class="p-3 bg-sand/20 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span class="font-bold text-ink">{{ selectedRma.customerName }}</span>
            <span class="text-2xs text-muted-foreground ms-2 font-mono">{{ selectedRma.customerPhone }}</span>
          </div>
          <span class="text-2xs font-bold text-rose bg-rose/10 px-2 py-0.5 rounded-full">
            {{ selectedRma.status === 'pending_inspection' ? 'در انتظار بازرسی بهداشتی' : 'تعیین تکلیف شده' }}
          </span>
        </div>

        <!-- چک‌لیست اقلام مرجوعی و بازرسی بهداشتی -->
        <div class="space-y-2">
          <label class="text-2xs font-bold text-muted-foreground">اقلام ارجاع‌شده و چک‌لیست بهداشتی:</label>
          <div
            v-for="item in selectedRma.items"
            :key="item.sku"
            class="p-3 border border-sand rounded-xl bg-paper space-y-2 text-xs"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-ink">{{ item.title }}</span>
              <span class="font-mono font-bold text-slate-800">{{ formatToman(item.price) }} تومان</span>
            </div>
            <p class="text-2xs text-muted-foreground">علت اعلامی مشتری: «{{ item.reason }}»</p>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-sand/50 text-2xs">
              <label class="flex items-center gap-1.5 cursor-pointer font-medium text-ink">
                <input v-model="item.hygienePassed" type="checkbox" class="rounded text-rose">
                <span>تست بهداشتی و عدم بوی عطر/پرو تایید شد</span>
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer font-medium text-ink">
                <input v-model="item.tagsIntact" type="checkbox" class="rounded text-rose">
                <span>برچسب پلمپ و اتیکت اصالت سالم است</span>
              </label>
            </div>
          </div>
        </div>

        <!-- انتخاب نحوه عودت وجه -->
        <div class="space-y-1.5">
          <label class="text-2xs font-bold text-muted-foreground">مسیر عودت وجه (Refund Routing):</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              class="p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              :class="selectedMethod === 'wallet' ? 'border-ink bg-ink text-paper shadow-2xs' : 'border-sand bg-white text-ink hover:bg-sand/20'"
              @click="selectedMethod = 'wallet'"
            >
              <Wallet class="w-4 h-4" />
              <span>شارژ کیف پول کاربری (آنی)</span>
            </button>
            <button
              type="button"
              class="p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
              :class="selectedMethod === 'bank_gateway' ? 'border-ink bg-ink text-paper shadow-2xs' : 'border-sand bg-white text-ink hover:bg-sand/20'"
              @click="selectedMethod = 'bank_gateway'"
            >
              <CreditCard class="w-4 h-4" />
              <span>استرداد شاپرک (پایا ۲۴ ساعته)</span>
            </button>
          </div>
        </div>

        <!-- یادداشت کارشناس بازرسی -->
        <div>
          <label class="block text-2xs font-bold text-muted-foreground mb-1">گزارش ممیزی کارشناس بازرسی:</label>
          <input
            v-model="inspectorNote"
            type="text"
            class="w-full h-9 px-3 rounded-xl border border-sand bg-white text-xs text-ink focus:outline-hidden"
          >
        </div>
      </div>

      <!-- فوتر -->
      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-between">
        <button
          type="button"
          class="text-xs font-bold text-rose hover:underline cursor-pointer"
          @click="handleReject"
        >
          رد درخواست مرجوعی
        </button>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="h-9 px-3 rounded-xl border border-sand bg-white text-xs font-bold text-ink hover:bg-sand/30 cursor-pointer"
            @click="emit('update:open', false)"
          >
            انصراف
          </button>
          <button
            type="button"
            class="h-9 px-4 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            @click="handleApprove"
          >
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>تایید نهایی و واریز وجه</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
