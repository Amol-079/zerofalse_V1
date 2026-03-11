from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime, timezone
from uuid import uuid4

class Alert(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    org_id: str
    scan_event_id: str
    title: str
    description: str
    severity: Literal["critical", "high", "medium", "low"]
    status: Literal["open", "acknowledged", "resolved"] = "open"
    acknowledged_by: Optional[str] = None
    acknowledged_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AlertResponse(BaseModel):
    id: str
    scan_event_id: str
    title: str
    description: str
    severity: str
    status: str
    acknowledged_by: Optional[str]
    acknowledged_at: Optional[datetime]
    resolved_at: Optional[datetime]
    created_at: datetime
