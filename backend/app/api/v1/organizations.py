"""
SandGuard Organizations Management API Endpoints
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import RoleChecker, UserRole
from app.services.user_service import UserService
from app.schemas.user import OrganizationCreate, OrganizationResponse

router = APIRouter(prefix="/organizations", tags=["Organizations"])

admin_guard = RoleChecker([UserRole.ADMIN])


@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED, dependencies=[Depends(admin_guard)])
async def create_organization(
    org_in: OrganizationCreate,
    db: AsyncSession = Depends(get_db)
):
    """Create a new government agency or enterprise organization."""
    user_service = UserService(db)
    return await user_service.create_organization(org_in)


@router.get("/", response_model=List[OrganizationResponse])
async def list_organizations(db: AsyncSession = Depends(get_db)):
    """List registered organizations."""
    user_service = UserService(db)
    return await user_service.list_organizations()
