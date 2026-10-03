<script setup lang="ts">
import { Briefcase, Building, Laptop, Sparkles } from '@lucide/vue'
</script>

<template>
  <section class="border-b border-sand/70 bg-sand/20 py-16 lg:py-24 px-4 text-center">
    <div class="container mx-auto max-w-4xl space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sand/60 border border-sand text-xs font-bold text-muted-foreground uppercase tracking-widest">
        <Briefcase class="w-3.5 h-3.5 text-rose" />
        <span>پیوستن به تیم نوآوری کراس • تهران ۱۴۰۵</span>
      </div>

      <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-ink leading-tight">
        خلق استانداردی نو در مهندسی پوشاک ورزشی
      </h1>

      <p class="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        ما در کراس باور داریم که لباس ورزشی باید هم‌زمان شاهکار علم نساجی و اثر هنری مینیمال باشد. اگر مشتاق خلق کیفیتی فراتر از معمول هستید، جای شما در کنار ما خالی است.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-bold text-muted-foreground">
        <span class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand">
          <Building class="w-3.5 h-3.5 text-rose" />
          استودیو مرکزی تهران (نیاوران)
        </span>
        <span class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand">
          <Laptop class="w-3.5 h-3.5 text-sage" />
          مدل کاری هیبریدی و انعطاف‌پذیر
        </span>
        <span class="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-sand">
          <Sparkles class="w-3.5 h-3.5 text-clay" />
          تیم چابک، پیشرو و خودمختار
        </span>
      </div>
    </div>
  </section>
</template>
