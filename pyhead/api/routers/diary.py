from fastapi import APIRouter, HTTPException
from datetime import date
from pyhead.models import DiaryEntry
from pyhead.crud import (
    get_diary_entries,
    get_diary_entry_by_date,
    create_diary_entry,
    delete_diary_entry_by_date,
    update_diary_entry,
)

router = APIRouter(prefix="/api/diary", tags=["diary"])


@router.get("/", response_model=list[DiaryEntry])
def get_entries():
    """Retrieve all diary entries."""
    return get_diary_entries()


@router.get("/{entry_date}", response_model=DiaryEntry)
def get_entry(entry_date: date):
    """Retrieve a diary entry by its date (YYYY-MM-DD)."""
    entry = get_diary_entry_by_date(entry_date)
    if not entry:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    return entry


@router.post("/", response_model=DiaryEntry)
def add_entry(entry: DiaryEntry):
    """Add a new diary entry."""
    create_diary_entry(entry)
    return entry


@router.delete("/{entry_date}", response_model=DiaryEntry)
def delete_entry(entry_date: date):
    """Delete a diary entry by its date (YYYY-MM-DD)."""
    entry = get_diary_entry_by_date(entry_date)
    if not entry:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    delete_diary_entry_by_date(entry_date)
    return entry


@router.put("/", response_model=DiaryEntry)
def update_entry(entry: DiaryEntry):
    """Update an existing diary entry."""
    existing_entry = get_diary_entry_by_date(entry.date)
    if not existing_entry:
        raise HTTPException(status_code=404, detail="Diary entry not found")
    update_diary_entry(entry)
    return entry
