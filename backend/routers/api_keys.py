from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from ..services.auth_service import get_current_user
from ..database import get_database
from ..models.api_key import APIKey, APIKeyResponse
import secrets
import hashlib
from datetime import datetime, timezone

router = APIRouter(prefix="/keys", tags=["api_keys"])

class CreateAPIKeyRequest(BaseModel):
    name: str

class CreateAPIKeyResponse(BaseModel):
    id: str
    name: str
    key_prefix: str
    full_key: str
    created_at: datetime

@router.get("/", response_model=list)
async def list_api_keys(current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """List organization's API keys"""
    
    org_id = current_user["org"]["id"]
    
    keys = await db.api_keys.find({"org_id": org_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    # Convert ISO strings to datetime
    for key in keys:
        if isinstance(key.get('created_at'), str):
            key['created_at'] = datetime.fromisoformat(key['created_at'])
        if isinstance(key.get('updated_at'), str):
            key['updated_at'] = datetime.fromisoformat(key['updated_at'])
        if isinstance(key.get('last_used_at'), str):
            key['last_used_at'] = datetime.fromisoformat(key['last_used_at'])
    
    return [APIKeyResponse(**key) for key in keys]

@router.post("/", response_model=CreateAPIKeyResponse)
async def create_api_key(data: CreateAPIKeyRequest, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Create new API key (returns full key once)"""
    
    user = current_user["user"]
    org = current_user["org"]
    
    # Generate cryptographically secure key
    random_part = secrets.token_urlsafe(32)
    full_key = f"zf_live_{random_part}"
    
    # Hash for storage
    key_hash = hashlib.sha256(full_key.encode()).hexdigest()
    key_prefix = full_key[:16]
    
    # Create API key
    api_key = APIKey(
        org_id=org["id"],
        user_id=user["id"],
        name=data.name,
        key_hash=key_hash,
        key_prefix=key_prefix
    )
    
    api_key_dict = api_key.model_dump()
    api_key_dict['created_at'] = api_key_dict['created_at'].isoformat()
    api_key_dict['updated_at'] = api_key_dict['updated_at'].isoformat()
    
    await db.api_keys.insert_one(api_key_dict)
    
    return CreateAPIKeyResponse(
        id=api_key.id,
        name=api_key.name,
        key_prefix=key_prefix,
        full_key=full_key,
        created_at=api_key.created_at
    )

@router.delete("/{key_id}")
async def delete_api_key(key_id: str, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Deactivate API key (soft delete)"""
    
    org_id = current_user["org"]["id"]
    
    # Check key exists and belongs to org
    api_key = await db.api_keys.find_one({"id": key_id, "org_id": org_id}, {"_id": 0})
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found"
        )
    
    # Soft delete
    await db.api_keys.update_one(
        {"id": key_id},
        {"$set": {"is_active": False, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "API key deleted successfully"}
