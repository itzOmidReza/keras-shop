from datetime import date
import re
from typing import Optional, List
from pydantic import ConfigDict, BaseModel, Field, field_validator


# --- Address Schemas ---

class AddressBase(BaseModel):
    title: str = Field(..., example="Home", description="Label for the address (e.g. Home, Office)")
    fullName: Optional[str] = None
    receiver_name: Optional[str] = None
    phoneNumber: Optional[str] = None
    receiver_phone: Optional[str] = None
    province: str = Field(..., example="تهران")
    city: str = Field(..., example="تهران")
    exactAddress: Optional[str] = None
    postal_address: Optional[str] = None
    postalCode: Optional[str] = None
    postal_code: Optional[str] = None
    buildingNumber: Optional[str] = None
    building_number: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None
    isDefault: Optional[bool] = None
    is_default: bool = False

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)


class AddressCreate(BaseModel):
    title: str
    fullName: Optional[str] = None
    receiver_name: Optional[str] = None
    phoneNumber: Optional[str] = None
    receiver_phone: Optional[str] = None
    province: str
    city: str
    exactAddress: Optional[str] = None
    postal_address: Optional[str] = None
    postalCode: Optional[str] = None
    postal_code: Optional[str] = None
    buildingNumber: Optional[str] = None
    building_number: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None
    isDefault: Optional[bool] = False
    is_default: Optional[bool] = False


class AddressUpdate(BaseModel):
    title: Optional[str] = None
    fullName: Optional[str] = None
    receiver_name: Optional[str] = None
    phoneNumber: Optional[str] = None
    receiver_phone: Optional[str] = None
    province: Optional[str] = None
    city: Optional[str] = None
    exactAddress: Optional[str] = None
    postal_address: Optional[str] = None
    postalCode: Optional[str] = None
    postal_code: Optional[str] = None
    buildingNumber: Optional[str] = None
    building_number: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None
    isDefault: Optional[bool] = None
    is_default: Optional[bool] = None


class AddressResponse(BaseModel):
    id: str
    title: str
    fullName: str
    phoneNumber: str
    province: str
    city: str
    postalCode: str
    exactAddress: str
    buildingNumber: Optional[str] = None
    unit: Optional[str] = None
    notes: Optional[str] = None
    isDefault: bool = False

    # Backwards compatibility aliases
    user_id: Optional[str] = None
    receiver_name: Optional[str] = None
    receiver_phone: Optional[str] = None
    postal_address: Optional[str] = None
    postal_code: Optional[str] = None
    is_default: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)


# --- User Profile Schemas ---

class UserProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None


class UserProfileResponse(BaseModel):
    id: str
    phoneNumber: str
    phone: Optional[str] = None
    fullName: Optional[str] = None
    full_name: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None
    role: str = "customer"
    is_active: bool = True
    createdAt: Optional[str] = None
    addresses: List[AddressResponse] = []

    model_config = ConfigDict(from_attributes=True)