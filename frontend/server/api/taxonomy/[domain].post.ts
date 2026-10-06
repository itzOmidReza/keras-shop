// server/api/taxonomy/[domain].post.ts
import { currentStoreTaxonomy } from '../../mock/taxonomy'
import type { TaxonomyDomain } from '~/types/domain'

export default defineEventHandler(async (event) => {
  const domain = getRouterParam(event, 'domain') as TaxonomyDomain
  const validDomains: TaxonomyDomain[] = ['colors', 'sizes', 'categories', 'brands', 'seasons']

  if (!domain || !validDomains.includes(domain)) {
    throw createError({
      statusCode: 400,
      statusMessage: `دامنه ویژگی نامعتبر است: ${domain}`,
    })
  }

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'اطلاعات ارسالی نمی‌تواند خالی باشد.',
    })
  }

  const id = body.id || `${domain.slice(0, 3)}-${Date.now()}`
  const newEntity = {
    ...body,
    id,
  }

  if (domain === 'seasons' && newEntity.isCurrentDrop) {
    currentStoreTaxonomy.seasons.forEach((s) => {
      s.isCurrentDrop = false
    })
  }

  (currentStoreTaxonomy[domain] as unknown as Array<Record<string, unknown>>).push(newEntity as Record<string, unknown>)

  return {
    success: true,
    domain,
    entity: newEntity,
    taxonomy: currentStoreTaxonomy,
  }
})

