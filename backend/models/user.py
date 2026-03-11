from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    email: EmailStr
    hashed_password: str
    full_name: Optional[str] = None
    is_verified: bool = False
    is_active: bool = True
    org_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: Optional[str] = None
    is_verified: bool
    is_active: bool
    org_id: str
    created_at: datetime
