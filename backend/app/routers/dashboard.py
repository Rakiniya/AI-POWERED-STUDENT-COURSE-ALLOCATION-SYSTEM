from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.allocation import Allocation
from app.models.student import Student
from app.models.course import Course

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/allocated-students")
def allocated_students(db: Session = Depends(get_db)):

    allocations = db.query(Allocation).all()

    result = []

    for allocation in allocations:

        student = db.query(Student).filter(
            Student.id == allocation.student_id
        ).first()

        course = db.query(Course).filter(
            Course.id == allocation.course_id
        ).first()

        result.append({
            "student_id": student.student_id,
            "student_name": student.name,
            "course": course.course_name,
            "priority": allocation.allocated_priority
        })

    return result

@router.get("/available-seats")
def available_seats(db: Session = Depends(get_db)):

    courses = db.query(Course).all()

    result = []

    for course in courses:

        general = db.query(Allocation).join(Student).filter(
            Allocation.course_id == course.id,
            Student.category == "General"
        ).count()

        obc = db.query(Allocation).join(Student).filter(
            Allocation.course_id == course.id,
            Student.category == "OBC"
        ).count()

        sc = db.query(Allocation).join(Student).filter(
            Allocation.course_id == course.id,
            Student.category == "SC"
        ).count()

        st = db.query(Allocation).join(Student).filter(
            Allocation.course_id == course.id,
            Student.category == "ST"
        ).count()

        result.append({
            "course": course.course_name,
            "General": course.general_seats - general,
            "OBC": course.obc_seats - obc,
            "SC": course.sc_seats - sc,
            "ST": course.st_seats - st
        })

    return result

@router.get("/course-statistics")
def course_statistics(db: Session = Depends(get_db)):

    courses = db.query(Course).all()

    result = []

    for course in courses:

        total = db.query(Allocation).filter(
            Allocation.course_id == course.id
        ).count()

        result.append({
            "course": course.course_name,
            "allocated_students": total
        })

    return result

@router.get("/category-summary")
def category_summary(db: Session = Depends(get_db)):

    categories = ["General", "OBC", "SC", "ST"]

    result = []

    for category in categories:

        total = db.query(Allocation).join(Student).filter(
            Student.category == category
        ).count()

        result.append({
            "category": category,
            "allocated": total
        })

    return result