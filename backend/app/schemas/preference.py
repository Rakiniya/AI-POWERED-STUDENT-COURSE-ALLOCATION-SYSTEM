from pydantic import BaseModel


class PreferenceCreate(BaseModel):
    student_id: int
    course_id: int
    priority: int


class PreferenceResponse(BaseModel):
    id: int
    student_id: int
    course_id: int
    priority: int

    class Config:
        from_attributes = True