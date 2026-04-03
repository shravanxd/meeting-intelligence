from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.dependencies import get_db
from ..schemas import schemas
from ..services.meeting_ingestion_service import MeetingIngestionService

router = APIRouter()

@router.get("/")
def get_meetings(db: Session = Depends(get_db)):
    return [{"message": "List of meetings"}]

@router.post("/join", response_model=schemas.MeetingResponse)
def join_meeting(meeting: schemas.MeetingCreate, db: Session = Depends(get_db)):
    service = MeetingIngestionService(db)
    return service.ingest_joined_meeting(meeting)

@router.post("/upload")
def upload_meeting():
    return {"message": "Meeting file uploaded"}

@router.post("/{meeting_id}/start-recording-session")
def start_recording(meeting_id: str):
    return {"message": f"Started recording for meeting {meeting_id}"}
