"""
SandGuard Pydantic v2 User, Auth, and Organization Schemas
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
EmailStr = str
from app.core.security import UserRole


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.PUBLIC_USER
    district_name: Optional[str] = None
    phone_number: Optional[str] = None
    organization_id: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    district_name: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    is_superuser: bool
    last_login: Optional[datetime] = None
    created_at: datetime


class OrganizationCreate(BaseModel):
    name: str
    code: str
    org_type: str = "GOVERNMENT"
    description: Optional[str] = None


class OrganizationResponse(OrganizationCreate):
    model_config = ConfigDict(from_attributes=True)

    id: str
    is_active: bool
    created_at: datetime
