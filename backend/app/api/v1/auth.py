"""
SandGuard Authentication & Token Endpoints
OAuth2 Password Flow login, Token Refresh, and Current User profile endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import decode_jwt_token, TokenPayload, oauth2_scheme
from app.services.user_service import UserService
from app.schemas.user import Token, UserResponse, UserCreate

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """OAuth2 password flow login endpoint."""
    user_service = UserService(db)
    user = await user_service.authenticate_user(form_data.username, form_data.password)
    return await user_service.create_tokens_for_user(user)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """Public user registration endpoint."""
    user_service = UserService(db)
    return await user_service.register_user(user_in)


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    token_payload: TokenPayload = Depends(decode_jwt_token),
    db: AsyncSession = Depends(get_db)
):
    """Fetch profile details of the authenticated user."""
    user_service = UserService(db)
    return await user_service.get_user_by_id(token_payload.sub)
