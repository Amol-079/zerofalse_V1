from ..database import get_database
from ..models.alert import Alert
from ..services.detection_engine import ScanResult
from datetime import datetime, timezone, timedelta

async def create_alert_if_needed(org_id: str, scan_event_id: str, scan_result: ScanResult, 
                                 agent_id: str, db) -> Optional[str]:
    """Create alert if conditions are met"""
    
    # Only create alerts for blocks or high/critical severity
    if scan_result.decision != "block" and scan_result.severity not in ["critical", "high"]:
        return None
    
    # Deduplicate: check if similar alert exists in last 5 minutes
    five_min_ago = datetime.now(timezone.utc) - timedelta(minutes=5)
    five_min_ago_iso = five_min_ago.isoformat()
    
    existing = await db.alerts.find_one({
        "org_id": org_id,
        "status": "open",
        "created_at": {"$gte": five_min_ago_iso}
    })
    
    # Get the threat type from scan event to check for duplicates
    if existing and scan_result.threat_type:
        # Check if same threat type and agent
        scan_event = await db.scan_events.find_one({"id": scan_event_id}, {"_id": 0})
        if scan_event:
            existing_scan = await db.scan_events.find_one({"id": existing["scan_event_id"]}, {"_id": 0})
            if existing_scan and existing_scan.get("threat_type") == scan_result.threat_type and existing_scan.get("agent_id") == agent_id:
                return None
    
    # Create new alert
    alert = Alert(
        org_id=org_id,
        scan_event_id=scan_event_id,
        title=scan_result.title,
        description=scan_result.description,
        severity=scan_result.severity if scan_result.severity in ["critical", "high", "medium", "low"] else "medium"
    )
    
    alert_dict = alert.model_dump()
    alert_dict['created_at'] = alert_dict['created_at'].isoformat()
    alert_dict['updated_at'] = alert_dict['updated_at'].isoformat()
    
    await db.alerts.insert_one(alert_dict)
    
    return alert.id
