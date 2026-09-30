<!-- frontend/app/pages/products/[slug].vue -->
<script setup lang="ts">
import type { ProductDetail, Variant } from '~/types/domain'
import { useProducts } from '~/composables/useProducts'
import PriceTag from '~/components/product/PriceTag.vue'
import StickyBuyBar from '~/components/product/StickyBuyBar.vue'
import { Button } from '~/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { ShoppingBag, Heart, Ruler, Truck, RotateCcw, ShieldCheck, Check } from '@lucide/vue'

interface ExtendedVariant extends Variant {
  price?: number
  compareAtPrice?: number
}

// در فایل frontend/app/pages/products/[slug].vue

interface ExtendedVariant extends Variant {
  price?: number
  compareAtPrice?: number
}

interface ExtendedProductDetail extends Omit<ProductDetail, 'variants' | 'base_price'> {
  base_price?: number
  price?: number
  compareAtPrice?: number
  compare_at_price?: number
  variants: ExtendedVariant[]
  fabric?: {
    stretch?: number
    softness?: number
    opacity?: number
    composition?: string
    gsm?: number
  }
}

const route = useRoute()
const { getProductBySlug } = useProducts()

const slug = computed(() => String(route.params.slug))
const rawProduct = await getProductBySlug(slug.value)
const product = computed(() => (rawProduct as unknown as ExtendedProductDetail) || null)

const selectedSize = ref<string | null>(null)
const activeImageIndex = ref(0)
const isWishlisted = ref(false)

// استخراج قیمت معتبر
const displayPrice = computed(() => {
  if (!product.value) return 0
  if (typeof product.value.base_price === 'number') return product.value.base_price
  if (typeof product.value.price === 'number') return product.value.price
  const firstVariant = product.value.variants?.[0]
  if (firstVariant && typeof firstVariant.price === 'number') return firstVariant.price
  return 1450000
})

const displayCompareAtPrice = computed(() => {
  if (!product.value) return undefined
  if (typeof product.value.compare_at_price === 'number') return product.value.compare_at_price
  if (typeof product.value.compareAtPrice === 'number') return product.value.compareAtPrice
  return undefined
})

// سایزهای موجود و ناموجود
const availableSizes = computed(() => {
  if (!product.value?.variants) return []
  const map = new Map<string, boolean>()
  for (const v of product.value.variants) {
    const hasStock = (v.stock - v.reserved) > 0
    map.set(v.size, (map.get(v.size) || false) || hasStock)
  }
  return Array.from(map.entries()).map(([size, inStock]) => ({ size, inStock }))
})

if (product.value) {
  useSeoMeta({
    title: `${product.value.title} | کراس`,
    description: product.value.description,
  })
}

const handleAddToCart = () => {
  if (!selectedSize.value) {
    alert('لطفاً ابتدا سایز مورد نظر خود را انتخاب کنید.')
    return
  }
  alert(`محصول با سایز ${selectedSize.value} به سبد افزوده شد.`)
}
const openSizeGuide = () => {
  if (import.meta.client) {
    window.alert('راهنمای سایز: دور باسن و کمر برحسب سانتی‌متر')
  }
}
</script>

<template>
  <div v-if="product" class="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
    <!-- بخش اصلی بالای صفحه: سبک Velora -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

      <!-- ۱. گالری تصاویر به سبک عمودی مینیمال (۷ ستون) -->
      <div class="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
        <!-- تامب‌نیل‌های عمودی در دسکتاپ -->
        <div
v-if="product.images?.length > 1"
          class="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0">
          <button
v-for="(img, idx) in product.images" :key="idx" type="button"
            class="relative w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer bg-sand/30 shrink-0"
            :class="activeImageIndex === idx ? 'border-rose ring-2 ring-rose/20' : 'border-transparent opacity-70 hover:opacity-100'"
            @click="activeImageIndex = idx">
            <img :src="img.url" :alt="img.alt || product.title" class="w-full h-full object-cover">
          </button>
        </div>

        <!-- تصویر اصلی بزرگ -->
        <div
          class="relative flex-1 aspect-[3/4] md:aspect-[4/5] rounded-2xl overflow-hidden bg-sand/20 border border-sand/60">
          <img
:src="product.images?.[activeImageIndex]?.url || product.images?.[0]?.url" :alt="product.title"
            class="w-full h-full object-cover object-center transition-all duration-300">
          <span
