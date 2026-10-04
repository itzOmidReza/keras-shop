// frontend/app/composables/ops/useOpsTaxonomy.ts
import { toast } from 'vue-sonner'

export const DEFAULT_COLOR_HEX = '#1C1917'

export interface ColorSwatch {
  id: string
  name: string
  enName: string
  hex: string
  family: string
  patternUrl?: string
  inUseCount: number
}

export interface CategoryNode {
  id: string
  title: string
  slug: string
  parentId: string | null
  division: 'apparel' | 'accessories'
  icon?: string
  mandatoryFields: string[]
  inUseCount: number
}

export interface BrandItem {
  id: string
  name: string
  slug: string
  origin: string
  logoUrl?: string
  bio: string
  inUseCount: number
}

export interface CollectionDrop {
  id: string
  title: string
  slug: string
  season: string
  startDate: string
  endDate: string
  isActive: boolean
}

export interface SizeTemplateRow {
  size: string
  measurements: Record<string, number | string>
}

export interface SizeTemplate {
  id: string
  name: string
  categoryType: string
  columns: string[]
  rows: SizeTemplateRow[]
}

const INITIAL_COLORS: ColorSwatch[] = [
  { id: 'clr_black', name: 'مشکی زغالی', enName: 'Charcoal Black', hex: '#1C1917', family: 'مشکی و طوسی', inUseCount: 14 },
  { id: 'clr_ivory', name: 'سفید عاجی', enName: 'Ivory White', hex: '#FDFBF7', family: 'سفید و کرم', inUseCount: 8 },
  { id: 'clr_sand', name: 'کرم شنی', enName: 'Desert Sand', hex: '#E7DFD5', family: 'سفید و کرم', inUseCount: 12 },
  { id: 'clr_camel', name: 'شتری کلاسیک', enName: 'Royal Camel', hex: '#C19A6B', family: 'قهوه‌ای و شتری', inUseCount: 6 },
  { id: 'clr_navy', name: 'سرمه‌ای ادیتوریال', enName: 'Editorial Navy', hex: '#1E293B', family: 'آبی و سرمه‌ای', inUseCount: 9 },
  { id: 'clr_sage', name: 'سبز سدری مریم‌گلی', enName: 'Sage Green', hex: '#87986A', family: 'سبز و زیتونی', inUseCount: 5 },
  { id: 'clr_rose', name: 'رز خاکستری آتلیه', enName: 'Dusty Atelier Rose', hex: '#C07D7D', family: 'زرشکی و صورتی', inUseCount: 4 },
  { id: 'clr_terracotta', name: 'آجری سفالین', enName: 'Terracotta Clay', hex: '#B85D43', family: 'قهوه‌ای و شتری', inUseCount: 3 },
  { id: 'clr_plaid_grey', name: 'پترن پیچازی زغالی', enName: 'Houndstooth Charcoal', hex: '#374151', family: 'طرح‌دار و پترن', patternUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=100&q=80', inUseCount: 2 },
]

const INITIAL_CATEGORIES: CategoryNode[] = [
  { id: 'cat_apparel', title: 'پوشاک (Apparel)', slug: 'apparel', parentId: null, division: 'apparel', mandatoryFields: ['sizes', 'fabricGsm'], inUseCount: 28 },
  { id: 'cat_shirts', title: 'شومیز و پیراهن', slug: 'shirts-blouses', parentId: 'cat_apparel', division: 'apparel', mandatoryFields: ['sizes', 'fabricGsm'], inUseCount: 8 },
  { id: 'cat_knitwear', title: 'بافت و پلیور', slug: 'knitwear', parentId: 'cat_apparel', division: 'apparel', mandatoryFields: ['sizes', 'fabricGsm'], inUseCount: 6 },
  { id: 'cat_coats', title: 'پالتو، کت و بارانی', slug: 'coats-jackets', parentId: 'cat_apparel', division: 'apparel', mandatoryFields: ['sizes', 'fabricGsm', 'care'], inUseCount: 7 },
  { id: 'cat_pants', title: 'شلوار و دامن', slug: 'pants', parentId: 'cat_apparel', division: 'apparel', mandatoryFields: ['sizes', 'fabricGsm'], inUseCount: 5 },
  { id: 'cat_tops', title: 'تاپ و بادی', slug: 'tops', parentId: 'cat_apparel', division: 'apparel', mandatoryFields: ['sizes'], inUseCount: 2 },
  { id: 'cat_accessories', title: 'اکسسوری (Accessories)', slug: 'accessories', parentId: null, division: 'accessories', mandatoryFields: ['fabricCare'], inUseCount: 16 },
  { id: 'cat_scarves', title: 'شال و روسری', slug: 'scarves', parentId: 'cat_accessories', division: 'accessories', mandatoryFields: ['fabricComposition'], inUseCount: 6 },
  { id: 'cat_hair', title: 'اکسسوری مو و اسکرانچی', slug: 'hair-accessories', parentId: 'cat_accessories', division: 'accessories', mandatoryFields: [], inUseCount: 5 },
  { id: 'cat_bandanas', title: 'باندانا و دستمال گردن', slug: 'bandanas', parentId: 'cat_accessories', division: 'accessories', mandatoryFields: [], inUseCount: 5 },
]

const INITIAL_BRANDS: BrandItem[] = [
  { id: 'br_atelier', name: 'استودیو کراس (Keras Atelier)', slug: 'keras-atelier', origin: 'تهران، ایران', bio: 'خط اصلی مد و هنر خیاطی دست‌دوز کراس با الیاف طبیعی و برش‌های مینیمال ادیتوریال.', inUseCount: 32 },
  { id: 'br_blacklabel', name: 'کراس بلک‌لیبل (Keras Black Label)', slug: 'keras-black-label', origin: 'تهران، ایران', bio: 'کالکشن کپسولی لیمیتد از پارچه‌های نایاب ابریشم و کشمیر اعلا.', inUseCount: 8 },
  { id: 'br_movement', name: 'کراس دیلی (Keras Movement & Daily)', slug: 'keras-daily', origin: 'تهران، ایران', bio: 'پوشاک لوکس روزمره با پارچه‌های تنفس‌پذیر لینن و پنبه ارگانیک.', inUseCount: 4 },
]

const INITIAL_COLLECTIONS: CollectionDrop[] = [
  { id: 'col_fall1405', title: 'کالکشن پاییز ۱۴۰۵ (Atelier Autumn Drop)', slug: 'fall-1405', season: 'fall-1405', startDate: '۱۴۰۵/۰۷/۰۱', endDate: '۱۴۰۵/۰۹/۳۰', isActive: true },
  { id: 'col_winter1405', title: 'کپسول کشمیر زمستان ۱۴۰۵', slug: 'winter-1405', season: 'winter-1405', startDate: '۱۴۰۵/۱۰/۰۱', endDate: '۱۴۰۵/۱۲/۲۹', isActive: false },
  { id: 'col_spring1406', title: 'پیش‌نمایش نوروز و بهار ۱۴۰۶', slug: 'spring-1406', season: 'spring-1406', startDate: '۱۴۰۵/۱۲/۱۵', endDate: '۱۴۰۶/۰۲/۳۱', isActive: false },
  { id: 'col_fourseason', title: 'کالکشن ادیتوریال چهار فصل', slug: 'four-season', season: 'four-season', startDate: '۱۴۰۵/۰۱/۰۱', endDate: '۱۴۰۵/۱۲/۲۹', isActive: true },
]

const INITIAL_SIZE_TEMPLATES: SizeTemplate[] = [
  {
    id: 'tpl_blouse',
    name: 'قالب بالاتنه، شومیز و بلوز',
    categoryType: 'shirts-blouses',
    columns: ['دور سینه', 'دور کمر', 'عرض شانه', 'قد آستین', 'قد لباس'],
    rows: [
      { size: 'XS', measurements: { 'دور سینه': 88, 'دور کمر': 68, 'عرض شانه': 37, 'قد آستین': 58, 'قد لباس': 65 } },
      { size: 'S', measurements: { 'دور سینه': 92, 'دور کمر': 72, 'عرض شانه': 38, 'قد آستین': 59, 'قد لباس': 66 } },
      { size: 'M', measurements: { 'دور سینه': 96, 'دور کمر': 76, 'عرض شانه': 39, 'قد آستین': 60, 'قد لباس': 67 } },
      { size: 'L', measurements: { 'دور سینه': 102, 'دور کمر': 82, 'عرض شانه': 41, 'قد آستین': 61, 'قد لباس': 68 } },
      { size: 'XL', measurements: { 'دور سینه': 108, 'دور کمر': 88, 'عرض شانه': 43, 'قد آستین': 62, 'قد لباس': 69 } },
    ],
  },
  {
    id: 'tpl_coat',
    name: 'قالب پالتو، بارانی و اورکت اوورسایز',
    categoryType: 'coats-jackets',
    columns: ['دور سینه پالتو', 'عرض سرشانه', 'قد آستین', 'قد کل پالتو'],
    rows: [
      { size: 'XS', measurements: { 'دور سینه پالتو': 104, 'عرض سرشانه': 42, 'قد آستین': 60, 'قد کل پالتو': 118 } },
      { size: 'S', measurements: { 'دور سینه پالتو': 108, 'عرض سرشانه': 44, 'قد آستین': 61, 'قد کل پالتو': 120 } },
      { size: 'M', measurements: { 'دور سینه پالتو': 114, 'عرض سرشانه': 46, 'قد آستین': 62, 'قد کل پالتو': 122 } },
      { size: 'L', measurements: { 'دور سینه پالتو': 120, 'عرض سرشانه': 48, 'قد آستین': 63, 'قد کل پالتو': 124 } },
      { size: 'XL', measurements: { 'دور سینه پالتو': 126, 'عرض سرشانه': 50, 'قد آستین': 64, 'قد کل پالتو': 125 } },
    ],
  },
  {
    id: 'tpl_pants',
    name: 'قالب شلوار کلاسیک و راسته',
    categoryType: 'pants',
    columns: ['دور کمر', 'دور باسن', 'فاق شلوار', 'قد داخل شلوار (Inseam)', 'قد کل شلوار'],
    rows: [
      { size: 'XS', measurements: { 'دور کمر': 66, 'دور باسن': 90, 'فاق شلوار': 29, 'قد داخل شلوار (Inseam)': 78, 'قد کل شلوار': 104 } },
      { size: 'S', measurements: { 'دور کمر': 70, 'دور باسن': 94, 'فاق شلوار': 30, 'قد داخل شلوار (Inseam)': 79, 'قد کل شلوار': 105 } },
      { size: 'M', measurements: { 'دور کمر': 74, 'دور باسن': 98, 'فاق شلوار': 31, 'قد داخل شلوار (Inseam)': 80, 'قد کل شلوار': 106 } },
      { size: 'L', measurements: { 'دور کمر': 80, 'دور باسن': 104, 'فاق شلوار': 32, 'قد داخل شلوار (Inseam)': 80, 'قد کل شلوار': 107 } },
      { size: 'XL', measurements: { 'دور کمر': 86, 'دور باسن': 110, 'فاق شلوار': 33, 'قد داخل شلوار (Inseam)': 81, 'قد کل شلوار': 108 } },
    ],
  },
  {
    id: 'tpl_free',
    name: 'قالب ابعاد اکسسوری و شال فری‌سایز',
    categoryType: 'scarves',
    columns: ['طول (سانتیمتر)', 'عرض (سانتیمتر)'],
    rows: [
      { size: 'Free', measurements: { 'طول (سانتیمتر)': 200, 'عرض (سانتیمتر)': 75 } },
    ],
  },
]

// وضعیت اشتراکی در سطح ماژول
const colorSwatches = ref<ColorSwatch[]>(JSON.parse(JSON.stringify(INITIAL_COLORS)))
const categoryTree = ref<CategoryNode[]>(JSON.parse(JSON.stringify(INITIAL_CATEGORIES)))
const brandItems = ref<BrandItem[]>(JSON.parse(JSON.stringify(INITIAL_BRANDS)))
const collectionDrops = ref<CollectionDrop[]>(JSON.parse(JSON.stringify(INITIAL_COLLECTIONS)))
const sizeTemplates = ref<SizeTemplate[]>(JSON.parse(JSON.stringify(INITIAL_SIZE_TEMPLATES)))

export function useOpsTaxonomy() {
  // ۱. مدیریت رنگ‌ها و پترن‌ها
  const addColorSwatch = (swatch: Omit<ColorSwatch, 'id' | 'inUseCount'>): ColorSwatch => {
    const newColor: ColorSwatch = {
      ...swatch,
      id: `clr_${Date.now()}`,
      inUseCount: 0,
    }
    colorSwatches.value.push(newColor)
    toast.success(`رنگ «${newColor.name}» به کاتالوگ افزوده شد.`)
    return newColor
  }

  const deleteColorSwatch = (id: string): boolean => {
    const idx = colorSwatches.value.findIndex((c) => c.id === id)
    if (idx === -1) return false

    const color = colorSwatches.value[idx]!
    if (color.inUseCount > 0) {
      toast.error(`رنگ «${color.name}» در ${color.inUseCount} محصول فعال استفاده شده است و حذف مستقیم آن مجاز نیست. ابتدا آن را ادغام نمایید.`)
      return false
    }

    colorSwatches.value.splice(idx, 1)
    toast.success(`رنگ «${color.name}» حذف گردید.`)
    return true
  }

  const mergeColors = (sourceId: string, targetId: string): boolean => {
    const src = colorSwatches.value.find((c) => c.id === sourceId)
    const tgt = colorSwatches.value.find((c) => c.id === targetId)

    if (!src || !tgt || src.id === tgt.id) {
      toast.error('رنگ مبدا و مقصد معتبر نیستند.')
      return false
    }

    tgt.inUseCount += src.inUseCount
    colorSwatches.value = colorSwatches.value.filter((c) => c.id !== sourceId)
    toast.success(`کلیه تخصیص‌های رنگ «${src.name}» با موفقیت به «${tgt.name}» منتقل و رنگ مبدا ادغام شد.`)
    return true
  }

  // ۲. مدیریت دسته‌بندی‌ها
  const addCategoryNode = (cat: Omit<CategoryNode, 'id' | 'inUseCount'>): CategoryNode => {
    const newCat: CategoryNode = {
      ...cat,
      id: `cat_${Date.now()}`,
      inUseCount: 0,
    }
    categoryTree.value.push(newCat)
    toast.success(`دسته‌بندی «${newCat.title}» ثبت گردید.`)
    return newCat
  }

  const deleteCategoryNode = (id: string): boolean => {
    const idx = categoryTree.value.findIndex((c) => c.id === id)
    if (idx === -1) return false

    const cat = categoryTree.value[idx]!
    if (cat.inUseCount > 0) {
      toast.error(`دسته‌بندی «${cat.title}» دارای ${cat.inUseCount} محصول فعال است و حذف آن مجاز نیست.`)
      return false
    }

    categoryTree.value.splice(idx, 1)
    toast.success(`دسته‌بندی «${cat.title}» حذف گردید.`)
    return true
  }

  // ۳. برندها
  const addBrandItem = (brand: Omit<BrandItem, 'id' | 'inUseCount'>): BrandItem => {
    const newBrand: BrandItem = {
      ...brand,
      id: `br_${Date.now()}`,
      inUseCount: 0,
    }
    brandItems.value.push(newBrand)
    toast.success(`برند / طراح «${newBrand.name}» با موفقیت افزوده شد.`)
    return newBrand
  }

  // ۴. کالکشن‌ها و دراپ‌ها
  const addCollectionDrop = (drop: Omit<CollectionDrop, 'id'>): CollectionDrop => {
    const newDrop: CollectionDrop = {
      ...drop,
      id: `col_${Date.now()}`,
    }
    collectionDrops.value.unshift(newDrop)
    toast.success(`کالکشن «${newDrop.title}» ثبت گردید.`)
    return newDrop
  }

  // ۵. قالب‌های راهنمای سایز
  const addSizeTemplate = (tpl: Omit<SizeTemplate, 'id'>): SizeTemplate => {
    const newTpl: SizeTemplate = {
      ...tpl,
      id: `tpl_${Date.now()}`,
    }
    sizeTemplates.value.push(newTpl)
    toast.success(`قالب جدول سایز «${newTpl.name}» ایجاد گردید.`)
    return newTpl
  }

  return {
    colorSwatches,
    categoryTree,
    brandItems,
    collectionDrops,
    sizeTemplates,
    addColorSwatch,
    deleteColorSwatch,
    mergeColors,
    addCategoryNode,
    deleteCategoryNode,
    addBrandItem,
    addCollectionDrop,
    addSizeTemplate,
  }
}
