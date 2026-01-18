import os
from pydantic import BaseModel
from fastapi import HTTPException
from .config import settings
from twelvelabs import TwelveLabs
import videodb


class TwelveLabsModel(BaseModel):

    @classmethod
    def get_twelve_labs_client(cls):
        api_key = settings.TWELVE_LABS_API_KEY
        index_id = settings.TWELVE_LABS_INDEX_ID

        if api_key and index_id:
            client = TwelveLabs(api_key=api_key, timeout=180)
            return client

        raise ValueError("Twelve Labs client configuration is incomplete.")


class VideoDBModel(BaseModel):
    @classmethod
    def get_video_db_client(cls):
        api_key = settings.VIDEO_DB_API_KEY

        if api_key:
            client = videodb.connect(api_key=api_key)
            return client

        raise ValueError("Video DB client configuration is incomplete.")


def get_videodb_connection():
    """Initialize and return VideoDB connection"""
    api_key = settings.VIDEO_DB_API_KEY
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="VIDEO_DB_API_KEY not found in environment variables"
        )
    return videodb.connect(api_key=api_key)