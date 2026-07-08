from sqlalchemy import Column, Integer, String

from app.database import Base


class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    course_name = Column(String(100), unique=True, nullable=False)

    total_seats = Column(Integer, nullable=False)

    general_seats = Column(Integer, nullable=False)
    obc_seats = Column(Integer, nullable=False)
    sc_seats = Column(Integer, nullable=False)
    st_seats = Column(Integer, nullable=False)