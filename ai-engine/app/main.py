from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Optional
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "AI Engine is running"}

class ResumeText(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    status: str
    score: int
    suggestions: List[Dict[str, str]]
    skillMatch: Dict[str, int]
    linkedinSummary: str

class InterviewRequest(BaseModel):
    text: str
    role: Optional[str] = "Software Engineer"

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(data: ResumeText):
    # This is where we would call OpenAI/Gemini
    # For now, providing a structured successful mock response
    # to demonstrate integration
    
    return {
        "status": "success",
        "score": 82,
        "suggestions": [
          { 
              "original": "Worked on frontend features.", 
              "improved": "Spearheaded the development of 15+ responsive frontend components using React and Next.js, improving user engagement by 20%." 
          },
          { 
              "original": "Helped with the database.", 
              "improved": "Optimized PostgreSQL database queries, reducing API response times by 35% across high-traffic endpoints." 
          }
        ],
        "skillMatch": {
            "React": 95,
            "TypeScript": 85,
            "Node.js": 70,
            "PostgreSQL": 60,
            "GraphQL": 40
        },
        "linkedinSummary": "Results-driven Software Engineer with a passion for building scalable web applications. Expert in React and Next.js with a strong background in backend optimization."
    }

@app.post("/generate-interview")
async def generate_interview(data: InterviewRequest):
    return {
        "questions": [
            {"id": 1, "type": "Technical", "text": "Explain your experience with React Server Components in your last project."},
            {"id": 2, "type": "Behavioral", "text": "How did you handle the optimization of the database queries you mentioned?"},
            {"id": 3, "type": "HR", "text": "What attracts you to this role based on your current technical trajectory?"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
