from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.dependencies import get_db
from ..models.models import Matter, Meeting
import os
import json

router = APIRouter()

@router.get("")
def get_dashboard_stats(db: Session = Depends(get_db)):
    active_matters = db.query(Matter).count()
    meetings_processed = db.query(Meeting).count()
    pending_review = db.query(Meeting).filter(Meeting.status != "Approved").count()
    
    # Actually let's fetch specific pending meetings for the table
    pending_meetings = db.query(Meeting).filter(Meeting.status != "Approved").order_by(Meeting.created_at.desc()).limit(5).all()
    
    tasks_generated = 0
    cache_dir = "/Users/shravan/Desktop/Meeting-Intelligence/data/reviews"
    if os.path.exists(cache_dir):
        for fname in os.listdir(cache_dir):
            if fname.endswith(".json"):
                try:
                    with open(os.path.join(cache_dir, fname), "r", encoding="utf-8") as f:
                        data = json.load(f)
                        if "action_items" in data and isinstance(data["action_items"], list):
                            tasks_generated += len(data["action_items"])
                except Exception:
                    pass

    pending_list = []
    for m in pending_meetings:
        matter_title = m.matter.title if m.matter else "Unassigned Matter"
        pending_list.append({
            "id": m.id,
            "title": m.title,
            "matter": matter_title,
            "status": m.status,
            "created_at": m.created_at.isoformat()
        })

    return {
        "active_matters": active_matters,
        "meetings_processed": meetings_processed,
        "pending_review": pending_review,
        "tasks_generated": tasks_generated,
        "recent_pending": pending_list
    }
