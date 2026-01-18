from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator

from typing import Any

class Settings(BaseSettings):
    API_PREFIX: str = "/api"
    DEBUG: bool = True
    ALLOWED_ORIGINS: str | List[str] = ""
    
    # twelve labs credentials
    TWELVE_LABS_API_KEY: str = ""
    TWELVE_LABS_INDEX_ID: str = ""

    # video db api  credentials
    VIDEO_DB_API_KEY: str = ""


    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            return [str(x) for x in v]

        if isinstance(v, str):
            return v.split(",") if v else []

        return []
        
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = 'ignore'

settings = Settings()