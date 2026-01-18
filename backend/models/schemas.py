from pydantic import BaseModel
from typing import Optional, List, Literal


class AnalyzeVideoRequest(BaseModel):
    video_source: str
    existing_video_id: str | None
    interval_seconds: Optional[int] = 5
    frame_count: Optional[int] = 6


class SceneAlert(BaseModel):
    timestamp: float
    description: str
    severity: Literal["HIGH", "MEDIUM", "LOW"]
    scene_data: dict


class AnalysisResponse(BaseModel):
    status: Literal["success", "error"]
    video_id: Optional[str] = None
    index_id: Optional[str] = None
    total_scenes_analyzed: Optional[int] = None
    scenes: Optional[List[dict]] = None
    critical_alerts: Optional[List[SceneAlert]] = None
    alert_count: Optional[int] = None
    analysis_text: Optional[str] = None
    error: Optional[str] = None


class SceneDetailsRequest(BaseModel):
    video_id: str
    index_id: str


class SceneDetailsResponse(BaseModel):
    status: Literal["success", "error"]
    video_id: Optional[str] = None
    index_id: Optional[str] = None
    scenes: Optional[List[dict]] = None
    error: Optional[str] = None
