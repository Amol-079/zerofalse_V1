from pydantic import BaseModel, Field
from typing import Optional, Literal, List
from datetime import datetime, timezone
from uuid import uuid4

class ScanEvent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    org_id: str
    api_key_id: str
    agent_id: str
    session_id: Optional[str] = None
    tool_name: str
    arguments_hash: str
    decision: Literal["allow", "warn", "block"]
    risk_score: float
    threat_type: Optional[str] = None
    severity: Literal["critical", "high", "medium", "low", "info"]
    evidence_count: int = 0
    evidence_summary: Optional[str] = None
    latency_ms: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ScanEventResponse(BaseModel):
    id: str
    agent_id: str
    session_id: Optional[str]
    tool_name: str
    decision: str
    risk_score: float
    threat_type: Optional[str]
    severity: str
    evidence_count: int
    evidence_summary: Optional[str]
    latency_ms: int
    created_at: datetime
