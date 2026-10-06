// server/api/taxonomy/index.get.ts
import { currentStoreTaxonomy } from '../../mock/taxonomy'
import type { StoreTaxonomy } from '~/types/domain'

export default defineEventHandler((): StoreTaxonomy => {
  return currentStoreTaxonomy
})

