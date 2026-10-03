// frontend/app/composables/ops/useOpsProducts.ts
import { toast } from 'vue-sonner'
import { mockProducts } from '../../../server/mock/products'
import type {
  ProductDetail,
  ProductDivision,
  ProductCategory,
  ProductSeason,
} from '~/types/domain'

export interface ProductFormData {
  title: string
  slug: string
  division: ProductDivision
  category: ProductCategory
  season: ProductSeason
  badge: string
  basePrice: number
  salePrice: number
  mainImage: string
  galleryImages: string
  fabricGsm: number
  fabricComposition: string
  fabricCare: string
  stockXS: number
  stockS: number
  stockM: number
  stockL: number
  stockXL: number
  stockFree: number
}

// وضعیت به اشتراک گذاشته شده محصولات در سطح ماژول
const productsList = ref<ProductDetail[]>(
  JSON.parse(JSON.stringify(mockProducts)),
)

const productSearchQuery = ref('')
const selectedProductDivision = ref<'all' | 'apparel' | 'accessories'>('all')
const selectedProductCategory = ref('all')
const selectedProductSeason = ref('all')

const isProductModalOpen = ref(false)
const editingProduct = ref<ProductDetail | null>(null)

const productForm = ref<ProductFormData>({
  title: '',
  slug: '',
  division: 'apparel',
  category: 'shirts-blouses',
  season: 'fall-1405',
  badge: 'جدید',
  basePrice: 1850000,
  salePrice: 1850000,
  mainImage: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
  galleryImages: '',
  fabricGsm: 210,
  fabricComposition: '۱۰۰٪ الیاف طبیعی لینن اسلپ ارگانیک',
  fabricCare: 'شست‌وشوی دستی با آب ۳۰ درجه',
  stockXS: 5,
  stockS: 10,
  stockM: 15,
  stockL: 10,
  stockXL: 5,
  stockFree: 0,
})

const isDeleteProductDialogOpen = ref(false)
const productToDelete = ref<ProductDetail | null>(null)

