// app/composables/admin/useAdminTaxonomy.ts
import { toast } from 'vue-sonner'
import type {
  CustomColor,
  CustomSize,
  TaxonomyCategory,
  TaxonomyBrand,
  TaxonomySeason,
} from '~/types/domain'

export const DEFAULT_COLOR_HEX = '#1C1917'

export function useAdminTaxonomy() {
  const store = useTaxonomyStore()

  // فعال‌سازی اولیه در صورت عدم دریافت داده
  onMounted(() => {
    store.fetchTaxonomy()
  })

  // تب فعال
  const activeTab = ref<'colors' | 'sizes' | 'categories' | 'brands' | 'seasons'>('colors')

  // فرم‌های ورودی سریع
  const colorForm = ref<{ name: string; hex: string; slug: string }>({
    name: '',
    hex: '#1C1917',
    slug: '',
  })

  const sizeForm = ref<{
    name: string
    group: CustomSize['group']
    order: number
  }>({
    name: '',
    group: 'alpha',
    order: 1,
  })

  const categoryForm = ref<{
    name: string
    slug: string
    division: 'apparel' | 'accessories'
    iconName: string
  }>({
    name: '',
    slug: '',
    division: 'apparel',
    iconName: 'Shirt',
  })

  const brandForm = ref<{
    name: string
    slug: string
    isFeatured: boolean
  }>({
    name: '',
    slug: '',
    isFeatured: true,
  })

  const seasonForm = ref<{
    name: string
    slug: string
    isCurrentDrop: boolean
  }>({
    name: '',
    slug: '',
    isCurrentDrop: false,
  })

  // اقدامات رنگ‌ها
  const handleCreateColor = async () => {
    if (!colorForm.value.name.trim()) {
      toast.error('لطفاً نام رنگ را وارد کنید.')
      return
    }
    try {
      await store.addColor(colorForm.value.name, colorForm.value.hex, colorForm.value.slug)
      toast.success(`رنگ «${colorForm.value.name}» با موفقیت افزوده شد.`)
      colorForm.value = { name: '', hex: '#1C1917', slug: '' }
    } catch {
      toast.error('خطا در ایجاد رنگ جدید.')
    }
  }

  const handleDeleteColor = async (color: CustomColor) => {
    try {
      await store.deleteColor(color.id)
      toast.success(`رنگ «${color.name}» با موفقیت حذف شد.`)
    } catch {
      toast.error('خطا در حذف رنگ.')
    }
  }

  // اقدامات سایزها
  const handleCreateSize = async () => {
    if (!sizeForm.value.name.trim()) {
      toast.error('لطفاً عنوان سایز را وارد کنید.')
      return
    }
    try {
      await store.addSize(sizeForm.value.name, sizeForm.value.group, sizeForm.value.order)
      toast.success(`سایز «${sizeForm.value.name}» با موفقیت افزوده شد.`)
      sizeForm.value = {
        name: '',
        group: 'alpha',
        order: store.sizes.length + 1,
      }
    } catch {
      toast.error('خطا در افزودن سایز.')
    }
  }

  const handleDeleteSize = async (size: CustomSize) => {
    try {
      await store.deleteSize(size.id)
      toast.success(`سایز «${size.name}» با موفقیت حذف شد.`)
    } catch {
      toast.error('خطا در حذف سایز.')
    }
  }

  // اقدامات دسته‌بندی‌ها
  const handleCreateCategory = async () => {
    if (!categoryForm.value.name.trim() || !categoryForm.value.slug.trim()) {
      toast.error('لطفاً عنوان و پیوند انگلیسی دسته‌بندی را وارد کنید.')
      return
    }
    try {
      await store.addCategory(
        categoryForm.value.name,
        categoryForm.value.slug,
        categoryForm.value.division,
        categoryForm.value.iconName,
      )
      toast.success(`دسته‌بندی «${categoryForm.value.name}» با موفقیت افزوده شد.`)
      categoryForm.value = {
        name: '',
        slug: '',
        division: 'apparel',
        iconName: 'Shirt',
      }
    } catch {
      toast.error('خطا در ایجاد دسته‌بندی جدید.')
    }
  }

  const handleToggleCategoryActive = async (cat: TaxonomyCategory) => {
    try {
      await store.toggleCategoryActive(cat.id)
      toast.info(
        cat.isActive
          ? `دسته‌بندی «${cat.name}» فعال شد.`
          : `دسته‌بندی «${cat.name}» غیرفعال شد.`,
      )
    } catch {
      toast.error('خطا در تغییر وضعیت دسته‌بندی.')
    }
  }

  const handleDeleteCategory = async (cat: TaxonomyCategory) => {
    try {
      await store.deleteCategory(cat.id)
      toast.success(`دسته‌بندی «${cat.name}» با موفقیت حذف شد.`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطا در حذف دسته‌بندی.'
      toast.error(message)
    }
  }

  // اقدامات برندها
  const handleCreateBrand = async () => {
    if (!brandForm.value.name.trim() || !brandForm.value.slug.trim()) {
      toast.error('لطفاً عنوان و اسلاگ برند را وارد کنید.')
      return
    }
    try {
      await store.addBrand(brandForm.value.name, brandForm.value.slug, brandForm.value.isFeatured)
      toast.success(`برند «${brandForm.value.name}» با موفقیت افزوده شد.`)
      brandForm.value = { name: '', slug: '', isFeatured: true }
    } catch {
      toast.error('خطا در ثبت برند.')
    }
  }

  const handleToggleBrandFeatured = async (brand: TaxonomyBrand) => {
    try {
      await store.toggleBrandFeatured(brand.id)
      toast.info(
        brand.isFeatured
          ? `برند «${brand.name}» در نوار شرکا و لوگوها برجسته شد.`
          : `برند «${brand.name}» از حالت برجسته خارج شد.`,
      )
    } catch {
      toast.error('خطا در تغییر وضعیت نمایش برند.')
    }
  }

  const handleDeleteBrand = async (brand: TaxonomyBrand) => {
    try {
      await store.deleteBrand(brand.id)
      toast.success(`برند «${brand.name}» حذف گردید.`)
    } catch {
      toast.error('خطا در حذف برند.')
    }
  }

  // اقدامات دراپ‌ها و فصل‌ها
  const handleCreateSeason = async () => {
    if (!seasonForm.value.name.trim() || !seasonForm.value.slug.trim()) {
      toast.error('لطفاً نام و کد فصل/دراپ را وارد کنید.')
      return
    }
    try {
      await store.addSeason(
        seasonForm.value.name,
        seasonForm.value.slug,
        seasonForm.value.isCurrentDrop,
      )
      toast.success(`فصل «${seasonForm.value.name}» با موفقیت اضافه شد.`)
      seasonForm.value = { name: '', slug: '', isCurrentDrop: false }
    } catch {
      toast.error('خطا در افزودن فصل جدید.')
    }
  }

  const handleSetCurrentSeason = async (season: TaxonomySeason) => {
    try {
      await store.setCurrentSeason(season.id)
      toast.success(`فصل «${season.name}» به عنوان دراپ جاری فروشگاه تنظیم شد.`)
    } catch {
      toast.error('خطا در تنظیم دراپ جاری.')
    }
  }

  const handleToggleSeasonActive = async (season: TaxonomySeason) => {
    try {
      await store.toggleSeasonActive(season.id)
      toast.info(
        season.isActive
          ? `دراپ «${season.name}» فعال شد.`
          : `دراپ «${season.name}» آرشیو و غیرفعال شد.`,
      )
    } catch {
      toast.error('خطا در تغییر وضعیت فصل.')
    }
  }

  const handleDeleteSeason = async (season: TaxonomySeason) => {
    try {
      await store.deleteSeason(season.id)
      toast.success(`فصل «${season.name}» حذف شد.`)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'خطا در حذف فصل.'
      toast.error(message)
    }
  }

  return {
    store,
    activeTab,
    // Forms
    colorForm,
    sizeForm,
    categoryForm,
    brandForm,
    seasonForm,
    // Colors
    handleCreateColor,
    handleDeleteColor,
    // Sizes
    handleCreateSize,
    handleDeleteSize,
    // Categories
    handleCreateCategory,
    handleToggleCategoryActive,
    handleDeleteCategory,
    // Brands
    handleCreateBrand,
    handleToggleBrandFeatured,
    handleDeleteBrand,
    // Seasons
    handleCreateSeason,
    handleSetCurrentSeason,
    handleToggleSeasonActive,
    handleDeleteSeason,
  }
}

