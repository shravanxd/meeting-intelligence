# Legal Buddy - Meeting Intelligence Platform

## Overview
Legal Buddy is a Meeting Intelligence platform designed explicitly for legal teams. It dispatches an AI-driven bot (via Recall.ai) into Google Meet, Zoom, or Microsoft Teams to record the meeting, extract the transcript, and immediately formulate Executive Summaries, Action Items, and accurately attributed raw transcripts using Claude 3.5 Haiku.

## Key Features

### 1. Bot Dispatch system
Users can click "Log New Meeting" on the frontend Dashboard to deploy an AI bot into an active video call. By linking the Meeting URL, the Recall.ai bot immediately joins to securely begin transcription.

### 2. Dashboard & Meeting Management
The `Meetings` dashboard acts as a central hub connecting the UI to the database:
- **Dynamic Database Listing**: All recorded and processed meetings are automatically fetched and presented.
- **Bulk Deletion**: Users can easily delete irrelevant meetings via a multi-select checkbox UI, which properly handles ending active bot sessions and removing DB entries safely.
- **Professional Timestamps**: Meetings missing explicit titles automatically fall back to clean localized ET format timestamps.

### 3. Intelligent Real-time Transcript
The platform captures the raw meeting transcription from AWS Transcribe (or Recall's default providers). Once the meeting ends, it invokes **Anthropic's Claude** to:
- Identify speaker names over `[Unknown]` placeholders from the participants' real connection data, isolating individual voices precisely.
- Formulate a 2-3 sentence Legal Executive Summary.
- Extract precise Action Items.
- **Caching Engine**: Processed summaries, action items, and transcripts are locally cached via JSON to prevent unnecessary, repeated Anthropic AI tokens consumption upon re-viewing a meeting.

### 4. Review Workspace
Users can review meetings via the `Review Queue`. The review UI incorporates:
- **Google Calendar Sync**: Action items dealing with scheduling dynamically display a "Schedule Google Meet" button, pre-populating a 45-minute event block, attendee email formats, and comprehensive legal context directly from the meeting summary.
- **Chatbot**: You can chat directly with your transcript! The Chatbot reads your transcripts, summary, and action items to answer distinct questions.
- **End Session**: Command your bot to immediately exit the active call instead of waiting for the host to disconnect.
- **Discard**: Discard a corrupted/irrelevant meeting directly from the database to clear out the queue.
- **Approve to Matter**: Finalize the transcript review and attach it safely to the matter.

## Architecture
- **Frontend**: Next.js 15, App Router, Tailwind CSS, Lucide Icons, Shadcn UI layouts.
- **Backend**: FastAPI & Python 3.12 
- **Database**: SQLite (via SQLAlchemy)
- **AI Models**: 
  - Sub-processing/Transcription: Recall.ai + AWS Transcribe
  - Legal extraction & formatting: Anthropic (Claude 3.5 Haiku)

## Running the Application
**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
**Frontend:**
```bash
cd frontend
npm run dev
```