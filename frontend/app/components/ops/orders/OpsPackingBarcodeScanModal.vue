<!-- frontend/app/components/ops/orders/OpsPackingBarcodeScanModal.vue -->
<script setup lang="ts">
import { ScanBarcode, CheckCircle2, AlertCircle, Printer, X, Sparkles } from '@lucide/vue'
import { toast } from 'vue-sonner'
import { toFa } from '~/utils/format'

interface PackingItem {
  sku: string
  title: string
  color: string
  size: string
  scanned: boolean
}

defineProps<{
  open: boolean
  orderId?: string
  customerName?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'verified', trackingCode: string): void
}>()

const scanInput = ref('')
const items = ref<PackingItem[]>([
  { sku: 'KRS-COAT-KSH-M', title: 'پالتو پشمی کشمیر دست‌دوز', color: 'مشکی موکا', size: 'M', scanned: false },
  { sku: 'KRS-BLS-SLK-FS', title: 'شومیز ابریشم سیلک طبیعی', color: 'شنی نچرال', size: 'Free Size', scanned: false },
])

const allScanned = computed(() => items.value.length > 0 && items.value.every(i => i.scanned))
const scannedCount = computed(() => items.value.filter(i => i.scanned).length)

const handleScanSubmit = () => {
  const query = scanInput.value.trim().toUpperCase()
  if (!query) return

  const found = items.value.find(i => i.sku.toUpperCase() === query && !i.scanned)
  if (found) {
    found.scanned = true
    toast.success(`بارکد کالا تایید شد: ${found.title}`)
    scanInput.value = ''
  } else {
    toast.error('بارکد اسکن‌شده در این سفارش یافت نشد یا قبلاً تایید گردیده است')
  }
}

const handleSimulateScanAll = () => {
  items.value.forEach(i => (i.scanned = true))
  toast.success('تمامی اقلام مرسوله به صورت خودکار تایید فیزیکی شدند')
}

const handleFinalizeAndGenerateSlip = () => {
  if (!allScanned.value) {
    toast.error('پیش از صدور بارکد پست، تمامی اقلام باید اسکن شوند')
    return
  }

  const generatedBarcode = `18939631110000${Math.floor(1000000000 + Math.random() * 9000000000)}`
  toast.success(`بارکد ۲۴ رقمی شرکت ملی پست صادر شد: ${generatedBarcode}`)
  emit('verified', generatedBarcode)
  emit('update:open', false)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div class="bg-white rounded-2xl border border-sand shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div class="p-5 border-b border-sand flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg bg-sand/40 text-ink flex items-center justify-center">
            <ScanBarcode class="w-4 h-4 text-rose" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-ink">میز بازرسی و اسکن بارکد اقلام مرسوله</h3>
            <p class="text-2xs text-muted-foreground mt-0.5">سفارش {{ orderId || 'KRS-1405-9921' }} • {{ customerName || 'سارا رادمنش' }}</p>
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
        <!-- ورودی اسکنر بارکد -->
        <div class="space-y-1.5">
          <label class="text-2xs font-bold text-muted-foreground flex items-center justify-between">
            <span>اسکن بارکد دستی یا اسکنر بی‌سیم:</span>
            <button
              type="button"
              class="text-rose text-2xs font-bold hover:underline cursor-pointer flex items-center gap-1"
              @click="handleSimulateScanAll"
            >
              <Sparkles class="w-3 h-3" />
              <span>تست سریع: اسکن همه اقلام</span>
            </button>
          </label>
          <div class="flex gap-2">
            <input
              v-model="scanInput"
              type="text"
              placeholder="کد SKU یا بارکد (مثال: KRS-COAT-KSH-M)..."
              class="flex-1 h-9 px-3 rounded-xl border border-sand bg-paper text-xs font-mono text-ink focus:outline-hidden focus:border-ink"
              @keydown.enter.prevent="handleScanSubmit"
            >
            <button
              type="button"
              class="h-9 px-3.5 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 cursor-pointer"
              @click="handleScanSubmit"
            >
              ثبت اسکن
            </button>
          </div>
        </div>

        <!-- پیشرفت اسکن فیزیکی اقلام -->
        <div class="p-3 bg-sand/20 rounded-xl space-y-2">
          <div class="flex items-center justify-between text-2xs font-bold text-ink">
            <span>وضعیت تایید فیزیکی اقلام بسته:</span>
            <span class="font-mono">{{ toFa(scannedCount) }} از {{ toFa(items.length) }} قلم</span>
          </div>

          <div class="space-y-2">
            <div
              v-for="item in items"
              :key="item.sku"
              class="p-2.5 rounded-lg border bg-white flex items-center justify-between text-xs transition-all"
              :class="item.scanned ? 'border-emerald-300 bg-emerald-50/30' : 'border-sand/70'"
            >
              <div class="flex items-center gap-2">
                <CheckCircle2 v-if="item.scanned" class="w-4 h-4 text-emerald-600 shrink-0" />
                <AlertCircle v-else class="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div class="font-bold text-ink">{{ item.title }}</div>
                  <div class="text-2xs font-mono text-muted-foreground">{{ item.sku }} • {{ item.color }} (سایز {{ item.size }})</div>
                </div>
              </div>

              <span
                class="px-2 py-0.5 rounded text-[10px] font-bold"
                :class="item.scanned ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'"
              >
                {{ item.scanned ? 'تایید شد' : 'در انتظار اسکن' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- فوتر صدور بارکد پست -->
      <div class="p-4 bg-sand/10 border-t border-sand flex items-center justify-between">
        <span class="text-2xs text-muted-foreground">
          {{ allScanned ? 'تمامی اقلام با موفقیت تایید فیزیکی شدند.' : 'صدور بارکد پیشتاز مشروط به تایید کامل است.' }}
        </span>

        <button
          type="button"
          :disabled="!allScanned"
          class="h-9 px-4 rounded-xl bg-ink text-paper text-xs font-bold hover:bg-ink/90 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          @click="handleFinalizeAndGenerateSlip"
        >
          <Printer class="w-4 h-4 text-rose" />
          <span>صدور بارکد ۲۴ رقمی پست</span>
        </button>
      </div>
    </div>
  </div>
</template>
