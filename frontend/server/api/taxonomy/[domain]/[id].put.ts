// server/api/taxonomy/[domain]/[id].put.ts
import { currentStoreTaxonomy } from '../../../mock/taxonomy'
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

  const body = await readBody(event)
  const list = currentStoreTaxonomy[domain] as unknown as Array<{ id: string } & Record<string, unknown>>
  const index = list.findIndex((item) => item.id === id)

  if (index === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: `مورد مورد نظر با شناسه ${id} یافت نشد.`,
    })
  }

  if (domain === 'seasons' && body?.isCurrentDrop) {
    currentStoreTaxonomy.seasons.forEach((s) => {
      s.isCurrentDrop = false
    })
  }

  list[index] = {
    ...list[index],
    ...body,
    id,
  }

  return {
    success: true,
    domain,
    entity: list[index],
    taxonomy: currentStoreTaxonomy,
  }
})

