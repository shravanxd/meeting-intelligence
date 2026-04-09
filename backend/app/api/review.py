from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..core.dependencies import get_db
from ..models.models import Meeting
from ..services.recall_service import RecallService
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

@router.get("/{meeting_id}")
def get_meeting_review(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")

    transcript = "No transcript available yet. Ensure the meeting was recorded."
    if meeting.recall_bot_id:
        recall = RecallService()
        bot_transcript = recall.get_bot_transcript(meeting.recall_bot_id)
        if bot_transcript:
            transcript = bot_transcript

    # If it's actually empty or basically empty, we avoid anthropic cost
    if not transcript.strip() or "No transcript" in transcript:
        return {
            "title": meeting.title,
            "date": meeting.created_at.strftime("%B %d, %Y, %I:%M %p"),
            "status": "Awaiting Data",
            "summary": "No transcript available yet. If the meeting was just recorded, it may take a minute to process.",
            "action_items": [],
            "speakers": [],
            "transcript_text": transcript
        }

    # Check for a cached response on disk so we don't regenerate every view
    cache_dir = "/Users/shravan/Desktop/Meeting-Intelligence/data/reviews"
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, f"{meeting_id}.json")
    
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                cached_data = json.load(f)
                # Keep real transcript up to date just in case
                cached_data["transcript_text"] = transcript
                return cached_data
        except Exception as e:
            print("Failed to read cache:", e)

    # Use anthropic to summarize
    prompt = f"""You are a legal AI assistant. Examine the following transcript and extract:
1. Executive Summary (2-3 sentences)
2. Action Items (list 1-3 tasks and assignees)
3. A full transcript properly mapped with speaker names. Infer names instead of [Unknown] based on context or introductions. Include the whole transcript chronologically.

Meeting Title: {meeting.title}
Transcript:
{transcript}

Return ONLY valid JSON with this exact schema:
{{
  "title": "{meeting.title}",
  "date": "{meeting.created_at.strftime("%B %d, %Y, %I:%M %p")}",
  "status": "Review Ready",
  "summary": "Client reviewed the merger...",
  "action_items": [
     {{"task": "Revise section 4", "assignee": "John Doe"}}
  ],
  "speakers": [
     {{"initials": "JD", "name": "John Doe", "color": "blue", "time": "00:15", "text": "So regarding Section 4..."}}
  ],
  "transcript_text": "The full exact text from transcript"
}}"""
    try:
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}]
        )
        
        text = response.content[0].text.strip()
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx+1]
        
        parsed = json.loads(text)
        parsed["transcript_text"] = transcript # Override with full real text
        
        # Save to cache so subsequent views don't regenerate
        try:
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(parsed, f, indent=2)
        except Exception as e:
            print("Failed to save cache:", e)
            
        return parsed
    except Exception as e:
        print('Error:', e)
        return {
            "title": meeting.title,
            "date": meeting.created_at.strftime("%B %d, %Y, %I:%M %p"),
            "status": "Error",
            "summary": "Error processing transcript: " + str(e),
            "action_items": [],
            "speakers": [],
            "transcript_text": transcript
        }

@router.put("/{meeting_id}/review")
def submit_review(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting:
        meeting.status = "Approved"
        db.commit()
    return {"message": f"Review submitted for meeting {meeting_id}"}

@router.delete("/{meeting_id}")
def discard_review(meeting_id: str, db: Session = Depends(get_db)):
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if meeting:
        db.delete(meeting)
        db.commit()
    return {"message": f"Review discarded and meeting deleted"}

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
2. Action Items (list as many tasks as discussed, max 6, and assignees. If scheduling a meeting or sending an email is discussed, ensure it is added to action_itemssed, max 6, and assignees. If scheduling a meeting or sending an email is discussed, ensure it is added to action_items)
3. A full transcript properly mapped with speaker names. Infer names instead of [Unknown] based on context or introductions. Include the whole transcript chronologically.

Transcript:
{req.transcript}

Return ONLY valid JSON with this exact schema:
{{
  "title": "Meeting Title (e.g. Acme Corp Merger Strategy)",
  "date": "Meeting Date / Time (e.g. April 3, 2026, 10:00 AM)",
  "status": "Needs Review or Approved",
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
            max_tokens=4000,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        text = response.content[0].text.strip()
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1:
            text = text[start_idx:end_idx+1]
        
        return json.loads(text)
    except Exception as e:
        print('Error:', e)
        return {
            "summary": "Error processing: " + str(e),
            "action_items": [],
            "speakers": []
        }

class AskRequest(BaseModel):
    transcript: str
    summary: str = ""
    action_items: str = ""
    question: str

@router.post("/ask")
def ask_question(req: AskRequest):
    try:
        prompt = f"""You are 'Legal Buddy', an autonomous AI agent for legal teams, not just a passive chatbot. Answer the user's question based on the provided transcript, summary, and action items. 
CRITICAL: You have the power to take actions. If the user commands or requests you to create an action item, schedule a meeting, send an email, or do any task (even if it's not explicitly in the transcript), you MUST fulfill their request by adding that task to the `added_action_items` list. Act as an assistant executing their commands.

Return ONLY valid JSON with this exact schema:
{{
  "answer": "Your human-readable response to the user.",
  "added_action_items": [
     {{"task": "Schedule meeting with X on Date", "assignee": "User or mentioned person"}}
  ]
}}

Summary:
{req.summary}

Action Items:
{req.action_items}

Transcript:
{req.transcript}

User Command/Question:
{req.question}
"""
        response = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=600,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        reply = response.content[0].text.strip()
        start = reply.find('{')
        end = reply.rfind('}')
        if start != -1 and end != -1:
            reply = reply[start:end+1]
        
        parsed = __import__('json').loads(reply)
        return {
            "answer": parsed.get("answer", reply),
            "added_action_items": parsed.get("added_action_items", [])
        }
    except Exception as e:
        print('Error:', e)
        return {"answer": "Error processing request.", "added_action_items": []}
