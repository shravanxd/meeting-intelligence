from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class TaskItem(BaseModel):
    task: str
    owner: Optional[str] = None
    deadline: Optional[str] = None
    priority: Optional[str] = None # low | medium | high | null

class BillableSignal(BaseModel):
    description: str
    confidence: str # low | medium | high

class ExtractionSchema(BaseModel):
    summary: str
    instructions: List[str]
    commitments: List[str]
    decisions: List[str]
    action_items: List[TaskItem]
    follow_ups: List[str]
    next_steps: List[str]
    billable_signals: List[BillableSignal]
    issues_or_risks: List[str]
    open_questions: List[str]

class MatterBase(BaseModel):
    title: str
    client_name: str
    description: Optional[str] = None
    practice_area: str
    jurisdiction: str

class MatterCreate(MatterBase):
    pass

class MatterResponse(MatterBase):
    id: str
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class MeetingBase(BaseModel):
    title: str
    matter_id: str
    ingestion_mode: str # joined | uploaded | recorded
    status: str
    consent_confirmed: bool = False
    participants: List[str]
    meeting_link: Optional[str] = None

class MeetingCreate(MeetingBase):
    pass

class MeetingResponse(MeetingBase):
    id: str
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)