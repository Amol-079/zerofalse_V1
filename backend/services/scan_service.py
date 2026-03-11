from ..database import get_database
from ..models.scan_event import ScanEvent
from ..services.detection_engine import detection_engine, ScanResult
import hashlib
import json
from datetime import datetime, timezone

async def process_scan(org_id: str, api_key_id: str, tool_name: str, arguments: dict, 
                       agent_id: str, session_id: str = None, caller_agent_id: str = None, db = None) -> tuple[ScanResult, ScanEvent]:
    """Process a tool call scan and create scan event"""
    
    # Run detection engine
    scan_result = detection_engine.scan(tool_name, arguments, agent_id, caller_agent_id)
    
    # Hash arguments for storage
    args_str = json.dumps(arguments, sort_keys=True)
    arguments_hash = hashlib.sha256(args_str.encode()).hexdigest()
    
    # Create evidence summary (first evidence item, truncated)
    evidence_summary = None
    if scan_result.evidence:
        evidence_summary = scan_result.evidence[0][:200]
    
    # Create scan event
    scan_event = ScanEvent(
        org_id=org_id,
        api_key_id=api_key_id,
        agent_id=agent_id,
        session_id=session_id,
        tool_name=tool_name,
        arguments_hash=arguments_hash,
        decision=scan_result.decision,
        risk_score=scan_result.risk_score,
        threat_type=scan_result.threat_type,
        severity=scan_result.severity,
        evidence_count=len(scan_result.evidence),
        evidence_summary=evidence_summary,
        latency_ms=scan_result.latency_ms
    )
    
    # Store in database
    event_dict = scan_event.model_dump()
    event_dict['created_at'] = event_dict['created_at'].isoformat()
    await db.scan_events.insert_one(event_dict)
    
    return scan_result, scan_event

async def process_prompt_scan(org_id: str, api_key_id: str, text: str, agent_id: str, 
                              session_id: str = None, db = None) -> tuple[ScanResult, ScanEvent]:
    """Process a prompt scan"""
    
    scan_result = detection_engine.scan_prompt(text)
    
    # Hash the text
    text_hash = hashlib.sha256(text.encode()).hexdigest()
    
    evidence_summary = None
    if scan_result.evidence:
        evidence_summary = scan_result.evidence[0][:200]
    
    scan_event = ScanEvent(
        org_id=org_id,
        api_key_id=api_key_id,
        agent_id=agent_id,
        session_id=session_id,
        tool_name="prompt_scan",
        arguments_hash=text_hash,
        decision=scan_result.decision,
        risk_score=scan_result.risk_score,
        threat_type=scan_result.threat_type,
        severity=scan_result.severity,
        evidence_count=len(scan_result.evidence),
        evidence_summary=evidence_summary,
        latency_ms=scan_result.latency_ms
    )
    
    event_dict = scan_event.model_dump()
    event_dict['created_at'] = event_dict['created_at'].isoformat()
    await db.scan_events.insert_one(event_dict)
    
    return scan_result, scan_event
