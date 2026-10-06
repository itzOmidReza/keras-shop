// frontend/app/composables/ops/useAdminProducts.ts
import { toast } from 'vue-sonner'
import { mockProducts } from '../../../server/mock/products'
import type { ProductDetail, ProductCategory, ProductSeason, Variant } from '~/types/domain'

export interface AdminProductVariant {
  color: string
  colorHex: string
  size: string
  stock: number
  sku: string
}

export const PRESET_COLORS = [
  { name: 'مشکی زغالی', hex: '#1C1917' },
  { name: 'کرم شنی', hex: '#E7E2D7' },
  { name: 'سرمه‌ای عمیق', hex: '#1E293B' },
  { name: 'شتری اعلا', hex: '#C2A68C' },
  { name: 'سبز زیتونی', hex: '#4D5D53' },
  { name: 'طوسی ملانژ', hex: '#94A3B8' },
  { name: 'سفید عاجی', hex: '#F8FAFC' },
]

export const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'Free Size']

export interface AdminProductForm {
  id?: number
  title: string
  slug: string
  division: 'apparel' | 'accessories'
  category: string
  brand?: string
  season?: ProductSeason
  basePrice: number
  salePrice: number
  mainImage: string
  galleryImages: string[]
  selectedColors: { name: string; hex: string }[]
  selectedSizes: string[]
  variants: AdminProductVariant[]
  fabric: string
  fitNote?: string
  careInstructions: string
  sizeGuide: {
    size: string
    chest: number
    waist: number
    hip: number
    length: number
    sleeve: number
  }[]
  isPublished: boolean
}

// لیست مشترک محصولات در کل ادمین
const productsList = ref<ProductDetail[]>(
  JSON.parse(JSON.stringify(mockProducts)),
)

const searchQuery = ref('')
const selectedCategory = ref('all')
const isDeletingId = ref<number | null>(null)

