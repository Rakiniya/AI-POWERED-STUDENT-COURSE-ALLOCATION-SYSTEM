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
    allocations = db.query(Allocation).all()

    allocation_data = []

    for allocation in allocations:
        student = db.query(Student).filter(Student.id == allocation.student_id).first()
        course = db.query(Course).filter(Course.id == allocation.course_id).first()

        allocation_data.append({
            "student": student.name,
            "course": course.course_name,
            "category": student.category,
            "priority": allocation.allocated_priority
        })

    prompt = f"""
You are an AI Assistant for a University Student Course Allocation System.

Current Database Information

Total Students: {students}
Total Courses: {courses}

Allocated Students:
{allocation_data}

Rules:
- Always answer in proper English.
- Never use '\\n' in the response.
- Write complete sentences.
- If multiple items exist, answer as paragraphs or numbered points.
- Be professional and concise.
- If no data exists, clearly mention that.

User Question:
{request.question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    answer = response.text.replace("\n", " ")

    return {
        "answer": answer
    }