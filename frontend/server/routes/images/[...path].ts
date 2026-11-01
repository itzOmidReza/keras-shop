export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const targetBase = (process.env.NUXT_BACKEND_URL || process.env.BACKEND_URL || config.backendUrl || 'http://127.0.0.1:8000').replace(/\/$/, '')
  const targetUrl = `${targetBase}${event.path}`

  try {
    return await proxyRequest(event, targetUrl)
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string; data?: unknown }
    throw createError({
      statusCode: err?.statusCode || 404,
      statusMessage: 'Image not found or backend unreachable',
      data: err?.data || err?.message,
    })
  }
})

