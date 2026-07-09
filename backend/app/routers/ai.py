import os

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from google import genai

from app.database import get_db
from app.models.student import Student
from app.models.course import Course
from app.models.allocation import Allocation
from app.models.preference import Preference

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):

    students = db.query(Student).count()
    courses = db.query(Course).count()

    all_students = db.query(Student).all()
    all_courses = db.query(Course).all()
    allocations = db.query(Allocation).all()

    allocation_data = []

    first_preference = 0
    second_preference = 0
    third_preference = 0

    category_summary = {
        "General": 0,
        "OBC": 0,
        "SC": 0,
        "ST": 0
    }

    for allocation in allocations:

        student = db.query(Student).filter(
            Student.id == allocation.student_id
        ).first()

        course = db.query(Course).filter(
            Course.id == allocation.course_id
        ).first()

        allocation_data.append({
            "student": student.name,
            "course": course.course_name,
            "category": student.category,
            "priority": allocation.allocated_priority
        })

        category_summary[student.category] += 1

        if allocation.allocated_priority == 1:
            first_preference += 1
        elif allocation.allocated_priority == 2:
            second_preference += 1
        elif allocation.allocated_priority == 3:
            third_preference += 1

    rejection_statistics = []

    for course in all_courses:

        applications = db.query(Preference).filter(
    Preference.course_id == course.id
).count()

        allocated = db.query(Allocation).filter(
            Allocation.course_id == course.id
        ).count()

        rejected = applications - allocated

        rejection_rate = 0

        if applications > 0:
            rejection_rate = round(
                (rejected / applications) * 100,
                2
            )

        rejection_statistics.append({
            "course": course.course_name,
            "applications": applications,
            "allocated": allocated,
            "rejected": rejected,
            "rejection_rate": rejection_rate
        })

    prompt = f"""
You are an AI Assistant for a University Student Course Allocation System.

Current Database

Total Students: {students}

Total Courses: {courses}

Allocated Students:
{allocation_data}

Category Wise Allocation:
{category_summary}

Preference Statistics:
First Preference: {first_preference}
Second Preference: {second_preference}
Third Preference: {third_preference}

Course Rejection Statistics:
{rejection_statistics}

Instructions

Answer ONLY using the information provided.

If asked:

- How many students were allocated to each course?
Use Allocated Students.

- Which students did not receive their first preference?
Check priority greater than 1.

- Which course had the highest rejection rate?
Use Course Rejection Statistics.

- Show category-wise allocation summary.
Use Category Wise Allocation.

Always answer in proper English.

Never invent information.

Keep answers concise.

User Question:
{request.question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return {
        "answer": response.text.replace("\n", " ")
    }