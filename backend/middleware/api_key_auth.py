from fastapi import Header, HTTPException, status, Depends
from ..database import get_database
import hashlib
from datetime import datetime, timezone

async def get_api_key_org(x_api_key: str = Header(...), db = Depends(get_database)):
    """Authenticate API key and return (api_key, org)"""
    
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key missing"
        )
    
    # Hash the provided key
    key_hash = hashlib.sha256(x_api_key.encode()).hexdigest()
    
    # Find API key
    api_key = await db.api_keys.find_one({"key_hash": key_hash}, {"_id": 0})
    
    if not api_key or not api_key.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or inactive API key"
        )
    
    # Get organization
    org = await db.organizations.find_one({"id": api_key["org_id"]}, {"_id": 0})
    
    if not org:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Organization not found"
        )
    
    # Update last_used_at asynchronously (don't wait)
    await db.api_keys.update_one(
        {"id": api_key["id"]},
        {"$set": {"last_used_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return api_key, org
