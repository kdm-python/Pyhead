import pytest
from datetime import date
from pyhead.models import DiaryEntry, Medication, Dose
from pyhead import crud


@pytest.fixture
def sample_diary_entry():
    return DiaryEntry(
        date=date(2024, 6, 1),
        score=5,
        limited=False,
        cluster=False,
        notes=["mild headache"],
    )


@pytest.fixture
def sample_medication():
    return Medication(
        name="Ibuprofen",
        dose=Dose(morning=200.0),
        active=True,
        start_date=date(2024, 6, 1),
        notes=["as needed"],
    )


def test_create_and_get_diary_entry(tmp_path, monkeypatch, sample_diary_entry):
    # Patch data file locations
    from pyhead import database

    monkeypatch.setattr(database, "DIARY_FILE", tmp_path / "diary.json")
    monkeypatch.setattr(database, "DATA_DIR", tmp_path)

    # Should start empty
    assert crud.get_diary_entries() == []

    # Add entry
    crud.create_diary_entry(sample_diary_entry)
    entries = crud.get_diary_entries()
    assert len(entries) == 1
    assert entries[0].date == sample_diary_entry.date


def test_delete_diary_entry_by_date(tmp_path, monkeypatch, sample_diary_entry):
    from pyhead import database

    monkeypatch.setattr(database, "DIARY_FILE", tmp_path / "diary.json")
    monkeypatch.setattr(database, "DATA_DIR", tmp_path)

    crud.create_diary_entry(sample_diary_entry)
    crud.delete_diary_entry_by_date(sample_diary_entry.date)
    assert crud.get_diary_entries() == []


def test_create_and_delete_medication(tmp_path, monkeypatch, sample_medication):
    from pyhead import database

    monkeypatch.setattr(database, "MEDICATION_FILE", tmp_path / "medications.json")
    monkeypatch.setattr(database, "DATA_DIR", tmp_path)

    # Should start empty
    assert database.load_medications() == []

    # Add medication
    crud.create_medication(sample_medication)
    meds = database.load_medications()
    assert len(meds) == 1
    assert meds[0].name == "Ibuprofen"

    # Delete medication
    crud.delete_medication_by_name("Ibuprofen")
    meds = database.load_medications()
    assert meds == []
