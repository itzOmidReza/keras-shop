<script setup lang="ts">
import { X } from '@lucide/vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '~/components/ui/dialog'
import { IRAN_PROVINCES } from '~/utils/validation'

const {
  isAddressModalOpen,
  newAddressForm,
  addressFormError,
  handleCreateAddress,
  authStore,
} = useAccountDashboard()
</script>

<template>
  <Dialog :open="isAddressModalOpen" @update:open="(val: boolean) => isAddressModalOpen = val">
    <DialogContent class="max-w-lg w-[calc(100%-2rem)] rounded-3xl border border-sand bg-paper p-6 sm:p-8 shadow-xl text-ink" dir="rtl">
      <button
        type="button"
        class="absolute inset-e-4 top-4 w-8 h-8 rounded-full bg-sand/30 hover:bg-sand/60 text-ink/70 hover:text-ink flex items-center justify-center transition-colors cursor-pointer"
        aria-label="بستن"
        @click="isAddressModalOpen = false"
      >
        <X class="w-4 h-4" />
      </button>

      <DialogHeader class="space-y-1 text-start">
        <DialogTitle class="text-lg font-bold text-ink">افزودن نشانی جدید</DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground">
          اطلاعات دقیق پستی جهت دریافت سفارش‌های خریداری شده
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4 mt-4" @submit.prevent="handleCreateAddress">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label for="addr-title" class="text-xs font-bold text-ink">عنوان نشانی</label>
            <input
              id="addr-title"
              v-model="newAddressForm.title"
              type="text"
              placeholder="منزل، محل کار..."
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
            >
          </div>

          <div class="space-y-1">
            <label for="addr-fullname" class="text-xs font-bold text-ink">نام تحویل‌گیرنده</label>
            <input
              id="addr-fullname"
              v-model="newAddressForm.fullName"
              type="text"
              placeholder="نام و نام خانوادگی"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label for="addr-phone" class="text-xs font-bold text-ink">شماره تماس تحویل‌گیرنده</label>
            <input
              id="addr-phone"
              v-model="newAddressForm.phoneNumber"
              type="tel"
              dir="ltr"
              placeholder="09123456789"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs font-mono text-ink focus:border-rose focus:outline-none"
            >
          </div>

          <div class="space-y-1">
            <label for="addr-postal" class="text-xs font-bold text-ink">کد پستی (۱۰ رقم)</label>
            <input
              id="addr-postal"
              v-model="newAddressForm.postalCode"
              type="text"
              dir="ltr"
              maxlength="10"
              placeholder="کد پستی ۱۰ رقمی"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs font-mono text-ink focus:border-rose focus:outline-none"
            >
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="space-y-1">
            <label for="addr-province" class="text-xs font-bold text-ink">استان</label>
            <select
              id="addr-province"
              v-model="newAddressForm.province"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
            >
              <option v-for="prov in IRAN_PROVINCES" :key="prov" :value="prov">
                {{ prov }}
              </option>
            </select>
          </div>

          <div class="space-y-1">
            <label for="addr-city" class="text-xs font-bold text-ink">شهر</label>
            <input
              id="addr-city"
              v-model="newAddressForm.city"
              type="text"
              placeholder="نام شهر"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
            >
          </div>
        </div>

        <div class="space-y-1">
          <label for="addr-exact" class="text-xs font-bold text-ink">آدرس پستی دقیق</label>
          <textarea
            id="addr-exact"
            v-model="newAddressForm.exactAddress"
            rows="2"
            placeholder="خیابان، کوچه، پلاک، واحد..."
            class="w-full rounded-xl border border-sand bg-white p-3 text-xs text-ink focus:border-rose focus:outline-none leading-relaxed"
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label for="addr-building" class="text-xs font-bold text-ink">پلاک</label>
            <input
              id="addr-building"
              v-model="newAddressForm.buildingNumber"
              type="text"
              placeholder="پلاک"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
            >
          </div>

          <div class="space-y-1">
            <label for="addr-unit" class="text-xs font-bold text-ink">واحد</label>
            <input
              id="addr-unit"
              v-model="newAddressForm.unit"
              type="text"
              placeholder="واحد"
              class="w-full h-10 rounded-xl border border-sand bg-white px-3 text-xs text-ink focus:border-rose focus:outline-none"
            >
          </div>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input
            id="addr-default"
            v-model="newAddressForm.isDefault"
            type="checkbox"
            class="w-4 h-4 rounded border-sand text-rose focus:ring-rose accent-rose"
          >
          <label for="addr-default" class="text-xs font-bold text-ink cursor-pointer">
            تنظیم به عنوان نشانی پیش‌فرض تحویل سفارش
          </label>
        </div>

        <p v-if="addressFormError" class="text-xs text-destructive font-medium pt-1">
          {{ addressFormError }}
        </p>

        <div class="pt-2">
          <button
            type="submit"
            :disabled="authStore.isLoading"
            class="w-full h-11 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <span>ثبت نشانی</span>
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
