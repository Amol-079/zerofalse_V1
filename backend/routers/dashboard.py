from fastapi import APIRouter, Depends, Query
from schemas.dashboard import DashboardStats, ThreatBreakdown, DailyTrend, AgentBreakdown
from services.auth_service import get_current_user
from database import get_database
from models.scan_event import ScanEventResponse
from datetime import datetime, timedelta, timezone
from typing import Optional, Literal, List

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=DashboardStats)
async def get_stats(current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Get dashboard statistics"""
    
    org = current_user["org"]
    org_id = org["id"]
    
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
    week_start = (now - timedelta(days=7)).isoformat()
    month_start = (now - timedelta(days=30)).isoformat()
    
    # Total scans
    total_today = await db.scan_events.count_documents({
        "org_id": org_id,
        "created_at": {"$gte": today_start}
    })
    
    total_week = await db.scan_events.count_documents({
        "org_id": org_id,
        "created_at": {"$gte": week_start}
    })
    
    total_month = await db.scan_events.count_documents({
        "org_id": org_id,
        "created_at": {"$gte": month_start}
    })
    
    # Blocked today
    blocked_today = await db.scan_events.count_documents({
        "org_id": org_id,
        "decision": "block",
        "created_at": {"$gte": today_start}
    })
    
    # Warned today
    warned_today = await db.scan_events.count_documents({
        "org_id": org_id,
        "decision": "warn",
        "created_at": {"$gte": today_start}
    })
    
    # Open alerts
    open_alerts = await db.alerts.count_documents({
        "org_id": org_id,
        "status": "open"
    })
    
    # Critical alerts
    critical_alerts = await db.alerts.count_documents({
        "org_id": org_id,
        "status": "open",
        "severity": "critical"
    })
    
    # Active agents (unique agent_ids in last 7 days)
    active_agents_pipeline = [
        {"$match": {"org_id": org_id, "created_at": {"$gte": week_start}}},
        {"$group": {"_id": "$agent_id"}},
        {"$count": "total"}
    ]
    active_agents_result = await db.scan_events.aggregate(active_agents_pipeline).to_list(1)
    active_agents = active_agents_result[0]["total"] if active_agents_result else 0
    
    # Top threat type
    top_threat_pipeline = [
        {"$match": {"org_id": org_id, "threat_type": {"$ne": None}, "created_at": {"$gte": month_start}}},
        {"$group": {"_id": "$threat_type", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    top_threat_result = await db.scan_events.aggregate(top_threat_pipeline).to_list(1)
    top_threat_type = top_threat_result[0]["_id"] if top_threat_result else None
    
    # Daily trend (last 14 days)
    daily_trend = []
    for i in range(13, -1, -1):
        day = now - timedelta(days=i)
        day_start = day.replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        day_end = (day + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0).isoformat()
        
        scans = await db.scan_events.count_documents({
            "org_id": org_id,
            "created_at": {"$gte": day_start, "$lt": day_end}
        })
        
        blocked = await db.scan_events.count_documents({
            "org_id": org_id,
            "decision": "block",
            "created_at": {"$gte": day_start, "$lt": day_end}
        })
        
        warned = await db.scan_events.count_documents({
            "org_id": org_id,
            "decision": "warn",
            "created_at": {"$gte": day_start, "$lt": day_end}
        })
        
        daily_trend.append(DailyTrend(
            date=day.strftime("%Y-%m-%d"),
            scans=scans,
            blocked=blocked,
            warned=warned
        ))
    
    return DashboardStats(
        total_scans_today=total_today,
        total_scans_week=total_week,
        total_scans_month=total_month,
        blocked_today=blocked_today,
        warned_today=warned_today,
        open_alerts=open_alerts,
        critical_alerts=critical_alerts,
        active_agents=active_agents,
        top_threat_type=top_threat_type,
        scan_limit_month=org["scan_limit_month"],
        scan_used_month=org["scan_count_month"],
        daily_trend=daily_trend
    )

@router.get("/recent-events", response_model=List[ScanEventResponse])
async def get_recent_events(
    limit: int = Query(20, le=100),
    decision: Optional[Literal["allow", "warn", "block"]] = None,
    severity: Optional[Literal["critical", "high", "medium", "low", "info"]] = None,
    agent_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """Get recent scan events with filters"""
    
    org_id = current_user["org"]["id"]
    
    # Build query
    query = {"org_id": org_id}
    if decision:
        query["decision"] = decision
    if severity:
        query["severity"] = severity
    if agent_id:
        query["agent_id"] = agent_id
    
    # Fetch events
    events = await db.scan_events.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Convert ISO strings back to datetime
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
    
    return [ScanEventResponse(**event) for event in events]

@router.get("/threat-breakdown", response_model=ThreatBreakdown)
async def get_threat_breakdown(current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Get threat breakdown statistics"""
    
    org_id = current_user["org"]["id"]
    
    # By type
    by_type_pipeline = [
        {"$match": {"org_id": org_id, "threat_type": {"$ne": None}}},
        {"$group": {"_id": "$threat_type", "count": {"$sum": 1}}}
    ]
    by_type_result = await db.scan_events.aggregate(by_type_pipeline).to_list(100)
    by_type = {item["_id"]: item["count"] for item in by_type_result}
    
    # By severity
    by_severity_pipeline = [
        {"$match": {"org_id": org_id}},
        {"$group": {"_id": "$severity", "count": {"$sum": 1}}}
    ]
    by_severity_result = await db.scan_events.aggregate(by_severity_pipeline).to_list(100)
    by_severity = {item["_id"]: item["count"] for item in by_severity_result}
    
    # By decision
    by_decision_pipeline = [
        {"$match": {"org_id": org_id}},
        {"$group": {"_id": "$decision", "count": {"$sum": 1}}}
    ]
    by_decision_result = await db.scan_events.aggregate(by_decision_pipeline).to_list(100)
    by_decision = {item["_id"]: item["count"] for item in by_decision_result}
    
    # By agent (top 10)
    by_agent_pipeline = [
        {"$match": {"org_id": org_id}},
        {"$group": {
            "_id": "$agent_id",
            "scan_count": {"$sum": 1},
            "block_count": {
                "$sum": {"$cond": [{"$eq": ["$decision", "block"]}, 1, 0]}
            }
        }},
        {"$sort": {"scan_count": -1}},
        {"$limit": 10}
    ]
    by_agent_result = await db.scan_events.aggregate(by_agent_pipeline).to_list(10)
    by_agent = [
        AgentBreakdown(
            agent_id=item["_id"],
            scan_count=item["scan_count"],
            block_count=item["block_count"]
        )
        for item in by_agent_result
    ]
    
    return ThreatBreakdown(
        by_type=by_type,
        by_severity=by_severity,
        by_decision=by_decision,
        by_agent=by_agent
    )
