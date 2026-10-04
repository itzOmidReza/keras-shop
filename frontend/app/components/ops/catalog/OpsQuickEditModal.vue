<!-- frontend/app/components/ops/catalog/OpsQuickEditModal.vue -->
<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Sparkles, Check, X } from '@lucide/vue'
import type { ProductDetail } from '~/types/domain'

const props = defineProps<{
  open: boolean
  product: ProductDetail | null
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
  (e: 'saved'): void
}>()

const basePrice = ref<number>(0)
const salePrice = ref<number>(0)
const isActive = ref<boolean>(true)
const sizeStocks = ref<Record<string, number>>({
  XS: 0,
  S: 0,
  M: 0,
  L: 0,
  XL: 0,
  Free: 0,
})

watch(
  () => props.product,
  (p) => {
    if (p) {
      basePrice.value = p.compare_at_price || p.base_price || p.price
      salePrice.value = p.price
      isActive.value = !!p.is_active

      const stocks: Record<string, number> = { XS: 0, S: 0, M: 0, L: 0, XL: 0, Free: 0 }
      if (p.variants && p.variants.length > 0) {
        for (const v of p.variants) {
          if (v.size && stocks[v.size] !== undefined) {
            stocks[v.size] = v.stock || 0
          }
        }
      } else {
        stocks.M = p.inStock ? 25 : 0
      }
      sizeStocks.value = stocks
    }
  },
  { immediate: true },
)

const isSaving = ref(false)

const { productsList } = useOpsProducts()

const handleSave = () => {
  if (!props.product) return

  if (salePrice.value <= 0) {
    toast.error('قیمت فروش نقدی باید بزرگ‌تر از صفر باشد.')
    return
  }

  isSaving.value = true
  try {
    const target = productsList.value.find((p) => p.id === props.product?.id)
    if (target) {
      target.price = salePrice.value
      target.base_price = basePrice.value
      target.compare_at_price = basePrice.value > salePrice.value ? basePrice.value : undefined
      target.is_active = isActive.value

      if (target.variants && target.variants.length > 0) {
        for (const v of target.variants) {
          if (v.size && sizeStocks.value[v.size] !== undefined) {
            v.stock = sizeStocks.value[v.size] ?? 0
          }
        }
      }

      const totalStock = Object.values(sizeStocks.value).reduce((a, b) => a + b, 0)
      target.inStock = totalStock > 0
    }

    toast.success(`قیمت و موجودی کالا «${props.product.title}» با موفقیت به‌روزرسانی شد.`)
    emit('saved')
    emit('update:open', false)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent
      data-testid="quick-edit-modal"
      class="sm:max-w-lg bg-white text-slate-900 border border-slate-200/90 rounded-2xl shadow-xl font-sans"
    >
      <DialogHeader>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles class="w-4 h-4" />
          </div>
          <div>
            <DialogTitle class="text-sm sm:text-base font-black text-slate-900">
              ویرایش سریع قیمت و موجودی
            </DialogTitle>
            <DialogDescription class="text-xs text-slate-500 mt-0.5 truncate max-w-sm">
              {{ product?.title }}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div v-if="product" class="space-y-4 py-3 text-xs">
        <!-- قیمت پایه و قیمت فروش نقدی -->
        <div class="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
          <div>
            <label class="block font-bold text-slate-700 mb-1">قیمت پایه (تومان)</label>
            <input
              v-model.number="basePrice"
              type="number"
              class="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono tabular-nums outline-hidden focus:border-ink"
            >
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">قیمت فروش (تومان)</label>
            <input
              v-model.number="salePrice"
              type="number"
              class="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono tabular-nums outline-hidden focus:border-ink"
            >
          </div>
        </div>

        <!-- جدول موجودی انبار به تفکیک سایزها -->
        <div>
          <label class="block font-bold text-slate-700 mb-2">موجودی انبار به تفکیک سایز</label>
          <div
            v-if="product.division === 'accessories'"
            class="p-3 bg-slate-50 rounded-xl border border-slate-200/80"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-slate-700">سایز آزاد (Free Size):</span>
              <input
                v-model.number="sizeStocks.Free"
                type="number"
                min="0"
                class="w-24 h-8 px-2.5 rounded-lg bg-white border border-slate-200 text-slate-900 text-center font-mono tabular-nums outline-hidden focus:border-ink"
              >
            </div>
          </div>
          <div v-else class="grid grid-cols-5 gap-2">
            <div
              v-for="sz in ['XS', 'S', 'M', 'L', 'XL']"
              :key="sz"
              class="p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-center"
            >
              <span class="font-bold font-mono text-[11px] text-slate-600 block mb-1">{{ sz }}</span>
              <input
                v-model.number="sizeStocks[sz]"
                type="number"
                min="0"
                class="w-full h-8 px-1 rounded-lg bg-white border border-slate-200 text-slate-900 text-center font-mono tabular-nums text-xs outline-hidden focus:border-ink"
              >
            </div>
          </div>
        </div>

        <!-- سوئیچ وضعیت عرضه کالا -->
        <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          <div>
            <span class="font-bold text-slate-800 block">وضعیت عرضه در فروشگاه</span>
            <span class="text-[11px] text-slate-500">
              {{ isActive ? 'کالا در لیست کاتالوگ قابل خرید است' : 'کالا به حالت آرشیو پنهان شده است' }}
            </span>
          </div>
          <button
            type="button"
            class="h-8 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            :class="isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'"
            @click="isActive = !isActive"
          >
            {{ isActive ? 'فعال' : 'غیرفعال' }}
          </button>
        </div>
      </div>

      <DialogFooter class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
        <button
          type="button"
          class="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          @click="emit('update:open', false)"
        >
          <X class="w-3.5 h-3.5" />
          <span>انصراف</span>
        </button>
        <button
          type="button"
          data-testid="quick-edit-save-btn"
          class="h-9 px-4 rounded-xl bg-ink hover:bg-ink/90 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          :disabled="isSaving"
          @click="handleSave"
        >
          <Check class="w-3.5 h-3.5" />
          <span>{{ isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات سریع' }}</span>
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
