from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import get_settings
from .database import connect_to_mongo, close_mongo_connection
from .routers import auth, scan, dashboard, api_keys, alerts, webhooks
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title="Zerofalse API",
    description="Stop AI Agent Attacks Before They Execute",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=settings.CORS_ORIGINS.split(',') if settings.CORS_ORIGINS != "*" else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Event handlers
@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    logger.info("Zerofalse API started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    logger.info("Zerofalse API shutdown complete")

# Health check
@app.get("/")
async def root():
    return {"message": "Zerofalse API", "status": "healthy"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

# Include routers with /api/v1 prefix
app.include_router(auth.router, prefix="/api/v1")
app.include_router(scan.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(api_keys.router, prefix="/api/v1")
app.include_router(alerts.router, prefix="/api/v1")
app.include_router(webhooks.router, prefix="/api/v1")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
