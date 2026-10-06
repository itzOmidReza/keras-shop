<!-- frontend/app/pages/careers.vue -->
<script setup lang="ts">
useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://keras.ir/careers',
    },
  ],
})

useSeoMeta({
  title: 'فرصت‌های شغلی و فرهنگ سازمانی | کراس',
  description: 'همکاری با تیم طراحی، مهندسی و نوآوری پوشاک ورزشی لوکس کراس؛ محیطی پویا، مینیمال و رشد‌محور',
  ogTitle: 'فرصت‌های شغلی و فرهنگ سازمانی | کراس',
  ogDescription: 'همکاری با تیم طراحی، مهندسی و نوآوری پوشاک ورزشی لوکس کراس؛ محیطی پویا، مینیمال و رشد‌محور',
  ogLocale: 'fa_IR',
  ogSiteName: 'کراس | Keras',
})

const {
  activeJob,
  expandedJobId,
  isApplying,
  applicantName,
  applicantPhone,
  applicantEmail,
  applicantPortfolio,
  applicantCoverNote,
  resumeFileName,
  formError,
  isSubmitting,
  toggleJob,
  openApplyModal,
  closeApplyModal,
  handleFileSimulate,
  handleSubmitApplication,
} = useCareers()
</script>

<template>
  <div class="min-h-screen bg-paper text-ink pb-20" dir="rtl">
    <!-- هدر فرصت‌های شغلی -->
    <CareersHero />

    <!-- ارکان فرهنگ سازمانی و مزایا -->
    <CareersCultureShowcase />

    <!-- لیست موقعیت‌های شغلی فعال -->
    <CareersOpenPositions
      :expanded-job-id="expandedJobId"
      @toggle-job="toggleJob"
      @apply="openApplyModal"
    />

    <!-- مدال فرم ارسال رزومه (Lazy loaded) -->
    <LazyCareersApplicationModal
      v-model:applicant-name="applicantName"
      v-model:applicant-phone="applicantPhone"
      v-model:applicant-email="applicantEmail"
      v-model:applicant-portfolio="applicantPortfolio"
      v-model:applicant-cover-note="applicantCoverNote"
      :is-open="isApplying"
      :active-job="activeJob"
      :resume-file-name="resumeFileName"
      :form-error="formError"
      :is-submitting="isSubmitting"
      @close="closeApplyModal"
      @file-simulate="handleFileSimulate"
      @submit="handleSubmitApplication"
    />
  </div>
</template>
