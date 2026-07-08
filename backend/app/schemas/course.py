from pydantic import BaseModel


class CourseCreate(BaseModel):
    course_name: str
    total_seats: int
    general_seats: int
    obc_seats: int
    sc_seats: int
    st_seats: int


class CourseUpdate(BaseModel):
    course_name: str
    total_seats: int
    general_seats: int
    obc_seats: int
    sc_seats: int
    st_seats: int


class CourseResponse(BaseModel):
    id: int
    course_name: str
    total_seats: int
    general_seats: int
    obc_seats: int
    sc_seats: int
    st_seats: int

    class Config:
        from_attributes = True