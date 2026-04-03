from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api import matters, meetings, review, activity, health
from .core.database import engine, Base
from .models import models

# Create all tables (In production, use alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Legal Buddy by Novus AI - API",
    version="1.0.0",
)

# CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(matters.router, prefix="/matters", tags=["matters"])
app.include_router(meetings.router, prefix="/meetings", tags=["meetings"])
app.include_router(review.router, prefix="/review", tags=["review"])
app.include_router(activity.router, prefix="/activity", tags=["activity"])
