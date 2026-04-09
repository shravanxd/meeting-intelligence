from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.dependencies import get_db
from ..schemas import schemas
from ..services.meeting_ingestion_service import MeetingIngestionService

from ..models.models import Meeting
from ..services.recall_service import RecallService

router = APIRouter()

@router.get("/{meeting_id}/status")
def get_meeting_status(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    response = {
        "id": meeting.id,
        "status": meeting.status,
        "bot_status": None,
        "participants": meeting.participants or []
    }
    
    if meeting.recall_bot_id:
        recall = RecallService()
        bot_data = recall.get_bot_status(meeting.recall_bot_id)
        if bot_data:
            status_changes = bot_data.get("status_changes")
            if status_changes and len(status_changes) > 0:
                response["bot_status"] = status_changes[-1].get("code")
            else:
                response["bot_status"] = "scheduled"
                
            response["participants"] = bot_data.get("meeting_participants", meeting.participants)                                                                           
            if response["bot_status"]:
                meeting.status = response["bot_status"]
                db.commit()

    return response

@router.get("/")
def get_meetings(db: Session = Depends(get_db)):
    meetings = db.query(Meeting).order_by(Meeting.created_at.desc()).all()
    result = []
    for m in meetings:
        status_label = "Approved" if m.status == "Approved" else "Pending Review"
        result.append({
            "id": m.id,
            "title": m.title or m.created_at.strftime("%Y-%m-%d %I:%M %p ET"),
            "date": m.created_at.strftime("%Y-%m-%d %I:%M %p ET"),
            "duration": f"{m.duration_minutes}m" if m.duration_minutes else "N/A",
            "matter": m.matter_id or "General",
            "status": status_label
        })
    return result

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

@router.post("/{meeting_id}/end")
def end_bot_session(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
        
    if meeting.recall_bot_id:
        recall = RecallService()
        result = recall.leave_bot(meeting.recall_bot_id)
        if result:
            meeting.status = "call_ended"
            db.commit()
            return {"message": "Bot successfully commanded to leave"}
        else:
            raise HTTPException(status_code=500, detail="Failed to end bot session")
    raise HTTPException(status_code=400, detail="No active bot to end")

@router.delete("/{meeting_id}")
def delete_meeting(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    if meeting.recall_bot_id:
        recall = RecallService()
        try:
            recall.leave_bot(meeting.recall_bot_id)
        except Exception:
            pass

    db.delete(meeting)
    db.commit()
    return {"message": "Meeting deleted"}
