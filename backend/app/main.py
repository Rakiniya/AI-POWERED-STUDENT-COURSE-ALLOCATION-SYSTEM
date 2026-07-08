from fastapi import FastAPI

from app.database import Base, engine

# Import Models
from app.models.student import Student
from app.models.course import Course
from app.routers.course import router as course_router
from app.models.preference import Preference
from app.routers.preference import router as preference_router
from app.models.allocation import Allocation
from app.routers.allocation import router as allocation_router

# Import Routers
from app.routers.student import router as student_router
from app.routers.dashboard import router as dashboard_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Course Allocation API",
    version="1.0.0"
)

app.include_router(student_router)
app.include_router(course_router)
app.include_router(preference_router)
app.include_router(allocation_router)
app.include_router(dashboard_router)


@app.get("/")
def home():
    return {
        "message": "Student Course Allocation API is running successfully!"
    }