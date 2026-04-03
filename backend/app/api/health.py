from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_root():
    return {"status": "ok", "service": "Legal Buddy Backend"}
