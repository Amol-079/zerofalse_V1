from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, HttpUrl
from typing import List
from ..services.auth_service import get_current_user
from ..database import get_database
from datetime import datetime, timezone
import secrets

router = APIRouter(prefix="/webhooks", tags=["webhooks"])

class Webhook(BaseModel):
    id: str
    org_id: str
    url: str
    events: List[str]
    secret: str
    is_active: bool
    created_at: datetime

class CreateWebhookRequest(BaseModel):
    url: HttpUrl
    events: List[str]
    secret: str = ""

class WebhookResponse(BaseModel):
    id: str
    url: str
    events: List[str]
    is_active: bool
    created_at: datetime

@router.get("/", response_model=List[WebhookResponse])
async def list_webhooks(current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """List organization's webhooks"""
    
    org_id = current_user["org"]["id"]
    
    webhooks = await db.webhooks.find({"org_id": org_id}, {"_id": 0, "secret": 0}).sort("created_at", -1).to_list(100)
    
    for webhook in webhooks:
        if isinstance(webhook.get('created_at'), str):
            webhook['created_at'] = datetime.fromisoformat(webhook['created_at'])
    
    return [WebhookResponse(**webhook) for webhook in webhooks]

@router.post("/", response_model=WebhookResponse)
async def create_webhook(data: CreateWebhookRequest, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Create new webhook"""
    
    org_id = current_user["org"]["id"]
    
    # Generate secret if not provided
    webhook_secret = data.secret or secrets.token_urlsafe(32)
    
    webhook = {
        "id": str(secrets.token_hex(16)),
        "org_id": org_id,
        "url": str(data.url),
        "events": data.events,
        "secret": webhook_secret,
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.webhooks.insert_one(webhook)
    
    # Remove secret from response
    webhook_response = {k: v for k, v in webhook.items() if k != "secret"}
    webhook_response['created_at'] = datetime.fromisoformat(webhook_response['created_at'])
    
    return WebhookResponse(**webhook_response)

@router.delete("/{webhook_id}")
async def delete_webhook(webhook_id: str, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Delete webhook"""
    
    org_id = current_user["org"]["id"]
    
    result = await db.webhooks.delete_one({"id": webhook_id, "org_id": org_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Webhook not found"
        )
    
    return {"message": "Webhook deleted successfully"}
