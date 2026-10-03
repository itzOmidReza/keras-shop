<script setup lang="ts">
import { Plus, Trash2, MapPin } from '@lucide/vue'
import { toFa } from '~/utils/format'
import type { UserAddress } from '~/types/domain'

defineProps<{
  addresses: UserAddress[]
}>()

const emit = defineEmits<{
  (e: 'openAddressModal'): void
  (e: 'setDefaultAddress' | 'deleteAddress', id: string): void
}>()
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-bold text-ink">نشانی‌های ثبت‌شده</h2>
        <p class="text-xs text-muted-foreground mt-0.5">آدرس‌های ذخیره شده جهت تسریع در فرآیند ثبت سفارش</p>
      </div>

      <button
        type="button"
        class="h-10 px-4 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs inline-flex items-center gap-2 shadow-xs transition-all cursor-pointer"
        @click="emit('openAddressModal')"
      >
        <Plus class="w-4 h-4" />
        <span>افزودن نشانی جدید</span>
      </button>
    </div>

    <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="addr in addresses"
        :key="addr.id"
        class="rounded-3xl border bg-white p-5 space-y-3 transition-all relative"
        :class="addr.isDefault ? 'border-rose shadow-xs ring-1 ring-rose/20' : 'border-sand shadow-2xs'"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-ink">{{ addr.title }}</span>
            <span
              v-if="addr.isDefault"
              class="rounded-full bg-rose/10 text-rose text-[10px] font-bold px-2 py-0.5"
            >
              پیش‌فرض
            </span>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!addr.isDefault"
              type="button"
              class="text-[11px] font-bold text-muted-foreground hover:text-rose cursor-pointer"
              @click="emit('setDefaultAddress', addr.id)"
            >
              انتخاب به عنوان پیش‌فرض
            </button>

            <button
              type="button"
              class="w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="حذف نشانی"
              @click="emit('deleteAddress', addr.id)"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p class="text-xs text-ink leading-relaxed">
          {{ addr.province }}، {{ addr.city }}، {{ addr.exactAddress }}
          <span v-if="addr.buildingNumber">، پلاک {{ toFa(addr.buildingNumber) }}</span>
          <span v-if="addr.unit">، واحد {{ toFa(addr.unit) }}</span>
        </p>

        <div class="pt-2 border-t border-sand/60 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground">
          <span>تحویل‌گیرنده: {{ addr.fullName }}</span>
          <span class="font-mono">کد پستی: {{ toFa(addr.postalCode) }}</span>
        </div>
      </div>
    </div>

    <div v-else class="rounded-3xl border border-sand bg-white p-12 text-center space-y-3">
      <MapPin class="w-12 h-12 text-sand mx-auto" />
      <h3 class="text-sm font-bold text-ink">هنوز نشانی ثبت نکرده‌اید</h3>
      <p class="text-xs text-muted-foreground">برای سهولت در فرآیند خرید، نشانی منزل یا محل کار خود را اضافه کنید.</p>
    </div>
  </div>
</template>
