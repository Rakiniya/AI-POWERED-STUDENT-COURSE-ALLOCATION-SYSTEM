from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.preference import Preference
from app.models.student import Student
from app.models.course import Course
from app.schemas.preference import (
    PreferenceCreate,
    PreferenceResponse,
)

router = APIRouter(
    prefix="/preferences",
    tags=["Preferences"]
)


# Create Preference
@router.post("/", response_model=PreferenceResponse)
def create_preference(
    preference: PreferenceCreate,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == preference.student_id
    ).first()

    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")

    course = db.query(Course).filter(
        Course.id == preference.course_id
    ).first()

    if not course:
        raise HTTPException(status_code=404, detail="Course not found.")

    if preference.priority not in [1, 2, 3]:
        raise HTTPException(
            status_code=400,
            detail="Priority must be 1, 2 or 3."
        )

    duplicate_course = db.query(Preference).filter(
        Preference.student_id == preference.student_id,
        Preference.course_id == preference.course_id
    ).first()

    if duplicate_course:
        raise HTTPException(
            status_code=400,
            detail="Course already selected by this student."
        )

    duplicate_priority = db.query(Preference).filter(
        Preference.student_id == preference.student_id,
        Preference.priority == preference.priority
    ).first()

    if duplicate_priority:
        raise HTTPException(
            status_code=400,
            detail="Priority already used."
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


# Get All Preferences
@router.get("/", response_model=list[PreferenceResponse])
def get_preferences(db: Session = Depends(get_db)):
    return db.query(Preference).all()


# Update Preference
@router.put("/{preference_id}", response_model=PreferenceResponse)
def update_preference(
    preference_id: int,
    updated: PreferenceCreate,
    db: Session = Depends(get_db)
):

    preference = db.query(Preference).filter(
        Preference.id == preference_id
    ).first()

    if not preference:
        raise HTTPException(
            status_code=404,
            detail="Preference not found."
        )

    preference.student_id = updated.student_id
    preference.course_id = updated.course_id
    preference.priority = updated.priority

    db.commit()
    db.refresh(preference)

    return preference


# Delete Preference
@router.delete("/{preference_id}")
def delete_preference(
    preference_id: int,
    db: Session = Depends(get_db)
):

    preference = db.query(Preference).filter(
        Preference.id == preference_id
    ).first()

    if not preference:
        raise HTTPException(
            status_code=404,
            detail="Preference not found."
        )

    db.delete(preference)
    db.commit()

    return {
        "message": "Preference deleted successfully."
    }