from typing import List, Optional
from datetime import date
from pydantic import BaseModel, Field, field_validator


class DiaryEntry(BaseModel):
    date: date
    score: int = Field(..., ge=1, le=10, description="Pain score between 1 and 10")
    limited: bool
    cluster: bool
    notes: Optional[List[str]] = None


class Dose(BaseModel):
    morning: float = 0.0
    afternoon: float = 0.0
    evening: float = 0.0


class Medication(BaseModel):
    name: str
    dose: Dose
    active: bool = True
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    side_effects: Optional[List[str]] = None
    notes: Optional[List[str]] = None
