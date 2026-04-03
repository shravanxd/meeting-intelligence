from fastapi import APIRouter
from pydantic import BaseModel
import anthropic
import os
import json
from dotenv import load_dotenv
load_dotenv("/Users/shravan/Desktop/Meeting-Intelligence/.env")
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

router = APIRouter()

class AnalyzeRequest(BaseModel):
    transcript: str

@router.put("/{meeting_id}/review")
def submit_review(meeting_id: str):
    return {"message": f"Review submitted for meeting {meeting_id}"}

@router.post("/analyze")
def analyze_transcript(req: AnalyzeRequest):
    try:
        if not req.transcript.strip():
             return {
                "summary": "No transcript provided.",
                "action_items": [],
                "speakers": []
             }

        prompt = f"""You are a legal AI assistant. Examine the following transcript and extract:
1. Executive Summary (2-3 sentences)
2. Action Items (list 1-3 tasks and assignees)
3. Transcript snippet formatted correctly with speaker names

Transcript:
{req.transcript}

Return ONLY valid JSON with this exact schema:
{{
  "summary": "Client reviewed the merger...",
  "action_items": [
     {{"task": "Revise section 4", "assignee": "John Doe"}}
  ],
  "speakers": [
     {{"initials": "JD", "name": "John Doe", "color": "blue", "time": "00:15", "text": "So regarding Section 4..."}}
  ]
}}"""
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        text = response.content[0].text.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.startswith('```'):
            text = text[3:]
        if text.endswith('```'):
            text = text[:-3]
        
        return json.loads(text.strip())
    except Exception as e:
        print('Error:', e)
        return {
            "summary": "Error processing: " + str(e),
            "action_items": [],
            "speakers": []
        }

class AskRequest(BaseModel):
    transcript: str
    question: str

@router.post("/ask")
def ask_question(req: AskRequest):
    try:
        prompt = f"""You are a helpful legal AI assistant. Answer the user's question based strictly on the provided transcript.
If the answer is not in the transcript, say so politely.

Transcript:
{req.transcript}

Question:
{req.question}
"""
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=500,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        return {"answer": response.content[0].text.strip()}
    except Exception as e:
        print('Error:', e)
        return {"answer": "Error processing request."}