export function useOpsProducts() {
  const filteredProducts = computed(() => {
    return productsList.value.filter((p) => {
      const q = productSearchQuery.value.trim().toLowerCase()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))

      const matchesDivision =
        selectedProductDivision.value === 'all' ||
        p.division === selectedProductDivision.value

      const matchesCategory =
        selectedProductCategory.value === 'all' ||
        p.category === selectedProductCategory.value

      const matchesSeason =
        selectedProductSeason.value === 'all' ||
        p.season === selectedProductSeason.value

      return matchesSearch && matchesDivision && matchesCategory && matchesSeason
    })
  })

  const getProductTotalStock = (p: ProductDetail): number => {
    if (p.variants && p.variants.length > 0) {
      return p.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
    }
    return p.inStock ? 25 : 0
  }

  const toggleProductActive = (p: ProductDetail) => {
    p.is_active = !p.is_active
    toast.success(
      `وضعیت کالا «${p.title}» به ${p.is_active ? 'فعال' : 'غیرفعال'} تغییر یافت.`,
    )
  }

  const autoDiscountPercent = computed(() => {
    if (productForm.value.basePrice <= 0 || productForm.value.salePrice <= 0) return 0
    if (productForm.value.basePrice <= productForm.value.salePrice) return 0
    return Math.round(
      ((productForm.value.basePrice - productForm.value.salePrice) /
        productForm.value.basePrice) *
        100,
    )
  })

  const openAddProductModal = () => {
    editingProduct.value = null
    productForm.value = {
      title: '',
      slug: '',
      division: 'apparel',
      category: 'shirts-blouses',
      season: 'fall-1405',
      badge: 'جدید',
      basePrice: 1850000,
      salePrice: 1850000,
      mainImage: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=80',
      galleryImages: '',
      fabricGsm: 220,
      fabricComposition: '۱۰۰٪ کتان ارگانیک شسته‌شده',
      fabricCare: 'شست‌وشوی ملایم با آب سرد، اتوکشی در دمای متوسط',
      stockXS: 4,
      stockS: 8,
      stockM: 12,
      stockL: 8,
      stockXL: 4,
      stockFree: 0,
    }
    isProductModalOpen.value = true
  }

  const openEditProductModal = (p: ProductDetail) => {
    editingProduct.value = p
    const xs = p.variants?.find((v) => v.size === 'XS')?.stock || 0
    const s = p.variants?.find((v) => v.size === 'S')?.stock || 0
    const m = p.variants?.find((v) => v.size === 'M')?.stock || 0
    const l = p.variants?.find((v) => v.size === 'L')?.stock || 0
    const xl = p.variants?.find((v) => v.size === 'XL')?.stock || 0
    const free = p.variants?.find((v) => v.size === 'Free')?.stock || 0

    productForm.value = {
      title: p.title,
      slug: p.slug,
      division: p.division,
      category: p.category,
      season: p.season,
      badge: p.badge || '',
      basePrice: p.compare_at_price || p.price,
      salePrice: p.price,
      mainImage: p.images?.[0]?.url || '',
      galleryImages: p.images?.slice(1).map((i) => i.url).join('\n') || '',
      fabricGsm: p.fabric?.gsm || p.fabric_gsm || 210,
      fabricComposition: p.fabric?.composition || p.fabric_composition || '',
      fabricCare: p.fabric?.care || '',
      stockXS: xs,
      stockS: s,
      stockM: m,
      stockL: l,
      stockXL: xl,
      stockFree: free,
    }
    isProductModalOpen.value = true
  }

  const saveProduct = () => {
    if (!productForm.value.title.trim()) {
      toast.error('لطفاً عنوان محصول را وارد نمایید.')
      return
    }
    if (!productForm.value.slug.trim()) {
      productForm.value.slug = `keras-item-${Date.now().toString().slice(-4)}`
    }

    const sizes =
      productForm.value.division === 'accessories'
        ? ['Free']
        : ['XS', 'S', 'M', 'L', 'XL']

    const variants =
      productForm.value.division === 'accessories'
        ? [
            {
              id: Date.now() + 1,
              sku: `${productForm.value.slug.toUpperCase()}-FREE`,
              color: 'تک‌رنگ',
              color_hex: 'rgb(59, 47, 44)',
              size: 'Free' as const,
              stock: productForm.value.stockFree || 15,
              reserved: 0,
            },
          ]
        : [
            { id: Date.now() + 1, sku: `${productForm.value.slug.toUpperCase()}-XS`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'XS' as const, stock: productForm.value.stockXS, reserved: 0 },
            { id: Date.now() + 2, sku: `${productForm.value.slug.toUpperCase()}-S`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'S' as const, stock: productForm.value.stockS, reserved: 0 },
            { id: Date.now() + 3, sku: `${productForm.value.slug.toUpperCase()}-M`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'M' as const, stock: productForm.value.stockM, reserved: 0 },
            { id: Date.now() + 4, sku: `${productForm.value.slug.toUpperCase()}-L`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'L' as const, stock: productForm.value.stockL, reserved: 0 },
            { id: Date.now() + 5, sku: `${productForm.value.slug.toUpperCase()}-XL`, color: 'اصلی', color_hex: 'rgb(59, 47, 44)', size: 'XL' as const, stock: productForm.value.stockXL, reserved: 0 },
          ]

    const galleryList = productForm.value.galleryImages
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0)

    const images = [
      {
        id: Date.now() + 10,
        url: productForm.value.mainImage,
        alt: productForm.value.title,
        kind: 'photo' as const,
        position: 1,
      },
      ...galleryList.map((url, idx) => ({
        id: Date.now() + 20 + idx,
        url,
        alt: `${productForm.value.title} - زاویه ${idx + 2}`,
        kind: 'photo' as const,
        position: idx + 2,
      })),
    ]

    if (editingProduct.value) {
      Object.assign(editingProduct.value, {
        title: productForm.value.title,
        slug: productForm.value.slug,
        division: productForm.value.division,
        category: productForm.value.category,
        season: productForm.value.season,
        badge: productForm.value.badge,
        price: productForm.value.salePrice,
        base_price: productForm.value.basePrice,
        compare_at_price:
          productForm.value.basePrice > productForm.value.salePrice
            ? productForm.value.basePrice
            : undefined,
        images,
        sizes,
        available_sizes: sizes,
        variants,
        fabric: {
          composition: productForm.value.fabricComposition,
          gsm: productForm.value.fabricGsm,
          care: productForm.value.fabricCare,
        },
        fabric_gsm: productForm.value.fabricGsm,
        fabric_composition: productForm.value.fabricComposition,
      })
      toast.success(`تغییرات کالا «${productForm.value.title}» با موفقیت ذخیره شد.`)
    } else {
      const newProd: ProductDetail = {
        id: Date.now(),
        slug: productForm.value.slug,
        title: productForm.value.title,
        brand: 'keras-atelier',
        division: productForm.value.division,
        category: productForm.value.category,
        season: productForm.value.season,
        badge: productForm.value.badge,
        price: productForm.value.salePrice,
        base_price: productForm.value.basePrice,
        compare_at_price:
          productForm.value.basePrice > productForm.value.salePrice
            ? productForm.value.basePrice
            : undefined,
        description: `طراحی و دوخت انحصاری استودیو کراس. متریال اعلا با گرماژ ${productForm.value.fabricGsm} گرم و برش مدرن ادیتوریال.`,
        fabric: {
          composition: productForm.value.fabricComposition,
          gsm: productForm.value.fabricGsm,
          care: productForm.value.fabricCare,
        },
        fabric_composition: productForm.value.fabricComposition,
        fabric_gsm: productForm.value.fabricGsm,
        stretch: 2,
        softness: 5,
        opacity: 5,
        rating: 5.0,
        rating_avg: 5.0,
        reviewCount: 0,
        rating_count: 0,
        is_active: true,
        inStock: true,
        sizes,
        available_sizes: sizes,
        colors: [{ name: 'اصلی', hex: 'rgb(59, 47, 44)' }],
        images,
        variants,
      }
      productsList.value.unshift(newProd)
      toast.success(`محصول جدید «${newProd.title}» به کاتالوگ اضافه گردید.`)
    }

    isProductModalOpen.value = false
  }

  const confirmDeleteProduct = () => {
    if (productToDelete.value) {
      const idx = productsList.value.findIndex(
        (p) => p.id === productToDelete.value?.id,
      )
      if (idx !== -1 && productsList.value[idx]) {
        const title = productsList.value[idx]!.title
        productsList.value.splice(idx, 1)
        toast.success(`کالای «${title}» با موفقیت حذف گردید.`)
      }
    }
    isDeleteProductDialogOpen.value = false
    productToDelete.value = null
  }

  return {
    productsList,
    productSearchQuery,
    selectedProductDivision,
    selectedProductCategory,
    selectedProductSeason,
    filteredProducts,
    getProductTotalStock,
    toggleProductActive,
    isProductModalOpen,
    editingProduct,
    productForm,
    autoDiscountPercent,
    openAddProductModal,
    openEditProductModal,
    saveProduct,
    isDeleteProductDialogOpen,
    productToDelete,
    confirmDeleteProduct,
  }
}
