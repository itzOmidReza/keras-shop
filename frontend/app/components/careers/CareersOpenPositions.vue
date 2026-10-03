<script setup lang="ts">
import {
  MapPin,
  Clock,
  ChevronDown,
  Target,
  CheckCircle2,
} from '@lucide/vue'
import {
  JOB_POSITIONS,
  type JobPosition,
} from '~/composables/careers/useCareers'

defineProps<{
  expandedJobId: string | null
}>()

const emit = defineEmits<{
  (e: 'toggleJob', id: string): void
  (e: 'apply', job: JobPosition): void
}>()
</script>

<template>
  <main class="container mx-auto max-w-5xl px-4 py-16 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <span class="text-xs font-bold text-rose uppercase tracking-widest">
        فرصت‌های استخدام
      </span>
      <h2 class="text-2xl sm:text-3xl font-bold text-ink">
        موقعیت‌های شغلی فعال
      </h2>
      <p class="text-xs text-muted-foreground">
        نقش مورد علاقه خود را انتخاب کرده و رزومه کاری خود را برای بررسی مستقیم تیم رهبری ارسال فرمایید.
      </p>
    </div>

    <div class="space-y-4">
      <div
        v-for="job in JOB_POSITIONS"
        :key="job.id"
        class="rounded-3xl border border-sand bg-white overflow-hidden shadow-2xs transition-all"
      >
        <!-- هدر موقعیت شغلی -->
        <div
          class="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-sand/10 transition-colors"
          @click="emit('toggleJob', job.id)"
        >
          <div class="space-y-2">
            <div class="flex items-center gap-2 flex-wrap text-[11px]">
              <span class="font-bold px-2.5 py-0.5 rounded-full bg-sand/50 text-ink">
                {{ job.department }}
              </span>
              <span class="text-muted-foreground flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-rose" />
                {{ job.location }}
              </span>
              <span class="text-muted-foreground flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-sage" />
                {{ job.type }}
              </span>
            </div>

            <h3 class="text-lg sm:text-xl font-bold text-ink">
              {{ job.title }}
            </h3>
            <p class="text-xs text-muted-foreground font-mono dir-ltr text-end sm:text-start">
              {{ job.enTitle }}
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <button
              type="button"
              class="px-5 py-2.5 rounded-xl bg-ink hover:bg-rose text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
              @click.stop="emit('apply', job)"
            >
              ارسال رزومه
            </button>

            <button
              type="button"
              class="w-9 h-9 rounded-xl border border-sand flex items-center justify-center text-muted-foreground hover:text-ink transition-transform cursor-pointer"
              :class="{ 'rotate-180': expandedJobId === job.id }"
              aria-label="نمایش جزئیات"
            >
              <ChevronDown class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- بدنه قابل گسترش توضیحات شغل -->
        <div
          v-if="expandedJobId === job.id"
          class="p-6 sm:p-8 pt-0 border-t border-sand/40 space-y-6 text-xs bg-sand/5"
        >
          <p class="text-muted-foreground leading-relaxed pt-4 text-xs sm:text-sm">
            {{ job.overview }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- مسئولیت‌ها -->
            <div class="space-y-3">
              <h4 class="font-bold text-ink flex items-center gap-1.5 text-xs">
                <Target class="w-4 h-4 text-rose" />
                مسئولیت‌های کلیدی این نقش:
              </h4>
              <ul class="space-y-2 text-muted-foreground">
                <li v-for="(resp, rIdx) in job.responsibilities" :key="rIdx" class="flex items-start gap-2">
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-rose shrink-0 mt-1.5" />
                  <span class="leading-relaxed">{{ resp }}</span>
                </li>
              </ul>
            </div>

            <!-- مهارت‌ها -->
            <div class="space-y-3">
              <h4 class="font-bold text-ink flex items-center gap-1.5 text-xs">
                <CheckCircle2 class="w-4 h-4 text-sage" />
                شرایط و تخصص‌های مورد انتظار:
              </h4>
              <ul class="space-y-2 text-muted-foreground">
                <li v-for="(req, qIdx) in job.requirements" :key="qIdx" class="flex items-start gap-2">
                  <span class="inline-block w-1.5 h-1.5 rounded-full bg-sage shrink-0 mt-1.5" />
                  <span class="leading-relaxed">{{ req }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="pt-2 flex justify-end">
            <button
              type="button"
              class="px-6 py-2.5 rounded-xl bg-rose hover:bg-rose/90 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              @click="emit('apply', job)"
            >
              درخواست برای موقعیت {{ job.title }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
