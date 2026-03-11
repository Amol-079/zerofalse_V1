from collections import defaultdict
from datetime import datetime, timedelta
from fastapi import HTTPException, Request, status
import time

class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
        self.auth_limit = 100
        self.scan_limit = 1000
        self.window = 60
    
    def _clean_old_requests(self, key: str, now: float):
        """Remove requests outside the time window"""
        cutoff = now - self.window
        self.requests[key] = [req_time for req_time in self.requests[key] if req_time > cutoff]
    
    def check_rate_limit(self, request: Request, limit: int) -> bool:
        """Check if request is within rate limit"""
        client_ip = request.client.host
        now = time.time()
        
        key = f"{client_ip}:{request.url.path}"
        self._clean_old_requests(key, now)
        
        if len(self.requests[key]) >= limit:
            retry_after = int(self.window - (now - self.requests[key][0]))
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded",
                headers={"Retry-After": str(retry_after)}
            )
        
        self.requests[key].append(now)
        return True

rate_limiter = RateLimiter()

async def rate_limit_auth(request: Request):
    """Rate limiter for auth routes (100 req/min)"""
    rate_limiter.check_rate_limit(request, rate_limiter.auth_limit)

async def rate_limit_scan(request: Request):
    """Rate limiter for scan routes (1000 req/min)"""
    rate_limiter.check_rate_limit(request, rate_limiter.scan_limit)
