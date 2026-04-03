from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Legal Buddy by Novus AI"
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite:///./legal_buddy.db" # Default to local SQLite for easy dev
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    # Providers
    TRANSCRIPTION_PROVIDER: str = "deepgram"
    LLM_PROVIDER: str = "anthropic"
    STORAGE_PROVIDER: str = "local"
    
    # Keys
    DEEPGRAM_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
