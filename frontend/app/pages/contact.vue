<!-- frontend/app/pages/contact.vue -->
<script setup lang="ts">
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  Send,
  HelpCircle,
  ArrowLeft,
  CheckCircle2,
} from '@lucide/vue'
import { z } from 'zod'
import { toEn, toFa } from '~/utils/format'
import { iranianMobileRegex } from '~/utils/validation'
import { toast } from 'vue-sonner'

useSeoMeta({
  title: 'تماس با کانسیرژ | کراس',
  description: 'ارتباط مستقیم با تیم پشتیبانی و کانسیرژ اختصاصی پوشاک ورزشی کراس جهت مشاوره سایز، سفارش‌ها و خدمات پس از فروش',
})

const route = useRoute()

const contactInfo = [
  {
    icon: Phone,
    title: 'پشتیبانی و کانسیرژ تلفنی',
    value: '۰۲۱-۲۲۰۰۹۹۸۸',
    link: 'tel:02122009988',
    description: 'شنبه تا چهارشنبه ۹ الی ۱۸ | پنجشنبه‌ها ۹ الی ۱۳',
  },
  {
    icon: Mail,
    title: 'مکاتبه الکترونیک',
    value: 'concierge@keras.ir',
    link: 'mailto:concierge@keras.ir',
    description: 'پاسخگویی تضمینی ظرف حداکثر ۴ ساعت کاری',
  },
  {
    icon: MapPin,
    title: 'شوروم مرکزی و آتلیه طراحی',
    value: 'تهران، خیابان ولیعصر، بالاتر از پارک‌وی، ساختمان کراس، طبقه ۴',
    link: 'https://maps.google.com',
    description: 'بازدید حضوری صرفاً با هماهنگی و وقت قبلی',
  },
]

const subjectOptions = [
  { value: 'order', label: 'پیگیری سفارش و زمان ارسال' },
  { value: 'sizing', label: 'مشاوره سایزبندی و تناسب اندام' },
  { value: 'return', label: 'درخواست بازگشت یا تعویض کالا' },
  { value: 'collab', label: 'پیشنهاد همکاری تجاری و نمایندگی' },
  { value: 'other', label: 'سایر پرسش‌ها و نظرات' },
]

const contactSchema = z.object({
  fullName: z.string().min(3, 'نام و نام خانوادگی باید حداقل ۳ حرف باشد.'),
  phoneNumber: z.string().regex(iranianMobileRegex, 'شماره موبایل نامعتبر است (فرمت: ۰۹xxxxxxxxx).'),
  subject: z.string().min(1, 'لطفاً موضوع پیام خود را انتخاب نمایید.'),
  message: z.string().min(10, 'متن پیام باید حداقل شامل ۱۰ حرف باشد.'),
})

const form = reactive({
  fullName: '',
  phoneNumber: '',
  subject: (route.query.subject as string) || 'order',
  message: '',
})

const formError = ref('')
const isSubmitting = ref(false)
const isSubmittedSuccessfully = ref(false)

