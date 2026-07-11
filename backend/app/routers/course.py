from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.preference import Preference
from app.models.allocation import Allocation

from app.database import get_db
from app.models.course import Course
from app.schemas.course import (
    CourseCreate,
    CourseUpdate,
    CourseResponse
)

router = APIRouter(
    prefix="/courses",
    tags=["Courses"]
)


# Create Course
@router.post("/", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):

    existing_course = db.query(Course).filter(
        Course.course_name == course.course_name
    ).first()

    if existing_course:
        raise HTTPException(
            status_code=400,
            detail="Course already exists."
        )

    reserved_seats = (
        course.general_seats +
        course.obc_seats +
        course.sc_seats +
        course.st_seats
    )

    if reserved_seats > course.total_seats:
        raise HTTPException(
            status_code=400,
            detail="Reserved seats cannot exceed total seats."
        )

    new_course = Course(
        course_name=course.course_name,
        total_seats=course.total_seats,
        general_seats=course.general_seats,
        obc_seats=course.obc_seats,
        sc_seats=course.sc_seats,
        st_seats=course.st_seats
    )

    db.add(new_course)
    db.commit()
    db.refresh(new_course)

    return new_course


# Get All Courses
@router.get("/", response_model=list[CourseResponse])
def get_all_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()


# Get Course By ID
@router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found."
        )

    return course


# Update Course
@router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    updated_course: CourseUpdate,
    db: Session = Depends(get_db)
):

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found."
        )

    existing_course = db.query(Course).filter(
        Course.course_name == updated_course.course_name,
        Course.id != course_id
    ).first()

    if existing_course:
        raise HTTPException(
            status_code=400,
            detail="Course name already exists."
        )

    reserved_seats = (
        updated_course.general_seats +
        updated_course.obc_seats +
        updated_course.sc_seats +
        updated_course.st_seats
    )

    if reserved_seats > updated_course.total_seats:
        raise HTTPException(
            status_code=400,
            detail="Reserved seats cannot exceed total seats."
        )

    course.course_name = updated_course.course_name
    course.total_seats = updated_course.total_seats
    course.general_seats = updated_course.general_seats
    course.obc_seats = updated_course.obc_seats
    course.sc_seats = updated_course.sc_seats
    course.st_seats = updated_course.st_seats

    db.commit()
    db.refresh(course)

    return course


# Delete Course
@router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db)
):

    course = db.query(Course).filter(
        Course.id == course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found."
        )

    # Delete related preferences
    db.query(Preference).filter(
        Preference.course_id == course_id
    ).delete()

    # Delete related allocations
    db.query(Allocation).filter(
        Allocation.course_id == course_id
    ).delete()

    # Delete the course
    db.delete(course)
    db.commit()

    return {
        "message": "Course deleted successfully."
    }