v-if="product.line"
            class="absolute top-4 start-4 bg-paper/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-ink shadow-sm">
            لاین {{ product.line.toUpperCase() }}
          </span>
        </div>
      </div>

      <!-- ۲. ستون اطلاعات خرید مینیمال (۵ ستون) -->
      <div class="lg:col-span-5 space-y-6">

        <!-- عنوان و امتیاز -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">کالکشن تخصصی کراس</span>
            <span
              class="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Check class="w-3 h-3" /> موجود در انبار
            </span>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-ink tracking-tight">
            {{ product.title }}
          </h1>

          <p class="text-sm text-muted-foreground leading-relaxed">
            {{ product.description }}
          </p>
        </div>

        <!-- قیمت -->
        <div class="pt-1 pb-3 border-b border-sand/80">
          <PriceTag :price="displayPrice" :compare-at-price="displayCompareAtPrice" size="lg" />
        </div>

        <!-- انتخاب سایز دقیقاً شبیه استایل Velora -->
        <div class="space-y-3">
          <div class="flex items-center justify-between text-sm">
            <span class="font-bold text-ink">
              سایز: <span v-if="selectedSize" class="text-rose font-bold">{{ selectedSize }}</span>
            </span>
            <button
type="button"
              class="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-ink transition-colors cursor-pointer"
              @click="openSizeGuide">
              <Ruler class="w-3.5 h-3.5 text-rose" />
              <span>راهنمای سایز</span>
            </button>
          </div>

          <div class="flex flex-wrap gap-2.5">
            <button
v-for="item in availableSizes" :key="item.size" type="button" :disabled="!item.inStock"
              class="min-w-14 h-11 px-4 flex items-center justify-center rounded-xl border text-sm font-bold transition-all"
              :class="[
                !item.inStock
                  ? 'border-sand/60 bg-sand/20 text-muted-foreground/40 cursor-not-allowed line-through'
                  : selectedSize === item.size
                    ? 'border-ink bg-ink text-paper shadow-sm'
                    : 'border-sand bg-white text-ink hover:border-ink hover:bg-sand/30 cursor-pointer'
              ]" @click="selectedSize = item.size">
              {{ item.size }}
            </button>
          </div>
        </div>

        <!-- دکمه افزودن به سبد و دکمه ذخیره -->
        <div class="flex items-center gap-3 pt-2">
          <Button
size="lg"
            class="flex-1 h-12 rounded-xl bg-rose hover:bg-rose/90 text-white font-bold text-sm gap-2 shadow-sm transition-all"
            :disabled="!selectedSize" @click="handleAddToCart">
            <ShoppingBag class="w-5 h-5 text-white" />
            <span>{{ selectedSize ? 'افزودن به سبد خرید' : 'انتخاب سایز الزامی است' }}</span>
          </Button>

          <Button
variant="outline" size="lg"
            class="h-12 w-12 rounded-xl border-sand hover:bg-sand/30 shrink-0 text-ink"
            @click="isWishlisted = !isWishlisted">
            <Heart class="w-5 h-5" :class="isWishlisted ? 'fill-rose text-rose' : 'text-ink'" />
          </Button>
        </div>

        <!-- ۳ ویژگی اعتمادساز افقی -->
        <div class="grid grid-cols-3 gap-2 pt-4 border-t border-sand/80 text-center">
          <div class="space-y-1">
            <Truck class="w-4 h-4 mx-auto text-rose" />
            <p class="text-[11px] font-bold text-ink">ارسال سریع</p>
            <p class="text-[10px] text-muted-foreground">پست پیشتاز</p>
          </div>
          <div class="space-y-1 border-x border-sand">
            <RotateCcw class="w-4 h-4 mx-auto text-sage" />
            <p class="text-[11px] font-bold text-ink">تعویض رایگان</p>
            <p class="text-[10px] text-muted-foreground">تا ۷ روز کاری</p>
          </div>
          <div class="space-y-1">
            <ShieldCheck class="w-4 h-4 mx-auto text-ink" />
            <p class="text-[11px] font-bold text-ink">تست عدم دید</p>
            <p class="text-[10px] text-muted-foreground">Squat-Proof</p>
          </div>
        </div>

      </div>
    </div>

    <!-- ۳. تب‌های تمیز مشخصات و متریال دقیقاً مشابه پایین صفحه Velora -->
    <div class="mt-16 pt-10 border-t border-sand">
      <Tabs default-value="details" class="w-full">
        <TabsList class="bg-transparent border-b border-sand w-full justify-start rounded-none h-auto p-0 gap-8">
          <TabsTrigger
