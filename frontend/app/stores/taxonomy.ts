// app/stores/taxonomy.ts
import { defineStore } from 'pinia'
import type {
  StoreTaxonomy,
  TaxonomyDomain,
  CustomColor,
  CustomSize,
  TaxonomyCategory,
  TaxonomyBrand,
  TaxonomySeason,
} from '~/types/domain'

export const defaultStoreTaxonomy: StoreTaxonomy = {
  colors: [
    { id: 'col-1', name: 'مشکی ذغالی', hex: '#1C1917', slug: 'charcoal-black', isSystemDefault: true },
    { id: 'col-2', name: 'کرم ماسه‌ای', hex: '#E7E2D7', slug: 'sand-cream', isSystemDefault: true },
    { id: 'col-3', name: 'طوسی ملانژ', hex: '#94A3B8', slug: 'melange-grey', isSystemDefault: true },
    { id: 'col-4', name: 'یشمی کدر', hex: '#4D5D53', slug: 'muted-jade', isSystemDefault: true },
    { id: 'col-5', name: 'شتری عسلی', hex: '#C2A68C', slug: 'honey-camel', isSystemDefault: true },
    { id: 'col-6', name: 'سفید عاجی', hex: '#F8FAFC', slug: 'ivory-white', isSystemDefault: true },
    { id: 'col-7', name: 'سرمه‌ای عمیق', hex: '#1E293B', slug: 'deep-navy', isSystemDefault: true },
  ],
  sizes: [
    { id: 'sz-1', name: 'XS', group: 'alpha', order: 1, isSystemDefault: true },
    { id: 'sz-2', name: 'S', group: 'alpha', order: 2, isSystemDefault: true },
    { id: 'sz-3', name: 'M', group: 'alpha', order: 3, isSystemDefault: true },
    { id: 'sz-4', name: 'L', group: 'alpha', order: 4, isSystemDefault: true },
    { id: 'sz-5', name: 'XL', group: 'alpha', order: 5, isSystemDefault: true },
    { id: 'sz-6', name: '36', group: 'numeric', order: 6, isSystemDefault: true },
    { id: 'sz-7', name: '38', group: 'numeric', order: 7, isSystemDefault: true },
    { id: 'sz-8', name: '40', group: 'numeric', order: 8, isSystemDefault: true },
    { id: 'sz-9', name: '42', group: 'numeric', order: 9, isSystemDefault: true },
    { id: 'sz-10', name: '44', group: 'numeric', order: 10, isSystemDefault: true },
    { id: 'sz-11', name: 'Free Size', group: 'free', order: 11, isSystemDefault: true },
    { id: 'sz-12', name: 'Standard', group: 'accessory', order: 12, isSystemDefault: false },
  ],
  categories: [
    { id: 'cat-1', name: 'شومیز و پیراهن', slug: 'shirts-blouses', division: 'apparel', iconName: 'Shirt', isActive: true },
    { id: 'cat-2', name: 'بافت و پلیور', slug: 'knitwear', division: 'apparel', iconName: 'Sparkles', isActive: true },
    { id: 'cat-3', name: 'پالتو و بارانی', slug: 'coats-jackets', division: 'apparel', iconName: 'Layers', isActive: true },
    { id: 'cat-4', name: 'شلوار و لگ', slug: 'pants', division: 'apparel', iconName: 'Scissors', isActive: true },
    { id: 'cat-5', name: 'تاپ و تیشرت', slug: 'tops', division: 'apparel', iconName: 'Sun', isActive: true },
    { id: 'cat-6', name: 'اسکارف و شال', slug: 'scarves', division: 'accessories', iconName: 'Wind', isActive: true },
    { id: 'cat-7', name: 'اکسسوری مو', slug: 'hair-accessories', division: 'accessories', iconName: 'Heart', isActive: true },
    { id: 'cat-8', name: 'دستمال سر', slug: 'bandanas', division: 'accessories', iconName: 'Sparkles', isActive: true },
  ],
  brands: [
    { id: 'br-1', name: 'Keras Atelier', slug: 'keras-atelier', isFeatured: true },
    { id: 'br-2', name: 'Totême', slug: 'toteme', isFeatured: true },
    { id: 'br-3', name: 'Massimo Dutti', slug: 'massimo-dutti', isFeatured: true },
    { id: 'br-4', name: 'COS', slug: 'cos', isFeatured: true },
    { id: 'br-5', name: 'Zara', slug: 'zara', isFeatured: true },
    { id: 'br-6', name: 'Mango', slug: 'mango', isFeatured: true },
  ],
  seasons: [
    { id: 'sea-1', name: 'پاییز ۱۴۰۵', slug: 'fall-1405', isCurrentDrop: true, isActive: true },
    { id: 'sea-2', name: 'زمستان ۱۴۰۵', slug: 'winter-1405', isCurrentDrop: false, isActive: true },
    { id: 'sea-3', name: 'بهار ۱۴۰۶', slug: 'spring-1406', isCurrentDrop: false, isActive: true },
    { id: 'sea-4', name: 'تابستان ۱۴۰۵', slug: 'summer-1405', isCurrentDrop: false, isActive: true },
  ],
}

