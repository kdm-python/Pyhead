import json
from pathlib import Path
from typing import List

from pyhead.utils import (
    model_to_json_dict,
    json_dict_to_model,
)
from pyhead.models import DiaryEntry, Medication


DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DIARY_FILE = DATA_DIR / "diary.json"
MEDICATION_FILE = DATA_DIR / "medications.json"


def ensure_data_dir():
    """Ensure that the data directory exists."""
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def save_diary_entries(entries: List[DiaryEntry]):
    """Save diary entries to a JSON file."""
    ensure_data_dir()
    data = model_to_json_dict(entries)
    with open(DIARY_FILE, "w") as f:
        json.dump(data, f, indent=4)


def load_diary_entries() -> List[DiaryEntry]:
    """Load diary entries from a JSON file."""
    ensure_data_dir()
    if not DIARY_FILE.exists():
        return []
    with open(DIARY_FILE, "r") as f:
        data = json.load(f)
    return json_dict_to_model(DiaryEntry, data)


def save_medications(medications: List[Medication]):
    """Save medications to a JSON file."""
    ensure_data_dir()
    data = model_to_json_dict(medications)
    with open(MEDICATION_FILE, "w") as f:
        json.dump(data, f, indent=4)


def load_medications() -> List[Medication]:
    """Load medications from a JSON file."""
    ensure_data_dir()
    if not MEDICATION_FILE.exists():
        return []
    with open(MEDICATION_FILE, "r") as f:
        data = json.load(f)
    return json_dict_to_model(Medication, data)
