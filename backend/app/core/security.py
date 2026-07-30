"""
SandGuard Core Security Module
JWT Authentication, bcrypt hashing, OAuth2 Password Bearer flow, and RBAC permissions.
"""

from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Any, Dict, Optional, Union
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel

from app.core.config import settings

# Crypt Context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 Scheme
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    GOVT_OFFICER = "GOVT_OFFICER"
    DISTRICT_OFFICER = "DISTRICT_OFFICER"
    ENVIRONMENTAL_OFFICER = "ENVIRONMENTAL_OFFICER"
    ANALYST = "ANALYST"
    PUBLIC_USER = "PUBLIC_USER"


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    org_id: Optional[str] = None
    exp: Optional[int] = None
    type: Optional[str] = "access"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a bcrypt hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate bcrypt hash for password."""
    return pwd_context.hash(password)


def create_access_token(
    subject: Union[str, Any],
    role: str,
    org_id: Optional[str] = None,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a signed JWT access token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {
        "exp": int(expire.timestamp()),
        "sub": str(subject),
        "role": role,
        "org_id": org_id,
        "type": "access"
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(
    subject: Union[str, Any],
    role: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Create a signed JWT refresh token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {
        "exp": int(expire.timestamp()),
        "sub": str(subject),
        "role": role,
        "type": "refresh"
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_jwt_token(token: str) -> TokenPayload:
    """Decode and validate a JWT token payload."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        return token_data
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )


class RoleChecker:
    """Dependency for RBAC role authorization checks."""
    def __init__(self, allowed_roles: list[UserRole]):
        self.allowed_roles = [r.value if isinstance(r, UserRole) else r for r in allowed_roles]

    def __call__(self, token_payload: TokenPayload = Depends(decode_jwt_token)) -> TokenPayload:
        if token_payload.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{token_payload.role}' does not have sufficient permissions. Required: {self.allowed_roles}"
            )
        return token_payload
