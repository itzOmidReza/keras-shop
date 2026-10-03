<script setup lang="ts">
import { CheckCircle2 } from '@lucide/vue'
import { toFa } from '~/utils/format'

const {
  authStore,
  profileForm,
  handleSaveProfile,
} = useAccountDashboard()
</script>

<template>
  <div class="max-w-xl">
    <form class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-5 shadow-2xs" @submit.prevent="handleSaveProfile">
      <div class="space-y-1">
        <h2 class="text-base font-bold text-ink">اطلاعات کاربری</h2>
        <p class="text-xs text-muted-foreground">مشخصات هویتی و راه‌های ارتباطی ثبت شده در حساب شما</p>
      </div>

      <div class="space-y-4 pt-2">
        <!-- شماره موبایل (غیرقابل ویرایش) -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-ink flex items-center justify-between">
            <span>شماره تلفن همراه</span>
            <span class="text-[10px] text-sage font-bold flex items-center gap-1">
              <CheckCircle2 class="w-3 h-3" />
              <span>تایید شده با پیامک</span>
            </span>
          </label>
          <input
            type="text"
            :value="toFa(authStore.user?.phoneNumber || '')"
            disabled
            class="w-full h-11 rounded-xl border border-sand bg-sand/20 px-4 text-xs font-mono text-muted-foreground cursor-not-allowed"
          >
        </div>

        <!-- نام و نام خانوادگی -->
        <div class="space-y-1.5">
          <label for="profile-name" class="text-xs font-bold text-ink">نام و نام خانوادگی</label>
          <input
            id="profile-name"
            v-model="profileForm.fullName"
            type="text"
            placeholder="مثال: سارا ملکی"
            class="w-full h-11 rounded-xl border border-sand bg-white px-4 text-xs text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all"
          >
        </div>

        <!-- آدرس ایمیل -->
        <div class="space-y-1.5">
          <label for="profile-email" class="text-xs font-bold text-ink">آدرس ایمیل (اختیاری)</label>
          <input
            id="profile-email"
            v-model="profileForm.email"
            type="email"
            dir="ltr"
            placeholder="name@example.com"
            class="w-full h-11 rounded-xl border border-sand bg-white px-4 text-xs text-ink placeholder:text-muted-foreground/60 focus:border-rose focus:ring-1 focus:ring-rose focus:outline-none transition-all"
          >
        </div>
      </div>

      <button
        type="submit"
        :disabled="authStore.isLoading"
        class="w-full h-11 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
      >
        <span>ذخیره تغییرات</span>
      </button>
    </form>
  </div>
</template>
