"""
SandGuard Generic Base Repository Pattern
Provides standardized async CRUD and query interfaces across all entities.
"""

from typing import Generic, TypeVar, Type, Optional, List, Any, Sequence
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete, func
from app.core.database import Base

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, id: Any) -> Optional[ModelType]:
        """Fetch entity by primary key."""
        result = await self.session.execute(select(self.model).where(self.model.id == id))
        return result.scalars().first()

    async def get_all(self, skip: int = 0, limit: int = 100) -> Sequence[ModelType]:
        """Fetch paginated list of entities."""
        query = select(self.model).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def create(self, entity: ModelType) -> ModelType:
        """Persist a new entity instance."""
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def update(self, id: Any, values: dict) -> Optional[ModelType]:
        """Update entity by ID with dictionary values."""
        query = (
            update(self.model)
            .where(self.model.id == id)
            .values(**values)
            .execution_options(synchronize_session="fetch")
        )
        await self.session.execute(query)
        return await self.get_by_id(id)

    async def delete(self, id: Any) -> bool:
        """Delete entity by ID."""
        query = delete(self.model).where(self.model.id == id)
        result = await self.session.execute(query)
        return result.rowcount > 0

    async def count(self) -> int:
        """Count total records."""
        query = select(func.count()).select_from(self.model)
        result = await self.session.execute(query)
        return result.scalar() or 0
