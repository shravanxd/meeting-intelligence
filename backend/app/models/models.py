from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from ..core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Matter(Base):
    __tablename__ = "matters"

    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, index=True)
    client_name = Column(String, index=True)
    description = Column(Text, nullable=True)
    practice_area = Column(String)
    jurisdiction = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    meetings = relationship("Meeting", back_populates="matter")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True, default=generate_uuid)
    matter_id = Column(String, ForeignKey("matters.id"))
    title = Column(String)
    ingestion_mode = Column(String) # joined | uploaded | recorded
    status = Column(String, default="pending")
    consent_confirmed = Column(Boolean, default=False)
    participants = Column(JSON) # List of participant names/emails
    meeting_link = Column(String, nullable=True)
    
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    matter = relationship("Matter", back_populates="meetings")

class AuditEvent(Base):
    __tablename__ = "audit_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    event_type = Column(String, index=True)
    entity_type = Column(String)
    entity_id = Column(String)
    actor = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(JSON)
