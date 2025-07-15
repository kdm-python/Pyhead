import tempfile
from pathlib import Path
from datetime import date
from pyhead.database import (
    save_diary_entries,
    load_diary_entries,
    save_medications,
    load_medications,
    DATA_DIR,
    DIARY_FILE,
    MEDICATION_FILE,
)
from pyhead.models import DiaryEntry, Medication, Dose


def setup_module(module):
    global DATA_DIR, DIARY_FILE, MEDICATION_FILE
    # Use a temp directory for data files
    module._old_data_dir = DATA_DIR.parent / "data"
    module._tmpdir = tempfile.TemporaryDirectory()
    tmp_data_dir = Path(module._tmpdir.name)
    # Patch the global paths
    DATA_DIR = tmp_data_dir
    DIARY_FILE = DATA_DIR / "diary.json"
    MEDICATION_FILE = DATA_DIR / "medications.json"


def teardown_module(module):
    module._tmpdir.cleanup()


def test_save_and_load_diary_entries():
    entries = [
        DiaryEntry(
            date=date(2025, 7, 15), score=5, limited=True, cluster=False, notes=["test"]
        ),
        DiaryEntry(
            date=date(2025, 7, 16), score=8, limited=False, cluster=True, notes=None
        ),
    ]
    save_diary_entries(entries)
    loaded = load_diary_entries()
    assert len(loaded) == 2
    assert loaded[0].date == date(2025, 7, 15)
    assert loaded[1].score == 8
    assert loaded[0].notes == ["test"]


def test_save_and_load_medications():
    meds = [
        Medication(
            name="Ibuprofen",
            dose=Dose(morning=200, afternoon=0, evening=200),
            active=True,
            start_date=date(2025, 1, 1),
            end_date=None,
            side_effects=["Nausea"],
            notes=None,
        )
    ]
    save_medications(meds)
    loaded = load_medications()
    assert len(loaded) == 1
    assert loaded[0].name == "Ibuprofen"
    assert loaded[0].dose.morning == 200
    assert loaded[0].start_date == date(2025, 1, 1)
