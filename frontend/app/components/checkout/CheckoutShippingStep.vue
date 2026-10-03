<script setup lang="ts">
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
} from '@lucide/vue'
import { IRAN_PROVINCES } from '~/utils/validation'
import type { UserAddress } from '~/types/domain'

defineProps<{
  authAddresses: UserAddress[]
  isAuthenticated: boolean
  selectedSavedAddressId: string | null
  errors: Record<string, string | undefined>
  termsError: string
}>()

const emit = defineEmits<{
  (e: 'applySavedAddress', addr: UserAddress): void
  (e: 'openAuthModal' | 'submit'): void
}>()

const fullName = defineModel<string>('fullName', { default: '' })
const phoneNumber = defineModel<string>('phoneNumber', { default: '' })
const province = defineModel<string>('province', { default: 'تهران' })
const city = defineModel<string>('city', { default: 'تهران' })
const postalCode = defineModel<string>('postalCode', { default: '' })
const exactAddress = defineModel<string>('exactAddress', { default: '' })
const buildingNumber = defineModel<string>('buildingNumber', { default: '' })
const unit = defineModel<string>('unit', { default: '' })
const notes = defineModel<string>('notes', { default: '' })
const acceptTerms = defineModel<boolean>('acceptTerms', { default: true })
</script>

