"""
SandGuard Users Management API Endpoints
RBAC Protected endpoints for Admin and Officers to list, view, and manage accounts.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import RoleChecker, UserRole
from app.services.user_service import UserService
from app.schemas.user import UserResponse, UserCreate, UserUpdate
from app.repositories.user_repository import UserRepository

router = APIRouter(prefix="/users", tags=["Users Management"])

admin_officer_guard = RoleChecker([UserRole.ADMIN, UserRole.GOVT_OFFICER])


@router.get("/", response_model=List[UserResponse], dependencies=[Depends(admin_officer_guard)])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    """List all registered users (Admin/Officer only)."""
    user_repo = UserRepository(db)
    return await user_repo.get_all(skip=skip, limit=limit)


@router.get("/{user_id}", response_model=UserResponse, dependencies=[Depends(admin_officer_guard)])
async def get_user_by_id(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get single user profile by ID."""
    user_service = UserService(db)
    return await user_service.get_user_by_id(user_id)
