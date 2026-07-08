from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(Integer, primary_key=True, index=True)

    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    course_id = Column(Integer, ForeignKey("courses.id"))

    allocated_priority = Column(Integer)

    student = relationship("Student")
    course = relationship("Course")