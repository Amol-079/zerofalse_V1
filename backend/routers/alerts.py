from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from ..services.auth_service import get_current_user
from ..database import get_database
from ..models.alert import AlertResponse
from datetime import datetime, timezone
from typing import Optional, Literal, List

router = APIRouter(prefix="/alerts", tags=["alerts"])

class UpdateAlertStatusRequest(BaseModel):
    pass

class AlertWithScanEvent(BaseModel):
    alert: AlertResponse
    scan_event: dict

@router.get("/", response_model=List[AlertResponse])
async def list_alerts(
    status_filter: Optional[Literal["open", "acknowledged", "resolved"]] = None,
    severity: Optional[Literal["critical", "high", "medium", "low"]] = None,
    limit: int = Query(50, le=200),
    current_user: dict = Depends(get_current_user),
    db = Depends(get_database)
):
    """List alerts with filters"""
    
    org_id = current_user["org"]["id"]
    
    query = {"org_id": org_id}
    if status_filter:
        query["status"] = status_filter
    if severity:
        query["severity"] = severity
    
    alerts = await db.alerts.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    
    # Convert ISO strings to datetime
    for alert in alerts:
        if isinstance(alert.get('created_at'), str):
            alert['created_at'] = datetime.fromisoformat(alert['created_at'])
        if isinstance(alert.get('updated_at'), str):
            alert['updated_at'] = datetime.fromisoformat(alert['updated_at'])
        if isinstance(alert.get('acknowledged_at'), str):
            alert['acknowledged_at'] = datetime.fromisoformat(alert['acknowledged_at'])
        if isinstance(alert.get('resolved_at'), str):
            alert['resolved_at'] = datetime.fromisoformat(alert['resolved_at'])
    
    return [AlertResponse(**alert) for alert in alerts]

@router.get("/{alert_id}", response_model=AlertWithScanEvent)
async def get_alert(alert_id: str, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Get single alert with linked scan event"""
    
    org_id = current_user["org"]["id"]
    
    alert = await db.alerts.find_one({"id": alert_id, "org_id": org_id}, {"_id": 0})
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    # Get linked scan event
    scan_event = await db.scan_events.find_one({"id": alert["scan_event_id"]}, {"_id": 0})
    
    # Convert datetime fields
    if isinstance(alert.get('created_at'), str):
        alert['created_at'] = datetime.fromisoformat(alert['created_at'])
    if isinstance(alert.get('updated_at'), str):
        alert['updated_at'] = datetime.fromisoformat(alert['updated_at'])
    if isinstance(alert.get('acknowledged_at'), str):
        alert['acknowledged_at'] = datetime.fromisoformat(alert['acknowledged_at'])
    if isinstance(alert.get('resolved_at'), str):
        alert['resolved_at'] = datetime.fromisoformat(alert['resolved_at'])
    
    return AlertWithScanEvent(
        alert=AlertResponse(**alert),
        scan_event=scan_event or {}
    )

@router.patch("/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Acknowledge alert"""
    
    org_id = current_user["org"]["id"]
    user_id = current_user["user"]["id"]
    
    alert = await db.alerts.find_one({"id": alert_id, "org_id": org_id}, {"_id": 0})
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    await db.alerts.update_one(
        {"id": alert_id},
        {
            "$set": {
                "status": "acknowledged",
                "acknowledged_by": user_id,
                "acknowledged_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Alert acknowledged"}

@router.patch("/{alert_id}/resolve")
async def resolve_alert(alert_id: str, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Resolve alert"""
    
    org_id = current_user["org"]["id"]
    
    alert = await db.alerts.find_one({"id": alert_id, "org_id": org_id}, {"_id": 0})
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alert not found"
        )
    
    await db.alerts.update_one(
        {"id": alert_id},
        {
            "$set": {
                "status": "resolved",
                "resolved_at": datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.now(timezone.utc).isoformat()
            }
        }
    )
    
    return {"message": "Alert resolved"}
