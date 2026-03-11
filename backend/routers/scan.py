from fastapi import APIRouter, Depends, HTTPException, status
from ..schemas.scan import ToolCallScanRequest, PromptScanRequest, ScanResponse, BatchScanRequest
from ..middleware.api_key_auth import get_api_key_org
from ..middleware.rate_limit import rate_limit_scan
from ..services.scan_service import process_scan, process_prompt_scan
from ..services.alert_service import create_alert_if_needed
from ..database import get_database
from datetime import datetime, timezone

router = APIRouter(prefix="/scan", tags=["scan"], dependencies=[Depends(rate_limit_scan)])

@router.post("/tool-call", response_model=ScanResponse)
async def scan_tool_call(
    data: ToolCallScanRequest,
    api_key_org: tuple = Depends(get_api_key_org),
    db = Depends(get_database)
):
    """Scan a tool call for threats"""
    
    api_key, org = api_key_org
    
    # Check quota
    if org["scan_count_month"] >= org["scan_limit_month"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Monthly scan limit exceeded"
        )
    
    # Process scan
    scan_result, scan_event = await process_scan(
        org_id=org["id"],
        api_key_id=api_key["id"],
        tool_name=data.tool_name,
        arguments=data.arguments,
        agent_id=data.agent_id,
        session_id=data.session_id,
        caller_agent_id=data.caller_agent_id,
        db=db
    )
    
    # Create alert if needed
    await create_alert_if_needed(org["id"], scan_event.id, scan_result, data.agent_id, db)
    
    # Increment counters
    await db.organizations.update_one(
        {"id": org["id"]},
        {"$inc": {"scan_count_month": 1}}
    )
    await db.api_keys.update_one(
        {"id": api_key["id"]},
        {"$inc": {"total_calls": 1}}
    )
    
    return ScanResponse(
        scan_id=scan_event.id,
        decision=scan_result.decision,
        risk_score=scan_result.risk_score,
        severity=scan_result.severity,
        threat_type=scan_result.threat_type,
        title=scan_result.title,
        description=scan_result.description,
        evidence=scan_result.evidence,
        latency_ms=scan_result.latency_ms,
        timestamp=scan_event.created_at
    )

@router.post("/prompt", response_model=ScanResponse)
async def scan_prompt(
    data: PromptScanRequest,
    api_key_org: tuple = Depends(get_api_key_org),
    db = Depends(get_database)
):
    """Scan a prompt for threats"""
    
    api_key, org = api_key_org
    
    # Check quota
    if org["scan_count_month"] >= org["scan_limit_month"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Monthly scan limit exceeded"
        )
    
    # Process scan
    scan_result, scan_event = await process_prompt_scan(
        org_id=org["id"],
        api_key_id=api_key["id"],
        text=data.text,
        agent_id=data.agent_id,
        session_id=data.session_id,
        db=db
    )
    
    # Create alert if needed
    await create_alert_if_needed(org["id"], scan_event.id, scan_result, data.agent_id, db)
    
    # Increment counters
    await db.organizations.update_one(
        {"id": org["id"]},
        {"$inc": {"scan_count_month": 1}}
    )
    await db.api_keys.update_one(
        {"id": api_key["id"]},
        {"$inc": {"total_calls": 1}}
    )
    
    return ScanResponse(
        scan_id=scan_event.id,
        decision=scan_result.decision,
        risk_score=scan_result.risk_score,
        severity=scan_result.severity,
        threat_type=scan_result.threat_type,
        title=scan_result.title,
        description=scan_result.description,
        evidence=scan_result.evidence,
        latency_ms=scan_result.latency_ms,
        timestamp=scan_event.created_at
    )

@router.post("/batch", response_model=list)
async def batch_scan(
    data: BatchScanRequest,
    api_key_org: tuple = Depends(get_api_key_org),
    db = Depends(get_database)
):
    """Batch scan multiple tool calls"""
    
    api_key, org = api_key_org
    
    # Check quota for batch
    required_scans = len(data.scans)
    if org["scan_count_month"] + required_scans > org["scan_limit_month"]:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Insufficient quota. Need {required_scans} scans, {org['scan_limit_month'] - org['scan_count_month']} remaining"
        )
    
    results = []
    
    for scan_req in data.scans:
        scan_result, scan_event = await process_scan(
            org_id=org["id"],
            api_key_id=api_key["id"],
            tool_name=scan_req.tool_name,
            arguments=scan_req.arguments,
            agent_id=scan_req.agent_id,
            session_id=scan_req.session_id,
            caller_agent_id=scan_req.caller_agent_id,
            db=db
        )
        
        await create_alert_if_needed(org["id"], scan_event.id, scan_result, scan_req.agent_id, db)
        
        results.append(ScanResponse(
            scan_id=scan_event.id,
            decision=scan_result.decision,
            risk_score=scan_result.risk_score,
            severity=scan_result.severity,
            threat_type=scan_result.threat_type,
            title=scan_result.title,
            description=scan_result.description,
            evidence=scan_result.evidence,
            latency_ms=scan_result.latency_ms,
            timestamp=scan_event.created_at
        ))
    
    # Increment counters
    await db.organizations.update_one(
        {"id": org["id"]},
        {"$inc": {"scan_count_month": required_scans}}
    )
    await db.api_keys.update_one(
        {"id": api_key["id"]},
        {"$inc": {"total_calls": required_scans}}
    )
    
    return results
