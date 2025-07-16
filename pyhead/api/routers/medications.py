from fastapi import APIRouter, HTTPException
from pyhead.models import Medication
from pyhead.crud import (
    get_all_medications,
    get_medication_by_name,
    create_medication,
    delete_medication_by_name,
    update_medication,
)

router = APIRouter(prefix="/api/medications", tags=["medications"])


@router.get("/", response_model=list[Medication])
def get_medications():
    """Retrieve all medications."""
    return get_all_medications()


@router.get("/{name}", response_model=Medication)
def get_medication(name: str):
    """Retrieve a medication by its name."""
    return get_medication_by_name(name)


@router.post("/", response_model=Medication)
def add_medication(med: Medication):
    """Add a new medication."""
    try:
        create_medication(med)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return med


@router.delete("/{name}", response_model=Medication)
def delete_medication(name: str):
    """Delete a medication by its name."""
    med = get_medication_by_name(name)
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    delete_medication_by_name(name)
    return med


@router.put("/", response_model=Medication)
def update_medication_endpoint(med: Medication):
    """Update an existing medication."""
    existing_med = get_medication_by_name(med.name)
    if not existing_med:
        raise HTTPException(status_code=404, detail="Medication not found")
    update_medication(med)
    return med
