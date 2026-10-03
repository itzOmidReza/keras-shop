<script setup lang="ts">
import { X, Upload, Send } from '@lucide/vue'
import type { JobPosition } from '~/composables/careers/useCareers'

defineProps<{
  activeJob: JobPosition | null
  isOpen: boolean
  resumeFileName: string | null
  formError: string | null
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  (e: 'close' | 'fileSimulate' | 'submit'): void
}>()

const applicantName = defineModel<string>('applicantName', { default: '' })
const applicantPhone = defineModel<string>('applicantPhone', { default: '' })
const applicantEmail = defineModel<string>('applicantEmail', { default: '' })
const applicantPortfolio = defineModel<string>('applicantPortfolio', { default: '' })
const applicantCoverNote = defineModel<string>('applicantCoverNote', { default: '' })
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen && activeJob"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      @click.self="emit('close')"
    >
      <div
        class="relative w-full max-w-xl bg-white rounded-3xl border border-sand overflow-hidden shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6"
        dir="rtl"
      >
        <!-- هدر مدال -->
        <div class="flex items-center justify-between border-b border-sand/60 pb-4">
          <div>
            <span class="text-[11px] font-bold text-rose">
              ثبت درخواست همکاری
            </span>
            <h3 class="text-lg font-bold text-ink">
              {{ activeJob.title }}
            </h3>
          </div>

          <button
            type="button"
            class="w-9 h-9 rounded-full bg-sand/30 hover:bg-sand/60 flex items-center justify-center text-ink transition-colors cursor-pointer"
            aria-label="بستن"
            @click="emit('close')"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- هشدار خطا -->
        <div
          v-if="formError"
          class="rounded-xl bg-destructive/10 border border-destructive/20 p-3 text-xs text-destructive font-medium"
        >
          {{ formError }}
        </div>

        <!-- فرم -->
        <form class="space-y-4" @submit.prevent="emit('submit')">
          <div class="space-y-1">
            <label for="careers-fullname" class="text-xs font-bold text-ink">
              نام و نام خانوادگی:
            </label>
            <input
              id="careers-fullname"
              v-model="applicantName"
              type="text"
              placeholder="مثال: سارا کیانی"
              class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose"
              required
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-1">
              <label for="careers-phone" class="text-xs font-bold text-ink">
                شماره موبایل:
              </label>
              <input
                id="careers-phone"
                v-model="applicantPhone"
                type="text"
                dir="ltr"
                placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose text-start font-mono"
                required
              >
            </div>

            <div class="space-y-1">
              <label for="careers-email" class="text-xs font-bold text-ink">
                آدرس ایمیل:
              </label>
              <input
                id="careers-email"
                v-model="applicantEmail"
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose text-start font-mono"
                required
              >
            </div>
          </div>

          <div class="space-y-1">
            <label for="careers-portfolio" class="text-xs font-bold text-ink">
              لینک رزومه آنلاین، گیت‌هاب یا لینکدین:
            </label>
            <input
              id="careers-portfolio"
              v-model="applicantPortfolio"
              type="text"
              dir="ltr"
              placeholder="https://linkedin.com/in/... یا github.com/..."
              class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose text-start font-mono"
            >
          </div>

          <!-- پیوست رزومه -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-ink block">
              فایل رزومه (PDF):
            </label>
            <div
              class="rounded-2xl border-2 border-dashed border-sand bg-sand/15 p-4 text-center cursor-pointer hover:bg-sand/25 transition-colors"
              @click="emit('fileSimulate')"
            >
              <Upload class="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <span class="text-xs font-bold text-ink block">
                {{ resumeFileName || 'کلیک برای انتخاب فایل رزومه (PDF)' }}
              </span>
              <span class="text-[10px] text-muted-foreground">
                حداکثر حجم ۱۰ مگابایت
              </span>
            </div>
          </div>

          <div class="space-y-1">
            <label for="careers-covernote" class="text-xs font-bold text-ink">
              یادداشت کوتاه یا معرفی تجربیات:
            </label>
            <textarea
              id="careers-covernote"
              v-model="applicantCoverNote"
              rows="3"
              placeholder="توضیح مختصری از سوابق و دلایل علاقه‌مندی به همکاری با کراس..."
              class="w-full rounded-xl border border-sand bg-white py-2.5 px-3 text-xs text-ink placeholder:text-muted-foreground focus:outline-none focus:border-rose resize-none"
            />
          </div>

          <div class="pt-2 flex justify-end gap-3">
            <button
              type="button"
              class="py-2.5 px-4 rounded-xl border border-sand bg-white text-muted-foreground hover:text-ink text-xs font-bold cursor-pointer transition-colors"
              @click="emit('close')"
            >
              انصراف
            </button>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="py-2.5 px-6 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Send class="w-4 h-4" />
              <span>{{ isSubmitting ? 'در حال ارسال رزومه...' : 'ثبت نهایی درخواست' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
