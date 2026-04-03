from fastapi import APIRouter

router = APIRouter()

@router.put("/{meeting_id}/review")
def submit_review(meeting_id: str):
    return {"message": f"Review submitted for meeting {meeting_id}"}
