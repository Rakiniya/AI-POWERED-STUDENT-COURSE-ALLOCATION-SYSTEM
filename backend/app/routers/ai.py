import os

from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

from google import genai

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
def chat(request: ChatRequest):

    prompt = f"""
You are an AI assistant for a University Student Course Allocation System.

Answer clearly and professionally.

User:
{request.question}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "answer": response.text
    }