from pydantic import BaseModel
from datetime import datetime


class StudentCreate(BaseModel):
    student_id: str
    name: str
    marks: float
    category: str

class StudentUpdate(BaseModel):
    student_id: str
    name: str
    marks: float
    category: str    


class StudentResponse(BaseModel):
    id: int
    student_id: str
    name: str
    marks: float
    category: str
    application_date: datetime

    class Config:
        from_attributes = True