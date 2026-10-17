// server/api/[...slug].ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const targetBase = (config.backendUrl || process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '')
  const targetUrl = `${targetBase}${event.path}`

  try {
    return await proxyRequest(event, targetUrl)
  } catch (error: unknown) {
    const err = error as { statusCode?: number; message?: string; data?: unknown }
    throw createError({
      statusCode: err?.statusCode || 502,
      statusMessage: 'Bad Gateway: Unable to reach backend service',
      data: err?.data || err?.message,
    })
  }
})

