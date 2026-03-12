from fastapi import APIRouter, Depends, HTTPException, status
from schemas.auth import (
    RegisterRequest, LoginRequest, TokenResponse, RefreshRequest,
    ForgotPasswordRequest, ResetPasswordRequest, PasswordChangeRequest
)
from models.user import User, UserResponse
from models.organization import Organization
from services.auth_service import (
    hash_password, verify_password, validate_password_strength,
    create_access_token, create_refresh_token, get_current_user
)
from database import get_database
from middleware.rate_limit import rate_limit_auth
from datetime import datetime, timedelta, timezone
import secrets
import hashlib

router = APIRouter(prefix="/auth", tags=["auth"], dependencies=[Depends(rate_limit_auth)])

@router.post("/register", response_model=dict)
async def register(data: RegisterRequest, db = Depends(get_database)):
    """Register new user and organization"""
    
    # Validate password strength
    if not validate_password_strength(data.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters with 1 uppercase letter and 1 number"
        )
    
    # Check if email already exists
    existing_user = await db.users.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create organization
    org_slug = Organization.generate_slug(data.org_name)
    
    # Check slug uniqueness
    existing_org = await db.organizations.find_one({"slug": org_slug})
    if existing_org:
        org_slug = f"{org_slug}-{secrets.token_hex(3)}"
    
    org = Organization(name=data.org_name, slug=org_slug)
    org_dict = org.model_dump()
    org_dict['created_at'] = org_dict['created_at'].isoformat()
    org_dict['updated_at'] = org_dict['updated_at'].isoformat()
    await db.organizations.insert_one(org_dict)
    
    # Create user
    user = User(
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
        org_id=org.id
    )
    
    user_dict = user.model_dump()
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    user_dict['updated_at'] = user_dict['updated_at'].isoformat()
    await db.users.insert_one(user_dict)
    
    # Generate tokens
    access_token = create_access_token(user.id, org.id)
    refresh_token, refresh_hash = create_refresh_token()
    
    # Store refresh token
    refresh_doc = {
        "id": str(secrets.token_hex(16)),
        "user_id": user.id,
        "token_hash": refresh_hash,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "revoked": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.refresh_tokens.insert_one(refresh_doc)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse(**user.model_dump()),
        "org": org
    }

@router.post("/login", response_model=dict)
async def login(data: LoginRequest, db = Depends(get_database)):
    """Login user"""
    
    # Find user
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if active
    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )
    
    # Invalidate all existing refresh tokens
    await db.refresh_tokens.update_many(
        {"user_id": user["id"]},
        {"$set": {"revoked": True}}
    )
    
    # Generate new tokens
    access_token = create_access_token(user["id"], user["org_id"])
    refresh_token, refresh_hash = create_refresh_token()
    
    # Store new refresh token
    refresh_doc = {
        "id": str(secrets.token_hex(16)),
        "user_id": user["id"],
        "token_hash": refresh_hash,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "revoked": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.refresh_tokens.insert_one(refresh_doc)
    
    # Get org
    org = await db.organizations.find_one({"id": user["org_id"]}, {"_id": 0})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": UserResponse(**user),
        "org": org
    }

@router.post("/refresh", response_model=dict)
async def refresh(data: RefreshRequest, db = Depends(get_database)):
    """Refresh access token"""
    
    # Hash provided token
    token_hash = hashlib.sha256(data.refresh_token.encode()).hexdigest()
    
    # Find refresh token
    token_doc = await db.refresh_tokens.find_one({"token_hash": token_hash}, {"_id": 0})
    
    if not token_doc or token_doc.get("revoked"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Check expiry
    expires_at = datetime.fromisoformat(token_doc["expires_at"])
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token expired"
        )
    
    # Get user
    user = await db.users.find_one({"id": token_doc["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    # Generate new access token
    access_token = create_access_token(user["id"], user["org_id"])
    
    # Optionally rotate refresh token
    new_refresh_token, new_refresh_hash = create_refresh_token()
    
    # Revoke old token
    await db.refresh_tokens.update_one(
        {"token_hash": token_hash},
        {"$set": {"revoked": True}}
    )
    
    # Store new refresh token
    refresh_doc = {
        "id": str(secrets.token_hex(16)),
        "user_id": user["id"],
        "token_hash": new_refresh_hash,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "revoked": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.refresh_tokens.insert_one(refresh_doc)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Logout user by revoking refresh tokens"""
    
    user = current_user["user"]
    
    # Revoke all refresh tokens for user
    await db.refresh_tokens.update_many(
        {"user_id": user["id"]},
        {"$set": {"revoked": True}}
    )
    
    return {"message": "Logged out successfully"}

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db = Depends(get_database)):
    """Request password reset"""
    
    # Check if user exists (but always return success to prevent enumeration)
    user = await db.users.find_one({"email": data.email}, {"_id": 0})
    
    if user:
        # Generate reset token
        token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(token.encode()).hexdigest()
        
        # Store token
        reset_doc = {
            "id": str(secrets.token_hex(16)),
            "user_id": user["id"],
            "token_hash": token_hash,
            "expires_at": (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat(),
            "used": False,
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.password_reset_tokens.insert_one(reset_doc)
        
        # In development, log the token
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"Password reset token for {data.email}: {token}")
    
    # Always return success
    return {"message": "If that email exists, a reset link has been sent"}

@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db = Depends(get_database)):
    """Reset password with token"""
    
    # Validate new password
    if not validate_password_strength(data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters with 1 uppercase letter and 1 number"
        )
    
    # Hash token
    token_hash = hashlib.sha256(data.token.encode()).hexdigest()
    
    # Find token
    token_doc = await db.password_reset_tokens.find_one({"token_hash": token_hash}, {"_id": 0})
    
    if not token_doc or token_doc.get("used"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Check expiry
    expires_at = datetime.fromisoformat(token_doc["expires_at"])
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token expired"
        )
    
    # Update user password
    new_hash = hash_password(data.new_password)
    await db.users.update_one(
        {"id": token_doc["user_id"]},
        {"$set": {"hashed_password": new_hash, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Mark token as used
    await db.password_reset_tokens.update_one(
        {"token_hash": token_hash},
        {"$set": {"used": True}}
    )
    
    # Revoke all refresh tokens
    await db.refresh_tokens.update_many(
        {"user_id": token_doc["user_id"]},
        {"$set": {"revoked": True}}
    )
    
    return {"message": "Password reset successful"}

@router.get("/me", response_model=dict)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    return {
        "user": UserResponse(**current_user["user"]),
        "org": current_user["org"]
    }

@router.post("/change-password")
async def change_password(data: PasswordChangeRequest, current_user: dict = Depends(get_current_user), db = Depends(get_database)):
    """Change password for authenticated user"""
    
    user = current_user["user"]
    
    # Verify current password
    if not verify_password(data.current_password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Validate new password
    if not validate_password_strength(data.new_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters with 1 uppercase letter and 1 number"
        )
    
    # Update password
    new_hash = hash_password(data.new_password)
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"hashed_password": new_hash, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Revoke all refresh tokens
    await db.refresh_tokens.update_many(
        {"user_id": user["id"]},
        {"$set": {"revoked": True}}
    )
    
    return {"message": "Password changed successfully"}
