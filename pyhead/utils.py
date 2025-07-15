from pydantic import BaseModel
from pyhead.models import (
    DiaryEntry,
    Medication,
    Dose,
)


# Data conversion


def model_to_json_dict(obj):
    """
    Convert a Pydantic model (or list of models) to a JSON-serializable dict,
    handling date serialization.
    """
    if isinstance(obj, list):
        return [model_to_json_dict(item) for item in obj]
    if isinstance(obj, BaseModel):
        return obj.model_dump(mode="json")
    raise TypeError("Input must be a Pydantic model or list of models.")


def json_dict_to_model(model_cls, data):
    """
    Convert a dict (or list of dicts) to a Pydantic model (or list of models),
    handling date parsing.
    """
    if isinstance(data, list):
        return [json_dict_to_model(model_cls, item) for item in data]
    return model_cls.model_validate(data)


def uk_date_to_iso(date_str):
    """
    Convert a UK date string (DD/MM/YYYY) to ISO format (YYYY-MM-DD).
    """
    if not date_str:
        return None
    day, month, year = map(int, date_str.split("/"))
    return f"{year:04d}-{month:02d}-{day:02d}"


def iso_date_to_uk(iso_date_str):
    """
    Convert an ISO date string (YYYY-MM-DD) to UK format (DD/MM/YYYY).
    """
    if not iso_date_str:
        return None
    year, month, day = map(int, iso_date_str.split("-"))
    return f"{day:02d}/{month:02d}/{year:04d}"
