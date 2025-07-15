from datetime import date
from pyhead.models import (
    DiaryEntry,
    Medication,
    Dose,
)

from pyhead.database import (
    save_diary_entries,
    load_diary_entries,
    save_medications,
    load_medications,
)


def create_diary_entry(entry: DiaryEntry):
    """Add a new diary entry and save."""
    entries = load_diary_entries()
    entries.append(entry)
    save_diary_entries(entries)


def get_diary_entries():
    """Load all diary entries."""
    return load_diary_entries()


def delete_diary_entry_by_date(entry_date: date):
    """Delete a diary entry by date and save."""
    entries = load_diary_entries()
    entries = [e for e in entries if e.date != entry_date]
    save_diary_entries(entries)


def create_medication(med: Medication):
    """Add a new medication and save."""
    meds = load_medications()
    meds.append(med)
    save_medications(meds)


def delete_medication_by_name(name: str):
    """Delete a medication by name and save."""
    meds = load_medications()
    meds = [m for m in meds if m.name != name]
    save_medications(meds)
