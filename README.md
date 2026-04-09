# Legal Buddy - Meeting Intelligence Platform

## Overview
Legal Buddy is a Meeting Intelligence platform designed explicitly for legal teams. It dispatches an AI-driven bot (via Recall.ai) into Google Meet, Zoom, or Microsoft Teams to record the meeting, extract the transcript, and immediately formulate Executive Summaries, Action Items, and accurately attributed raw transcripts using Claude 3.5 Haiku.

## Key Features

### 1. Bot Dispatch System
Users can click "Log New Meeting" on the frontend Dashboard to deploy an AI bot into an active video call. By linking the Meeting URL, the Recall.ai bot immediately joins to securely begin transcription.
- **Zoom Integration**: The Recall bot automatically handles Zoom-specific requirements, including pushing the `"request_recording_permission": True` payload to safely bypass recording consent prompts.

### 2. Dashboard & Client Matters Management
The platform offers full CRUD capabilities for both Meetings and **Client Matters**:
- **Dynamic Matters Dashboard**: Fully connected to the database to manage specific legal cases or client profiles.
- **Matters Workspaces**: Users can create new matters, view detailed matter pages (`/matters/[id]`), and see associated meetings.
- **Bulk Deletion & Safe Orphaning**: Safely delete multiple matters at once. When a Matter is deleted, its associated meetings are safely orphaned (`matter_id` set to null) instead of being cascade-deleted.
- **Professional Timestamps**: Meetings missing explicit titles automatically fall back to clean localized ET format timestamps.

### 3. Intelligent Real-time Transcript
The platform captures the raw meeting transcription from AWS Transcribe (or Recall's default providers). Once the meeting ends, it invokes **Anthropic's Claude** to:
- Identify speaker names over `[Unknown]` placeholders from the participants' real connection data.
- Formulate a 2-3 sentence Legal Executive Summary.
- Extract precise Action Items (dynamically scaled up to 6 detailed tasks with assignees).
- **Caching Engine**: Processed summaries, action items, and transcripts are locally cached via JSON to prevent unnecessary, repeated Anthropic AI tokens consumption upon re-viewing a meeting.

### 4. Review Workspace & Automation
Users can review meetings via the `Review Queue`. The review UI incorporates powerful automated workflows:
- **Follow-Up Email Generation**: Automatically generates a clean, professional email summarizing the discussion and assigned tasks (stripping off emojis and em dashes). Provides one-click deep links to **Outlook** to instantly compose the draft.
- **Smart Action Items**: Action items dynamically detect intent. If an item involves scheduling, a "Schedule Google Meet" button appears (pre-populated with 45-min blocks and attendees). If it involves emailing, a "Send Email" Outlook deep link appears natively under the task.
- **Interactive AI Chatbot**: Chat directly with your transcript! The AI reads the transcript, summary, and action items to answer questions. **It can also generate new Action Items on the fly**: telling the chat to "schedule a meeting with John" will automatically append a new scheduling Action Item to your UI instantly.
- **Meeting Controls**: Command your bot to end the session early, discard corrupted meetings, or "Approve to Matter" to finalize the transcript and attach it to the case.

## Architecture
- **Frontend**: Next.js 15, App Router, Tailwind CSS, Lucide Icons, Shadcn UI layouts.
- **Backend**: FastAPI & Python 3.12 
- **Database**: SQLite (via SQLAlchemy)
- **AI Models**: 
  - Sub-processing/Transcription: Recall.ai + AWS Transcribe
  - Legal extraction, formatting, and chatbots: Anthropic (Claude 3.5 Haiku)

## Daily Startup / Running the Application

To start the application in the morning, you need two separate terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```