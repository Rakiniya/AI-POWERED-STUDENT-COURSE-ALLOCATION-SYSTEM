from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.allocation import Allocation
from app.models.student import Student
from app.models.course import Course
from app.models.preference import Preference

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

        allocated = db.query(Allocation).filter(
            Allocation.course_id == course.id
        ).count()

        result.append({
            "course": course.course_name,
            "total_seats": course.total_seats,
            "allocated_students": allocated,
            "available_seats": course.total_seats - allocated
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
@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):

    total_students = db.query(Student).count()

    total_courses = db.query(Course).count()

    allocated_students = db.query(Allocation).count()

    unallocated_students = total_students - allocated_students

    allocation_percentage = 0

    if total_students > 0:
        allocation_percentage = round(
            (allocated_students / total_students) * 100,
            2
        )

    return {
        "total_students": total_students,
        "total_courses": total_courses,
        "allocated_students": allocated_students,
        "unallocated_students": unallocated_students,
        "allocation_percentage": allocation_percentage
    }

@router.get("/rejection-rate")
def rejection_rate(db: Session = Depends(get_db)):

    courses = db.query(Course).all()

    result = []

    for course in courses:

        applications = db.query(Preference).filter(
    Preference.course_id == course.id
).count()

        allocated = db.query(Allocation).filter(
            Allocation.course_id == course.id
        ).count()

        rejected = applications - allocated

        rejection_rate = 0

        if applications > 0:
            rejection_rate = round((rejected / applications) * 100, 2)

        result.append({
            "course": course.course_name,
            "applications": applications,
            "allocated": allocated,
            "rejected": rejected,
            "rejection_rate": rejection_rate
        })

    return result


@router.get("/seat-utilization")
def seat_utilization(db: Session = Depends(get_db)):

    courses = db.query(Course).all()

    result = []

    for course in courses:

        allocated = db.query(Allocation).filter(
            Allocation.course_id == course.id
        ).count()

        utilization = 0

        if course.total_seats > 0:
            utilization = round(
                (allocated / course.total_seats) * 100,
                2
            )

        result.append({
            "course": course.course_name,
            "allocated": allocated,
            "total_seats": course.total_seats,
            "utilization": utilization
        })

    return result

@router.get("/first-preference")
def first_preference(db: Session = Depends(get_db)):

    allocations = db.query(Allocation).all()

    first = 0
    second = 0
    third = 0

    for allocation in allocations:

        if allocation.allocated_priority == 1:
            first += 1
        elif allocation.allocated_priority == 2:
            second += 1
        elif allocation.allocated_priority == 3:
            third += 1

    total = first + second + third

    success_rate = 0

    if total > 0:
        success_rate = round((first / total) * 100, 2)

    return {
        "first_preference": first,
        "second_preference": second,
        "third_preference": third,
        "success_rate": success_rate
    }