from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi


def custom_openapi(app: FastAPI):
    """
    Generates and caches custom OpenAPI schema for Swagger UI and ReDoc.
    Configures Bearer JWT authentication globally for interactive documentation.
    """
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title="Sage E-Commerce Core API",
        version="1.0.0",
        description=(
            "### Production-Grade Async E-Commerce API Engine\n\n"
            "Provides high-concurrency order processing, stock locking, SMS passwordless OTP authentication, "
            "and Zarinpal payment gateway integration.\n\n"
            "**Key Features:**\n"
            "* **Authentication:** SMS OTP via Kavenegar + JWT Bearer Tokens\n"
            "* **Concurrency Control:** Pessimistic Row Locking (`FOR UPDATE`) for inventory protection\n"
            "* **Payments:** Zarinpal REST API v4 Integration\n"
        ),
        routes=app.routes,
    )

    # Configure Security Schemes for Swagger UI
    openapi_schema["components"] = openapi_schema.get("components", {})
    openapi_schema["components"]["securitySchemes"] = {
        "HTTPBearer": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter your JWT Access Token (obtained via `/api/v1/auth/verify-otp`).",
        }
    }

    # Security requirement application
    openapi_schema["security"] = [{"HTTPBearer": []}]

    app.openapi_schema = openapi_schema
    return app.openapi_schema