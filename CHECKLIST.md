# Meeting Intelligence Product Checklist

## Core Capabilities
- [x] **Real-time transcription:** Joins both video and in-person meetings and transcribes the conversation in real time. (Implemented via Recall.ai)
- [x] **Extraction:** Automatically extracts all instructions, commitments, decisions, and action items from the meeting.
- [ ] **Billable time identification:** Identifies billable time during the meeting and begins logging entries in the background.
- [ ] **Post-meeting drafting:** Uses GenAI to draft client follow-up emails, internal strategy memos, and partner briefing notes from the meeting content.

## Post-Meeting Execution (within 2 minutes of call ending)
- [ ] Generates a structured action summary with all commitments
- [ ] Drafts the client follow-up email, ready for one-click partner approval
- [ ] Creates and assigns tasks to relevant fee earners in the matter workspace
- [ ] Logs billable time against the correct matter
- [ ] Schedules the next client touchpoint in the firm's calendar
- [ ] Updates the matter dashboard with latest status

---

## Current App Features Built
- **Transcript View & Analysis**: A split-pane UI that displays the meeting transcript alongside AI features.
- **Metadata Extraction**: The backend automatically extracts the meeting's `title`, `date`, and `status`.
- **Interactive AI Chat**: A chat interface that lets you ask questions about the transcript.
- **Participant Mentions**: Clickable tags for speakers that let you easily mention them in the AI chat.
- **Resizable UI**: A functional workspace with adjustable panels for the transcript, evidence, and chat.
