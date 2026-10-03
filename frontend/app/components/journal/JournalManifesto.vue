<script setup lang="ts">
import { Layers, ShoppingBag } from '@lucide/vue'
</script>

<template>
  <section class="mt-20 rounded-3xl border border-sand bg-sand/30 p-8 sm:p-14 text-center space-y-5">
    <div class="w-12 h-12 rounded-full bg-rose/10 text-rose mx-auto flex items-center justify-center">
      <Layers class="w-6 h-6" />
    </div>

    <blockquote class="text-lg sm:text-2xl font-bold text-ink max-w-3xl mx-auto leading-relaxed">
      «لباس ورزشی مرز میان تمرین و زندگی روزمره نیست؛ بلکه بستر پیوند ذهن، تنفس و هارمونی حرکت است.»
    </blockquote>

    <p class="text-xs sm:text-sm text-muted-foreground">
      — تیم خلاقیت و طراحی منسوجات کراس، تهران ۱۴۰۵
    </p>

    <div class="pt-4">
      <NuxtLink
        to="/shop"
        class="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-ink hover:bg-rose text-white text-xs font-bold shadow-xs transition-colors"
      >
        <ShoppingBag class="w-4 h-4" />
        <span>مشاهده و خرید تمامی کالکشن‌ها</span>
      </NuxtLink>
    </div>
  </section>
</template>
