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


# --- Diary Entries ---


def get_diary_entries():
    """Load all diary entries."""
    return load_diary_entries()


def get_diary_entry_by_date(entry_date: date) -> DiaryEntry:
    """Retrieve a diary entry by its date."""
    entries = load_diary_entries()
    for entry in entries:
        if entry.date == entry_date:
            return entry
    return None


def create_diary_entry(entry: DiaryEntry):
    """Add a new diary entry and save."""
    entries = load_diary_entries()
    entries.append(entry)
    save_diary_entries(entries)


def delete_diary_entry_by_date(entry_date: date):
    """Delete a diary entry by date and save."""
    entries = load_diary_entries()
    entries = [e for e in entries if e.date != entry_date]
    save_diary_entries(entries)


def update_diary_entry(entry: DiaryEntry):
    """Update an existing diary entry by replacing with a new object and save."""
    entries = load_diary_entries()
    for i, e in enumerate(entries):
        if e.date == entry.date:
            entries[i] = entry
            break
    save_diary_entries(entries)


# --- Medications ---


def get_all_medications():
    """Load all medications."""
    return load_medications()


def get_medication_by_name(name: str) -> Medication:
    """Retrieve a medication by its name."""
    medications = load_medications()
    for med in medications:
        if med.name == name:
            return med
    return None


def create_medication(med: Medication):
    """Add a new medication and save. Raise ValueError if name exists."""
    meds = load_medications()
    if any(m.name == med.name for m in meds):
        raise ValueError(f"Medication with name '{med.name}' already exists.")
    meds.append(med)
    save_medications(meds)


def delete_medication_by_name(name: str):
    """Delete a medication by name and save."""
    meds = load_medications()
    meds = [m for m in meds if m.name != name]
    save_medications(meds)


def update_medication(med: Medication):
    """Update an existing medication by replacing with a new object and save."""
    meds = load_medications()
    for i, m in enumerate(meds):
        if m.name == med.name:
            meds[i] = med
            break
    save_medications(meds)
