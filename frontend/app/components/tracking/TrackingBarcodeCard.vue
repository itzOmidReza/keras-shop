<script setup lang="ts">
import { Package, Check, Copy, ExternalLink, MapPin } from '@lucide/vue'
import { maskPhoneNumber } from '~/composables/tracking/useOrderTracking'
import type { TrackOrderResponse } from '~/types/domain'

defineProps<{
  orderData: TrackOrderResponse
  isCopied: boolean
}>()

const emit = defineEmits<{
  (e: 'copyTrackingCode'): void
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- مشخصات بارکد شرکت پست -->
    <div class="rounded-3xl border border-sand bg-white p-6 sm:p-7 space-y-5 shadow-2xs flex flex-col justify-between">
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-ink flex items-center gap-2">
            <Package class="w-4 h-4 text-rose" />
            <span>کد رهگیری پستی</span>
          </h4>
          <span class="text-2xs px-2 py-0.5 rounded-md bg-sand/30 font-medium text-ink/70">سامانه شاخص پست</span>
        </div>

        <div class="p-4 rounded-2xl bg-paper border border-sand/60 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-2xs text-muted-foreground">بارکد ۲۴ رقمی مرسوله:</span>
            <button
              type="button"
              class="inline-flex items-center gap-1 text-2xs font-bold text-rose hover:underline cursor-pointer"
              @click="emit('copyTrackingCode')"
            >
              <Check v-if="isCopied" class="w-3 h-3 text-sage" />
              <Copy v-else class="w-3 h-3" />
              <span>{{ isCopied ? 'کپی شد' : 'کپی بارکد' }}</span>
            </button>
          </div>

          <div class="font-mono text-sm sm:text-base font-bold tracking-wider text-ink text-center py-1 bg-white rounded-xl border border-sand/40 select-all">
            {{ orderData.trackingCode }}
          </div>
        </div>

        <p class="text-2xs text-muted-foreground leading-relaxed">
          با وارد کردن این شماره در درگاه رسمی شرکت ملی پست جمهوری اسلامی ایران می‌توانید وضعیت مسیر پستی بسته خود را رهگیری فرمایید.
        </p>
      </div>

      <div class="pt-2">
        <a
          href="https://tracking.post.ir"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-sand bg-white hover:bg-sand/20 text-ink text-xs font-bold transition-colors"
        >
          <span>ورود به سامانه رسمی رهگیری پست</span>
          <ExternalLink class="w-3.5 h-3.5 text-muted-foreground" />
        </a>
      </div>
    </div>

    <!-- اطلاعات تحویل‌گیرنده و نشانی -->
    <div class="rounded-3xl border border-sand bg-white p-6 sm:p-7 space-y-4 shadow-2xs">
      <h4 class="text-sm font-bold text-ink flex items-center gap-2 pb-2 border-b border-sand/60">
        <MapPin class="w-4 h-4 text-rose" />
        <span>مشخصات تحویل‌گیرنده و نشانی</span>
      </h4>

      <div class="space-y-3 text-xs">
        <div class="flex items-center justify-between py-1.5 border-b border-sand/30">
          <span class="text-muted-foreground">نام تحویل‌گیرنده:</span>
          <span class="font-bold text-ink">{{ orderData.recipientName }}</span>
        </div>

        <div
          v-if="orderData.recipientPhone"
          class="flex items-center justify-between py-1.5 border-b border-sand/30"
        >
          <span class="text-muted-foreground">شماره تماس ثبت‌شده:</span>
          <span class="font-bold font-mono text-ink">{{ maskPhoneNumber(orderData.recipientPhone) }}</span>
        </div>

        <div class="space-y-1.5 pt-1">
          <span class="text-muted-foreground block">نشانی تحویل:</span>
          <p class="font-medium text-ink bg-paper/60 p-3 rounded-xl border border-sand/50 leading-relaxed text-xs">
            {{ orderData.shippingAddress }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
