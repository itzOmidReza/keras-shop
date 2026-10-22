from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import (
    PhoneAuthRequest,
    VerifyOTPRequest,
    TokenResponse,
    AuthTokens,
)
from app.schemas.user import UserProfileResponse
from app.services.auth import auth_service
from app.core.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/request-otp",
    status_code=status.HTTP_200_OK,
    summary="Request SMS OTP Code",
)
@router.post(
    "/otp/send",
    status_code=status.HTTP_200_OK,
    summary="Nuxt Frontend SMS OTP Send endpoint",
)
async def request_otp(
    payload: PhoneAuthRequest,
    db: AsyncSession = Depends(get_db),
):
    phone = payload.get_phone
    code = await auth_service.request_otp(db=db, phone=phone)
    is_mock = not settings.FARAZSMS_API_KEY or settings.FARAZSMS_API_KEY in ("MOCK_KEY", "") or settings.ENVIRONMENT != "production"

    msg = "کد تأیید با موفقیت ارسال شد."
    if settings.ENVIRONMENT != "production" and is_mock:
        msg = f"کد تایید ۵ رقمی ارسال شد (کد تستی: {code})."

    return {
        "success": True,
        "message": msg,
        "expiresIn": 120,
        "expires_in_seconds": 120,
        "resend_after": 120,
        "dev_code": code if (is_mock and settings.ENVIRONMENT != "production") else None,
    }


@router.post(
    "/verify-otp",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Verify OTP & Exchange for JWT Keypair",
)
@router.post(
    "/otp/verify",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Nuxt Frontend SMS OTP Verify endpoint",
)
async def verify_otp(
    payload: VerifyOTPRequest,
    db: AsyncSession = Depends(get_db),
):
    phone = payload.get_phone
    access_token, refresh_token, user = await auth_service.verify_otp(
        db=db, phone=phone, code=payload.code
    )

    user_resp = UserProfileResponse(
        id=user.id,
        phoneNumber=user.phone,
        phone=user.phone,
        fullName=user.full_name or (user.first_name + " " + user.last_name if user.first_name and user.last_name else "کاربر گرامی کراس"),
        full_name=user.full_name,
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        birth_date=user.birth_date,
        role="super_admin" if user.role.value == "admin" else user.role.value,
        is_active=user.is_active,
        createdAt=user.created_at.isoformat() if hasattr(user, "created_at") and user.created_at else None,
    )

    tokens = AuthTokens(
        accessToken=access_token,
        tokenType="bearer",
        expiresIn=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in_seconds=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user_resp,
        tokens=tokens,
        message="ورود با موفقیت انجام شد.",
    )