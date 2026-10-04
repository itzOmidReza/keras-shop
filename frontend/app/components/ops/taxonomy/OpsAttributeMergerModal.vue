<!-- frontend/app/components/ops/taxonomy/OpsAttributeMergerModal.vue -->
<script setup lang="ts">
import { ArrowLeftRight, Check, X, AlertTriangle } from '@lucide/vue'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'
import { toast } from 'vue-sonner'

const props = defineProps<{
  open: boolean
  initialSourceId?: string
}>()

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const { colorSwatches, mergeColors } = useOpsTaxonomy()

const sourceColorId = ref('')
const targetColorId = ref('')

watch(
  () => props.initialSourceId,
  (id) => {
    if (id) sourceColorId.value = id
  },
  { immediate: true },
)

const handleMerge = () => {
  if (!sourceColorId.value || !targetColorId.value) {
    toast.error('لطفاً هم رنگ مبدا و هم رنگ مقصد را انتخاب نمایید.')
    return
  }
  if (sourceColorId.value === targetColorId.value) {
    toast.error('رنگ مبدا و مقصد نمی‌توانند یکسان باشند.')
    return
  }

  const success = mergeColors(sourceColorId.value, targetColorId.value)
  if (success) {
    emit('update:open', false)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="sm:max-w-md bg-white text-slate-900 border border-slate-200/90 rounded-2xl shadow-xl font-sans">
      <DialogHeader>
        <DialogTitle class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
          <ArrowLeftRight class="w-4 h-4 text-amber-600" />
          <span>ادغام هوشمند ویژگی‌های تکراری</span>
        </DialogTitle>
        <DialogDescription class="text-xs text-slate-500">
          انتقال خودکار کلیه محصولات به صفت مرجع و پاکسازی رکوردهای اضافی
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-2 text-xs">
        <div class="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
          <AlertTriangle class="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
          <p class="leading-relaxed text-[11px]">
            با ادغام، تمام کالاهای متصل به رنگ مبدا به رنگ مقصد پیوند داده می‌شوند و صفت مبدا از سیستم پاک خواهد شد.
          </p>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">صفت مبدا (جهت حذف و ادغام):</label>
          <select
            v-model="sourceColorId"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden font-medium"
          >
            <option value="" disabled>
              انتخاب صفت مبدا...
            </option>
            <option
              v-for="color in colorSwatches"
              :key="color.id"
              :value="color.id"
            >
              {{ color.name }} ({{ color.inUseCount }} محصول)
            </option>
          </select>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">صفت مقصد (صفت نهایی مرجع):</label>
          <select
            v-model="targetColorId"
            class="w-full h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 outline-hidden font-medium"
          >
            <option value="" disabled>
              انتخاب صفت مقصد...
            </option>
            <option
              v-for="color in colorSwatches"
              :key="color.id"
              :value="color.id"
              :disabled="color.id === sourceColorId"
            >
              {{ color.name }} ({{ color.inUseCount }} محصول)
            </option>
          </select>
        </div>
      </div>

      <DialogFooter class="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/80">
        <button
          type="button"
          class="h-9 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          @click="emit('update:open', false)"
        >
          <X class="w-3.5 h-3.5" />
          <span>انصراف</span>
        </button>

        <button
          type="button"
          class="h-9 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          @click="handleMerge"
        >
          <Check class="w-3.5 h-3.5" />
          <span>تایید و ادغام صفات</span>
        </button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
