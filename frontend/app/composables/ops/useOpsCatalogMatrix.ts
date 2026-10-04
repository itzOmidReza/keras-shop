// frontend/app/composables/ops/useOpsCatalogMatrix.ts
import { ref, computed } from 'vue'

export interface VariantMatrixItem {
  id: string
  color: string
  colorEn: string
  size: string
  line: 'move' | 'calm'
  sku: string
  barcode: string
  weightGrams: number
  basePrice: number
  salePrice: number
  stock: number
  enabled: boolean
}

export function useOpsCatalogMatrix() {
  const selectedColors = ref<{ fa: string; en: string }[]>([
    { fa: 'مشکی موکا', en: 'BLK' },
    { fa: 'سبز مریم‌گلی', en: 'SGE' },
    { fa: 'خاک رس', en: 'CLY' },
  ])

  const selectedSizes = ref<string[]>(['S', 'M', 'L', 'XL'])
  const selectedLine = ref<'move' | 'calm'>('calm')
  const baseSkuPrefix = ref('KRS-LMT-1405')
  const defaultBasePrice = ref(2950000)
  const defaultSalePrice = ref(2550000)
  const defaultStock = ref(10)
  const defaultWeight = ref(450)

  // ماتریس ترکیبات
  const matrixItems = ref<VariantMatrixItem[]>([])

  const generateBarcode = (seed: number): string => {
    const raw = `62601405${String(seed).padStart(4, '0')}`
    return `${raw}1`
  }

  const generateMatrix = () => {
    const items: VariantMatrixItem[] = []
    let counter = 1001

    for (const color of selectedColors.value) {
      for (const size of selectedSizes.value) {
        const sku = `${baseSkuPrefix.value}-${color.en}-${size}-${selectedLine.value.toUpperCase()}`
        items.push({
          id: `var_${Date.now()}_${counter}`,
          color: color.fa,
          colorEn: color.en,
          size,
          line: selectedLine.value,
          sku,
          barcode: generateBarcode(counter),
          weightGrams: defaultWeight.value,
          basePrice: defaultBasePrice.value,
          salePrice: defaultSalePrice.value,
          stock: defaultStock.value,
          enabled: true,
        })
        counter++
      }
    }

    matrixItems.value = items
  }

  // ایجاد ماتریس اولیه در زمان راه‌اندازی
  if (matrixItems.value.length === 0) {
    generateMatrix()
  }

  const totalVariantStock = computed(() =>
    matrixItems.value.filter(i => i.enabled).reduce((acc, curr) => acc + curr.stock, 0),
  )

  const activeVariantsCount = computed(() =>
    matrixItems.value.filter(i => i.enabled).length,
  )

  const toggleAll = (enable: boolean) => {
    matrixItems.value.forEach(i => (i.enabled = enable))
  }

  return {
    selectedColors,
    selectedSizes,
    selectedLine,
    baseSkuPrefix,
    defaultBasePrice,
    defaultSalePrice,
    defaultStock,
    defaultWeight,
    matrixItems,
    totalVariantStock,
    activeVariantsCount,
    generateMatrix,
    toggleAll,
  }
}
