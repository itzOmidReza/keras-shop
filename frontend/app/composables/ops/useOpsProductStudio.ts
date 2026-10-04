// frontend/app/composables/ops/useOpsProductStudio.ts
import { toast } from 'vue-sonner'
import { useOpsProducts } from '~/composables/ops/useOpsProducts'
import { useOpsTaxonomy } from '~/composables/ops/useOpsTaxonomy'
import type { ProductDetail, Variant, ProductImage, ProductCategory, ProductSeason } from '~/types/domain'

export interface StudioMediaItem {
  id: number
  url: string
  colorName?: string
  kind: 'photo' | 'video'
  position: number
}

export interface StudioVariantRow {
  id: number
  sku: string
  barcode: string
  color: string
  colorHex: string
  size: string
  stock: number
  regularPrice: number
  salePrice: number
  costPrice: number
}

export interface StudioModelMetrics {
  heightCm: number
  weightKg: number
  sizeWorn: string
}

export interface StudioSizeRow {
  size: string
  chest?: number
  waist?: number
  hip?: number
  length?: number
  sleeve?: number
  inseam?: number
}

export function useOpsProductStudio() {
  const { productsList } = useOpsProducts()
  const { colorSwatches } = useOpsTaxonomy()

  // Block 1: Identity & Codes
  const editingProductId = ref<number | null>(null)
  const title = ref('')
  const slug = ref('')
  const styleCode = ref('KER-1405-SLUB')
  const division = ref<'apparel' | 'accessories'>('apparel')
  const category = ref('shirts-blouses')
  const season = ref('fall-1405')
  const badge = ref('جدید')
  const highlights = ref<string[]>([
    'الیاف صددرصد طبیعی و ارگانیک',
    'الگوسازی ادیتوریال با تن‌خور آزاد',
    'دوخت مزونی با کنترل کیفیت دقیق',
  ])
  const lookbookNotes = ref('طراحی و دوخت انحصاری استودیو کراس. الهام‌گرفته از مینیمالیسم معاصر و هنر لایه‌بندی در اقلیم پاییزی.')

  // Block 2: Multimedia & Reels
  const mediaList = ref<StudioMediaItem[]>([
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
      colorName: 'مشکی زغالی',
      kind: 'photo',
      position: 1,
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      colorName: 'کرم شنی',
      kind: 'photo',
      position: 2,
    },
  ])
  const reelsUrl = ref('')

  // Block 3: Dynamic Variant Matrix
  const selectedColors = ref<string[]>(['مشکی زغالی', 'کرم شنی'])
  const selectedSizes = ref<string[]>(['XS', 'S', 'M', 'L', 'XL'])
  const variants = ref<StudioVariantRow[]>([])

  // Block 4: Specs & Engineering
  const fiberComposition = ref('۸۰٪ لینن اسلپ ارگانیک، ۲۰٪ ابریشم خام')
  const fabricGsm = ref(210)
  const fabricStretch = ref<'non-stretch' | 'slight' | 'medium' | 'high'>('slight')
  const fabricBreathability = ref<'low' | 'medium' | 'high'>('high')
  const isNonSheer = ref(true)
  const careChecklist = ref<string[]>(['cold_wash', 'do_not_bleach', 'gentle_iron', 'dry_clean_safe'])
  const modelMetrics = ref<StudioModelMetrics>({
    heightCm: 176,
    weightKg: 56,
    sizeWorn: 'S',
  })
  const crossSellProductIds = ref<number[]>([])

  // Block 5: Size Chart Builder
  const sizeChartTemplateId = ref('tpl_blouse')
  const sizeChartRows = ref<StudioSizeRow[]>([
    { size: 'XS', chest: 88, waist: 68, hip: 92, length: 65, sleeve: 58 },
    { size: 'S', chest: 92, waist: 72, hip: 96, length: 66, sleeve: 59 },
    { size: 'M', chest: 96, waist: 76, hip: 100, length: 67, sleeve: 60 },
    { size: 'L', chest: 102, waist: 82, hip: 106, length: 68, sleeve: 61 },
    { size: 'XL', chest: 108, waist: 88, hip: 112, length: 69, sleeve: 62 },
  ])
  const sizeToleranceNote = ref('امکان خطای دوخت تا ±۲ سانتیمتر')

  // Block 6: Strategy & SEO
  const supplyModel = ref<'in_stock' | 'made_to_order'>('in_stock')
  const makeToOrderDays = ref(7)
  const purchaseLimit = ref(2)
  const scheduledDropDate = ref('۱۴۰۵/۰۷/۱۵')
  const seoTitle = ref('')
  const seoDescription = ref('')

  // محاسبات سئو
  const serpPreviewTitle = computed(() => {
    return seoTitle.value.trim() || `${title.value || 'عنوان اثر'} | آتلیه مد کراس`
  })

  const serpPreviewDescription = computed(() => {
    return seoDescription.value.trim() || lookbookNotes.value || 'پوشاک لوکس و متریال دست‌دوز آتلیه کراس با ارسال رایگان و ضمانت اصالت کالا.'
  })

  const seoScore = computed(() => {
    let score = 30
    if (title.value.length > 5) score += 20
    if (slug.value.length > 3) score += 15
    if (mediaList.value.length >= 2) score += 15
    if (lookbookNotes.value.length > 30) score += 10
    if (seoDescription.value.length > 20) score += 10
    return Math.min(score, 100)
  })

  // خودکارسازی اسلاگ
  const autoGenerateSlug = () => {
    if (!title.value.trim()) return
    const cleaned = title.value
      .trim()
      .replace(/[^\u0600-\u06FF\w\s-]/g, '')
      .replace(/\s+/g, '-')
    slug.value = `keras-${Date.now().toString().slice(-4)}-${cleaned}`
      .toLowerCase()
      .slice(0, 48)
  }

  // تولید ماتریس دکارتی متغیرها
  const generateCartesianVariants = () => {
    const rows: StudioVariantRow[] = []
    const baseRegular = variants.value[0]?.regularPrice || 2450000
    const baseSale = variants.value[0]?.salePrice || 2450000
    const baseCost = variants.value[0]?.costPrice || 980000

    const currentMap = new Map<string, StudioVariantRow>()
    for (const v of variants.value) {
      currentMap.set(`${v.color}-${v.size}`, v)
    }

    const colorList = selectedColors.value.length > 0 ? selectedColors.value : ['اصلی']
    const sizeList = division.value === 'accessories' ? ['Free'] : (selectedSizes.value.length > 0 ? selectedSizes.value : ['Free'])

    let counter = 1
    for (const clr of colorList) {
      const swatch = colorSwatches.value.find((c) => c.name === clr)
      const colorHex = swatch?.hex || '#1C1917'

      for (const sz of sizeList) {
        const key = `${clr}-${sz}`
        const existing = currentMap.get(key)

        if (existing) {
          rows.push({ ...existing })
        } else {
          const skuCode = `${styleCode.value || 'KER-ITEM'}-${clr.slice(0, 3)}-${sz}`.toUpperCase()
          rows.push({
            id: Date.now() + counter++,
            sku: skuCode,
            barcode: `626${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            color: clr,
            colorHex,
            size: sz,
            stock: 8,
            regularPrice: baseRegular,
            salePrice: baseSale,
            costPrice: baseCost,
          })
        }
      }
    }

    variants.value = rows
  }

  // اعمال گروهی قیمت و موجودی
  const bulkApplyPricing = (regular: number, sale: number, cost?: number) => {
    for (const v of variants.value) {
      v.regularPrice = regular
      v.salePrice = sale
      if (cost !== undefined) v.costPrice = cost
    }
    toast.success('قیمت‌ها در تمام متغیرها یکپارچه شدند.')
  }

  const bulkApplyStock = (stock: number) => {
    for (const v of variants.value) {
      v.stock = stock
    }
    toast.success(`موجودی کلیه متغیرها به ${stock} عدد به‌روزرسانی شد.`)
  }

  // مقداردهی اولیه برای اثر جدید
  const initNewProduct = () => {
    editingProductId.value = null
    title.value = ''
    slug.value = `keras-drop-${Date.now().toString().slice(-4)}`
    styleCode.value = `KER-1405-${Date.now().toString().slice(-3)}`
    division.value = 'apparel'
    category.value = 'shirts-blouses'
    season.value = 'fall-1405'
    badge.value = 'جدید'
    highlights.value = [
      'الیاف صددرصد طبیعی و ارگانیک',
      'الگوسازی ادیتوریال با تن‌خور آزاد',
      'دوخت مزونی با کنترل کیفیت دقیق',
    ]
    lookbookNotes.value = 'طراحی و دوخت انحصاری استودیو کراس. متریال اعلا با گرماژ ۲۱۰ گرم و برش مدرن ادیتوریال.'
    mediaList.value = [
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
        colorName: 'مشکی زغالی',
        kind: 'photo',
        position: 1,
      },
    ]
    reelsUrl.value = ''
    selectedColors.value = ['مشکی زغالی', 'کرم شنی']
    selectedSizes.value = ['XS', 'S', 'M', 'L', 'XL']
    generateCartesianVariants()
  }

  // بارگذاری داده‌ها برای ویرایش محصول موجود
  const loadProduct = (p: ProductDetail) => {
    editingProductId.value = p.id
    title.value = p.title
    slug.value = p.slug
    styleCode.value = p.variants?.[0]?.sku.split('-')[0] || `KER-${p.id}`
    division.value = p.division
    category.value = p.category
    season.value = p.season
    badge.value = p.badge || ''
    lookbookNotes.value = p.description || ''

    if (p.images && p.images.length > 0) {
      mediaList.value = p.images.map((img, idx) => ({
        id: img.id || idx + 1,
        url: img.url,
        colorName: (p.colors && p.colors[idx % p.colors.length]?.name) || selectedColors.value[0],
        kind: 'photo',
        position: img.position || idx + 1,
      }))
    }

    if (p.colors && p.colors.length > 0) {
      selectedColors.value = p.colors.map((c) => c.name)
    }

    if (p.available_sizes && p.available_sizes.length > 0) {
      selectedSizes.value = p.available_sizes
    }

    if (p.fabric) {
      fiberComposition.value = p.fabric.composition || fiberComposition.value
      fabricGsm.value = p.fabric.gsm || fabricGsm.value
    }

    // متغیرها
    if (p.variants && p.variants.length > 0) {
      variants.value = p.variants.map((v) => ({
        id: v.id,
        sku: v.sku,
        barcode: `626${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        color: v.color || 'اصلی',
        colorHex: v.color_hex || '#1C1917',
        size: v.size,
        stock: v.stock || 0,
        regularPrice: p.compare_at_price || p.price,
        salePrice: v.price_override || p.price,
        costPrice: Math.round(p.price * 0.4),
      }))
    } else {
      generateCartesianVariants()
    }
  }

  // ذخیره محصول استودیو
  const saveStudioProduct = (): ProductDetail | null => {
    if (!title.value.trim()) {
      toast.error('لطفاً عنوان اثر را وارد نمایید.')
      return null
    }

    if (!slug.value.trim()) {
      autoGenerateSlug()
    }

    // محاسبه قیمت مبنا و فروش
    const firstRow = variants.value[0]
    const salePrice = firstRow ? firstRow.salePrice : 2450000
    const basePrice = firstRow ? firstRow.regularPrice : 2450000

    const domainVariants: Variant[] = variants.value.map((v) => ({
      id: v.id,
      sku: v.sku,
      color: v.color,
      color_hex: v.colorHex,
      size: v.size as Variant['size'],
      stock: v.stock,
      reserved: 0,
      price_override: v.salePrice !== salePrice ? v.salePrice : undefined,
      compare_at_price: v.regularPrice > v.salePrice ? v.regularPrice : undefined,
    }))

    const domainImages: ProductImage[] = mediaList.value.map((m, idx) => ({
      id: m.id || idx + 1,
      url: m.url,
      alt: `${title.value} - زاویه ${idx + 1}`,
      kind: 'photo',
      position: idx + 1,
    }))

    const totalStock = domainVariants.reduce((sum, v) => sum + v.stock, 0)
    const distinctColors = Array.from(new Set(variants.value.map((v) => v.color))).map((cName) => {
      const match = colorSwatches.value.find((s) => s.name === cName)
      return { name: cName, hex: match?.hex || '#1C1917' }
    })
    const distinctSizes = Array.from(new Set(variants.value.map((v) => v.size)))

    if (editingProductId.value) {
      const target = productsList.value.find((p) => p.id === editingProductId.value)
      if (target) {
        Object.assign(target, {
          title: title.value,
          slug: slug.value,
          division: division.value,
          category: category.value,
          season: season.value,
          badge: badge.value,
          price: salePrice,
          base_price: basePrice,
          compare_at_price: basePrice > salePrice ? basePrice : undefined,
          description: lookbookNotes.value,
          images: domainImages,
          variants: domainVariants,
          colors: distinctColors,
          sizes: distinctSizes,
          available_sizes: distinctSizes,
          inStock: totalStock > 0,
          fabric: {
            composition: fiberComposition.value,
            gsm: fabricGsm.value,
            care: careChecklist.value.join('، '),
          },
          fabric_gsm: fabricGsm.value,
          fabric_composition: fiberComposition.value,
        })
        toast.success(`تغییرات کالا «${title.value}» در کاتالوگ ذخیره شد.`)
        return target
      }
    }

    const newProduct: ProductDetail = {
      id: Date.now(),
      slug: slug.value,
      title: title.value,
      brand: 'keras-atelier',
      division: division.value,
      category: category.value as ProductCategory,
      season: season.value as ProductSeason,
      badge: badge.value,
      price: salePrice,
      base_price: basePrice,
      compare_at_price: basePrice > salePrice ? basePrice : undefined,
      description: lookbookNotes.value,
      fabric: {
        composition: fiberComposition.value,
        gsm: fabricGsm.value,
        care: careChecklist.value.join('، '),
      },
      fabric_composition: fiberComposition.value,
      fabric_gsm: fabricGsm.value,
      stretch: 2,
      softness: 5,
      opacity: 5,
      rating: 5.0,
      rating_avg: 5.0,
      reviewCount: 0,
      rating_count: 0,
      is_active: true,
      inStock: totalStock > 0,
      sizes: distinctSizes,
      available_sizes: distinctSizes,
      colors: distinctColors,
      images: domainImages,
      variants: domainVariants,
    }

    productsList.value.unshift(newProduct)
    toast.success(`محصول جدید «${title.value}» با موفقیت در کاتالوگ ثبت گردید.`)
    return newProduct
  }

  return {
    editingProductId,
    title,
    slug,
    styleCode,
    division,
    category,
    season,
    badge,
    highlights,
    lookbookNotes,
    mediaList,
    reelsUrl,
    selectedColors,
    selectedSizes,
    variants,
    fiberComposition,
    fabricGsm,
    fabricStretch,
    fabricBreathability,
    isNonSheer,
    careChecklist,
    modelMetrics,
    crossSellProductIds,
    sizeChartTemplateId,
    sizeChartRows,
    sizeToleranceNote,
    supplyModel,
    makeToOrderDays,
    purchaseLimit,
    scheduledDropDate,
    seoTitle,
    seoDescription,
    serpPreviewTitle,
    serpPreviewDescription,
    seoScore,
    autoGenerateSlug,
    generateCartesianVariants,
    bulkApplyPricing,
    bulkApplyStock,
    initNewProduct,
    loadProduct,
    saveStudioProduct,
  }
}