<template>
  <div class="rounded-2xl border border-sand bg-white p-6 sm:p-8 shadow-2xs space-y-6">
    <div class="border-b border-sand/70 pb-4">
      <h2 class="text-lg font-bold text-ink">
        اطلاعات تحویل‌گیرنده و آدرس پستی
      </h2>
      <p class="text-xs text-muted-foreground mt-1">
        لطفاً آدرس دقیق و شماره موبایل در دسترس را جهت هماهنگی ارسال مرسوله وارد فرمایید.
      </p>
    </div>

    <!-- بخش اعضای باشگاه کراس: انتخاب از آدرس‌های ذخیره‌شده -->
    <div v-if="isAuthenticated && authAddresses.length > 0" class="rounded-2xl border border-sand bg-paper/40 p-4 space-y-3">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5 font-bold text-ink">
          <MapPin class="w-4 h-4 text-rose" />
          <span>نشانی‌های ذخیره‌شده در حساب شما</span>
        </div>
        <NuxtLink to="/account?tab=addresses" class="text-[11px] font-bold text-rose hover:underline">
          مدیریت نشانی‌ها
        </NuxtLink>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          v-for="addr in authAddresses"
          :key="addr.id"
          type="button"
          class="text-start p-3.5 rounded-xl border transition-all text-xs cursor-pointer flex flex-col justify-between gap-2"
          :class="selectedSavedAddressId === addr.id ? 'border-rose bg-white shadow-2xs ring-1 ring-rose/30' : 'border-sand bg-white/80 hover:bg-white'"
          @click="emit('applySavedAddress', addr)"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-ink">{{ addr.title }}</span>
            <span v-if="addr.isDefault" class="text-[10px] text-rose font-bold bg-rose/10 px-2 py-0.5 rounded-full">پیش‌فرض</span>
          </div>
          <p class="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {{ addr.province }}، {{ addr.city }}، {{ addr.exactAddress }}
          </p>
        </button>
      </div>
    </div>

    <!-- پیام دعوت به ورود برای کاربران مهمان -->
    <div v-else-if="!isAuthenticated" class="rounded-2xl border border-sand bg-paper/50 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-sand/40 text-rose flex items-center justify-center shrink-0">
          <Sparkles class="w-4 h-4" />
        </div>
        <div class="space-y-0.5">
          <p class="text-xs font-bold text-ink">عضو باشگاه مشتریان کراس هستید؟</p>
          <p class="text-[11px] text-muted-foreground leading-relaxed">با ورود به حساب، آدرس پستی شما خودکار بارگذاری شده و امتیاز خرید ثبت می‌شود.</p>
        </div>
      </div>
      <button
        type="button"
        class="shrink-0 px-4 py-2 rounded-xl border border-sand bg-white hover:border-rose hover:text-rose text-xs font-bold text-ink transition-colors cursor-pointer self-end sm:self-auto"
        @click="emit('openAuthModal')"
      >
        ورود با شماره موبایل
      </button>
    </div>

    <form class="space-y-5" @submit.prevent="emit('submit')">
      <!-- ردیف نام و شماره تماس -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="fullName" class="text-xs font-bold text-ink">
            نام و نام خانوادگی <span class="text-rose">*</span>
          </label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            placeholder="مثال: سارا محمدی"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
            :class="{ 'border-rose': errors.fullName }"
          >
          <span v-if="errors.fullName" class="text-[11px] text-rose block">
            {{ errors.fullName }}
          </span>
        </div>

        <div class="space-y-1.5">
          <label for="phoneNumber" class="text-xs font-bold text-ink">
            شماره موبایل <span class="text-rose">*</span>
          </label>
          <input
            id="phoneNumber"
            v-model="phoneNumber"
            type="tel"
            dir="ltr"
            placeholder="09123456789"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
            :class="{ 'border-rose': errors.phoneNumber }"
          >
          <span v-if="errors.phoneNumber" class="text-[11px] text-rose block">
            {{ errors.phoneNumber }}
          </span>
        </div>
      </div>

      <!-- ردیف استان و شهر -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="province" class="text-xs font-bold text-ink">
            استان <span class="text-rose">*</span>
          </label>
          <select
            id="province"
            v-model="province"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all cursor-pointer"
            :class="{ 'border-rose': errors.province }"
          >
            <option v-for="prov in IRAN_PROVINCES" :key="prov" :value="prov">
              {{ prov }}
            </option>
          </select>
          <span v-if="errors.province" class="text-[11px] text-rose block">
            {{ errors.province }}
          </span>
        </div>

        <div class="space-y-1.5">
          <label for="city" class="text-xs font-bold text-ink">
            شهر <span class="text-rose">*</span>
          </label>
          <input
            id="city"
            v-model="city"
            type="text"
            placeholder="مثال: تهران"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
            :class="{ 'border-rose': errors.city }"
          >
          <span v-if="errors.city" class="text-[11px] text-rose block">
            {{ errors.city }}
          </span>
        </div>
      </div>

      <!-- آدرس دقیق پستی -->
      <div class="space-y-1.5">
        <label for="exactAddress" class="text-xs font-bold text-ink">
          نشانی دقیق پستی <span class="text-rose">*</span>
        </label>
        <textarea
          id="exactAddress"
          v-model="exactAddress"
          rows="2"
          placeholder="نام خیابان اصلی و فرعی، کوچه، پلاک، زنگ یا مشخصات تکمیلی..."
          class="w-full rounded-xl border border-sand bg-sand/15 p-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all leading-relaxed"
          :class="{ 'border-rose': errors.exactAddress }"
        />
        <span v-if="errors.exactAddress" class="text-[11px] text-rose block">
          {{ errors.exactAddress }}
        </span>
      </div>

      <!-- پلاک، واحد و کد پستی -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="space-y-1.5">
          <label for="postalCode" class="text-xs font-bold text-ink">
            کد پستی (۱۰ رقمی) <span class="text-rose">*</span>
          </label>
          <input
            id="postalCode"
            v-model="postalCode"
            type="text"
            dir="ltr"
            maxlength="10"
            placeholder="1234567890"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
            :class="{ 'border-rose': errors.postalCode }"
          >
          <span v-if="errors.postalCode" class="text-[11px] text-rose block">
            {{ errors.postalCode }}
          </span>
        </div>

        <div class="space-y-1.5">
          <label for="buildingNumber" class="text-xs font-bold text-ink">
            پلاک (اختیاری)
          </label>
          <input
            id="buildingNumber"
            v-model="buildingNumber"
            type="text"
            placeholder="مثال: ۱۲"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>

        <div class="space-y-1.5">
          <label for="unit" class="text-xs font-bold text-ink">
            واحد (اختیاری)
          </label>
          <input
            id="unit"
            v-model="unit"
            type="text"
            placeholder="مثال: ۳"
            class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
          >
        </div>
      </div>

      <!-- توضیحات یا یادداشت تحویل -->
      <div class="space-y-1.5">
        <label for="notes" class="text-xs font-bold text-ink">
          یادداشت یا زمان تحویل (اختیاری)
        </label>
        <input
          id="notes"
          v-model="notes"
          type="text"
          placeholder="توضیحات تکمیلی تحویل، شماره تماس دوم و..."
          class="h-11 w-full rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
        >
      </div>

      <!-- شرایط و قوانین خرید از کراس -->
      <div class="pt-2">
        <label class="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer select-none">
          <input
            id="checkout-accept-terms"
            v-model="acceptTerms"
            type="checkbox"
            class="mt-0.5 h-4 w-4 rounded border-sand text-rose focus:ring-rose/40 cursor-pointer accent-rose"
          >
          <span class="leading-relaxed">
            <NuxtLink to="/terms" target="_blank" class="text-rose font-bold hover:underline">قوانین و مقررات</NuxtLink>
            خرید از کراس را مطالعه کرده و می‌پذیرم.
          </span>
        </label>
        <p v-if="termsError" class="text-[11px] text-destructive font-medium pt-1">
          {{ termsError }}
        </p>
      </div>

      <!-- دکمه ادامه به مرحله بعد -->
      <div class="pt-4 flex items-center justify-between border-t border-sand/70">
        <NuxtLink
          to="/cart"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-ink transition-colors"
        >
          <ArrowRight class="w-4 h-4" />
          <span>بازگشت به سبد خرید</span>
        </NuxtLink>

        <Button
          type="submit"
          size="lg"
          class="h-12 px-6 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2"
        >
          <span>انتخاب شیوه ارسال و پرداخت</span>
          <ArrowLeft class="w-4 h-4" />
        </Button>
      </div>
    </form>
  </div>
</template>
