from pydantic import BaseModel, Field
from typing import Optional, Literal, List, Dict, Any
from datetime import datetime

class ToolCallScanRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]
    agent_id: str
    session_id: Optional[str] = None
    caller_agent_id: Optional[str] = None

class PromptScanRequest(BaseModel):
    text: str
    agent_id: str
    session_id: Optional[str] = None

class ScanResponse(BaseModel):
    scan_id: str
    decision: Literal["allow", "warn", "block"]
    risk_score: float
    severity: Literal["critical", "high", "medium", "low", "info"]
    threat_type: Optional[str]
    title: str
    description: str
    evidence: List[str]
    latency_ms: int
    timestamp: datetime

class BatchScanRequest(BaseModel):
    scans: List[ToolCallScanRequest] = Field(max_length=10)
