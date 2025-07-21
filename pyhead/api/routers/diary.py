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


@router.get("/latest", response_model=DiaryEntry)
def get_latest_entry():
    """Retrieve the latest diary entry."""
    entry = get_diary_entries()[-1] if get_diary_entries() else None
    if not entry:
        raise HTTPException(status_code=404, detail="No diary entries found")
    return entry


@router.get("/month/{year}/{month}", response_model=list[DiaryEntry])
def get_entries_by_month(year: int, month: int):
    """Retrieve all diary entries for a specific month."""
    entries = [
        entry
        for entry in get_diary_entries()
        if entry.date.year == year and entry.date.month == month
    ]
    if not entries:
        raise HTTPException(
            status_code=404, detail="No diary entries found for this month"
        )
    return entries


@router.get("/stats/month/{year}/{month}", response_model=dict)
def get_month_stats(year: int, month: int):
    """Retrieve statistics for a specific month."""
    entries = get_entries_by_month(year, month)
    if not entries:
        raise HTTPException(
            status_code=404, detail="No diary entries found for this month"
        )

    avg_pain = sum(entry.score for entry in entries) / len(entries)
    num_cluster_days = sum(1 for entry in entries if entry.cluster)

    return {
        "average_pain_score": round(avg_pain, 2),
        "number_of_cluster_days": num_cluster_days,
    }


@router.post("/", response_model=DiaryEntry)
def add_entry(entry: DiaryEntry):
    """Add a new diary entry."""
    # Check if entry with this date already exists
    existing_entry = get_diary_entry_by_date(entry.date)
    if existing_entry:
        raise HTTPException(
            status_code=409, detail=f"Diary entry for date {entry.date} already exists"
        )
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