const handleSubmit = async () => {
  formError.value = ''
  const cleanPhone = toEn(form.phoneNumber.trim())

  const result = contactSchema.safeParse({
    fullName: form.fullName.trim(),
    phoneNumber: cleanPhone,
    subject: form.subject,
    message: form.message.trim(),
  })

  if (!result.success) {
    formError.value = result.error.errors[0]?.message || 'اطلاعات وارد شده نامعتبر است.'
    return
  }

  isSubmitting.value = true
  try {
    // شبیه‌سازی ارسال پیام به سیستم کانسیرژ
    await new Promise((resolve) => setTimeout(resolve, 800))
    isSubmittedSuccessfully.value = true
    toast.success('پیام شما با موفقیت ثبت شد. کانسیرژ کراس به زودی با شما تماس خواهد گرفت.')
    form.fullName = ''
    form.phoneNumber = ''
    form.message = ''
  } catch {
    toast.error('خطا در ارسال پیام. لطفاً مجدداً تلاش فرمایید.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20">
    <!-- هدر صفحه تماس -->
    <section class="border-b border-sand/60 bg-sand/20 py-16 sm:py-20">
      <div class="container mx-auto px-4 max-w-4xl text-center space-y-4">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose/10 text-rose text-xs font-bold">
          <Sparkles class="w-3.5 h-3.5" />
          <span>کانسیرژ و امور مشتریان</span>
        </div>

        <h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
          همواره در کنار شما هستیم
        </h1>

        <p class="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
          برای راهنمایی دقیق در انتخاب سایز، پیگیری سفارش‌ها یا هماهنگی بازگشت کالا، تیم کانسیرژ کراس با کمال میل پاسخگوی شماست.
        </p>
      </div>
    </section>

    <!-- کارت‌های راه‌های ارتباطی -->
    <section class="py-12 container mx-auto px-4 max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="info in contactInfo"
          :key="info.title"
          class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-3 shadow-2xs flex flex-col justify-between"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-sand/40 text-rose flex items-center justify-center">
              <component :is="info.icon" class="w-5 h-5" />
            </div>
            <h2 class="text-sm font-bold text-ink">{{ info.title }}</h2>
            <a
              :href="info.link"
              class="text-xs font-bold font-mono text-rose hover:underline block leading-relaxed"
              dir="ltr"
            >
              {{ info.value }}
            </a>
          </div>
          <p class="text-[11px] text-muted-foreground pt-3 border-t border-sand/40 leading-relaxed">
            {{ info.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- فرم ارسال پیام و سوالات متداول -->
    <section class="container mx-auto px-4 max-w-5xl pt-4">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- ستون فرم پیام -->
        <div class="lg:col-span-7 rounded-3xl border border-sand bg-white p-6 sm:p-10 shadow-2xs space-y-6">
          <div class="space-y-1">
            <h2 class="text-lg font-bold text-ink">ارسال پیام به کانسیرژ کراس</h2>
            <p class="text-xs text-muted-foreground">فرم زیر را تکمیل فرمایید تا کارشناسان ما در سریع‌ترین زمان پاسخ دهند.</p>
          </div>

          <div
            v-if="isSubmittedSuccessfully"
            class="rounded-2xl border border-sage/30 bg-sage/10 p-6 text-center space-y-3"
          >
            <CheckCircle2 class="w-10 h-10 text-sage mx-auto" />
            <h3 class="text-sm font-bold text-ink">پیام شما با موفقیت دریافت شد</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              کارشناسان کانسیرژ حداکثر ظرف ۴ ساعت کاری با شماره همراه شما تماس خواهند گرفت.
            </p>
            <button
              type="button"
              class="text-xs font-bold text-rose hover:underline pt-2 cursor-pointer"
              @click="isSubmittedSuccessfully = false"
            >
              ارسال پیام جدید
            </button>
          </div>

          <form v-else class="space-y-4" @submit.prevent="handleSubmit">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- نام و نام خانوادگی -->
              <div class="space-y-1.5">
                <label for="contact-name" class="text-xs font-bold text-ink">
                  نام و نام خانوادگی <span class="text-rose">*</span>
                </label>
                <input
                  id="contact-name"
                  v-model="form.fullName"
                  type="text"
                  placeholder="مثال: سارا ملکی"
                  class="w-full h-11 rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all"
                >
              </div>

              <!-- شماره موبایل -->
              <div class="space-y-1.5">
                <label for="contact-phone" class="text-xs font-bold text-ink">
                  شماره تلفن همراه <span class="text-rose">*</span>
                </label>
                <input
                  id="contact-phone"
                  v-model="form.phoneNumber"
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  class="w-full h-11 rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all text-start"
                >
              </div>
            </div>

            <!-- موضوع پیام -->
            <div class="space-y-1.5">
              <label for="contact-subject" class="text-xs font-bold text-ink">موضوع پیام</label>
              <select
                id="contact-subject"
                v-model="form.subject"
                class="w-full h-11 rounded-xl border border-sand bg-sand/15 px-3.5 text-xs text-ink focus:border-rose focus:bg-white focus:outline-none transition-all cursor-pointer"
              >
                <option v-for="opt in subjectOptions" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <!-- متن پیام -->
            <div class="space-y-1.5">
              <label for="contact-message" class="text-xs font-bold text-ink">
                متن پیام <span class="text-rose">*</span>
              </label>
              <textarea
                id="contact-message"
                v-model="form.message"
                rows="4"
                placeholder="توضیحات، شماره سفارش یا درخواست مورد نظر خود را بنویسید..."
                class="w-full rounded-xl border border-sand bg-sand/15 p-3.5 text-xs text-ink placeholder:text-muted-foreground focus:border-rose focus:bg-white focus:outline-none transition-all leading-relaxed"
              />
            </div>

            <p v-if="formError" class="text-xs text-destructive font-medium pt-1">
              {{ formError }}
            </p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full h-12 rounded-xl bg-rose text-white hover:bg-rose/90 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <template v-else>
                <Send class="w-4 h-4" />
                <span>ثبت و ارسال پیام</span>
              </template>
            </button>
          </form>
        </div>

        <!-- ستون کناری: پرسش‌های متداول و ساعات کاری -->
        <div class="lg:col-span-5 space-y-6">
          <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-4 shadow-2xs">
            <div class="w-10 h-10 rounded-2xl bg-sand/40 text-ink flex items-center justify-center">
              <HelpCircle class="w-5 h-5 text-rose" />
            </div>
            <h3 class="text-base font-bold text-ink">پاسخ‌های فوری در بخش FAQ</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              بسیاری از سوالات مربوط به زمان ارسال سفارش‌ها، استانداردهای سایزبندی، رویه تعویض ۷ روزه و نحوه شست‌وشو در صفحه پرسش‌های متداول گردآوری شده‌اند.
            </p>
            <div class="pt-2">
              <NuxtLink
                to="/faq"
                class="inline-flex items-center gap-2 text-xs font-bold text-rose hover:underline"
              >
                <span>مشاهده پرسش‌های متداول</span>
                <ArrowLeft class="w-3.5 h-3.5" />
              </NuxtLink>
            </div>
          </div>

          <div class="rounded-3xl border border-sand bg-white p-6 sm:p-8 space-y-3 shadow-2xs">
            <div class="flex items-center gap-2 text-ink">
              <Clock class="w-4 h-4 text-sage" />
              <h4 class="text-xs font-bold">ساعات پاسخگویی کانسیرژ</h4>
            </div>
            <div class="text-xs text-muted-foreground space-y-1.5 pt-1">
              <div class="flex justify-between">
                <span>شنبه تا چهارشنبه:</span>
                <span class="font-bold text-ink font-mono">{{ toFa('09:00') }} الی {{ toFa('18:00') }}</span>
              </div>
              <div class="flex justify-between">
                <span>پنجشنبه‌ها:</span>
                <span class="font-bold text-ink font-mono">{{ toFa('09:00') }} الی {{ toFa('13:00') }}</span>
              </div>
              <div class="flex justify-between text-muted-foreground/80">
                <span>جمعه‌ها و تعطیلات رسمی:</span>
                <span>پاسخگویی از طریق ایمیل</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
