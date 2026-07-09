from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# Import Models
from app.models.student import Student
from app.models.course import Course
from app.models.preference import Preference
from app.models.allocation import Allocation

# Import Routers
from app.routers.student import router as student_router
from app.routers.course import router as course_router
from app.routers.preference import router as preference_router
from app.routers.allocation import router as allocation_router
from app.routers.dashboard import router as dashboard_router
from app.routers.ai import router as ai_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Student Course Allocation API",
    version="1.0.0"
)

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(student_router)
app.include_router(course_router)
app.include_router(preference_router)
app.include_router(allocation_router)
app.include_router(dashboard_router)
app.include_router(ai_router)


@app.get("/")
def home():
    return {
        "message": "Student Course Allocation API is running successfully!"
    }