export const useTaxonomyStore = defineStore('taxonomy', () => {
  const taxonomy = ref<StoreTaxonomy>(JSON.parse(JSON.stringify(defaultStoreTaxonomy)))
  const isLoading = ref(false)
  const isSaving = ref(false)
  const hasFetched = ref(false)

  // Getters
  const colors = computed(() => taxonomy.value.colors)
  const sizes = computed(() => taxonomy.value.sizes)
  const categories = computed(() => taxonomy.value.categories)
  const brands = computed(() => taxonomy.value.brands)
  const seasons = computed(() => taxonomy.value.seasons)

  const activeCategories = computed(() => taxonomy.value.categories.filter((c) => c.isActive))
  const apparelCategories = computed(() =>
    taxonomy.value.categories.filter((c) => c.isActive && c.division === 'apparel'),
  )
  const accessoryCategories = computed(() =>
    taxonomy.value.categories.filter((c) => c.isActive && c.division === 'accessories'),
  )
  const activeBrands = computed(() => taxonomy.value.brands)
  const featuredBrands = computed(() => taxonomy.value.brands.filter((b) => b.isFeatured))
  const currentDropSeason = computed(
    () => taxonomy.value.seasons.find((s) => s.isCurrentDrop && s.isActive) || taxonomy.value.seasons[0],
  )
  const activeSeasons = computed(() => taxonomy.value.seasons.filter((s) => s.isActive))

  // Actions
  const fetchTaxonomy = async (force = false) => {
    if (hasFetched.value && !force) return
    isLoading.value = true
    try {
      const data = await $fetch<StoreTaxonomy>('/api/taxonomy')
      if (data) {
        taxonomy.value = data
        hasFetched.value = true
      }
    } catch (err) {
      console.error('Failed to fetch taxonomy from server, using local state:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Create entity
  const createEntity = async <T extends { id: string }>(
    domain: TaxonomyDomain,
    payload: Omit<T, 'id'> & { id?: string },
  ) => {
    isSaving.value = true
    try {
      const res = await $fetch<{ success: boolean; entity: T; taxonomy: StoreTaxonomy }>(
        `/api/taxonomy/${domain}`,
        {
          method: 'POST',
          body: payload,
        },
      )
      if (res?.taxonomy) {
        taxonomy.value = res.taxonomy
      } else if (res?.entity) {
        (taxonomy.value[domain] as unknown as Array<Record<string, unknown>>).push(res.entity as Record<string, unknown>)
      }
      return res.entity
    } catch {
      // Fallback local addition if network fails
      const fallbackId = payload.id || `${domain.slice(0, 3)}-${Date.now()}`
      const newEntity = { ...payload, id: fallbackId } as unknown as T
      if (domain === 'seasons' && (newEntity as unknown as TaxonomySeason).isCurrentDrop) {
        taxonomy.value.seasons.forEach((s) => {
          s.isCurrentDrop = false
        })
      }
      (taxonomy.value[domain] as unknown as Array<Record<string, unknown>>).push(newEntity as Record<string, unknown>)
      return newEntity
    } finally {
      isSaving.value = false
    }
  }

  // Update entity
  const updateEntity = async <T extends { id: string }>(
    domain: TaxonomyDomain,
    id: string,
    payload: Partial<T>,
  ) => {
    isSaving.value = true
    try {
      const res = await $fetch<{ success: boolean; entity: T; taxonomy: StoreTaxonomy }>(
        `/api/taxonomy/${domain}/${id}`,
        {
          method: 'PUT',
          body: payload,
        },
      )
      if (res?.taxonomy) {
        taxonomy.value = res.taxonomy
      } else {
        const list = taxonomy.value[domain] as unknown as T[]
        const idx = list.findIndex((it) => it.id === id)
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...payload } as T
        }
      }
      return res.entity
    } catch {
      // Local fallback update
      const list = taxonomy.value[domain] as unknown as T[]
      const idx = list.findIndex((it) => it.id === id)
      if (idx !== -1) {
        if (domain === 'seasons' && (payload as unknown as TaxonomySeason)?.isCurrentDrop) {
          taxonomy.value.seasons.forEach((s) => {
            s.isCurrentDrop = false
          })
        }
        list[idx] = { ...list[idx], ...payload } as T
      }
      return list[idx]
    } finally {
      isSaving.value = false
    }
  }

  // Delete entity
  const deleteEntity = async (domain: TaxonomyDomain, id: string) => {
    isSaving.value = true
    try {
      const res = await $fetch<{ success: boolean; id: string; taxonomy: StoreTaxonomy }>(
        `/api/taxonomy/${domain}/${id}`,
        {
          method: 'DELETE',
        },
      )
      if (res?.taxonomy) {
        taxonomy.value = res.taxonomy
      } else {
        const list = taxonomy.value[domain] as Array<{ id: string }>
        const idx = list.findIndex((it) => it.id === id)
        if (idx !== -1) {
          list.splice(idx, 1)
        }
      }
      return true
    } catch (err: unknown) {
      // If server returned error (e.g. category is in use), rethrow so UI can notify
      const statusMsg = (err as { data?: { statusMessage?: string } })?.data?.statusMessage ||
        (err as { statusMessage?: string })?.statusMessage ||
        (err instanceof Error ? err.message : '')
      if (statusMsg) {
        throw new Error(statusMsg, { cause: err })
      }
      // Otherwise remove locally
      const list = taxonomy.value[domain] as Array<{ id: string }>
      const idx = list.findIndex((it) => it.id === id)
      if (idx !== -1) {
        list.splice(idx, 1)
      }
      return true
    } finally {
      isSaving.value = false
    }
  }

  // Colors
  const addColor = (name: string, hex: string, slug?: string) => {
    const generatedSlug = slug || name.trim().toLowerCase().replace(/\s+/g, '-')
    return createEntity<CustomColor>('colors', {
      name,
      hex,
      slug: generatedSlug,
      isSystemDefault: false,
    })
  }

  const deleteColor = (id: string) => deleteEntity('colors', id)

  // Sizes
  const addSize = (
    name: string,
    group: 'alpha' | 'numeric' | 'accessory' | 'free' = 'alpha',
    order?: number,
  ) => {
    const nextOrder = order ?? taxonomy.value.sizes.length + 1
    return createEntity<CustomSize>('sizes', {
      name,
      group,
      order: nextOrder,
      isSystemDefault: false,
    })
  }

  const deleteSize = (id: string) => deleteEntity('sizes', id)

  // Categories
  const addCategory = (
    name: string,
    slug: string,
    division: 'apparel' | 'accessories',
    iconName?: string,
  ) => {
    return createEntity<TaxonomyCategory>('categories', {
      name,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      division,
      iconName: iconName || 'Shirt',
      isActive: true,
    })
  }

  const toggleCategoryActive = (id: string) => {
    const cat = taxonomy.value.categories.find((c) => c.id === id)
    if (!cat) return
    return updateEntity<TaxonomyCategory>('categories', id, { isActive: !cat.isActive })
  }

  const deleteCategory = (id: string) => deleteEntity('categories', id)

  // Brands
  const addBrand = (name: string, slug: string, isFeatured = true) => {
    return createEntity<TaxonomyBrand>('brands', {
      name,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      isFeatured,
    })
  }

  const toggleBrandFeatured = (id: string) => {
    const brand = taxonomy.value.brands.find((b) => b.id === id)
    if (!brand) return
    return updateEntity<TaxonomyBrand>('brands', id, { isFeatured: !brand.isFeatured })
  }

  const deleteBrand = (id: string) => deleteEntity('brands', id)

  // Seasons
  const addSeason = (name: string, slug: string, isCurrentDrop = false) => {
    return createEntity<TaxonomySeason>('seasons', {
      name,
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      isCurrentDrop,
      isActive: true,
    })
  }

  const setCurrentSeason = (id: string) => {
    return updateEntity<TaxonomySeason>('seasons', id, { isCurrentDrop: true })
  }

  const toggleSeasonActive = (id: string) => {
    const season = taxonomy.value.seasons.find((s) => s.id === id)
    if (!season) return
    return updateEntity<TaxonomySeason>('seasons', id, { isActive: !season.isActive })
  }

  const deleteSeason = (id: string) => deleteEntity('seasons', id)

  return {
    taxonomy,
    isLoading,
    isSaving,
    hasFetched,
    // Getters
    colors,
    sizes,
    categories,
    brands,
    seasons,
    activeCategories,
    apparelCategories,
    accessoryCategories,
    activeBrands,
    featuredBrands,
    currentDropSeason,
    activeSeasons,
    // Actions
    fetchTaxonomy,
    createEntity,
    updateEntity,
    deleteEntity,
    addColor,
    deleteColor,
    addSize,
    deleteSize,
    addCategory,
    toggleCategoryActive,
    deleteCategory,
    addBrand,
    toggleBrandFeatured,
    deleteBrand,
    addSeason,
    setCurrentSeason,
    toggleSeasonActive,
    deleteSeason,
  }
})

