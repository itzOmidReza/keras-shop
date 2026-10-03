<script setup lang="ts">
import {
  Award,
  Heart,
  Laptop,
  Target,
  Compass,
  Coffee,
} from '@lucide/vue'
import {
  CULTURE_PILLARS,
  CAREER_PERKS,
} from '~/composables/careers/useCareers'

const iconMap = {
  Award,
  Heart,
  Laptop,
  Target,
  Compass,
  Coffee,
}
</script>

<template>
  <div>
    <!-- ارکان فرهنگ سازمانی (Culture Pillars) -->
    <section class="container mx-auto max-w-6xl px-4 py-16">
      <div class="text-center max-w-xl mx-auto space-y-2 mb-12">
        <span class="text-xs font-bold text-rose uppercase tracking-widest">
          باورها و فرهنگ ما
        </span>
        <h2 class="text-2xl sm:text-3xl font-bold text-ink">
          چگونه در کراس می‌اندیشیم و می‌سازیم
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(pillar, idx) in CULTURE_PILLARS"
          :key="idx"
          class="rounded-3xl border border-sand bg-white p-8 space-y-3 shadow-2xs hover:shadow-xs transition-shadow"
        >
          <div class="w-10 h-10 rounded-xl bg-sand/40 text-rose flex items-center justify-center font-mono font-bold text-sm">
            {{ `۰${idx + 1}` }}
          </div>
          <h3 class="text-base font-bold text-ink">
            {{ pillar.title }}
          </h3>
          <p class="text-xs text-muted-foreground leading-relaxed">
            {{ pillar.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- مزایا و امکانات همکاری (Perks & Benefits) -->
    <section class="border-y border-sand/70 bg-sand/15 py-16 px-4">
      <div class="container mx-auto max-w-6xl space-y-12">
        <div class="text-center max-w-xl mx-auto space-y-2">
          <span class="text-xs font-bold text-sage uppercase tracking-widest">
            پشتیبانی از تندرستی و انگیزه شما
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold text-ink">
            مزایا و تسهیلات همراهی با کراس
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(perk, idx) in CAREER_PERKS"
            :key="idx"
            class="rounded-2xl border border-sand/80 bg-white p-6 space-y-3 shadow-2xs"
          >
            <div class="w-11 h-11 rounded-xl bg-sand/40 text-rose flex items-center justify-center">
              <component :is="iconMap[perk.iconName]" class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-ink">
              {{ perk.title }}
            </h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              {{ perk.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
