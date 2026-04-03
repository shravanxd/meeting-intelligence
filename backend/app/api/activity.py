from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_activity():
    return [{"message": "List of activities"}]
