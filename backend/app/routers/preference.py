from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.preference import Preference
from app.models.student import Student
from app.models.course import Course
from app.schemas.preference import PreferenceCreate, PreferenceResponse

router = APIRouter(
    prefix="/preferences",
    tags=["Preferences"]
)


@router.post("/", response_model=PreferenceResponse)
def create_preference(
    preference: PreferenceCreate,
    db: Session =Depends(get_db)
):

    # Check Student
    student = db.query(Student).filter(
        Student.id == preference.student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    # Check Course
    course = db.query(Course).filter(
        Course.id == preference.course_id
    ).first()

    if not course:
        raise HTTPException(
            status_code=404,
            detail="Course not found."
        )

    # Priority validation
    if preference.priority not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Priority must be 1, 2 or 3."
        )

    # Same course cannot be selected twice
    duplicate_course = db.query(Preference).filter(
        Preference.student_id == preference.student_id,
        Preference.course_id == preference.course_id
    ).first()

    if duplicate_course:
        raise HTTPException(
            status_code=400,
            detail="Course already selected by this student."
        )

    # Same priority cannot be used twice
    duplicate_priority = db.query(Preference).filter(
        Preference.student_id == preference.student_id,
        Preference.priority == preference.priority
    ).first()

    if duplicate_priority:
        raise HTTPException(
            status_code=400,
            detail="Priority already used by this student."
        )

    new_preference = Preference(
        student_id=preference.student_id,
        course_id=preference.course_id,
        priority=preference.priority
    )

    db.add(new_preference)
    db.commit()
    db.refresh(new_preference)

    return new_preference