from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.dependencies import get_db
from ..models.models import AuditEvent

router = APIRouter()

@router.get("/")
def get_activity_log(db: Session = Depends(get_db)):
    events = db.query(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(50).all()
    out = []
    for e in events:
        out.append({
            "id": e.id,
            "event_type": e.event_type,
            "entity_type": e.entity_type,
            "entity_id": e.entity_id,
            "actor": e.actor,
            "timestamp": e.timestamp.isoformat(),
            "metadata_json": e.metadata_json
        })
    return out
