// server/api/taxonomy/[domain]/[id].delete.ts
import { currentStoreTaxonomy } from '../../../mock/taxonomy'
import { mockProducts } from '../../../mock/products'
import type { TaxonomyDomain } from '~/types/domain'

export default defineEventHandler(async (event) => {
  const domain = getRouterParam(event, 'domain') as TaxonomyDomain
  const id = getRouterParam(event, 'id')
  const validDomains: TaxonomyDomain[] = ['colors', 'sizes', 'categories', 'brands', 'seasons']

  if (!domain || !validDomains.includes(domain)) {
    throw createError({
      statusCode: 400,
      statusMessage: `دامنه ویژگی نامعتبر است: ${domain}`,
    })
  }

  const list = currentStoreTaxonomy[domain] as Array<{ id: string; slug?: string; name: string; isSystemDefault?: boolean }>
  const item = list.find((it) => it.id === id)

  if (!item) {
    throw createError({
      statusCode: 404,
      statusMessage: `مورد با شناسه ${id} یافت نشد.`,
    })
  }

  // بررسی ایمنی وابستگی در محصولات کاتالوگ
  if (domain === 'categories' && item.slug) {
    const isUsed = mockProducts.some((p) => p.category === item.slug)
    if (isUsed) {
      throw createError({
        statusCode: 400,
        statusMessage: `دسته‌بندی «${item.name}» در محصولات فعال کاتالوگ استفاده شده و قابل حذف مستقیم نیست.`,
      })
    }
  } else if (domain === 'seasons' && item.slug) {
    const isUsed = mockProducts.some((p) => p.season === item.slug)
    if (isUsed) {
      throw createError({
        statusCode: 400,
        statusMessage: `فصل/دراپ «${item.name}» در محصولات کاتالوگ آتلیه استفاده شده و قابل حذف مستقیم نیست.`,
      })
    }
  }

  const index = list.findIndex((it) => it.id === id)
  if (index !== -1) {
    list.splice(index, 1)
  }

  return {
    success: true,
    domain,
    id,
    taxonomy: currentStoreTaxonomy,
  }
})

