import pytest
from datetime import date
from pyhead.utils import model_to_json_dict, json_dict_to_model, uk_date_to_iso, iso_date_to_uk
from pyhead.models import DiaryEntry, Medication, Dose


def test_model_to_json_and_back():
    entry = DiaryEntry(
        date=date(2025, 7, 15),
        score=7,
        limited=True,
        cluster=False,
        notes=["Test note"]
    )
    # Serialize
    json_data = model_to_json_dict(entry)
    assert isinstance(json_data, dict)
    assert json_data["date"] == "2025-07-15"
    # Deserialize
    entry2 = json_dict_to_model(DiaryEntry, json_data)
    assert isinstance(entry2, DiaryEntry)
    assert entry2.date == date(2025, 7, 15)
    assert entry2.score == 7
    assert entry2.notes == ["Test note"]


def test_medication_model_to_json_and_back():
    med = Medication(
        name="Ibuprofen",
        dose=Dose(morning=200, afternoon=0, evening=200),
        active=True,
        start_date=date(2025, 1, 1),
        end_date=None,
        side_effects=["Nausea"],
        notes=None
    )
    json_data = model_to_json_dict(med)
    assert json_data["start_date"] == "2025-01-01"
    med2 = json_dict_to_model(Medication, json_data)
    assert isinstance(med2, Medication)
    assert med2.start_date == date(2025, 1, 1)
    assert med2.dose.morning == 200
    assert med2.side_effects == ["Nausea"]


def test_uk_date_to_iso():
    assert uk_date_to_iso("15/07/2025") == "2025-07-15"
    assert uk_date_to_iso("") is None


def test_iso_date_to_uk():
    assert iso_date_to_uk("2025-07-15") == "15/07/2025"
    assert iso_date_to_uk("") is None