export function useAdminProducts() {
  const filteredProducts = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return productsList.value.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.variants?.some((v) => v.sku.toLowerCase().includes(q))

      const matchesCat =
        selectedCategory.value === 'all' ||
        p.division === selectedCategory.value ||
        p.category === selectedCategory.value

      return matchesSearch && matchesCat
    })
  })

  // فرم فعال استودیوی محصول
  const productForm = ref<AdminProductForm>({
    title: '',
    slug: '',
    division: 'apparel',
    category: 'coats-jackets',
    basePrice: 2450000,
    salePrice: 2150000,
    mainImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    ],
    selectedColors: [
      { name: 'مشکی زغالی', hex: '#1C1917' },
      { name: 'کرم شنی', hex: '#E7E2D7' },
    ],
    selectedSizes: ['S', 'M', 'L'],
    variants: [],
    fabric: '۱۰۰٪ لینن نچرال شسته‌شده فرانسوی با تنفس‌پذیری بالا',
    careInstructions: 'شست‌وشوی دستی با آب سرد حداکثر ۳۰ درجه سانتی‌گراد، بدون استفاده از مواد سفیدکننده و خشک‌کن چرخشی.',
    sizeGuide: [
      { size: 'S', chest: 96, waist: 88, hip: 102, length: 118, sleeve: 60 },
      { size: 'M', chest: 102, waist: 94, hip: 108, length: 120, sleeve: 61 },
      { size: 'L', chest: 108, waist: 100, hip: 114, length: 122, sleeve: 62 },
    ],
    isPublished: true,
  })

  // تولید خودکار جدول تنوع‌ها
  const regenerateVariants = () => {
    const newVariants: AdminProductVariant[] = []
    const colors = productForm.value.selectedColors.length > 0
      ? productForm.value.selectedColors
      : [{ name: 'تک‌رنگ', hex: '#1C1917' }]
    const sizes = productForm.value.selectedSizes.length > 0
      ? productForm.value.selectedSizes
      : ['Free Size']

    for (const color of colors) {
      for (const size of sizes) {
        // جستجوی موجودی قبلی در صورت وجود
        const existing = productForm.value.variants.find(
          (v) => v.color === color.name && v.size === size,
        )
        newVariants.push({
          color: color.name,
          colorHex: color.hex,
          size,
          stock: existing ? existing.stock : 4,
          sku: `KRS-${productForm.value.slug || 'ITEM'}-${size}-${color.name.slice(0, 3)}`,
        })
      }
    }
    productForm.value.variants = newVariants
  }

  // آماده‌سازی فرم جدید
  const initNewProductForm = () => {
    productForm.value = {
      title: '',
      slug: '',
      division: 'apparel',
      category: 'coats-jackets',
      brand: 'keras-atelier',
      season: 'fall-1405',
      basePrice: 2850000,
      salePrice: 2850000,
      mainImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      ],
      selectedColors: [
        { name: 'مشکی زغالی', hex: '#1C1917' },
        { name: 'کرم کاراملی', hex: '#C2A68C' },
      ],
      selectedSizes: ['S', 'M', 'L'],
      variants: [],
      fabric: 'پشم و کشمیر اعلا ایتالیایی با آستر ابریشم ساتن',
      fitNote: 'قواره آزاد و ادیتوریال (Oversized) با آزادی کامل در حرکت و ایستایی مطلوب.',
      careInstructions: 'خشکشویی تخصصی با بخار ملایم، اتوکشی در دمای پایین با پارچه محافظ.',
      sizeGuide: [
        { size: 'S', chest: 96, waist: 88, hip: 102, length: 115, sleeve: 59 },
        { size: 'M', chest: 102, waist: 94, hip: 108, length: 118, sleeve: 61 },
        { size: 'L', chest: 108, waist: 100, hip: 114, length: 120, sleeve: 62 },
      ],
      isPublished: true,
    }
    regenerateVariants()
  }

  // بارگذاری اطلاعات محصول برای ویرایش
  const loadProductForEdit = (id: number | string) => {
    const numId = Number(id)
    const product = productsList.value.find((p) => p.id === numId)
    if (!product) return false

    const colors: { name: string; hex: string }[] = product.colors?.map((c) => ({
      name: c.name,
      hex: c.hex,
    })) || [{ name: 'مشکی زغالی', hex: '#1C1917' }]

    const sizes = product.sizes || ['S', 'M', 'L']

    productForm.value = {
      id: product.id,
      title: product.title,
      slug: product.slug,
      division: product.division || 'apparel',
      category: product.category,
      brand: product.brand || 'keras-atelier',
      season: product.season || 'fall-1405',
      basePrice: product.base_price,
      salePrice: product.price || product.base_price,
      mainImage: product.images[0]?.url || '',
      galleryImages: product.images.map((img) => img.url),
      selectedColors: colors,
      selectedSizes: sizes,
      variants: (product.variants || []).map((v) => ({
        color: v.color || 'مشکی',
        colorHex: v.color_hex || '#1C1917',
        size: v.size,
        stock: v.stock,
        sku: v.sku || `SKU-${product.id}-${v.size}`,
      })),
      fabric: product.fabric?.composition || '۱۰۰٪ لینن طبیعی',
      fitNote: product.fit_note || '',
      careInstructions: product.fabric?.care || 'شست‌وشوی دستی با آب سرد',
      sizeGuide: [
        { size: 'S', chest: 96, waist: 88, hip: 102, length: 115, sleeve: 59 },
        { size: 'M', chest: 102, waist: 94, hip: 108, length: 118, sleeve: 61 },
        { size: 'L', chest: 108, waist: 100, hip: 114, length: 120, sleeve: 62 },
      ],
      isPublished: product.inStock,
    }

    if (productForm.value.variants.length === 0) {
      regenerateVariants()
    }
    return true
  }

  // ذخیره فرم (ایجاد یا ویرایش)
  const saveProduct = (): ProductDetail => {
    const f = productForm.value
    const totalStock = f.variants.reduce((sum, v) => sum + v.stock, 0)
    const mappedImages = (f.galleryImages.length > 0 ? f.galleryImages : [f.mainImage]).map((url, i) => ({
      id: i + 1,
      url,
      alt: f.title,
      kind: 'photo' as const,
      position: i + 1,
    }))
    const mappedVariants = f.variants.map((v, i) => ({
      id: i + 1,
      sku: v.sku,
      color: v.color,
      color_hex: v.colorHex || '#1C1917',
      size: (v.size as Variant['size']) || 'M',
      stock: Number(v.stock),
      reserved: 0,
      price_override: Number(f.salePrice),
      compare_at_price: Number(f.basePrice) > Number(f.salePrice) ? Number(f.basePrice) : undefined,
    }))

    if (f.id) {
      // ویرایش محصول موجود
      const idx = productsList.value.findIndex((p) => p.id === f.id)
      if (idx !== -1) {
        const updated: ProductDetail = {
          ...productsList.value[idx]!,
          title: f.title,
          slug: f.slug || f.title.toLowerCase().replace(/\s+/g, '-'),
          division: f.division,
          category: f.category as ProductCategory,
          brand: f.brand || 'keras-atelier',
          season: (f.season as ProductSeason) || productsList.value[idx]?.season || 'fall-1405',
          base_price: Number(f.basePrice),
          price: Number(f.salePrice),
          compare_at_price: Number(f.basePrice) > Number(f.salePrice) ? Number(f.basePrice) : undefined,
          inStock: totalStock > 0 && f.isPublished,
          is_active: f.isPublished,
          images: mappedImages,
          sizes: f.selectedSizes,
          available_sizes: f.selectedSizes,
          colors: f.selectedColors.map((c) => ({
            name: c.name,
            hex: c.hex,
            inStock: true,
            images: [f.mainImage],
          })),
          variants: mappedVariants,
          fabric: {
            composition: f.fabric,
            care: f.careInstructions,
          },
          fit_note: f.fitNote,
        }
        productsList.value[idx] = updated
        toast.success(`محصول «${updated.title}» با موفقیت به‌روزرسانی شد.`)
        return updated
      }
    }

    // ایجاد محصول تازه
    const newId = Math.max(...productsList.value.map((p) => p.id), 0) + 1
    const newProduct: ProductDetail = {
      id: newId,
      title: f.title || 'محصول جدید آتلیه کراس',
      slug: f.slug || (f.title ? f.title.toLowerCase().replace(/\s+/g, '-') : `item-${newId}`),
      division: f.division,
      category: f.category as ProductCategory,
      brand: f.brand || 'keras-atelier',
      season: (f.season as ProductSeason) || 'fall-1405',
      base_price: Number(f.basePrice) || 2000000,
      price: Number(f.salePrice) || Number(f.basePrice) || 2000000,
      compare_at_price: Number(f.basePrice) > Number(f.salePrice) ? Number(f.basePrice) : undefined,
      rating: 5,
      rating_avg: 5,
      reviewCount: 0,
      rating_count: 0,
      inStock: totalStock > 0 && f.isPublished,
      is_active: f.isPublished,
      badge: 'جدید',
      images: mappedImages,
      sizes: f.selectedSizes,
      available_sizes: f.selectedSizes,
      colors: f.selectedColors.map((c) => ({
        name: c.name,
        hex: c.hex,
        inStock: true,
        images: [f.mainImage],
      })),
      description: `${f.title} — طراحی اختصاصی در آتلیه مد کراس`,
      fabric: {
        composition: f.fabric,
        care: f.careInstructions,
      },
      fit_note: f.fitNote,
      variants: mappedVariants,
    }

    productsList.value.unshift(newProduct)
    toast.success(`محصول «${newProduct.title}» به کاتالوگ آتلیه افزوده شد.`)
    return newProduct
  }

  // حذف محصول
  const deleteProduct = (id: number) => {
    const idx = productsList.value.findIndex((p) => p.id === id)
    if (idx !== -1) {
      const removed = productsList.value.splice(idx, 1)[0]
      toast.success(`محصول «${removed?.title}» از کاتالوگ حذف گردید.`)
      return true
    }
    return false
  }

  // تغییر وضعیت فعال/موجودی
  const toggleProductActive = (product: ProductDetail) => {
    product.inStock = !product.inStock
    toast.info(
      product.inStock
        ? `محصول «${product.title}» در فروشگاه فعال شد.`
        : `محصول «${product.title}» موقتاً ناموجود شد.`,
    )
  }

  // افزودن / حذف رنگ
  const addColor = (name: string, hex: string) => {
    if (!productForm.value.selectedColors.some((c) => c.name === name)) {
      productForm.value.selectedColors.push({ name, hex })
      regenerateVariants()
    }
  }

  const removeColor = (name: string) => {
    productForm.value.selectedColors = productForm.value.selectedColors.filter((c) => c.name !== name)
    regenerateVariants()
  }

  // افزودن / حذف سایز
  const toggleSize = (size: string) => {
    const idx = productForm.value.selectedSizes.indexOf(size)
    if (idx === -1) {
      productForm.value.selectedSizes.push(size)
    } else {
      productForm.value.selectedSizes.splice(idx, 1)
    }
    regenerateVariants()
  }

  return {
    productsList,
    searchQuery,
    selectedCategory,
    filteredProducts,
    isDeletingId,
    productForm,
    initNewProductForm,
    loadProductForEdit,
    saveProduct,
    deleteProduct,
    toggleProductActive,
    regenerateVariants,
    addColor,
    removeColor,
    toggleSize,
  }
}
