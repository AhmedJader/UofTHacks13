from fastapi import APIRouter, HTTPException
import time
from datetime import datetime

from ..models.schemas import (
    AnalyzeVideoRequest,
    AnalysisResponse,
    SceneDetailsRequest,
    SceneDetailsResponse,
    SceneAlert
)

from ..core.models import TwelveLabsModel, get_videodb_connection

router = APIRouter(
    prefix="/analyze",
    tags=["video-analysis"]
)

@router.get("/health")
async def health_check():
    """Simple health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}


@router.post("/video", response_model=AnalysisResponse)
async def analyze_video(request: AnalyzeVideoRequest):
    """
    Analyze a video for dangerous situations using VideoDB + Twelve Labs
    
    HOW IT WORKS:
    1. Connects to VideoDB using your API key
    2. Uploads your video (can be local file, YouTube URL, or any URL)
    3. Uses Twelve Labs AI to analyze the video for violence/danger
    4. Returns detected dangerous situations as "alerts"
    
    Example Request:
    POST /analyze/video
    {
        "video_source": "https://youtube.com/watch?v=...",
        "interval_seconds": 10,
        "frame_count": 6
    }
    """
    try:
        client = TwelveLabsModel.get_twelve_labs_client()

        prompt = """Monitor for violent or dangerous behavior. 
            Detect: physical altercations, fighting, weapons being displayed or used, 
            aggressive confrontations, people running in panic, injured persons on ground, 
            threatening gestures, or any signs of assault."""
        
        print(f"📹 Uploading video from: {request.video_source}")

        index = client.indexes.retrieve(
            index_id="696c4422cafce60cf069f045"
        )

        print(request.existing_video_id)
        path = request.video_source
        path = path.lstrip("/")
        if not request.existing_video_id:
            print("No existing video ID provided, creating new asset.")
            asset = client.assets.create(
                method="direct",
                file=open(path, "rb")
            )
            print(f"Created asset: id={asset.id}")  
            indexed_asset = client.indexes.indexed_assets.create(
                index_id=index.id,
                asset_id=asset.id
            )
            print(f"Created indexed asset: id={indexed_asset.id}")

            print("Waiting for indexing to complete.")

            while True:
                indexed_asset = client.indexes.indexed_assets.retrieve(
                    index.id,
                    indexed_asset.id
                )
                print(f"  Status={indexed_asset.status}")
                if indexed_asset.status == "ready":
                    print("Indexing complete!")
                    break
                elif indexed_asset.status == "failed":
                    raise RuntimeError("Indexing failed")
                time.sleep(5)
        else:
            print(f"Using existing video ID: {request.existing_video_id}")
            asset = client.indexes.indexed_assets.retrieve(index_id=index.id, indexed_asset_id=request.existing_video_id)

            indexed_asset = client.indexes.indexed_assets.retrieve(
                index.id,
                request.existing_video_id  # or whatever the indexed_asset_id is
            )

        text_stream = client.analyze_stream(video_id=indexed_asset.id, prompt=prompt)

        analysis_text = ""
        for text in text_stream:
           if text.event_type == "text_generation":
                analysis_text += text.text

        return AnalysisResponse(
            status="success",
            video_id=indexed_asset.id,
            index_id=index.id,
            analysis_text=analysis_text,
        )
        
    except Exception as e:
        print(f"❌ Error analyzing video: {str(e)}")
        return AnalysisResponse(
            status="error",
            error=str(e)
        )


@router.post("/scene-details", response_model=SceneDetailsResponse)
async def get_scene_details(request: SceneDetailsRequest):
    """
    Get details about previously analyzed video scenes
    
    Example Request:
    POST /analyze/scene-details
    {
        "video_id": "vid_123",
        "index_id": "idx_456"
    }
    """
    try:
        # Get VideoDB connection
        conn = get_videodb_connection()
        
        # Retrieve video and scene index
        video = conn.get_video(request.video_id)
        scene_index = video.get_scene_index(request.index_id)
        scenes = scene_index.scenes if hasattr(scene_index, 'scenes') else []
        
        return SceneDetailsResponse(
            status="success",
            video_id=request.video_id,
            index_id=request.index_id,
            scenes=scenes
        )
        
    except Exception as e:
        print(f"❌ Error getting scene details: {str(e)}")
        return SceneDetailsResponse(
            status="error",
            error=str(e)
        )
