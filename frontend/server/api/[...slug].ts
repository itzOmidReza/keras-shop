// server/api/[...slug].ts
export default defineEventHandler(async (event) => {
  const targetBase = process.env.BACKEND_URL || 'http://127.0.0.1:8000'
  const targetUrl = `${targetBase}${event.path}`
  return proxyRequest(event, targetUrl)
})
