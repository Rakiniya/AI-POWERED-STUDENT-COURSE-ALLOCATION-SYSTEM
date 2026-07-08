from fastapi import FastAPI

app = FastAPI(
    title="Student Course Allocation API",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Student Course Allocation API is running successfully!"
    }
