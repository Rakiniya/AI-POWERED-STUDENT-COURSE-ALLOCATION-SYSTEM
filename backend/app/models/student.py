from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String(20), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    marks = Column(Float, nullable=False)
    category = Column(String(20), nullable=False)
    application_date = Column(DateTime, default=datetime.utcnow)