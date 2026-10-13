from typing import Optional
from pydantic import BaseModel, Field, field_validator
import re
from app.schemas.user import UserProfileResponse


class PhoneAuthRequest(BaseModel):
    phone: Optional[str] = None
    phoneNumber: Optional[str] = None

    @field_validator("phone", "phoneNumber")
    @classmethod
    def validate_iranian_phone(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        pattern = r"^09\d{9}$"
        clean_phone = v.strip()
        if not re.match(pattern, clean_phone):
            raise ValueError("Invalid Iranian mobile phone number format. Must start with 09 and have 11 digits.")
        return clean_phone

    @property
    def get_phone(self) -> str:
        return self.phoneNumber or self.phone or ""


class VerifyOTPRequest(BaseModel):
    phone: Optional[str] = None
    phoneNumber: Optional[str] = None
    code: str = Field(..., min_length=4, max_length=6, description="4, 5 or 6 digit numeric OTP code")

    @field_validator("code")
    @classmethod
    def validate_code_digits(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("OTP code must consist of digits only.")
        return v

    @property
    def get_phone(self) -> str:
        return self.phoneNumber or self.phone or ""


class AuthTokens(BaseModel):
    accessToken: str
    tokenType: str = "bearer"
    expiresIn: int


class TokenResponse(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    expires_in_seconds: Optional[int] = None
    user: UserProfileResponse
    tokens: Optional[AuthTokens] = None
    message: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    refresh_token: str