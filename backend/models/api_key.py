from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from uuid import uuid4

class APIKey(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    org_id: str
    user_id: str
    name: str
    key_hash: str
    key_prefix: str
    is_active: bool = True
    last_used_at: Optional[datetime] = None
    total_calls: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class APIKeyResponse(BaseModel):
    id: str
    name: str
    key_prefix: str
    is_active: bool
    last_used_at: Optional[datetime]
    total_calls: int
    created_at: datetime
