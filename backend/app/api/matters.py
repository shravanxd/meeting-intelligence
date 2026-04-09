from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..core.dependencies import get_db
from ..models import models
from ..schemas import schemas
from typing import List

router = APIRouter()

@router.post("/", response_model=schemas.MatterResponse, status_code=status.HTTP_201_CREATED)
def create_matter(matter: schemas.MatterCreate, db: Session = Depends(get_db)):
    db_matter = models.Matter(**matter.model_dump())
    db.add(db_matter)
    db.commit()
    db.refresh(db_matter)
    
    # Audit log
    audit_evt = models.AuditEvent(
        event_type="MATTER_CREATED",
        entity_type="MATTER",
        entity_id=db_matter.id,
        actor="AI Admin",
        metadata_json={"title": db_matter.title, "client": db_matter.client_name}
    )
    db.add(audit_evt)
    db.commit()

    return db_matter

@router.get("/", response_model=List[schemas.MatterResponse])
def get_matters(db: Session = Depends(get_db), skip: int = 0, limit: int = 100):
    matters = db.query(models.Matter).offset(skip).limit(limit).all()
    return matters

@router.get("/{matter_id}", response_model=schemas.MatterResponse)
def get_matter(matter_id: str, db: Session = Depends(get_db)):
    matter = db.query(models.Matter).filter(models.Matter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    return matter

@router.delete("/{matter_id}")
def delete_matter(matter_id: str, db: Session = Depends(get_db)):
    matter = db.query(models.Matter).filter(models.Matter.id == matter_id).first()
    if not matter:
        raise HTTPException(status_code=404, detail="Matter not found")
    
    meetings = db.query(models.Meeting).filter(models.Meeting.matter_id == matter_id).all()
    for m in meetings:
        m.matter_id = None
        
    db.delete(matter)
    db.commit()
    return {"message": "Matter deleted"}
