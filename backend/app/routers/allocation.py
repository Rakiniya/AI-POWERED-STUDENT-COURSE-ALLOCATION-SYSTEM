from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.student import Student
from app.models.course import Course
from app.models.preference import Preference
from app.models.allocation import Allocation

router = APIRouter(
    prefix="/allocation",
    tags=["Allocation"]
)


@router.post("/")
def allocate_students(db: Session = Depends(get_db)):

    # Remove previous allocations
    db.query(Allocation).delete()
    db.commit()

    # Students sorted by marks (highest first),
    # then application date (earliest first)
    students = db.query(Student).order_by(
        Student.marks.desc(),
        Student.application_date.asc()
    ).all()

    allocated_students = []

    for student in students:

        # Student preferences (Priority 1 -> 3)
        preferences = db.query(Preference).filter(
            Preference.student_id == student.id
        ).order_by(
            Preference.priority.asc()
        ).all()

        allocated = False

        for preference in preferences:

            course = db.query(Course).filter(
                Course.id == preference.course_id
            ).first()

            if not course:
                continue

            # Count already allocated students of the same category
            allocated_count = (
                db.query(Allocation)
                .join(Student, Allocation.student_id == Student.id)
                .filter(
                    Allocation.course_id == course.id,
                    Student.category == student.category
                )
                .count()
            )

            # Calculate remaining seats
            if student.category == "General":
                remaining_seats = course.general_seats - allocated_count

            elif student.category == "OBC":
                remaining_seats = course.obc_seats - allocated_count

            elif student.category == "SC":
                remaining_seats = course.sc_seats - allocated_count

            elif student.category == "ST":
                remaining_seats = course.st_seats - allocated_count

            else:
                remaining_seats = 0

            # Allocate if seats available
            if remaining_seats > 0:

                allocation = Allocation(
                    student_id=student.id,
                    course_id=course.id,
                    allocated_priority=preference.priority
                )

                db.add(allocation)

                allocated_students.append({
                    "student_id": student.student_id,
                    "student_name": student.name,
                    "marks": student.marks,
                    "category": student.category,
                    "allocated_course": course.course_name,
                    "allocated_priority": preference.priority
                })

                allocated = True
                break

        # Student not allocated
        if not allocated:

            allocated_students.append({
                "student_id": student.student_id,
                "student_name": student.name,
                "marks": student.marks,
                "category": student.category,
                "allocated_course": "Not Allocated",
                "allocated_priority": None
            })

    db.commit()

    return {
        "message": "Course allocation completed successfully.",
        "total_students": len(students),
        "total_allocated": len(
            [s for s in allocated_students if s["allocated_course"] != "Not Allocated"]
        ),
        "total_not_allocated": len(
            [s for s in allocated_students if s["allocated_course"] == "Not Allocated"]
        ),
        "results": allocated_students
    }