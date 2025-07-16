from typing import List
from pyhead.models import DiaryEntry, Medication
from pyhead.database import (
    load_diary_entries,
    save_diary_entries,
    load_medications,
    save_medications,
)


class DiaryDB:
    def __init__(self):
        self.entries = load_diary_entries()

    def get_entries(self) -> List[DiaryEntry]:
        return self.entries

    def save_entries(self):
        save_diary_entries(self.entries)


class MedicationDB:
    def __init__(self):
        self.medications = load_medications()

    def get_medications(self) -> List[Medication]:
        return self.medications

    def save_medications(self):
        save_medications(self.medications)


def get_diary_db():
    db = DiaryDB()
    try:
        yield db
    finally:
        db.save_entries()


def get_medication_db():
    db = MedicationDB()
    try:
        yield db
    finally:
        db.save_medications()
