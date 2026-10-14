// server/api/settings.get.ts
import { currentSiteSettings } from '../mock/settings'
import type { SiteSettings } from '~/types/domain'

export default defineEventHandler((): SiteSettings => {
  return currentSiteSettings
})
