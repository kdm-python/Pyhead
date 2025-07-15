from fastapi import APIRouter
from pyhead.models import Medication, DiaryEntry
from pyhead.crud import (
    create_medication,
    delete_medication_by_name,
    get_diary_entries,
)

router = APIRouter(prefix="/api/medications/", tags=["medications"])

@router.get("/", response_model=list[Medication])
def get_medications():
    """Retrieve all medications."""
    