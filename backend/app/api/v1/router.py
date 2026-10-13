from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin_analytics,
    admin_orders,
    admin_products,
    auth,
    cart,
    categories,
    coupons,
    orders,
    payments,
    products,
    shipping,
    users,
    settings,
    taxonomy,
    checkout_payment,
    articles,
    reviews,
    search,
)

# Root v1 router
api_v1_router = APIRouter(prefix="/v1")

api_v1_router.include_router(auth.router)
api_v1_router.include_router(users.router)
api_v1_router.include_router(products.router)
api_v1_router.include_router(categories.router)
api_v1_router.include_router(coupons.router)
api_v1_router.include_router(orders.router)
api_v1_router.include_router(payments.router)
api_v1_router.include_router(shipping.router)
api_v1_router.include_router(cart.router)
api_v1_router.include_router(admin_orders.router)
api_v1_router.include_router(admin_analytics.router)
api_v1_router.include_router(admin_products.router)
api_v1_router.include_router(settings.router)
api_v1_router.include_router(taxonomy.router)
api_v1_router.include_router(checkout_payment.router)
api_v1_router.include_router(articles.router)
api_v1_router.include_router(reviews.router)
api_v1_router.include_router(search.router)


# Nuxt root API router (without /v1 prefix, directly mounted at /api/...)
api_direct_router = APIRouter()

api_direct_router.include_router(auth.router)
api_direct_router.include_router(users.router)
api_direct_router.include_router(products.router)
api_direct_router.include_router(categories.router)
api_direct_router.include_router(coupons.router)
api_direct_router.include_router(orders.router)
api_direct_router.include_router(payments.router)
api_direct_router.include_router(shipping.router)
api_direct_router.include_router(cart.router)
api_direct_router.include_router(admin_orders.router)
api_direct_router.include_router(admin_analytics.router)
api_direct_router.include_router(admin_products.router)
api_direct_router.include_router(settings.router)
api_direct_router.include_router(taxonomy.router)
api_direct_router.include_router(checkout_payment.router)
api_direct_router.include_router(articles.router)
api_direct_router.include_router(reviews.router)
api_direct_router.include_router(search.router)
