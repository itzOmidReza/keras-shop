import { describe, it, expect } from 'vitest'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000'

describe('Full-Stack Contract & Real Backend Integration Suite', () => {
  it('1. Backend health check returns healthy status', async () => {
    const res = await fetch(`${BACKEND_URL}/health`)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.status).toBe('healthy')
    expect(data.environment).toBeDefined()
  })

  it('2. Public Catalog returns real active fashion products', async () => {
    const res = await fetch(`${BACKEND_URL}/api/products`)
    expect(res.status).toBe(200)
    const products = await res.json()
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)

    const first = products[0]
    expect(first.id).toBeDefined()
    expect(first.title).toBeDefined()
    expect(first.slug).toBeDefined()
    expect(first.price).toBeGreaterThan(0)
    expect(Array.isArray(first.images)).toBe(true)

    // Verify PDP (Product Detail Page) endpoint
    const pdpRes = await fetch(`${BACKEND_URL}/api/products/${first.slug}`)
    expect(pdpRes.status).toBe(200)
    const pdp = await pdpRes.json()
    expect(pdp.slug).toBe(first.slug)
    expect(pdp.title).toBe(first.title)
    expect(pdp.fabric).toBeDefined()
  })

  it('3. Store Taxonomy returns structured categories, brands, seasons, colors, and sizes', async () => {
    const res = await fetch(`${BACKEND_URL}/api/taxonomy`)
    expect(res.status).toBe(200)
    const taxonomy = await res.json()
    expect(Array.isArray(taxonomy.categories)).toBe(true)
    expect(taxonomy.categories.length).toBeGreaterThan(0)
    expect(Array.isArray(taxonomy.brands)).toBe(true)
    expect(Array.isArray(taxonomy.seasons)).toBe(true)
    expect(Array.isArray(taxonomy.colors)).toBe(true)
    expect(Array.isArray(taxonomy.sizes)).toBe(true)

    const cat = taxonomy.categories[0]
    expect(cat.name).toBeDefined()
    expect(cat.slug).toBeDefined()
  })

  it('4. Site Settings returns branding, contact, shipping, and checkout rules', async () => {
    const res = await fetch(`${BACKEND_URL}/api/settings`)
    expect(res.status).toBe(200)
    const settings = await res.json()
    expect(settings.branding).toBeDefined()
    expect(settings.branding.brandNameFa).toBe('کراس')
    expect(settings.contact).toBeDefined()
    expect(settings.shipping).toBeDefined()
    expect(settings.shipping.freeShippingThreshold).toBeGreaterThan(0)
  })

  it('5. Editorial Journal returns published luxury magazine articles', async () => {
    const res = await fetch(`${BACKEND_URL}/api/articles`)
    expect(res.status).toBe(200)
    const articles = await res.json()
    expect(Array.isArray(articles)).toBe(true)
    expect(articles.length).toBeGreaterThan(0)

    const first = articles[0]
    expect(first.title).toBeDefined()
    expect(first.slug).toBeDefined()
    expect(first.category).toBeDefined()
    expect(first.author).toBeDefined()

    // Query article details by slug
    const detailRes = await fetch(`${BACKEND_URL}/api/articles/${first.slug}`)
    expect(detailRes.status).toBe(200)
    const detail = await detailRes.json()
    expect(detail.slug).toBe(first.slug)
  })

  it('6. Moderation Desk returns customer reviews', async () => {
    const res = await fetch(`${BACKEND_URL}/api/reviews`)
    expect(res.status).toBe(200)
    const reviews = await res.json()
    expect(Array.isArray(reviews)).toBe(true)
    expect(reviews.length).toBeGreaterThan(0)

    const first = reviews[0]
    expect(first.id).toBeDefined()
    expect(first.rating).toBeGreaterThanOrEqual(1)
    expect(first.comment).toBeDefined()
  })

  it('7. Real Authentication OTP flow exchanges verification code for genuine signed JWT', async () => {
    const phone = '09121112233'

    // Step 1: Send OTP
    const sendRes = await fetch(`${BACKEND_URL}/api/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone }),
    })
    expect(sendRes.status).toBe(200)
    const sendData = await sendRes.json()
    expect(sendData.success).toBe(true)

    // Step 2: Verify OTP
    const verifyRes = await fetch(`${BACKEND_URL}/api/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: phone, code: '12345' }),
    })
    expect(verifyRes.status).toBe(200)
    const authData = await verifyRes.json()
    expect(authData.access_token).toBeDefined()
    expect(authData.user).toBeDefined()
    expect(authData.user.phoneNumber).toBe(phone)

    const token = authData.access_token

    // Step 3: Fetch protected profile using the genuine JWT
    const profileRes = await fetch(`${BACKEND_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(profileRes.status).toBe(200)
    const profile = await profileRes.json()
    expect(profile.phoneNumber).toBe(phone)
  })

  it('8. Order Tracking returns live PostgreSQL order lifecycle and timeline events', async () => {
    const res = await fetch(`${BACKEND_URL}/api/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'KERAS-104921' }),
    })
    expect(res.status).toBe(200)
    const order = await res.json()
    expect(order.orderNumber).toBe('KERAS-104921')
    expect(order.recipientName).toBeDefined()
    expect(Array.isArray(order.items)).toBe(true)
    expect(order.items.length).toBeGreaterThan(0)
    expect(Array.isArray(order.timeline)).toBe(true)
    expect(order.timeline.length).toBeGreaterThan(0)
  })

  it('9. End-to-End Commercial Flow: Order creation, payment session initiation, verification, and persistence', async () => {
    // 1. Create order
    const orderPayload = {
      items: [
        {
          id: 'item-integ-1',
          productId: 24,
          variantId: 1,
          title: 'شال بلند پشمی بافت ضخیم',
          slug: 'thick-knit-wool-long-scarf',
          size: 'Free',
          color: 'مشکی',
          price: 1350000,
          quantity: 1,
          maxStock: 10,
          image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800',
        },
      ],
      shippingAddress: {
        fullName: 'تست یکپارچگی سیستم',
        phoneNumber: '09124445566',
        province: 'تهران',
        city: 'تهران',
        postalCode: '1987654321',
        exactAddress: 'خیابان شیراز جنوبی، پلاک ۱۰',
      },
      shippingMethod: 'standard',
      paymentMethod: 'online_gateway',
    }

    const orderRes = await fetch(`${BACKEND_URL}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    })
    expect(orderRes.status).toBe(201)
    const receipt = await orderRes.json()
    expect(receipt.orderNumber).toMatch(/^KERAS-/)
    expect(receipt.finalTotal).toBe(1415000)

    // 2. Initiate Shaparak payment gateway session
    const initRes = await fetch(`${BACKEND_URL}/api/checkout/payment/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderNumber: receipt.orderNumber,
        amount: receipt.finalTotal,
        callbackUrl: '/checkout/callback',
      }),
    })
    expect(initRes.status).toBe(200)
    const initData = await initRes.json()
    expect(initData.paymentToken).toBeDefined()
    expect(initData.gatewayUrl).toBeDefined()

    // 3. Query payment session details
    const sessionRes = await fetch(
      `${BACKEND_URL}/api/checkout/payment/session?token=${initData.paymentToken}`,
    )
    expect(sessionRes.status).toBe(200)
    const session = await sessionRes.json()
    expect(session.orderNumber).toBe(receipt.orderNumber)
    expect(session.status).toBe('pending')

    // 4. Verify payment transaction
    const verifyRes = await fetch(`${BACKEND_URL}/api/checkout/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentToken: initData.paymentToken,
        cardNumber: '۵۰۲۲۲۹******۳۳۴۴',
        action: 'success',
      }),
    })
    expect(verifyRes.status).toBe(200)
    const verifyData = await verifyRes.json()
    expect(verifyData.success).toBe(true)
    expect(verifyData.orderNumber).toBe(receipt.orderNumber)

    // 5. Verify order status in DB transitioned to 'processing'
    const trackRes = await fetch(`${BACKEND_URL}/api/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: receipt.orderNumber }),
    })
    expect(trackRes.status).toBe(200)
    const finalOrder = await trackRes.json()
    expect(finalOrder.status).toBe('processing')
  })

  it('10. Order Fulfillment Desk: Server pagination, status counts, live mutations and tracking dispatch', async () => {
    // 1. Fetch paginated orders desk list
    const res = await fetch(`${BACKEND_URL}/api/orders?page=1&limit=5`)
    expect(res.status).toBe(200)
    const deskData = await res.json()
    expect(Array.isArray(deskData.items)).toBe(true)
    expect(deskData.total).toBeGreaterThan(0)
    expect(deskData.counts).toBeDefined()
    expect(deskData.counts.all).toBeGreaterThan(0)
    expect(deskData.counts.processing).toBeDefined()

    const targetOrder = deskData.items[0]
    expect(targetOrder.orderNumber).toBeDefined()

    // 2. Test status mutation
    const statusRes = await fetch(`${BACKEND_URL}/api/orders/${targetOrder.orderNumber}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'shipped',
        customNote: 'سفارش در تست یکپارچگی به وضعیت ارسال‌شده منتقل شد.',
      }),
    })
    expect(statusRes.status).toBe(200)
    const updatedStatusOrder = await statusRes.json()
    expect(updatedStatusOrder.status).toMatch(/shipped|handed_over/)

    // 3. Test tracking code and carrier assignment
    const trackingRes = await fetch(`${BACKEND_URL}/api/orders/${targetOrder.orderNumber}/tracking`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackingCode: '626019999888777666555444',
        carrier: 'شرکت ملی پست (پیشتاز)',
      }),
    })
    expect(trackingRes.status).toBe(200)
    const updatedTrackingOrder = await trackingRes.json()
    expect(updatedTrackingOrder.trackingCode).toBe('626019999888777666555444')

    // 4. Test manual order entry
    const manualRes = await fetch(`${BACKEND_URL}/api/orders/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientName: 'مهسا امینیان',
        recipientPhone: '09129998877',
        shippingAddress: 'تهران، نیاوران، خ باهنر، پلاک ۴',
        totalAmount: 4500000,
      }),
    })
    expect(manualRes.status).toBe(201)
    const manualOrder = await manualRes.json()
    expect(manualOrder.orderNumber).toMatch(/^KRS-/)
    expect(manualOrder.recipientName).toBe('مهسا امینیان')
    expect(manualOrder.totalAmount).toBe(4500000)
  })
})
