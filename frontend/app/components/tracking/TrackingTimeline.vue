<!-- frontend/app/components/tracking/TrackingTimeline.vue -->
<script setup lang="ts">
import {
  Check,
  PackageCheck,
  Truck,
  Home,
  FileCheck2,
  MapPin,
  Clock,
} from '@lucide/vue'
import type { OrderStatus, TrackingEvent } from '~/types/domain'

const props = defineProps<{
  timeline: TrackingEvent[]
  currentStatus: OrderStatus
}>()

// نگاشت آیکون متناسب با وضعیت مرحله
const getStepIcon = (index: number) => {
  switch (index) {
    case 0:
      return FileCheck2
    case 1:
      return PackageCheck
    case 2:
      return Truck
    case 3:
      return Home
    default:
      return Check
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- تایم‌لاین دسکتاپ (افقی در جهت RTL) -->
    <div class="hidden md:block">
      <div class="relative flex items-start justify-between">
        <!-- خط اتصال افقی بین مراحل -->
        <div class="absolute top-5 inset-x-8 h-0.5 bg-sand/60 z-0" />
        
        <div
          v-for="(event, idx) in props.timeline"
          :key="event.title"
          class="relative z-10 flex flex-col items-center text-center max-w-[200px]"
        >
          <!-- دایره وضعیت مرحله -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xs"
            :class="[
              event.completed
                ? 'bg-rose text-white ring-4 ring-rose/15'
                : 'bg-white border-2 border-sand text-ink/30',
            ]"
          >
            <Check v-if="event.completed" class="w-5 h-5 stroke-[2.5]" />
            <component :is="getStepIcon(idx)" v-else class="w-4 h-4" />
          </div>

          <!-- عنوان و جزئیات مرحله -->
          <div class="mt-3 space-y-1">
            <h4
              class="text-xs font-bold leading-tight"
              :class="event.completed ? 'text-ink' : 'text-muted-foreground/70'"
            >
              {{ event.title }}
            </h4>

            <p class="text-2xs text-muted-foreground leading-relaxed">
              {{ event.description }}
            </p>

            <div class="flex items-center justify-center gap-1.5 pt-1 text-2xs text-muted-foreground/80 font-mono">
              <Clock class="w-3 h-3 text-rose/70" />
              <span>{{ event.timestamp }}</span>
            </div>

            <div
              v-if="event.location"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sand/30 text-ink/70 text-2xs mt-1"
            >
              <MapPin class="w-2.5 h-2.5 text-rose" />
              <span class="truncate max-w-[120px]">{{ event.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- تایم‌لاین موبایل (عمودی در راست‌به‌چپ) -->
    <div class="md:hidden relative space-y-6 ps-8">
      <!-- خط عمودی اتصال -->
      <div class="absolute top-3 bottom-3 start-3.5 w-0.5 bg-sand/60" />

      <div
        v-for="(event, idx) in props.timeline"
        :key="event.title"
        class="relative space-y-1.5"
      >
        <!-- نشانگر دایره‌ای روی خط عمودی -->
        <div
          class="absolute -start-8 top-0.5 w-7 h-7 rounded-full flex items-center justify-center z-10 transition-colors shadow-2xs"
          :class="[
            event.completed
              ? 'bg-rose text-white ring-2 ring-rose/20'
              : 'bg-white border-2 border-sand text-ink/30',
          ]"
        >
          <Check v-if="event.completed" class="w-3.5 h-3.5 stroke-[2.5]" />
          <component :is="getStepIcon(idx)" v-else class="w-3 h-3" />
        </div>

        <!-- محتوای مرحله در موبایل -->
        <div class="space-y-1 bg-white p-3.5 rounded-2xl border border-sand/70 shadow-2xs">
          <div class="flex items-center justify-between gap-2">
            <h4
              class="text-xs font-bold"
              :class="event.completed ? 'text-ink' : 'text-muted-foreground'"
            >
              {{ event.title }}
            </h4>
            <span class="text-2xs font-mono text-muted-foreground shrink-0">{{ event.timestamp }}</span>
          </div>

          <p class="text-2xs text-muted-foreground leading-relaxed">
            {{ event.description }}
          </p>

          <div
            v-if="event.location"
            class="inline-flex items-center gap-1 text-2xs text-ink/70 pt-1"
          >
            <MapPin class="w-3 h-3 text-rose shrink-0" />
            <span>{{ event.location }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
