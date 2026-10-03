<script setup lang="ts">
</script>

<template>
  <div class="hidden lg:flex lg:col-span-6 xl:col-span-7 relative bg-sand/30 overflow-hidden flex-col justify-between p-10 xl:p-12 text-white">
    <NuxtImg
      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
      alt="استودیو مد و فشن کراس"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/20" />

    <!-- نشان تجاری و تگ فصلی بالای تصویر -->
    <div class="relative z-10 flex items-center justify-between">
      <NuxtLink to="/" class="font-serif text-2xl font-bold tracking-widest text-white">
        KERAS
      </NuxtLink>
      <span class="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white border border-white/20">
        کالکشن چهار فصل • پاییز ۱۴۰۵
      </span>
    </div>

    <!-- پیام فلسفه برند در پایین تصویر -->
    <div class="relative z-10 space-y-3">
      <blockquote class="text-xl xl:text-2xl font-bold leading-relaxed text-paper">
        «خلوص در فرم، ظرافت پایدار و همنشینی اصیل با الیاف طبیعی»
      </blockquote>
      <p class="text-xs text-paper/80 leading-relaxed max-w-md">
        عضویت در باشگاه مشتریان کراس به شما امکان دسترسی اولویت‌دار به دراپ‌های محدود، رهگیری اختصاصی مرسولات و خدمات کنسیرژ استایل را هدیه می‌دهد.
      </p>
    </div>
  </div>
</template>
