from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.models import Meeting, AuditEvent
from ..schemas.schemas import MeetingCreate

class MeetingIngestionService:
    def __init__(self, db: Session):
        self.db = db

    def _log_audit(self, event_type: str, entity_id: str, actor: str = "system", metadata: dict = None):
        audit = AuditEvent(
            event_type=event_type,
            entity_type="meeting",
            entity_id=entity_id,
            actor=actor,
            metadata_json=metadata or {}
        )
        self.db.add(audit)
        self.db.flush()

    def ingest_joined_meeting(self, data: MeetingCreate, actor: str = "user") -> Meeting:
        meeting = Meeting(
            matter_id=data.matter_id,
            title=data.title,
            ingestion_mode="joined",
            status="listening",
            consent_confirmed=data.consent_confirmed,
            participants=data.participants,
            meeting_link=data.meeting_link
        )
        self.db.add(meeting)
        self.db.commit()
        self.db.refresh(meeting)
        
        self._log_audit("meeting_joined", meeting.id, actor, {"link": meeting.meeting_link})
        return meeting

    def ingest_uploaded_meeting(self, matter_id: str, title: str, 
                                consent_confirmed: bool, actor: str = "user") -> Meeting:
        """
        Creates a meeting placeholder that moves straight into processing mode
        following an upload. Real implementation would take file blobs via S3/storage provider.
        """
        meeting = Meeting(
            matter_id=matter_id,
            title=title,
            ingestion_mode="uploaded",
            status="uploaded_pending_processing",
            consent_confirmed=consent_confirmed,
            participants=[]
        )
        self.db.add(meeting)
        self.db.commit()
        self.db.refresh(meeting)
        
        self._log_audit("file_uploaded", meeting.id, actor, {"status": "pending_processing"})
        return meeting

    def start_recording_session(self, data: MeetingCreate, actor: str = "user") -> Meeting:
        meeting = Meeting(
            matter_id=data.matter_id,
            title=data.title,
            ingestion_mode="recorded",
            status="recording_in_progress",
            consent_confirmed=data.consent_confirmed,
            participants=data.participants
        )
        self.db.add(meeting)
        self.db.commit()
        self.db.refresh(meeting)
        
        self._log_audit("recording_started", meeting.id, actor, {"device": "browser"})
        return meeting

    def end_recording_session(self, meeting_id: str, duration_minutes: int, actor: str = "user") -> Optional[Meeting]:
        meeting = self.db.query(Meeting).filter(Meeting.id == meeting_id).first()
        if not meeting:
            return None
            
        meeting.status = "recording_completed_pending_processing"
        meeting.duration_minutes = duration_minutes
        self.db.commit()
        self.db.refresh(meeting)
        
        self._log_audit("recording_stopped", meeting.id, actor, {"duration": duration_minutes})
        return meeting
