from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.student import Student
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse
)

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)

VALID_CATEGORIES = ["General", "OBC", "SC", "ST"]


# Create Student
@router.post("/", response_model=StudentResponse)
def create_student(student: StudentCreate, db: Session = Depends(get_db)):

    existing_student = db.query(Student).filter(
        Student.student_id == student.student_id
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Student ID already exists."
        )

    if student.category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid category. Allowed: General, OBC, SC, ST."
        )

    if student.marks < 0 or student.marks > 100:
        raise HTTPException(
            status_code=400,
            detail="Marks should be between 0 and 100."
        )

    new_student = Student(
        student_id=student.student_id,
        name=student.name,
        marks=student.marks,
        category=student.category
    )

    db.add(new_student)
    db.commit()
    db.refresh(new_student)

    return new_student


# Get All Students
@router.get("/", response_model=list[StudentResponse])
def get_all_students(db: Session = Depends(get_db)):
    return db.query(Student).all()


# Get Student By ID
@router.get("/{student_id}", response_model=StudentResponse)
def get_student(student_id: int, db: Session = Depends(get_db)):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    return student


# Update Student
@router.put("/{student_id}", response_model=StudentResponse)
def update_student(
    student_id: int,
    updated_student: StudentUpdate,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    existing_student = db.query(Student).filter(
        Student.student_id == updated_student.student_id,
        Student.id != student_id
    ).first()

    if existing_student:
        raise HTTPException(
            status_code=400,
            detail="Student ID already exists."
        )

    if updated_student.category not in VALID_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid category. Allowed: General, OBC, SC, ST."
        )

    if updated_student.marks < 0 or updated_student.marks > 100:
        raise HTTPException(
            status_code=400,
            detail="Marks should be between 0 and 100."
        )

    student.student_id = updated_student.student_id
    student.name = updated_student.name
    student.marks = updated_student.marks
    student.category = updated_student.category

    db.commit()
    db.refresh(student)

    return student


# Delete Student
@router.delete("/{student_id}")
def delete_student(
    student_id: int,
    db: Session = Depends(get_db)
):

    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found."
        )

    db.delete(student)
    db.commit()

    return {
        "message": "Student deleted successfully."
    }