value="details"
            class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none">
            مشخصات فنی و دوخت
          </TabsTrigger>
          <TabsTrigger
value="materials"
            class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none">
            الیاف و سنجه‌های پارچه
          </TabsTrigger>
          <TabsTrigger
value="care"
            class="data-[state=active]:border-b-2 data-[state=active]:border-rose data-[state=active]:text-ink text-muted-foreground pb-3 text-sm font-bold rounded-none bg-transparent shadow-none">
            نگهداری و شست‌وشو
          </TabsTrigger>
        </TabsList>

        <!-- تب ۱: مشخصات -->
        <TabsContent value="details" class="pt-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-muted-foreground">
            <ul class="space-y-2">
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
                <span>طراحی ارگونومیک متناسب با آناتومی بدن بدون درزهای آزاردهنده.</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
                <span>فاق دوتکه برای آزادی عمل ۱۰۰٪ در حرکات کششی، یوگا و پیلاتس.</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
                <span>کمر گنی پهن با نگه‌دارندگی مطلوب بدون احساس خفگی یا لول‌شدن.</span>
              </li>
            </ul>
            <div class="p-4 rounded-xl bg-sand/30 border border-sand text-xs space-y-1 text-ink">
              <p class="font-bold">توصیه استایلینگ کراس:</p>
              <p class="text-muted-foreground leading-normal">بهترین هماهنگی را با نیم‌تنه‌ها و کراپ‌تاپ‌های ورزشی از
                لاین Move ایجاد می‌کند.</p>
            </div>
          </div>
        </TabsContent>

        <!-- تب ۲: سنجه‌های الیاف -->
        <TabsContent value="materials" class="pt-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-white border border-sand space-y-1">
              <span class="text-xs text-muted-foreground">میزان کشسانی</span>
              <p class="text-sm font-bold text-ink">چهارطرفه فوق‌العاده (۴ از ۵)</p>
              <div class="h-1.5 w-full bg-sand rounded-full overflow-hidden mt-2">
                <div class="h-full bg-rose w-4/5 rounded-full" />
              </div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-sand space-y-1">
              <span class="text-xs text-muted-foreground">تست پوشانندگی (Opacity)</span>
              <p class="text-sm font-bold text-ink">ضد دید کامل (۵ از ۵)</p>
              <div class="h-1.5 w-full bg-sand rounded-full overflow-hidden mt-2">
                <div class="h-full bg-sage w-full rounded-full" />
              </div>
            </div>
            <div class="p-4 rounded-xl bg-white border border-sand space-y-1">
              <span class="text-xs text-muted-foreground">لطافت و نرمی</span>
              <p class="text-sm font-bold text-ink">حس پوست دوم (بسیار لطیف)</p>
              <div class="h-1.5 w-full bg-sand rounded-full overflow-hidden mt-2">
                <div class="h-full bg-clay w-full rounded-full" />
              </div>
            </div>
          </div>
        </TabsContent>

        <!-- تب ۳: شست‌وشو -->
        <TabsContent value="care" class="pt-6 text-sm text-muted-foreground space-y-2">
          <p>• شست‌وشو با ماشین لباس‌شویی در دمای حداکثر ۳۰ درجه سانتی‌گراد و دور ملایم.</p>
          <p>• عدم استفاده از نرم‌کننده‌های حوله و لباس ورزشی جهت حفظ خاصیت تنفس‌پذیری پارچه.</p>
          <p>• خشک‌کردن در هوای آزاد و در سایه؛ از خشک‌کن حرارتی استفاده نشود.</p>
        </TabsContent>
      </Tabs>
    </div>

    <!-- نوار شناور موبایل -->
    <StickyBuyBar
:price="displayPrice" :compare-at-price="displayCompareAtPrice" :variants="product.variants"
      :selected-size="selectedSize" @update:selected-size="(val) => (selectedSize = val)"
      @add-to-cart="handleAddToCart" />
  </div>
</template>
