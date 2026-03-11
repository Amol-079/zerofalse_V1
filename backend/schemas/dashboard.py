from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime

class DailyTrend(BaseModel):
    date: str
    scans: int
    blocked: int
    warned: int

class DashboardStats(BaseModel):
    total_scans_today: int
    total_scans_week: int
    total_scans_month: int
    blocked_today: int
    warned_today: int
    open_alerts: int
    critical_alerts: int
    active_agents: int
    top_threat_type: Optional[str]
    scan_limit_month: int
    scan_used_month: int
    daily_trend: List[DailyTrend]

class AgentBreakdown(BaseModel):
    agent_id: str
    scan_count: int
    block_count: int

class ThreatBreakdown(BaseModel):
    by_type: dict
    by_severity: dict
    by_decision: dict
    by_agent: List[AgentBreakdown]

class RecentEventsQuery(BaseModel):
    limit: int = 20
    decision: Optional[Literal["allow", "warn", "block"]] = None
    severity: Optional[Literal["critical", "high", "medium", "low", "info"]] = None
    agent_id: Optional[str] = None
