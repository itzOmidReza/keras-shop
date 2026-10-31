import sys
import urllib.parse
from typing import Annotated, Any, List, Union
from pydantic import AnyHttpUrl, BeforeValidator, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> Union[List[str], str]:
    """Accepts both JSON array and comma-separated string for CORS origins."""
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",") if i.strip()]
    elif isinstance(v, (list, str)):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sage Design E-Commerce API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Environment: "development" | "production" (drives sandbox/mock behavior)
    ENVIRONMENT: str = "development"

    # Frontend SPA origin
    FRONTEND_URL: str = "http://localhost:3000"

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # CORS
    BACKEND_CORS_ORIGINS: Annotated[Union[List[str], str], BeforeValidator(parse_cors)] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "sage_ecommerce"

    @property
    def ASYNC_DATABASE_URI(self) -> str:
        escaped_password = urllib.parse.quote_plus(self.POSTGRES_PASSWORD)
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{escaped_password}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    # Redis Cache
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    # Payment Gateway - Saman Electronic Payment (SEP)
    SEP_TERMINAL_ID: str = ""
    SEP_REDIRECT_URL: str = ""  # Optional explicit override, defaults to FRONTEND_URL/payment/callback
    USE_MOCK_PAYMENT: bool = False  # Set to True in development to bypass remote SEP requests

    # SMS Gateway - FarazSMS
    FARAZSMS_API_KEY: str = ""
    FARAZSMS_ORIGINATOR: str = "90008361"
    FARAZSMS_PATTERN_CODE: str = ""
    FARAZSMS_CODE_VARIABLE: str = "code"

    # Download / Media Storage Server
    STORAGE_ENABLED: bool = False
    STORAGE_TYPE: str = "ftp"  # "ftp" or "local"
    STORAGE_HOST: str = ""
    STORAGE_PORT: int = 21
    STORAGE_USERNAME: str = ""
    STORAGE_PASSWORD: str = ""
    STORAGE_BASE_PATH: str = "public_html/products"
    STORAGE_CDN_URL: str = "https://dl.kerass.ir"


    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# Shipping promotion constants (Single source of truth)
FREE_SHIPPING_THRESHOLD_TOMAN = 1_200_000
FREE_SHIPPING_THRESHOLD_RIAL = FREE_SHIPPING_THRESHOLD_TOMAN * 10

settings = Settings()

if len(settings.SECRET_KEY) < 32:
    sys.exit("CRITICAL SECURITY ERROR: SECRET_KEY must be at least 32 characters long!")